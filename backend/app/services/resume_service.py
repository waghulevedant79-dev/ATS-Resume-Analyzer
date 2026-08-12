from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.utils.file_handler import save_file
from app.models.resume import Resume
from sqlalchemy.exc import SQLAlchemyError
import logging
import os

from app.parsers.parser import parse_resume
from app.scoring.scorer import calculate_ats_score
from app.services.parsed_resume_service import save_parsed_resume
from app.models.user import User

logger = logging.getLogger(__name__)

def create_resume(
    db: Session,
    file: UploadFile,
    user: User,
) -> Resume:
    
    """
    Save resume and store metadata in database
    """
    
    file_metadata = save_file(file)
    
    try:
        
        resume = Resume(
            user_id=user.id,
            original_filename=file_metadata["original_filename"],
            stored_filename=file_metadata["stored_filename"],
            file_path=file_metadata["file_path"],
            file_type=file_metadata["original_filename"]
        )
    
        db.add(resume)
    
        db.commit()
    
        db.refresh(resume)
    
        return resume
    
    except SQLAlchemyError as e:
        
        db.rollback()
        
        if os.path.exists(file_metadata["file_path"]):
            os.remove(file_metadata["file_path"])
            
        logger.exception("Database error while saving resume.")
        
        raise HTTPException(
            status_code=500,
            detail="Failed to save resume."
        )


def process_uploaded_resume(
    db: Session,
    file: UploadFile,
    user: User,
):
    """
    Process an uploaded resume.

    Workflow:
    1. Save uploaded file
    2. Store resume metadata
    3. Parse the resume
    4. Calculate ATS score
    5. Return processed result
    """

    try:

        # Save file & metadata
        resume = create_resume(
            db=db,
            file=file,
            user=user,
        )

        # Parse resume
        parsed_resume = parse_resume(resume.file_path)
        
        # save parsed resume in database 
        save_parsed_resume(
            db,
            resume,
            parsed_resume
        )
        
        # calculating ats score
        ats_score = calculate_ats_score(parsed_resume)

        return {
            "message": "Resume uploaded successfully.",
            "resume_id": resume.id,
            "parsed_resume": parsed_resume,
            "ats_score": ats_score
        }

    except Exception as e:

        # If parsing failed after saving,
        # remove uploaded file and database entry.

        if 'resume' in locals():

            if os.path.exists(resume.file_path):
                os.remove(resume.file_path)

            db.delete(resume)
            db.commit()

        logger.exception("Resume processing failed.")

        raise HTTPException(
            status_code=500,
            detail="Failed to process resume."
        )


def get_owned_resume(
    db: Session,
    resume_id: int,
    user: User,
) -> Resume:
    """
    Retrieve a resume only if it belongs to the
    authenticated user.
    """

    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == user.id,
        )
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    return resume