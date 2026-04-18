---
description: Generate, review, and apply a Drizzle migration for the api with destructive-op safety.
---

Run the `drizzle-migrations` subagent to handle the current Drizzle schema diff end-to-end.

Context (if any): $ARGUMENTS

Process (strict):

1. Verify `DATABASE_URL` points to localhost. If it does not, abort — this command never runs against non-local databases.
2. `pnpm --filter @gamevine/api db:generate` — generate the migration.
3. Read the new SQL files under `apps/api/drizzle/` in full. Flag:
   - `DROP TABLE` / `DROP COLUMN` / `DROP INDEX` / `DROP CONSTRAINT` → data-loss risk.
   - `ALTER COLUMN ... TYPE` without a `USING` clause.
   - `ADD COLUMN ... NOT NULL` with no default.
   - Renames that Drizzle emitted as `DROP` + `ADD`.
   - `TRUNCATE`.
4. If anything is flagged, STOP and ask me to confirm intent before applying. Do not auto-approve destructive SQL.
5. `pnpm --filter @gamevine/api db:migrate` — apply.
6. Re-run `db:generate` — must report no further changes. If it does, flag schema drift and stop.
7. `pnpm --filter @gamevine/api test` — must stay green.
8. Invoke `schema-sync` to audit both apps for call-site breakage beyond TypeScript's reach.

Never run `db:push` from this command — that is a local-only escape hatch documented in `.cursor/rules/drizzle.mdc`.
