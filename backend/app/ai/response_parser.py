import json

from pydantic import ValidationError

from app.ai.exceptions import (
    AIResponseParseError,
    AIResponseValidationError,
)
from app.schemas.ai import (
    AIAnalysisResponse,
    ProfessionalSummaryResponse,
    ProjectEnhancementResponse,
    KeywordExplanationResponse,
    RewrittenResumeResponse
)



class AIResponseParser:
    
    """Parse and validate an AI analysis response."""
    @staticmethod
    def parse_analysis(response: str) -> AIAnalysisResponse:

        # Step 1: Convert JSON string -> dict
        try:
            parsed = json.loads(response)

        except json.JSONDecodeError as e:
            raise AIResponseParseError(
                "Failed to parse AI response as JSON."
            ) from e

        # Step 2: Validate using Pydantic
        try:
            return AIAnalysisResponse.model_validate(parsed)

        except ValidationError as e:
            raise AIResponseValidationError(
                "AI response does not match the expected schema."
            ) from e
    
    
    """Generate professional summary response."""
    @staticmethod
    def parse_summary(
        raw_response: str,
    ) -> ProfessionalSummaryResponse:
        
        try:
            data = json.loads(raw_response)

            return ProfessionalSummaryResponse.model_validate(
                data
            )

        except json.JSONDecodeError as exc:
            raise ValueError(
                "AI returned invalid JSON."
            ) from exc

        except ValidationError as exc:
            raise ValueError(
                "AI summary response does not match the expected schema."
            ) from exc
    
    
    """Generate project enhancement response."""
    @staticmethod
    def parse_project_enhancement(
        raw_response: str,
    ) -> ProjectEnhancementResponse:
        
        cleaned_response = AIResponseParser._clean_response(
        raw_response
    )

        try:
            data = json.loads(
                cleaned_response
            )

            return ProjectEnhancementResponse.model_validate(
                data
            )

        except json.JSONDecodeError as exc:
            raise ValueError(
                "AI returned invalid JSON."
            ) from exc

        except ValidationError as exc:
            raise ValueError(
                "AI project enhancement response does not "
                "match the expected schema."
            ) from exc
    
    
    @staticmethod
    def _clean_response(
        raw_response: str,
    ) -> str:

        cleaned = raw_response.strip()

        if cleaned.startswith("```json"):
            cleaned = cleaned[len("```json"):]

        elif cleaned.startswith("```"):
            cleaned = cleaned[len("```"):]

        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        return cleaned.strip()
    
    
    @staticmethod
    def parse_keyword_explanations(
        raw_response: str,
    ) -> KeywordExplanationResponse:

        cleaned_response = AIResponseParser._clean_response(
            raw_response
        )

        try:
            data = json.loads(
                cleaned_response
            )

            return KeywordExplanationResponse.model_validate(
                data
            )

        except json.JSONDecodeError as exc:
            raise ValueError(
                "AI returned invalid JSON."
            ) from exc

        except ValidationError as exc:
            raise ValueError(
                "AI keyword explanation response does not "
                "match the expected schema."
            ) from exc
    
    
    @staticmethod
    def parse_resume_rewrite(
        raw_response: str,
    ) -> RewrittenResumeResponse:

        cleaned_response = AIResponseParser._clean_response(
            raw_response
        )

        try:

            data = json.loads(
                cleaned_response
            )

            return RewrittenResumeResponse.model_validate(
                data
            )

        except json.JSONDecodeError as exc:

            raise ValueError(
                "AI returned invalid JSON."
            ) from exc

        except ValidationError as exc:

            raise ValueError(
                "AI resume rewrite response does not "
                "match the expected schema."
            ) from exc
    
    
    