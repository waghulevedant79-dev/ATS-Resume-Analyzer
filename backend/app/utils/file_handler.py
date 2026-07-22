import uuid, shutil
from pathlib import Path
from fastapi import HTTPException, UploadFile
from app.core.settings import settings

UPLOAD_DIR = Path(settings.UPLOAD_DIR)


ALLOWED_EXTENSION = {
    ".pdf",
    ".docx"
}

ALLOWED_CONTENT_TYPE = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

def generate_unique_filename(filename : str) -> str:
    """
    Generate unique filename while preserving original extension
    """
    
    extension = Path(filename).suffix
    
    unique_name = f"{uuid.uuid4()}{extension}"
    
    return unique_name


def validate_extension(file: UploadFile) -> None:
    """
    Validating file extenstion and MIME type 
    """
    extension = Path(file.filename).suffix.lower()
    
    if extension not in ALLOWED_EXTENSION:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX file format are allowed."
        )
        
    if file.content_type not in ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=400,
            detail="invalid file content type."
        )


def save_file(file: UploadFile) -> dict:
    """
    Validate and save the uploaded file
    Returns metadata about saved file
    """
    file.file.seek(0, 2)

    size = file.file.tell()

    file.file.seek(0)
    
    validate_extension(file)
    
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    stored_filename = generate_unique_filename(file.filename)
    
    file_path = UPLOAD_DIR / stored_filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    if size > settings.MAX_FILE_SIZE:
        raise HTTPException(
        status_code=400,
        detail="Maximum allowed file size is 10 MB."
    )
    
    return {
        "original_filename": file.filename,
        "stored_filename": stored_filename,
        "file_path": str(file_path),
        "file_type": Path(file.filename).suffix.lower().replace(".", "")
    }


