from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class ResumeParsedData(Base):
    __tablename__ = "resume_parsed_data"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    name = Column(String)

    email = Column(String)

    phone = Column(String)

    linkedin = Column(String)

    github = Column(String)

    portfolio = Column(String)

    summary = Column(Text)

    education = Column(JSON)

    experience = Column(JSON)

    responsibilities = Column(JSON)

    projects = Column(JSON)

    project_details = Column(JSON)

    skills = Column(JSON)

    certifications = Column(JSON)

    raw_text = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    resume = relationship(
        "Resume",
        back_populates="parsed_resume",
    )