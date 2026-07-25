from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.schemas.matching import MatchResult

from app.matching.engine import (
    match_resume_to_job_description,
)

def create_match(
    resume: ParsedResume,
    job_description: ParsedJobDescription,
) -> MatchResult:
    
    return match_resume_to_job_description(
        resume,
        job_description
    )