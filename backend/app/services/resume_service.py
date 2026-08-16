import logging
import os
from typing import Optional

from fastapi import HTTPException, UploadFile
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.user import User
from app.parsers.parser import parse_resume
from app.scoring.scorer import calculate_ats_score
from app.services.parsed_resume_service import save_parsed_resume
from app.utils.file_handler import save_temp_file
from app.integrations.storage.b2 import delete_file, upload_file

logger = logging.getLogger(__name__)


def create_resume(
    db: Session,
    file_metadata: dict,
    user: Optional[User] = None,
) -> Resume:
    """
    Create the database metadata record.

    file_path stores the R2 object key, not a local filesystem path.
    """
    resume = Resume(
        user_id=user.id if user else None,
        original_filename=file_metadata["original_filename"],
        stored_filename=file_metadata["stored_filename"],
        file_path=file_metadata["object_key"],
        file_type=file_metadata["file_type"],
    )

    db.add(resume)

    try:
        db.commit()
        db.refresh(resume)
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Database error while saving resume.")
        raise HTTPException(
            status_code=500,
            detail="Failed to save resume.",
        )

    return resume


def process_uploaded_resume(
    db: Session,
    file: UploadFile,
    user: Optional[User] = None,
):
    """
    Process an uploaded resume.

    Workflow:
    1. Validate upload and create an ephemeral processing file.
    2. Parse the resume from the temporary file.
    3. Upload the original file to private Cloudflare R2.
    4. Store resume metadata in PostgreSQL.
    5. Store parsed resume data in PostgreSQL.
    6. Calculate ATS score.
    7. Remove the temporary processing file.

    The container filesystem is never used as persistent resume storage.
    """
    file_metadata = save_temp_file(file)
    temp_file_path = file_metadata["temp_file_path"]

    resume = None
    object_uploaded = False

    try:
        # Parse while the temporary processing file exists.
        parsed_resume = parse_resume(temp_file_path)

        # Persistent file storage lives in R2.
        object_key = f"resumes/{file_metadata['stored_filename']}"

        upload_file(
            file_path=temp_file_path,
            object_key=object_key,
            content_type=file_metadata["content_type"],
        )
        object_uploaded = True

        file_metadata["object_key"] = object_key

        # Store only metadata/reference in PostgreSQL.
        resume = create_resume(
            db=db,
            file_metadata=file_metadata,
            user=user,
        )

        # Store parsed resume in PostgreSQL.
        save_parsed_resume(
            db,
            resume,
            parsed_resume,
        )

        ats_score = calculate_ats_score(parsed_resume)

        return {
            "message": "Resume uploaded successfully.",
            "resume_id": resume.id,
            "parsed_resume": parsed_resume,
            "ats_score": ats_score,
        }

    except HTTPException:
        # Validation/expected HTTP errors should keep their original status.
        if object_uploaded:
            try:
                delete_file(file_metadata["object_key"])
            except Exception:
                logger.exception(
                    "R2 cleanup failed after resume processing error."
                )

        if resume is not None:
            try:
                db.delete(resume)
                db.commit()
            except Exception:
                db.rollback()
                logger.exception(
                    "Database cleanup failed after resume processing error."
                )

        raise

    except Exception:
        if object_uploaded:
            try:
                delete_file(file_metadata["object_key"])
            except Exception:
                logger.exception(
                    "R2 cleanup failed after resume processing error."
                )

        if resume is not None:
            try:
                db.delete(resume)
                db.commit()
            except Exception:
                db.rollback()
                logger.exception(
                    "Database cleanup failed after resume processing error."
                )

        logger.exception("Resume processing failed.")

        raise HTTPException(
            status_code=500,
            detail="Failed to process resume.",
        )

    finally:
        try:
            os.remove(temp_file_path)
        except OSError:
            pass


def get_owned_resume(
    db: Session,
    resume_id: int,
    user: User,
) -> Resume:
    """Retrieve a resume only if it belongs to the authenticated user."""
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


def claim_anonymous_resume(
    db: Session,
    resume_id: int,
    user: User,
) -> Resume:
    """
    Claim an anonymous resume for the authenticated user.

    A resume can only be claimed when it currently has no owner.
    """
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .with_for_update()
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    if resume.user_id == user.id:
        return resume

    if resume.user_id is None:
        resume.user_id = user.id

        try:
            db.commit()
            db.refresh(resume)
        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "Database error while claiming resume."
            )

            raise HTTPException(
                status_code=500,
                detail="Failed to claim resume.",
            )

        return resume

    raise HTTPException(
        status_code=403,
        detail="You do not have access to this resume.",
    )
