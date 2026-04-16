import asyncio
import json
import os
import re

import google.generativeai as genai

from prompts.tarot import SYSTEM_PROMPT, build_reading_prompt

GEMINI_TIMEOUT = 10  # seconds


def _init_client() -> genai.GenerativeModel:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        model_name="gemini-2.5-flash-preview-04-17",
        system_instruction=SYSTEM_PROMPT,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.85,
        ),
    )


def _parse_json(text: str) -> dict:
    """Extract JSON from model response, tolerating markdown code fences."""
    # Strip markdown fences if present
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    return json.loads(cleaned)


async def get_reading(cards: list[dict]) -> dict:
    """Call Gemini for a tarot reading. Raises on timeout or API error."""
    model = _init_client()
    prompt = build_reading_prompt(cards)

    loop = asyncio.get_event_loop()

    def _sync_call():
        response = model.generate_content(prompt)
        return response.text

    text = await asyncio.wait_for(
        loop.run_in_executor(None, _sync_call),
        timeout=GEMINI_TIMEOUT,
    )
    return _parse_json(text)
