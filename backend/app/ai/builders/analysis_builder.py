from app.ai.prompts.analysis import SYSTEM_PROMPT
from app.ai.utils.schema_generator import get_analysis_schema


class AnalysisBuilder:

    @staticmethod
    def build(
        context: str,
        include_schema: bool = True
    ) -> str:

        prompt = SYSTEM_PROMPT

        prompt += f"""

==================================================
APPLICATION CONTEXT
==================================================

{context}
"""

        if include_schema:
            prompt += f"""

==================================================
JSON SCHEMA
==================================================

{get_analysis_schema()}
"""

        prompt += "\nReturn ONLY a JSON object."

        return prompt