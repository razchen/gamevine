# Analytics and Tracking

# Summary

- The product needs **measurement** to understand play engagement, creation funnel health, request/funding dynamics, pipeline success, and monetization—without turning this spec into an implementation plan.

# Goals

- Inform prioritization and reliability work with **clear product metrics**.
- Support creators with **understandable performance** signals for their games (within privacy constraints).

# In Scope

- **Product analytics**: acquisition, activation, creation-from-template completion, publish success.
- **Game engagement**: plays, session behavior, basic performance signals (exact metrics TBD).
- **Requests/funding**: creation rate, funding velocity, approval rates, reasons buckets (if captured).
- **Pipeline**: build/test pass rates, time-to-release, failure categories.
- **Monetization**: credit purchases, spend patterns (aggregated).

# Out of Scope

- Invasive tracking unrelated to product improvement; per-user sale of behavioral data.

# User Flow

- Player plays → events collected at product level → dashboards/alerts for operators; creator sees allowed summaries.

# Product Rules

- Be transparent about what is measured; minimize sensitive data collection.
- Prefer metrics that tie to **health of the evolving-games loop** (play → request → fund → ship).

# Frontend Notes

- (Placeholder) Consent UX, event naming conventions—product level only.

# Backend Notes

- (Placeholder) Aggregation, retention windows, PII minimization—conceptual.

# Technical Notes

- (Placeholder) Correlating CDN logs vs client events; sampling strategies.

# Edge Cases

- (Placeholder) Ad blockers, offline play, bot traffic, inflated plays.

# Open Questions

- (Placeholder) Creator-visible analytics depth at launch vs platform-only.

# Suggested Epics

- (Placeholder) Core metrics definitions for the “evolution loop.”

# Suggested Tickets

- (Placeholder) Define north-star metric candidates and secondary metrics.
