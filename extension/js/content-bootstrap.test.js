/**
 * Unit tests for content-bootstrap.js
 * Run: node extension/js/content-bootstrap.test.js
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');
const { bootstrapContentScript } = require('./content-bootstrap.js');
const { isJiraCloudIssuePage } = require('./url-utils.js');

describe('bootstrapContentScript', () => {
  it('returns early when window is null', () => {
    const logCalls = [];
    const env = {
      window: null,
      isJiraCloudIssuePage: () => true,
      console: { log: (...args) => logCalls.push(args) }
    };
    bootstrapContentScript(env);
    assert.strictEqual(logCalls.length, 0);
  });

  it('returns early when window is undefined', () => {
    const logCalls = [];
    const env = {
      window: undefined,
      isJiraCloudIssuePage: () => true,
      console: { log: (...args) => logCalls.push(args) }
    };
    bootstrapContentScript(env);
    assert.strictEqual(logCalls.length, 0);
  });

  it('logs when on Jira issue page', () => {
    const logCalls = [];
    const env = {
      window: {
        location: {
          pathname: '/browse/PROJ-123',
          hostname: 'company.atlassian.net',
          href: 'https://company.atlassian.net/browse/PROJ-123'
        }
      },
      isJiraCloudIssuePage,
      console: { log: (...args) => logCalls.push(args) }
    };
    bootstrapContentScript(env);
    assert.strictEqual(logCalls.length, 1);
    assert.strictEqual(logCalls[0][0], '[Jira Diff] Loaded on Jira issue page:');
    assert.strictEqual(logCalls[0][1], 'https://company.atlassian.net/browse/PROJ-123');
  });

  it('does not log when not on Jira issue page', () => {
    const logCalls = [];
    const env = {
      window: {
        location: {
          pathname: '/dashboard',
          hostname: 'company.atlassian.net',
          href: 'https://company.atlassian.net/dashboard'
        }
      },
      isJiraCloudIssuePage,
      console: { log: (...args) => logCalls.push(args) }
    };
    bootstrapContentScript(env);
    assert.strictEqual(logCalls.length, 0);
  });

  it('does not log when isJiraCloudIssuePage is null', () => {
    const logCalls = [];
    const env = {
      window: {
        location: {
          pathname: '/browse/PROJ-123',
          hostname: 'company.atlassian.net',
          href: 'https://company.atlassian.net/browse/PROJ-123'
        }
      },
      isJiraCloudIssuePage: null,
      console: { log: (...args) => logCalls.push(args) }
    };
    bootstrapContentScript(env);
    assert.strictEqual(logCalls.length, 0);
  });

  it('uses custom isJiraCloudIssuePage when provided', () => {
    const logCalls = [];
    const customIsJira = () => true;
    const env = {
      window: {
        location: {
          pathname: '/any',
          hostname: 'example.com',
          href: 'https://example.com/any'
        }
      },
      isJiraCloudIssuePage: customIsJira,
      console: { log: (...args) => logCalls.push(args) }
    };
    bootstrapContentScript(env);
    assert.strictEqual(logCalls.length, 1);
  });
});
