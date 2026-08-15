from openai import APIConnectionError, APIStatusError, APITimeoutError, OpenAI
from pydantic import BaseModel
from typing import Optional, Type

from app.core.settings import settings
from app.integrations.providers.base import BaseAIProvider


class OpenRouterProviderError(Exception):
    """Raised when an OpenRouter API request fails."""

    def __init__(self, message: str, *, fallback_eligible: bool = False):
        super().__init__(message)
        self.fallback_eligible = fallback_eligible


class OpenRouterProvider(BaseAIProvider):

    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
        )
        self.model = settings.NVIDIA_MODEL

    def generate(
        self,
        prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        try:
            request_kwargs = {
                "model": self.model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                "extra_body": {
                    "reasoning": {
                        "max_tokens": 0,
                    }
                },
            }

            if response_schema is not None:
                request_kwargs["response_format"] = {
                    "type": "json_schema",
                    "json_schema": {
                        "name": response_schema.__name__,
                        "strict": True,
                        "schema": response_schema.model_json_schema(),
                    },
                }

            response = self.client.chat.completions.create(
                **request_kwargs
            )

            return response.choices[0].message.content

        except APIStatusError as e:
            status_code = getattr(e, "status_code", None)
            fallback_eligible = (
                status_code == 429
                or (status_code is not None and 500 <= status_code < 600)
            )

            raise OpenRouterProviderError(
                f"OpenRouter generation failed: {str(e)}",
                fallback_eligible=fallback_eligible,
            ) from e

        except (APIConnectionError, APITimeoutError) as e:
            raise OpenRouterProviderError(
                f"OpenRouter generation failed: {str(e)}",
                fallback_eligible=True,
            ) from e

        except Exception as e:
            raise OpenRouterProviderError(
                f"OpenRouter generation failed: {str(e)}",
                fallback_eligible=False,
            ) from e


openrouter_provider = OpenRouterProvider()
