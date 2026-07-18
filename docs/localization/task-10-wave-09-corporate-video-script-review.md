# Task 10, wave 09: independent corporate video script review

## Review method

The reviewer read the complete 4,579-word Dutch source, complete English translation, validated translation brief, English style guide and glossary. The review covered factual and structural parity, idiomatic international business English, production and legal caveats, SEO and GEO intent, frontmatter, image text, CTA copy, components and locale-correct internal links. No automatic humanizer was used.

## `bedrijfsvideo-script-opbouwen`

- Status: approved after correction.
- Confirmed parity across all 18 H2 sections and 24 top-level MDX component instances, including the strategy table, evidence grid, five-part story model, scene planning, interview guidance, accessibility, rights, approval workflow, measurement, eight FAQs and final CTA.
- Preserved the three audiences for a script: the organisation, production crew and viewer.
- Preserved the source boundaries: not every SME production needs a storyboard for every shot, automatic captions require human review, recording permission does not automatically cover publication, the legal section is general production information, and a script cannot guarantee rankings or video search features.
- Refined literal uses of `picture` into production-appropriate `visuals` or `scene`, and rewrote the closing `build a line` phrasing as a natural `storyline`.
- Corrected the author, Antwerp region and training-sector routes to their actual English display slugs, and made the CTA heading a natural question.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: passed.
- `npm run audit:locales`: completed with 0 blocking issues.
- Structural check: 18/18 H2 sections and 24/24 top-level component instances.
- Targeted scans found no U+2014/U+2015, paragraph-leading whitespace, mojibake, Dutch public route collections or stale Dutch service slugs.
- `git diff --check`: passed, with line-ending notices only.

The article is approved for integration. English remains unpublished until the complete knowledge base and final release checks are finished.
