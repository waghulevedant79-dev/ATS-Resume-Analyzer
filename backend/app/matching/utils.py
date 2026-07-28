import re
from app.schemas.matching import (
    SkillMatchResult,
    ExperienceMatchResult,
    EducationMatchResult,
    ResponsibilitiesMatchResult,
    ConfidenceResult
)
from app.job_description.constants import (
    SKILLS_WEIGHT,
    EDUCATION_WEIGHT,
    EXPERIENCE_WEIGHT,
    RESPONSIBILITIES_WEIGHT,
)
from app.matching.constants import DEGREE_LEVELS, MONTHS, STOP_WORDS, BRANCH_ALIASES
from datetime import datetime


"""Normalize text before comparison."""
import re

def normalize_text(text: str) -> str:

    text = text.lower().strip()

    # Remove leading bullets
    text = re.sub(r"^[-•*]+\s*", "", text)

    return text


"""Extract experience duration from text and return it in years."""
def extract_years(text: str) -> float | None:

    normalized = text.lower()

    # Explicit years
    year_match = re.search(
        r"(\d+(?:\.\d+)?)\+?\s*(?:year|years|yr|yrs)",
        normalized,
    )

    if year_match:
        return float(year_match.group(1))

    # Explicit months
    month_match = re.search(
        r"(\d+(?:\.\d+)?)\+?\s*(?:month|months|mo|mos)",
        normalized,
    )

    if month_match:
        return float(month_match.group(1)) / 12

    # Date range (e.g. Feb 2024 – Present)
    date_match = re.search(
        r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)"
        r"\s+(\d{4})\s*[–-]\s*"
        r"(present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)"
        r"(?:\s+(\d{4}))?",
        normalized,
    )

    if not date_match:
        return None

    start_month = MONTHS[date_match.group(1)]
    start_year = int(date_match.group(2))

    end_token = date_match.group(3)

    if end_token in ("present", "current"):
        today = datetime.today()
        end_month = today.month
        end_year = today.year
    else:
        end_month = MONTHS[end_token]
        end_year = int(date_match.group(4))

    total_months = (
        (end_year - start_year) * 12
        + (end_month - start_month)
    )

    return round(total_months / 12, 1)


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

    return {
    word
    for word in words
    if word not in STOP_WORDS
}


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


"""Calculate total years of experience from all experience lines."""
def extract_total_experience(
    experience_lines: list[str],
) -> float:

    total_years = 0.0

    for line in experience_lines:

        years = extract_years(line)

        if years is not None:
            total_years += years

    return round(total_years, 1)


"""Calculate the confidance of resume-job match score."""
def calculate_confidence(
    skills: SkillMatchResult,
    experience: ExperienceMatchResult,
    education: EducationMatchResult,
    responsibilities: ResponsibilitiesMatchResult,
) -> ConfidenceResult:
    
    experience_score = (
        100.0 if experience.matched else 0.0
    )

    education_score = (
        100.0 if education.matched else 0.0
    )
    
    scores = [
        skills.match_percentage,
        experience_score,
        education_score,
        responsibilities.match_percentage,
    ]

    confidence_score = (
        sum(scores) / len(scores)
    )
    
    if confidence_score >= 80:
        level = "High"

    elif confidence_score >= 60:
        level = "Medium"

    else:
        level = "Low"
        
    
    return ConfidenceResult(
        level=level,
        score=round(confidence_score, 2),
        )


"""Calculate branch matching."""
def extract_branch(text: str) -> str:

    normalized = normalize_text(text)

    for branch, aliases in BRANCH_ALIASES.items():

        for alias in aliases:

            if alias in normalized:
                return branch

    return ""


