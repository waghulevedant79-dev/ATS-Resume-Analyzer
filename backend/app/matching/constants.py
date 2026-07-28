DEGREE_LEVELS = {
    1: [
        "diploma",
    ],

    2: [
        "bachelor",
        "be",
        "b.e",
        "btech",
        "b.tech",
        "bachelor of engineering",
        "bachelor of technology",
        "bachelor's degree"
    ],

    3: [
        "master",
        "me",
        "m.e",
        "mtech",
        "m.tech",
        "master of engineering",
        "master of technology",
    ],

    4: [
        "phd",
        "doctorate",
        "doctor of philosophy",
    ],
}


MONTHS = {
    "jan": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "may": 5,
    "jun": 6,
    "jul": 7,
    "aug": 8,
    "sep": 9,
    "oct": 10,
    "nov": 11,
    "dec": 12,
}


RESPONSIBILITY_MATCH_THRESHOLD = 0.40


STOP_WORDS = {
    "and",
    "or",
    "the",
    "a",
    "an",
    "to",
    "of",
    "for",
    "with",
    "in",
    "on",
    "at",
    "by",
    "from",
    "is",
    "are",
}


MATCH_WEIGHTS = {
    "skills": 0.50,
    "experience": 0.25,
    "education": 0.15,
    "responsibilities": 0.10,
}


RELATED_BRANCHES = {
    "computer engineering": {
        "computer engineering",
        "computer science",
        "information technology",
        "software engineering",
        "artificial intelligence",
        "artificial intelligence and data science",
        "data science",
    },

    "computer science": {
        "computer engineering",
        "computer science",
        "information technology",
        "software engineering",
        "artificial intelligence",
        "artificial intelligence and data science",
        "data science",
    },

    "information technology": {
        "computer engineering",
        "computer science",
        "information technology",
        "software engineering",
        "artificial intelligence",
        "artificial intelligence and data science",
        "data science",
    },
}


BRANCH_ALIASES = {
    "computer engineering": [
        "computer engineering",
        "computer engg",
        "computer engineer",
    ],

    "computer science": [
        "computer science",
        "computer science engineering",
        "cse",
    ],

    "information technology": [
        "information technology",
        "it",
    ],

    "software engineering": [
        "software engineering",
    ],

    "artificial intelligence": [
        "artificial intelligence",
        "ai",
    ],

    "artificial intelligence and data science": [
        "artificial intelligence and data science",
        "ai & ds",
        "ai and ds",
        "aids",
    ],

    "data science": [
        "data science",
        "ds",
    ],

    "mechanical engineering": [
        "mechanical engineering",
        "mechanical",
    ],

    "electronics and communication": [
        "electronics and communication",
        "electronics",
        "ece",
    ],
}

