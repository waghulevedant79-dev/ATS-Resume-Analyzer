from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.schemas.matching import SkillMatchResult
from app.matching.utils import normalize_text


def match_skills(
    resume: ParsedResume,
    job_description: ParsedJobDescription,
) -> SkillMatchResult:

    resume_skills = {
        normalize_text(skill)
        for skill in resume.skills
        if skill.strip()
    }

    jd_skills = {
        normalize_text(skill)
        for skill in job_description.required_skills
        if skill.strip()
    }

    matched_skills = sorted(
        resume_skills & jd_skills
    )

    missing_skills = sorted(
        jd_skills - resume_skills
    )
    
    """calculate how much total skills are required"""
    total_required_skills = len(jd_skills)

    """calculate how much total skills are matched"""
    total_matched_skills = len(matched_skills)
    
    """calculate percentage skills matched"""
    if total_required_skills == 0:
        match_percentage = 0.0
    else:
        match_percentage = (
            total_matched_skills / total_required_skills
        ) * 100


    return SkillMatchResult(

    matched_skills=matched_skills,

    missing_skills=missing_skills,

    total_required_skills=total_required_skills,

    total_matched_skills=total_matched_skills,

    match_percentage=round(match_percentage, 2),
)