from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    """
    Response returned after a successful resume upload.
    """

    message: str
    resume_id: int
    original_filename: str
    stored_filename: str