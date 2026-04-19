# Game Storage and Lifecycle

# Summary

- This document defines what a **game** is as a stored artifact on Gamevine.ai, how it evolves over time, and how the AI pipeline, publisher, and CDN reason about it.
- A game is the combination of **source-of-truth code in a per-game Git-style repository**, a sequence of **releases** (built, tested artifacts), and metadata (title, description, cover, owner, state).
- Templates are the **starting point** for a new game's repository and the ongoing **boundary** the AI pipeline must respect.

# Goals

- Give every piece of the platform (intake, AI pipeline, publisher, CDN, analytics) a single answer to "what is this game right now?".
- Make AI patches cheap and safe by giving each run a reproducible, isolated, versioned source tree.
- Make rollback a one-line operation: "point the current release pointer at the previous one".

# In Scope

- The repository model for an individual game.
- The release model (artifact → published bundle → current pointer).
- Game states (`draft`, `published`, `unpublished`, `dormant`, `removed`).
- The relationship between game, template, and release.
- Archival and deletion.

# Out of Scope

- The details of the AI pipeline that produces patches (see `ai-pipeline-engines-and-releases.md`).
- The details of publishing to storage/CDN (see `static-hosting-and-delivery.md`).
- Player-facing runtime and sandbox (see `player-runtime-and-sandbox.md`).
- Template customization surfaces (see `games-templates-and-constraints.md`).

# Storage Model

A **Game** owns:

- `id`, `slug` (URL-safe), `owner_user_id`, `title`, `description`, `cover_image_url`.
- `template_id` — the template it was created from. Immutable after creation.
- `state` — one of `draft | published | unpublished | dormant | removed`.
- `current_release_id` — nullable; the release currently served to players.
- `created_at`, `published_at`, `state_changed_at`.

A **GameSource** is the game's code and assets, stored in a **per-game branch of a platform-managed Git repository** (a monorepo of all games, one branch per game, or a repo per game — implementation choice, not product choice). Initial contents are a **full copy of the template** at creation time. The template is the boundary, not a live dependency: if the platform updates a template, existing games do not inherit changes (templates don't version at launch — see `games-templates-and-constraints.md`).

A **Release** represents a specific built, tested, published artifact and owns:

- `id`, `game_id`, `commit_sha` (in GameSource), `artifact_url` (in R2), `created_at`, `published_at`, `state` (`building | built | published | superseded | rolled_back`).
- Optional `roadmap_item_id` — the item whose implementation produced this release (null for the first release and for manual republishes).
- `changelog` — short human-readable description; derived from the roadmap item if present.

# Game Lifecycle (states)

- **`draft`** — creator has started creation; AI customization run may be in progress or awaiting creator preview/confirm. Not publicly reachable.
- **`published`** — `current_release_id` is set; game is live and reachable at its public URL.
- **`unpublished`** — creator or super admin hid the game. Public URL returns a 404/"unavailable" page. Source and releases are preserved. Re-publishing re-activates `current_release_id`.
- **`dormant`** — the creator-inactivity signal. The game is still playable but carries a visible "dormant" label (see `product-overview.md`). Funded-but-unimplemented items are eligible for contributor refund after the dormant grace window.
- **`removed`** — super admin removed the game for policy reasons. Public URL returns "removed". Source and releases are retained for 180 days, then purged.

State transitions:

- `draft → published` on creator-approved first publish.
- `published → unpublished` by creator toggle.
- `unpublished → published` by creator toggle.
- `published → dormant` by system (see inactivity rules).
- `dormant → published` on any qualifying creator action.
- `any → removed` by super admin.

# Release Lifecycle

- **`building`** — a pipeline run is producing this release.
- **`built`** — sandbox produced a signed artifact; not yet published.
- **`published`** — publisher uploaded to R2 and the game's `current_release_id` points here.
- **`superseded`** — a newer release replaced this one as current.
- **`rolled_back`** — this release was previously current and was replaced by an older one via rollback; the previous current is restored as `current_release_id`.

Rules:

- Publishing is atomic: `current_release_id` flips only after upload completes and a smoke check on the served URL passes.
- Only `built` releases can be published.
- Rollback flips `current_release_id` to a prior `published | superseded | rolled_back` release; the previously-current release enters `superseded` (regular rollback) or `rolled_back` (emergency rollback by admin) based on who initiated.
- A **failed** pipeline run never produces a release row; it produces a pipeline-run audit record only.

