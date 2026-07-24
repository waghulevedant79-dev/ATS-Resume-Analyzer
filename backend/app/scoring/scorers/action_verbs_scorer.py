from backend.app.scoring.scorers.constants import (
    ACTION_VERBS,
    MAX_ACTION_VERB_SCORE,
)
from app.schemas.scorer import ScoreResult
from app.schemas.parser import ParsedResume


def score_action_verbs(parsed_resume: ParsedResume) -> ScoreResult:

    text = parsed_resume.raw_text.lower()

    found = []

    for verb in ACTION_VERBS:

        if verb in text:

            found.append(verb)

    score = min(len(found), MAX_ACTION_VERB_SCORE)

    return ScoreResult(
        
            score=score,
            
            max_score=MAX_ACTION_VERB_SCORE,
            
            details= {
                
                "count": found
                
            }
        )