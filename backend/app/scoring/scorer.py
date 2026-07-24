from app.scoring.scorers.contact_scorer import score_contact_details
from app.scoring.scorers.skills_scorer import score_skills
from app.scoring.scorers.education_scorer import score_education
from app.scoring.scorers.projects_scorer import score_projects
from app.scoring.scorers.experience_scorer import score_experience
from app.scoring.scorers.certification_scorer import score_certifications
from app.scoring.scorers.length_scorer import score_resume_length
from app.scoring.scorers.action_verbs_scorer import score_action_verbs
from app.scoring.scorers.section_completeness_scorer import score_section_completeness
from app.schemas.ats_score import ATSScoreResponse


def calculate_ats_score(parsed_resume: dict) -> dict:
    

        
        contact= score_contact_details(parsed_resume)
        
        skills= score_skills(parsed_resume)
        
        education= score_education(parsed_resume)
        
        projects= score_projects(parsed_resume)
        
        experience= score_experience(parsed_resume)
        
        certifications= score_certifications(parsed_resume)
        
        resume_length= score_resume_length(parsed_resume)
        
        action_verbs= score_action_verbs(parsed_resume)
        
        section_completeness= score_section_completeness(parsed_resume)
        

        breakdown = {
            
            "contact_details": contact,
            
            "skills": skills,
            
            "education": education,
            
            "projects": projects,
            
            "experience": experience,
            
            "certifications": certifications,
            
            "resume_length": resume_length,
            
            "action_verbs": action_verbs,
            
            "section_completeness": section_completeness,
            
        }
        
        overall_score = sum(
            result.score
            for result in breakdown.values()
        )
        
        max_score = sum(
            result.max_score
            for result in breakdown.values()
        )
        
        percentage = round(
            (overall_score / max_score) * 100,
            2
        )
        
        return ATSScoreResponse(
            
            overall_score=overall_score,
            
            max_score=max_score,
            
            percentage=percentage,
            
            breakdown=breakdown
            
        )