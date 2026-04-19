# Users, Roles, and Permissions

# Summary

- The platform has distinct actors: **players**, **creators**, and a **super admin/platform admin**. Permissions should make **creator ownership** explicit while allowing community participation through **funding**.

# Goals

- Ensure only the right people can **approve work**, **publish games**, **spend or allocate credits**, and **perform platform administration**.
- Prevent privilege escalation and accidental public exposure of internal controls.
- Keep the launch role model simple enough to manage while still supporting creator ownership and platform safety controls.

# In Scope

- **Player** capabilities: play, buy credits, submit raw ideas, and fund approved roadmap items.
- **Creator** capabilities: own a game's roadmap decisions, approve/reject ideas for funding, create roadmap items, self-fund roadmap items, and control the direction of their game.
- **Super admin/platform admin** capabilities: enforce platform policy, receive escalations from failed pipeline runs, oversee sensitive platform actions, and operate launch-level administrative controls.
- **Single-owner game model** at launch.

# Out of Scope

- Fine-grained implementation of auth providers and RBAC tables (not in this skeleton).

# User Flow

- User signs up → gains player permissions by default → creates a game and becomes that game's single creator-owner → creator controls roadmap and funding decisions for that game → super admin retains platform-level oversight and escalation handling.

# Product Rules

- **Creator control** is a first-class rule: community funds; creator accepts.
- Platform retains ultimate policy enforcement.
- Each game has **one creator-owner** at launch.
- Creator permissions apply to that creator's own game only.
- Super admin permissions are platform-wide and should remain separate from ordinary creator capabilities.

# Frontend Notes

- Product surfaces should clearly separate player actions, creator-only actions, and platform-only controls.
- Public users should not see internal super admin controls or operational surfaces.

# Backend Notes

- Authorization boundaries should clearly separate public game surfaces, creator-owned game controls, and super-admin-only actions.
- Escalation paths from the AI/build pipeline should target the super admin role, not ordinary creators.

# Technical Notes

- Sensitive actions such as idea approval/rejection, roadmap funding state changes, release promotion, and super admin intervention should be auditable.

# Edge Cases

- Ownership transfer of a game from one creator to another.
- Banned or suspended users who previously owned or funded part of a game's roadmap.
- Creator inactivity on a live game while community demand still exists.
- Distinguishing creator-visible failures from super-admin-only operational failures.

# Open Questions

- How should ownership transfer work if a creator wants to hand off a game?
- What platform actions should the super admin be able to take directly versus only through escalation flows?

# Suggested Epics

- Define the launch role model for players, creators, and super admin.
- Define creator-only versus platform-only controls across the product.
- Define escalation and oversight responsibilities for the super admin role.

# Suggested Tickets

- Define the minimum launch permissions for player, creator-owner, and super admin.
- Define which product surfaces are creator-only and which are super-admin-only.
- Define the launch rules for ownership transfer and creator inactivity handling.
