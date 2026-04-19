---
description: Run the gamevine implementation pipeline to prepare a change for merge.
---

Run the implementation pipeline on the current change set per `.cursor/rules/agent-pipeline.mdc`. Report each agent's verdict before proceeding to the next.

1. `code-reviewer` — quality / correctness / pattern review.
2. `react-perf-reviewer` — MANDATORY if any `.tsx` / `.jsx` file is in the diff (file-type check, not a judgment call).
3. `test-runner` — run tests and enforce a spec for every changed source file.
4. `schema-sync` — MANDATORY if `packages/shared/**` or `apps/api/**/*.schema.ts` changed.
5. `security-auditor` — MANDATORY if auth, API routes, env handling, or DB queries touched.
6. `lint-typecheck-fixer` — bounded loop to get lint + typecheck green workspace-wide.

Optional (skip unless the diff warrants it):

- `dry-checker` — if the diff adds new utilities / components / abstractions that might duplicate existing code.

For every agent recommendation that comes back, apply the fix. You are NOT allowed to dismiss findings with "existing pattern" or "good enough." If you genuinely disagree, surface the recommendation to me verbatim with your specific technical objection.

Finish with a pre-completion checklist showing which steps ran, which were skipped (with the reason), and a final green-or-red summary.

$ARGUMENTS
