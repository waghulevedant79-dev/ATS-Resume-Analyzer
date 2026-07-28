from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.schemas.matching import EducationMatchResult
from app.matching.utils import (
    extract_degree_level,
    extract_branch,
)
from app.matching.constants import RELATED_BRANCHES


def match_education(
    resume: ParsedResume,
    job_description: ParsedJobDescription,
) -> EducationMatchResult:

    resume_education = " ".join(resume.education)
    jd_education = " ".join(job_description.education)
    
    
    resume_level = extract_degree_level(resume_education)
    jd_level = extract_degree_level(jd_education)

    resume_branch = extract_branch(resume_education)
    jd_branch = extract_branch(jd_education)

    # Degree comparison
    degree_match = resume_level >= jd_level

    # Branch comparison
    if not jd_branch:
        branch_match = True

    elif resume_branch == jd_branch:
        branch_match = True

    else:
        branch_match = (
            resume_branch in RELATED_BRANCHES.get(jd_branch, set())
        )
        
    
    return EducationMatchResult(
        required_level=jd_level,
        candidate_level=resume_level,
        matched=degree_match and branch_match,
    )