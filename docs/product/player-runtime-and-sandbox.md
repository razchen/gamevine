# Player Runtime and Sandbox

# Summary

- Gamevine.ai runs **user-generated, AI-modified JavaScript** in every player's browser. That code runs in a **sandboxed iframe on an isolated subdomain**, never on the app's main origin.
- This document defines the runtime boundary, the APIs a game can use, and the security posture that keeps a buggy or malicious game from compromising the platform or its users.

# Goals

- Make the blast radius of a bad game effectively zero outside its own iframe.
- Give template authors a predictable, minimal runtime contract.
- Keep the player experience fast and framework-free: a game is static HTML/CSS/JS, delivered over a CDN.

# In Scope

- The **origin model** for serving game bundles.
- The **iframe sandbox** attributes and CSP for the player page.
- The **runtime APIs** the game can call (what is injected into the iframe).
- **Error reporting** and minimal analytics from the game bundle.
- **Bundle limits** enforced at publish time.

# Out of Scope

- Template source structure (see `games-templates-and-constraints.md`).
- The build pipeline (see `ai-pipeline-engines-and-releases.md`).
- Storage and CDN delivery (see `static-hosting-and-delivery.md`).

# Origin Model

- The app runs on `gamevine.ai` (and `www.gamevine.ai`).
- Games are served from a **separate registrable domain**: `gamevineusercontent.com` (or similar — picked at launch; the key property is it is **not** a subdomain of `gamevine.ai`, so cookies and storage are fully isolated).
- Each game is served on its own subdomain: `https://<gameSlug>.gamevineusercontent.com/`.
- The app embeds the game inside an iframe pointing at the game's subdomain. The iframe is the only way a player reaches game code.
- The game domain does **not** share cookies, localStorage, IndexedDB, or Service Workers with the app domain. That is the entire point.

# Iframe & CSP Posture

- The player-page iframe uses `sandbox="allow-scripts allow-pointer-lock"`.
  - Notably absent: `allow-same-origin`, `allow-top-navigation`, `allow-forms`, `allow-popups`.
  - `allow-pointer-lock` is included because many templates need it (shooters, platformers).
- The game's own HTML sets a strict CSP:
  - `default-src 'self'`.
  - `script-src 'self'` (no inline scripts, no `eval`; the build step must enforce this).
  - `connect-src 'self' https://telemetry.gamevine.ai` (telemetry is a single well-known endpoint).
  - `img-src 'self' data:`, `media-src 'self'`, `font-src 'self'`.
  - `frame-ancestors https://gamevine.ai https://www.gamevine.ai` (the game may only be iframed by the app).
- The app's player page sets `Permissions-Policy` to deny sensitive features by default (camera, microphone, geolocation, USB, serial).

# Runtime APIs (injected into the game)

The platform exposes a **tiny, versioned** `window.gv` object inside the game iframe. The surface at launch:

- `gv.version: string` — the API version (`"1"` at launch).
- `gv.reportError(err: Error | string): void` — forwards to `telemetry.gamevine.ai` with game id, release id, and user-agent basics. No PII.
- `gv.trackEvent(name: string, props?: Record<string, string | number | boolean>): void` — a tiny allow-list of event names (see `analytics-and-tracking.md`). Unknown event names are silently dropped.
- `gv.ready(): void` — the game calls this when it has finished loading; the app uses it to hide the loading spinner and start the session timer.

That's it. No access to wallet, account, or cross-game state. The game is a black box to the platform, and vice versa.

# Bundle Limits (enforced at publish)

- **Total bundle size**: ≤ 15 MB gzipped across all assets in the release.
- **Main JS entry**: ≤ 1 MB gzipped.
- **Asset count**: ≤ 500 files.
- **External network references**: zero. The bundle may not reference resources outside the game's own origin; CSP enforces this at runtime, the publisher enforces it statically.
- **Allowed MIME types**: HTML, CSS, JS, JSON, PNG, JPG, WEBP, AVIF, SVG (sanitized), MP3, OGG, WAV, WOFF2, GLB, GLTF (for 3D-capable templates later).

Publisher rejects any release that exceeds these limits with a clear error to the creator and a super-admin notification.

