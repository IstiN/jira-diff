/**
 * Unit tests for content.js entry point.
 * Verifies the content script invokes bootstrapContentScript when available.
 * Run: node extension/content.test.js
 */
const { describe, it } = require('node:test');
const assert = require('node:assert');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

describe('content.js', () => {
  it('calls bootstrapContentScript when it is available', () => {
    const calls = [];
    const bootstrapContentScript = () => calls.push('called');

    const sandbox = {
      bootstrapContentScript,
      window: {},
      console: { log: () => {} }
    };
    vm.createContext(sandbox);

    const contentScript = fs.readFileSync(path.join(__dirname, 'content.js'), 'utf8');
    vm.runInContext(contentScript, sandbox);

    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0], 'called');
  });

  it('does not throw when bootstrapContentScript is not available', () => {
    const sandbox = { window: {} };
    vm.createContext(sandbox);

    const contentScript = fs.readFileSync(path.join(__dirname, 'content.js'), 'utf8');
    assert.doesNotThrow(() => vm.runInContext(contentScript, sandbox));
  });
});
