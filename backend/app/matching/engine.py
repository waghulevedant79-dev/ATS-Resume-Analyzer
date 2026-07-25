from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.schemas.matching import MatchResult
from app.matching.matchers.skills_matcher import match_skills
from app.matching.matchers.experience_matcher import match_experience
from app.matching.matchers.eduaction_matcher import match_education
from app.matching.matchers.responsibilities_matcher import match_responsibilities
from app.matching.utils import calculate_overall_score



def match_resume_to_job_description(
    resume: ParsedResume,
    job_description: ParsedJobDescription,
    ) -> MatchResult:
    
    skills_result = match_skills(
    resume,
    job_description,
    )
    
    experience_result = match_experience(
    resume,
    job_description,
    )
    
    education_result = match_education(
    resume,
    job_description,
    )
    
    responsibilities_result = (
    match_responsibilities(
        resume,
        job_description,
        )
    )
    
    overall_score = calculate_overall_score(
        skills=skills_result,
        experience=experience_result,
        education=education_result,
        responsibilities=responsibilities_result,
    )
    
    return MatchResult(
        
        overall_match=overall_score,
        
        skills=skills_result,
        
        experience=experience_result,
        
        education=education_result,
        
        responsibilities=responsibilities_result
        
    )