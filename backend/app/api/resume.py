from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.resume_service import create_resume
from app.schemas.resume import ResumeUploadResponse
from app.db.dependencies import get_db

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)


@router.post(
    "/upload",
    response_model=ResumeUploadResponse,
    status_code=201
)
def upolad_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload resume and store its metadata.
    """
    
    resume = create_resume(db, file)
    
    return ResumeUploadResponse (
        message= "Resume uploaded successfully.",
        resume_id= resume.id,
        original_filename= resume.original_filename,
        stored_filename= resume.stored_filename,
    )
