import logging

import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError

from app.core.settings import settings

logger = logging.getLogger(__name__)


def _get_b2_client():
    """Create an S3-compatible client configured for Backblaze B2."""
    return boto3.client(
        "s3",
        endpoint_url=settings.B2_ENDPOINT_URL,
        aws_access_key_id=settings.B2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.B2_SECRET_ACCESS_KEY,
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )


def upload_file(
    file_path: str,
    object_key: str,
    content_type: str,
) -> None:
    """Upload a local processing file to the private B2 bucket."""
    client = _get_b2_client()

    try:
        with open(file_path, "rb") as file_obj:
            client.upload_fileobj(
                file_obj,
                settings.B2_BUCKET_NAME,
                object_key,
                ExtraArgs={
                    "ContentType": content_type,
                },
            )

    except (BotoCoreError, ClientError):
        logger.exception(
            "Failed to upload resume object to B2: %s",
            object_key,
        )
        raise


def delete_file(object_key: str) -> None:
    """Delete a resume object from B2 during cleanup/rollback."""
    client = _get_b2_client()

    try:
        client.delete_object(
            Bucket=settings.B2_BUCKET_NAME,
            Key=object_key,
        )

    except (BotoCoreError, ClientError):
        logger.exception(
            "Failed to delete resume object from B2: %s",
            object_key,
        )
        raise