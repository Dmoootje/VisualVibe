# Task 10, wave 10: independent corporate portrait review

## Review method

The reviewer read the complete 3,489-word Dutch source, the complete 3,797-word English translation, the translation brief, the English style guide and the glossary. The review covered factual and structural parity, idiomatic international business English, Belgian legal context, SEO and GEO intent, frontmatter, image and accessibility guidance, CTAs, components, FAQs and locale-safe links. No automatic humanizer was used.

## `zakelijke-portretten-tips`

- Status: approved after correction.
- Confirmed parity across all 16 H2 sections and every source component, including the 12 tips, both comparison tables, three feature grids, six checklist blocks, six-step portrait workflow, rights guidance, day-of-shoot checklist, seven FAQs and final CTA.
- Preserved all source boundaries: formality depends on person, role and channel; consistency does not mean identical poses; LinkedIn requires a person's likeness; alt text is contextual; print masters should not be loaded into web components; recording and publication permission are distinct; copyright and usage licences differ; retouching must preserve recognisability; and portraits cannot guarantee clicks, applications or enquiries.
- Corrected knowledge-base public links and the brief to the implemented `/en/kennisbank/` route structure.
- Restored canonical internal identity paths for frontmatter relationships to services, regions, sectors and English knowledge-base partners.
- Reworked literal phrases around profile-image versatility, recognisability, brand values and approachability so the translation reads naturally without changing the source meaning.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: passed.
- `npm run audit:locales`: completed with 0 blocking issues.
- Structural parity: 16/16 H2 sections, matching component inventory and seven source/target FAQs.
- Targeted scans found no U+2014/U+2015, mojibake, Dutch public knowledge-base routes or stale `knowledge-base` routes.
- `git diff --check`: passed, with line-ending notices only.

The article is approved for integration. English remains unpublished until the complete knowledge base and final production checks are finished.
