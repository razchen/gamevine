# Funding, Roadmap, and Creator Control

# Summary

- Players submit **raw ideas**, and the platform AI transforms them into structured items that fit Gamevine.ai's product rules.
- **Creators** decide which ideas are approved for funding, which roadmap items are allowed, and when implementation happens.
- The community influences priority through **credits**, but creators retain control over what enters the roadmap.

# Goals

- Tie prioritization to **meaningful commitment** (credits) rather than superficial engagement metrics.
- Preserve **creator ownership** while allowing **community influence** on the roadmap.
- Reduce spam and low-quality requests by charging for submission and requiring creator approval before funding.

# In Scope

- **Raw idea submission** by users for work such as bug fixes, new enemies/weapons/bosses, map sections, balance, controls, and visuals.
- A **flat credit fee** for each raw idea submission.
- AI transformation of raw ideas into structured roadmap-style items that fit platform rules.
- AI screening for malicious, abusive, or clearly invalid submissions.
- **Creator approval** before an idea becomes a **fundable roadmap item**.
- **Contribution** of credits toward approved roadmap items by players and creators.
- **Creator-created roadmap items**, including creator self-funding.
- **Platform-estimated credit targets** for roadmap items based on the selected AI engine.
- **Roadmap queueing** once an item is fully funded.

# Out of Scope

- Pure popularity voting as the primary signal.
- Community-only governance that overrides creator ownership.
- Funding before creator approval.

# User Flow

- Player submits a raw idea → AI normalizes it into a structured item or soft-rejects it → creator reviews it → approved ideas become fundable roadmap items → players and/or creators contribute credits → item reaches its funding target → fully funded item takes the next available roadmap slot based on queue order → update flows through the AI/build pipeline → release.

# Product Rules

- Users submit **ideas first**, not directly fundable requests.
- A raw idea must pass AI normalization and creator review before it can receive funding.
- Each raw idea submission costs a **flat credit fee**.
- Invalid or malicious submissions are **soft rejected** with a chance to resubmit, and the submission fee is **not refunded**.
- Approved ideas become **fundable roadmap items**.
- Creators can add their own roadmap items and fund them themselves.
- Each roadmap item gets a **platform-estimated funding target** based on the AI engine selected by the creator when the item is created.
- The selected AI engine is **locked** for that roadmap item.
- The **first fully funded** approved roadmap item gets the next available implementation slot.
- Requests should stay aligned with **small, patch-sized** outcomes (see `ai-pipeline-engines-and-releases.md` for the patch-size definition).

# Funding Mechanics (launch)

- **Minimum contribution**: `5,000 credits` per contribution. Contributors may contribute multiple times.
- **Multiple contributors per item**: allowed. The item tracks each contribution for refund purposes.
- **Over-funding**: not allowed. The last contribution is clamped to exactly reach the target; any excess is not charged.
- **Creator self-funding**: follows the same rules (minimum, clamping) but does not forfeit creator-review rights.
- **Pledged credits are held, not spent**, until the item's terminal outcome:
  - **Released**: credits are spent and flow to platform revenue.
  - **Canceled by creator / failed-escalated / removed by moderation / creator-inactivity refund**: credits are returned to each contributor's wallet as **refund credits** (same credit type; no cash refund).
- **Creators cannot unilaterally cancel a fully funded item** unless they also agree to the automatic contributor refund; the UI enforces this with a confirmation step.

# Creator Review SLA (launch)

- A creator has **14 days** from the moment an idea enters their review queue to approve or reject it.
- **3 days before expiry**, the creator receives a reminder notification (see `notifications.md`).
- On SLA expiry with no decision, the idea **auto-closes** and the submitter's submission fee is **refunded** (SLA expiry is treated as the platform's failure, not the submitter's).
- Creators that repeatedly breach SLA on live games trigger the inactivity path below.

# Duplicate Handling (launch)

- AI normalization runs a similarity check against existing ideas on the same game.
- On a high-similarity match, the new idea is **soft-merged**: the submitter is shown the existing idea and can confirm or cancel.
  - Confirm: submission fee is not charged; the existing idea's interest counter increments.
  - Cancel: no charge.
- On a borderline match, both ideas continue as separate items; creator review can explicitly mark one as a duplicate of the other, refunding the later submitter.

# Creator Inactivity (launch)

- A live game enters the `dormant` state (see `game-storage-and-lifecycle.md`) when all of these are true for **30 consecutive days**:
  - No creator action on the review queue.
  - No creator-initiated roadmap item, publish, or rollback.
  - No response to any platform notification marked `[requires-response]`.
- A `dormant` game:
  - Displays a visible "dormant" label on its public detail page.
  - Continues to play normally.
  - Stops accepting new raw idea submissions.
  - Holds any fully funded but unimplemented items.
- After an **additional 30 days of continued inactivity** (60 days total), all fully funded but unimplemented items on the game are **canceled** and contributors are refunded.
- Any qualifying creator action (review, publish, rollback, reply) ends dormancy immediately and reactivates intake.

# Frontend Notes

- Product surfaces include raw idea submission, creator review queues, public roadmap items, funding progress, and rejected-idea visibility.
- Rejected ideas may remain visible to the community, but detailed creator reasoning is not required in the public UI.

# Backend Notes

- Platform logic must support submission fees, funding contributions, roadmap-item status changes, and queue order without defining schema or APIs here.
- Credit behavior should distinguish between submission spend and roadmap-item funding spend.

# Technical Notes

- Anti-abuse is part of the product model: submission fees reduce spam, AI screening reduces malicious content, and creator approval reduces roadmap pollution.

# Edge Cases

- Duplicate or near-duplicate ideas from different users.
- Ideas that appear valid but imply a large rewrite once normalized.
- Public disagreement around rejected ideas that remain visible.
- Creator-added roadmap items competing with community-funded items.
- Multiple approved roadmap items reaching full funding close together.

# Resolved Questions

- **Duplicate merging timing**: before creator review (soft-merge at AI normalization), with a creator-level "mark duplicate of" action available afterward.
- **Public visibility of funding/queue**: funding progress and queue position are public on the per-game roadmap page. Contributor handles are public; contributed amounts per contributor are private (only the contributor and the creator see per-contributor amounts).

# Open Questions

- How much creator-facing detail should AI provide when it normalizes a raw idea? — deferred; launch shows the normalized item title, description, and scope category, with the original raw text available on request.

# Suggested Epics

- Define the end-to-end flow from **raw idea submission** to **fundable roadmap item**.
- Define the creator workflow for **approving, rejecting, and self-creating roadmap items**.
- Define the funding and queue model for **approved roadmap items**.

# Suggested Tickets

- Define launch states for **idea submission**, **creator review**, **funding**, and **implementation queueing**.
- Define the launch behavior for **submission fees**, **soft rejection**, and **resubmission**.
- Define the launch rule for **queue ordering** when multiple items are fully funded.
