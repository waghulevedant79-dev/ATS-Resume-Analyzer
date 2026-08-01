from app.schemas.parser import ParsedResume

from .formatter import (
    format_heading,
    format_list,
    format_value,
)


def build_summary_context(
    resume: ParsedResume,
) -> str:

    context = format_heading(
        "Candidate Resume Information"
    )

    context += format_value(
        "Current Summary",
        resume.summary
    )

    context += format_list(
        "Skills",
        resume.skills
    )

    context += format_list(
        "Experience",
        resume.experience
    )

    context += format_list(
        "Responsibilities",
        resume.responsibilities
    )

    context += format_list(
        "Projects",
        resume.projects
    )

    context += format_list(
        "Education",
        resume.education
    )

    context += format_list(
        "Certifications",
        resume.certifications
    )

    return context