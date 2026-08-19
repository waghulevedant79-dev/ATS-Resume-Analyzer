from fastapi import FastAPI
from app.core.settings import settings
from app.api.resume import router as resume_router
from app.api.matching import router as match_router
from app.api.ai import router as ai_router
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    database=settings.DATABASE_URL
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def home():
    return {
        f"Welcome to our project, {settings.PROJECT_NAME} "
    }

@app.get("/healthz")
def health_check():
    return {"status": "ok"}

app.include_router(resume_router)
app.include_router(match_router)
app.include_router(ai_router)
app.include_router(auth_router)