# ATS Resume Analyzer

> **AI-Powered ATS Resume Analyzer** built with **React, FastAPI, Python, PostgreSQL, Docker, Backblaze B2, and modular AI/ATS engines**.

------------------------------------------------------------------------

## Version 1.0

**Status:** Backend V1 complete · Frontend V1 complete · Production deployment ready

ATS Resume Analyzer is a production-oriented resume intelligence platform combining deterministic ATS scoring, resume parsing, job-description matching, AI-powered resume improvement, persistent storage, authentication/user ownership, AI usage tracking, and a React frontend.

---

## Overview

ATS Resume Analyzer is a production-style backend application that
analyzes resumes against job descriptions. It combines deterministic ATS
scoring with AI-powered resume intelligence.

Unlike simple resume checkers, the backend follows an **Upload Once →
Reuse Everywhere** architecture.

    Upload Resume
          │
          ▼
    Store Metadata
          │
          ▼
    Parse Resume
          │
          ▼
    Store Parsed Resume
          │
          ▼
    Reuse via resume_id

This prevents repeated uploads, parsing, and duplicate storage while
making every backend feature reusable.

------------------------------------------------------------------------

# Features

## Free Features

-   Resume Upload (.pdf, .docx)
-   Resume Parsing
-   ATS Score
-   Resume & Job Description Matching
-   AI Resume Review
-   ATS Suggestions
-   Resume Tailoring

## Premium Features

-   Professional Summary Generator
-   Project Description Enhancer
-   Resume Rewrite
-   Missing Keyword Explanation

------------------------------------------------------------------------

# Tech Stack

### Frontend

- React
- Tailwind CSS
- Axios
- React Router
- Component-based dashboard architecture

### Backend

- FastAPI
- Python
- Pydantic
- SQLAlchemy

### Database

- PostgreSQL
- Neon PostgreSQL
- Alembic

### AI

- NVIDIA Nemotron 3.5 Lightning — **Primary**
- Google Gemini 2.5 Flash — **Fallback**
- Provider abstraction
- AI Service layer
- Prompt builders
- Context builders
- Structured response parsing
- MockProvider testing

### File Processing

- PyMuPDF
- python-docx
- Regex / deterministic text normalization

### Persistent Storage

- Backblaze B2
- S3-compatible API
- boto3

### Deployment

- Docker
- Docker Compose
- Render — backend
- Vercel — frontend

### API Testing

- Postman

------------------------------------------------------------------------

# Backend Architecture

                       Upload Resume
                             │
                             ▼
                      Resume Metadata
                             │
                             ▼
                     Parsed Resume Data
                             │
                get_parsed_resume_schema()
                             │
     ┌────────────┬────────────┬────────────┬────────────┐
     ▼            ▼            ▼            ▼
    ATS Score   Matching   AI Features   Future Features

------------------------------------------------------------------------

# Major Backend Modules

## Phase 0 -- Backend Foundation

-   FastAPI project structure
-   Configuration management
-   Database setup
-   Logging
-   Middleware
-   Resume upload endpoint

## Phase 1 -- Resume Parsing

-   PDF & DOCX parsing
-   Contact extraction
-   Skills extraction
-   Education
-   Experience
-   Projects
-   Responsibilities
-   Certifications
-   Hyperlink extraction (GitHub, LinkedIn, Portfolio)

## Phase 2 -- ATS Scoring Engine

-   Rule-based scoring engine
-   Contact scoring
-   Skills scoring
-   Education scoring
-   Experience scoring
-   Projects scoring
-   Resume length
-   Action verbs
-   Section completeness

## Phase 3 -- Resume & JD Matching

-   Job Description parser
-   Skills matching
-   Education matching
-   Experience matching
-   Responsibilities matching
-   Confidence score
-   Overall match score

## Phase 4 -- Matching Engine V2

-   Parser improvements
-   Better skill normalization
-   Better project extraction
-   Better responsibility matching
-   Improved reliability

## Phase 5 -- Backend Polishing

-   Resume lifecycle architecture
-   Parsed resume persistence
-   Resume ID workflow
-   No duplicate uploads
-   AI migration to resume_id architecture

------------------------------------------------------------------------

# Resume Lifecycle

Before

    Upload Resume
     ↓
    Parse
     ↓
    ATS

    Upload Resume
     ↓
    Parse
     ↓
    Matching

    Upload Resume
     ↓
    Parse
     ↓
    AI

After

    Upload Once
          │
          ▼
    resume_id
          │
          ▼
    Stored Parsed Resume
          │
          ▼
    ATS
    Matching
    AI Review
    Summary
    Rewrite
    Project Enhancement
    Keyword Explanation

