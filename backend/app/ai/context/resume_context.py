from app.parsers.parser import ParsedResume

from app.ai.context.formatter import (
    format_heading,
    format_list,
    format_value,
)


def build_resume_context(resume: ParsedResume) -> str:

    context = format_heading("Resume Information")

    context += format_value("Name", resume.name)

    context += format_value("Email", resume.email)

    context += format_value("Phone", resume.phone)

    context += format_list("Skills", resume.skills)

    context += format_list("Projects", resume.projects)

    context += format_list("Experience", resume.experience)

    context += format_list("Education", resume.education)

    context += format_list("Certifications", resume.certifications)

    return context