from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    
    PROJECT_NAME: str
    
    DATABASE_URL: str
    
    SECRET_KEY: str
    
    DEBUG: bool = False
    
    UPLOAD_DIR: str
    
    GEMINI_API_KEY: str
    
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    GOOGLE_CLIENT_ID: str | None = None
    
    class Config:
        env_file = ".env"
    
settings = Settings()