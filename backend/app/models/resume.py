from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    
    original_filename = Column(String, nullable=False)
    
    stored_filename = Column(String, nullable=False, unique=True)
    
    file_path = Column(String, nullable=False)
    
    file_type = Column(String, nullable=False)
    
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    
    parsed_resume = relationship(
        "ResumeParsedData",
        back_populates="resume",
        uselist=False,
        cascade="all, delete-orphan",
    )