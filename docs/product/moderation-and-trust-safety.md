# Moderation and Trust & Safety

# Summary

- This document defines how Gamevine.ai keeps user-generated content (games, ideas, profiles) within the platform's content policy and how the platform responds when something goes wrong.
- Moderation at launch is a mix of **AI screening** (first pass on raw idea submissions and game titles/descriptions), **user reports**, and a **super-admin review queue**.
- The goal is not zero-tolerance purity; it is a lean, lawful launch that doesn't get the platform shut down and doesn't make creators feel abandoned when something bad happens.

# Goals

- Catch clearly prohibited content before it is published.
- Give users a trustworthy way to report content and actors.
- Give super admins the tools to remove content, suspend users, and respond to IP takedowns fast.
- Keep creator ownership meaningful: creators moderate their own game's idea submissions within platform rules.

# In Scope

- **Content policy** applied to: game titles, game descriptions, game runtime content (text/visuals), raw idea submissions, user handles, user display names, avatars.
- **AI pre-screening** of raw idea submissions before they reach creator review.
- **AI pre-screening** of game titles and descriptions at create/publish time.
- **User reporting** for: games, raw ideas, user profiles.
- **Super-admin moderation queue** with: pending AI flags, user reports, pipeline escalations.
- **Suspension, unpublish, and ban** as moderation actions.
- **Appeal** via a single email reply path at launch.
- **DMCA / IP takedown** flow with a public contact address.
- **Creator-level moderation** of their own game's idea queue (reject ideas from their game, block abusive submitters from their game).
- **Audit log** of moderation actions visible to super admins.

# Out of Scope

- Proactive moderation of game runtime behavior after publish (we trust the template sandbox — see `player-runtime-and-sandbox.md`).
- Community moderators / trusted flagger roles.
- Automated ban decisions without human review.
- Moderation of direct messages (there are no DMs at launch).

# Content Policy (launch)

Prohibited at launch:

- **Illegal content**: CSAM, explicit sexual content, credible threats, doxxing.
- **IP infringement**: unauthorized use of third-party trademarks, recognizable characters, or copyrighted assets.
- **Hate and harassment** targeting protected classes.
- **Malware / exploit attempts** in generated code or assets.
- **Promotion of real-world violence**, self-harm content, or regulated activities (gambling with real money, drugs, weapons sales).
- **Deceptive content**: impersonation of real people, misleading claims about the game's nature.

Allowed with friction (creator approval required):

- Cartoon violence consistent with the template's genre.
- Dark themes (horror, suspense) at the creator's discretion.

Not policed at launch (but flagged for review):

- Low-quality or nonsense submissions (handled by creator approval, not platform policy).
- Disputes between creator and community about subjective direction.

# User Flow

- **Submitter flow**: player writes raw idea → AI screening runs → clear pass → creator review → clear violation → rejected and fee forfeited → borderline → held in super-admin queue.
- **Creator flow**: receives approved-by-AI ideas in their review queue → rejects or approves → can also "report to platform" for handling.
- **Reporter flow**: any signed-in user clicks "Report" on a game, idea, or profile → picks a reason → optional note → report enters super-admin queue.
- **Super-admin flow**: opens moderation queue → reviews item with context (link, reporter, AI flags) → takes action (dismiss, remove content, suspend user, unpublish game, escalate to legal) → action is logged and the affected parties are notified.

# Product Rules

- AI screening has **three outcomes**: pass, reject, hold-for-review. "Hold" items never reach the creator until a super admin acts on them.
- A rejected raw idea does **not refund** the submission fee at launch (aligned with `funding-roadmap-and-creator-control.md`).
- A **held** idea that is later cleared by a super admin flows to creator review normally. A held idea later rejected by a super admin refunds the submission fee, because the user followed the rules and the platform held them.
- Super admins can **unpublish** a game at any time. Unpublishing does not delete the game; the creator can contest or correct.
- Super admins can **suspend** a user. Suspended users cannot sign in. All pledged credits on open items are held; if the suspension becomes permanent, pledges are refunded to original contributors.
- A **banned** user's published games are unpublished; ownership does not transfer at launch (see `users-roles-and-permissions.md`).
- **DMCA takedown** requests are honored within 48 hours; counter-notice is accepted via email reply.
- Creators may **block a specific submitter** from their game's idea intake (soft block; does not affect the submitter's account).
- All moderation actions produce an **audit log entry**: actor, target, action, reason, timestamp.

# Launch Acceptance Criteria

- AI screening runs synchronously on raw idea submission; hold decisions surface in the super-admin queue within 1 minute.
- A user can report a game, idea, or profile in ≤3 clicks from the content itself.
- Super admin can act on a queue item in one screen (view, decide, record reason).
- An unpublished game returns a 404 or "unavailable" page at its public URL within 1 minute.
- Suspended users see a clear message at sign-in explaining the action and how to appeal.
- DMCA contact address is reachable from the footer of every public page.

# Frontend Notes

- Report button lives on every game detail page, every public idea card, and every user profile.
- Moderation queue and action surfaces live under `/admin` and are only visible to super admins.
- Creator's idea review screen shows AI flags (e.g., "AI suggests: off-template") as hints, not hard rules.

# Backend Notes

- AI screening is a service the API calls on idea submission and on game title/description change; it returns `{ outcome: "pass" | "reject" | "hold", reasons: string[] }`.
- Moderation actions go through the API and always write an audit log row.
- Notifications on moderation actions route through the notifications system (see `notifications.md`).

# Technical Notes

- AI screening model choice at launch: a cheap, fast model; details in `ai-pipeline-engines-and-releases.md` under "Screening engine".
- Keep prompts and classification thresholds in config so super admins can tune without a deploy.

# Edge Cases

- Coordinated mass-reports against a creator → throttle per-reporter; super admin sees report count but judges on merits.
- Creator reports their own idea (self-submitted or via a test account) → no special handling; queue treats it like any report.
- AI screening false positive blocks a legitimate idea → super admin can clear it from queue; user gets a fee refund on clear-and-reject; no refund if super admin forwards to creator (user's idea was ultimately handled).
- A funded roadmap item whose originating idea is later found to violate policy → item is paused, super admin reviews, contributors refunded if removed.
- IP takedown on a game that has open funded items → game is unpublished; open items are canceled; contributors refunded.

# Open Questions

- Deferred: community moderator role. Launch stays super-admin only.
- Deferred: in-app appeal UI. Launch uses email replies.

# Suggested Epics

- Launch content policy and AI-screening pipeline for ideas and game metadata.
- User reporting across games, ideas, and profiles.
- Super-admin moderation queue and actions (remove, unpublish, suspend, ban).
- DMCA / IP takedown process.

# Suggested Tickets

- Implement AI screening service with `pass / reject / hold` outcomes and reason strings.
- Implement report form and backend routes for games, ideas, and profiles.
- Implement super-admin moderation queue UI with action surface.
- Implement unpublish / suspend / ban actions and the audit log they write to.
- Implement DMCA intake email alias and runbook.
- Implement creator-level submitter block on idea intake.
