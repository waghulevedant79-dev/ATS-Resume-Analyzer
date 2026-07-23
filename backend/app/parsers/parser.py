import os

from app.parsers.pdf_parser import extract_text_from_pdf
from app.parsers.docx_parser import extract_text_from_docx
from app.parsers.preprocessing import preprocess_text

from app.parsers.extractor import (
    extract_name,
    extract_phone,
    extract_email,
    extract_github,
    extract_linkedin,
    extract_sections
)


def parse_resume(file_path: str) -> dict:
    
    # here lowercasing the file extension
    extension = os.path.splitext(file_path)[1].lower()
    
    if extension == ".pdf":
        raw_text = extract_text_from_pdf(file_path)
    
    elif extension == ".docx":
        raw_text = extract_text_from_docx(file_path)
    
    else:
        raise ValueError("Unsupported file format.")
    
    clean_text = preprocess_text(raw_text)
    
    sections = extract_sections(clean_text)
    
    return {
        "name": extract_name(clean_text),
        "email": extract_email(clean_text),
        "phone": extract_phone(clean_text),
        "linkedin": extract_linkedin(clean_text),
        "github": extract_github(clean_text),
        "skills": sections["skills"],
        "education": sections["education"],
        "experience": sections["experience"],
        "projects": sections["projects"],
        "certifications": sections["certifications"],
        "raw_text": clean_text,
    }