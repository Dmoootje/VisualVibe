# English Publication Link Cleanup Design

## Goal

Make the English publication audit pass with zero link, locale, or canonical issues while preserving the existing Dutch publication and the stable business IDs behind translated routes.

## Current evidence

The production crawl covers all 170 English sitemap URLs and reports 44 issues across 31 routes: 19 broken internal links, 13 Dutch internal links, and 12 noncanonical internal links. Visual QA also found untranslated shared navigation and small English UI labels.

## Chosen design

The root explicitly approved a boundary-first approach: group exact source and target URLs, normalize stable IDs and locale at shared boundaries where possible, and protect each fix with focused regressions.

1. Extend the knowledge-base public-link resolver with a small set of legacy English aliases that resolve to existing stable service or software IDs. It then emits the canonical locale-relative path from the registered English route data. A single legacy knowledge-base article slug is normalized at the same boundary.
2. Correct route-owning components that bypass the resolver: English region CTAs and related posts, the English services quotation links, the case-study services link, the VisualVibe application URL, the website-analysis web-design link, and the Dutch-only WeddingVibe link on the English about page.
3. Keep shared-chrome and visible-copy localization in a separate, non-overlapping change set: locale-specific navigation cards, English region labels, breadcrumbs, footer country, sector CTA and category copy, and the visual-review copy findings.

Redirect aliases were rejected because they would preserve incorrect internal links and hide source defects. Editing every authored MDX link independently was rejected because the same legacy aliases can recur and the repository already has a central knowledge-base URL boundary.

## Testing and release gates

Focused tests first reproduce every route family. The implementation then must pass those tests, typecheck, lint with only the six known warnings, the full 374-page production build, and the exact 170-URL publication audit with zero issues. The final production server remains available on port 3210 for visual QA.

## Scope

No push or pull request. No French or German publication. No unrelated refactor. Stored Dutch address data and image filenames remain unchanged; only English display text is localized.
