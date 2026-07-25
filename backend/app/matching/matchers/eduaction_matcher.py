from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.schemas.matching import EducationMatchResult
from app.matching.utils import extract_degree_level


def match_education(
    resume: ParsedResume,
    job_description: ParsedJobDescription,
) -> EducationMatchResult:
    
    candidate_level = 0

    for line in resume.education:

        candidate_level = max(
            candidate_level,
            extract_degree_level(line),
        )

    required_level = 0

    for line in job_description.education:

        required_level = max(
            required_level,
            extract_degree_level(line),
        )
    
    matched = candidate_level >= required_level
    
    return EducationMatchResult(

    required_level=required_level,

    candidate_level=candidate_level,

    matched=matched,
)