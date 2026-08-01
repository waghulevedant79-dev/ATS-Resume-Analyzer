import json

from app.ai.prompts.keyword import (
    KEYWORD_EXPLANATION_SYSTEM_PROMPT,
)

from app.schemas.ai import (
    KeywordExplanationResponse,
)


class KeywordExplanationBuilder:

    @staticmethod
    def build(
        context: str,
    ) -> str:

        schema = json.dumps(
            KeywordExplanationResponse.model_json_schema()
        )

        return f"""
{KEYWORD_EXPLANATION_SYSTEM_PROMPT}

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