# English Publication Link Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the 44 remaining English publication audit findings to zero and remove the shared visible-copy leaks found in visual QA.

**Architecture:** Canonicalize authored knowledge-base links through stable service/software IDs, fix route-specific links at their owning render boundary, and localize shared chrome through locale-specific data builders. Keep the route-audit and shared-copy file sets separate until both focused suites are green.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, next-intl, Vitest, MDX.

## Global Constraints

- Preserve Dutch output and existing stable business IDs.
- English next-intl links receive locale-relative paths without `/en` or `/be` prefixes.
- Do not add redirects to conceal incorrect internal links.
- Do not push or open a pull request.

---

### Task 1: Canonical knowledge-base aliases

**Files:**
- Modify: `src/lib/kennisbank/publicLinks.ts`
- Modify: `src/components/blog/articleLinkBlocksEnglish.test.tsx`

**Interfaces:**
- Consumes: `normalizeKnowledgeBaseHref(href, locale)` and stable service/software registries.
- Produces: canonical locale-relative English links or `null` for omitted Dutch-only destinations.

- [ ] Add failing cases for the exact service, software, and article aliases from the production crawl.
- [ ] Run `npm test -- --run src/components/blog/articleLinkBlocksEnglish.test.tsx` and confirm the new assertions fail.
- [ ] Add minimal alias-to-stable-ID mappings and the single article-path alias.
- [ ] Rerun the focused test and confirm it passes.
- [ ] Commit the resolver and regression together.

### Task 2: Route-owned English links

**Files:**
- Modify: `src/data/locales/en/regions.ts`
- Modify: `src/app/[locale]/(site)/regio/[slug]/page.tsx`
- Modify: `src/app/[locale]/(site)/diensten/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/applicaties/[slug]/page.tsx`
- Modify: `src/app/[locale]/(site)/website-analyse/page.tsx`
- Modify: `src/app/[locale]/(site)/over-ons/page.tsx`
- Test: existing co-located English route tests plus a focused release-links regression.

**Interfaces:**
- Consumes: next-intl locale-relative links and localized region/application data.
- Produces: self-canonical English destinations with no same-site `/be/` links.

- [ ] Write failing rendered assertions for quotation, services, application, analysis, and WeddingVibe destinations.
- [ ] Run only the affected route tests and confirm RED.
- [ ] Apply the minimum locale-aware paths at each owning boundary.
- [ ] Rerun the focused route tests and typecheck.
- [ ] Commit the route fixes.

### Task 3: Shared visible English copy

**Files:**
- Modify: shared navigation data and header wiring.
- Modify: shared region cards, breadcrumb shells, footer address display, sector CTA/card labels, contact and drone-case labels.
- Test: focused shared-chrome and visible-copy render tests.

**Interfaces:**
- Consumes: stable localized category, sector, tool, and knowledge-base data.
- Produces: English names, descriptions, locale-relative hrefs, and accessibility labels while keeping Dutch unchanged.

- [ ] Reproduce the visual-review strings in focused render tests.
- [ ] Build locale-specific card collections from stable registries.
- [ ] Pass locale through shared label components and localize small copy at render boundaries.
- [ ] Run focused tests, typecheck, and lint.
- [ ] Commit the shared-copy change set.

### Task 4: Production verification

**Files:**
- Modify: `docs/localization/english-publication-release-report.md`
- Modify: `.superpowers/sdd/task-5-report.md`

**Interfaces:**
- Consumes: combined committed HEAD.
- Produces: a fresh production artifact, zero-issue crawl evidence, and durable release reporting.

- [ ] Run the focused suites and `npm run typecheck`.
- [ ] Run `npm run lint` and confirm zero errors with only the six known warnings.
- [ ] Run `npm run build` and confirm 374 of 374 static pages.
- [ ] Restart port 3210 from the fresh artifact.
- [ ] Run `npm run audit:english-publication` and require exit 0 with 170 of 170 URLs crawled and zero issues.
- [ ] Record all evidence and commit the release reports.
