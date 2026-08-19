from fastembed import TextEmbedding

from app.semantic.constants import MODEL_NAME


class SemanticEncoder:
    def __init__(self):
        # Load the embedding model only when semantic matching is actually used.
        self.model = None

    def _get_model(self) -> TextEmbedding:
        if self.model is None:
            self.model = TextEmbedding(model_name=MODEL_NAME)
        return self.model

    def encode(self, text: str):
        return next(self._get_model().embed([text]))

    def encode_batch(self, texts: list[str]):
        if not texts:
            return []
        return list(self._get_model().embed(texts))


encoder = SemanticEncoder()
