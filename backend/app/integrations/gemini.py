from typing import Optional, Type

from google import genai
from google.genai import types
from pydantic import BaseModel

from app.core.settings import settings
from app.integrations.providers.base import BaseAIProvider


class GeminiProviderError(Exception):
    """Raised when a Gemini API request fails."""
    pass


class GeminiProvider(BaseAIProvider):

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )
        self.model = settings.GEMINI_MODEL

    def generate(
        self,
        prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        """
        Send prompt to Gemini and return generated text.

        The response schema is accepted to keep the provider interface
        compatible with the other AI providers. Gemini currently relies
        on JSON response mode plus the existing application-level
        response parsing and Pydantic validation.
        """

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.5,
                    response_mime_type="application/json",
                ),
            )

            return response.text

        except Exception as e:
            raise GeminiProviderError(
                f"Gemini generation failed: {str(e)}"
            ) from e


gemini_provider = GeminiProvider()
