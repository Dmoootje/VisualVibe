# Task 10, wave 10: independent Limburg website pillar review

## Review method

The reviewer read the complete 4,957-word Dutch source, the complete 4,763-word English translation, the translation brief, the English style guide and the glossary. The review covered factual and structural parity, idiomatic international business English, Belgian and Limburg context, price and legal boundaries, SEO and GEO intent, frontmatter, CTAs, components, FAQs and locale-safe links. No automatic humanizer was used.

## `website-laten-maken-limburg-complete-gids`

- Status: approved after correction.
- Confirmed parity across all 14 H2 sections and every source component, including the navigable contents, website-quality framework, SEO and Core Web Vitals guidance, site architecture, media guidance, regional strategy, conversion framework, project roadmap, ten FAQs and final CTA.
- Preserved Limburg as Limburg, Belgium, while retaining the source's relevant reach across Flanders, Antwerp province and Dutch Limburg.
- Preserved the commercial boundaries: scope drives price; one-page and full websites suit different needs; photography and video can support but not guarantee conversion; Core Web Vitals do not guarantee rankings; and ongoing content and monthly optimisation are normally separate from the website's SEO foundation.
- Preserved the legal caveat that WCAG 2.2 is a testing framework and that applicable formal obligations require an assessment for the individual organisation.
- Corrected frontmatter relationships to canonical internal identities and all public knowledge-base links to `/en/kennisbank/`.
- Corrected public service paths to the implemented `/en/services/` routes and repaired the website-development and online-shop slugs.
- Replaced literal uses of `cases` with the approved `case studies` terminology and corrected several smaller grammatical issues.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: passed.
- `npm run audit:locales`: completed with 0 blocking issues.
- Structural parity: 14/14 H2 sections, matching component inventory and ten source/target FAQs.
- Targeted scans found no U+2014/U+2015, mojibake, Dutch public knowledge-base routes, stale `knowledge-base` routes or invented English top-level service routes.
- `git diff --check`: passed, with line-ending notices only.

The pillar is approved for integration. English remains unpublished until the complete knowledge base and final production checks are finished.
