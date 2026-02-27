"""Environment configuration for tests."""
import os
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
WEB_INDEX_PATH = REPO_ROOT / "web" / "index.html"


def get_index_url() -> str:
    """Return file URL for the index.html page."""
    return f"file://{WEB_INDEX_PATH}"
