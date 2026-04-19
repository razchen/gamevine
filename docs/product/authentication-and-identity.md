# Authentication and Identity

# Summary

- This document defines how people sign up, sign in, and manage their identity on Gamevine.ai at launch.
- Auth is the gate for every paid action (subscribing, buying credits, submitting ideas, creating games). It must be fast, boring, and secure.
- Launch uses **in-house authentication** inside the NestJS API: email/password with `argon2id` hashing, Google OAuth 2.0 for social sign-in, opaque server-side sessions delivered via HTTP-only cookies, and transactional emails through a single provider. No third-party auth provider sits in front of the API.

# Goals

- Let a visitor go from landing page to "playing a game" in under 30 seconds without signing in.
- Let a subscriber go from "I want to participate" to "first paid action" in under 2 minutes.
- Keep the launch auth surface small (email/password + Google OAuth only) so support, recovery, and security stories stay simple.

# In Scope

- **Email + password** signup and sign-in.
- **Google OAuth** at launch.
- **Email verification** before first paid action.
- **Password reset** by email link.
- **Session management** via HTTP-only cookies issued by the API.
- **Account deletion** (self-serve) with a grace window.
- **Terms and privacy acceptance** captured at signup.
- **Age gate** at signup: user must confirm they are 13+.
- **Email change** flow with re-verification.
- **Unique handle** (`@handle`) separate from display name; used in URLs.

# Out of Scope

- Magic-link sign-in at launch.
- Passkeys at launch.
- SSO / SAML / enterprise auth.
- MFA at launch (platform admin accounts get MFA; ordinary users do not).
- Phone-number-based auth.
- Social logins other than Google.

# User Flow

- Visitor lands anywhere → clicks "Sign up" → provides email, password, handle, accepts terms, confirms 13+ → verification email sent → visitor clicks link → signed in and returned to the page they came from.
- Returning user → "Sign in" → email + password (or Google) → session cookie issued.
- Forgot password → "Reset" → email link → set new password → signed in.
- Sign out → session invalidated server-side.
- Delete account → confirmation step → account enters **pending deletion (30 days)** → user can cancel from a restore link in a single email; after 30 days, identity record is anonymized and wallet is closed.

# Product Rules

- **Play is anonymous.** Playing a game never requires sign-in.
- **Every paid action requires**: signed-in + email-verified + accepted-terms + active subscription (for paid participation actions — see `subscriptions-pricing-and-credit-value.md`).
- **Handles are unique, immutable at launch, 3–20 chars, `[a-z0-9_]`.** Display names can change freely.
- **One account per email.** Signing up with a Google email that already exists as password-based prompts the user to link, not duplicate.
- **Sessions** expire after 30 days of inactivity; sliding refresh on each request.
- **Password rules**: minimum 12 chars, no composition rules, checked against HIBP top-leaked list.
- **Rate limits** on sign-in, reset, and verification endpoints (5 attempts / 15 min / IP+account).
- **Email verification** is required before the first credit-consuming action, not before sign-in.
- **Account deletion** is self-serve; admin-initiated deletion is a moderation action (see `moderation-and-trust-safety.md`).
- **Data export** (GDPR-style) is self-serve from settings and returns a JSON bundle of profile, wallet history, games owned, ideas submitted, and contributions.
- **Age gate failure** (user checks "no") blocks account creation with a polite message; does not store the attempt.
- **Super admin accounts require MFA** via TOTP; enforced at login, not optional.

# Launch Acceptance Criteria

- Visitor can sign up with email+password in a single form and reach a verified, signed-in state within one email round trip.
- Visitor can sign up with Google in one click and reach a signed-in state without a verification email (Google-verified email is trusted).
- Signed-in user without email verification can play but cannot perform any credit-consuming action; the UI explains why and offers "resend verification".
- Password reset link is single-use and expires in 1 hour.
- Handle collisions return a clear error with suggestions.
- Deleting an account produces an email with a 30-day restore link.
- A super admin cannot sign in without completing TOTP.

# Frontend Notes

