from pydantic import BaseModel
from typing import Any


class ResumeUploadParseResponse(BaseModel):
    """
    Response returned after a successful resume upload and parsed.
    """

    message: str
    resume_id: int
    parsed_resume: dict[str, Any]