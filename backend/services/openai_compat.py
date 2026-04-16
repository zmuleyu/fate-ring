"""OpenAI-compatible fallback (SiliconFlow / any OpenAI-API provider)."""
import json
import os
import re

import httpx

from prompts.tarot import SYSTEM_PROMPT, build_reading_prompt

TIMEOUT = 90  # SiliconFlow Chinese JSON responses can take 30-40s


def _parse_json(text: str) -> dict:
    # Strip <think>...</think> blocks (Qwen reasoning traces)
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
    # Strip markdown fences
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    data = json.loads(cleaned)

    # Normalize field name aliases the model sometimes uses
    aliases = {
        "past":    ["past", "过去", "past_reading", "card1", "card_1"],
        "present": ["present", "现在", "present_reading", "read", "reading", "card2", "card_2"],
        "future":  ["future", "未来", "future_reading", "card3", "card_3"],
        "overall": ["overall", "整体", "summary", "conclusion", "综合", "overall_reading"],
    }
    result: dict = {}
    for canonical, candidates in aliases.items():
        for key in candidates:
            if key in data:
                result[canonical] = data[key]
                break
        if canonical not in result:
            result[canonical] = ""

    return result


async def get_reading(cards: list[dict]) -> dict:
    api_key = os.environ.get("LLM_API_KEY")
    base_url = os.environ.get("LLM_BASE_URL", "https://api.siliconflow.cn/v1")
    # Default to a fast instruct model; override via LLM_MODEL env var
    model = os.environ.get("LLM_MODEL_FAST", os.environ.get("LLM_MODEL", "Qwen/Qwen2.5-7B-Instruct"))

    if not api_key:
        raise RuntimeError("LLM_API_KEY not set")

    prompt = build_reading_prompt(cards)

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.85,
        "max_tokens": 1000,  # 4 fields × ~200 chars; 2048 was too slow
        "response_format": {"type": "json_object"},
    }

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(TIMEOUT)) as client:
            resp = await client.post(
                f"{base_url}/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json=payload,
            )
            resp.raise_for_status()
            text = resp.json()["choices"][0]["message"]["content"]
            return _parse_json(text)
    except httpx.TimeoutException:
        raise RuntimeError(f"SiliconFlow request timed out after {TIMEOUT}s (model={model})")
    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"SiliconFlow HTTP {e.response.status_code}: {e.response.text[:200]}")
