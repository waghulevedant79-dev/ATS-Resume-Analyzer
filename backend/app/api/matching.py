from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from app.services.resume_service import process_uploaded_resume
from app.job_description.parser import parse_job_description
from app.matching.engine import match_resume_to_job_description

from app.schemas.matching import MatchResult
from app.db.dependencies import get_db


router = APIRouter(
    prefix="/matching",
    tags=["Matching"],
)

@router.post(
    "/match",
    response_model=MatchResult,
    status_code=201
)
async def match_resume(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    
    processed = process_uploaded_resume(db, resume)

    parsed_resume = processed["parsed_resume"]
    
    
    contents = await job_description.read()
    text = contents.decode("utf-8")
    
    parsed_job_description = parse_job_description(
        text
        )
    
    result = match_resume_to_job_description(
        resume=parsed_resume,
        job_description=parsed_job_description
    )
    
    return MatchResult(
        overall_match=result.overall_match,
        skills=result.skills,
        experience=result.experience,
        education=result.education,
        responsibilities=result.responsibilities
    )