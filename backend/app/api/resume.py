from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.services.resume_service import (
    process_uploaded_resume,
    claim_anonymous_resume,
)
from app.schemas.resume import ProcessResumeResponse
from app.models.user import User
from app.auth.dependencies import get_current_user

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
):
    """
    Upload resume and store its metadata.
    """
    
    resume = process_uploaded_resume(
            db=db,
            file=file,
            user=None,
    )
    
    return ProcessResumeResponse (
        message= "Resume uploaded successfully.",
        resume_id=resume["resume_id"],
        parsed_resume=resume["parsed_resume"],
        ats_score=resume["ats_score"]
    )


@router.post("/{resume_id}/claim")
def claim_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Claim an anonymous resume for the authenticated user.
    """

    resume = claim_anonymous_resume(
        db=db,
        resume_id=resume_id,
        user=current_user,
    )

    return {
        "message": "Resume claimed successfully.",
        "resume_id": resume.id,
    }