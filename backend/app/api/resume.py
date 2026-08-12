from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.services.resume_service import process_uploaded_resume
from app.schemas.resume import ProcessResumeResponse
from app.db.dependencies import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)


@router.post(
    "/upload",
    response_model=ProcessResumeResponse,
    status_code=201
)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload resume and store its metadata.
    """
    
    resume = process_uploaded_resume(
            db=db,
            file=file,
            user=current_user,
    )
    
    return ProcessResumeResponse (
        message= "Resume uploaded successfully.",
        resume_id=resume["resume_id"],
        parsed_resume=resume["parsed_resume"],
        ats_score=resume["ats_score"]
    )
