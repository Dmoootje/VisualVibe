# Author meta contrast and application case schema design

Date: 2026-07-15
Status: approved
Repository branch: `fix/contrast-and-application-schema`

## Goal

Resolve two VisualVibe quality issues without changing page content or layout:

1. Make the shared author name and reading time pass WCAG AA contrast requirements.
2. Describe application portfolio pages as bespoke project cases instead of products offered for sale.

## Current behavior and root causes

### Author metadata

`ServiceRelatedPosts` renders the author and reading time through one shared `AuthorMeta` component. Its inherited `text-white/40` color produces about 3.8:1 contrast on the dark cards. Small text requires at least 4.5:1, so Lighthouse reports both the author name and reading time.

### Application case schema

Every application detail page uses the same route template and currently emits `SoftwareApplication` JSON-LD. Google requires a real `offers.price` plus a rating or review of that specific app for Software App rich-result eligibility.

The current fallback marks each bespoke platform as free and attaches VisualVibe's company rating to the client platform. That does not match the visible page or the entity being reviewed. All application works are bespoke client projects, not publicly offered software products.

Relevant primary guidance:

- https://developers.google.com/search/docs/appearance/structured-data/software-app
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://schema.org/WebPage
- https://schema.org/CreativeWork

## Chosen design

### Contrast

Change the shared `AuthorMeta` foreground from `text-white/40` to `text-white/65`. On the card's dark background this provides roughly 8.2:1 contrast while keeping the metadata visually secondary to the article title and call to action.

The avatar, icon, spacing, type size and responsive layout remain unchanged. Because every affected service and realization page consumes the same component, one change covers the full repeated block.

### Structured data

Replace the page-specific `SoftwareApplication` object with a `WebPage` object whose `mainEntity` is a `CreativeWork` representing the bespoke software project.

The `WebPage` contains:

- identifier `${canonical}#webpage` and the canonical URL;
- `project.seoTitle` as name and `project.seoDescription` as description;
- `nl-BE` language;
- links to the existing `#website` and `#organization` entities;
- the cover as the primary image when available;
- the project as its main entity.

The nested `CreativeWork` contains:

- identifier `${canonical}#project`;
- project name and description;
- VisualVibe as creator;
- genre `Maatwerk softwareproject`;
- lifecycle status `Published` for live projects and `In development` otherwise;
- project capabilities as keywords;
- the cover image when available.

Remove the fake zero-price offer, the unrelated VisualVibe aggregate rating and the `getGoogleRatingSummary` request from application detail pages. The Google reviews integration remains unchanged everywhere it is legitimately used for VisualVibe itself.

## Architecture and interfaces

Create a pure schema builder in `src/lib/seo/applicationCaseJsonLd.ts`. It accepts the existing `ApplicationCase`, canonical URL and optional cover image, and returns the complete page JSON-LD object. The route component only fetches its project and images, calls the builder and passes the result to `JsonLd`.

Keep the author metadata component in `ServiceRelatedPosts.tsx`. Export it as a reusable named component so the rendered accessibility behavior can be covered without mocking the full Firestore-backed section.

No Firestore schema, stored application data, public route, canonical URL or visible copy changes.

## Validation and regression coverage

### Contrast test

Render `AuthorMeta` with an author and reading time, then verify that the shared wrapper contains `text-white/65` and no longer contains `text-white/40`.

### Schema test

Build JSON-LD for an application fixture and verify:

- the root type is `WebPage`;
- `mainEntity` is `CreativeWork`;
- project facts and cover are retained;
- `SoftwareApplication`, `offers` and `aggregateRating` do not appear;
- no Google rating is required to build the schema.

Run the focused regressions, full Vitest suite, TypeScript check, lint and production build. After deployment, recheck the live HTML and request a fresh crawl because external audit tools can retain results from before the new markup was published.

## Non-goals

- Do not invent pricing, availability, testimonials or app reviews.
- Do not redesign the cards or application pages.
- Do not change unrelated low-contrast text in other components.
- Do not modify Google review behavior outside application detail pages.
