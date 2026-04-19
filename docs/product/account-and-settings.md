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

# Settings Surface Layout (launch)

`/settings` is a single page with a left-nav of sections:

- **Profile** — display name, handle (immutable at launch), avatar, short bio (≤ 280 chars), location (free text, optional), website URL (optional, validated).
- **Account** — email (with re-verification on change), password (change form), language (launch: English only; placeholder for future), timezone (auto-detected, overridable).
- **Notifications** — per-category toggles per channel, matching the catalog in `notifications.md`.
- **Billing & Wallet** — link to `/wallet` for current balance and purchase history; in-line controls for subscription plan management (upgrade/downgrade/cancel), payment method update, invoice history.
- **Privacy & Data** — self-serve data export (JSON bundle), account deletion (30-day grace).
- **Security** (super admin only) — TOTP enrollment status.

# Editable Profile Fields (launch)

| Field          | Editable                   | Validation                                                  |
| -------------- | -------------------------- | ----------------------------------------------------------- |
| `handle`       | No (immutable at launch)   | —                                                           |
| `display_name` | Yes                        | 1–40 chars, no leading/trailing whitespace                  |
| `avatar_url`   | Yes                        | Image upload (PNG/JPG/WEBP), ≤ 2 MB, square crop            |
| `bio`          | Yes                        | ≤ 280 chars, plain text                                     |
| `website_url`  | Yes                        | valid URL, `https://` only                                  |
| `location`     | Yes                        | ≤ 60 chars, free text                                       |
| `email`        | Yes (with re-verification) | Standard email regex + uniqueness                           |
| `password`     | Yes (via change form)      | Same rules as signup (see `authentication-and-identity.md`) |
| `timezone`     | Yes                        | IANA timezone                                               |

# Notification Preference Toggles (launch)

Two columns per category (email / in-app), grouped as in `notifications.md`:

- Account & Security — `[required]`, not togglable; informational security events (new-device sign-in) optionally togglable on email only.
- Billing & Wallet — `[required]`, not togglable.
- Idea & Roadmap (for contributors) — togglable per channel.
- Creator (for creators) — togglable per channel; "Weekly review-queue nudge" is off by default.
- Moderation — `[required]` for the affected party.

# Data Export & Account Deletion

- **Export**: user clicks "Export my data"; server queues a job that produces a single JSON file (profile, wallet ledger, games owned, ideas submitted, contributions, notification history) and emails a download link when ready. Link expires in 7 days.
- **Delete**: user clicks "Delete my account" → confirmation modal requiring password (or Google re-auth) → account enters `pending deletion (30 days)`; the user receives a "cancel deletion" email. After 30 days, the account is anonymized:
  - `users.email` and `users.handle` are nulled/randomized; display name set to "Deleted user".
  - Authored content (ideas, contributions) stays visible with the anonymized author.
  - Owned games: each is automatically `unpublished` pending super-admin review; pending-funded items are canceled and contributors refunded per `credits-and-monetization.md`.
  - Wallet: remaining subscription credits zeroed; remaining top-up credits zeroed (no cash refund beyond normal dispute channels).

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

# Resolved Questions

- **Editable fields**: listed above under "Editable Profile Fields (launch)".
- **Notification preferences**: listed above under "Notification Preference Toggles (launch)".
- **Billing in settings vs dedicated flow**: billing lives in a dedicated `/wallet` surface (plan management, purchases, transactions). `/settings → Billing & Wallet` links there and hosts the payment method + invoice history only.

# Open Questions

- Deferred: handle changes after launch (requires reservation/collision policy and URL redirection).

# Suggested Epics

- Define the launch account/settings information architecture.
- Define the minimum profile, notification, and wallet-adjacent settings.
- Define how creator-specific settings differ from ordinary player settings.

# Suggested Tickets

- Define the minimum launch profile/settings surface.
- Define the launch notification preferences.
- Define which billing/wallet/account controls belong in settings at launch.
