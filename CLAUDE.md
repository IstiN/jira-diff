# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Web Browsing

If you need to open or inspect any websites or web pages, use Playwright headless browsing (the playwright plugin is installed). Do not attempt to open browsers directly or use curl/wget for HTML content inspection.

## Project Overview

**jira-diff** is an AI-powered automation platform for managing Jira ticket workflows. The core product is a GitHub Actions-based system where AI agents (Cursor Agent + DMTools) process Jira tickets, generate artifacts (requirements, solution designs, code), and manage the full ticket lifecycle.

The `web/` folder contains a simple landing page for Safari/Chrome browser extensions — this is a minor secondary component.

## Execution Model

There is no `package.json`, no `npm` commands, and no traditional build/test pipeline. Everything runs via:

- **DMTools CLI**: `dmtools run <config_file> [encoded_config]` — orchestrates the full workflow
- **Cursor Agent**: `./cicd/scripts/runep-agent.sh "<prompt>"` — executes AI coding tasks
- **Plain GRAALJS!!! executed via Javascript**: agent scripts in `agents/js/` run directly, no transpilation needed

Workflows are triggered via GitHub Actions (`ai-teammate.yml`) with `workflow_dispatch`, passing a `config_file` path (e.g. `agents/story_development.json`).

## Architecture

### Workflow Execution Flow

```
Jira ticket (matched by JQL)
    → preJSAction: checkWipLabel.js  (skip if WIP label present)
    → cliCommands: run-cursor-agent.sh  (AI generates outputs/response.md)
    → postJSAction: <specific agent>.js  (parse response, update Jira, create PR)
```

### Agent Config Files (`agents/*.json`)

Each JSON config defines a complete workflow:
- `metadata.contextId` — used to generate the WIP label (`<contextId>_wip`)
- `agentParams` — AI role, instruction files, formatting rules, few-shot examples
- `cliCommands` — shell commands the AI agent runs
- `preJSAction` / `postJSAction` — Node.js scripts for pre/post processing
- `inputJql` — JQL query to select which Jira ticket(s) to process

Current configs: `story_development.json`, `story_questions.json`, `solution_description.json`, `story_description.json`

### JavaScript Agent Scripts (`agents/js/`)

All scripts export `action(params)` returning `{ success, message, error }`. The `params` shape:

```javascript
{
  ticket: { key, fields: { summary, description, labels } },
  response: '...',       // AI-generated text from outputs/response.md
  initiator: 'accountId',
  metadata: { contextId }
}
```

Key scripts:
- `config.js` — all constants (statuses, priorities, labels, git config)
- `checkWipLabel.js` — pre-action: blocks processing if WIP label found
- `developTicketAndCreatePR.js` — creates branch, commits, pushes, opens PR via `gh`
- `createQuestionsAndAssignForReview.js` — creates subtasks from AI-generated questions
- `createSolutionDesignTicketsAndAssignForReview.js` — creates SD CORE/API/UI subtasks

When adding new constants (statuses, labels, etc.), add them to `agents/js/config.js`.

### AI Instructions (`agents/instructions/`)

Markdown files loaded by agent configs to guide the AI:
- `development/` — implementation instructions, formatting rules, few-shot examples
- `enhancement/` — solution design formatting and examples
- `common/` — shared rules for error handling, Jira context, response formatting

AI output must always be written to `outputs/response.md` in Jira Markdown format.

### WIP Label System

Prevents concurrent automated processing of tickets being manually edited:
1. Add label `<contextId>_wip` (e.g. `story_development_wip`) to a ticket
2. The pre-action `checkWipLabel.js` detects it and skips processing, posting a comment
3. Remove the label to re-enable automated processing

### Required GitHub Secrets/Vars

| Secret/Var | Purpose |
|---|---|
| `CURSOR_API_KEY` | Cursor Agent authentication |
| `JIRA_EMAIL`, `JIRA_API_TOKEN` | Jira + Confluence access |
| `GEMINI_API_KEY` | Gemini LLM fallback |
| `FIGMA_TOKEN` | Figma integration |
| `PAT_TOKEN` | GitHub PR creation via `gh` CLI |
| `JIRA_BASE_PATH`, `CONFLUENCE_BASE_PATH` | Instance URLs |
