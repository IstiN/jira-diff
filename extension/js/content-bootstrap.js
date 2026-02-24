/**
 * Content script bootstrap logic.
 * Extracted for unit testing. In browser: uses globals (window, isJiraCloudIssuePage, console).
 * In tests: pass env object to inject dependencies.
 *
 * @param {Object} [env] - Optional. { window, isJiraCloudIssuePage, console }. If omitted, uses globals.
 */
function bootstrapContentScript(env) {
  const w = env ? env.window : (typeof window !== 'undefined' ? window : null);
  const isJira = env
    ? env.isJiraCloudIssuePage
    : (typeof isJiraCloudIssuePage === 'function' ? isJiraCloudIssuePage : null);
  const log = env ? env.console : (typeof console !== 'undefined' ? console : { log: function () {} });

  if (!w) return;

  const pathname = w.location.pathname;
  const hostname = w.location.hostname;

  if (isJira && isJira(hostname, pathname)) {
    log.log('[Jira Diff] Loaded on Jira issue page:', w.location.href);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { bootstrapContentScript };
}
