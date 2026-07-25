from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.matching.utils import tokenize_text
from app.schemas.matching import (
    ResponsibilitiesMatchResult,
)


def match_responsibilities(
    resume: ParsedResume,
    job_description: ParsedJobDescription,
) -> ResponsibilitiesMatchResult:
    
    resume_words = set()

    for line in resume.experience:

        resume_words.update(
            tokenize_text(line)
        )
    
    matched = 0
    
    for line in job_description.responsibilities:

        jd_words = tokenize_text(line)

        common_words = (
            resume_words & jd_words
        )

        if common_words:

            matched += 1
    
    total = len(
    job_description.responsibilities
)
    
    if total == 0:
        percentage = 0.0
    else:
        percentage = (
            matched / total
        ) * 100
        
    
    return ResponsibilitiesMatchResult(

    matched_responsibilities=matched,

    total_responsibilities=total,

    match_percentage=round(
        percentage,
        2,
    ),
)