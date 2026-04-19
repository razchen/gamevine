# Subscriptions, Pricing, and Credit Value

# Summary

- This document defines how Gamevine.ai packages its commercial model for launch.
- It covers how users buy access and credits, how value is explained, and how subscriptions relate to the existing credit-based product loop.
- At launch, Gamevine.ai should use a **subscription-plus-credits** model: the game is free to play, but paid participation and creation rights are gated through subscription tiers that include monthly credits.

# Goals

- Define a clear launch commercial model that supports both game creation and ongoing game evolution.
- Explain how credits map to user value without turning this spec into a final pricing sheet.
- Clarify whether subscriptions exist at launch and what they unlock if they do.
- Make the commercial model easy to understand: free to play, paid to participate, and paid more deeply to create.

# In Scope

- Launch packaging for credits, bundles, and commercial offers.
- The relationship between **subscriptions**, **credit purchases**, and core product actions.
- How users should understand the value of spending credits on creation, idea submission, and roadmap funding.
- High-level launch pricing structure and merchandising surfaces.
- A launch tier model where subscriptions determine which kinds of paid participation are allowed.
- Recommended launch subscription ladder:
  - **Free**: `$0/month`, play only, no paid participation actions.
  - **Supporter**: `$9/month`, `250,000 monthly credits`, can submit ideas/bug fixes and fund roadmap items.
  - **Creator**: `$29/month`, `1,500,000 monthly credits`, unlocks creator rights and creator actions.
  - **Creator Pro**: `$79/month`, `5,000,000 monthly credits`, same creator rights with a larger monthly credit pool.
- Recommended launch top-up packages for active subscribers:
  - `250,000 credits` for `$10`
  - `1,500,000 credits` for `$45`
  - `5,000,000 credits` for `$120`
- Recommended action-value examples for launch messaging:
  - Raw idea submission: `10,000 credits`
  - Bug-fix submission: `10,000 credits`
  - Creator roadmap-item creation: `0 credits`
  - Typical minimum funding contribution: `5,000 credits`
  - New game creation from a template: `1,000,000 credits`
  - Small roadmap item target: roughly `150,000-400,000 credits`
  - Medium roadmap item target: roughly `500,000-1,500,000 credits`

# Out of Scope

- Taxes, regional pricing, annual billing, or accounting treatment.
- Payment processor implementation details.
- Discount campaigns, promos, affiliate programs, or enterprise/commercial expansion ideas.

# User Flow

- User lands on a pricing/commercial surface → understands that play is free but participation is subscription-gated → chooses a subscription tier → receives monthly credits and the rights associated with that tier → spends credits on the actions allowed by that subscription level.

# Product Rules

- The commercial model must stay easy to understand at launch.
- Credit value should be explained in terms of **what users can do**, not with low-level cost breakdowns.
- Subscriptions should have a clear relationship to credits rather than creating a second confusing economy.
- Commercial packaging should reinforce the core loop: **create a game → submit ideas → fund roadmap items → ship updates**.
- **Playing games is free** at launch.
- **Paid participation is subscription-gated** at launch; non-subscribers can play but cannot use credit-consuming participation features.
- All subscription tiers should include **monthly credits**, with higher tiers including larger monthly credit amounts.
- The first paid tier should unlock **idea submission**, **bug-fix submission**, and **funding of roadmap items**.
- Creator tiers should unlock **creator rights**, including game creation and creator-specific product actions.
- Higher creator plans should keep creator rights but provide **more monthly credits**.
- Subscription benefits should include **lower fees** for idea submission and roadmap funding.
- Creating a roadmap item should not consume credits by itself; credits are spent on **raw idea submission** and on **funding**.
- Recommended launch discount model:
  - **Supporter**: no discount beyond included credits
  - **Creator**: `10%` lower fees on idea submission and roadmap funding
  - **Creator Pro**: `20%` lower fees on idea submission and roadmap funding
- Credit value should be explained with **mixed framing**: what users can do with credits and what different plans/packages are good for.
- Included monthly credits should **reset each billing cycle** and should **not roll over** at launch.
- Purchased top-up credits should remain in the wallet, but spending them still requires an **active subscription**.
- No annual plans should exist at launch; keep the launch commercial model monthly and simple.

# Frontend Notes

- Product surfaces should explain the difference between subscription benefits and credit spend.
- Pricing copy should make it obvious what credits are used for and what is included in any recurring plan.
- Pricing surfaces should make the launch tier ladder clear: free play, participation tier, and creator tier(s).
- The product should clearly explain which actions are unavailable without a subscription.
- Pricing pages should show both **tier comparison** and **credit-action examples** so users can reason about value quickly.

# Backend Notes

- The commercial model will eventually need entitlements, billing state, and wallet coordination, but not in implementation detail here.
- Subscription state and monthly credit allocation will need to stay aligned with wallet behavior and permission gating.

# Technical Notes

- This spec should stay focused on commercial behavior and value framing, not billing architecture.

# Edge Cases

- Users not understanding the difference between subscriptions and credits.
- Users subscribing for access but still lacking enough credits for a desired action.
- Value confusion when different AI engines lead to different credit targets.
- Users misunderstanding the difference between the supporter tier and creator tiers.
- Users canceling a subscription while still holding purchased top-up credits.

# Open Questions

- How hard should the product push upgrades from **Supporter** to **Creator** when a user tries to start game creation?
- Should there be any credit gifting or creator sponsorship mechanics later, or stay strictly direct purchase only?

# Suggested Epics

- Define the launch commercial model for subscriptions and credits.
- Define how pricing/value is presented across public and in-app surfaces.
- Define the relationship between recurring access and credit-based actions.
- Define the launch subscription tier ladder and the rights unlocked by each tier.

# Suggested Tickets

- Define the launch subscription tiers: `Free`, `Supporter`, `Creator`, and `Creator Pro`.
- Define the monthly credit reset behavior and lower-fee benefits by tier.
- Define the launch top-up credit packages for active subscribers.
- Define how the product explains credit value to creators and players.
