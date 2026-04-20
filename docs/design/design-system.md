# Design system

Gamevine's design language is intentionally set _before_ the foundation work (auth, schema, pipeline). Locking a palette, typography, and density early prevents every downstream surface from being quietly themed twice.

This document covers:

1. The chosen production palette (Graphite).
2. How Graphite's tokens map onto the shadcn API in `globals.css`.
3. The two design surfaces under `/design` and what each is for.
4. The semantic token contract the sandbox uses.

## TL;DR

- **Graphite** is the production palette. Its tokens live in `apps/web/src/app/globals.css` under the standard shadcn names (`--background`, `--primary`, `--accent`, etc.).
- The app respects OS preference by default via `next-themes` (`defaultTheme="system"`). No in-app toggle exists yet — that lands when the real app shell does.
- `/design` is a development-only surface behind `NEXT_PUBLIC_DESIGN_SANDBOX=1`. Two siblings live under it: **`(sandbox)`** — palette / font / density scratchpad on its own `--color-gv-*` tokens — and **`/design/ui`** — production-token component gallery rendering real shadcn primitives.

## Two surfaces under `/design`

The outer `apps/web/src/app/design/layout.tsx` is a pure flag gate. Two sibling route groups live underneath, each with its own shell:

| Route         | Purpose                                              | Tokens                                      |
| ------------- | ---------------------------------------------------- | ------------------------------------------- |
| `/design/*`\* | Palette / theme / font / density scratchpad.         | `--color-gv-*` in `_styles/sandbox.css`     |
| `/design/ui`  | Production-token component gallery. Real primitives. | Shadcn tokens from `globals.css` (Graphite) |

\* Served by the `(sandbox)` route group — parentheses don't show up in URLs.

Mapping of files on disk:

```
apps/web/src/app/design/
├── layout.tsx               # flag gate, no chrome
├── _components/             # sandbox primitives + switcher + nav
├── _fixtures/               # sandbox mock data
├── _styles/sandbox.css      # --color-gv-* tokens
├── (sandbox)/
│   ├── layout.tsx           # sandbox shell (fonts, ThemeProvider, switcher, nav)
│   ├── page.tsx
│   ├── browse/              # … and the other 7 surfaces
│   └── …
└── ui/
    ├── layout.tsx           # gallery shell + <Toaster />
    ├── _components/
    │   ├── component-example.tsx   # side-by-side light/dark wrapper
    │   └── ui-nav.tsx
    ├── page.tsx             # component index
    ├── buttons/             # and 8 other primitive pages
    └── …
```

## Graphite → shadcn mapping

Every shadcn token name is preserved. The only "gotcha" is that shadcn's `--accent` is **not** the brand accent — it's the hover/selected background color. Graphite's indigo goes into `--primary` (where shadcn expects the CTA color). A header comment in `globals.css` spells this out.

| shadcn token                      | Graphite role         | Light (`:root`)         | Dark (`.dark`)           |
| --------------------------------- | --------------------- | ----------------------- | ------------------------ |
| `--background`                    | page bg               | `oklch(0.99 0.003 255)` | `oklch(0.145 0.012 255)` |
| `--foreground`                    | primary text          | `oklch(0.22 0.02 255)`  | `oklch(0.96 0.005 255)`  |
| `--card` / `--popover`            | elevated surface      | `oklch(1 0 0)`          | `oklch(0.185 0.012 255)` |
| `--primary`                       | **brand indigo, CTA** | `oklch(0.48 0.14 260)`  | `oklch(0.7 0.14 260)`    |
| `--primary-foreground`            | text on CTA           | `oklch(0.99 0 0)`       | `oklch(0.14 0.012 255)`  |
| `--secondary` / `--muted`         | muted surface         | `oklch(0.97 0.005 255)` | `oklch(0.23 0.012 255)`  |
| `--muted-foreground`              | secondary text        | `oklch(0.48 0.02 255)`  | `oklch(0.64 0.015 255)`  |
| `--accent` _(hover/selected bg!)_ | subtle hover fill     | `oklch(0.97 0.005 255)` | `oklch(0.23 0.012 255)`  |
| `--destructive`                   | danger                | `oklch(0.55 0.15 25)`   | `oklch(0.64 0.13 25)`    |
| `--border` / `--input`            | borders               | `oklch(0.9 0.01 255)`   | `oklch(0.3 0.012 255)`   |
| `--ring`                          | focus ring = brand    | `oklch(0.48 0.14 260)`  | `oklch(0.7 0.14 260)`    |
| `--chart-1..5`                    | indigo → amber ramp   | see `globals.css`       | see `globals.css`        |
| `--sidebar-*`                     | sidebar tokens        | mirrors light           | mirrors dark             |
| `--radius`                        | corner radius         | `0.5rem`                | `0.5rem`                 |

