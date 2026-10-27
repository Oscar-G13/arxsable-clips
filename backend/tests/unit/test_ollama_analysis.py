import json
from types import SimpleNamespace

import httpx
from openai import AsyncOpenAI
from pydantic_ai import Agent, NativeOutput
from pydantic_ai.providers.ollama import OllamaProvider

from src import ai


async def test_ollama_native_schema_request_uses_bounded_low_reasoning(monkeypatch):
    captured = []
    analysis = ai.TranscriptAnalysis(
        most_relevant_segments=[
            ai.TranscriptSegment(
                start_time="00:00",
                end_time="00:30",
                text="A complete explanation with a practical takeaway.",
            )
        ],
        summary="Practical advice",
        key_topics=["advice"],
    )

    def handler(request):
        assert request.url.host == "ollama.test"
        captured.append(json.loads(request.content))
        return httpx.Response(
            200,
            json={
                "id": "test-completion",
                "object": "chat.completion",
                "created": 1,
                "model": "gpt-oss:20b",
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": analysis.model_dump_json(),
                        },
                        "finish_reason": "stop",
                    }
                ],
                "usage": {
                    "prompt_tokens": 100,
                    "completion_tokens": 100,
                    "total_tokens": 200,
                },
            },
        )

    runtime_config = SimpleNamespace(
        llm="ollama:gpt-oss:20b",
        ollama_api_key="ollama",
        resolve_ollama_base_url=lambda: "https://ollama.test/v1",
    )
    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        sdk = AsyncOpenAI(
            api_key="ollama",
            base_url="https://ollama.test/v1",
            http_client=client,
        )
        real_provider = OllamaProvider
        monkeypatch.setattr(
            ai,
            "OllamaProvider",
            type(
                "TestProvider",
                (),
                {
                    "model_profile": staticmethod(real_provider.model_profile),
                    "__new__": lambda cls, **kwargs: real_provider(
                        openai_client=sdk
                    ),
                },
            ),
        )
        model = ai._build_transcript_model(runtime_config)
        agent = Agent(
            model,
            output_type=NativeOutput(ai.TranscriptAnalysis, strict=True),
        )
        result = await agent.run("Select a clip from the transcript.")

    assert result.output == analysis
    body = captured[0]
    assert body["model"] == "gpt-oss:20b"
    assert body["response_format"]["type"] == "json_schema"
    # Ollama enforces the supplied schema but its OpenAI compatibility layer
    # does not implement the OpenAI-only `strict` request flag.
    assert "strict" not in body["response_format"]["json_schema"]
    assert "tools" not in body
    assert body["max_completion_tokens"] == 4096
    assert body["reasoning_effort"] == "low"
    assert body["temperature"] == 0
