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

# Launch Metrics

North-star at launch: **weekly released updates shipped** (sum of successful pipeline runs → published in the last 7 days). It is the single number that says "the loop is working."

Supporting metrics, grouped by loop stage:

## Acquisition & Activation

- `signup_count` — new accounts per day.
- `signup_to_verified_rate` — % of signups that verify email within 24h.
- `free_to_supporter_conversion_rate` — % of free accounts that subscribe within 7 days.
- `supporter_to_creator_conversion_rate` — % of Supporters upgrading to Creator within 30 days.

## Play & Engagement

- `play_sessions` — distinct game-play sessions (from `gv.ready()` signal).
- `avg_session_duration_seconds` — per game and overall.
- `unique_players_per_game` — 7-day rolling.
- `play_error_rate` — `gv.reportError` events per 1,000 sessions.

## Creation

- `games_created` — new draft → published transitions per week.
- `time_to_first_publish_minutes` — median from `/create` start to first publish.
- `creation_success_rate` — % of creation attempts reaching first publish.

## Ideas & Funding

- `raw_ideas_submitted` — total per week.
- `idea_ai_pass_rate` — % that pass AI screening without hold/reject.
- `creator_review_time_hours` — median hours from approved-by-AI to creator decision.
- `creator_approval_rate` — % of reviewed ideas that are approved.
- `fundable_items_funded_rate` — % of approved items that reach full funding.
- `time_to_full_funding_days` — median days from approval to full funding.
- `unique_funders_per_item` — median.

## Pipeline

- `pipeline_runs_started` — per week.
- `pipeline_first_attempt_pass_rate` — % of runs passing test gate on first try.
- `pipeline_retry_pass_rate` — % of retries that pass.
- `pipeline_escalation_rate` — % of runs reaching `failed-escalated`.
- `time_in_queue_minutes` — median from fully-funded to run start.
- `time_to_release_minutes` — median from run start to publish.
- `estimate_accuracy_p90` — actual credit spend ÷ quoted estimate, at p90 (target ≤ 1.0 per the 90% margin rule).

## Monetization

- `mrr` — monthly recurring revenue by tier.
- `topup_revenue` — top-up purchase revenue per week.
- `subscription_churn_rate_7d` — cancellations in the first 7 days.
- `subscription_churn_rate_monthly` — cancellations in the first 30 days.
- `payment_failure_rate` — failed charges ÷ attempts.
- `chargeback_rate` — chargebacks ÷ successful charges.

## Trust & Safety

- `reports_per_week` — by reason bucket.
- `moderation_time_to_action_hours` — median from report to super-admin decision.
- `ai_screening_hold_rate` — % of submissions held for super-admin review.

## Creator summary (per-game, creator-visible)

At launch, creators see **only these** per their game:

- Plays (7d / 30d / all-time).
- Unique players (7d / 30d).
- Median session duration.
- Open ideas count.
- Funding in progress (sum of pledged credits across open items).
- Releases shipped (count and last release date).

# Instrumentation Sources

- **Client telemetry** (inside game iframe): `gv.trackEvent`, `gv.reportError` → `telemetry.gamevine.ai` (see `player-runtime-and-sandbox.md`).
- **App telemetry** (outside iframe, on the main app origin): standard product analytics via a privacy-respecting vendor (PostHog self-hosted or equivalent; decision deferred to implementation).
- **Server-side events** (API): auth, wallet, idea lifecycle, pipeline runs. Authoritative source for all funnel and monetization metrics; client events are supplementary.

# Allow-list of Client Event Names (launch)

Events accepted by the telemetry endpoint. Unknown names are dropped.

- `game.started`, `game.ended`, `game.paused`, `game.resumed`.
- `game.level_started`, `game.level_completed`, `game.level_failed`.
- `game.milestone` (generic; template declares which milestones exist in `template.config.json`).
- `game.error` (paired with `gv.reportError`).

No free-form event names. No PII in `props`. Props are bounded to scalar types.

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

# Resolved Questions

- **Creator summary metrics at launch**: listed above under "Creator summary (per-game, creator-visible)".
- **Missing/blocked client-side data**: the creator summary shows a small "some plays may not be counted if players block analytics" note on the summary page. Server-side lifecycle metrics (releases shipped, funding) are unaffected.

# Suggested Epics

- Define the minimum viable analytics set for the evolving-games loop.
- Define the creator-facing basic analytics summary for launch.
- Define operator-facing monitoring for funnel, funding, pipeline, and monetization health.

# Suggested Tickets

- Define launch north-star and supporting metrics for the core loop.
- Define the basic creator-visible metrics available at launch.
- Define handling for missing or distorted analytics signals at launch.
