import fitz

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract all text from PDF file.
    """
    
    doucument = fitz.open(file_path)
    
    extracted_text = []
    
    for page in doucument:
        extracted_text.append(page.get_text())
        
    doucument.close()
    
    return "\n".join(extracted_text)