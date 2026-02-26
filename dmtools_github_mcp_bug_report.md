# DMTools Bug Report: GitHub MCP Tools Not Exported to JavaScript Context

## Issue Summary

GitHub MCP tools are available via `dmtools` CLI but are **NOT exported to JavaScript context** in JobJavaScriptBridge. This prevents JavaScript agents from using GitHub integration for PR automation workflows.

## Reproduction

### Test 1: Tools Exported to JavaScript ✅

Created `/tmp/test_tools.js`:
```javascript
function action(params) {
    console.log('=== Available MCP Tools Test ===');
    console.log('Checking github tools...');

    try {
        console.log('typeof github_list_prs:', typeof github_list_prs);
    } catch (e) {
        console.log('github_list_prs not available:', e.message);
    }

    try {
        console.log('typeof github_get_pr:', typeof github_get_pr);
    } catch (e) {
        console.log('github_get_pr not available:', e.message);
    }

    return {success: true};
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { action };
}
```

**Test Result:**
```bash
dmtools run /tmp/test_mcp_tools.json
```

**Output:**
```
typeof github_list_prs: function  ✅
typeof github_get_pr: function    ✅
```

**Status:** FIXED - Tools are now exported to JavaScript context

### Test 2: GitHub Client Initialization ❌

Created `/tmp/test_github_tools_full.js` to actually call the tools:
```javascript
function action(params) {
    console.log('=== Testing GitHub MCP Tools ===');
    try {
        const prsJson = github_list_prs({
            workspace: 'IstiN',
            repository: 'jira-diff',
            state: 'open'
        });
        const prsData = JSON.parse(prsJson);
        const prs = prsData.result || prsData;
        console.log('✅ Found', prs.length, 'PRs');
        return {success: true};
    } catch (error) {
        console.error('❌ Error:', error);
        return {success: false, error: error.toString()};
    }
}
```

**Test Result:**
```bash
dmtools run /tmp/test_github_tools_full.json
```

**Output:**
```
Tool execution failed for github_list_prs:
Cannot invoke "com.github.istin.dmtools.github.GitHub.listPullRequests(String, String, String)"
because "client" is null

java.lang.NullPointerException: Cannot invoke "com.github.istin.dmtools.github.GitHub.listPullRequests(...)"
because "client" is null
	at com.github.istin.dmtools.mcp.generated.MCPToolExecutor.executeGithubListPrs(MCPToolExecutor.java:1358)
```

**Status:** BUG - GitHub client is null in JavaScript context

## Root Cause Analysis

The issue is in the GitHub client initialization in `JobJavaScriptBridge`:

1. **Tools are registered**: `github_list_prs`, `github_get_pr`, etc. are exported to JavaScript
2. **Client is null**: When tools are called from JavaScript, the GitHub client instance is null
3. **CLI works**: Same tools work perfectly via `dmtools` CLI commands

This indicates that:
- ✅ `MCPToolExecutor` has GitHub tools registered
- ✅ `JobJavaScriptBridge` exports the tool functions to GraalJS context
- ❌ **GitHub client instance is not injected into JavaScript execution context**

The Jira, CLI, and file clients work correctly in JavaScript, so this is specific to GitHub client initialization.

### Configuration Verified

```bash
# dmtools.env has all required GitHub settings
GITHUB_TOKEN=ghp_***
GITHUB_BASE_PATH=https://api.github.com
SOURCE_GITHUB_WORKSPACE=IstiN
SOURCE_GITHUB_REPOSITORY=jira-diff
SOURCE_GITHUB_BASE_PATH=https://api.github.com
DMTOOLS_INTEGRATIONS=jira,cli,file,teams,figma,github
```

### Verification via CLI

GitHub MCP tools **DO work** via CLI:
```bash
$ dmtools list | grep github
github_list_prs
github_get_pr
github_add_pr_comment
github_add_inline_comment
github_get_pr_diff
github_get_pr_files
...
```

```bash
$ dmtools github_list_prs --workspace IstiN --repository jira-diff --state open
{"result": [...]}  # Works correctly
```

## Required Fixes

### GitHub Client Injection into JobJavaScriptBridge

**Problem:** GitHub client instance is not being injected into JavaScript execution context.

**Fix Required:** In `JobJavaScriptBridge`, ensure GitHub client is initialized and passed to `MCPToolExecutor` when executing tools from JavaScript, similar to how Jira client is injected.

**Code Location:** Likely in `JobJavaScriptBridge.java` where clients are initialized for JavaScript context.

