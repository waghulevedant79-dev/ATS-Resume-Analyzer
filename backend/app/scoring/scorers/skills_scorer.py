from backend.app.scoring.scorers.constants import (
    MAX_SKILLS_SCORE,
    SKILLS_THRESHOLDS,
)
from app.schemas.scorer import ScoreResult
from app.schemas.parser import ParsedResume


def score_skills(parsed_resume: ParsedResume) -> ScoreResult:

    skills = parsed_resume.skills

    skill_count = len(skills)

    score = 0

    for minimum_required, marks in SKILLS_THRESHOLDS:

        if skill_count >= minimum_required:
            score = marks
            break

    return ScoreResult(
            
                score=score,
                
                max_score=MAX_SKILLS_SCORE,
                
                details= {
                    
                    "count": skill_count
                    
                }
            )