# VisualVibe

## What this is

A marketing website for a **web design & development agency based in Antwerp, Belgium**, built on the NOVA Next.js template (`src/features` architecture — see the `nova-nextjs-template` skill for structural conventions: barrel exports, config-driven content, `@/` imports).

The repo currently still contains the template's generic SaaS placeholder content (Nova, "AI-powered platform", pricing tiers, etc. in `src/config/site.config.ts` and `src/features/home/*`). That needs to be replaced with the agency's real copy, services, and case studies as the project is built out.

## Business context

- **Who**: a Belgian web design company, based in Antwerp.
- **Who they serve**: local businesses in Antwerp/Flanders, national clients across Belgium, and some international clients.
- **Languages**: Dutch (primary — Flanders/Antwerp market), French (Wallonia/Brussels), English (international clients + business lingua franca). All three are in scope; NL is the anchor locale for local SEO.
- **Open decision**: i18n routing strategy (e.g. `next-intl` with `/nl`, `/fr`, `/en` locale prefixes, vs. a NL-only site first with FR/EN added later) hasn't been chosen yet — surface this as a real decision when i18n work starts rather than assuming a structure.

## Priorities (in order)

1. **Speed** — this is a web design agency's site; a slow site undermines the pitch. Target strong Core Web Vitals (LCP, INP, CLS). Keep the App Router's server-first rendering, lazy-load below-the-fold sections, keep client bundles (`"use client"`) minimal and scoped to interactive leaves only, optimize images via `next/image`.
2. **Local SEO** — Antwerp/Flanders/Belgium targeting: `LocalBusiness` schema (NAP consistency — Name, Address, Phone), city/region landing pages, Google Business Profile alignment, localized metadata per page.
3. **GEO (Generative Engine Optimization)** — make content easy for AI answer engines (ChatGPT, Perplexity, Google AI Overviews) to parse, cite, and recommend: clear semantic HTML structure, direct-answer paragraphs near the top of key pages, FAQ blocks with structured `FAQPage` schema, consistent factual claims (services, location, pricing model) repeated verbatim across pages rather than reworded, descriptive headings that double as question phrasing.
4. **Navigation simplicity** — flat nav, no more than 5–6 top-level items, obvious path from any page to Contact/Quote.

## Conventions

- Follow the `nova-nextjs-template` skill for all structural work: two-hop barrel exports (`features/<page>/index.ts` → `features/index.ts`), config-driven copy (`config/<feature>.config.ts`), `@/` alias imports only, `"use client"` on any file using `framer-motion`, hooks, or handlers.
- Reuse `src/components/ui/` primitives (Button, Accordion, Tabs, etc.) instead of rebuilding them.
- Theme colors go through the CSS variables in `src/app/globals.css` — no raw hex values in components.

## Content/SEO conventions (project-specific, in addition to the skill)

- Every page needs: a unique `<title>` and meta description mentioning Antwerp/Belgium where relevant, one `<h1>`, `LocalBusiness`/`Organization`/`FAQPage`/`Article` JSON-LD as applicable (via Next.js `generateMetadata` + a schema helper — not yet built).
- Blog posts live under a `blog` feature/route with per-post metadata (title, description, date, author, canonical URL) — structure TBD when the blog is built.
- Avoid stock-SaaS language ("AI-powered", "boost productivity") left over from the template — replace with concrete, local, agency-specific copy.
