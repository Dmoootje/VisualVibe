# Task 10, wave 10: independent testimonial video review

## Review method

The reviewer read the complete 4,726-word Dutch source, the complete 4,923-word English translation, the translation brief, the English style guide and the glossary. The review covered factual and structural parity, natural international business English, Belgian and EU legal caveats, SEO and GEO intent, frontmatter, tables, components, FAQs, image text, CTAs and locale-safe public links. No automatic humanizer was used.

## `testimonial-video-laten-maken`

- Status: approved after correction.
- Confirmed parity across all 18 H2 sections and every source component: the lead, two quotations, two comparison tables, three feature grids, seven checklist blocks, two notices, two do/don't grids, two roadmaps, eight FAQs and final CTA.
- Preserved all source boundaries: a testimonial is one customer's perspective rather than a guarantee; participation must be voluntary; compensation can affect disclosure; editing must preserve conditions; recording and publication permissions are distinct; automatic captions need human review; and video SEO cannot guarantee a rich result or ranking.
- Corrected the article and brief from non-existent `knowledge-base` routes to the implemented `/en/kennisbank/` public route, while keeping canonical relationship fields in their internal identity format.
- Corrected stale service, region and sector aliases, including the testimonial-video service, business portraits, Limburg, Belgium, Antwerp province, construction, retail and training routes.
- Rewrote several literal phrases concerning legal review, agreement documentation, consent and reshoots so the copy reads as professional human English without changing meaning.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: 3 files and 31 tests passed.
- `npm run audit:locales`: completed with 0 blocking issues; 22 informational missing English partners remain for later waves.
- Structural parity: 18/18 H2 sections, matching component inventory and eight source/target FAQs.
- Targeted scans found no U+2014/U+2015, mojibake, Dutch public knowledge-base routes, stale `knowledge-base` routes or superseded testimonial and portrait service aliases.
- `git diff --check`: passed, with line-ending notices only.
- `npm run build`: compilation and type checking passed, but sitemap prerendering remains blocked by 658 repository-wide relationship validation issues in unfinished English knowledge-base waves. This is not presented as a successful production build.

The article is editorially approved for integration. English remains unpublished until the complete knowledge base relationship audit and final production build pass.
