from backend.app.scoring.scorers.constants import (
    MAX_EXPERIENCE_SCORE,
    EXPERIENCE_THRESHOLDS,
)
from app.schemas.scorer import ScoreResult
from app.schemas.parser import ParsedResume


def score_experience(parsed_resume: ParsedResume) -> ScoreResult:

    experiences = parsed_resume.experience

    experience_count = len(experiences)

    score = 0

    for minimum_required, marks in EXPERIENCE_THRESHOLDS:

        if experience_count >= minimum_required:
            score = marks
            break

    return ScoreResult(
            
                score=score,
                
                max_score=MAX_EXPERIENCE_SCORE,
                
                details= {
                    
                    "count": experience_count
                    
                }
            )