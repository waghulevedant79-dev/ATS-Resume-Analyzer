from abc import ABC, abstractmethod
from typing import Optional, Type

from pydantic import BaseModel


class BaseAIProvider(ABC):

    @abstractmethod
    def generate(
        self,
        prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        pass