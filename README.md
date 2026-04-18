# Gamevine.ai

Monorepo for **Gamevine.ai** — a platform focused on browser-based games and
community-driven updates.

This repo contains the initial environment: a Next.js 16 web app, a NestJS 11
API, a shared TypeScript package, and root tooling (Turborepo, pnpm workspaces,
ESLint 10 flat config, Prettier 3, TypeScript 6). No product features yet.

---

## Stack

| Area            | Tool / Version                                                                 |
| --------------- | ------------------------------------------------------------------------------ |
| Monorepo        | pnpm 10.33 workspaces + Turborepo 2.9                                          |
| Language        | TypeScript 6                                                                   |
| Frontend        | Next.js 16 (App Router, Turbopack), React 19.2, Tailwind CSS 4.2, shadcn/ui    |
| Data fetching   | TanStack Query 5 (the library formerly known as React Query) + Axios          |
| Backend         | NestJS 11 on Express, zod-validated config                                     |
| Database / ORM  | PostgreSQL 15+ (local) + Drizzle ORM 0.45 (`node-postgres` driver)             |
| Linting / style | ESLint 10 (flat config), `typescript-eslint` 8, Prettier 3.8                   |

---

## Repo layout

```
gamevine/
  apps/
    web/                # @gamevine/web — Next.js 16 frontend
    api/                # @gamevine/api — NestJS 11 backend
  packages/
    shared/             # @gamevine/shared — cross-cutting types & constants
    tsconfig/           # @gamevine/tsconfig — shared TypeScript bases
    eslint-config/      # @gamevine/eslint-config — shared flat ESLint configs
  docs/                 # Project docs (README placeholder for now)
  .env.example          # Master list of env vars (per-app examples also exist)
  turbo.json            # Turborepo task pipeline
  pnpm-workspace.yaml   # pnpm workspace manifest
```

---

## Prerequisites

- **Node.js** >= 20.19 (ESLint 10 requires this; Node 22 LTS recommended)
- **pnpm** >= 10.33 (install with `corepack enable` or `npm i -g pnpm`)
- **PostgreSQL** >= 13 (a local instance on `localhost:5432` is assumed)

---

## Quickstart

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment files
cp .env.example .env                       # optional reference
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# 3. Create the local database
createdb gamevine

# 4. Push the (empty) Drizzle schema — verifies DB wiring
pnpm --filter @gamevine/api db:push

# 5. Run both apps together
pnpm dev
```

Once up:

- Web: http://localhost:3000
- API: http://localhost:3001
- Health check: `curl http://localhost:3001/health`

---

## Scripts

Run at the repo root; Turborepo fans out to each workspace in parallel.

| Command             | What it does                                           |
| ------------------- | ------------------------------------------------------ |
| `pnpm dev`          | Run every app's `dev` task in parallel                 |
| `pnpm dev:web`      | Only the Next.js frontend                              |
| `pnpm dev:api`      | Only the NestJS backend                                |
| `pnpm build`        | Build every app (respects `^build` deps)               |
| `pnpm lint`         | ESLint across every workspace                          |
| `pnpm typecheck`    | `tsc --noEmit` across every workspace                  |
| `pnpm test`         | Run every workspace's `test` task                      |
| `pnpm format`       | Prettier-write the whole repo                          |
| `pnpm format:check` | Prettier-check the whole repo                          |
| `pnpm clean`        | Remove build output, `.turbo`, and root `node_modules` |

### API-specific (run inside `apps/api` or with `pnpm --filter @gamevine/api <script>`)

| Command          | What it does                                 |
| ---------------- | -------------------------------------------- |
| `dev`            | `nest start --watch`                         |
| `build`          | `nest build`                                 |
| `start`          | Run the compiled server from `dist/main.js`  |
| `db:generate`    | Generate SQL migrations from Drizzle schema  |
| `db:migrate`     | Apply generated migrations                   |
| `db:push`        | Push schema directly to the DB (dev only)    |
| `db:studio`      | Open Drizzle Studio                          |

---

## Environment variables

Documented in full in [`.env.example`](.env.example). Summary:

| Variable              | Consumer | Purpose                                     |
| --------------------- | -------- | ------------------------------------------- |
| `NODE_ENV`            | both     | `development` \| `test` \| `production`     |
| `DATABASE_URL`        | api      | Postgres connection string                  |
| `PORT`                | api      | HTTP port the Nest server binds             |
| `CORS_ORIGIN`         | api      | Allowed browser origin                      |
| `NEXT_PUBLIC_API_URL` | web      | Base URL the web app uses to reach the API  |

Each app also has its own example file (`apps/api/.env.example`,
`apps/web/.env.local.example`) for locality. `.env*` files are gitignored
except for `*.example` / `*.local.example`.

---

## Packages

- **`@gamevine/shared`** — intentionally tiny. Holds cross-cutting constants
  (`APP_NAME`, `API_HEALTH_PATH`) and types (`HealthResponse`). Consumed as
  source (no build step) via `transpilePackages` on web and direct TS
  resolution on api.
- **`@gamevine/tsconfig`** — `base.json`, `nextjs.json`, `nestjs.json`,
  `react-library.json`. Extend these from each workspace's `tsconfig.json`.
- **`@gamevine/eslint-config`** — flat-config exports (`base`, `next`, `nest`)
  that each app's `eslint.config.{js,mjs}` composes.

---

## What's explicitly **not** here yet

- No auth / users / games / requests / credits / AI modules
- No product pages in web — just a bootstrap placeholder
- No Docker / compose files
- No CI workflows
- No Redis

Add these as feature work lands. See [`docs/README.md`](docs/README.md).
