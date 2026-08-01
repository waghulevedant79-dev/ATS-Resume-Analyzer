import json
from app.schemas.ai import AIAnalysisResponse


def get_analysis_schema() -> str:
    return json.dumps(
        AIAnalysisResponse.model_json_schema(),
        indent=2
    )