- Auth pages live on the public site (`/signin`, `/signup`, `/reset`, `/verify`).
- Protected app routes redirect to `/signin?next=<path>` and return the user to `next` on success.
- Avatar upload is deferred to account settings, not part of signup.

# Backend Notes

- Credentials, sessions, and auth tokens live in platform-owned Postgres tables managed by Drizzle. The NestJS API is the sole authority; no external provider brokers sign-in.
- Platform `users` table owns: `id`, `email` (citext, unique), `password_hash` (argon2id, nullable — OAuth-only accounts have no password), `google_sub` (unique, nullable — the Google OAuth subject claim, used for re-linking across email changes), `handle`, `display_name`, `avatar_url`, `created_at`, `email_verified_at`, `terms_accepted_at`, `age_confirmed_at`, `deleted_at`.
- Auxiliary auth tables:
  - `auth_sessions` — server-side session records keyed by a token **hash**, with `user_id`, `created_at`, `last_seen_at`, `expires_at`, `user_agent`, `ip_hash`, `revoked_at`.
  - `email_verification_tokens` and `password_reset_tokens` — store **hashes** of single-use tokens with `expires_at` and `consumed_at`; the raw token only ever exists in the outbound email.
  - `totp_secrets` — super-admin only; stores an encrypted TOTP secret and `enrolled_at`.
- Wallet, subscription, permissions, and all other platform data key off `users.id`.
- Google OAuth is implemented as a standard authorization-code flow (Google's OIDC endpoints); the API verifies the ID token signature and uses the `sub` claim (stored as `google_sub`) as the stable identifier.

# Technical Notes

- **Password hashing**: `argon2id`. Parameters tuned to ~250 ms on production hardware (starting baseline follows the current OWASP cheat sheet: `m=19 MiB, t=2, p=1`). Parameters live in config so they can be increased without a migration.
- **Sessions**: cookies carry a **32-byte opaque random token** (base64url); the server looks it up in `auth_sessions` by its SHA-256 hash. No JWTs in cookies. Sessions slide on every authenticated request and are hard-expired at 30 days of inactivity (matches the Product Rule above).
- **Session invalidation**: sign-out revokes the current session row; password change and email change revoke all of that user's sessions.
- Cookies: `HttpOnly`, `Secure`, `SameSite=Lax`, scoped to the app domain (not the player-bundle subdomain — see `player-runtime-and-sandbox.md`).
- CSRF: double-submit cookie pattern for mutating routes.
- All auth emails sent through a single transactional provider (Resend or Postmark); sender identity is `no-reply@gamevine.ai`.
- **Verification / reset tokens**: 32-byte random values, delivered only in email, stored as SHA-256 hashes, single-use, `consumed_at` set on redemption. Expiries: reset `1 hour` (matches the acceptance criterion above), verification `24 hours` with a resend action.

# Edge Cases

- User signs up with a disposable-email domain → allowed at launch; flagged for future policy.
- User deletes account while holding pledged credits on open roadmap items → pledges auto-refund on deletion; see `credits-and-monetization.md`.
- User changes email while another action is in flight → current session stays valid; new verification required on next sensitive action.
- Google account email changes upstream → next sign-in re-links by `google_sub`, not email.
- Bot signups → reCAPTCHA/Turnstile on the signup and reset forms.

# Open Questions

- Deferred: magic-link sign-in. Revisit after launch.
- Deferred: passkeys (WebAuthn). Revisit once the in-house email/password + Google flow is stable and there's demand.

# Suggested Epics

- Launch auth flows (signup, signin, verification, reset, sign-out).
- Account lifecycle (delete with grace, export, email change).
- Admin MFA enforcement.

# Suggested Tickets

- Implement email+password signup with handle uniqueness and terms capture.
- Implement Google OAuth signup/signin with account-linking on email collision.
- Implement email verification with resend and 1-hour expiry.
- Implement password reset with single-use tokens.
- Implement session cookie issuance and refresh in the NestJS API.
- Implement rate limiting on auth endpoints.
- Implement self-serve account deletion with 30-day restore.
- Implement self-serve data export (JSON bundle).
- Implement TOTP enrollment and enforcement for super admins.
