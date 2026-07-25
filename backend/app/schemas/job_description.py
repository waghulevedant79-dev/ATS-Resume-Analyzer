from pydantic import BaseModel, Field


class ParsedJobDescription(BaseModel):
    job_title: str | None = None

    required_skills: list[str] = Field(default_factory=list)

    preferred_skills: list[str] = Field(default_factory=list)

    education: list[str] = Field(default_factory=list)

    experience: list[str] = Field(default_factory=list)

    responsibilities: list[str] = Field(default_factory=list)

    tools: list[str] = Field(default_factory=list)