import re
from app.job_description.constants import RAW_SECTION_HEADINGS

def normalize_heading(text: str) -> str:
    text = text.lower().strip()

    # Remove punctuation such as :, -, •, etc.
    text = re.sub(r"[^a-z0-9\s]", "", text)

    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text

SECTION_HEADINGS = {
    section: {
        normalize_heading(heading)
        for heading in headings
    }
    for section, headings in RAW_SECTION_HEADINGS.items()
}