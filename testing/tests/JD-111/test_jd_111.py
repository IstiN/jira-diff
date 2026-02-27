"""
JD-111: Verify the presence of extended project information on the index.html page.

Steps:
1. Navigate to the index.html page of the project
2. Identify the section containing project information
3. Verify that additional details about the project are displayed as intended

Expected: The index page should load successfully and contain the extended
information about the project.
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from playwright.sync_api import Page
from components.pages.index_page import IndexPage
from core.config.env import WEB_INDEX_URL


def test_extended_project_info_on_index_page(page: Page) -> None:
    """Verify index page loads and displays extended project information."""
    index_page = IndexPage(page, WEB_INDEX_URL)
    index_page.navigate()

    assert index_page.get_title() == "Jira Diff", "Page title should be 'Jira Diff'"
    assert index_page.has_badges_section(), "Badges section should be present"
    assert index_page.has_extended_project_info(), (
        "Extended project info (Browser Extensions, Key Features, "
        "AI Automation Workflow, Tech Stack) should all be displayed"
    )
