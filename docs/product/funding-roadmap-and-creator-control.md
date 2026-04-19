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
- Requests should stay aligned with **small, patch-sized** outcomes.

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

# Open Questions

- How much creator-facing detail should AI provide when it normalizes a raw idea?
- Should duplicate ideas be merged before creator review or after approval?
- How much public visibility should funded progress and queue ordering have at launch?

# Suggested Epics

- Define the end-to-end flow from **raw idea submission** to **fundable roadmap item**.
- Define the creator workflow for **approving, rejecting, and self-creating roadmap items**.
- Define the funding and queue model for **approved roadmap items**.

# Suggested Tickets

- Define launch states for **idea submission**, **creator review**, **funding**, and **implementation queueing**.
- Define the launch behavior for **submission fees**, **soft rejection**, and **resubmission**.
- Define the launch rule for **queue ordering** when multiple items are fully funded.
