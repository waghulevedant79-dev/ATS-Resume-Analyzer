import json
from app.ai.prompts.summary import SUMMARY_SYSTEM_PROMPT
from app.schemas.ai import ProfessionalSummaryResponse


class SummaryBuilder:

    @staticmethod
    def build(context: str) -> str:

        schema = json.dumps(
            ProfessionalSummaryResponse.model_json_schema()
        )

        return f"""
{SUMMARY_SYSTEM_PROMPT}

==================================================
APPLICATION CONTEXT
==================================================

{context}

==================================================
JSON SCHEMA
==================================================

{schema}

Return ONLY a JSON object.
""".strip()