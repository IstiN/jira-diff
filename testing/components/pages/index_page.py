"""Page Object for the project index.html landing page."""

from playwright.sync_api import Page


class IndexPage:
    """Represents the index.html page with extended project information."""

    def __init__(self, page: Page, base_url: str) -> None:
        self.page = page
        self.base_url = base_url

    def navigate(self) -> None:
        """Navigate to the index page."""
        self.page.goto(self.base_url)

    def get_title(self) -> str:
        """Get the main heading text."""
        return self.page.locator("h1").inner_text()

    def get_tagline(self) -> str:
        """Get the tagline text."""
        return self.page.locator(".tagline").inner_text()

    def has_badges_section(self) -> bool:
        """Check if badges section is present."""
        return self.page.locator(".badges .badge").count() >= 4

    def has_browser_extensions_section(self) -> bool:
        """Check if Browser Extensions section is present."""
        return (
            self.page.locator("h2:has-text('Browser Extensions')").count() > 0
            and self.page.locator(".extension-platforms .platform-card").count() >= 2
        )

    def has_key_features_section(self) -> bool:
        """Check if Key Features section is present."""
        return (
            self.page.locator("h2:has-text('Key Features')").count() > 0
            and self.page.locator(".features-grid .feature-card").count() >= 4
        )

    def has_workflow_section(self) -> bool:
        """Check if AI Automation Workflow section is present."""
        return (
            self.page.locator("h2:has-text('AI Automation Workflow')").count() > 0
            and self.page.locator(".workflow-steps li").count() >= 4
        )

    def has_tech_stack_section(self) -> bool:
        """Check if Tech Stack section is present."""
        return (
            self.page.locator("h2:has-text('Tech Stack')").count() > 0
            and self.page.locator(".tech-stack .tech-tag").count() >= 1
        )

    def has_extended_project_info(self) -> bool:
        """Verify all extended project information sections are displayed."""
        return (
            self.has_browser_extensions_section()
            and self.has_key_features_section()
            and self.has_workflow_section()
            and self.has_tech_stack_section()
        )
