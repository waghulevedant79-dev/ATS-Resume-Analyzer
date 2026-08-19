import numpy as np

from app.semantic.constants import SKILLS_SIMILARITY_THRESHOLD


def cosine_similarity(embedding1, embedding2) -> float:
    embedding1 = np.asarray(embedding1, dtype=np.float32)
    embedding2 = np.asarray(embedding2, dtype=np.float32)

    denominator = np.linalg.norm(embedding1) * np.linalg.norm(embedding2)

    if denominator == 0:
        return 0.0

    return float(np.dot(embedding1, embedding2) / denominator)


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
