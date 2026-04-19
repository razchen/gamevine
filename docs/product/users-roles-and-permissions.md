# Users, Roles, and Permissions

# Summary

- The platform has distinct actors: **players**, **creators**, and a **super admin/platform admin**. Permissions should make **creator ownership** explicit while allowing community participation through **funding**.

# Goals

- Ensure only the right people can **approve work**, **publish games**, **spend or allocate credits**, and **perform platform administration**.
- Prevent privilege escalation and accidental public exposure of internal controls.
- Keep the launch role model simple enough to manage while still supporting creator ownership and platform safety controls.

# In Scope

- **Visitor** capabilities: play any published game, browse. No account, no paid actions.
- **Free (signed in)** capabilities: play, customize profile, report content. No paid participation actions.
- **Supporter (paid participant)** capabilities: everything Free can do, plus submit raw ideas, fund approved roadmap items, buy top-up credits.
- **Creator** capabilities: everything Supporter can do, plus create games, own their games' roadmap decisions, approve/reject ideas for funding, create roadmap items, self-fund, rollback releases, unpublish/republish own games.
- **Super admin / platform admin** capabilities: enforce policy, moderate content, handle DMCA, intervene on pipeline escalations, impersonate for support (audited), adjust wallets manually (audited).
- **Single-owner game model** at launch.

# Role × Action Matrix (launch)

Legend: `✓` allowed, `—` not allowed, `own` allowed on resources the user owns.

| Action                            | Visitor | Free | Supporter | Creator       | Super Admin  |
| --------------------------------- | ------- | ---- | --------- | ------------- | ------------ |
| Play a published game             | ✓       | ✓    | ✓         | ✓             | ✓            |
| Browse games                      | ✓       | ✓    | ✓         | ✓             | ✓            |
| Sign up / sign in                 | ✓       | ✓    | ✓         | ✓             | ✓            |
| Edit profile / handle / avatar    | —       | ✓    | ✓         | ✓             | ✓            |
| Submit raw idea                   | —       | —    | ✓         | ✓             | ✓            |
| Fund a roadmap item               | —       | —    | ✓         | ✓             | ✓            |
| Buy top-up credits                | —       | —    | ✓         | ✓             | ✓            |
| Create a game from template       | —       | —    | —         | ✓             | ✓            |
| Approve / reject idea on own game | —       | —    | —         | own           | ✓ (override) |
| Create roadmap item on own game   | —       | —    | —         | own           | ✓            |
| Self-fund roadmap item            | —       | —    | —         | own           | ✓            |
| Publish / unpublish own game      | —       | —    | —         | own           | ✓            |
| Rollback release on own game      | —       | —    | —         | own           | ✓            |
| Block a submitter from own game   | —       | —    | —         | own           | ✓            |
| Report content                    | —       | ✓    | ✓         | ✓             | ✓            |
| Access moderation queue           | —       | —    | —         | —             | ✓            |
| Remove / unpublish any game       | —       | —    | —         | —             | ✓            |
| Suspend / ban a user              | —       | —    | —         | —             | ✓            |
| Force-rollback a release          | —       | —    | —         | —             | ✓            |
| Manual wallet adjustment          | —       | —    | —         | —             | ✓            |
| Access pipeline-run logs          | —       | —    | —         | own (summary) | ✓ (full)     |
| View audit log                    | —       | —    | —         | —             | ✓            |

A user can simultaneously be in the **Creator** column for their own games and the **Supporter** column on any other game — the role is per-scope. Super admins are a global role that sits above all scopes.

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
- **Ownership transfer is not supported at launch.** If a creator leaves, games follow the inactivity rules in `funding-roadmap-and-creator-control.md` and may be removed by super admin action. No user-initiated transfer UI is built.
- **Role assignment** is automatic based on subscription state: Free, Supporter, Creator, and Creator Pro tiers all grant the role of the same name (Creator Pro inherits Creator row above). Super admin is granted manually by another super admin and logged.
- **Impersonation**: super admins may impersonate a user for support purposes. Every impersonation session is logged and the target user can see impersonation history in their account.

