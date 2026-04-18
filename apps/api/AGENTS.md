# `@gamevine/api`

NestJS 11 + Drizzle ORM + PostgreSQL + Zod. Port 3001.

See the repo-root [`AGENTS.md`](../../AGENTS.md) for workspace conventions. This file covers api-specific details only.

## Rules that auto-attach here

Any file under `apps/api/**` pulls in these rules at the repo root `.cursor/rules/`:

- `nestjs-11.mdc` — module/controller/service layout, DI with symbol tokens, `DRIZZLE` injection.
- `drizzle.mdc` — schema location, migration workflow (`db:generate` → review → `db:migrate`), forbidden `db:push` outside local.
- `zod-dto.mdc` — Zod schemas over class-validator, `ZodValidationPipe`, cross-app schemas live in `@gamevine/shared`.
- `env.mdc` — all env through `AppConfigService`, single `envSchema` in `config/env.validation.ts`.

Plus all always-applied rules: `monorepo`, `definition-of-done`, `docs-first`, `commits`, `agent-pipeline`, `code-review-pipeline`, and `testing.mdc` for `*.spec.ts`.

## Source layout

```
apps/api/
  src/
    main.ts                          # bootstrap (CORS, shutdown hooks; no global ValidationPipe)
    app.module.ts                    # wires ConfigModule + AppConfigModule + DatabaseModule + features
    config/
      env.validation.ts              # single Zod env schema
      app-config.service.ts          # typed facade over ConfigService
      app-config.module.ts
    database/
      database.module.ts             # @Global, provides DRIZZLE token, manages pg.Pool lifecycle
      database.tokens.ts             # DRIZZLE symbol + DrizzleDB type
      schema.ts                      # drizzle schema entrypoint (re-exports feature schemas)
    health/
      health.module.ts
      health.controller.ts           # reference for a minimal feature module
      health.controller.spec.ts
  drizzle/                           # generated migrations
  drizzle.config.ts                  # drizzle-kit config
  test/
    jest-e2e.json                    # e2e jest config
```

## Running

```bash
pnpm dev:api                         # from repo root
pnpm --filter @gamevine/api dev
pnpm --filter @gamevine/api build
pnpm --filter @gamevine/api start
pnpm --filter @gamevine/api start:debug

pnpm --filter @gamevine/api test     # unit tests (Jest, rootDir=src, *.spec.ts)
pnpm --filter @gamevine/api test:e2e # e2e tests (needs Postgres running)
pnpm --filter @gamevine/api test:cov

pnpm --filter @gamevine/api db:generate   # generate migration from schema diff
pnpm --filter @gamevine/api db:migrate    # apply migrations (local or via env)
pnpm --filter @gamevine/api db:push       # DANGER: local-only direct push
pnpm --filter @gamevine/api db:studio     # web UI for the DB
```

## Environment

Required env vars (see `apps/api/src/config/env.validation.ts`):

| Var            | Default                 | Notes                                                                                 |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| `NODE_ENV`     | `development`           | `development` / `test` / `production`                                                 |
| `PORT`         | `3001`                  |                                                                                       |
| `DATABASE_URL` | —                       | `postgres://` or `postgresql://` only, required                                       |
| `CORS_ORIGIN`  | `http://localhost:3000` | Single origin or comma-separated list. Parsed into `string[]` before `enableCors()`.  |
| `SENTRY_DSN`   | —                       | Optional. Must be a valid URL. `AppConfigService.sentryDsn` is `string \| undefined`. |

Local setup: copy `.env.example` (create if missing, matching `envSchema`) to `.env.development.local` and fill in. The bootstrap throws a readable error listing every failing field if something is missing.

## When implementing a new feature

Prefer the `nest-feature` subagent. It scaffolds the module, controller, service, Zod DTO, optional Drizzle schema, and wires everything into `AppModule`.

When a schema change ships alongside the feature, run the `schema-sync` subagent **and** the `drizzle-migrations` subagent before merging. TSC being green is not enough.

## When investigating a production error

Prefer the `sentry-triage` subagent. Given a Sentry issue URL or ID, it pulls the error, locates the code, and proposes a fix plan.
