from pathlib import Path


def test_deploy_prewarms_ollama_through_configured_openai_base_url():
    script = (Path(__file__).resolve().parents[3] / "ops" / "deploy.sh").read_text()

    assert "compose exec -T worker .venv/bin/python" in script
    assert "timeout 600 compose" not in script
    assert "parsed.path.rstrip('/')" in script
    assert '"/api/generate"' not in script
    assert '"reasoning_effort": "low"' in script
    assert '"max_completion_tokens": 1' in script
    assert "urlopen(request, timeout=540)" in script
