# App Surfaces and Navigation

# Summary

- This document defines the main signed-in and in-product surfaces of Gamevine.ai.
- It focuses on where users go in the app, what each surface is for, and how navigation should separate player, creator, and platform-facing actions.
- At launch, Gamevine.ai should use **one app with one primary navigation**, where creator surfaces live alongside player surfaces rather than behind a separate mode switch.

# Goals

- Turn the product rules into a clear application structure that users can navigate.
- Define the main surfaces needed for browsing, creating, funding, and managing games.
- Keep the app simple enough at launch that users can understand the product without getting lost in too many destinations.
- Avoid splitting the product into separate player and creator applications at launch.

# In Scope

- Core signed-in app navigation.
- Browse/discovery surfaces for games.
- Game detail/play surfaces.
- Creator-facing surfaces for roadmap items, funding review, and game management.
- Wallet-related and other in-app utility surfaces at a high level.
- Recommended launch top-level app destinations:
  - **Home**
  - **Browse Games**
  - **My Games**
  - **Wallet**
  - **Notifications**
  - **Settings**
- Recommended core launch surfaces:
  - **Game detail / play**
  - **Roadmap / funding surface** for a game
  - **Idea submission flow**
  - **Creator game management surface**
  - **Creator roadmap review / management surface**

# Out of Scope

- Marketing/public-site pages covered by separate docs.
- Detailed settings screens covered by separate docs.
- Pixel-level UX or component specifications.

# User Flow

- User signs in → lands in the app → browses or opens a game → plays, funds, or submits ideas as allowed → creators access creator-only surfaces to manage roadmap items and games.

# Product Rules

- Navigation should clearly separate **public/browse/play** flows from **creator management** flows.
- Creator-only surfaces should only expose actions that match the single-owner launch model.
- The information architecture should reflect the main product loop: **play → submit idea → fund roadmap item → release update**.

# Launch Top-Level Destinations (signed in)

The signed-in app chrome exposes these top-level destinations. Anything else is a sub-page.

- **`/browse`** — discovery feed: trending, new, top-funded, by genre. Default landing for signed-in users.
- **`/game/<slug>`** — public game detail page (read-only: description, roadmap, contributors).
- **`/play/<slug>`** — the embedded play page with the iframe and supporting UI (submit idea, fund, see progress).
- **`/create`** — Creator-tier gated. The template-picker and new-game wizard.
- **`/my-games`** — Creator-only. The list of games the user owns, each linking to its management surface.
- **`/my-games/<slug>/manage`** — Creator management for a single game: idea review queue, roadmap items, release history, publish/rollback controls.
- **`/wallet`** — Balance, recent transactions, pending pledges, top-up purchase, subscription status and plan management.
- **`/inbox`** — In-app notification inbox (see `notifications.md`).
- **`/settings`** — Account, profile, notification prefs (see `account-and-settings.md`).
- **`/admin`** — Super-admin only. Moderation queue, pipeline-run inspector, user/game tools, wallet adjustment.

Header nav (visible to everyone signed in): `Browse`, `Create` (disabled tooltip for non-Creators), wallet balance badge (links to `/wallet`), inbox bell (links to `/inbox`), avatar menu (links to `/my-games`, `/settings`, sign out).

# Surface-to-Role Visibility

| Surface                                           | Visitor | Free                       | Supporter | Creator | Super Admin |
| ------------------------------------------------- | ------- | -------------------------- | --------- | ------- | ----------- |
| `/browse`, `/game/<slug>`, `/play/<slug>`         | ✓       | ✓                          | ✓         | ✓       | ✓           |
| `/create`, `/my-games`, `/my-games/<slug>/manage` | —       | —                          | —         | ✓ (own) | ✓           |
| `/wallet`                                         | —       | ✓ (view only, no purchase) | ✓         | ✓       | ✓           |
| `/inbox`, `/settings`                             | —       | ✓                          | ✓         | ✓       | ✓           |
| `/admin`                                          | —       | —                          | —         | —       | ✓           |

Paid-participation actions on pages otherwise visible (e.g., `[Submit idea]` on `/play/<slug>`) follow the role matrix in `users-roles-and-permissions.md` — the page renders; the button is disabled with an upgrade prompt for roles that can't act.

# Additional Product Rules

- Creator management lives in the **same primary navigation** as other product surfaces at launch.
- The app should make it easy to move from **playing a game** to **viewing its roadmap** to **funding or submitting an idea**.
- `/my-games` is the main launch entry point for creator-specific management actions.
- Wallet and notification surfaces are available globally, not buried inside creator-only areas.

# Frontend Notes

- The app should have a simple launch navigation model with clear top-level destinations.
- Browse, play, wallet, roadmap, and creator surfaces should feel distinct rather than collapsed into one overloaded page.
- Creator-only controls should appear in context where relevant, but only for the creator-owner of that game.
- Navigation labels should stay literal and obvious rather than trying to hide creator functionality behind abstract wording.

# Backend Notes

- Different app surfaces will depend on different product data, but this doc should stay focused on surface boundaries rather than APIs.

# Technical Notes

- This spec covers the app's information architecture, not routing implementation details.

# Edge Cases

- Users not understanding the difference between playing a game and managing a game.
- Creators struggling to find idea review, roadmap, or funding controls.
- Navigation becoming cluttered as both player and creator capabilities exist in one product.
- Users who are only players seeing creator-oriented destinations they do not need.

# Resolved Questions

- **Signed-in landing**: `/browse` (discovery-first). No separate "Home" dashboard at launch.
- **Roadmap placement**: inline on `/game/<slug>` and `/play/<slug>` (one tab/section, not a separate route). Creators manage it on `/my-games/<slug>/manage`.
- **Inbox retention**: last 90 days (see `notifications.md`).

# Open Questions

- Deferred: signed-in dashboard / "Home" surface with personalized activity beyond `/browse`.

# Suggested Epics

- Define the launch app navigation and core destinations.
- Define the player-facing browse/play/funding surfaces.
- Define the creator-facing management surfaces for games and roadmap items.
- Define the shared-nav launch information architecture that combines player and creator flows.

# Suggested Tickets

- Define the launch signed-in navigation model.
- Define the minimum launch surfaces for browse, game detail/play, and roadmap funding.
- Define the minimum creator dashboard / management surfaces for launch.
- Define the launch purpose and content of **Home**, **My Games**, **Wallet**, and **Notifications**.
