"""Pytest configuration and fixtures for Playwright tests."""

import pytest


@pytest.fixture(scope="function")
def browser_context_args(browser_context_args):
    """Allow file:// URLs in browser context."""
    return {
        **browser_context_args,
        "ignore_https_errors": True,
    }
