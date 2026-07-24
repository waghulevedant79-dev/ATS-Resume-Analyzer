from pydantic import BaseModel

from app.schemas.scorer import ScoreResult


class ATSScoreResponse(BaseModel):

    overall_score: int

    max_score: int

    percentage: float

    breakdown: dict[str, ScoreResult]