/**
 * Unit tests for url-utils.js
 * Run: node extension/js/url-utils.test.js
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  isJiraIssueViewPath,
  isJiraCloudIssuePage,
  JIRA_ISSUE_PATH_PATTERNS
} = require('./url-utils.js');

describe('isJiraIssueViewPath', () => {
  it('returns true for /browse/KEY pattern', () => {
    assert.strictEqual(isJiraIssueViewPath('/browse/PROJ-123'), true);
    assert.strictEqual(isJiraIssueViewPath('/browse/ABC-1'), true);
    assert.strictEqual(isJiraIssueViewPath('/browse/XYZ-999'), true);
    assert.strictEqual(isJiraIssueViewPath('browse/PROJ-123'), true);
  });

  it('returns true for /projects/*/issues/* pattern', () => {
    assert.strictEqual(isJiraIssueViewPath('/projects/PROJ/issues/'), true);
    assert.strictEqual(isJiraIssueViewPath('/projects/MYPROJ/issues/123'), true);
    assert.strictEqual(isJiraIssueViewPath('/projects/ABC/issues'), true);
  });

  it('returns true for /jira/software/*/browse/* pattern', () => {
    assert.strictEqual(isJiraIssueViewPath('/jira/software/projects/PROJ/browse/PROJ-123'), true);
    assert.strictEqual(isJiraIssueViewPath('/jira/software/xyz/browse/ABC-1'), true);
  });

  it('returns true for /jira/servicemanagement/*/browse/* pattern', () => {
    assert.strictEqual(isJiraIssueViewPath('/jira/servicemanagement/123/browse/SM-1'), true);
    assert.strictEqual(isJiraIssueViewPath('/jira/servicemanagement/abc/browse/HELP-42'), true);
  });

  it('returns false for non-issue paths', () => {
    assert.strictEqual(isJiraIssueViewPath('/'), false);
    assert.strictEqual(isJiraIssueViewPath('/dashboard'), false);
    assert.strictEqual(isJiraIssueViewPath('/projects/PROJ'), false);
    assert.strictEqual(isJiraIssueViewPath('/browse/'), false);
    assert.strictEqual(isJiraIssueViewPath('/jira/software/projects'), false);
  });

  it('returns false for invalid inputs', () => {
    assert.strictEqual(isJiraIssueViewPath(null), false);
    assert.strictEqual(isJiraIssueViewPath(undefined), false);
    assert.strictEqual(isJiraIssueViewPath(''), false);
    assert.strictEqual(isJiraIssueViewPath(123), false);
  });
});

describe('isJiraCloudIssuePage', () => {
  it('returns true for atlassian.net host with issue path', () => {
    assert.strictEqual(
      isJiraCloudIssuePage('company.atlassian.net', '/browse/PROJ-123'),
      true
    );
    assert.strictEqual(
      isJiraCloudIssuePage('atlassian.net', '/browse/ABC-1'),
      true
    );
    assert.strictEqual(
      isJiraCloudIssuePage('myorg.atlassian.net', '/projects/PROJ/issues/'),
      true
    );
  });

  it('returns false for non-atlassian hosts', () => {
    assert.strictEqual(
      isJiraCloudIssuePage('example.com', '/browse/PROJ-123'),
      false
    );
    assert.strictEqual(
      isJiraCloudIssuePage('atlassian.net.evil.com', '/browse/PROJ-123'),
      false
    );
  });

  it('returns false for atlassian.net with non-issue path', () => {
    assert.strictEqual(
      isJiraCloudIssuePage('company.atlassian.net', '/dashboard'),
      false
    );
    assert.strictEqual(
      isJiraCloudIssuePage('company.atlassian.net', '/'),
      false
    );
  });

  it('returns false for invalid inputs', () => {
    assert.strictEqual(isJiraCloudIssuePage(null, '/browse/PROJ-123'), false);
    assert.strictEqual(isJiraCloudIssuePage(undefined, '/browse/PROJ-123'), false);
    assert.strictEqual(isJiraCloudIssuePage('', '/browse/PROJ-123'), false);
    assert.strictEqual(isJiraCloudIssuePage('company.atlassian.net', null), false);
  });
});

describe('JIRA_ISSUE_PATH_PATTERNS', () => {
  it('exports an array of 4 regex patterns', () => {
    assert.strictEqual(Array.isArray(JIRA_ISSUE_PATH_PATTERNS), true);
    assert.strictEqual(JIRA_ISSUE_PATH_PATTERNS.length, 4);
    JIRA_ISSUE_PATH_PATTERNS.forEach((p) => {
      assert.strictEqual(p instanceof RegExp, true);
    });
  });
});
