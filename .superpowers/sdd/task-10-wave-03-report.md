# Task 10, wave 03 report

## Delivered

- Four complete English MDX partners for the assigned Dutch articles.
- Four translation briefs validated against `docs/localization/translation-brief.schema.json`.
- Stable Dutch `translationKey` values, English slugs, English metadata, CTAs, FAQs, image text and locale-prefixed internal links.
- Full-length translations preserving the source structure, factual qualifications and Belgian context.

## Editorial review

The source articles, metadata, linked service context, related knowledge-base context, localisation style guide and glossary were reviewed before authoring. A second editorial pass corrected literal terminology and calques, including `realisatiefotografie` to `project photography`, awkward WordPress maintenance wording, Belgian regulatory explanations, mixed-language anchors and component labels. No automatic humanizer was used.

## Verification

- Translation briefs: 4/4 passed JSON Schema validation with Python `jsonschema`.
- `npm test -- --run src/lib/kennisbank/translations.test.ts`: 10/10 passed.
- `npm run typecheck`: passed.
- U+2014/U+2015 scan across all four target MDX files: no matches.
- English article word counts: 4,609; 4,306; 3,513; and 1,256 words.

English remains unpublished behind the existing locale publication controls.
