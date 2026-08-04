from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
import logging

from app.models.resume import Resume
from app.models.parsed_resume import ResumeParsedData
from app.schemas.parser import ParsedResume


logger = logging.getLogger(__name__)


def save_parsed_resume(
    db: Session,
    resume: Resume,
    parsed_resume: ParsedResume,
) -> ResumeParsedData:
    """
    Store parsed resume data in the database.
    """

    try:

        data = parsed_resume.model_dump()

        data["resume_id"] = resume.id

        parsed_data = ResumeParsedData(**data)

        db.add(parsed_data)

        db.commit()

        db.refresh(parsed_data)

        return parsed_data

    except SQLAlchemyError:

        db.rollback()

        logger.exception(
            "Failed to save parsed resume."
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to save parsed resume.",
        )


def get_parsed_resume(
    db: Session,
    resume_id: int,
) -> ResumeParsedData | None:
    """
    Retrieve parsed resume by resume ID.
    """

    return (
        db.query(ResumeParsedData)
        .filter(
            ResumeParsedData.resume_id == resume_id
        )
        .first()
    )


def get_parsed_resume_or_404(
    db: Session,
    resume_id: int,
) -> ResumeParsedData:
    """
    Retrieve parsed resume or raise 404 if it doesn't exist.
    """

    parsed_resume = get_parsed_resume(
        db=db,
        resume_id=resume_id,
    )

    if parsed_resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    return parsed_resume


def get_parsed_resume_schema(
    db: Session,
    resume_id: int,
) -> ParsedResume:
    """
    Retrieve a parsed resume and convert it to the
    ParsedResume Pydantic schema.
    """

    parsed_resume = (
        db.query(ResumeParsedData)
        .filter(
            ResumeParsedData.resume_id == resume_id
        )
        .first()
    )

    if parsed_resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    return ParsedResume.model_validate(parsed_resume)