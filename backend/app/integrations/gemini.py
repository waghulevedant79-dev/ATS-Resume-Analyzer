from google import genai
from google.genai import types
from app.core.settings import settings
from app.integrations.providers.base import BaseAIProvider
from app.schemas.ai import AIAnalysisResponse


class GeminiProviderError(Exception):
    """Raised when Gemini API request fails."""
    pass


class GeminiProvider(BaseAIProvider):
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )
        self.model = settings.GEMINI_MODEL

    def generate(self, prompt: str) -> AIAnalysisResponse:
        """
        Send prompt to Gemini and return generated text.
        """

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.5,
                )
            )

            return response.text

        except Exception as e:
            raise GeminiProviderError(
                f"Gemini generation failed: {str(e)}"
            ) from e


gemini_provider = GeminiProvider()