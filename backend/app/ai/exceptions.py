class AIException(Exception):
    """Base exception for all AI-related errors."""
    pass


class AIResponseParseError(AIException):
    """Raised when the AI response is not valid JSON."""
    pass


class AIResponseValidationError(AIException):
    """Raised when the AI response does not match the expected schema."""
    pass