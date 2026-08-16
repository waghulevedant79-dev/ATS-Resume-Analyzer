import os
import shutil
import tempfile
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile


MAX_FILE_SIZE = 10 * 1024 * 1024

ALLOWED_EXTENSION = {
    ".pdf",
    ".docx",
}

ALLOWED_CONTENT_TYPE = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def generate_unique_filename(filename: str) -> str:
    """Generate a unique stored filename while preserving the extension."""
    extension = Path(filename).suffix.lower()
    return f"{uuid.uuid4()}{extension}"


def validate_extension(file: UploadFile) -> None:
    """Validate the uploaded resume extension and MIME type."""
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must have a filename.",
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSION:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX file formats are allowed.",
        )

    if file.content_type not in ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=400,
            detail="Invalid file content type.",
        )


def save_temp_file(file: UploadFile) -> dict:
    """
    Validate the upload and create an ephemeral local processing file.

    This file is NOT persistent application storage. It exists only long
    enough for the existing PDF/DOCX parsers to process the upload and is
    deleted by the resume service after processing.
    """
    validate_extension(file)

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Maximum allowed file size is 10 MB.",
        )

    stored_filename = generate_unique_filename(file.filename)
    suffix = Path(file.filename).suffix.lower()

    fd, temp_path = tempfile.mkstemp(
        prefix="ats_resume_",
        suffix=suffix,
    )

    try:
        with os.fdopen(fd, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception:
        try:
            os.remove(temp_path)
        except OSError:
            pass
        raise

    return {
        "original_filename": file.filename,
        "stored_filename": stored_filename,
        "temp_file_path": temp_path,
        "file_type": suffix.lstrip("."),
        "content_type": file.content_type,
        "size": size,
    }
