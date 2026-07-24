from pydantic import BaseModel, Field
from typing import Any

class ScoreResult(BaseModel):

    score: int
    
    max_score: int
    
    details: dict[str, Any] = Field(default_factory=dict)