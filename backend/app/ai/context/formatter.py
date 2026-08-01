from typing import Any


def format_heading(title: str) -> str:
    return f"\n{title}\n{'=' * len(title)}\n"


def format_list(title: str, items: list[str]) -> str:
    if not items:
        return ""

    lines = [format_heading(title)]

    for item in items:
        lines.append(f"- {item}")

    return "\n".join(lines) + "\n"


def format_value(title: str, value: str | None) -> str:
    if not value:
        return ""

    return f"{title}: {value}\n"


def format_details(details: dict[str, Any]) -> str:
    lines = []

    for key, value in details.items():

        title = key.replace("_", " ").title()

        if isinstance(value, list):

            if not value:
                continue

            lines.append(f"{title}:")

            for item in value:
                lines.append(f"- {item}")

        elif isinstance(value, dict):

            if not value:
                continue

            lines.append(f"{title}:")

            for k, v in value.items():
                lines.append(f"- {k}: {v}")

        else:

            lines.append(f"{title}: {value}")

    return "\n".join(lines)


DEGREE_LEVEL_NAMES = {
    0: "Not Specified",
    1: "High School",
    2: "Diploma",
    3: "Bachelor's",
    4: "Master's",
    5: "PhD",
}


def format_degree_level(level: int) -> str:
    return DEGREE_LEVEL_NAMES.get(
        level,
        "Unknown",
    )
    


def format_years(years: float) -> str:

    if years == 1:
        return "1 year"

    return f"{years:g} years"

