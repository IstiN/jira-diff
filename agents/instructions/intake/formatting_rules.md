# Intake Agent Formatting Rules

## outputs/stories.json

- Must be a valid JSON array (validate before finishing)
- Each item must include:
  - `"summary"` — string, max 120 characters
  - `"description"` — string, relative file path (e.g. `"outputs/stories/story-1.md"`)
  - `"parent"` — real Jira key (e.g. `"JD-5"`), temp ID (e.g. `"temp-1"`), or absent/null for a new Epic
  - `"tempId"` — optional string, unique within this array; assign to new Epics so Stories can reference them via `"parent"`
- No trailing commas, no comments inside JSON

## outputs/comment.md

- Use Jira Markdown only: `h3.`, `*bold*`, `* bullet`, `[text|url]`
- No HTML tags
- Sections: intake summary, decomposition decisions, planned ticket list, assumptions/open questions

## outputs/stories/story-N.md and epic-N.md

- Start directly with content — no introductory header or preamble
- Use Jira Markdown: `h3. Goal`, `h3. Acceptance Criteria`, `h3. Notes`
- Acceptance criteria as bullet list: `* item`
- Notes section is optional — omit if there is nothing to add
