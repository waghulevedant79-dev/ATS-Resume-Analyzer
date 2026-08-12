"""add user ownership to resumes

Revision ID: c41578eacd5a
Revises: 93823fd6305a
Create Date: 2026-08-12 16:25:04.798690

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c41578eacd5a'
down_revision: Union[str, Sequence[str], None] = '93823fd6305a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add the ownership column temporarily as nullable.
    op.add_column(
        "resumes",
        sa.Column(
            "user_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    # 2. Existing development resumes belong to the
    #    current test user (ID 1).
    op.execute(
        "UPDATE resumes SET user_id = 1 WHERE user_id IS NULL"
    )

    # 3. Now that every existing resume has an owner,
    #    enforce the ownership requirement.
    op.alter_column(
        "resumes",
        "user_id",
        existing_type=sa.Integer(),
        nullable=False,
    )

    # 4. Add an index for efficient ownership queries.
    op.create_index(
        op.f("ix_resumes_user_id"),
        "resumes",
        ["user_id"],
        unique=False,
    )

    # 5. Add the foreign-key relationship.
    op.create_foreign_key(
        "fk_resumes_user_id_users",
        "resumes",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_resumes_user_id_users",
        "resumes",
        type_="foreignkey",
    )

    op.drop_index(
        op.f("ix_resumes_user_id"),
        table_name="resumes",
    )

    op.drop_column(
        "resumes",
        "user_id",
    )