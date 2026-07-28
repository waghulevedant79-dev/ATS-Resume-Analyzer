from sentence_transformers import util
from app.semantic.constants import SKILLS_SIMILARITY_THRESHOLD


def cosine_similarity(embedding1, embedding2) -> float:
    similarity = util.cos_sim(
        embedding1,
        embedding2
    )

    return float(similarity.item())


def is_semantic_match(
    embedding1,
    embedding2,
) -> bool:

    return (
        cosine_similarity(
            embedding1,
            embedding2,
        )
        >= SKILLS_SIMILARITY_THRESHOLD
    )