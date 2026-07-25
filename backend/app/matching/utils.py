import re
from app.schemas.matching import (
    SkillMatchResult,
    ExperienceMatchResult,
    EducationMatchResult,
    ResponsibilitiesMatchResult
)
from app.job_description.constants import (
    SKILLS_WEIGHT,
    EDUCATION_WEIGHT,
    EXPERIENCE_WEIGHT,
    RESPONSIBILITIES_WEIGHT
)
from app.matching.constants import DEGREE_LEVELS


"""Normalize text before comparison."""
def normalize_text(text: str) -> str:

    return text.strip().lower()


"""Extract experience duration from text and return it in years."""
def extract_years(text: str) -> float | None:

    normalized = text.lower()

    # Years
    year_match = re.search(
        r"(\d+(?:\.\d+)?)\+?\s*(?:year|years|yr|yrs)",
        normalized,
    )

    if year_match:
        return float(year_match.group(1))

    # Months
    month_match = re.search(
        r"(\d+(?:\.\d+)?)\+?\s*(?:month|months|mo|mos)",
        normalized,
    )

    if month_match:
        return float(month_match.group(1)) / 12

    return None

"""Extract degree in numbers from text."""
def extract_degree_level(text: str) -> int:

    normalized = normalize_text(text)

    for level in sorted(DEGREE_LEVELS.keys(), reverse=True):

        for alias in DEGREE_LEVELS[level]:

            if alias in normalized:
                return level

    return 0


"""Convert text into a normalized set of words."""
def tokenize_text(text: str) -> set[str]:

    normalized = normalize_text(text)

    words = re.findall(r"\b[a-z0-9]+\b", normalized)

    return set(words)


"""Calculate the final weighted resume-job match score."""
def calculate_overall_score(
    skills: SkillMatchResult,
    experience: ExperienceMatchResult,
    education: EducationMatchResult,
    responsibilities: ResponsibilitiesMatchResult,
) -> float:

    experience_score = (
        100.0
        if experience.matched
        else 0.0
    )

    education_score = (
        100.0
        if education.matched
        else 0.0
    )

    overall_score = (
        skills.match_percentage * SKILLS_WEIGHT
        + experience_score * EXPERIENCE_WEIGHT
        + education_score * EDUCATION_WEIGHT
        + responsibilities.match_percentage * RESPONSIBILITIES_WEIGHT
    )

    return round(overall_score, 2)


