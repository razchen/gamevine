# Analytics and Tracking

# Summary

- The product needs **measurement** to understand play engagement, creation funnel health, request/funding dynamics, pipeline success, and monetization—without turning this spec into an implementation plan.
- At launch, tracking should stay **minimal** and focused on the core product loop rather than broad behavioral instrumentation.

# Goals

- Inform prioritization and reliability work with **clear product metrics**.
- Support creators with **understandable performance** signals for their games (within privacy constraints).
- Keep launch analytics simple enough to operate without turning the platform into a heavy tracking system.

# In Scope

- **Product analytics**: acquisition, activation, creation-from-template completion, publish success.
- **Game engagement**: plays, session behavior, basic performance signals (exact metrics TBD).
- **Requests/funding**: creation rate, funding velocity, approval rates, reasons buckets (if captured).
- **Pipeline**: build/test pass rates, time-to-release, failure categories.
- **Monetization**: credit purchases, spend patterns (aggregated).
- **Creator-visible basic summaries** at launch rather than deep per-game dashboards.

# Out of Scope

- Invasive tracking unrelated to product improvement; per-user sale of behavioral data.
- Broad launch instrumentation of every possible interaction.

# User Flow

- Player plays → minimal product events are captured → platform operators use them to monitor funnel, funding, pipeline, and monetization health → creators see a basic summary of allowed game metrics.

# Product Rules

- Be transparent about what is measured; minimize sensitive data collection.
- Prefer metrics that tie to **health of the evolving-games loop** (play → request → fund → ship).
- Launch tracking should prioritize **core loop health** over deep behavior analysis.
- Creator analytics at launch should stay at a **basic summary** level.

# Frontend Notes

- Product surfaces should set expectations that analytics are lightweight and purpose-driven at launch.
- Creator-facing analytics should read as simple summaries, not as a full analytics suite.

# Backend Notes

- Aggregation, retention, and PII minimization should stay aligned with a minimal launch-tracking posture.
- Platform reporting needs are broader than creator-facing reporting at launch.

# Technical Notes

- The analytics model may need to combine client-side signals with delivery/platform signals while keeping launch scope minimal.

# Edge Cases

- Ad blockers or browser privacy settings reducing observable client events.
- Offline or interrupted play sessions producing incomplete data.
- Bot traffic or inflated plays distorting launch metrics.
- Creators wanting deeper analytics than the launch summary provides.

# Open Questions

- Which exact metrics should appear in the creator's basic summary at launch?
- How should the platform explain missing or incomplete analytics when client-side measurement is blocked?

# Suggested Epics

- Define the minimum viable analytics set for the evolving-games loop.
- Define the creator-facing basic analytics summary for launch.
- Define operator-facing monitoring for funnel, funding, pipeline, and monetization health.

# Suggested Tickets

- Define launch north-star and supporting metrics for the core loop.
- Define the basic creator-visible metrics available at launch.
- Define handling for missing or distorted analytics signals at launch.
