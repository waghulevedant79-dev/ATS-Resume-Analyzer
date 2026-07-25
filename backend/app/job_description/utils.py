import re

def normalize_heading(text: str) -> str:
    """
    Normalize heading text for comparison.
    """

    text = text.strip().lower()

    text = re.sub(r"\s+", " ", text)

    return text