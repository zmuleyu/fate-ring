import json
import os
import re

import anthropic

from prompts.tarot import SYSTEM_PROMPT, build_reading_prompt

CLAUDE_MODEL = "claude-haiku-4-5-20251001"
CLAUDE_TIMEOUT = 20  # seconds (fallback, so we allow more time)


def _parse_json(text: str) -> dict:
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    return json.loads(cleaned)


async def get_reading(cards: list[dict]) -> dict:
    """Call Claude as fallback for a tarot reading."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not set")

    client = anthropic.AsyncAnthropic(api_key=api_key)
    prompt = build_reading_prompt(cards)

    message = await client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
        timeout=CLAUDE_TIMEOUT,
    )
    text = message.content[0].text
    return _parse_json(text)
