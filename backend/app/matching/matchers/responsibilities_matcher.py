from app.schemas.resume import ParsedResume
from app.schemas.job_description import ParsedJobDescription
from app.schemas.matching import (
    ResponsibilitiesMatchResult,
)
from app.semantic.encoder import encoder
from app.semantic.similarity import cosine_similarity
from app.semantic.constants import (
    RESPONSIBILITY_SIMILARITY_THRESHOLD,
)


def match_responsibilities(
    resume: ParsedResume,
    job_description: ParsedJobDescription,
) -> ResponsibilitiesMatchResult:
    
    resume_responsibilities = {
        line.strip()
        for line in (
            resume.experience + resume.projects
        )
        if line.strip()
    }

    jd_responsibilities = {
        line.strip()
        for line in job_description.responsibilities
            if line.strip()
    }
    
    """Exact matches"""
    matched_responsibilities = (
        resume_responsibilities &
        jd_responsibilities
    )

    remaining_resume = (
        resume_responsibilities -
        matched_responsibilities
    )

    remaining_jd = (
        jd_responsibilities -
        matched_responsibilities
    )
    
    """Batch encode once"""
    resume_embeddings = dict(
        zip(
            remaining_resume,
            encoder.encode_batch(
                list(remaining_resume)
            ),
        )
    )

    jd_embeddings = dict(
        zip(
            remaining_jd,
            encoder.encode_batch(
                list(remaining_jd)
            ),
        )
    )
    
    semantic_matches = 0

    for jd_line in list(remaining_jd):

        jd_embedding = jd_embeddings[jd_line]

        for resume_line in list(remaining_resume):

            resume_embedding = (
                resume_embeddings[resume_line]
            )

            similarity = cosine_similarity(
                resume_embedding,
                jd_embedding,
            )
            

            if (
                similarity
                >= RESPONSIBILITY_SIMILARITY_THRESHOLD
            ):

                semantic_matches += 1

                remaining_resume.remove(
                    resume_line
                )

                break
    
    matched = (
        len(matched_responsibilities)
        + semantic_matches
    )

    total = len(jd_responsibilities)

    if total == 0:
        percentage = 0.0
    else:
        percentage = (
            matched / total
        ) * 100

    
    return ResponsibilitiesMatchResult(

    matched_responsibilities=matched,

    total_responsibilities=total,

    match_percentage=round(
        percentage,
        2,
    ),
)