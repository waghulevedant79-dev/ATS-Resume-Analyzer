from app.schemas.parser import ParsedResume
from app.schemas.matching import MatchResult

from .formatter import (
    format_heading,
    format_list,
)


def build_keyword_context(
    resume: ParsedResume,
    match: MatchResult,
) -> str:

    context = format_heading(
        "Missing Keyword Analysis"
    )

    context += format_list(
        "Missing Skills",
        match.skills.missing_skills,
    )

    context += format_list(
        "Candidate Skills",
        resume.skills,
    )

    context += format_list(
        "Candidate Projects",
        resume.projects,
    )

    context += format_list(
        "Candidate Experience",
        resume.experience,
    )

    return context