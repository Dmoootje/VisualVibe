# Tools & SEO/GEO Checklist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scalable VisualVibe Tools navigation area with a website-analysis entry and an interactive SEO/GEO checklist that can be downloaded as a branded PDF.

**Architecture:** Keep tool definitions and checklist content data-driven in `src/data/tools.ts`. Wire the existing custom header menu to a new Tools mega-menu and mobile drawer panel. Add one tools hub page, one checklist page, one client checklist component, and one PDF API route.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind, `@react-pdf/renderer`, Vitest, existing VisualVibe nav components.

## Global Constraints

- Do not move `/website-analyse/`; it stays the canonical analysis route.
- New public checklist route: `/tools/seo-geo-checklist/`.
- New hub route: `/tools/`.
- Keep the design in VisualVibe dark/orange/green branding.
- Do not stage or commit unrelated local changes: `public/image.jpg` and `storage.rules`.
- Use existing dependencies only.

---

### Task 1: Shared tool and checklist data

**Files:**
- Create: `src/data/tools.ts`
- Test: `src/data/tools.test.ts`

**Interfaces:**
- Produces: `toolCards`, `seoGeoChecklistCategories`, `getSeoGeoChecklistItemCount()`, `getSeoGeoChecklistItemsById(ids: string[])`

- [ ] Write failing tests that expect exactly two initial tools and at least 24 checklist items across SEO, GEO, performance, schema, content and local categories.
- [ ] Implement the data file with typed cards and checklist categories.
- [ ] Run `npm test -- src/data/tools.test.ts`.

### Task 2: Tools navigation

**Files:**
- Modify: `src/components/nav/navData.ts`
- Modify: `src/layouts/Header/index.tsx`
- Modify: `src/components/nav/Nav.tsx`
- Modify: `src/components/nav/nav-icons.tsx`
- Test: `src/components/nav/navData.test.ts`

**Interfaces:**
- Consumes: `toolCards` from `src/data/tools.ts`
- Produces: desktop Tools mega-menu and mobile Tools panel

- [ ] Write failing tests that `toolCards` contains Website analyse and SEO/GEO checklist links.
- [ ] Add Tools to desktop between Sectoren and Kennisbank.
- [ ] Add Tools to the mobile drawer root and a Tools panel.
- [ ] Use a right-side visual preview instead of subdienst links.
- [ ] Run `npm test -- src/components/nav/navData.test.ts`.

### Task 3: Tools hub and checklist page

**Files:**
- Create: `src/app/[locale]/(site)/tools/page.tsx`
- Create: `src/app/[locale]/(site)/tools/page.test.tsx`
- Create: `src/app/[locale]/(site)/tools/seo-geo-checklist/page.tsx`
- Create: `src/app/[locale]/(site)/tools/seo-geo-checklist/page.test.tsx`
- Create: `src/components/tools/SeoGeoChecklist.tsx`

**Interfaces:**
- Consumes: `toolCards`, `seoGeoChecklistCategories`

- [ ] Write failing page tests for indexable metadata and visible copy.
- [ ] Implement the hub page with cards linking to both tools.
- [ ] Implement the checklist page with visible categories and a client-side checklist component.
- [ ] Run both page tests.

### Task 4: Branded PDF download

**Files:**
- Create: `src/app/api/tools/seo-geo-checklist/pdf/route.tsx`
- Create: `src/app/api/tools/seo-geo-checklist/pdf/route.test.tsx`

**Interfaces:**
- Consumes: `getSeoGeoChecklistItemsById(ids)`
- Produces: POST endpoint returning `application/pdf`

- [ ] Write failing API route tests for PDF content type and invalid payload handling.
- [ ] Implement branded PDF generation with VisualVibe title, selected items, date, website and copyright footer.
- [ ] Run the route tests.

### Task 5: Full verification

- [ ] Run `npm test`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Commit only the files touched by this feature.
