from docx import Document

def extract_text_from_docx(file_path: str) -> str:
    """
    Extract all text from a DOCX file.
    """

    document = Document(file_path)

    extracted_text = []

    for paragraph in document.paragraphs:
        extracted_text.append(paragraph.text)

    return "\n".join(extracted_text)