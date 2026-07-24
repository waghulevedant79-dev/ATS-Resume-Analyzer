import re


def normalize_heading(text: str) -> str:
    """
    Normalize resume section headings for reliable matching.
    """

    text = text.strip().lower()

    text = re.sub(r"[:\-]+$", "", text)

    return text