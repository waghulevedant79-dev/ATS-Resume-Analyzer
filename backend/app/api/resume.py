from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.resume_service import upload_and_parse_resume
from app.schemas.resume import ResumeUploadParseResponse
from app.db.dependencies import get_db

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)


@router.post(
    "/upload",
    response_model=ResumeUploadParseResponse,
    status_code=201
)
def upolad_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload resume and store its metadata.
    """
    
    resume = upload_and_parse_resume(db, file)
    
    return ResumeUploadParseResponse (
        message= "Resume uploaded successfully.",
        resume_id=resume["resume_id"],
        parsed_resume=resume["parsed_resume"],
    )
