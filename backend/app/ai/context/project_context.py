from app.schemas.parser import ParsedProject, ParsedResume

from app.ai.context.formatter import (
    format_heading,
    format_list,
    format_value
)


def build_project_context(
    project: ParsedProject,
    resume: ParsedResume,
) -> str:

    context = format_heading(
        "Selected Project"
    )

    context += format_value(
        "Project Title",
        project.title
    )

    context += format_list(
        "Project Descriptions",
        project.descriptions
    )

    context += format_list(
        "Candidate Skills",
        resume.skills
    )

    return context