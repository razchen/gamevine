# Account and Settings

# Summary

- This document defines the account-level and settings-level surfaces of Gamevine.ai.
- It covers what users can manage about themselves, their preferences, and their creator/account context at launch.

# Goals

- Define the minimum account and settings model needed for launch.
- Separate personal account settings from creator/game management settings.
- Ensure users can manage core identity, wallet-adjacent, and notification preferences without overcomplicating the product.

# In Scope

- User account/profile settings.
- Basic creator/account controls that are not part of roadmap management itself.
- Notification and communication preferences at a high level.
- Billing or wallet-adjacent settings surfaces at a high level.

# Out of Scope

- Deep creator game-management workflows handled in other specs.
- Full billing implementation behavior.
- Advanced organization/team management beyond the single-owner launch model.

# User Flow

- User signs in → opens account/settings surfaces → updates profile or preferences → returns to player or creator workflows with those settings applied.

# Product Rules

- Account settings should stay distinct from game-management and roadmap-management surfaces.
- Launch settings should stay minimal and focused on core user needs.
- The settings model should respect the single-owner creator model and the basic launch role structure.

# Frontend Notes

- Settings should be discoverable but not treated as a primary product destination.
- Users should be able to tell the difference between **personal settings**, **wallet/billing-related settings**, and **creator-related settings**.

# Backend Notes

- Settings will eventually need profile, preference, notification, and entitlement state, but this doc should avoid implementation detail.

# Technical Notes

- This spec is about settings scope and information architecture, not persistence details.

# Edge Cases

- Confusion between account settings and creator/game settings.
- Users wanting team/member management even though launch is single-owner.
- Settings surfaces exposing controls that do not exist elsewhere in the launch product.

# Open Questions

- What exact profile/account fields should be editable at launch?
- What notification preferences should exist at launch?
- What billing or wallet-adjacent settings should exist as separate settings versus as dedicated product flows?

# Suggested Epics

- Define the launch account/settings information architecture.
- Define the minimum profile, notification, and wallet-adjacent settings.
- Define how creator-specific settings differ from ordinary player settings.

# Suggested Tickets

- Define the minimum launch profile/settings surface.
- Define the launch notification preferences.
- Define which billing/wallet/account controls belong in settings at launch.
