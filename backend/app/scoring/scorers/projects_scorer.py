from app.scoring.scorers.constants import (
    MAX_PROJECTS_SCORE,
    PROJECT_THRESHOLDS,
)
from app.schemas.scorer import ScoreResult
from app.schemas.parser import ParsedResume


def score_projects(parsed_resume: ParsedResume) -> ScoreResult:

    projects = parsed_resume.projects

    project_count = len(projects)

    score = 0

    for minimum_required, marks in PROJECT_THRESHOLDS:

        if project_count >= minimum_required:
            score = marks
            break

    return ScoreResult(
        
        score=score,
        
        max_score=MAX_PROJECTS_SCORE,
        
        details= {
            
            "count": project_count
            
        }
    )