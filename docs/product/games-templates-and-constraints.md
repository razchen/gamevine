# Games, Templates, and Constraints

# Summary

- Games are **small**, **browser-based** experiences built from **high-quality templates** and customized by AI, not generated as monolithic mega-projects.
- Scope stays intentionally limited so AI changes stay reliable and hosting stays cheap.
- AI should work inside **tight template rails** rather than reshaping the full architecture of a game from scratch.

# Goals

- Maximize **reliability** of AI edits by constraining architecture and starting points.
- Prefer genres that are **easy to modify** and **easy for AI to reason about**.
- Keep games small enough that roadmap items can be implemented as **patch-sized updates** rather than rewrites.

# In Scope

- **HTML/CSS/JavaScript** games delivered as static bundles.
- **Single-player**, **non-persistent** gameplay at launch.
- **10 templates** at launch.
- The launch template set is:
  - **Platformer**
  - **Top-down shooter**
  - **Endless runner**
  - **Puzzle game**
  - **Flappy-style game**
  - **Survivor-like game**
  - **Arcade shooter**
  - **Breakout / brick breaker**
  - **Maze chase**
  - **Lane defense**
- **Template starts** (e.g. platformer, top-down shooter, endless runner) with AI customizing theme, content, balance, and UI.
- Launch-fit genres include examples such as platformers, top-down shooters, endless runners, puzzles, flappy-style games, survivor-like games, and other arcade-style browser games.

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
- AI customization should happen within **predefined template boundaries** rather than changing a game's core architecture freely.
- Templates should be designed so that future roadmap items remain compatible with **small, controlled patching**.
- Templates do **not** version at launch.
- AI must continue following the template boundaries of the game it is updating.
- The platform should be **strict** when a creator request pushes a game outside its original template boundaries.

# Frontend Notes

- Product surfaces should make template choice, genre fit, and small-scope expectations clear to creators before game creation begins.

# Backend Notes

- The platform needs a way to represent template choices, allowed customization surfaces, and game creation inputs without defining storage shape here.
- Template handling should assume one stable template model at launch rather than versioned template lineages.

# Technical Notes

- Games run **fully client-side**; no dedicated game servers per title.

# Edge Cases

- Template drift after many roadmap updates.
- AI requests that appear valid but push beyond the intended template boundaries.
- Performance degradation on low-end devices after too many visual or content changes.
- Asset growth that makes a once-small game less practical to load and maintain.
- Games that accumulate many updates but still need to remain inside their original template constraints.

# Open Questions

- How should the platform explain template-boundary rejections to creators when a request is out of scope?

# Suggested Epics

- Define the launch template model and creation constraints.
- Define the creator experience for choosing a template and understanding allowed customization.
- Define the guardrails that keep games patch-friendly over time.
- Define the launch set of 10 templates and their allowed customization surfaces.

# Suggested Tickets

- Define allowed customization surfaces within each launch template.
- Define the launch criteria for a template to be considered AI-editable and patch-friendly.
- Define how the product communicates template boundaries to creators.
