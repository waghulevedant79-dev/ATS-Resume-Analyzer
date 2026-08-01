from app.schemas.matching import MatchResult

from app.ai.context.formatter import (
    format_heading,
    format_list,
    format_value,
    format_degree_level,
    format_years
)


def build_matching_context(
    match: MatchResult,
) -> str:

    context = format_heading(
        "Resume Match Analysis"
    )

    # -------------------------
    #       Overall Match
    # -------------------------

    context += format_value(
        "Overall Match",
        f"{match.overall_match:.2f}%"
    )

    # ---------------------
    #       Skills
    # ---------------------

    context += format_heading(
        "Skills Match"
    )

    context += format_value(
        "Match Percentage",
        f"{match.skills.match_percentage:.2f}%"
    )

    context += format_value(
        "Required Skills",
        str(match.skills.total_required_skills)
    )

    context += format_value(
        "Matched Skills Count",
        str(match.skills.total_matched_skills)
    )

    context += format_list(
        "Matched Skills",
        match.skills.matched_skills
    )

    context += format_list(
        "Missing Skills",
        match.skills.missing_skills
    )

    # -------------------------
    #       Confidence
    # -------------------------

    context += format_heading(
        "Confidence"
    )

    context += format_value(
        "Confidence Level",
        match.confidence.level
    )

    context += format_value(
        "Confidence Score",
        f"{match.confidence.score:.2f}"
    )

    # -------------------------
    #       Education
    # -------------------------

    context += format_heading(
        "Education Match"
    )

    context += format_value(
        "Required Degree",
        format_degree_level(
            match.education.required_level
        )
    )

    context += format_value(
        "Candidate Degree",
        format_degree_level(
            match.education.candidate_level
        )
    )

    context += format_value(
        "Matched",
        "Yes"
        if match.education.matched
        else "No"
    )

    # -------------------------
    #       Experience
    # -------------------------

    context += format_heading(
        "Experience Match"
    )

    context += format_value(
        "Required Experience",
        format_years(
            match.experience.required_years
        )
    )

    context += format_value(
        "Candidate Experience",
        format_years(
            match.experience.candidate_years
        )
    )

    context += format_value(
        "Matched",
        "Yes"
        if match.experience.matched
        else "No"
    )

    # -------------------------
    #     Responsibilities
    # -------------------------

    context += format_heading(
        "Responsibilities Match"
    )

    context += format_value(
        "Match Percentage",
        f"{match.responsibilities.match_percentage:.2f}%"
    )

    context += format_value(
        "Matched Responsibilities",
        str(
            match.responsibilities.matched_responsibilities
        )
    )

    context += format_value(
        "Total Responsibilities",
        str(
            match.responsibilities.total_responsibilities
        )
    )

    context += format_list(
        "Matched Responsibility Items",
        match.responsibilities.matched_items
    )

    context += format_list(
        "Missing Responsibility Items",
        match.responsibilities.missing_items
    )

    return context