# Frontend Notes

- Product surfaces should clearly separate player actions, creator-only actions, and platform-only controls.
- Public users should not see internal super admin controls or operational surfaces.

# Backend Notes

- Authorization boundaries should clearly separate public game surfaces, creator-owned game controls, and super-admin-only actions.
- Escalation paths from the AI/build pipeline should target the super admin role, not ordinary creators.

# Technical Notes

- Sensitive actions such as idea approval/rejection, roadmap funding state changes, release promotion, and super admin intervention should be auditable.

# Authorization Implementation (CASL)

The role × action matrix above is implemented with **CASL** (`@casl/ability` v6+). One set of ability rules covers both apps:

- **Subjects and actions** are defined in `@gamevine/shared` as string literal unions so both apps import the same type space. Subjects at launch: `User`, `Game`, `Idea`, `RoadmapItem`, `Contribution`, `PipelineRun`, `Release`, `WalletTransaction`, `Report`, `AuditLog`. Actions: `manage` (wildcard), `create`, `read`, `update`, `delete`, plus domain-specific verbs where needed (`approve`, `reject`, `fund`, `publish`, `unpublish`, `rollback`, `suspend`, `ban`, `remove`, `adjust`).
- **Ability construction** lives in `@gamevine/shared` too: a single `defineAbilitiesFor(user)` factory uses `AbilityBuilder` + `createMongoAbility` to build rules per role, keyed off the user's `role` and ownership fields. Result: one function, both apps.
- **On the API side**, a NestJS `CaslAbilityFactory` wraps `defineAbilitiesFor` so it can attach a fresh `Ability` to every request. A `PoliciesGuard` plus `@CheckPolicies(ability => ability.can('approve', 'Idea'))` decorator enforces permissions at the controller boundary. The guard reads the authenticated user from the session cookie and produces the ability on demand.
- **On the web side**, the API returns the user's serialized CASL rules (`ability.rules` as JSON) at sign-in and on session refresh. The web app rehydrates a client-side `Ability` via `createMongoAbility(rules)`, provides it through a React context, and uses `<Can I="approve" a="Idea">` and `useAbility()` for declarative UI gating.
- **Condition-based rules** (e.g., `update Game where ownerUserId == user.id`) use CASL's MongoDB-style condition objects so the same rule applies both in UI gating and in API checks against the resource being mutated.
- **Never call `ability.can(...)` on the client as the last line of defense.** Every write goes through the server-side guard, which owns the real decision. Client-side `Can` is a UX hint, not a security boundary.

# Authorization Edge Cases

- A user's subscription expiring downgrades their role (e.g., Creator → Supporter) on next session refresh. Their abilities update then; pending UI hints may reflect stale rules for up to the session-refresh interval.
- A super admin impersonating a user uses the **target user's** abilities for all reads and actions, not the admin's. Impersonation bypass of a role-gated action is an explicit audit-log entry and visible to the target.
- When a user action affects a resource the user does not own (e.g., reporting a game), the CASL rule allows `report` on any `Game` but only allows `remove` on games the user owns or if the user is super admin.

# Edge Cases

- Ownership transfer of a game from one creator to another.
- Banned or suspended users who previously owned or funded part of a game's roadmap.
- Creator inactivity on a live game while community demand still exists.
- Distinguishing creator-visible failures from super-admin-only operational failures.

# Resolved Questions

- **Ownership transfer**: not at launch; deferred.
- **Direct super-admin actions**: unpublish, remove, suspend, ban, force-rollback, wallet adjustment, impersonate. All audited. Escalation flow is the inbox; action happens directly from the moderation/admin surfaces.

# Open Questions

- Deferred: non-super-admin moderator role (community moderators).

# Suggested Epics

- Define the launch role model for players, creators, and super admin.
- Define creator-only versus platform-only controls across the product.
- Define escalation and oversight responsibilities for the super admin role.

# Suggested Tickets

- Define the minimum launch permissions for player, creator-owner, and super admin.
- Define which product surfaces are creator-only and which are super-admin-only.
- Define the launch rules for ownership transfer and creator inactivity handling.
