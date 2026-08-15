from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session
from app.ai.service import ai_service

from app.job_description.parser import parse_job_description
from app.matching.engine import match_resume_to_job_description
from app.scoring.scorer import calculate_ats_score

from app.db.dependencies import get_db
from app.schemas.ai import (
    AIAnalysisResponse,
    ProfessionalSummaryResponse,
    ProjectEnhancementResponse,
    KeywordExplanationResponse,
    RewrittenResumeResponse,
    DeepAIUsageResponse,
)
from app.schemas.ai_request import (
    ResumeAIRequest,
    ProjectEnhancementRequest,
)
from app.schemas.matching_request import ResumeJobDescriptionRequest
from app.services.parsed_resume_service import (
    get_owned_parsed_resume_schema,
    get_parsed_resume_schema,
)
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.services.deep_ai_usage import (
    check_deep_ai_usage,
    consume_deep_ai_usage,
    get_usage_status
)




router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


# ============================================================
# FREE AI ANALYSIS
# ============================================================

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

    parsed_job_description = parse_job_description(
        request.job_description
    )

    # --------------------------------
    # 3. Run Matching Engine
    # --------------------------------

    match_result = match_resume_to_job_description(
        resume=parsed_resume,
        job_description=parsed_job_description,
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


# ============================================================
# DEEP AI — PROFESSIONAL SUMMARY
# ============================================================

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

    # --------------------------------
    # 1. Verify resume ownership
    # --------------------------------

    parsed_resume = get_owned_parsed_resume_schema(
        db=db,
        resume_id=request.resume_id,
        user=current_user,
    )

    # --------------------------------
    # 2. Check Deep AI usage
    # --------------------------------

    usage = check_deep_ai_usage(
        db=db,
        user_id=current_user.id,
    )

    # --------------------------------
    # 3. Run Deep AI
    # --------------------------------

    result = ai_service.generate_professional_summary(
        resume=parsed_resume,
    )

    # --------------------------------
    # 4. Consume usage only after
    #    successful AI response
    # --------------------------------

    consume_deep_ai_usage(
        db=db,
        usage=usage,
    )

    return result


# ============================================================
# DEEP AI — ENHANCE PROJECT
# ============================================================

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

    # --------------------------------
    # 1. Verify resume ownership
    # --------------------------------

    parsed_resume = get_owned_parsed_resume_schema(
        db=db,
        resume_id=request.resume_id,
        user=current_user,
    )

    # --------------------------------
    # 2. Validate structured projects
    # --------------------------------

    if not parsed_resume.project_details:
        raise HTTPException(
            status_code=400,
            detail="No structured projects found in the uploaded resume.",
        )

    # --------------------------------
    # 3. Validate selected project index
    # --------------------------------

    if (
        request.project_index < 0
        or request.project_index >= len(
            parsed_resume.project_details
        )
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid project index.",
        )

    # --------------------------------
    # 4. Get selected project
    # --------------------------------

    selected_project = parsed_resume.project_details[
        request.project_index
    ]

    # --------------------------------
    # 5. Check Deep AI usage
    # --------------------------------

    usage = check_deep_ai_usage(
        db=db,
        user_id=current_user.id,
    )

    # --------------------------------
    # 6. Run Deep AI
    # --------------------------------

    result = ai_service.enhance_project(
        project=selected_project,
        resume=parsed_resume,
    )

    # --------------------------------
    # 7. Consume usage only after
    #    successful AI response
    # --------------------------------

    consume_deep_ai_usage(
        db=db,
        usage=usage,
    )

    return result


# ============================================================
# FREE AI EXPLAIN MISSING KEYWORDS
# ============================================================

@router.post(
    "/explain-missing-keywords",
    response_model=KeywordExplanationResponse,
    status_code=200,
)
def explain_missing_keywords(
    request: ResumeJobDescriptionRequest,
    db: Session = Depends(get_db),
):

    # --------------------------------
    # 1. Verify resume ownership
    # --------------------------------

    parsed_resume = get_parsed_resume_schema(
        db=db,
        resume_id=request.resume_id,
    )

    # --------------------------------
    # 2. Parse Job Description
    # --------------------------------

    parsed_job_description = parse_job_description(
        request.job_description
    )

    # --------------------------------
    # 3. Run existing Match Engine
    # --------------------------------

    match_result = match_resume_to_job_description(
        resume=parsed_resume,
        job_description=parsed_job_description,
    )

    # --------------------------------
    # 4. AI explains the deterministic
    #    missing skills
    # --------------------------------

    result = ai_service.explain_missing_keywords(
        resume=parsed_resume,
        match=match_result,
    )

    return result


# ============================================================
# DEEP AI — REWRITE RESUME
# ============================================================

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

    # --------------------------------
    # 1. Verify resume ownership
    # --------------------------------

    parsed_resume = get_owned_parsed_resume_schema(
        db=db,
        resume_id=request.resume_id,
        user=current_user,
    )

    # --------------------------------
    # 2. Check Deep AI usage
    # --------------------------------

    usage = check_deep_ai_usage(
        db=db,
        user_id=current_user.id,
    )

    # --------------------------------
    # 3. Run Deep AI
    # --------------------------------

    result = ai_service.rewrite_resume(
        resume=parsed_resume,
    )

    # --------------------------------
    # 4. Consume usage only after
    #    successful AI response
    # --------------------------------

    consume_deep_ai_usage(
        db=db,
        usage=usage,
    )

    return result

# ============================================================
# DEEP AI — USAGE STATUS
# ============================================================

@router.get(
    "/usage",
    response_model=DeepAIUsageResponse,
    status_code=200,
)
def get_deep_ai_usage_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_usage_status(
        db=db,
        user_id=current_user.id,
    )