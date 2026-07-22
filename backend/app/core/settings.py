from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    
    PROJECT_NAME: str
    
    DATABASE_URL: str
    
    SECRET_KEY: str
    
    DEBUG: bool = False
    
    MAX_FILE_SIZE: str
    
    UPLOAD_DIR: str
    
    class Config:
        env_file = ".env"
    
settings = Settings()