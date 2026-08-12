from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.ai.service import AIService
from app.integrations.gemini import GeminiProvider

from app.job_description.parser import parse_job_description
from app.matching.engine import match_resume_to_job_description
from app.scoring.scorer import calculate_ats_score

from app.db.dependencies import get_db 
from app.schemas.ai import ( 
    AIAnalysisResponse, 
    ProfessionalSummaryResponse, 
    ProjectEnhancementResponse, 
    KeywordExplanationResponse, 
    RewrittenResumeResponse 
)
from app.schemas.ai_request import ResumeAIRequest, ProjectEnhancementRequest
from app.schemas.matching_request import ResumeJobDescriptionRequest
from app.services.parsed_resume_service import get_owned_parsed_resume_schema, get_parsed_resume_schema
from app.auth.dependencies import get_current_user
from app.models.user import User



ai_service = AIService(GeminiProvider())


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

@router.post(
    "/analyze",
    response_model=AIAnalysisResponse,
    status_code=200,
)
async def analyze_resume(
    request: ResumeJobDescriptionRequest,
    db: Session = Depends(get_db),
):
    
    # --------------------------------
    # 1. Retrieve Parsed Resume
    # --------------------------------

    parsed_resume = get_parsed_resume_schema(
        db=db,
        resume_id=request.resume_id,
    )

    ats_result = calculate_ats_score(parsed_resume)

    # --------------------------------
    # 2. Parse Job Description
    # --------------------------------

    parsed_job_description = (
        parse_job_description(
            request.job_description
        )
    )

    # --------------------------------
    # 3. Run Matching Engine
    # --------------------------------

    match_result = (
        match_resume_to_job_description(
            resume=parsed_resume,
            job_description=parsed_job_description,
        )
    )

    # --------------------------------
    # 4. Run AI Analysis
    # --------------------------------

    ai_result = ai_service.analyze(
        resume=parsed_resume,
        ats=ats_result,
        match=match_result,
    )

    return ai_result


@router.post(
    "/professional-summary",
    response_model=ProfessionalSummaryResponse,
    status_code=200,
)
def generate_professional_summary(
    request: ResumeAIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):


    parsed_resume = get_owned_parsed_resume_schema(
        db=db,
        resume_id=request.resume_id,
        user=current_user,
    )

    return ai_service.generate_professional_summary(
        resume=parsed_resume
    )
    


@router.post(
    "/enhance-project",
    response_model=ProjectEnhancementResponse,
    status_code=200,
)
def enhance_project(
    request: ProjectEnhancementRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    parsed_resume = get_owned_parsed_resume_schema(
    db=db,
    resume_id=request.resume_id,
    user=current_user,
)

    # Check structured projects
    if not parsed_resume.project_details:
        raise HTTPException(
            status_code=400,
            detail="No structured projects found in the uploaded resume.",
        )

    # Validate selected project index
    if (
        request.project_index < 0
        or request.project_index >= len(parsed_resume.project_details)
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid project index.",
        )

    # Get complete project
    selected_project = parsed_resume.project_details[
        request.project_index
    ]

    result = ai_service.enhance_project(
        project=selected_project,
        resume=parsed_resume,
    )

    return result


@router.post(
    "/explain-missing-keywords",
    response_model=KeywordExplanationResponse,
    status_code=200,
)
async def explain_missing_keywords(
    request: ResumeJobDescriptionRequest,
    db: Session = Depends(get_db),
):

    # 1. Retrieve Parsed Resume

    parsed_resume = get_parsed_resume_schema(
        db=db,
        resume_id=request.resume_id,
    )


    # 2. Parse Job Description
    parsed_job_description = (
        parse_job_description(
            request.job_description
        )
    )

    # 3. Run existing Match Engine
    match_result = (
        match_resume_to_job_description(
            resume=parsed_resume,
            job_description=parsed_job_description,
        )
    )

    # 4. AI explains the deterministic
    # missing skills
    result = (
        ai_service.explain_missing_keywords(
            resume=parsed_resume,
            match=match_result,
        )
    )

    return result


@router.post(
    "/rewrite-resume",
    response_model=RewrittenResumeResponse,
    status_code=200,
)
def rewrite_resume(
    request: ResumeAIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    parsed_resume = get_owned_parsed_resume_schema(
    db=db,
    resume_id=request.resume_id,
    user=current_user,
)

    result = ai_service.rewrite_resume(
        resume=parsed_resume,
    )

    return result


