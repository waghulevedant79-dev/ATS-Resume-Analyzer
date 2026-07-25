from app.scoring.scorers.constants import (
    MAX_CERTIFICATION_SCORE,
    CERTIFICATION_THRESHOLDS,
)
from app.schemas.scorer import ScoreResult
from app.schemas.parser import ParsedResume


def score_certifications(parsed_resume: ParsedResume) -> ScoreResult:

    certifications = parsed_resume.certifications

    certification_count = len(certifications)

    score = 0

    for minimum_required, marks in CERTIFICATION_THRESHOLDS:
        if certification_count >= minimum_required:
            score = marks
            break

    return ScoreResult(
            
                score=score,
                
                max_score=MAX_CERTIFICATION_SCORE,
                
                details= {
                    
                    "count": certification_count
                    
                }
            )