from pydantic import BaseModel, Field


class ResumeReview(BaseModel):
    overall_review: str
    strengths: list[str]
    weaknesses: list[str]
    career_advice: str


class AIAnalysisResponse(BaseModel):
    resume_review: ResumeReview
    ats_suggestions: list[str]
    resume_tailoring: list[str]


class ProfessionalSummaryResponse(BaseModel):
    professional_summary: str


class ProjectEnhancementResponse(BaseModel):
    enhanced_description: list[str]


class KeywordExplanation(BaseModel):
    keyword: str
    explanation: str
    recommendation: str


class KeywordExplanationResponse(BaseModel):
    keyword_explanations: list[
        KeywordExplanation
    ] = Field(default_factory=list)


class RewrittenProject(BaseModel):
    title: str | None = None

    descriptions: list[str] = Field(
        default_factory=list
    )


class RewrittenResumeResponse(BaseModel):

    professional_summary: str | None = None

    skills: list[str] = Field(
        default_factory=list
    )

    experience: list[str] = Field(
        default_factory=list
    )

    projects: list[RewrittenProject] = Field(
        default_factory=list
    )

    education: list[str] = Field(
        default_factory=list
    )

    certifications: list[str] = Field(
        default_factory=list
    )