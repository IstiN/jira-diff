"""Page Object for the Jira Diff landing page (index.html)."""
from playwright.sync_api import Page


class IndexPage:
    """Page Object for web/index.html."""

    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.base_url = base_url

    def navigate(self) -> None:
        """Navigate to the index page."""
        self.page.goto(self.base_url)

    def get_title(self) -> str:
        """Return the page title."""
        return self.page.title()

    def is_loaded(self) -> bool:
        """Check if the main container is visible."""
        return self.page.locator(".container").is_visible()

    def has_hero_section(self) -> bool:
        """Check if hero section with h1 is present."""
        return self.page.locator(".hero h1").is_visible()

    def has_browser_extensions_section(self) -> bool:
        """Check if Browser Extensions section is present."""
        return self.page.locator("h2:has-text('Browser Extensions')").is_visible()

    def has_key_features_section(self) -> bool:
        """Check if Key Features section is present."""
        return self.page.locator("h2:has-text('Key Features')").is_visible()

    def has_workflow_section(self) -> bool:
        """Check if AI Automation Workflow section is present."""
        return self.page.locator("h2:has-text('AI Automation Workflow')").is_visible()

    def has_tech_stack_section(self) -> bool:
        """Check if Tech Stack section is present."""
        return self.page.locator("h2:has-text('Tech Stack')").is_visible()

    def has_extended_project_info(self) -> bool:
        """Verify extended project information sections are displayed."""
        return (
            self.has_browser_extensions_section()
            and self.has_key_features_section()
            and self.has_workflow_section()
            and self.has_tech_stack_section()
        )
