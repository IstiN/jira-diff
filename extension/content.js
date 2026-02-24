/**
 * Jira Diff - Content script for Jira Cloud issue pages.
 * Minimal shell: injects on issue view URLs, confirms page type at runtime.
 * No diff or restore logic yet.
 */
(function () {
  'use strict';

  if (typeof bootstrapContentScript === 'function') {
    bootstrapContentScript();
  }
})();
