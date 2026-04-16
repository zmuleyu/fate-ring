SYSTEM_PROMPT = """你是一位精通塔罗牌的神秘占卜师，拥有深厚的象征学与心理学知识。
你的解读风格：诗意而深刻、温柔而直接，富有东方美学意境。
语言：中文，约200字/张牌。"""


def build_reading_prompt(cards: list[dict]) -> str:
    """Build the user prompt for a three-card tarot reading.

    Args:
        cards: list of dicts with keys: name, name_cn, position, reversed
    """
    position_labels = {"past": "过去", "present": "现在", "future": "未来"}

    card_lines = []
    for card in cards:
        orientation = "逆位" if card["reversed"] else "正位"
        pos_label = position_labels.get(card["position"], card["position"])
        card_lines.append(
            f"- {pos_label}之牌：{card['name_cn']}（{card['name']}）[{orientation}]"
        )

    cards_desc = "\n".join(card_lines)

    return f"""请为以下三张塔罗牌给出完整解读：

{cards_desc}

请严格按照以下 JSON 格式返回，不要有任何其他文字：
{{
  "past": "对「过去」之牌的解读（约200字）",
  "present": "对「现在」之牌的解读（约200字）",
  "future": "对「未来」之牌的解读（约200字）",
  "overall": "三牌整体综合解读（约150字，点出三牌之间的命运脉络）"
}}"""
