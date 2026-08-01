import json

from app.ai.prompts.resume_rewrite import (
    RESUME_REWRITE_SYSTEM_PROMPT,
)

from app.schemas.ai import (
    RewrittenResumeResponse,
)


class ResumeRewriteBuilder:

    @staticmethod
    def build(
        context: str,
    ) -> str:

        schema = json.dumps(
            RewrittenResumeResponse.model_json_schema()
        )

        return f"""
{RESUME_REWRITE_SYSTEM_PROMPT}

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