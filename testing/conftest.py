"""Pytest configuration and shared fixtures."""
import sys
from pathlib import Path

testing_root = Path(__file__).resolve().parent
if str(testing_root) not in sys.path:
    sys.path.insert(0, str(testing_root))
