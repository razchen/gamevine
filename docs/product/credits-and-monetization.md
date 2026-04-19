# Credits and Monetization

# Summary

- The platform uses a **single shared credit wallet** for core product actions.
- Credits are spent on **creating games**, **submitting raw ideas**, **funding approved roadmap items**, and **creator self-funding** of roadmap items.
- Revenue comes from users buying credits and then spending them across the game creation and game evolution loop.

# Goals

- Make ongoing evolution economically sustainable for the platform and aligned with real demand.
- Keep pricing understandable: **pay for creation** and **pay for impact** (funded work).
- Use credit spend as both a monetization system and a product-quality filter against low-value activity.

# In Scope

- **Credits purchase** and **credit balances** for spending.
- A **single wallet** used across launch credit actions.
- **Spend** on game creation.
- **Spend** on raw idea submission.
- **Spend** on funding approved roadmap items.
- **Spend** on creator self-funding of roadmap items.
- **Platform-set credit pricing** for launch actions.
- AI-engine-based variation in roadmap-item funding targets where applicable.
- Revenue from **credit purchases**, **creation spend**, **submission spend**, and **roadmap funding spend**.

# Out of Scope

- Specific price points and package sizes.
- Final accounting, legal, or tax treatment language.

# User Flow

- User buys credits into one shared wallet → user spends credits on creating a game, submitting ideas, or funding roadmap items → creator may also spend credits to self-fund roadmap items → the platform earns revenue as credits are purchased and used throughout the lifecycle of a game.

# Product Rules

- Credits must support **transparent costing** across all launch actions.
- The platform sets the credit cost of launch actions.
- The same wallet should work across creation, idea submission, and roadmap funding.
- Submission fees are part of the product's spam-control model, not just monetization.
- Roadmap-item funding targets can vary based on the selected AI engine and expected implementation cost.
- The product should **not** show users an exact breakdown of why a roadmap item costs a specific number of credits.
- Creator-funded roadmap items and community-backed roadmap items should be **visibly distinguished** in the product.
- Users should not be allowed to start a credit-consuming action unless they have enough credits for it.
- Launch uses a **single credit type** only; there are no promotional or free-credit variants at launch.
- **No signup grant**: new accounts receive 0 credits. Credits exist only via an active subscription or a purchased top-up.

# Wallet Ledger & Transaction Model (launch)

- The wallet is an **append-only ledger**. Balance is derived from the ledger; it is not a mutable counter.
- Every ledger entry has: `user_id`, `amount` (positive credit / negative debit), `type`, `reason`, `ref_type` / `ref_id` (links to the originating entity), `created_at`.
- Ledger entry types at launch:
  - `grant.subscription_monthly` — monthly credits from an active subscription.
  - `grant.topup_purchase` — purchased top-up credits.
  - `hold.funding_pledge` — credits reserved when a user pledges to a roadmap item.
  - `release.funding_pledge_settled` — hold is spent when the item ships.
  - `release.funding_pledge_refunded` — hold is returned as refund credits when the item is canceled/abandoned/fails.
  - `spend.idea_submission` — submission fee.
  - `spend.game_creation` — game creation cost.
  - `adjust.admin` — super-admin manual adjustment (requires reason).
  - `adjust.chargeback` — wallet adjustment following a payment chargeback.
- **Pledged credits** are represented as a `hold.funding_pledge` debit that is pending; the wallet balance shown to users already deducts holds (i.e., pledged credits cannot be spent on something else).
- **Monthly subscription credits** apply as a single `grant.subscription_monthly` entry on each renewal.
- **Insufficient balance** is checked before any credit-consuming action starts; the UI blocks the action and offers either a top-up purchase or a plan upgrade path.

# Refunds, Chargebacks, and Disputes (launch)

- **Automatic credit refund (held pledges)**: whenever a roadmap item is canceled (creator-initiated), fails pipeline after escalation, is removed for policy, or is abandoned under the creator-inactivity rule, every contributor receives a `release.funding_pledge_refunded` entry equal to their original pledge. Refunds are credit-only; no cash refund is issued because no cash was spent on the item yet.
- **Submission fee refunds**: issued only when the platform is at fault — moderation `hold → reject`, creator SLA expiry, confirmed duplicate at creator review.
- **Cash refunds**: not available at launch for credit purchases, top-ups, or subscriptions beyond the standard payment-processor dispute process.
- **Chargebacks** (payment processor dispute after credits have been granted or partially spent):
  - On chargeback, the platform debits the corresponding grant with an `adjust.chargeback` entry.
  - If this produces a negative balance, the account enters **negative-balance hold**: sign-in works, play works, no credit-consuming actions until balance is restored.
  - Repeated chargebacks are a moderation signal (see `moderation-and-trust-safety.md`).

# Frontend Notes

- Product surfaces should clearly show wallet balance, spend actions, funding progress, and confirmation before credit-consuming actions.
- The user should understand when a spend is for **submission**, **creation**, or **roadmap funding**.

# Backend Notes

- Platform services must track wallet balances, spend categories, and pricing rules without defining APIs or schema here.
- The monetization model depends on clear separation between submission spend, creation spend, and roadmap funding spend.

# Technical Notes

- Compliance, fraud, and chargeback handling matter because the platform uses purchased credits across multiple product actions.
- Pricing logic should remain compatible with engine-based funding estimates and future policy controls.

# Edge Cases

- Chargebacks after credits have already been spent.
- Confusion between submission fees and roadmap funding contributions.
- Community-funded items and creator-funded items needing distinct labeling to avoid misleading demand signals.
- Users attempting a credit-requiring action without sufficient balance.

# Open Questions

- No major open questions yet for the launch credit model in this document.

# Suggested Epics

- Define the shared wallet and launch credit actions.
- Define pricing rules for game creation, idea submission, and roadmap funding.
- Define monetization UX for purchase, balance visibility, and spend confirmation.

# Suggested Tickets

- Define the launch list of credit sources and credit spends.
- Define the launch rules for submission-fee messaging and no-refund behavior.
- Define how roadmap-item funding targets are communicated to players and creators.
