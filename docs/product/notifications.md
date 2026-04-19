# Notifications

# Summary

- This document defines what events trigger notifications on Gamevine.ai, what channels carry them, and what users can mute.
- At launch, notifications are **transactional first**: tell the user about things that affect their money, their game, or their account. Engagement nudges are out of scope.
- Channels at launch are **email** and **in-app**. Push and SMS are deferred.

# Goals

- Keep users informed about the state of things they paid for or created without being noisy.
- Give users meaningful control without drowning them in toggles.
- Make operationally critical events (pipeline failure, payment failure) reach the right person fast.

# In Scope

- Transactional email via a single provider (`no-reply@gamevine.ai`).
- In-app inbox with unread count and mark-as-read.
- User-level preferences for non-critical categories.
- Super-admin operational alerts for pipeline escalations.

# Out of Scope

- Push notifications (web push or native).
- SMS notifications.
- Marketing / growth email campaigns.
- Creator-to-player broadcast messages ("message all my funders").
- Digest rollups at launch.

# Event Catalog

Each event has a **category** (determines mutability), **channel(s)**, and **recipient**. `[required]` means the user cannot mute it.

## Account & Security — `[required]`, email + in-app

- Signup confirmation / email verification.
- Password reset requested.
- Password changed.
- Email changed (sent to both old and new addresses).
- New sign-in from a new device (informational).
- Account scheduled for deletion.
- Account deletion canceled.
- Account data export ready.
- Terms-of-service update notice (email only).

## Billing & Wallet — `[required]`, email + in-app

- Subscription started.
- Subscription renewed (receipt).
- Subscription payment failed (with retry schedule).
- Subscription canceled (confirmation + effective date).
- Subscription downgraded / upgraded (including proration note).
- Top-up credits purchased (receipt).
- Top-up credits expiring in 30 days (one reminder).
- Chargeback opened on an account.

## Idea & Roadmap — mutable, email + in-app (default on)

- Your raw idea was **normalized** and is awaiting creator review.
- Your raw idea was **soft-rejected** by AI screening.
- Your raw idea was **held** by moderation (and later released or removed).
- Your raw idea was **approved** by the creator and is now a fundable roadmap item.
- Your raw idea was **rejected** by the creator.
- A roadmap item you contributed to reached **full funding**.
- A roadmap item you contributed to was **canceled** (credits refunded).
- A roadmap item you contributed to was **released** (update shipped).
- A roadmap item you contributed to **failed pipeline** after escalation (credits refunded).

## Creator — mutable, email + in-app (default on)

- New raw idea awaiting your review.
- Raw idea review queue has N items older than 7 days (weekly nudge, off by default).
- A roadmap item on your game reached full funding and is queued for implementation.
- A pipeline run on your game **started**, **succeeded** (released), or **failed-and-escalated**.
- A user reported a game you own.
- Your game was unpublished by moderation (always on, treated as required).
- Your creator review SLA is expiring on idea X in 3 days (see `funding-roadmap-and-creator-control.md`).

## Moderation — `[required]` for affected party, in-app + email

- Your content was removed.
- Your account was suspended.
- Your account was unsuspended.
- An appeal response is available.

## Super Admin Operations — `[required]`, email + in-app

- Pipeline run failed after retry; item N escalated.
- AI-screening held an idea that is now > 24h old.
- DMCA intake received.
- Payment provider webhook failures above threshold.

# User Flow

- User lands in the in-app **Inbox** from the app chrome → sees unread notifications grouped by category → clicks through to the relevant surface (idea, game, receipt).
- User opens **Settings → Notifications** → toggles mutable categories per channel (email / in-app).

# Product Rules

- `[required]` categories cannot be muted at launch. They still render in-app; email can be turned off only for `Security informational` (new-device sign-in) at launch.
- Each notification includes a **deep link** to the canonical surface and a brief context (what changed, next step if any).
- No notification duplicates across channels in the same event — one email + one in-app row per event.
- Email subjects are **action-first**: `Your idea was approved`, not `Update on your Gamevine activity`.
- Notification preferences persist across devices (stored on the `users` table, not in the browser).
- The in-app inbox retains the last **90 days** of notifications; older entries are pruned.
- No notification may disclose another user's email, handle, or display name without their consent (e.g., "A user funded your item" not "User @alice funded your item") — except in public contexts already visible elsewhere (e.g., contributor list on a public roadmap item).

# Launch Acceptance Criteria

- Every event in the catalog produces at most one email and one in-app row per trigger.
- A user can mute any non-`[required]` category per channel from Settings → Notifications.
- The in-app inbox shows unread count in the app chrome.
- Each notification has a working deep link.
- Super-admin `[required]` alerts reach all super admin accounts (not just one on-call).

# Frontend Notes

- In-app inbox lives at `/inbox` with a small bell icon in the app header showing unread count.
- Settings → Notifications groups toggles by category, not by event. Users pick "Idea & Roadmap → email off", not 9 individual toggles.

# Backend Notes

- Events are emitted through a single `NotificationService`; the API never calls the email provider directly.
- The service resolves: recipient preferences → channels → provider call → write a row to `notifications` (for the in-app inbox) → write a delivery-audit row.
- Pipeline events are emitted from the publisher/worker subsystem through the same service.

# Technical Notes

- Email provider at launch: **Resend** (with Postmark as fallback if deliverability regresses).
- Templates live in code, not a vendor dashboard; one template file per event.
- Webhook from the email provider updates delivery state (sent / bounced / complained) on the audit row.

# Edge Cases

- User changes email mid-flight → new transactional emails go to the new address; any pending send is canceled server-side before dispatch.
- User deletes account with unread notifications → inbox is wiped on account anonymization; transactional emails already sent remain in the user's mailbox.
- Bounce / complaint → email channel auto-muted for that user with an in-app banner explaining the status.
- Very high burst (e.g., a popular game gets many ideas in a minute) → creator notifications coalesce into a single `N new ideas` message; still one email max per 15 minutes per category.

# Open Questions

- Deferred: push notifications. Revisit after launch.
- Deferred: weekly digest email. Revisit once engagement signals exist.

# Suggested Epics

- Launch notification service, catalog, and in-app inbox.
- User notification preferences UI and persistence.
- Super-admin operational alerts.

# Suggested Tickets

- Implement `NotificationService` with channel fan-out and preference resolution.
- Implement in-app inbox with unread count and pruning.
- Implement per-category preferences in Settings → Notifications.
- Implement email templates for every event in the catalog.
- Implement provider webhook handling for bounces/complaints.
- Implement coalescing for creator "new idea" bursts.
