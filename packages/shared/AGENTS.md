# `@gamevine/shared`

The contract surface between `@gamevine/web` and `@gamevine/api`. Cross-app types, Zod schemas, and constants.

See the repo-root [`AGENTS.md`](../../AGENTS.md) for workspace conventions. This file covers shared-specific details only.

## Rules that auto-attach here

Any file under `packages/shared/**` pulls in `shared-purity.mdc` from the repo root `.cursor/rules/`. Read it before adding code.

## The one-line summary

This package runs in both **Node (NestJS)** and **the browser (Next.js via `transpilePackages`)**. That's why the purity rules exist. Code here must not touch `process.env`, `window`, `document`, `fs`, `path`, or any framework.

## What lives here

- **Zod schemas** that cross the api/web boundary (request/response shapes, shared primitive schemas like `UuidSchema`).
- **Types inferred** from those schemas (`export type Foo = z.infer<typeof Foo>`).
- **App-level constants** (`APP_NAME`, `API_HEALTH_PATH`).
- **CASL ability definitions** — subject/action string unions, `AppAbility` type, and the `defineAbilitiesFor(user)` factory. Both apps consume the same ability rules. See `.cursor/rules/casl.mdc`.
- **Pure helpers** with no environmental dependencies.

## What does NOT live here

- Drizzle row types (api-only).
- React components or hooks (web-only).
- Nest decorators, pipes, guards (api-only).
- Axios clients (web-only).
- Single-app utilities — put those in `apps/<x>/src/lib/`.

## Current contents

```
packages/shared/src/
  index.ts        # public surface — re-exports constants and types
  constants.ts    # APP_NAME, APP_TAGLINE, API_HEALTH_PATH, ...
  types.ts        # HealthStatus, HealthResponse
```

## Dependencies

Runtime dependencies allowed without further agreement: **`zod`** and **`@casl/ability`**. Both are isomorphic, pure, and their whole value comes from being shared across both apps. Anything else: dev-dep or don't add it.

## Making changes

Any change to an exported symbol is a two-app contract change:

1. Edit the file.
2. `pnpm typecheck` from root — catches compile-time breakage.
3. Invoke the `schema-sync` subagent — it audits both apps for runtime / call-site issues `tsc` misses (removed enum values, renamed fields, serialization changes, etc.).
4. Fix anything it flags in the same change.
5. Add or update a spec under `packages/shared/src/**/<name>.spec.ts`.

## Running

```bash
pnpm --filter @gamevine/shared build
pnpm --filter @gamevine/shared lint
pnpm --filter @gamevine/shared typecheck
pnpm --filter @gamevine/shared test
```

## Import paths

Both apps import from the top-level module specifier only:

```ts
import { APP_NAME, type HealthResponse } from '@gamevine/shared';
```

Do not import sub-paths (`@gamevine/shared/src/types`) from the apps.