**Expected Behavior:** When JavaScript calls `github_list_prs({...})`, the tool should use the same GitHub client instance that CLI commands use.

### Tools Confirmed Working (once client is injected)

#### 1. `github_list_prs`
- **Current state**: Works via CLI, returns `{result: [...]}`
- **Required**: Export to JavaScript with same behavior
- **Signature**: `github_list_prs({workspace: string, repository: string, state: string})`

#### 2. `github_get_pr`
- **Current state**: Works via CLI
- **Required**: Export to JavaScript
- **Signature**: `github_get_pr({workspace: string, repository: string, pullRequestId: string})`

#### 3. `github_add_pr_comment`
- **Current state**: Not available in JavaScript
- **Required**: Export to JavaScript
- **Signature**: `github_add_pr_comment({workspace: string, repository: string, pullRequestId: string, text: string})`

#### 4. `github_add_inline_comment`
- **Current state**: Not available in JavaScript
- **Required**: Export to JavaScript
- **Signature**: `github_add_inline_comment({workspace: string, repository: string, pullRequestId: string, path: string, line: string, text: string, startLine?: string, side?: string})`

#### 5. `github_get_pr_diff` (BONUS FIX)
- **Current state**: Returns Java object string instead of JSON
- **Current output**: `{"result": "com.github.istin.dmtools.github.GitHub$1@..."}`
- **Required**: Return actual diff content as string
- **Signature**: `github_get_pr_diff({workspace: string, repository: string, pullRequestId: string})`

## Working Pattern Reference

Other MCP tool categories (Jira, CLI, file) **work correctly** in JavaScript:

```javascript
// These work perfectly in JavaScript agents
const ticket = jira_get_ticket({key: 'PROJ-123'});
const files = file_read({path: 'file.txt'});
const output = cli_execute_command({command: 'git status'});
```

The GitHub tools should follow the same pattern.

## Impact

This blocks critical PR automation workflows:
- `preparePRForReview.js` - Cannot find and fetch PR metadata
- `postPRReviewComments.js` - Cannot post review comments to GitHub PRs

Current implementation is **complete and ready** but waiting for this fix to enable end-to-end PR review automation.

## Environment

- **DMTools version**: Latest from main branch
- **Configuration**: GITHUB_TOKEN and IS_READ_PULL_REQUEST_DIFF=true set in dmtools.env
- **Test PR**: https://github.com/IstiN/jira-diff/pull/12
- **Working code**:
  - `agents/js/preparePRForReview.js`
  - `agents/js/postPRReviewComments.js`

## Expected Behavior

After fix, this should work in JavaScript agents:

```javascript
function action(params) {
    // Find PR
    const openPRsJson = github_list_prs({
        workspace: 'IstiN',
        repository: 'jira-diff',
        state: 'open'
    });
    const openPRs = JSON.parse(openPRsJson).result;

    // Get PR details
    const prJson = github_get_pr({
        workspace: 'IstiN',
        repository: 'jira-diff',
        pullRequestId: '12'
    });
    const pr = JSON.parse(prJson);

    // Post review comment
    github_add_pr_comment({
        workspace: 'IstiN',
        repository: 'jira-diff',
        pullRequestId: '12',
        text: 'LGTM! ✅'
    });

    // Post inline comment
    github_add_inline_comment({
        workspace: 'IstiN',
        repository: 'jira-diff',
        pullRequestId: '12',
        path: 'src/index.js',
        line: '42',
        text: 'Consider adding error handling here'
    });

    return {success: true};
}
```

## Additional Notes

- User explicitly requested DMTools MCP tools approach (no CLI workarounds)
- All code is ready and tested for correct parameter names (workspace/repository/pullRequestId)
- Conditional exports already implemented for GraalJS compatibility
- This should be a straightforward export in JobJavaScriptBridge following the pattern of other MCP tool categories

---

## Feature Request: `github_merge_pr` Tool — ✅ DONE

Implemented in `dmtools-core/src/main/java/com/github/istin/dmtools/github/GitHub.java`.

```javascript
github_merge_pr({
    workspace: string,      // GitHub owner/organization
    repository: string,     // Repository name
    pullRequestId: string,  // PR number as string
    mergeMethod: string,    // "merge" (default), "squash", "rebase"
    commitTitle: string,    // optional
    commitMessage: string   // optional
})
```

Uses GitHub API: `PUT /repos/{workspace}/{repo}/pulls/{id}/merge`
