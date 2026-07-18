# Task 10, wave 04 report

## Delivered

- Three complete English MDX partners for the assigned Dutch articles.
- Three translation briefs validated against `docs/localization/translation-brief.schema.json`.
- Stable Dutch `translationKey` values, natural English slugs, English metadata, CTAs, FAQs, image text and locale-prefixed internal links.
- Full section, component, table, checklist, example, legal qualification, source and FAQ parity.

## Editorial review

The complete Dutch sources, their metadata, linked service context, related knowledge-base context, localisation style guide and glossary were read before authoring. A full source-to-target pass checked tone, facts, qualifiers, headings, links, terminology, alt text, metadata and CTAs. The copy was translated as coherent English rather than paragraph-by-paragraph substitution. No automatic humanizer was used. Independent editorial review has been requested from the integrating agent because all collaboration slots were occupied during this wave.

## Verification

- Translation briefs: 3/3 passed JSON Schema validation with Python `jsonschema`.
- `npm test -- --run src/lib/kennisbank/translations.test.ts`: 10/10 passed after correcting the English pillar taxonomy to the registered category identity.
- `npm run typecheck`: passed.
- `npm run audit:locales`: completed with 0 blocking issues; remaining informational missing-partner notices belong to unfinished parallel waves.
- Full test suite: 278/285 tests passed. The seven failures share one concurrent, out-of-scope cause in `how-to-back-up-wordpress.mdx`, whose category was changed to an unregistered English label by another wave after the targeted test passed.
- U+2014/U+2015 and mojibake scan across all three target MDX files: no matches.
- Locale-link scan across the three article bodies: no unprefixed internal destinations.
- English article word counts including frontmatter: 3,956; 4,147; and 3,302 words.

English remains unpublished behind the existing locale publication controls.

## Independent editorial review

Reviewed independently after commit `e0bac92` against the complete Dutch sources, translation briefs, English style guide and glossary.

- `why-invest-in-a-corporate-video`: APPROVED after restoring the source's factual-accuracy safeguard for testimonials and its internal routes to the performance and recruitment guides.
- `real-estate-drone-photography`: APPROVED after replacing two translated phrases that sounded procedural rather than idiomatic. Legal limits, the 120-metre Open-category ceiling, visual-line-of-sight requirement, geozone checks, privacy qualification, plot-boundary caveat and usage-rights caveat remain intact.
- `seo-content-for-service-businesses`: APPROVED after restoring the missing people-first and generative-search source context, explicit no-preferred-word-count qualification, pillar route and one-page-versus-full-site route. The 7 May 2026 FAQ-rich-result change, evidence controls, non-guarantee language and page-type measurement model remain intact.
- Taxonomy: all three files use the registered category identities and slugs (`Videografie` / `videografie`, `Drone & FPV` / `drone`, and `SEO & GEO` / `seo-geo`). No owned category mismatch remains.
- Structural parity: headings, components, tables, checklists, FAQs, CTAs, metadata, image text and factual caveats were compared with the complete source documents. Component and FAQ counts match each Dutch partner.
- Brief validation: 3/3 passed `translation-brief.schema.json` with Python `jsonschema`.
- Knowledge-base translation tests: 10/10 passed.
- TypeScript typecheck: passed.
- Locale audit: 0 blocking issues; 41 informational missing-partner notices belong to unfinished knowledge-base waves.
- Typography, mojibake and locale-link scans: no U+2014/U+2015, mojibake or unprefixed internal body links in the three reviewed files.
- Production compilation reached successful compilation, lint and type validation. Static generation remains blocked by 294 cross-wave canonical-reference issues across unfinished English knowledge-base and route work; this review did not alter unrelated files.
