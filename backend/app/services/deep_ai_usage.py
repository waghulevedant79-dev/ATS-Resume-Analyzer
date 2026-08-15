from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.deep_ai_usage import DeepAIUsage


DEEP_AI_USAGE_LIMIT = 15
DEEP_AI_PERIOD_DAYS = 30


def get_or_create_usage(
    db: Session,
    user_id: int,
) -> DeepAIUsage:
    usage = (
        db.query(DeepAIUsage)
        .filter(DeepAIUsage.user_id == user_id)
        .first()
    )

    now = datetime.now(timezone.utc).replace(tzinfo=None)

    if usage is None:
        usage = DeepAIUsage(
            user_id=user_id,
            period_start=now,
            usage_count=0,
        )

        db.add(usage)
        db.commit()
        db.refresh(usage)

        return usage

    period_end = usage.period_start + timedelta(
        days=DEEP_AI_PERIOD_DAYS
    )

    if now >= period_end:
        usage.period_start = now
        usage.usage_count = 0

        db.commit()
        db.refresh(usage)

    return usage


def check_deep_ai_usage(
    db: Session,
    user_id: int,
) -> DeepAIUsage:
    usage = get_or_create_usage(
        db=db,
        user_id=user_id,
    )

    if usage.usage_count >= DEEP_AI_USAGE_LIMIT:
        reset_at = (
            usage.period_start
            + timedelta(days=DEEP_AI_PERIOD_DAYS)
        )

        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "message": "You have used all 5 Deep AI uses for this 30-day period.",
                "remaining_uses": 0,
                "limit": DEEP_AI_USAGE_LIMIT,
                "reset_at": reset_at.isoformat(),
            },
        )

    return usage


def consume_deep_ai_usage(
    db: Session,
    usage: DeepAIUsage,
) -> DeepAIUsage:
    usage.usage_count += 1

    db.commit()
    db.refresh(usage)

    return usage


def get_usage_status(
    db: Session,
    user_id: int,
) -> dict:
    usage = get_or_create_usage(
        db=db,
        user_id=user_id,
    )

    reset_at = (
        usage.period_start
        + timedelta(days=DEEP_AI_PERIOD_DAYS)
    )

    remaining_uses = max(
        DEEP_AI_USAGE_LIMIT - usage.usage_count,
        0,
    )

    return {
        "used": usage.usage_count,
        "remaining_uses": remaining_uses,
        "limit": DEEP_AI_USAGE_LIMIT,
        "reset_at": reset_at,
    }