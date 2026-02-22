#!/bin/bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $(basename "$0") "prompt"

Runs the configured AI agent with the provided prompt.
Provider is controlled by AI_AGENT_PROVIDER environment variable (default: cursor).

Providers:
  cursor   - Uses cursor-agent (default)
  codemie  - Uses codemie-claude

Example:
  $(basename "$0") "process the input folder"

Notes:
  - Provide the prompt as a single argument
  - For cursor: all extra arguments before the prompt are passed through to cursor-agent
  - For codemie: requires CODEMIE_API_KEY and CODEMIE_BASE_URL environment variables
  - Final response is written to outputs/response.md
EOF
}

if [ $# -lt 1 ]; then
  usage
  exit 1
fi

# Load dmtools.env if exists (for local runs)
if [ -f "dmtools.env" ]; then
  echo "Loading environment from dmtools.env"
  set -a
  source dmtools.env
  set +a
fi

# Extract prompt (last argument)
PROMPT="${!#}"

if [ -z "$PROMPT" ]; then
  echo "Error: prompt argument is required" >&2
  usage
  exit 1
fi

# Determine provider
PROVIDER="${AI_AGENT_PROVIDER:-cursor}"
echo "AI Agent Provider: $PROVIDER"

if [ "$PROVIDER" = "codemie" ]; then
  if [ -z "${CODEMIE_API_KEY:-}" ]; then
    echo "Error: CODEMIE_API_KEY environment variable is required for codemie provider" >&2
    exit 1
  fi

  if [ -z "${CODEMIE_BASE_URL:-}" ]; then
    echo "Error: CODEMIE_BASE_URL environment variable is required for codemie provider" >&2
    exit 1
  fi

  echo "Codemie Configuration:"
  echo "  Base URL: ${CODEMIE_BASE_URL}"
  echo "  Model: ${CODEMIE_MODEL:-claude-4-5-sonnet}"
  echo "  Max Turns: ${CODEMIE_MAX_TURNS:-50}"

  CMD=(codemie-claude
    --base-url "${CODEMIE_BASE_URL}"
    --api-key "${CODEMIE_API_KEY}"
    --model "${CODEMIE_MODEL:-claude-4-5-sonnet}"
    --provider "litellm"
    -p "$PROMPT"
    --max-turns "${CODEMIE_MAX_TURNS:-50}"
    --dangerously-skip-permissions
    --allowedTools "Bash(*),Read(*),Curl(*)")

else
  # Default to cursor
  if ! command -v cursor-agent >/dev/null 2>&1; then
    echo "Error: cursor-agent not found in PATH" >&2
    exit 127
  fi

  # Get all arguments except the last one (the prompt)
  PASS_ARGS=()
  if [ $# -gt 1 ]; then
    PASS_ARGS=("${@:1:$#-1}")
  fi

  # Build command with defaults if no options provided
  if [ ${#PASS_ARGS[@]} -eq 0 ]; then
    CMD=(cursor-agent --force --print --model auto --output-format=text "$PROMPT")
  else
    CMD=(cursor-agent "${PASS_ARGS[@]}" --output-format=text "$PROMPT")
  fi

fi

echo "Working directory: $(pwd)"
echo ""
echo "Running: ${CMD[*]}"
echo ""

# Execute Command
"${CMD[@]}"

exit_code=$?

echo ""
echo "=== Agent completed with exit code: $exit_code ==="

exit $exit_code
