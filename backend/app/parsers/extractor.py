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
from app.schemas.parser import ParsedProject


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


def extract_linkedin(
    text: str,
    hyperlinks: list[str] | None = None,
) -> str | None:
    """
    Extract LinkedIn profile URL.
    """

    pattern = (
        r"https?://(?:[a-z]{2,3}\.)?"
        r"(?:www\.)?linkedin\.com/in/[^\s]+"
    )

    match = re.search(pattern, text)

    if match:
        return match.group()

    if hyperlinks:
        for link in hyperlinks:
            if "linkedin.com/in/" in link.lower():
                return link

    return None


def extract_github(
    text: str,
    hyperlinks: list[str] | None = None,
) -> str | None:
    """
    Extract GitHub profile URL.
    """

    pattern = r"https?://(?:www\.)?github\.com/[^\s]+"

    match = re.search(pattern, text)

    if match:
        return match.group()

    if hyperlinks:
        for link in hyperlinks:
            if "github.com/" in link.lower():
                return link

    return None


def extract_portfolio(
    text: str,
    hyperlinks: list[str] | None = None,
) -> str | None:
    """
    Extract portfolio or personal website URL.
    """

    # Optional: Detect visible URLs first (if you want)
    pattern = r"https?://[^\s]+"

    matches = re.findall(pattern, text)

    ignored_domains = (
        "linkedin.com",
        "github.com",
        "leetcode.com",
        "hackerrank.com",
        "codechef.com",
        "codeforces.com",
        "geeksforgeeks.org",
    )

    # First check visible URLs
    for url in matches:
        if not any(domain in url.lower() for domain in ignored_domains):
            return url

    # Then check embedded hyperlinks
    if hyperlinks:
        for url in hyperlinks:
            if not any(domain in url.lower() for domain in ignored_domains):
                return url

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
    # print("\n========== EXTRACTED SECTIONS ==========")
    # pprint(sections)
    # print("=======================================\n")
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


def extract_responsibilities(
    responsibilities_section: list[str],
) -> list[str]:

    responsibilities = []

    date_pattern = re.compile(
        r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
        r".*?\d{4}"
    )

    for line in responsibilities_section:

        line = line.strip()

        if not line:
            continue

        # Skip dates
        if date_pattern.search(line):
            continue

        # Remove bullet
        for bullet in BULLET_PREFIXES:

            if line.startswith(bullet):

                line = line[len(bullet):].strip()

                break

        # Keep only responsibility-like lines
        if line.startswith("-"):

            line = line[1:].strip()

        if len(line.split()) < 5:
            continue

        responsibilities.append(line)

    return responsibilities


def extract_projects(
    project_section: list[str],
) -> list[str]:

    projects = []

    for line in project_section:

        line = line.strip()

        if not line:
            continue

        # Keep only bullet point lines
        if not line.startswith(BULLET_PREFIXES):
            continue

        # Remove bullet character
        line = line.lstrip("•-– ").strip()

        if line:
            projects.append(line)

    return projects


def extract_project_details(
    project_section: list[str],
) -> list[ParsedProject]:

    project_details = []

    current_title = None
    current_descriptions = []

    for raw_line in project_section:

        line = raw_line.strip()

        if not line:
            continue

        # -----------------------------
        # Bullet line
        # -----------------------------
        if line.startswith(BULLET_PREFIXES):

            description = line.lstrip(
                "•-– "
            ).strip()

            if description:
                current_descriptions.append(
                    description
                )

            continue

        # -----------------------------
        # Wrapped bullet continuation
        # -----------------------------
        if (
            current_descriptions
            and not current_descriptions[-1].endswith(
                (".", "!", "?")
            )
        ):
            current_descriptions[-1] += (
                " " + line
            )

            continue

        # -----------------------------
        # Otherwise this is a new title
        # -----------------------------
        if current_title is not None:

            project_details.append(
                ParsedProject(
                    title=current_title,
                    descriptions=current_descriptions,
                )
            )

        current_title = line
        current_descriptions = []

    # -----------------------------
    # Save final project
    # -----------------------------
    if current_title is not None:

        project_details.append(
            ParsedProject(
                title=current_title,
                descriptions=current_descriptions,
            )
        )

    return project_details


def extract_experience(
    experience_section: list[str],
) -> list[str]:

    experience = []

    for line in experience_section:

        line = line.strip()

        if not line:
            continue

        # Remove bullet prefixes
        for bullet in BULLET_PREFIXES:

            if line.startswith(bullet):

                line = line[len(bullet):].strip()

                break

        # Remove leading dash if present
        if line.startswith("-"):

            line = line[1:].strip()

        experience.append(line)

    return experience