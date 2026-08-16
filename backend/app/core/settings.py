from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    PROJECT_NAME: str

    DATABASE_URL: str

    SECRET_KEY: str

    DEBUG: bool = False

    B2_ENDPOINT_URL: str

    B2_ACCESS_KEY_ID: str

    B2_SECRET_ACCESS_KEY: str

    B2_BUCKET_NAME: str

    GEMINI_API_KEY: str

    GEMINI_MODEL: str = "gemini-2.5-flash"

    OPENROUTER_API_KEY: str

    NVIDIA_MODEL: str = "nvidia/nemotron-3.5-lightning:free"

    GOOGLE_CLIENT_ID: str | None = None

    AUTH_COOKIE_NAME: str = "ats_session"

    AUTH_COOKIE_SECURE: bool = False

    AUTH_COOKIE_SAMESITE: str = "lax"

    AUTH_COOKIE_MAX_AGE: int = 60 * 60 * 24 * 7

    class Config:
        env_file = ".env"


settings = Settings()
