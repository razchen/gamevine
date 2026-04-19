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

# Open Questions

- Should players always receive the latest release on the main game page, or should some version pinning exist?
- What rollback behavior should exist if a published static bundle is later found to be bad?

# Suggested Epics

- Define the release promotion path from successful artifact to public delivery.
- Define credential separation between workers and publishing services.
- Define reliable object storage + CDN delivery behavior for launch.

# Suggested Tickets

- Define release artifact naming and handoff expectations between worker and publisher.
- Define the scoped publishing permissions required for Cloudflare upload and delivery actions.
- Define launch rollback expectations for published static bundles.
