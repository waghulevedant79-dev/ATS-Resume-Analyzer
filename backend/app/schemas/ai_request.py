from pydantic import BaseModel, Field


class ResumeAIRequest(BaseModel):
    """
    Request model for AI features that only require
    a stored resume.
    """

    resume_id: int = Field(
        gt=0,
        description="Resume ID returned after uploading the resume."
    )



class ProjectEnhancementRequest(BaseModel):
    resume_id: int = Field(gt=0)
    project_index: int = Field(ge=0)



