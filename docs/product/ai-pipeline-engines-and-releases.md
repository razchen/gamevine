# AI Pipeline, Engines, and Releases

# Summary

- When a request is **funded and approved**, the platform runs an **AI-assisted pipeline** that reviews relevant files, generates a **small patch**, builds, tests, and releases—rather than rewriting the whole game.

# Goals

- Keep changes **targeted** to control cost and improve reliability.
- Allow **different AI engines** for different strengths (quality, creativity, balance, visuals, cost).

# In Scope

- High-level steps: **request intake → file review context → patch generation → apply patch → rebuild → test → release**.
- **Engine selection** by users where applicable, with **variable credit costs** per engine.
- Emphasis on **incremental** modifications across code/assets/config as appropriate to the template.

# Out of Scope

- Full automated rewrites of entire codebases as the default release path.

# User Flow

- Approved request enters pipeline → AI produces patch → automated build/test gates → published static bundle update.

# Product Rules

- Prefer **small patches** over wholesale regeneration.
- **Testing** is a gate before release (exact test strategy to be refined).

# Frontend Notes

- (Placeholder) Engine selection, pipeline status, and release notes surfacing.

# Backend Notes

- (Placeholder) Worker orchestration, secrets handling for AI providers, build artifact handling—conceptual only.

# Technical Notes

- **Private AI/build workers** perform heavy work outside the browser.

# Edge Cases

- (Placeholder) Flaky tests, patch conflicts, failed builds, rollback needs.

# Open Questions

- (Placeholder) Human-in-the-loop requirements, if any, before release.

# Suggested Epics

- (Placeholder) Patch pipeline MVP with safe failure modes.

# Suggested Tickets

- (Placeholder) Define minimum test bar for “release-ready” updates.
