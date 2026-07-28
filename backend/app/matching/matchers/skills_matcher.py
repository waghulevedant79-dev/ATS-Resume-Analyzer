from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.schemas.matching import SkillMatchResult
from app.matching.utils import normalize_text
from app.semantic.similarity import is_semantic_match
from app.semantic.encoder import encoder


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

    """Here we are exact matching."""
    matched_skills = set(resume_skills & jd_skills)
    
    remaining_resume_skills = resume_skills - matched_skills
    
    remaining_jd_skills = jd_skills - matched_skills
    
    resume_embeddings = dict(
    zip(
        remaining_resume_skills,
        encoder.encode_batch(list(remaining_resume_skills))
        )
    )

    jd_embeddings = dict(
        zip(
            remaining_jd_skills,
            encoder.encode_batch(list(remaining_jd_skills))
        )
    )
    
    semantic_matches = set()

    missing_skills = set()
    
    """Here we are semantic matching"""
    
    for jd_skill in remaining_jd_skills:

        found_match = False

        jd_embedding = jd_embeddings[jd_skill]

        for resume_skill in list(remaining_resume_skills):

            resume_embedding = resume_embeddings[resume_skill]

            if is_semantic_match(
                resume_embedding,
                jd_embedding,
            ):

                semantic_matches.add(jd_skill)

                remaining_resume_skills.remove(resume_skill)

                found_match = True

                break

        if not found_match:
            missing_skills.add(jd_skill)
    
    all_matched_skills = sorted(
        matched_skills | semantic_matches
    )
    
    """calculate how much total skills are required"""
    total_required_skills = len(jd_skills)

    """calculate how much total skills are matched"""
    total_matched_skills = len(all_matched_skills)
    
    """calculate percentage skills matched"""
    if total_required_skills == 0:
        match_percentage = 0.0
    else:
        match_percentage = (
            total_matched_skills / total_required_skills
        ) * 100


    return SkillMatchResult(

    matched_skills=all_matched_skills,

    missing_skills=missing_skills,

    total_required_skills=total_required_skills,

    total_matched_skills=total_matched_skills,

    match_percentage=round(match_percentage, 2),
)