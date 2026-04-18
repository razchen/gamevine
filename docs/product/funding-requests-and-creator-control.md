# Funding, Requests, and Creator Control

# Summary

- Players and creators propose improvements; the community backs requests with **credits**. This is **not** a traditional voting system—**funding** signals real demand and reduces spam.
- **Creators** decide what is accepted, rejected, fundable, and when implementation happens.

# Goals

- Tie prioritization to **meaningful commitment** (credits) rather than superficial engagement metrics.
- Preserve **creator ownership** while allowing **community influence** on the roadmap.

# In Scope

- Requests for work such as bug fixes, new enemies/weapons/bosses, map sections, balance, controls, visuals—each with a **credit cost**.
- **Contribution** of credits toward requests by players (and potentially creators).
- **Eligibility** when enough credits are collected (exact thresholds TBD at spec refinement).
- **Creator decisions**: accept/reject, whether something can be funded, scheduling.

# Out of Scope

- Pure popularity voting as the primary signal.
- Community-only governance that overrides creator ownership.

# User Flow

- User files or finds a request → credits are contributed → request becomes eligible → creator approves → update flows through the AI/build pipeline → release.

# Product Rules

- A funded request represents **demand**, not automatic delivery—**creator approval** remains required.
- Requests should stay aligned with **small, patch-sized** outcomes.

# Frontend Notes

- (Placeholder) Request creation, discovery, funding progress, and creator moderation UI.

# Backend Notes

- (Placeholder) Ledger-grade rules for credit movement and eligibility—without schema here.

# Technical Notes

- (Placeholder) Anti-abuse considerations for Sybil-like credit behavior at the product policy level.

# Edge Cases

- (Placeholder) Conflicting requests, duplicate issues, partial funding, refunds, malicious requests.

# Open Questions

- (Placeholder) What happens to credits when a creator rejects an eligible request; disclosure rules for why requests are rejected.

# Suggested Epics

- (Placeholder) Requests + funding + creator moderation workflow.

# Suggested Tickets

- (Placeholder) UX for “eligible but not approved” states.
