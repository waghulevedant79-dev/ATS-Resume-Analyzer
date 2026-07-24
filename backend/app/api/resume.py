from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.resume_service import process_uploaded_resume
from app.schemas.resume import ProcessResumeResponse
from app.db.dependencies import get_db

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)


@router.post(
    "/upload",
    response_model=ProcessResumeResponse,
    status_code=201
)
def upolad_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload resume and store its metadata.
    """
    
    resume = process_uploaded_resume(db, file)
    
    return ProcessResumeResponse (
        message= "Resume uploaded successfully.",
        resume_id=resume["resume_id"],
        parsed_resume=resume["parsed_resume"],
        ats_score=resume["ats_score"]
    )
