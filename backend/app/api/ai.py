from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.ai.service import AIService
from app.integrations.gemini import GeminiProvider


from app.services.resume_service import process_uploaded_resume
from app.job_description.parser import parse_job_description
from app.matching.engine import match_resume_to_job_description


from app.db.dependencies import get_db 
from app.schemas.ai import ( 
    AIAnalysisResponse, 
    ProfessionalSummaryResponse, 
    ProjectEnhancementResponse, 
    KeywordExplanationResponse, 
    RewrittenResumeResponse 
)




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
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    
    # --------------------------------
    # 1. Process Resume
    # --------------------------------

    processed = process_uploaded_resume(
        db,
        resume,
    )

    parsed_resume = processed["parsed_resume"]

    ats_result = processed["ats_score"]

    # --------------------------------
    # 2. Parse Job Description
    # --------------------------------
    
    contents = await job_description.read()

    text = contents.decode("utf-8")

    parsed_job_description = (
        parse_job_description(text)
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
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    processed = process_uploaded_resume(
        db,
        resume,
    )

    parsed_resume = processed[
        "parsed_resume"
    ]

    result = ai_service.generate_professional_summary(
        resume=parsed_resume
    )

    return result

@router.post(
    "/enhance-project",
    response_model=ProjectEnhancementResponse,
    status_code=200,
)
def enhance_project(
    project_index: int = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    processed = process_uploaded_resume(
        db,
        resume,
    )

    parsed_resume = processed[
        "parsed_resume"
    ]

    # Check structured projects
    if not parsed_resume.project_details:
        raise HTTPException(
            status_code=400,
            detail="No structured projects found in the uploaded resume.",
        )

    # Validate selected project index
    if (
        project_index < 0
        or project_index >= len(parsed_resume.project_details)
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid project index.",
        )

    # Get complete project
    selected_project = parsed_resume.project_details[
        project_index
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
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    # 1. Process uploaded resume
    processed = process_uploaded_resume(
        db,
        resume,
    )

    parsed_resume = processed[
        "parsed_resume"
    ]

    # 2. Read uploaded Job Description
    contents = await job_description.read()

    text = contents.decode(
        "utf-8"
    )

    # 3. Parse Job Description
    parsed_job_description = (
        parse_job_description(
            text
        )
    )

    # 4. Run existing Match Engine
    match_result = (
        match_resume_to_job_description(
            resume=parsed_resume,
            job_description=parsed_job_description,
        )
    )

    # 5. AI explains the deterministic
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
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    processed = process_uploaded_resume(
        db,
        resume,
    )

    parsed_resume = processed[
        "parsed_resume"
    ]

    result = ai_service.rewrite_resume(
        resume=parsed_resume,
    )

    return result


