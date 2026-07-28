from sentence_transformers import SentenceTransformer

from app.semantic.constants import MODEL_NAME


class SemanticEncoder:
    def __init__(self):
        self.model = SentenceTransformer(MODEL_NAME)

    def encode(self, text: str):
        return self.model.encode(text)
    
    def encode_batch(self, texts: list[str]):
        return self.model.encode(texts)


encoder = SemanticEncoder()