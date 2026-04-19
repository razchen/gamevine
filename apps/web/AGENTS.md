# `@gamevine/web`

Next.js 16 + React 19 + Tailwind v4 + TanStack Query + axios. Port 3000.

See the repo-root [`AGENTS.md`](../../AGENTS.md) for workspace conventions. This file covers web-specific details only.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Rules that auto-attach here

Any file under `apps/web/**` pulls in these rules at the repo root `.cursor/rules/`:

- `nextjs-16.mdc` — App Router, async `params`, Server Components by default, route handlers, `remotePatterns`.
- `react-19.mdc` — refs as props, `use()`, Actions, `useActionState`, memoization hygiene under the compiler.
- `tailwind-v4.mdc` — CSS-first config, `@theme`, oklch tokens, shadcn + `cva`.
- `data-fetching.mdc` — shared axios instance, TanStack Query keys, when not to use React Query.
- `casl.mdc` — authorization with `@casl/react`: `AbilityContext`, `<Can>`, `useAbility()`, UI gating is a hint not a gate.

Plus all always-applied rules: `monorepo`, `definition-of-done`, `docs-first`, `commits`, `agent-pipeline`, `code-review-pipeline`.

## Source layout

```
apps/web/src/
  app/                   # App Router routes
    layout.tsx           # root layout (Geist fonts, dark-mode root)
    page.tsx
    providers.tsx        # client QueryClientProvider
    globals.css          # Tailwind v4 entry, @theme tokens, oklch palette
  components/
    ui/                  # shadcn-owned components
  lib/
    api.ts               # shared axios instance + typed helpers
    utils.ts             # cn() and other UI helpers
```

## Running

```bash
pnpm dev:web                         # from repo root (port 3000)
pnpm --filter @gamevine/web dev      # equivalent
pnpm --filter @gamevine/web build
pnpm --filter @gamevine/web lint
pnpm --filter @gamevine/web typecheck
pnpm --filter @gamevine/web test
```

## Environment

Web env vars are loaded by Next.js from `.env.local`, `.env.development`, etc. The web app talks to the api via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001` — see `apps/web/src/lib/api.ts`). Only `NEXT_PUBLIC_*` vars are exposed to the browser.

Remember `next.config.ts` declares `transpilePackages: ['@gamevine/shared']`, so `@gamevine/shared` code lands in the browser bundle when imported from a client component — keep `packages/shared` pure (see `shared-purity.mdc`).

## Authorization (CASL)

- The authenticated user's CASL rules arrive from the API as JSON (`ability.rules`) on sign-in and session refresh.
- Rehydrate into an `Ability` via `createMongoAbility(rules)` from `@casl/ability`, and expose it through a single `AbilityContext` at the root of the authenticated tree (typically in `app/(authenticated)/layout.tsx`).
- Gate UI with `<Can I="approve" a="Idea">...</Can>` or `const ability = useAbility(AbilityContext); ability.can(...)`. Don't read `user.role` in components.
- `<Can>` is a **UX hint**, not a security boundary. The API re-checks every write via its `PoliciesGuard`. If your UI is gating something the API doesn't also gate, the API is wrong.
- See `.cursor/rules/casl.mdc` for the canonical setup and `docs/product/users-roles-and-permissions.md` for the matrix these rules implement.

## When implementing a new route

Prefer the `web-route` subagent. It scaffolds the App Router files, respects the Server/Client split, and wires TanStack Query only where you need it.

## When debugging UI against a design

If a Figma link is involved, read the design context first via the Figma MCP and map each element to a component in `apps/web/src/components/ui/`. Don't substitute "close-enough" components.
