from fastapi import FastAPI
from app.core.settings import settings
from app.api.resume import router as resume_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    database=settings.DATABASE_URL
)

@app.get('/')
def home():
    return {
        f"Welcome to our project, {settings.PROJECT_NAME} "
    }
    

app.include_router(resume_router)