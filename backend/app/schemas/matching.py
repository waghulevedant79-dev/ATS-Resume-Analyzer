from pydantic import BaseModel, Field


class SkillMatchResult(BaseModel):

    matched_skills: list[str] = Field(default_factory=list)

    missing_skills: list[str] = Field(default_factory=list)

    total_required_skills: int = 0

    total_matched_skills: int = 0

    match_percentage: float = 0.0


class EducationMatchResult(BaseModel):

    required_level: int = 0

    candidate_level: int = 0

    matched: bool = False


class ExperienceMatchResult(BaseModel):

    required_years: float = 0.0

    candidate_years: float = 0.0

    matched: bool = False


class ResponsibilitiesMatchResult(BaseModel):

    matched_responsibilities: int = 0

    total_responsibilities: int = 0

    match_percentage: float = 0.0

    matched_items: list[str] = Field(default_factory=list)

    missing_items: list[str] = Field(default_factory=list)


class ConfidenceResult(BaseModel):

    level: str = "Low"

    score: float = 0.0


class MatchResult(BaseModel):

    overall_match: float = 0.0
    
    skills: SkillMatchResult
    
    confidence: ConfidenceResult
    
    education: EducationMatchResult

    experience: ExperienceMatchResult
    
    responsibilities: ResponsibilitiesMatchResult