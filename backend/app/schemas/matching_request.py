from pydantic import BaseModel, Field


class ResumeJobDescriptionRequest(BaseModel):

    resume_id: int = Field(
        gt=0,
        description="Resume ID returned after upload."
    )

    job_description: str = Field(
        min_length=100,
        description="Paste the complete job description."
    )