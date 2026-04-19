# Public Site and Static Pages

# Summary

- This document defines the public-facing, mostly static pages that explain Gamevine.ai before a user is deep in the product.
- These pages support acquisition, trust, education, and conversion for both players and creators.
- At launch, the public site should be **lean**: enough to explain the product, establish trust, and move visitors into sign-up or browsing without a large marketing-site footprint.

# Goals

- Give new visitors a clear understanding of what Gamevine.ai is and how it works.
- Explain unusual product concepts like **templates**, **credits**, **raw ideas**, and **roadmap items** in simple language.
- Provide the minimum public information needed for trust, support, and conversion at launch.
- Keep the number of public pages small so launch content stays focused and maintainable.

# In Scope

- **Home page** and core public landing experience.
- Public explanatory pages such as **How It Works**, **FAQ**, and **Pricing**.
- Public trust/support/legal-style informational surfaces needed at launch.
- Static or mostly static content that does not require deep in-app state to be useful.
- Recommended lean launch page set:
  - **Home**
  - **How It Works**
  - **Pricing**
  - **FAQ**
  - **Contact / Support**
  - **Terms**
  - **Privacy**

# Out of Scope

- Deep signed-in product workflows.
- Creator dashboards, wallet management, roadmap management, and other app-internal surfaces.
- Final marketing copy and SEO implementation details.

# User Flow

- Visitor lands on the home page → understands the product concept → explores supporting pages like How It Works / FAQ / Pricing → decides to sign up, browse games, or learn more.

# Product Rules

- Public pages should explain the product clearly without assuming prior knowledge of AI game-building workflows.
- Public pages should set correct launch expectations about product scope and constraints.
- Public pages should reinforce trust by explaining how Gamevine.ai handles credits, roadmap funding, and AI-generated updates at a high level.
- The public site should stay **lean** at launch rather than trying to cover every possible marketing/support surface.
- The **Home** page should explain what Gamevine.ai is, who it is for, and what makes it different.
- **How It Works** should explain the core loop: template game creation, idea submission, creator approval, roadmap funding, AI updates, and releases.
- **Pricing** should explain the subscription ladder, monthly credits, and top-up credits at a high level.
- **FAQ** should answer the most confusing launch questions around game scope, credits, subscriptions, roadmap items, and AI updates.
- **Contact / Support**, **Terms**, and **Privacy** should exist on day one as the minimum trust/support/legal set.

# Per-Page Required Sections (launch)

## Home (`/`)

- Hero: product one-liner, primary CTA ("Start playing" → `/browse`), secondary CTA ("Start creating" → `/pricing#creator`).
- "How it works" summary (3 steps: play → fund → AI ships updates) with a link to `/how-it-works`.
- Featured / new games carousel (drawn from the same backend feed as `/browse`).
- Creator callout ("Turn a template into a live, evolving game") with link to pricing.
- Footer: legal, contact, social, version tag.

## How It Works (`/how-it-works`)

- The core loop in five sections: **templates**, **creator approval**, **raw ideas**, **funding**, **AI updates**.
- One short explainer per section (≤ 150 words), each with one illustrative diagram/screenshot placeholder.
- Template gallery preview with names of the 10 launch templates and a link to sign up to create from one.
- FAQ link.

## Pricing (`/pricing`)

- Tier ladder (Free / Supporter / Creator / Creator Pro) as cards, matching `subscriptions-pricing-and-credit-value.md`.
- Credit-action examples table (same doc).
- Top-up packages table.
- "What credits are used for" plain-language block.
- FAQ block focused on pricing/billing.
- Primary CTA on each paid tier ("Subscribe").

## FAQ (`/faq`)

- Grouped by: About Gamevine, Playing, Creating, Credits & Subscriptions, Updates & AI, Safety & Trust.
- Each group opens with the 3–5 highest-intent questions at launch.

## Contact / Support (`/support`)

- Support email (`support@gamevine.ai`), DMCA contact alias (`dmca@gamevine.ai`), expected response SLA (launch: 3 business days).
- Link to status page (stub at launch).
- A minimal contact form posting to the support inbox.

## Terms (`/terms`) and Privacy (`/privacy`)

- Standard boilerplate plus Gamevine-specific clauses about credit ownership (credits are licenses, not property), AI-generated content (creator ownership of output), refund/dispute stance (see `credits-and-monetization.md`), and data handling (see data export / deletion in `account-and-settings.md`).

# SEO Floor (launch)

- Every page ships with a non-default `<title>` and `<meta name="description">`.
- Open Graph tags on every public page: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- Twitter card tags (`summary_large_image`).
- `/sitemap.xml` auto-generated from public routes (home, how-it-works, pricing, faq, support, terms, privacy, and every published game detail page).
- `/robots.txt` allowing all public routes, disallowing `/admin`, `/api`, `/my-games`, `/wallet`, `/inbox`, `/settings`.
- Canonical URLs on every page.
- JSON-LD on `/game/<slug>`: `VideoGame` schema with name, description, creator handle, and cover image.

# Browse Gating

- `/browse` and `/game/<slug>` are **public** (visitors can view without signing in).
- `/play/<slug>` is **public** (playing a game does not require an account).
- Any action that produces state (submit idea, fund, follow, report) requires sign-in.

# Frontend Notes

- The public site should have a clear navigation model for home, explanatory pages, pricing, FAQ, and support/trust pages.
- Public pages should separate **marketing/explainer content** from **signed-in app actions**.
- Public navigation should stay small and obvious: Home, How It Works, Pricing, FAQ, and Support.

# Backend Notes

- Public pages may need lightweight dynamic data later, but this spec treats them primarily as product surfaces, not system implementation details.

# Technical Notes

- This spec covers what public pages exist and what they must communicate, not how they are rendered or fetched.

# Edge Cases

- Visitors misunderstanding whether the product is for giant AI-generated games versus small evolving browser games.
- Public confusion around credits, subscriptions, and roadmap funding.
- Public pages overpromising capabilities that the launch product does not support.
- Visitors landing on Pricing before understanding the product and misunderstanding what subscriptions unlock.

# Resolved Questions

- **Home sections**: listed above under "Per-Page Required Sections (launch) → Home".
- **Browse gating**: browse and play are public; the public site links to `/browse` directly from Home.
- **Contact vs Support**: one page (`/support`) at launch, combining contact form, DMCA alias, and status link.

# Suggested Epics

- Define the launch public site page set and navigation.
- Define the core explanatory content for the Gamevine.ai concept.
- Define the launch trust/support information surfaces.
- Define the lean launch Home / How It Works / Pricing / FAQ information architecture.

# Suggested Tickets

- Define the launch home page purpose and required sections.
- Define the launch FAQ / How It Works / Pricing page expectations.
- Define the minimum trust, support, and legal public pages for launch.
- Define the lean public navigation and page hierarchy.
