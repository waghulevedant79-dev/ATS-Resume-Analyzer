from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.utils.file_handler import save_file
from app.models.resume import Resume
from sqlalchemy.exc import SQLAlchemyError
import logging
import os

from app.parsers.parser import parse_resume

logger = logging.getLogger(__name__)

def create_resume(
    db: Session,
    file: UploadFile
) -> Resume:
    
    """
    Save resume and store metadata in database
    """
    
    file_metadata = save_file(file)
    
    try:
        
        resume = Resume(
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


def upload_and_parse_resume(
    db: Session,
    file: UploadFile
):
    """
    Upload a resume, save its metadata,
    parse the resume and return both.
    """

    try:

        # Save file & metadata
        resume = create_resume(db, file)

        # Parse resume
        parsed_resume = parse_resume(resume.file_path)

        return {
            "message": "Resume uploaded successfully.",
            "resume_id": resume.id,
            "parsed_resume": parsed_resume
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