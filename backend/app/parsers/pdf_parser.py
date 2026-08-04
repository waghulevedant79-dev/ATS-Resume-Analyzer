import fitz

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract all text from PDF file.
    """
    
    with fitz.open(file_path) as document:
    
        extracted_text = []
    
        for page in document:
            extracted_text.append(page.get_text())
    
    return "\n".join(extracted_text)