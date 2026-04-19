# AI Pipeline, Engines, and Releases

# Summary

- When a **fully funded roadmap item** is ready for implementation, the platform runs an **AI-assisted pipeline** that reviews relevant files, generates a **small patch**, builds, tests, and releases—rather than rewriting the whole game.
- The AI engine is chosen by the **creator** when the roadmap item is created, and that choice drives both expected cost and the implementation path for that item.
- At launch, implementation should run on **centralized worker infrastructure** using **isolated per-job sandboxes**, with publishing handled by a separate service rather than by the worker directly.

# Goals

- Keep changes **targeted** to control cost and improve reliability.
- Allow **different AI engines** for different strengths (quality, creativity, balance, visuals, cost).
- Turn approved, funded roadmap work into a repeatable release process that does not require manual intervention on every success case.
- Keep infrastructure cost reasonable at launch by using shared worker capacity without sharing mutable job state.

# In Scope

- High-level steps: **roadmap item ready → file review context → patch generation → apply patch → rebuild → test → release**.
- **Creator-selected engine choice** at roadmap-item creation, with **platform-estimated credit targets** based on that engine.
- Pre-run **AI cost estimation** for feature and bug-fix work, using file-review context plus engine pricing to forecast likely credit usage before implementation starts.
- A **locked engine** per roadmap item once created.
- Emphasis on **incremental** modifications across code/assets/config as appropriate to the template.
- Automatic release after passing pipeline gates at launch.
- Failure handling with one retry and then escalation to a platform operator/super admin.
- **Fresh sandboxed workspace** for each implementation run.
- Shared worker-side caching of safe build inputs such as dependencies, toolchains, and template assets.
- Separate **publisher/release service** that promotes successful artifacts after pipeline success.

# Out of Scope

- Full automated rewrites of entire codebases as the default release path.
- Open-ended automatic retries with no escalation path.
- Partial or degraded releases when the main build/test path fails.
- Reusing mutable game workspaces across implementation jobs.
- Giving build workers direct access to production publishing credentials.

# User Flow

- Creator-approved roadmap item is fully funded and reaches the next queue slot → worker creates a fresh sandbox from the game's current source snapshot → selected AI engine produces a targeted patch → the game is rebuilt and tested inside the sandbox → if successful, a release artifact is handed to the publisher service → publisher releases the artifact automatically → if the run fails, the platform retries once and then notifies a super admin if it still fails.

# Product Rules

- Prefer **small patches** over wholesale regeneration.
- The **creator chooses the AI engine** when the roadmap item is created.
- The selected engine remains **locked** for that roadmap item.
- Before implementation starts, the platform should generate an **AI-estimated cost range** for each feature or bug fix rather than exposing only a single raw estimate.
- The estimate should be based on the selected engine, the expected file-review context, and the likely patch size.
- Launch pricing guidance should target a **90% confidence margin**, meaning the quoted estimate should be high enough that most real runs land at or below it.
- If the estimated cost range is too wide or too uncertain, the product should surface that uncertainty rather than pretending the quote is precise.
- **Testing** is a gate before release.
- Creator approval happens **before** the pipeline run through the roadmap/funding flow, not as a manual patch review step after generation.
- If a pipeline run fails, the system should **retry once** and then escalate to a **super admin notification** rather than retrying indefinitely.
- Each implementation run should start from a **fresh isolated sandbox** rather than a persistent mutable workspace.
- Shared caches may be reused for safe inputs like dependencies, toolchains, and template assets, but not for mutable game state.
- Build workers should **not** hold production publishing secrets.
- Publishing should happen through a **separate service** with scoped release credentials.

# Engine Catalog (launch)

Three tiers at launch. The **creator** picks one per roadmap item at creation and it is locked.

| Tier         | Internal name     | Credit cost multiplier | Typical use                                                                          | Recommended default                        |
| ------------ | ----------------- | ---------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| **Fast**     | `engine.fast`     | 0.6x                   | Small bug fixes, tuning, copy/visual tweaks. Lowest latency, least creative freedom. | Bug fixes.                                 |
| **Balanced** | `engine.balanced` | 1.0x                   | Most feature work (new enemies, weapons, small map sections, balance passes).        | Default for new roadmap items.             |
| **Premium**  | `engine.premium`  | 1.8x                   | Visually or mechanically ambitious work; best quality, highest cost.                 | Boss fights, distinctive visual additions. |

Additional engines used internally, not selectable by creators:

- **`engine.screening`** — cheap, fast model used for AI screening of raw idea submissions and game titles/descriptions (see `moderation-and-trust-safety.md`).
- **`engine.estimator`** — same class as screening; used to produce the pre-run cost range quote.

