import logging
from typing import Optional, Type

from pydantic import BaseModel

from app.core.settings import settings
from app.integrations.gemini import gemini_provider
from app.integrations.openrouter import (
    OpenRouterProviderError,
    openrouter_provider,
)
from app.integrations.providers.base import BaseAIProvider


logger = logging.getLogger(__name__)


class AIProviderManager(BaseAIProvider):
    """
    Selects the primary provider and falls back to the secondary provider
    only for temporary/provider-capacity failures.

    The primary provider remains configured as the primary on every request.
    This means a quota reset does not require any application-side reset.
    """

    def __init__(
        self,
        primary_provider: BaseAIProvider,
        fallback_provider: BaseAIProvider,
    ):
        self.primary_provider = primary_provider
        self.fallback_provider = fallback_provider

    def generate(
        self,
        prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        try:
            return self.primary_provider.generate(
                prompt,
                response_schema=response_schema,
            )

        except OpenRouterProviderError as exc:
            if not exc.fallback_eligible:
                raise

            logger.warning(
                "Primary AI provider unavailable; using fallback provider."
            )

            return self.fallback_provider.generate(
                prompt,
                response_schema=response_schema,
            )


ai_provider = AIProviderManager(
    primary_provider=openrouter_provider,
    fallback_provider=gemini_provider,
)
