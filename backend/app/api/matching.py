from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.job_description.parser import parse_job_description
from app.matching.engine import match_resume_to_job_description

from app.schemas.matching import MatchResult
from app.db.dependencies import get_db
from app.schemas.matching_request import ResumeJobDescriptionRequest
from app.services.parsed_resume_service import get_parsed_resume


router = APIRouter(
    prefix="/matching",
    tags=["Matching"],
)

@router.post(
    "/match",
    response_model=MatchResult,
    status_code=200
)
async def match_resume(
    request: ResumeJobDescriptionRequest,
    db: Session = Depends(get_db)
):
    
    parsed_resume = get_parsed_resume(
        db=db,
        resume_id=request.resume_id
    )
    
    parsed_job_description = parse_job_description(
        request.job_description
        )
    
    result = match_resume_to_job_description(
        resume=parsed_resume,
        job_description=parsed_job_description
    )
    
    return MatchResult(
        overall_match=result.overall_match,
        skills=result.skills,
        confidence=result.confidence,
        experience=result.experience,
        education=result.education,
        responsibilities=result.responsibilities
    )