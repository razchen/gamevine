#!/usr/bin/env bash
# Gamevine shell guard (Claude Code adaptation of .cursor/hooks/guard-shell.sh).
#
# Runs as a PreToolUse hook for the Bash tool. Reads the proposed command
# from .tool_input.command on stdin. Blocks the tool call by exiting 2 with
# the reason on stderr (Claude sees this and adjusts).
#
# Rules:
#   - wrong package manager (npm / yarn / bun / npx) → block
#   - force-push to main / master                   → block
#   - drizzle db:push                               → block (require user OK)

set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for the gamevine shell guard hook. Install jq or remove the PreToolUse hook from .claude/settings.json." >&2
  exit 2
fi

input=$(cat)
command=$(printf '%s' "$input" | jq -r '.tool_input.command // empty')

if [[ -z "$command" ]]; then
  exit 0
fi

block() {
  echo "$1" >&2
  exit 2
}

# 1. Wrong package manager.
if [[ "$command" =~ (^|[[:space:]\;\&\|\(])(npm|yarn|bun)([[:space:]]|$) ]]; then
  block "This repo is pnpm-only. Use pnpm (see .cursor/rules/monorepo.mdc). Command rejected: $command"
fi

# Allow `pnpm dlx` but flag raw `npx` as a wrong-tool smell.
if [[ "$command" =~ (^|[[:space:]\;\&\|\(])npx([[:space:]]|$) ]]; then
  block "Use 'pnpm dlx' instead of 'npx' (see .cursor/rules/monorepo.mdc). Command rejected: $command"
fi

# 2. Destructive git operations against main / master.
if [[ "$command" =~ git[[:space:]]+push.*--force([^-]|$) ]] || \
   [[ "$command" =~ git[[:space:]]+push.*-f([[:space:]]|$) ]]; then
  if [[ "$command" =~ (main|master) ]]; then
    block "Force-push to main/master is forbidden (see .cursor/rules/commits.mdc). Command rejected: $command"
  fi
fi

# 3. Drizzle db:push — Claude must surface to the user before running.
if [[ "$command" =~ db:push ]]; then
  block "drizzle db:push bypasses migrations. Only allowed against a localhost DATABASE_URL (see .cursor/rules/drizzle.mdc). Confirm with the user before proceeding."
fi

exit 0
