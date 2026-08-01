from app.schemas.parser import ParsedResume

from app.ai.context.formatter import (
    format_heading,
    format_list,
    format_value,
)


def build_resume_rewrite_context(
    resume: ParsedResume,
) -> str:

    context = format_heading(
        "Resume Rewrite Context"
    )

    context += format_value(
        "Current Professional Summary",
        resume.summary,
    )

    context += format_list(
        "Skills",
        resume.skills,
    )

    context += format_list(
        "Experience",
        resume.experience,
    )

    context += format_heading(
        "Projects"
    )

    for project in resume.project_details:

        context += format_value(
            "Project Title",
            project.title,
        )

        context += format_list(
            "Project Descriptions",
            project.descriptions,
        )

    context += format_list(
        "Education",
        resume.education,
    )

    context += format_list(
        "Certifications",
        resume.certifications,
    )

    return context