# Gamevine

Browser-based games and community-driven updates. Monorepo managed with pnpm workspaces and Turborepo.

## Workspaces

| Path | Package | Stack |
|------|---------|-------|
| `apps/web` | `@gamevine/web` | Next.js 16 (App Router), React 19, Tailwind v4, TanStack Query, axios |
| `apps/api` | `@gamevine/api` | NestJS 11, Drizzle ORM, PostgreSQL, Zod |
| `packages/shared` | `@gamevine/shared` | Cross-app types and constants (runtime-free) |
| `packages/eslint-config` | `@gamevine/eslint-config` | Shared ESLint config |
| `packages/tsconfig` | `@gamevine/tsconfig` | Shared TypeScript configs |

## Golden commands (run from repo root)

```bash
pnpm install                        # install everything
pnpm dev                            # run all dev servers via turbo
pnpm dev:web                        # web only (port 3000)
pnpm dev:api                        # api only
pnpm typecheck && pnpm lint && pnpm test   # the pre-merge gauntlet
pnpm format                         # prettier --write across the workspace
```

Scope a command to one package with `pnpm --filter @gamevine/<pkg> <cmd>`.

## Agent guidance surfaces

This repo tells agents what to do via three complementary mechanisms, in priority order:

1. **`AGENTS.md` files** (this one, plus one in each workspace). Auto-discovered by Cursor in the directory and all children.
2. **`.cursor/rules/*.mdc`** at the repo root. Flat layout, scoped by `globs` in frontmatter. Nested `.cursor/rules/` directories are NOT used because Cursor ignores them; do not create `.cursor/rules/` inside `apps/*` or `packages/*`.
3. **`.cursor/agents/*.md`** — specialized subagents. See `.cursor/rules/agent-pipeline.mdc` for the mandatory invocation pipeline.

There is also one skill at `.cursor/skills/vercel-react-best-practices/` (Vercel's 57-rule React/Next performance guide). The `react-perf-reviewer` subagent reads it before reviewing any React/Next change.

## Repo-specific reminders

- **pnpm only.** A `preinstall` hook is not yet in place, but agents must still never reach for `npm` or `yarn`. Root deps use `-w`. Internal packages use `workspace:*`.
- **Node `>=20.19`, pnpm `>=10`** (see `package.json` engines). Mismatched versions produce confusing errors.
- **Next.js 16 is new.** Your training data is probably wrong about it. Read `apps/web/node_modules/next/dist/docs/` and call the Context7 MCP before writing Next code.
- **Schema changes are a big deal.** Any change to `packages/shared/**` or `apps/api/**/*.schema.ts` must be cross-audited in both apps (see the `schema-sync` subagent).
- **Done means green.** `pnpm typecheck && pnpm lint && pnpm test` all pass before you claim a task is complete. See `.cursor/rules/definition-of-done.mdc`.

## For humans

- New to the repo? Start here, then open the `AGENTS.md` in the workspace you're working in.
- Adding a rule? Put it at `.cursor/rules/<name>.mdc` and scope it with `globs:` frontmatter. Do not create nested `.cursor/rules/` dirs — Cursor silently ignores them.
- Adding a subagent? Put it at `.cursor/agents/<name>.md` with `name`, `description`, `model: inherit` frontmatter (and `readonly: true` where appropriate).
