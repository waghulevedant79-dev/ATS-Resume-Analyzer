import re
from app.parsers.constants import SECTION_HEADINGS
from app.parsers.utils import normalize_heading


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
        "summary": []
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