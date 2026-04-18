# Product Overview

# Summary

- Gamevine.ai is a platform where creators build **small browser games** with AI, starting from **templates**, and games **evolve over time** through **community-funded**, **AI-generated patches**.
- The core idea: **continuous evolution via funded updates**, not one-shot generation of huge games.

# Goals

- Make it fast and cheap to create, host, and iterate **simple browser games**.
- Align community demand with **real commitment** (credits), not easily gamed votes.
- Keep **creators in control** of what ships while the community funds and prioritizes requests.
- Keep operational costs manageable via **small patches**, **static hosting**, and **focused game scope**.

# In Scope

- Single-player, **non-persistent**, **frontend-only** games at launch.
- **Template-based** creation and **incremental** AI changes.
- **Credit-based** funding for player/creator requests and **credit costs** for creation/update work.
- **Creator approval** and roadmap ownership.
- **Static asset** delivery (e.g. object storage + CDN) and a **platform + workers** backend model.

# Out of Scope

- AAA-scale games, large persistent worlds, **multiplayer**, **saves**, **per-game databases**, **backend-driven gameplay** for the games themselves (as described in the product concept).
- “Generate an entire game from a blank page” as the primary creation path.

# User Flow

- **Creator**: start from template → customize with AI → publish → review funded requests → approve/reject → ship updates via pipeline.
- **Player**: play in browser for free → propose or support requests with credits → see game evolve when funded updates release.
- **Platform**: mediate credits, requests, builds, hosting, and policies.

# Product Rules

- Games **start small** and change through **small, controlled patches**.
- **Community influence** is expressed through **funding**, not a generic upvote system.
- **Creators** retain ownership of acceptance and timing of work.

# Frontend Notes

- (Placeholder) Surfaces for play, creation from templates, requests, funding, credits, and creator controls.

# Backend Notes

- (Placeholder) Platform services for accounts, credits, requests, builds, asset storage metadata, and worker orchestration—without specifying APIs or schemas here.

# Technical Notes

- Directional stack: **Next.js** web app, **NestJS** API, **PostgreSQL** + **Drizzle**, **Cloudflare R2** (or equivalent) for static bundles, **CDN** delivery, **private AI/build workers**.

# Edge Cases

- (Placeholder) Disputes over request wording, duplicate requests, partially funded requests, creator inactivity.

# Open Questions

- (Placeholder) Policy for refunds/chargebacks, abuse of the request system, and minimum bar for “eligible” implementation.

# Suggested Epics

- (Placeholder) End-to-end “template → live game → funded update” slice.

# Suggested Tickets

- (Placeholder) Define acceptance criteria for “patch-sized” change vs rejected rewrite.