------------------------------------------------------------------------

# AI Workflow

    Request
        │
        ▼
    Retrieve Parsed Resume
        │
        ▼
    (Optional) Parse Job Description
        │
        ▼
    Build Context
        │
        ▼
    Prompt Builder
        │
        ▼
    Gemini Provider
        │
        ▼
    Response Parser
        │
        ▼
    Structured Response

------------------------------------------------------------------------

# Persistent Resume Storage

Original resume files are no longer permanently stored in the local machine or Docker container.

V1 uses **Backblaze B2** as persistent object storage:

```text
User
  ↓
FastAPI
  ↓
Temporary processing file
  ↓
Resume Parser
  ├──────────────→ Neon PostgreSQL
  │                 metadata + parsed resume
  │
  └──────────────→ Backblaze B2
                    original PDF / DOCX
```

Objects are stored using keys such as:

```text
resumes/<uuid>.pdf
resumes/<uuid>.docx
```

The existing PDF/DOCX parsers may use an ephemeral local file during processing; that file is deleted after the request. It is not persistent application storage.

This makes the Docker backend replaceable without losing user resumes.

------------------------------------------------------------------------

# AI Provider Architecture

V1 uses a provider-based AI architecture:

```text
                    AI Service
                        │
                        ▼
                 Provider Manager
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        Primary Provider      Fallback Provider
              │                   │
              ▼                   ▼
 NVIDIA Nemotron             Google Gemini
 3.5 Lightning               2.5 Flash
```

**Primary:** NVIDIA Nemotron 3.5 Lightning

**Fallback:** Google Gemini 2.5 Flash

Provider-specific logic is isolated behind the provider abstraction.

AI workflow:

```text
Request
  ↓
Retrieve Parsed Resume
  ↓
Optional Job Description
  ↓
Context Builder
  ↓
Prompt Builder
  ↓
Provider Manager
  ↓
Nemotron
  │
  └── failure → Gemini 2.5 Flash
  ↓
Response Cleaning
  ↓
Structured Parser
  ↓
Pydantic Validation
```

------------------------------------------------------------------------

# AI Features

### Free AI

- AI Resume Review
- ATS Improvement Suggestions
- Resume Tailoring Suggestions

### Premium / Advanced AI

- Professional Summary Generator
- Project Description Enhancer
- Missing Keyword Explanation
- Complete Resume Rewrite
- ATS-focused rewrite optimization
- Factual-grounding protections

The deterministic ATS and matching engines remain the source of truth. AI interprets their results and provides improvement guidance rather than replacing deterministic scoring/matching.

------------------------------------------------------------------------

# AI Usage Tracking

V1 includes an AI usage-tracking layer:

```text
AI Request
    ↓
AI Service
    ↓
Provider / Model
    ↓
AI Response
    ↓
Usage Tracking
```

It provides a foundation for:

- Per-user AI usage
- Provider/model usage visibility
- Token/usage information where available
- Free-tier limits
- Premium usage limits
- Future AI cost monitoring
- Future billing/subscription enforcement

Usage tracking is kept separate from individual AI feature implementations.

------------------------------------------------------------------------

# Frontend V1

The project includes a React/Tailwind frontend built on top of the completed backend APIs.

Frontend responsibilities include:

- Resume upload experience
- ATS dashboard/results
- Resume ↔ JD matching experience
- AI feature interaction
- Application navigation
- Loading and error states
- API integration
- User-facing presentation of backend results

The frontend does not duplicate parser, ATS, matching, storage, or AI business logic.

```text
React Frontend
      ↓
FastAPI APIs
      ↓
Resume Lifecycle
      ↓
ATS / Matching / AI
```

------------------------------------------------------------------------

# Authentication & User Ownership

V1 includes authentication/user ownership infrastructure so resumes and analysis data can be associated with users.

Conceptually:

```text
Authenticated User
       ↓
Resume
       ↓
Parsed Resume
       ↓
ATS / Matching / AI
```

Sensitive credentials remain environment-based and are not committed to Git.

------------------------------------------------------------------------

# Docker & Production Architecture

The backend is fully Dockerized and has passed local Docker E2E testing, including the B2 storage path.

```text
Dockerfile
    ↓
Docker Image
    ↓
FastAPI Container
```

The container is replaceable/disposable:

```text
Docker Container
    ├── FastAPI
    ├── Dependencies
    └── Temporary processing only

Neon
    └── Persistent database

Backblaze B2
    └── Persistent resume files
```

Production target:

```text
                    Internet
                       │
                       ▼
                React Frontend
                    Vercel
                       │
                       ▼
                FastAPI Backend
                    Render
                  Dockerized
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        Neon          B2         AI APIs
     PostgreSQL    Backblaze
          │
          ├── users
          ├── resume metadata
          ├── parsed resumes
          └── application data
```

