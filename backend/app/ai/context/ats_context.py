from app.scoring.scorer import ATSScoreResponse

from app.ai.context.formatter import (
    format_heading,
    format_value,
    format_details,
)


def build_ats_context(ats: ATSScoreResponse) -> str:

    context = format_heading("ATS Analysis")

    context += format_value(
        "Overall Score",
        f"{ats.overall_score}/{ats.max_score}"
    )

    context += format_value(
        "Percentage",
        f"{ats.percentage:.2f}%"
    )

    for section, result in ats.breakdown.items():

        context += format_heading(section.replace("_", " ").title())

        context += format_value(
            "Score",
            f"{result.score}/{result.max_score}"
        )

        context += format_details(result.details)

        context += "\n"

    return context