### Product-specific tokens (not in shadcn baseline)

Three families are added because shadcn doesn't cover them. They're threaded through `@theme inline` so `bg-credits`, `text-success`, `border-warning`, etc. work as Tailwind utilities out of the box.

| Token                  | Purpose                         | Light                 | Dark                    |
| ---------------------- | ------------------------------- | --------------------- | ----------------------- |
| `--credits`            | credit amounts & chips (amber)  | `oklch(0.58 0.14 80)` | `oklch(0.8 0.13 85)`    |
| `--credits-foreground` | text on credits bg              | `oklch(0.18 0.03 70)` | `oklch(0.14 0.012 255)` |
| `--success`            | funded / released / positive    | `oklch(0.52 0.1 150)` | `oklch(0.7 0.08 150)`   |
| `--success-foreground` | text on success bg              | `oklch(0.99 0 0)`     | `oklch(0.14 0.012 255)` |
| `--warning`            | queued / SLA expiring / caution | `oklch(0.62 0.13 75)` | `oklch(0.78 0.1 80)`    |
| `--warning-foreground` | text on warning bg              | `oklch(0.18 0.03 70)` | `oklch(0.14 0.012 255)` |

## Light / dark mode

`next-themes` manages the `.dark` class on `<html>`:

- `attribute="class"` — matches `@custom-variant dark (&:is(.dark *))` in `globals.css`.
- `defaultTheme="system"` — respects OS preference (`prefers-color-scheme`).
- `enableSystem` — `system` is a recognized explicit choice alongside `light` / `dark` once a toggle UI exists.
- `disableTransitionOnChange` — prevents a one-frame color-transition flash when the class flips.

No user-facing toggle exists yet. When one is added, it will be a single shadcn Select or SegmentedControl feeding `useTheme()` — no new providers or tokens needed.

### The `.light` alias

`globals.css` declares its light tokens on `:root, .light`. That lets a descendant force light mode even when `<html>` is currently `.dark` — necessary for the component gallery's side-by-side previews. In the normal app flow `<html>` is either `.light` or `.dark`, so the alias is a no-op for users.

## The `/design/ui` component gallery

`/design/ui` renders every shadcn primitive we ship, using the Graphite tokens exactly as production does. Nothing here is re-themed. If a button looks wrong in the gallery, it looks wrong in the app.

### Side-by-side light/dark technique

Every example is wrapped in `ComponentExample`, which renders the children twice:

- **Left pane** — wrapped in a `<div class="light">`. Graphite light tokens cascade into this subtree.
- **Right pane** — wrapped in a `<div class="dark">`. The `@custom-variant dark (&:is(.dark *))` rule in `globals.css` flips to the dark overrides.

Children render as two independent React instances per example. If a caller passes a stateful child (controlled input, open Dialog, etc.), each pane owns its own state. Deliberate — a "sync both" option would require lifting state out of the gallery.

### Portaled primitives

Dialog content, Tooltip content, and Sonner toasts all portal to `document.body` — outside the scoped `.light` / `.dark` wrappers. Side-by-side would show the same live theme in both panes for those.

`ComponentExample` handles this with the `unportaled={false}` prop: the example renders a single preview that tracks the live app theme, with an inline note explaining why. Use it on every portaled primitive.

### The sonner mount

A single `<Toaster />` is mounted in `apps/web/src/app/design/ui/layout.tsx` so any gallery page can trigger toasts. It is NOT mounted globally — production decides where toasts live.

## The sandbox

The `(sandbox)` route group lives at `/design` (and `/design/browse`, `/design/wallet`, etc.) as an isolated re-theming scratchpad. It is **not** a mirror of production; it maintains its own `--color-gv-*` token set so palette experiments can't bleed into shipped UI.

```bash
# one-time — copy the example env
cp apps/web/.env.local.example apps/web/.env.local
# NEXT_PUBLIC_DESIGN_SANDBOX=1 is already in the example.

pnpm dev:web
# open http://localhost:3000/design
```

