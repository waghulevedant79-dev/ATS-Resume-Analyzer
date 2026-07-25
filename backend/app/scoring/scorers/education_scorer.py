from app.scoring.scorers.constants import (
    EDUCATION_SCORE,
    MAX_EDUCATION_SCORE,
)
from app.schemas.scorer import ScoreResult
from app.schemas.parser import ParsedResume


def score_education(parsed_resume: ParsedResume) -> ScoreResult:

    education = parsed_resume.education

    if education:
        return ScoreResult(
                
                    score=EDUCATION_SCORE,
                    
                    max_score=MAX_EDUCATION_SCORE,
                    
                    details= {
                        
                        "present": True
                        
                    }
                )

    return ScoreResult(
            
                score=0,
                
                max_score=MAX_EDUCATION_SCORE,
                
                details= {
                    
                    "present": False
                    
                }
            )