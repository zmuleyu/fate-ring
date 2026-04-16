import asyncio
import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services import gemini, claude, openai_compat

logger = logging.getLogger(__name__)
router = APIRouter()


class CardInput(BaseModel):
    name: str        # English name
    name_cn: str     # Chinese name
    position: str    # "past" | "present" | "future"
    reversed: bool


class ReadingRequest(BaseModel):
    cards: list[CardInput]


class ReadingResponse(BaseModel):
    past: str
    present: str
    future: str
    overall: str
    provider: str   # "gemini" | "claude" (for debugging)


@router.post("/reading", response_model=ReadingResponse)
async def create_reading(req: ReadingRequest):
    if len(req.cards) != 3:
        raise HTTPException(status_code=400, detail="Exactly 3 cards required")

    cards_data = [c.model_dump() for c in req.cards]

    # Try Gemini first
    try:
        result = await gemini.get_reading(cards_data)
        return ReadingResponse(**result, provider="gemini")
    except asyncio.TimeoutError:
        logger.warning("Gemini timed out, falling back to Claude")
    except Exception as exc:
        logger.warning("Gemini failed (%s), falling back to Claude", exc)

    # Fallback to Claude
    try:
        result = await claude.get_reading(cards_data)
        return ReadingResponse(**result, provider="claude")
    except Exception as exc:
        logger.warning("Claude also failed (%s), falling back to OpenAI-compat", exc)

    # Fallback to OpenAI-compatible (SiliconFlow etc.)
    try:
        result = await openai_compat.get_reading(cards_data)
        return ReadingResponse(**result, provider="openai_compat")
    except Exception as exc:
        logger.error("All AI providers failed: %s", exc)
        raise HTTPException(status_code=503, detail=f"All AI providers unavailable: {exc}")
