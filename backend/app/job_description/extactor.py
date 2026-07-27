import re
from app.job_description.utils import normalize_heading, SECTION_HEADINGS
from pprint import pprint



def extract_job_title(text: str):
    """
    Extract the job title from a job description.
    """
    if not text:
        return None

    # Strategy 1: Look for "Job Title: ..."
    match = re.search(
        r"job\s*title\s*:\s*(.+)",
        text,
        flags=re.IGNORECASE
    )

    if match:
        return match.group(1).strip()


    # Strategy 2: Use the first non-empty line
    for line in text.splitlines():

        line = line.strip()

        if line:
            return line

    return None


def extract_sections(text: str) -> dict[str, list[str]]:

    sections = {
        key: []
        for key in SECTION_HEADINGS
    }

    current_section = None

    lines = text.splitlines()

    for line in lines:

        line = line.strip()

        if not line:
            continue

        normalized = normalize_heading(line)

        heading_found = False
        
        for section_name, headings in SECTION_HEADINGS.items():

            if normalized in headings:
                
                current_section = section_name
                heading_found = True
                break

        if not heading_found and current_section:
    
            sections[current_section].append(line)
            
    return sections


"""extracting required skills"""
def extract_required_skills(
    section: list[str],
) -> list[str]:

    return [
        line.strip()
        for line in section
        if line.strip()
    ]


"""extracting preferred skills"""
def extract_preferred_skills(
    section: list[str],
) -> list[str]:

    return [
        line.strip()
        for line in section
        if line.strip()
    ]


"""extracting education"""
def extract_education(
    section: list[str],
) -> list[str]:

    return [
        line.strip()
        for line in section
        if line.strip()
    ]


"""extracting experience"""
def extract_experience(
    section: list[str],
) -> list[str]:

    return [
        line.strip()
        for line in section
        if line.strip()
    ]


"""extracting responsibilities"""
def extract_responsibilities(
    section: list[str],
) -> list[str]:

    return [
        line.strip()
        for line in section
        if line.strip()
    ]


"""extracting tools"""
def extract_tools(
    section: list[str],
) -> list[str]:

    return [
        line.strip()
        for line in section
        if line.strip()
    ]