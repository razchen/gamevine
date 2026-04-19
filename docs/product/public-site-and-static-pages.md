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

# Open Questions

- What exact sections should appear on the launch Home page?
- Should **browse games** be linked directly from the public site, or should the public site primarily drive sign-up first?
- Should Contact and Support be one page at launch or separate surfaces later?

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
