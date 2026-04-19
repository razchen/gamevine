# Static Hosting and Delivery

# Summary

- Games ship as **static bundles** uploaded to **object storage** and served via a **CDN**; players run them entirely in the **browser** with **no dedicated game servers** per title.
- Successful build artifacts should be promoted to delivery infrastructure by a **separate publishing service**, not by the AI/build worker directly.

# Goals

- Minimize hosting cost and operational complexity for creators.
- Ensure fast, reliable global delivery of static assets.
- Keep release credentials isolated from the worker system that runs AI patching and builds.

# In Scope

- Build output as **static files** (HTML/CSS/JS/assets).
- **Object storage** for bundles and **CDN** for delivery.
- Clear separation: **game runtime** is static; **platform** provides accounts, credits, requests, builds.
- A publishing flow where successful artifacts move from the build pipeline into object storage through a dedicated release path.

# Out of Scope

- Always-on authoritative game servers for gameplay simulation.
- Direct publishing from sandboxed build jobs into production delivery infrastructure.

# User Flow

- Pipeline produces a release artifact → publisher service uploads the artifact to object storage → CDN serves the published bundle → player loads and plays offline-capable static gameplay (within browser constraints).

# Product Rules

- Games should remain compatible with **static hosting assumptions** at launch.
- Build workers should not hold the production credentials used to publish live game bundles.
- A separate publisher/release service should be responsible for promoting successful artifacts to Cloudflare-managed storage and delivery infrastructure.
- Release promotion should happen only after build/test gates succeed upstream.

# URL Scheme (launch)

- **Player (public)**: `https://<gameSlug>.gamevineusercontent.com/` — serves the current release's bundle. Isolated origin per `player-runtime-and-sandbox.md`.
- **App-embedded game page**: `https://gamevine.ai/play/<gameSlug>` — the app page that embeds the game iframe and renders surrounding UI (roadmap, funding, etc.).
- **Game detail (non-play)**: `https://gamevine.ai/game/<gameSlug>` — public game detail page (description, roadmap, contributors). Public, no signin required.
- **Slugs**: globally unique, `[a-z0-9-]`, 3–40 chars, immutable after first publish.

# Release Addressing

- The public player URL always serves the **current release**. There is **no** version-pinned public URL at launch (deferred).
- Internally, each release has a stable R2 path: `games/<gameId>/releases/<releaseId>/`.
- A per-game **manifest file** (`games/<gameId>/current.json`) is the source of truth for "what release is current". The player subdomain resolves through this manifest via a KV-backed fast path.

# Cache & Invalidation

- Per-release bundle files are uploaded with **immutable, content-hashed filenames** and `Cache-Control: public, max-age=31536000, immutable`.
- The `index.html` and `current.json` manifest are served with `Cache-Control: public, max-age=60, must-revalidate` so a publish or rollback propagates in about a minute.
- On publish or rollback, the publisher explicitly purges the manifest and `index.html` CDN cache for that game; asset files are not purged because they are content-hashed.
- Telemetry endpoint (`telemetry.gamevine.ai`) is never cached.

# Rollback Behavior (launch)

- Creator-initiated rollback on a published game flips `current.json` to a prior release. Previous release's state becomes `superseded` (see `game-storage-and-lifecycle.md`).
- Super-admin force-rollback is available from admin surfaces and writes an audit log entry marking the prior release as `rolled_back`.
- Rollback propagation SLA: the rolled-back bundle is served to new requests within **60 seconds** of the action. In-flight players keep their current session.

# Frontend Notes

- Player-facing delivery should hide the internal split between build workers and the publisher service.
- Release behavior should still account for loading, updates, and cache freshness at the product level.

# Backend Notes

- The hosting path should separate **artifact creation** from **artifact publication**.
- Publishing services should hold the scoped credentials needed to upload to Cloudflare R2 and perform related delivery actions.
- Worker infrastructure should hand off successful artifacts without receiving broad production access.

# Technical Notes

- Directional: **Cloudflare R2** (or equivalent) + CDN; global edge delivery.
- A safe launch design is: centralized worker infrastructure builds artifacts, then a separate publisher service with scoped Cloudflare access promotes them.

# Edge Cases

- Broken deploy after a successful build.
- Partial upload or failed artifact promotion.
- CDN staleness or delayed propagation after publish.
- Large asset sets that slow publishing or invalidation behavior.
- Security risk if build and publish responsibilities are not separated clearly enough.

# Resolved Questions

- **Version pinning**: no public version-pinning URL at launch. Players always see the current release.
- **Rollback**: defined above under "Rollback Behavior (launch)"; also covered in `game-storage-and-lifecycle.md`.

# Open Questions

- Deferred: player-facing version history URL (play a specific prior release).

# Suggested Epics

- Define the release promotion path from successful artifact to public delivery.
- Define credential separation between workers and publishing services.
- Define reliable object storage + CDN delivery behavior for launch.

# Suggested Tickets

- Define release artifact naming and handoff expectations between worker and publisher.
- Define the scoped publishing permissions required for Cloudflare upload and delivery actions.
- Define launch rollback expectations for published static bundles.
