from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.database import Base


class DeepAIUsage(Base):
    __tablename__ = "deep_ai_usage"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    period_start = Column(
        DateTime,
        nullable=False,
    )

    usage_count = Column(
        Integer,
        nullable=False,
        default=0,
    )

    user = relationship(
        "User",
        back_populates="deep_ai_usage",
    )