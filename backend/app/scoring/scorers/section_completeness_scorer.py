from app.scoring.scorers.constants import (
    SUMMARY_SCORE,
    EDUCATION_SECTION_SCORE,
    EXPERIENCE_SECTION_SCORE,
    PROJECT_SECTION_SCORE,
    SKILLS_SECTION_SCORE,
    MAX_SECTION_COMPLETENESS_SCORE,
)
from app.schemas.scorer import ScoreResult
from app.schemas.parser import ParsedResume


def score_section_completeness(parsed_resume: ParsedResume) -> ScoreResult:

    score = 0

    present = {}
    missing = []

    # Summary
    if parsed_resume.summary:
        score += SUMMARY_SCORE
        present["summary"] = True
    else:
        present["summary"] = False
        missing.append("Summary")


    # Education
    if parsed_resume.education:
        score += EDUCATION_SECTION_SCORE
        present["education"] = True
    else:
        present["education"] = False
        missing.append("Education")


    # Experience
    if parsed_resume.experience:
        score += EXPERIENCE_SECTION_SCORE
        present["experience"] = True
    else:
        present["experience"] = False
        missing.append("Experience")


    # Projects
    if parsed_resume.projects:
        score += PROJECT_SECTION_SCORE
        present["projects"] = True
    else:
        present["projects"] = False
        missing.append("Projects")


    # Skills
    if parsed_resume.skills:
        score += SKILLS_SECTION_SCORE
        present["skills"] = True
    else:
        present["skills"] = False
        missing.append("Skills")


    return ScoreResult(
            
                score=score,
                
                max_score=MAX_SECTION_COMPLETENESS_SCORE,
                
                details= {
                    
                    "present": present,
                    "missing": missing,
                    
                }
            )