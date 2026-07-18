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
