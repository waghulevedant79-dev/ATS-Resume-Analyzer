from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class ParsedProject(BaseModel):
    
    model_config = ConfigDict(from_attributes=True)
    
    title: Optional[str] = None

    descriptions: list[str] = Field(
        default_factory=list
    )


class ParsedResume(BaseModel):
    
    model_config = ConfigDict(from_attributes=True)
    
    name: Optional[str] = None

    email: Optional[str] = None

    phone: Optional[str] = None

    linkedin: Optional[str] = None

    github: Optional[str] = None

    portfolio: Optional[str] = None

    summary: Optional[str] = None

    education: list[str] = Field(default_factory=list)

    experience: list[str] = Field(default_factory=list)
    
    responsibilities: list[str] = Field(default_factory=list)

    projects: list[str] = Field(default_factory=list)

    project_details: list[ParsedProject] = Field(
        default_factory=list)

    skills: list[str] = Field(default_factory=list)

    certifications: list[str] = Field(default_factory=list)

    raw_text: str