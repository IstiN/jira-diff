"""Environment configuration for tests."""
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
WEB_INDEX_PATH = os.path.join(PROJECT_ROOT, "web", "index.html")
WEB_INDEX_URL = f"file://{os.path.abspath(WEB_INDEX_PATH)}"
