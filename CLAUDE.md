# VisualVibe

## What this is

A marketing website for **VisualVibe, a creative media agency based in Limburg, Belgium** — webdesign, SEO, fotografie, videografie, drone/FPV, 3D/VR/AR, and podcasting, not a web-design-only shop. Built on the NOVA Next.js template (`src/features` architecture — see the `nova-nextjs-template` skill for structural conventions: barrel exports, config-driven content, `@/` imports).

The full content/route structure (services, subservices, regions, sectors, case studies, kennisbank/blog pillars, data models) is specified in [`docs/content-blueprint.md`](docs/content-blueprint.md) — read that before adding a new page type or section. It also flags where its suggested architecture (flat `components/sections/`, `src/data/`) needs reconciling against this repo's actual NOVA conventions (see Conventions below) rather than introducing a second competing structure.

The repo currently still contains some of the template's generic SaaS placeholder content (pricing tiers, integrations logos, etc. in `src/features/home/*`) that doesn't fit a media agency and needs replacing/removing as Fase 1 of the blueprint is implemented.

## Business context

- **Who**: VisualVibe, a creative media agency headquartered in **Limburg** (Hasselt-area placeholder address in `business.config.ts` — replace with the real address).
- **Home region**: Limburg (detailed city-level pages: Hasselt, Genk, Bilzen-Hoeselt, Tongeren-Borgloon, Sint-Truiden, Maasmechelen, Lanaken, Diepenbeek, Beringen, Houthalen-Helchteren, Lommel, Pelt).
- **Expansion regions**: Vlaanderen, Antwerpen, Nederlands-Limburg (Maastricht, Sittard-Geleen, Heerlen, Roermond, Venlo, Weert, Valkenburg) — regio hubs first, city pages only added once unique content/cases justify them (never thin duplicate location pages).
- **Services**: webdesign, SEO (incl. lokale SEO, technische SEO, AI SEO/AEO/GEO), fotografie, videografie, drone/FPV, 3D/VR/AR, podcasting, masterclasses — each with subservices, see the blueprint.
- **Sectors served**: KMO, bouw-renovatie, horeca, vastgoed/immo, retail/webshops, events, sportclubs, opleidingen/masterclasses, wellness/beauty, industrie.
- **Languages**: Dutch (primary, already wired via `next-intl` with `nl` as the unprefixed default), French (`/fr`), English (`/en`).

## Priorities (in order)

1. **Speed** — strong Core Web Vitals (LCP, INP, CLS). Server-first rendering, lazy-load below-the-fold sections, minimal scoped `"use client"`, `next/image` everywhere.
2. **Local SEO** — Limburg-first, then Vlaanderen/Antwerpen/Nederlands-Limburg: `LocalBusiness` schema (NAP via `business.config.ts`), regio/stad hub pages (not thin duplicate city pages — see blueprint's "Belangrijke SEO-waarschuwing"), Google Business Profile alignment, localized metadata per page.
3. **GEO (Generative Engine Optimization)** — content easy for AI answer engines to parse/cite: direct-answer paragraphs near the top, `FAQPage` schema, consistent factual claims repeated verbatim across pages, descriptive question-phrased headings. The blueprint's own kennisbank pillar 2 (`wat-is-aeo`, `wat-is-geo-generative-engine-optimization`) is itself a GEO play — VisualVibe writing about AEO/GEO is a genuine differentiator.
4. **Navigation simplicity** — top nav: Home, Diensten, Realisaties, Sectoren, Regio, Kennisbank, Over ons, Contact, with an "Offerte aanvragen" CTA button — per the blueprint, not the original 5–6-item flat nav assumption.
5. **Strong internal linking** — every dienst/regio/sector/case/kennisbank page follows the blueprint's internal-link rules (dienst → subdiensten/regio's/cases/blog/contact, blog → dienst/regio/case/contact, etc.) — this is core to the SEO strategy, not optional polish.

## Conventions

- Follow the `nova-nextjs-template` skill for structural work: two-hop barrel exports (`features/<page>/index.ts` → `features/index.ts`), config-driven copy, `@/` alias imports only, `"use client"` on any file using `framer-motion`, hooks, or handlers.
- **Blueprint content vs. NOVA features**: the blueprint's `src/data/*.ts` (services, regions, sectors, cases, blog) hold the structured content behind *dynamic* routes (`/diensten/[slug]`, `/regio/[slug]`, etc.) shared across hub + detail + related-links everywhere — that's a deliberate, documented exception to "content lives in a feature's `config/`", since this content isn't scoped to one static feature. Page *composition* (hero, grids, sections) still follows NOVA's feature/barrel pattern where the page is a fixed static composition (e.g. the homepage); genuinely dynamic per-slug detail pages compose directly from `src/data/` + shared presentational components instead of a per-slug feature folder.
- Reuse `src/components/ui/` primitives instead of rebuilding them.
- Theme colors go through the CSS variables in `src/app/globals.css` — no raw hex values in components.
- All routes live under `src/app/[locale]/...` (next-intl); `/nl` is unprefixed (default), `/fr` and `/en` are prefixed.

## Hard rules (never break)

- **No images in the repo.** All content/blog images live in Firebase object storage (the VisualVibe bucket) and are referenced by URL. The only image files allowed in `public/` are the site logo(s) and the favicon. Never add `.webp`/`.png`/`.jpg` content images to the repo.
- **Never use a long dash** (em dash or en dash) in any text: copy, headings, MDX content, code comments, commit messages, or replies. Use a normal hyphen `-`, a comma, or rewrite the sentence.
- **Never start a paragraph with a space.** No leading whitespace on paragraphs in MDX/markdown content or copy.

## Content/SEO conventions

- Every page: unique title/description (55–60 / 150–160 chars per the blueprint), one `<h1>`, canonical, OpenGraph, and `LocalBusiness`/`Organization`/`FAQPage`/`Article`/`BreadcrumbList` JSON-LD as applicable via `src/components/seo/*`.
- Never build thin, near-duplicate city pages "for SEO" — regio hubs first, city pages only with genuinely unique content/cases (blueprint's explicit warning).
- Avoid stock-SaaS language ("AI-powered", "boost productivity") left over from the template — replace with concrete, Limburg/media-agency-specific copy.
