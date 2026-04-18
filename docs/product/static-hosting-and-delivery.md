# Static Hosting and Delivery

# Summary

- Games ship as **static bundles** uploaded to **object storage** and served via a **CDN**; players run them entirely in the **browser** with **no dedicated game servers** per title.

# Goals

- Minimize hosting cost and operational complexity for creators.
- Ensure fast, reliable global delivery of static assets.

# In Scope

- Build output as **static files** (HTML/CSS/JS/assets).
- **Object storage** for bundles and **CDN** for delivery.
- Clear separation: **game runtime** is static; **platform** provides accounts, credits, requests, builds.

# Out of Scope

- Always-on authoritative game servers for gameplay simulation.

# User Flow

- Pipeline produces artifacts → artifacts published to storage → CDN serves → player loads and plays offline-capable static gameplay (within browser constraints).

# Product Rules

- Games should remain compatible with **static hosting assumptions** at launch.

# Frontend Notes

- (Placeholder) Player experience for loading/updating game versions; cache busting concepts.

# Backend Notes

- (Placeholder) Publishing pipeline, immutable releases, rollback strategy—conceptual.

# Technical Notes

- Directional: **Cloudflare R2** (or equivalent) + CDN; global edge delivery.

# Edge Cases

- (Placeholder) Broken deploy, partial uploads, CDN staleness, large asset sets.

# Open Questions

- (Placeholder) Version pinning for players vs “always latest” for a game page.

# Suggested Epics

- (Placeholder) Reliable publish + CDN delivery path.

# Suggested Tickets

- (Placeholder) Define release artifact naming/versioning expectations.
