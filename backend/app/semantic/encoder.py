from sentence_transformers import SentenceTransformer

from app.semantic.constants import MODEL_NAME


class SemanticEncoder:
    def __init__(self):
        self.model = None

    def _get_model(self):
        if self.model is None:
            self.model = SentenceTransformer(MODEL_NAME)

        return self.model

    def encode(self, text: str):
        return self._get_model().encode(text)

    def encode_batch(self, texts: list[str]):
        return self._get_model().encode(texts)


encoder = SemanticEncoder()