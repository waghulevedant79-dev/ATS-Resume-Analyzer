from backend.app.scoring.scorers.constants import (
    EMAIL_SCORE,
    PHONE_SCORE,
    GITHUB_SCORE,
    LINKEDIN_SCORE,
    PORTFOLIO_SCORE,
    MAX_CONTACT_SCORE
)
from app.schemas.scorer import ScoreResult



def score_contact_details(parsed_resume: dict) -> dict:
    
    score = 0
    
    earned = {}
    
    missing = []
    
    if parsed_resume.email:
        score += EMAIL_SCORE
        earned["email"] = True
    else:
        earned["email"] = False
        missing.append("Email")
    
    
    if parsed_resume.phone:
        score += PHONE_SCORE
        earned["phone"] = True
    else:
        earned["phone"] = False
        missing.append("Phone")
    
    
    if parsed_resume.github:
        score += GITHUB_SCORE
        earned["github"] = True
    else:
        earned["github"] = False
        missing.append("Github")
    
    
    if parsed_resume.linkedin:
        score += LINKEDIN_SCORE
        earned["linkedin"] = True
    else:
        earned["linkedin"] = False
        missing.append("Linkedin")
    
    
    if parsed_resume.portfolio:
        score += PORTFOLIO_SCORE
        earned["portfolio"] = True
    else:
        earned["portfolio"] = False
        missing.append("Portfolio")
    
    
    return ScoreResult(
            
                score=score,
                
                max_score=MAX_CONTACT_SCORE,
                
                details= {
                    
                    "earned": earned,
                    "missing": missing
                    
                }
            )