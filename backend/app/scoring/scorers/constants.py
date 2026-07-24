"""
ATS Scoring Constants

This file contains all configurable scoring rules for the ATS Rule Engine.
If the business rules change in the future, update this file only.
"""

# Contact Details Scoring

EMAIL_SCORE = 2
PHONE_SCORE = 2
LINKEDIN_SCORE = 2
GITHUB_SCORE = 2
PORTFOLIO_SCORE = 2

MAX_CONTACT_SCORE = (
    EMAIL_SCORE
    + PHONE_SCORE
    + LINKEDIN_SCORE
    + GITHUB_SCORE
    + PORTFOLIO_SCORE
)


# Skills Scoring

MAX_SKILLS_SCORE = 20

SKILLS_THRESHOLDS = [
    (10, 20),
    (7, 15),
    (4, 10),
    (1, 5),
]


# Projects Scoring

MAX_PROJECTS_SCORE = 20

PROJECT_THRESHOLDS = [
    (3, 20),
    (2, 10),
    (1, 5),
]


# Experience Scoring

MAX_EXPERIENCE_SCORE = 20

EXPERIENCE_THRESHOLDS = [
    (2, 20),
    (1, 10),
]


# Education Scoring

EDUCATION_SCORE = 15
MAX_EDUCATION_SCORE = 15


# Certification Scoring

MAX_CERTIFICATION_SCORE = 10

CERTIFICATION_THRESHOLDS = [
    (2, 10),
    (1, 5),
]


# Resume Length Scoring

MAX_LENGTH_SCORE = 10

MIN_RECOMMENDED_WORDS = 250
MAX_RECOMMENDED_WORDS = 700


# Action Verb Scoring

MAX_ACTION_VERB_SCORE = 10

ACTION_VERBS = {
    "developed",
    "designed",
    "implemented",
    "built",
    "created",
    "optimized",
    "engineered",
    "improved",
    "trained",
    "collaborated",
    "managed",
    "led",
    "deployed",
    "integrated",
    "automated",
    "maintained",
    "analyzed",
    "evaluated",
    "tested",
    "configured",
}


# Section Completeness Scoring

SUMMARY_SCORE = 2
EDUCATION_SECTION_SCORE = 2
EXPERIENCE_SECTION_SCORE = 2
PROJECT_SECTION_SCORE = 2
SKILLS_SECTION_SCORE = 2

MAX_SECTION_COMPLETENESS_SCORE = (
    SUMMARY_SCORE
    + EDUCATION_SECTION_SCORE
    + EXPERIENCE_SECTION_SCORE
    + PROJECT_SECTION_SCORE
    + SKILLS_SECTION_SCORE
)