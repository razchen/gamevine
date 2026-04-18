# Games, Templates, and Constraints

# Summary

- Games are **small**, **browser-based** experiences built from **high-quality templates** and customized by AI, not generated as monolithic mega-projects.
- Scope stays intentionally limited so AI changes stay reliable and hosting stays cheap.

# Goals

- Maximize **reliability** of AI edits by constraining architecture and starting points.
- Prefer genres that are **easy to modify** and **easy for AI to reason about**.

# In Scope

- **HTML/CSS/JavaScript** games delivered as static bundles.
- **Single-player**, **non-persistent** gameplay at launch.
- **Template starts** (e.g. platformer, top-down shooter, endless runner) with AI customizing theme, content, balance, and UI.
- Genres such as: platformers, top-down shooters, endless runners, puzzles, flappy-style, survivor-like, arcade.

# Out of Scope

- Multiplayer, clans, trading.
- Save systems, persistent inventories, large maps, open worlds, crafting systems.
- Per-game databases and backend-driven gameplay loops for the game runtime.

# User Flow

- Creator picks a **template** aligned with the game they want.
- Creator directs AI customizations within the template’s structure.
- Player loads the game in the **browser** from static assets.

# Product Rules

- Creation should not rely on **prompt-to-entire-game** as the default path.
- Changes should remain **incremental** (bugs, enemies, weapons, bosses, map sections, visuals, balance).

# Frontend Notes

- (Placeholder) Template gallery, preview/play, and creation UX that reinforces small-scope games.

# Backend Notes

- (Placeholder) Template registry/metadata and build inputs—without defining storage shape here.

# Technical Notes

- Games run **fully client-side**; no dedicated game servers per title.

# Edge Cases

- (Placeholder) Template drift after many patches; performance on low-end devices; asset size growth.

# Open Questions

- (Placeholder) How many templates at launch and how template versioning interacts with patches.

# Suggested Epics

- (Placeholder) Template catalog + creation journey hardening.

# Suggested Tickets

- (Placeholder) Define “allowed edit surfaces” per template for AI reliability.