# Product Rules

- Games run **only** inside the platform's iframe wrapper. The game subdomain's `frame-ancestors` CSP directive rejects embedding elsewhere.
- Games **never** receive user identity, wallet state, or account tokens. If a template needs a persistent score, that is explicitly out of scope at launch.
- Games may call `gv.trackEvent` with at most **10 events per minute** and **100 events per session**; excess is dropped client-side.
- `gv.reportError` is throttled to **20 errors per session**.
- The telemetry endpoint accepts **no PII**. Payloads that look like email addresses or JWTs are rejected server-side and the game is flagged for review.
- The app's player page preloads only the bundle manifest; asset loading happens inside the iframe from the game's own origin.
- The app listens for `postMessage` from the iframe **only** for a fixed, documented set of message types (`{ type: "gv:ready" }`, `{ type: "gv:requestFullscreen" }`). All other messages are ignored.

# Launch Acceptance Criteria

- A game cannot read cookies or localStorage belonging to `gamevine.ai`.
- A game cannot make network requests to any origin other than its own subdomain and the telemetry endpoint.
- Attempting to iframe the game from a non-app origin yields a blank page (blocked by `frame-ancestors`).
- A game crashing or running an infinite loop does not freeze the app chrome around it (verified by the app's use of a worker-adjacent heartbeat or iframe unresponsive detection).
- A published bundle exceeding any limit was rejected with an actionable error.

# Frontend Notes

- The app's player page is a thin React page whose main job is rendering the iframe, showing loading state, and translating in-app navigation around the iframe.
- The app does **not** attempt to communicate with the game beyond the documented `gv:*` postMessage protocol.
- Fullscreen is implemented through the app, not the iframe, so it respects the sandbox (`allow-pointer-lock` is still inside the iframe; the fullscreen target is the iframe element itself from the parent page).

# Backend Notes

- Telemetry at `telemetry.gamevine.ai` is a separate minimal endpoint, not the main API. It accepts batched POSTs with short schema (`gameId`, `releaseId`, `event`, `props`, `ts`). It writes to analytics storage only.
- The publisher validates bundle limits and MIME types at upload time.

# Technical Notes

- Games are static: `index.html` + assets. No SSR, no server.
- Service Workers within the game origin are **allowed** for performance but must not claim any scope outside the game's subdomain (the registrable domain is user-content-only).
- Templates should ship with their CSP already set and with `eval`-free build output; the publisher rejects a release containing inline scripts or `eval` usage detected statically.

# Edge Cases

- Game uses a `Worker()` — allowed; worker inherits the iframe origin.
- Game tries `top.location = ...` — blocked by sandbox (`allow-top-navigation` is not granted).
- Game opens `window.open` — blocked (`allow-popups` not granted).
- Game stores IndexedDB in its own origin — allowed, but every player gets fresh storage since nothing persists across our model's assumptions anyway.
- A template wants WebGL / WebAudio / pointer lock — all supported (standard browser APIs available inside the iframe).
- A game tries to fetch from an AI CDN or asset host outside its own origin — blocked by CSP; build pipeline should inline/copy such assets at creation time.

# Open Questions

- Deferred: allowing trusted third-party domains for fonts / analytics beyond `telemetry.gamevine.ai`. Launch stays on `'self'`.
- Deferred: a `gv.save()` / persistence API. Launch is explicitly non-persistent.

# Suggested Epics

- Launch origin split (`gamevine.ai` vs `gamevineusercontent.com`) and deploy config.
- Launch iframe/CSP posture and player page wrapper.
- Launch `gv.*` runtime API and telemetry endpoint.
- Launch publisher bundle validation (limits + MIME + CSP checks).

# Suggested Tickets

- Provision `gamevineusercontent.com` with wildcard routing to R2 and set per-game subdomain mapping.
- Implement the player page iframe wrapper with the documented sandbox attrs.
- Implement the game HTML template's CSP header injection in the publisher.
- Implement `window.gv` injection script and version it.
- Implement `telemetry.gamevine.ai` with rate limiting and PII rejection.
- Implement bundle validation (size, file count, MIME, inline-script detection) in the publisher.
- Implement `postMessage` allow-listing on the player page.
