import re
from app.parsers.constants import SECTION_HEADINGS
from app.parsers.utils import normalize_heading
from app.parsers.constants import SKILL_CATEGORY_PREFIXES
from app.parsers.constants import (
    BULLET_PREFIXES,
    SKILL_CATEGORY_PREFIXES,
    SKILL_DELIMITERS,
    IGNORED_SKILL_VALUES,
)
from app.parsers.utils import (
    merge_wrapped_lines,
    clean_skill,
    normalize_heading,
)


def extract_email(text: str) -> str | None:
    """
    Extract email address from resume text.
    """

    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

    match = re.search(pattern, text)

    if match:
        return match.group()

    return None


def extract_phone(text: str) -> str | None:
    """
    Extract phone number from resume text.
    """

    pattern = r"(?:\+91[- ]?)?[6-9]\d{9}"

    match = re.search(pattern, text)

    if match:
        return match.group()

    return None


def extract_linkedin(text: str) -> str | None:
    """
    Extract LinkedIn profile URL.
    """

    pattern = r"https?://(?:[a-z]{2,3}\.)?(?:www\.)?linkedin\.com/in/[^\s]+"

    match = re.search(pattern, text)

    if match:
        return match.group()

    return None


def extract_github(text: str) -> str | None:
    """
    Extract GitHub profile URL.
    """

    pattern = r"https?://(?:www\.)?github\.com/[^\s]+"

    match = re.search(pattern, text)

    if match:
        return match.group()

    return None


def extract_sections(text: str) -> dict:
    sections = {
        "skills": [],
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": [],
        "summary": ""
    }

    current_section = None

    lines = text.split("\n")

    for line in lines:

        line = line.strip()

        if not line:
            continue
            
        normalized_line = normalize_heading(line)

        heading_found = False

        for section_name, headings in SECTION_HEADINGS.items():

            if normalized_line in headings:

                current_section = section_name

                heading_found = True

                break

        if heading_found:
            continue

        if current_section:

            if current_section == "summary":
                sections["summary"] += line + "\n"
            else:
                sections[current_section].append(line)

    return sections


def extract_name(text: str) -> str | None:
    """
    Extract candidate name using simple heuristics.
    """

    lines = [line.strip() for line in text.split("\n") if line.strip()]

    heading_names = {
        heading
        for headings in SECTION_HEADINGS.values()
        for heading in headings
    }

    for line in lines[:5]:

        normalized = normalize_heading(line)

        if "@" in line:
            continue

        if re.search(r"\d", line):
            continue

        if "http" in normalized:
            continue

        if normalized in heading_names:
            continue

        if len(line.split()) > 5:
            continue

        return line

    return None


def extract_skills(
    skills_section: list[str],
) -> list[str]:

    skills = []

    skills_section = merge_wrapped_lines(
        skills_section
    )

    for line in skills_section:

        line = line.strip()

        # Remove bullet
        for bullet in BULLET_PREFIXES:
            if line.startswith(bullet):
                line = line[len(bullet):].strip()
                break

        # Remove category prefix
        if ":" in line:

            prefix, remainder = line.split(
                ":",
                1,
            )

            if (
                normalize_heading(prefix)
                in SKILL_CATEGORY_PREFIXES
            ):
                line = remainder.strip()

        # Normalize delimiters
        for delimiter in SKILL_DELIMITERS:
            line = line.replace(
                delimiter,
                ",",
            )

        # Split into individual skills
        parts = line.split(",")

        for part in parts:

            skill = clean_skill(part)

            if (
                normalize_heading(skill)
                in IGNORED_SKILL_VALUES
            ):
                continue

            if skill:
                skills.append(skill)

    # Remove duplicates while preserving order
    seen = set()
    unique_skills = []

    for skill in skills:

        normalized = normalize_heading(skill)

        if normalized not in seen:

            seen.add(normalized)
            unique_skills.append(skill)

    return unique_skills

