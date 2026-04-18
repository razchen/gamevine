---
description: Scaffold a new full-stack feature (api module + web route + shared contract) end-to-end.
---

Scaffold a new full-stack feature across the gamevine monorepo. Feature description: $ARGUMENTS

Follow the implementation pipeline (`.cursor/rules/agent-pipeline.mdc`). Do not jump to editing.

1. **Ask** for any missing details you need to proceed:
   - Feature name (singular, camelCase, e.g. `game`).
   - Controller route prefix (plural, e.g. `games`).
   - Endpoints to expose (which of `list`, `get`, `create`, `update`, `delete`).
   - Does it need a DB table? (If yes, a Drizzle schema is generated and a migration is required.)
   - Does the web app consume it? (If yes, DTOs go in `@gamevine/shared`; a TanStack Query hook is generated.)
   - Does the web app need a visible route? (If yes, scaffold at the appropriate App Router path.)

2. **`dry-checker`** — check for duplication before creating anything.

3. **`nest-feature`** — scaffold the api module (controller + service + DTO + specs + optional schema). Wire it into `AppModule`.

4. If shared DTOs are needed: create them in `packages/shared/src/<feature>.ts` and re-export from `packages/shared/src/index.ts`. The api feature should import from `@gamevine/shared` instead of defining them locally.

5. **`drizzle-migrations`** — if a schema was generated, run this next. Do not skip even if it's a "small" change.

6. **`web-route`** — if a web route is needed, scaffold it with correct Server/Client split, `loading.tsx`, `error.tsx`, and a TanStack Query hook.

7. **`schema-sync`** — if `@gamevine/shared` was touched.

8. **`code-reviewer`** + **`react-perf-reviewer`** (if `.tsx` added) + **`test-runner`** + **`dry-checker`** (second pass) + **`lint-typecheck-fixer`**.

9. **`e2e-smoke`** — if a web route was added and the dev servers are up.

Scaffolding produces skeletons, NOT real business logic. Do not claim the feature is "done" — explicitly tell me what's left for a human to implement.
