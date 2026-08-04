import fitz
import logging

logger = logging.getLogger(__name__)


def extract_hyperlinks(file_path: str) -> list[str]:
    """
    Extract all external hyperlinks from a PDF.

    Args:
        file_path: Path to the PDF resume.

    Returns:
        A list of unique external URLs.
        Returns an empty list if hyperlink extraction fails.
    """

    urls: set[str] = set()

    try:
        with fitz.open(file_path) as document:

            for page in document:
                try:
                    links = page.get_links()

                    for link in links:
                        uri = link.get("uri")

                        if uri and uri.startswith(("http://", "https://")):
                            urls.add(uri)

                except Exception as error:
                    logger.warning(
                        "Failed to extract hyperlinks from page %d: %s",
                        page.number + 1,
                        error,
                    )

    except Exception:
        logger.exception(
            "Failed to extract hyperlinks from PDF: %s",
            file_path,
        )
        return []

    return sorted(urls)