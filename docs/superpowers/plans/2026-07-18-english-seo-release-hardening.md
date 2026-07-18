# English SEO Release Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the remaining Dutch leaks and structured-data inconsistencies from the published English surface while keeping every live Dutch canonical page discoverable.

**Architecture:** Keep `publicPageInventory.ts` as the canonical registry for static public routes and expose a localized view-model helper for the human sitemap. Route components must always pass their active locale to structured-data components; a rendered audit provides the cross-route safety net. Exact redirects handle the two intentionally untranslated English URLs without introducing a broad English redirect.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Vitest, Next MetadataRoute sitemap, JSON-LD.

## Global Constraints

- English public routes must render directly except for the two explicitly untranslated exact URLs.
- Stable Dutch content IDs remain form values; only visitor-facing labels are localized.
- Dutch-only WeddingVibe and AI-feature pages remain in XML sitemap and IndexNow without fabricated English hreflang partners.
- The visible English sitemap must be generated from the same public route inventory and knowledge-base content used by the XML sitemap.
- Every English BreadcrumbList URL must use the `/en/` namespace and localized slugs.

---

### Task 1: Exact untranslated-route redirects and localized lead form

**Files:**
- Modify: `next.config.js`
- Modify: `src/components/forms/LeadForm.tsx`
- Create: `src/components/forms/LeadForm.locale.test.tsx`
- Modify: `src/i18n/englishPublicRoutes.test.ts`
- Modify: `src/middleware.test.ts`
- Modify: `scripts/audit-english-copy.mjs`
- Modify: `scripts/audit-english-copy.test.mjs`

**Interfaces:**
- Consumes: `getLocalizedRegionById(id, locale)` from `src/data/regions.ts`.
- Produces: exact permanent redirects and English option labels with unchanged option values.

- [x] **Step 1: Write failing tests for both exact redirects and all four English region labels.**
- [x] **Step 2: Run the focused tests and verify failures report missing redirects and Dutch labels.**
- [x] **Step 3: Add the exact redirects and derive form labels from stable region IDs.**
- [x] **Step 4: Add the rendered-copy audit rule for Dutch region option text and verify 16 focused tests pass.**
- [ ] **Step 5: Commit with the remaining release-hardening changes after full verification.**

### Task 2: Locale-safe breadcrumb and service structured data

**Files:**
- Modify: `src/app/[locale]/(site)/sectoren/page.tsx`
- Modify: `src/app/[locale]/(site)/sectoren/[slug]/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/[category]/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/applicaties/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/applicaties/[slug]/page.tsx`
- Modify: `src/app/[locale]/(site)/privacy/page.tsx`
- Modify: `src/app/[locale]/(site)/cookies/page.tsx`
- Modify: `src/app/[locale]/(site)/sectoren/sectorRoutesEnglish.test.tsx`
- Modify: `scripts/audit-english-copy.mjs`
- Modify: `scripts/audit-english-copy.test.mjs`

**Interfaces:**
- Consumes: the route `locale`, plus localized breadcrumb names and paths already computed by each route.
- Produces: `BreadcrumbJsonLd locale={locale}` and `ServiceJsonLd locale={locale}` on every bilingual caller.

- [ ] **Step 1: Extend rendered route tests to capture structured-data locale and English audience copy.**
- [ ] **Step 2: Extend the rendered audit fixture to reject `/be/` BreadcrumbList items on English HTML.**
- [ ] **Step 3: Run focused tests and verify they fail on omitted locale props.**
- [ ] **Step 4: Pass the active locale at each listed caller and preserve localized paths.**
- [ ] **Step 5: Re-run focused route and audit tests until green.**

### Task 3: Restore Dutch-only sitemap inventory

**Files:**
- Modify: `src/lib/seo/publicPageInventory.ts`
- Modify: `src/lib/seo/publicPageInventory.test.ts`
- Modify: `src/lib/seo/siteUrls.publication.test.ts`

**Interfaces:**
- Consumes: `PublicRoutePair` with optional `en` and `publicRouteEntries()` filtering by locale.
- Produces: `{ nl: "/trouwfotograaf-limburg/" }` and `{ nl: "/diensten/webdesign/website-met-ai-functionaliteiten/" }` entries without English alternates.

- [ ] **Step 1: Change inventory tests to require both Dutch-only routes and exclude only their English variants.**
- [ ] **Step 2: Add sitemap assertions for both `/be/` targets and absence of `/en/` counterparts.**
- [ ] **Step 3: Run focused tests and verify the Dutch URLs are missing.**
- [ ] **Step 4: Add both Dutch-only entries to `coreRoutePairs` through a dedicated `dutchOnlyRoutes` collection.**
- [ ] **Step 5: Re-run inventory and publication tests until green.**

### Task 4: Inventory-backed visible English sitemap

**Files:**
- Modify: `src/lib/seo/publicPageInventory.ts`
- Modify: `src/app/[locale]/(site)/sitemap/page.tsx`
- Create or modify: `src/app/[locale]/(site)/sitemap/sitemapPageEnglish.test.tsx`

**Interfaces:**
- Consumes: localized public route pairs, published application cases, English knowledge-base categories and posts.
- Produces: a reusable English sitemap section builder whose flattened href set equals the English XML sitemap path set.

- [ ] **Step 1: Add a test that renders the English sitemap, extracts all `/en/` hrefs, and compares them to English `getSitemapEntries()` paths.**
- [ ] **Step 2: Add representative assertions for services, regions, sectors, realisations, applications, knowledge-base categories, and articles.**
- [ ] **Step 3: Run the test and verify the existing nine-link hardcoded branch fails.**
- [ ] **Step 4: Build English section nodes from stable localized data and the same published dynamic inputs as `getSitemapEntries()`.**
- [ ] **Step 5: Render the total from the recursively flattened unique node set and re-run tests until green.**

### Task 5: Release verification and alias inventory

**Files:**
- Modify only if an additional public Dutch-content or public-namespace alias blocker is proven.

**Interfaces:**
- Consumes: production build output on `127.0.0.1:3210`.
- Produces: fresh test, type, lint, build, HTTP, copy, publication, structured-data, and visible-sitemap evidence.

- [ ] **Step 1: Run the full Vitest suite and require zero failures.**
- [ ] **Step 2: Run typecheck and lint; require zero errors and document only baseline warnings.**
- [ ] **Step 3: Build and start the production server on port 3210.**
- [ ] **Step 4: Verify both exact redirects, English form labels, representative BreadcrumbList and Service JSON-LD, XML route membership, and visible/XML English sitemap parity over HTTP.**
- [ ] **Step 5: Probe the four internal alias destinations and record status, canonical, sitemap membership, and internal-link reachability; redirect only any newly proven blocking public surface.**
- [ ] **Step 6: Run English publication and copy audits against the fresh server, then commit the verified changes.**
