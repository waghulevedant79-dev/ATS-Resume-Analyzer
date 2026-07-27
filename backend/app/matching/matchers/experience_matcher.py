from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.matching.utils import extract_years, extract_total_experience
from app.schemas.matching import ExperienceMatchResult


def match_experience(
    resume: ParsedResume,
    job_description: ParsedJobDescription,
) -> ExperienceMatchResult:
    
    required = 0.0

    for line in job_description.experience:

        years = extract_years(line)

        if years is not None:
            required = years
            break


    candidate = extract_total_experience(
        resume.experience
    )

    matched = candidate >= required
    
    return ExperienceMatchResult(
        
    required_years=required,
    
    candidate_years=candidate,
    
    matched=matched,
    
)