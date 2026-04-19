# Product Overview

# Summary

- Gamevine.ai is a platform where **small browser games continuously evolve through community-funded, AI-generated updates**.
- Creators launch games from **templates**, players help fund **targeted improvements**, and AI ships those improvements as **small patches over time**.
- The product is not about generating giant games from scratch. It is about making simple browser games cheap to create, easy to play, and practical to improve continuously.

# Goals

- Make it fast and affordable to create, host, and improve **small browser games**.
- Use **credits** as a stronger signal of demand than voting alone.
- Keep **creators in control** of each game's direction while still letting the community shape priorities.
- Limit updates to **small, targeted changes** so AI cost, build time, and reliability stay manageable.
- Build a product loop where a game can launch quickly, attract play, receive funded roadmap items, and improve continuously.

# In Scope

- **Single-player**, **non-persistent**, **frontend-only** games at launch.
- Games built from **existing templates** and customized by AI rather than fully generated from scratch.
- **Community-submitted ideas** that are normalized by AI into structured roadmap-style items under platform rules.
- **Community-funded roadmap items** for small improvements such as bug fixes, enemies, weapons, bosses, map sections, balancing, controls, and visuals.
- **Creator-controlled approval** of ideas, roadmap priorities, and release direction.
- **Creator-approved funding**: ideas are not funded immediately; they must first be approved for funding by the creator.
- **Creator-created roadmap items**, including creator self-funding.
- **Credit-based** spending for game creation and funded changes.
- **AI engine choice** at roadmap-item creation, with different tradeoffs and costs.
- **Static bundle delivery** through object storage and CDN, supported by platform backend services and private workers.

# Out of Scope

- AAA-scale games, large persistent worlds, and large architectural rewrites.
- **Multiplayer**, **save systems**, **persistent inventories**, **clans**, **trading**, and **backend-driven gameplay** for the games themselves.
- **Per-game databases** and other runtime dependencies that break the static-hosted game model.
- Open-world games, large maps, crafting systems, and other systems that make AI modification harder and hosting more complex.
- “Generate an entire game from a blank page” as the primary creation path.

# User Flow

- **Creator**: choose a template → customize the game with AI → publish the game → review submitted ideas → approve ideas for funding or reject them → add creator roadmap items where needed → release updates through the AI pipeline.
- **Player**: discover and play the game for free → submit raw ideas → see those ideas normalized into structured roadmap-style items → fund creator-approved roadmap items with credits → see the game improve through released updates.
- **Platform**: manage accounts, credits, requests, build/release workflows, hosting, and platform rules.

# Product Rules

- Games must **start small** and remain practical for **incremental AI modification**.
- Requests should resolve to **small, patch-sized changes**, not major rewrites.
- **Community influence** is expressed through **funding**, not a generic upvote system.
- Users submit **raw ideas**, and the platform AI transforms them into structured roadmap-style items that fit product rules.
- **Creator approval comes before funding**. Only creator-approved items can receive credits.
- Creators can also add their own roadmap items and fund them themselves.
- Each roadmap item has a **platform-estimated credit target** based on the selected AI engine.
- The **creator chooses the AI engine** when the roadmap item is created, and that engine stays fixed for that item.
- Once an approved item is fully funded, it enters the roadmap queue. The **first fully funded** item gets the next available implementation slot.
- **Funding signals demand**, but it does not override **creator approval**.
- The runtime game experience should remain compatible with **browser-only, static-hosted delivery** at launch.

# Frontend Notes

- Primary product surfaces include game discovery/play, template-based creation, funding requests, credit balances/spending, and creator controls.
- The product should clearly separate **public game/play surfaces** from **creator-only management surfaces**.

# Backend Notes

- Platform services are needed for accounts, credits, requests, build/release workflows, storage metadata, analytics, and policy enforcement.
- Games themselves should not depend on backend gameplay services at launch, even though the platform requires backend infrastructure.

# Technical Notes

- Directional stack: **Next.js** frontend, **NestJS** backend, **PostgreSQL** with **Drizzle**, **Cloudflare R2** (or equivalent object storage), **CDN** delivery, and **private AI/build workers**.
- Authorization uses **CASL** (`@casl/ability`) with a single ability definition in `@gamevine/shared` consumed by both apps (see `users-roles-and-permissions.md`).
- AI should work against **targeted file context** and produce **patch-oriented changes** instead of regenerating full games.

# Creator Inactivity Policy (launch)

A live game becomes `dormant` after **30 days** of no qualifying creator action (review, publish, rollback, or response to `[requires-response]` notifications). Dormant games keep playing but stop accepting new idea submissions and carry a visible "dormant" label. After an **additional 30 days** of continued inactivity (60 days total), any fully funded but unimplemented items are canceled and contributors are refunded. See `funding-roadmap-and-creator-control.md` for full rules and `game-storage-and-lifecycle.md` for the state machine.

# Edge Cases

- Duplicate or overlapping requests competing for the same improvement.
- Raw ideas that are abusive, malicious, or impossible within platform rules.
- Requests that look small during intake but would actually require a large rewrite.
- Multiple approved items competing for funding and roadmap position at the same time.
- Creator inactivity after players have funded meaningful demand (handled by the policy above).

# Resolved Questions

- **Creator inactivity**: resolved by the policy above.
- **Rejected-idea visibility**: rejected ideas remain visible on the per-game public roadmap with a "rejected" label; creator reasoning is optional and hidden by default.
- **Moderation for borderline ideas**: AI screening has three outcomes — pass, reject, hold. Borderline goes to a super-admin queue (see `moderation-and-trust-safety.md`).

# Open Questions

- Deferred: how detailed the AI-normalized roadmap item should be for creator review (launch shows title, description, scope category, and the original raw text on request).

# Suggested Epics

- Define the creator journey from **template selection** to **live game publish**.
- Define the player/community journey from **raw idea submission** to **funded update release**.
- Define the platform rules that govern **credits, creator approval, roadmap queueing, and patch-sized updates**.

# Suggested Tickets

- Define launch acceptance criteria for a **patch-sized update** versus a rejected rewrite.
- Define the minimum launch scope for **template-based game creation**.
- Define the minimum launch rules for **idea submission, creator approval, funding states, and roadmap queue states**.
