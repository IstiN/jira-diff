"""
JD-111: Verify the presence of extended project information on the index.html page.

Steps:
1. Navigate to the index.html page of the project
2. Identify the section containing project information
3. Verify that additional details about the project are displayed as intended

Expected: The index page should load successfully and contain the extended
information about the project.
"""
import pytest
from playwright.sync_api import sync_playwright

from core.config.env import get_index_url
from components.pages.index_page import IndexPage


def test_jd_111_extended_project_info_on_index_page():
    """Verify index page loads and displays extended project information."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        index_url = get_index_url()
        index_page = IndexPage(page, index_url)

        index_page.navigate()

        assert index_page.is_loaded(), "Index page should load successfully"
        assert index_page.has_hero_section(), "Hero section with project title should be visible"
        assert index_page.has_extended_project_info(), (
            "Extended project information should be displayed: "
            "Browser Extensions, Key Features, AI Automation Workflow, Tech Stack"
        )

        browser.close()
