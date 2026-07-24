from backend.app.scoring.scorers.constants import (
    MAX_LENGTH_SCORE,
    MIN_RECOMMENDED_WORDS,
    MAX_RECOMMENDED_WORDS,
)
from app.schemas.scorer import ScoreResult
from app.schemas.parser import ParsedResume


def score_resume_length(parsed_resume: ParsedResume) -> ScoreResult:

    text = parsed_resume.raw_text

    word_count = len(text.split())

    if word_count < MIN_RECOMMENDED_WORDS:
        score = 2

    elif word_count <= MAX_RECOMMENDED_WORDS:
        score = MAX_LENGTH_SCORE

    else:
        score = 5

    return ScoreResult(
            
                score=score,
                
                max_score=MAX_LENGTH_SCORE,
                
                details= {
                    
                    "count": word_count
                    
                }
            )