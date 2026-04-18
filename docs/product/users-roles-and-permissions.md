# Users, Roles, and Permissions

# Summary

- The platform has distinct actors: **players**, **creators**, and **platform operators**. Permissions should make **creator ownership** explicit while allowing community participation through **funding**.

# Goals

- Ensure only the right people can **approve work**, **publish games**, **spend or allocate credits**, and **perform platform administration**.
- Prevent privilege escalation and accidental public exposure of internal controls.

# In Scope

- **Player** capabilities: play, buy credits, create/support requests, fund requests.
- **Creator** capabilities: own a game’s roadmap decisions, accept/reject requests, trigger/schedule implementation consistent with product rules.
- **Platform** capabilities: enforce policies, handle abuse, operate billing/support workflows (exact roles TBD).

# Out of Scope

- Fine-grained implementation of auth providers and RBAC tables (not in this skeleton).

# User Flow

- User signs up → gains default permissions → becomes a creator for a game → gains creator controls for that game’s content and requests.

# Product Rules

- **Creator control** is a first-class rule: community funds; creator accepts.
- Platform retains ultimate policy enforcement.

# Frontend Notes

- (Placeholder) Role-aware navigation; creator-only surfaces.

# Backend Notes

- (Placeholder) Authorization boundaries between “game public” vs “creator tools.”

# Technical Notes

- (Placeholder) Audit logging needs for sensitive actions (approve/reject, publish, spend).

# Edge Cases

- (Placeholder) Multiple collaborators on one game; transferring ownership; banned users.

# Open Questions

- (Placeholder) Whether teams/shared creator access exists at launch.

# Suggested Epics

- (Placeholder) Creator console permissions model.

# Suggested Tickets

- (Placeholder) Define minimum viable roles for launch.
