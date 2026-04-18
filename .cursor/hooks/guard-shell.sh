#!/usr/bin/env bash
# Gamevine shell guard.
#
# Runs on every `beforeShellExecution`. Blocks (or prompts for approval on)
# commands that violate repo-wide rules:
#   - wrong package manager (npm / yarn / bun)     → block
#   - force-push to main / master                  → block
#   - drizzle db:push against non-local DATABASE_URL → ask
#
# Fails closed per hooks.json. If jq is not installed this script exits 2
# (block); install jq or remove the hook entry.

set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  cat <<'JSON'
{
  "permission": "ask",
  "user_message": "jq is required for the gamevine shell guard hook. Install jq or remove the beforeShellExecution hook from .cursor/hooks.json.",
  "agent_message": "Shell guard hook is misconfigured: jq is not installed."
}
JSON
  exit 0
fi

input=$(cat)
command=$(printf '%s' "$input" | jq -r '.command // empty')

if [[ -z "$command" ]]; then
  echo '{ "permission": "allow" }'
  exit 0
fi

deny() {
  local reason="$1"
  jq -cn --arg m "$reason" '{
    permission: "deny",
    user_message: $m,
    agent_message: $m
  }'
  exit 0
}

ask() {
  local reason="$1"
  jq -cn --arg m "$reason" '{
    permission: "ask",
    user_message: $m,
    agent_message: $m
  }'
  exit 0
}

# 1. Wrong package manager.
#    Allow substrings inside longer words (e.g. "component" contains "pon" — not
#    our concern). Match commands starting with or space-separated npm/yarn/bun.
if [[ "$command" =~ (^|[[:space:]\;\&\|\(])(npm|yarn|bun)([[:space:]]|$) ]]; then
  deny "This repo is pnpm-only. Use pnpm (see .cursor/rules/monorepo.mdc). Command rejected: $command"
fi

# Allow `pnpm dlx` but flag raw `npx` as a wrong-tool smell.
if [[ "$command" =~ (^|[[:space:]\;\&\|\(])npx([[:space:]]|$) ]]; then
  deny "Use 'pnpm dlx' instead of 'npx' (see .cursor/rules/monorepo.mdc). Command rejected: $command"
fi

# 2. Destructive git operations against main / master.
if [[ "$command" =~ git[[:space:]]+push.*--force([^-]|$) ]] || \
   [[ "$command" =~ git[[:space:]]+push.*-f([[:space:]]|$) ]]; then
  if [[ "$command" =~ (main|master) ]]; then
    deny "Force-push to main/master is forbidden (see .cursor/rules/commits.mdc). Command rejected: $command"
  fi
fi

# 3. Drizzle db:push against non-local DATABASE_URL.
#    We can't read the env from the hook input, so ask the user to confirm
#    intent whenever db:push appears, per .cursor/rules/drizzle.mdc.
if [[ "$command" =~ db:push ]]; then
  ask "drizzle db:push bypasses migrations. Only allowed against a localhost DATABASE_URL (see .cursor/rules/drizzle.mdc). Confirm you are targeting a local DB before proceeding."
fi

echo '{ "permission": "allow" }'
exit 0
