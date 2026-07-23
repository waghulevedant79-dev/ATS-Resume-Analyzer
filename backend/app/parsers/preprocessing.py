import re


def preprocess_text(raw_text: str) -> str:
    """
    Clean extracted resume text.
    """

    # Normalize line endings
    text = raw_text.replace("\r\n", "\n")

    # Remove trailing and leading spaces from each line
    lines = [line.strip() for line in text.split("\n")]

    # Join lines again
    text = "\n".join(lines)

    # Collapse multiple blank lines into a maximum of two
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Collapse multiple spaces into one
    text = re.sub(r"[ \t]+", " ", text)

    return text.strip()