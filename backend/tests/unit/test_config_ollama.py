import pytest
from pathlib import Path

from src import config
from src.config import Config


def test_default_ollama_base_url_uses_localhost_outside_docker(monkeypatch):
    monkeypatch.setattr(config.os.path, "exists", lambda path: False)

    assert Config._default_ollama_base_url() == "http://localhost:11434/v1"


def test_default_ollama_base_url_uses_host_gateway_in_docker(monkeypatch):
    monkeypatch.setattr(config.os.path, "exists", lambda path: path == "/.dockerenv")

    assert Config._default_ollama_base_url() == "http://host.docker.internal:11434/v1"


def test_youtube_duration_limit_uses_active_subscription_plan(monkeypatch):
    monkeypatch.setenv("MAX_VIDEO_DURATION", "5400")
    monkeypatch.setenv("PRO_YOUTUBE_MAX_VIDEO_DURATION", "7200")
    monkeypatch.setenv("SCALE_YOUTUBE_MAX_VIDEO_DURATION", "10800")
    config = Config()

    assert config.max_youtube_video_duration_for_plan("free", "active") == 5400
    assert config.max_youtube_video_duration_for_plan("pro", "active") == 7200
    assert config.max_youtube_video_duration_for_plan("scale", "trialing") == 10800
    assert config.max_youtube_video_duration_for_plan("scale", "inactive") == 5400
    assert config.max_youtube_video_duration_for_plan("scale", "past_due", "stripe") == 10800
    assert config.max_youtube_video_duration_for_plan("scale", "past_due") == 5400
    assert config.max_youtube_video_duration_for_plan("scale", "unpaid", "stripe") == 5400


@pytest.mark.parametrize(
    "raw,expected",
    [
        (None, 30.0),
        ("", 30.0),
        ("60", 60.0),
        ("45.5", 45.5),
        ("0", 30.0),
        ("-5", 30.0),
        ("nope", 30.0),
        ("inf", 30.0),
        ("999", 180.0),
    ],
)
def test_youtube_preflight_timeout_default_and_override(monkeypatch, raw, expected):
    if raw is None:
        monkeypatch.delenv("YOUTUBE_PREFLIGHT_TIMEOUT_SECONDS", raising=False)
    else:
        monkeypatch.setenv("YOUTUBE_PREFLIGHT_TIMEOUT_SECONDS", raw)
    assert Config().youtube_preflight_timeout_seconds == expected


def test_hook_teaser_is_off_unless_requested(monkeypatch):
    monkeypatch.delenv("HOOK_FIRST_TEASER", raising=False)
    assert Config().hook_first_teaser is False
    monkeypatch.setenv("HOOK_FIRST_TEASER", "true")
    assert Config().hook_first_teaser is True


def test_whisper_accepts_documented_model_size_setting(monkeypatch):
    monkeypatch.delenv("WHISPER_QUALITY_MODEL_SIZE", raising=False)
    monkeypatch.delenv("WHISPER_MODEL", raising=False)
    monkeypatch.setenv("WHISPER_MODEL_SIZE", "tiny")
    assert Config().whisper_model == "tiny"
    monkeypatch.setenv("WHISPER_MODEL", "base")
    assert Config().whisper_model == "base"


def test_whisper_models_follow_processing_mode(monkeypatch):
    monkeypatch.setenv("WHISPER_FAST_MODEL_SIZE", "small")
    monkeypatch.setenv("WHISPER_QUALITY_MODEL_SIZE", "medium")

    runtime_config = Config()

    assert runtime_config.whisper_model_for_processing_mode("fast") == "small"
    assert runtime_config.whisper_model_for_processing_mode("balanced") == "medium"
    assert runtime_config.whisper_model_for_processing_mode("quality") == "medium"


def test_empty_quality_override_preserves_legacy_whisper_model(monkeypatch):
    monkeypatch.setenv("WHISPER_QUALITY_MODEL_SIZE", "")
    monkeypatch.setenv("WHISPER_MODEL_SIZE", "large")

    assert Config().whisper_model_for_processing_mode("quality") == "large"


def test_compose_does_not_mask_legacy_whisper_quality_setting():
    compose = (Path(__file__).resolve().parents[3] / "docker-compose.yml").read_text()

    assert compose.count(
        "WHISPER_QUALITY_MODEL_SIZE=${WHISPER_QUALITY_MODEL_SIZE:-}"
    ) == 2
    assert "WHISPER_QUALITY_MODEL_SIZE=${WHISPER_QUALITY_MODEL_SIZE:-medium}" not in compose
