# Design system

Gamevine's design language is intentionally set _before_ the foundation work (auth, schema, pipeline). Locking a palette, typography, and density early prevents every downstream surface from being quietly themed twice.

This document covers:

1. How the design sandbox is structured.
2. How to use it to make a decision.
3. The semantic token contract the real product will inherit once a theme is chosen.
4. How to promote the chosen theme out of the sandbox.

## TL;DR

- Visit `/design` in the web app with `NEXT_PUBLIC_DESIGN_SANDBOX=1` set.
- Switch through four themes × light/dark × three fonts × two densities.
- Your selection is saved in `localStorage` — no server round-trip.
- When a theme is chosen: we promote its tokens into `apps/web/src/app/globals.css` and delete `apps/web/src/app/design/` (or keep it as an internal regression surface — our call at that point).

## Running the sandbox

```bash
# one-time — copy the example env
cp apps/web/.env.local.example apps/web/.env.local
# NEXT_PUBLIC_DESIGN_SANDBOX=1 is already in the example.

pnpm dev:web
# open http://localhost:3000/design
```

If the flag is off (including in production), the entire `/design/*` subtree returns 404 — the files still exist on disk so `typedRoutes: true` keeps working, but `layout.tsx` calls `notFound()` at runtime.

## What the sandbox includes

Route group at `apps/web/src/app/design/`:

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

## The four candidate themes

All four span "vibrant + energetic". They differ along four axes: base mode (dark-first vs light-first), hue temperature, saturation curve, and whether the accent system is mono or dual.

| Theme            | Mode        | Character                                                            |
| ---------------- | ----------- | -------------------------------------------------------------------- |
| **Arcade Neon**  | dark-first  | Electric cyan + hot magenta on near-black. Late-night arcade energy. |
| **Citrus Pop**   | light-first | Lime + orange + plum on cream. Fresh, playful, indie.                |
| **Jewel Rush**   | dark-first  | Emerald + amethyst + sunburst gold. Premium indie.                   |
| **Sunset Blitz** | light-first | Coral + violet + amber on warm off-white. Confident and warm.        |

## Semantic token contract

Every theme maps the same thirteen tokens. Components never reference a raw color — they only reference a token. This is the contract we carry forward.

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

- `--gv-radius` — per-theme corner radius (each palette has a different feel).
- `--font-gv-sans` — swap font family via the font pill in the switcher.
- `--gv-density` — 1.0 comfortable, 0.85 compact.

## The switcher

Four independent axes, each persisted:

- **Palette**: `arcade-neon | citrus-pop | jewel-rush | sunset-blitz`
- **Mode**: `light | dark`
- **Font**: `geist | jakarta | grotesk`
- **Density**: `comfortable | compact`

Implementation: plain client component using `useSyncExternalStore` against `localStorage`. Cross-tab sync is free (listens to `storage` events). No FOUC on return visits because the first paint re-applies the saved state in a layout effect; a brief blip on _first_ visit is acceptable for a dev tool.

## Why the sandbox is a separate CSS file

The sandbox's semantic tokens live in `apps/web/src/app/design/_styles/sandbox.css`, _not_ in `globals.css`. Reasons:

1. `components.json` points shadcn's CLI at `globals.css`. Future `shadcn add` runs regenerate that `@theme` block. Sandbox tokens would be clobbered.
2. The blast radius stays tight. If we scrap the whole sandbox, one folder deletion reverts it.
3. Bundle discipline: sandbox CSS only loads when the design routes render.

## Promotion path

When a theme wins:

1. Add the chosen theme's token values (from `sandbox.css`) into `apps/web/src/app/globals.css` under the existing `:root` / `.dark` blocks, remapped to the shadcn tokens (`--background`, `--card`, `--primary`, etc.) rather than the `--color-gv-*` namespace. This lets shadcn components pick up the new palette automatically.
2. Replace the chosen font pairing in the root `layout.tsx` (Geist is already wired; if we pick Plus Jakarta Sans or Space Grotesk instead, swap the import and variable).
3. Decide the fate of `/design`: delete it (simplest) or keep it with the flag off by default as an internal regression surface.

## Boundaries

- Do not link to `/design/*` from any production route.
- Do not import `_fixtures/*` from outside the sandbox.
- Do not move the sandbox's `--color-gv-*` tokens into `globals.css` until promotion — they're meant to be a transient namespace.
