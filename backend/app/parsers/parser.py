import os

from app.parsers.pdf_parser import extract_text_from_pdf
from app.parsers.docx_parser import extract_text_from_docx
from app.parsers.preprocessing import preprocess_text
from app.schemas.parser import ParsedResume
from app.parsers.utils import clean_section_lines

from app.parsers.extractor import (
    extract_name,
    extract_phone,
    extract_email,
    extract_github,
    extract_linkedin,
    extract_sections,
    extract_skills,
    extract_experience,
    extract_projects,
    extract_project_details,
    extract_responsibilities
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
    

    
    return ParsedResume(
        
        name= extract_name(clean_text),
        
        email= extract_email(clean_text),
        
        phone= extract_phone(clean_text),
        
        linkedin= extract_linkedin(clean_text),
        
        github= extract_github(clean_text),
        
        skills= extract_skills(sections["skills"]),
        
        education= clean_section_lines(sections["education"]),
        
        summary= (sections["summary"]),
        
        experience = extract_experience(sections["experience"]),
        
        responsibilities=extract_responsibilities(sections["experience"]),
        
        projects= extract_projects(sections["projects"]),
        
        project_details=extract_project_details(sections["projects"]),
        
        certifications= clean_section_lines(sections["certifications"]),
        
        raw_text= clean_text,
        
    )
