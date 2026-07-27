from app.schemas.job_description import ParsedJobDescription
from app.job_description.extactor import(
    extract_job_title,
    extract_education,
    extract_experience,
    extract_preferred_skills,
    extract_required_skills,
    extract_responsibilities,
    extract_sections,
    extract_tools
    )


def parse_job_description(job_description: str) -> ParsedJobDescription:
    """
    Parse a raw job description into structured data.
    """
    

    sections = extract_sections(job_description)

    parsed_jd = ParsedJobDescription(
        
        job_title= extract_job_title(job_description),
        
        required_skills=extract_required_skills(
            sections["required_skills"]
        ),
        
        preferred_skills=extract_preferred_skills(
            sections["preferred_skills"]
        ),
        
        education=extract_education(
            sections["education"]
        ),
        
        experience=extract_experience(
            sections["experience"]
        ),
        
        responsibilities=extract_responsibilities(
            sections["responsibilities"]
        ),
        
        tools=extract_tools(
            sections["tools"]
        ),
        
    )
    
    print(parsed_jd.model_dump())

    return parsed_jd