# User Flow

- **Creator creates game**: picks template → provides title/description/cover/customization inputs → AI customization run produces first GameSource commit and first built artifact → creator previews in draft → creator publishes → state becomes `published`, `current_release_id` set.
- **Roadmap item ships**: pipeline run starts from the current `commit_sha` → produces a patch → commits to the game branch → builds → if tests pass, creates a `built` release → publisher promotes to `published` → creator and contributors are notified.
- **Rollback**: creator opens release history → picks a prior release → confirms → `current_release_id` flips; players get the rolled-back bundle on next load.
- **Unpublish / republish**: creator toggles from game management.
- **Remove**: super admin action from moderation surfaces.

# Product Rules

- Every game has a **stable public slug**; slugs are globally unique, immutable after first publish.
- The game's public URL always serves the release pointed to by `current_release_id`. There is no version pinning in the public URL at launch.
- Every release is **immutable** once `built`. Re-running a pipeline produces a new release, not an overwrite.
- The creator can **always** roll back to any prior `published | superseded | rolled_back` release.
- **Deletion by creator** is available on `draft` games only. Published games can be **unpublished**, not deleted, at launch.
- **Removal by super admin** preserves audit history but hides the game from the public.
- Template identity is **fixed** at creation; moving a game to another template is not supported at launch.
- Customization beyond the template's allowed surfaces is rejected at intake (see `games-templates-and-constraints.md`).

# Launch Acceptance Criteria

- Creating a game produces a GameSource branch with the template fully copied and a single commit marker `chore(init): from template <id>`.
- First publish requires a successful build of the initial source.
- Rollback is a single-action flip that affects the public URL within 60 seconds.
- Unpublished games return a clear "unavailable" page within 60 seconds of the action.
- Release history for a game is visible to its creator and lists at least: created_at, published_at, roadmap item (if any), changelog, and `[Rollback to this release]` action for prior ones.

# Frontend Notes

- Creator's **Game Management** page surfaces: current release, history, `[Publish]`, `[Unpublish]`, `[Rollback]`, state badge.
- Player-facing game detail never exposes `commit_sha` or internal release ids; it can show "Updated <date>: <changelog>".

# Backend Notes

- GameSource is created via a service-side "copy-template-to-branch" action; no user-facing Git interface.
- Pipeline runs operate on a fresh worktree of the game branch (see `ai-pipeline-engines-and-releases.md`); results are committed by the worker's service account.
- Publisher holds scoped R2 credentials; worker does not (see `static-hosting-and-delivery.md`).

# Technical Notes

- Directional: one platform-managed Git host (simple: a single repo per game on GitHub or a self-hosted git server; decision deferred to implementation).
- Artifacts live in R2 under `games/<gameId>/releases/<releaseId>/` with a stable manifest file.
- The public serving URL for a game resolves `currentReleaseId` via a fast lookup (KV or a cached DB read) and returns the corresponding bundle manifest.

# Edge Cases

- Rapid successive publishes (two pipeline runs finish near-simultaneously) → publisher serializes by `game_id`; later run wins, earlier becomes `superseded`.
- A rollback target release's assets are missing from R2 → rollback fails loud and is logged; admin intervenes.
- A game becomes `dormant` while a pipeline run is in flight → run completes normally; publish succeeds; `dormant → published` transition happens as part of publish.
- Creator deletion → games they own are **not** auto-transferred; super admin decides per-game whether to unpublish or remove (see `users-roles-and-permissions.md`).

# Open Questions

- Deferred: template migration between games.
- Deferred: cross-game forking.
- Deferred: public version history URL for players (e.g., play a specific prior release).

# Suggested Epics

- Launch game storage model (game, source, release) and state machine.
- Launch release lifecycle including publish and rollback.
- Launch creator-facing game management surfaces.

# Suggested Tickets

- Implement Game / Release schema with the states defined here.
- Implement "create game from template" service action that forks the template into a game branch.
- Implement publisher promotion flow with atomic `current_release_id` flip.
- Implement creator rollback action.
- Implement unpublish / republish actions.
- Implement super-admin remove action.
- Implement release history surface for creators.
