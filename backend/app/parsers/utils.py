import re
from app.parsers.constants import BULLET_PREFIXES


def normalize_heading(text: str) -> str:
    """
    Normalize text for consistent comparisons.
    """

    text = text.strip().lower()

    # Remove trailing ":" or "-"
    text = re.sub(
        r"[:\-]+$",
        "",
        text,
    )

    # Replace multiple spaces with a single space
    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text


def merge_wrapped_lines(
    lines: list[str],
) -> list[str]:

    merged = []

    for line in lines:

        line = line.strip()

        if not line:
            continue

        if line.startswith(("•", "-")):
            merged.append(line)

        elif merged:
            merged[-1] += " " + line

        else:
            merged.append(line)

    return merged


def clean_skill(skill: str) -> str:

    skill = skill.strip()

    skill = skill.strip(" .;")

    skill = re.sub(
        r"\s+",
        " ",
        skill,
    )

    return skill


def normalize_text(text: str) -> str:
    """
    Normalize text for comparisons.
    Used by the matching engine, not for displaying data.
    """

    text = text.lower()

    text = text.strip()

    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text


def clean_section_lines(
    lines: list[str],
    merge_wrapped: bool = True,
) -> list[str]:

    cleaned_lines = []

    if merge_wrapped:
        lines = merge_wrapped_lines(lines)

    for line in lines:

        line = line.strip()

        if not line:
            continue

        if line in BULLET_PREFIXES:
            continue

        cleaned_lines.append(line)

    return cleaned_lines