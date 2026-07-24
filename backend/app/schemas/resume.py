from pydantic import BaseModel
from typing import Any
from app.schemas.ats_score import ATSScoreResponse
from app.schemas.parser import ParsedResume


class ResumeUploadParseResponse(BaseModel):
    """
    Response returned after a successful resume upload and parsed.
    """

    message: str
    resume_id: int
    parsed_resume: ParsedResume


class ProcessResumeResponse(BaseModel):
    """
    Response returned after a successful resume parsed and calculate ats score.
    """

    message: str
    resume_id: int
    parsed_resume: ParsedResume
    ats_score: ATSScoreResponse