Engine identities at launch map to specific upstream models (a Claude-family and GPT-family pair each is fine; implementation decides). The mapping is **config-driven** so it can be updated without a product-doc change, but the **tier names, multipliers, and rules above are stable at launch**.

# Patch Size Definition (launch)

"Patch-sized" is the acceptance bar for both the pre-run estimate and the test gate. A run that exceeds any of these limits fails the gate and the item is escalated rather than released:

- **Files changed**: ≤ 15.
- **Net lines changed**: ≤ 1,500 (added + removed).
- **New binary asset delta**: ≤ 5 MB.
- **Build time**: ≤ 5 minutes.
- **Resulting bundle delta**: must keep the game under the published bundle limits (see `player-runtime-and-sandbox.md`).
- **Files outside the template's allowed customization surfaces**: 0.

# Test Gate (launch)

A release is eligible for automatic publish only if **all** of the following pass inside the sandbox:

1. **Build succeeds** with no errors.
2. **Template-owned smoke tests** pass (every launch template ships with a minimal smoke suite: game boots, main menu renders, first input advances state).
3. **Bundle validation** passes (limits + CSP + MIME — see `player-runtime-and-sandbox.md`).
4. **Patch-size validation** passes (limits above).
5. **No new external network references** introduced.

Any failure triggers the single retry. A second failure escalates to super admin; the roadmap item enters `failed-escalated` and contributor credits are refunded per `credits-and-monetization.md`.

# Frontend Notes

- Product surfaces should show the selected engine for a roadmap item, pipeline status, and release outcomes at a high level.
- Creators should understand whether an item is queued, in implementation, released, or failed/escalated.
- Product surfaces should show the **estimated credit cost range** for a feature or bug fix before the run starts, including language that the estimate is a high-confidence forecast rather than a guarantee.

# Backend Notes

- Platform services must orchestrate engine-specific worker runs, build/test gating, retry behavior, and escalation notifications without defining APIs or schema here.
- Worker behavior should stay aligned with the roadmap queue and locked engine choice of each item.
- The launch model can use **one strong centralized worker system** so long as jobs remain isolated from each other.
- Publishing and credentialed release actions should be separated from build execution responsibilities.
- The platform should calculate estimated implementation cost before queueing a run, using current engine pricing plus a context-aware token forecast for the targeted files.

# Technical Notes

- **Private AI/build workers** perform heavy work outside the browser.
- The pipeline operates on relevant game files and should favor patch-oriented updates over whole-project regeneration.
- A practical launch setup is centralized worker infrastructure with **per-job isolation** and **shared safe caches**.
- Artifact promotion should happen after the build/test phase, not from inside the sandboxed job environment.
- Cost forecasting should account for both **input context growth** and **expected output patch size**, then add a margin that is intended to cover roughly **90%** of normal runs for that class of request.

# Edge Cases

- Flaky test failures causing a good patch to fail the first run.
- AI-generated patches that technically apply but create gameplay or balance regressions.
- Build/test failures that persist after the allowed retry.
- Need for clear operator visibility when an item is stuck after escalation.
- Sandbox escape or job isolation failure on the worker infrastructure.
- Successful build artifacts that should not be published because artifact handoff or release promotion fails.

# Resolved Questions

- **Minimum launch test bar**: defined above under "Test Gate (launch)".
- **Failed-run surfacing**: creators see pipeline status on their game management surface with states `queued | running | succeeded | retrying | failed-escalated`; super admins see the full run with logs in the admin queue (see `moderation-and-trust-safety.md` and `notifications.md`).
- **Rollback**: resolved in `game-storage-and-lifecycle.md` — creators can rollback to any prior release from release history; super admins can force-rollback.
- **Over-estimate handling**: if an in-flight run's actual token usage exceeds the quoted 90% margin, the platform **absorbs** the overage at launch (no post-hoc re-billing). The analytics system flags the item so the estimator can be tuned. Repeated over-estimates on the same engine tier trigger an estimator-policy review.

# Open Questions

- Deferred: opening lower-cost or higher-cost engine tiers beyond Fast/Balanced/Premium. Revisit after launch based on funnel data.

# Suggested Epics

- Define the end-to-end patch pipeline for queued roadmap items.
- Define engine selection and locked-engine behavior for roadmap items.
- Define safe failure handling, retry rules, and operator escalation for launch.
- Define sandboxed worker execution and separate artifact publishing responsibilities.
- Define the cost-estimation model and confidence-margin policy for feature and bug-fix runs.

# Suggested Tickets

- Define the minimum launch test gate for automatic release.
- Define the launch retry policy and super admin notification behavior.
- Define creator-visible pipeline states for queued, running, released, and failed items.
- Define which build inputs are safe to cache across jobs and which must remain per-run only.
- Define how the AI estimates credit cost for features and bug fixes, including the target **90% confidence margin**.
