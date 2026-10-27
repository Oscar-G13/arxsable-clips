import time
from concurrent.futures import ThreadPoolExecutor
from threading import Barrier
from types import SimpleNamespace

import pytest

from src.media import transcription
from src.workers import tasks


def test_concurrent_whisper_loads_share_one_model(monkeypatch):
    model_name = "test-small"
    barrier = Barrier(2)
    loaded_model = object()
    calls = []

    def load_model(requested_model):
        calls.append(requested_model)
        time.sleep(0.05)
        return loaded_model

    transcription._WHISPER_MODEL_CACHE.pop(model_name, None)
    monkeypatch.setattr(transcription, "_WHISPER_AVAILABLE", True)
    monkeypatch.setattr(
        transcription, "_whisper", SimpleNamespace(load_model=load_model)
    )

    def get_model():
        barrier.wait()
        return transcription._get_whisper_model(model_name)

    try:
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(lambda _: get_model(), range(2)))
    finally:
        transcription._WHISPER_MODEL_CACHE.pop(model_name, None)

    assert results == [loaded_model, loaded_model]
    assert calls == [model_name]


@pytest.mark.asyncio
async def test_worker_preloads_default_mode_whisper_model(monkeypatch):
    from src import config
    from src.media import transcription as transcription_module
    from src.utils import async_helpers

    class RuntimeConfig:
        transcription_provider = "whisper"
        default_processing_mode = "fast"

        @staticmethod
        def whisper_model_for_processing_mode(processing_mode):
            assert processing_mode == "fast"
            return "small"

    loaded = []

    async def run_inline(function, *args):
        return function(*args)

    monkeypatch.setattr(config, "Config", RuntimeConfig)
    monkeypatch.setattr(
        transcription_module,
        "_get_whisper_model",
        lambda model_name: loaded.append(model_name),
    )
    monkeypatch.setattr(async_helpers, "run_in_thread", run_inline)

    await tasks.preload_whisper_model({})

    assert loaded == ["small"]
