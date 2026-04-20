# Gamevine — Project Rules

Always-on rules (apply to every task in this repo):

@.cursor/rules/agent-pipeline.mdc
@.cursor/rules/code-review-pipeline.mdc
@.cursor/rules/commits.mdc
@.cursor/rules/definition-of-done.mdc
@.cursor/rules/docs-first.mdc
@.cursor/rules/monorepo.mdc
@.cursor/rules/testing.mdc

Scoped rules live in subdirectory `CLAUDE.md` files and load automatically when working in that directory:

- `apps/api/CLAUDE.md` — NestJS, Drizzle, env, Zod DTOs, CASL
- `apps/web/CLAUDE.md` — Next.js 16, React 19, Tailwind v4, data fetching, CASL
- `packages/shared/CLAUDE.md` — shared purity, CASL