Environment variables are supplied by the hosting platform in production.

------------------------------------------------------------------------

# Project Structure

``` text
backend/
├── app/
│   ├── api/
│   ├── ai/
│   │   ├── builders/
│   │   ├── context/
│   │   ├── prompts/
│   │   ├── utils/
│   │   └── service.py
│   ├── parsers/
│   ├── matching/
│   ├── scoring/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   ├── db/
│   └── integrations/
├── alembic/
├── Dockerfile
├── .dockerignore
├── requirements.txt
└── .gitignore
```

------------------------------------------------------------------------

# Core API Endpoints

## Resume

-   POST `/resumes/upload`

## Matching

-   POST `/matching/match`

## AI

-   POST `/ai/analyze`
-   POST `/ai/professional-summary`
-   POST `/ai/enhance-project`
-   POST `/ai/explain-missing-keywords`
-   POST `/ai/rewrite-resume`

------------------------------------------------------------------------

# Matching Engine

Evaluates

-   Skills
-   Education
-   Experience
-   Responsibilities

Returns

-   Overall Match
-   Confidence
-   Missing Skills
-   Responsibility Match

------------------------------------------------------------------------

# Database

## resumes

Stores uploaded resume metadata.

## resume_parsed_resumes

Stores structured parsed resume data.

Relationship

    Resume (1)
          │
          ▼
    Parsed Resume (1)

------------------------------------------------------------------------

# Installation

``` bash
git clone <repository-url>
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
```

Run migrations

``` bash
alembic upgrade head
```

Run server

``` bash
uvicorn app.main:app --reload
```

------------------------------------------------------------------------

# Environment Variables

Create `.env` locally:

```env
PROJECT_NAME=ATS Resume Analyzer

DATABASE_URL=...
SECRET_KEY=...

B2_ENDPOINT_URL=https://s3.<region>.backblazeb2.com
B2_ACCESS_KEY_ID=...
B2_SECRET_ACCESS_KEY=...
B2_BUCKET_NAME=ats-resumes

GEMINI_API_KEY=...
OPENROUTER_API_KEY=...
```

Never commit `.env` or production credentials to Git. In production, configure these values through the hosting platform.

------------------------------------------------------------------------

# Design Principles

-   Modular Architecture
-   Separation of Concerns
-   Production-style Service Layer
-   Reusable Resume Lifecycle
-   Independent Scoring Modules
-   Independent Matching Modules
-   Reusable AI Infrastructure

------------------------------------------------------------------------

# V1 Completion Status

```text
Backend Foundation                 ✅
Resume Parser                      ✅
ATS Scoring Engine                 ✅
Matching Engine V1                 ✅
Matching Engine V2                 ✅
Hyperlink Extraction               ✅
Resume Lifecycle Architecture     ✅
Parsed Resume Persistence          ✅
AI Integration                     ✅
Nemotron Primary                   ✅
Gemini Fallback                    ✅
AI Usage Tracking                  ✅
Authentication/User Ownership      ✅
Neon PostgreSQL                    ✅
Alembic                            ✅
Docker                             ✅
Docker Local E2E                    ✅
Backblaze B2                        ✅
B2 Upload Testing                  ✅
Docker → B2 Testing                ✅
React Frontend V1                  ✅
Production Configuration           ✅
                                   │
                                   ▼
                         Production Deployment
                              🚀 NEXT
```

------------------------------------------------------------------------

# Future Roadmap

Post-V1 features can include:

- Semantic embedding matching
- Advanced semantic skill matching
- Resume version history
- LinkedIn profile optimization
- GitHub profile optimization
- Dedicated LinkedIn analysis
- Dedicated GitHub analysis
- Cover letter generation
- Advanced AI agents
- Additional AI providers/models
- AI cost analytics
- Subscription/payment system
- Advanced usage quotas
- Admin analytics
- Production observability

These remain outside the V1 core so the current production architecture stays stable.

------------------------------------------------------------------------

# V1 Highlights

- Upload once, reuse everywhere
- Modular resume parser
- Explainable deterministic ATS scoring
- Resume ↔ JD Matching Engine V2
- AI-powered resume intelligence
- Nemotron primary + Gemini fallback
- AI usage tracking foundation
- PostgreSQL persistence
- Backblaze B2 persistent resume storage
- React frontend
- Dockerized backend
- Production-oriented architecture

------------------------------------------------------------------------

# Author

**Vedant Waghule**

Computer Engineering Student \| AI & Backend Developer

------------------------------------------------------------------------

# License

This project is intended for educational and portfolio purposes.
