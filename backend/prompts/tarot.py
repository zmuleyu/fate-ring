SYSTEM_PROMPT = """你是一位精通塔罗牌的神秘占卜师，拥有深厚的象征学与心理学知识。
你的解读风格：诗意而深刻、温柔而直接，富有东方美学意境。
语言：中文，每张牌约60字，整体约80字，力求简洁有力。"""


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

    return f"""请为以下三张塔罗牌给出解读：

{cards_desc}

必须严格返回以下 JSON，字段名必须完全一致，每个值约60字中文，不要多余文字：
{{"past": "过去牌解读", "present": "现在牌解读", "future": "未来牌解读", "overall": "三牌综合解读约80字"}}"""
