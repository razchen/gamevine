---
description: Run the gamevine code-review pipeline on a diff or branch without implementing anything.
---

Run the review-only pipeline from `.cursor/rules/code-review-pipeline.mdc`. You are reviewing, not implementing. Do NOT edit code. Return a consolidated verdict with severity-sorted findings.

Target: $ARGUMENTS (a branch, a PR URL, a diff range like `main...HEAD`, or "the current uncommitted diff" if nothing specified).

Steps:

1. `code-reviewer` — always.
2. `react-perf-reviewer` — if the diff touches any `.tsx` / `.jsx` file. Reads `.cursor/skills/vercel-react-best-practices/SKILL.md` first.
3. `dry-checker` — always.
4. `schema-sync` — if the diff touches `packages/shared/**` or `apps/api/**/*.schema.ts`.
5. `security-auditor` — if the diff touches auth, API routes, env handling, or DB queries.

Skip by default (unless I specifically ask): `test-runner`, `lint-typecheck-fixer`, `e2e-smoke`, scaffolders, `drizzle-migrations`.

Final report:

- **Verdict**: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION.
- Findings grouped by severity (Critical / High / Medium / Low) with file:line references.
- Do NOT water down severity to be polite. Surface every finding from every agent verbatim.
