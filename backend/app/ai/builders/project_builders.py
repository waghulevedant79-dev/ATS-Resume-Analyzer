import json

from app.ai.prompts.project import PROJECT_SYSTEM_PROMPT

from app.schemas.ai import ProjectEnhancementResponse


class ProjectBuilder:

    @staticmethod
    def build(
        context: str,
    ) -> str:

        schema = json.dumps(
            ProjectEnhancementResponse.model_json_schema()
        )

        return f"""
{PROJECT_SYSTEM_PROMPT}

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