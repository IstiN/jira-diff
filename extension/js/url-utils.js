/**
 * URL utilities for detecting Jira Cloud issue view pages.
 * Extracted for unit testing and reuse.
 * In content script context: functions are in global scope for content.js.
 * In Node context: use module.exports for tests.
 */

const JIRA_ISSUE_PATH_PATTERNS = [
  /\/browse\/[A-Za-z0-9_-]+/,
  /\/projects\/[^/]+\/issues\/?[^/]*/,
  /\/jira\/software\/[^/]+\/browse\/[A-Za-z0-9_-]+/,
  /\/jira\/servicemanagement\/[^/]+\/browse\/[A-Za-z0-9_-]+/
];

/**
 * Checks if the given URL path represents a Jira Cloud issue view page.
 * Used at runtime to confirm the page is an issue view before activating diff/restore logic.
 *
 * @param {string} pathname - The pathname from window.location (e.g. "/browse/PROJ-123")
 * @returns {boolean} True if the path matches a known Jira issue view pattern
 */
function isJiraIssueViewPath(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return false;
  }
  const normalized = pathname.startsWith('/') ? pathname : '/' + pathname;
  return JIRA_ISSUE_PATH_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Checks if the current page is a Jira Cloud issue view.
 * Combines host and path checks.
 *
 * @param {string} hostname - The hostname (e.g. "company.atlassian.net")
 * @param {string} pathname - The pathname
 * @returns {boolean} True if on a Jira Cloud issue view page
 */
function isJiraCloudIssuePage(hostname, pathname) {
  if (!hostname || typeof hostname !== 'string') {
    return false;
  }
  const isAtlassianNet = hostname === 'atlassian.net' || hostname.endsWith('.atlassian.net');
  return isAtlassianNet && isJiraIssueViewPath(pathname);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { isJiraIssueViewPath, isJiraCloudIssuePage, JIRA_ISSUE_PATH_PATTERNS };
}
