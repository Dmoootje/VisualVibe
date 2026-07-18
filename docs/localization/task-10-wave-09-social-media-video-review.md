# Task 10, wave 09: independent social media video review

## Review method

The reviewer read the complete Dutch source, complete English translation, validated brief, English style guide and glossary. The review covered factual and structural parity, idiomatic international business English, dated platform facts and caveats, SEO and GEO intent, frontmatter, image text, CTAs, components and locale-correct links. No automatic humanizer was used.

## `social-media-video-voor-kmo`

- Status: approved after correction.
- Confirmed parity for all 16 H2 sections, both comparison tables, the format and production checklists, seven-step workflow, accessibility guidance, measurement framework, seven FAQs and final CTA.
- Preserved the 12 July 2026 specification snapshot, Instagram ratio/resolution/frame-rate values, LinkedIn ratio/resolution/duration values, YouTube Shorts date and duration, and the explicit limitation that TikTok advertising documentation is not a promise for every organic feature.
- Preserved the article's restraint: platform limits change, automatic captions need review, view definitions differ and no universal frequency, format, duration or result is promised.
- Corrected the taxonomy to the registered `Videografie` category, the author and Antwerp routes, and related-article slugs to the actual English translation partners.
- Corrected the brief and body from the non-existent `/knowledge-base/videography/` collection to the repository's public `/knowledge-base/videografie/` category route.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: passed.
- `npm run audit:locales`: completed with 0 blocking issues.
- Structural parity: 16/16 H2 sections and matching LeadIntro, QuoteBlock, tables, checklist grid, notice, roadmap, do/don't grid, FAQ and CTA components.
- Targeted scans found no U+2014/U+2015, paragraph-leading whitespace, mojibake, Dutch public routes or stale related-post slugs.
- `git diff --check`: passed, with line-ending notices only.

The article is approved for integration. English remains unpublished until the complete knowledge base and final release checks are finished.
