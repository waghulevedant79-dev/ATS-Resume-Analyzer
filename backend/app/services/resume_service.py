from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import session

from app.utils.file_handler import save_file
from app.models.resume import Resume
from sqlalchemy.exc import SQLAlchemyError
import logging
import os

logger = logging.getLogger(__name__)

def create_resume(
    db: session,
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