If the flag is off (including in production), the entire `/design/*` subtree returns 404. The files still exist on disk so `typedRoutes: true` keeps working, but `layout.tsx` calls `notFound()` at runtime.

### What the sandbox includes

Files under `apps/web/src/app/design/(sandbox)/`:

| Path                 | What it tests                                   |
| -------------------- | ----------------------------------------------- |
| `/design`            | Index + theme overview                          |
| `/design/palettes`   | Every semantic token, swatched                  |
| `/design/typography` | Type scale, numerics, credit formatting         |
| `/design/components` | Buttons, badges, progress bars, inputs          |
| `/design/browse`     | Discovery grid — the first thing a visitor sees |
| `/design/game`       | Game detail + roadmap with funding progress     |
| `/design/play`       | Chrome around the embedded game runtime         |
| `/design/manage`     | Creator surface: idea inbox + release history   |
| `/design/wallet`     | Balances, grant meter, append-only ledger       |

All fixtures are mock data in `apps/web/src/app/design/_fixtures/`. The sandbox never hits the real API.

### Sandbox themes

Three restrained, classy palettes live side-by-side so we can still A/B if we want to reconsider. **Graphite** is the current production choice.

| Theme           | Mode       | Character                                                              |
| --------------- | ---------- | ---------------------------------------------------------------------- |
| **Graphite** ✅ | dark-first | Cool ink neutrals with indigo CTA and amber credits. Technical.        |
| **Ember**       | dark-first | Warm charcoal with muted violet CTA and gold credits. Editorial.       |
| **Obsidian**    | dark-first | Pure monochrome with deep plum CTA and bronze credits. The restrained. |

### Sandbox token contract

Every sandbox theme maps the same thirteen tokens. Components in the sandbox never reference a raw color — they only reference a token.

| Token                      | Purpose                            |
| -------------------------- | ---------------------------------- |
| `--color-gv-bg`            | Page background                    |
| `--color-gv-surface`       | Card / panel background            |
| `--color-gv-surface-muted` | Table row hover, input backgrounds |
| `--color-gv-border`        | Default border                     |
| `--color-gv-text`          | Primary text                       |
| `--color-gv-text-muted`    | Secondary / meta text              |
| `--color-gv-accent`        | Primary brand accent (CTAs)        |
| `--color-gv-accent-fg`     | Foreground on accent background    |
| `--color-gv-accent-2`      | Secondary brand accent             |
| `--color-gv-success`       | Funded / released / positive       |
| `--color-gv-warning`       | Queued / running / SLA expiring    |
| `--color-gv-danger`        | Rejected / destructive             |
| `--color-gv-credits`       | Credit amounts everywhere          |

Plus:

- `--gv-radius` — per-theme corner radius.
- `--font-gv-sans` — swap font family via the font pill in the switcher.
- `--gv-density` — 1.0 comfortable, 0.85 compact.

### The switcher

Four independent axes, each persisted to `localStorage`:

- **Palette**: `graphite | ember | obsidian`
- **Mode**: `light | dark`
- **Font**: `geist | jakarta | grotesk`
- **Density**: `comfortable | compact`

Implementation: plain client component using `useSyncExternalStore` against `localStorage`. Cross-tab sync is free (listens to `storage` events).

## Why the sandbox is a separate CSS file

The sandbox's semantic tokens live in `apps/web/src/app/design/_styles/sandbox.css`, _not_ in `globals.css`. Reasons:

1. `components.json` points shadcn's CLI at `globals.css`. Future `shadcn add` runs regenerate the `@theme` block; sandbox tokens would be clobbered.
2. The blast radius stays tight. If we scrap the whole sandbox, one folder deletion reverts it.
3. Bundle discipline: sandbox CSS only loads when `/design/*` routes render.

## Boundaries

- Do not link to `/design/*` or `/design/ui/*` from any production route.
- Do not import `_fixtures/*` from outside the sandbox.
- The sandbox's `--color-gv-*` tokens are a **separate namespace** from production's shadcn tokens. Don't cross the streams — the production app reads `--primary`, not `--color-gv-accent`.
- The `/design/ui` gallery, by contrast, reads production tokens directly. That's the whole point — it's a mirror, not a scratchpad.
