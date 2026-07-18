# Task 10, wave 10: independent Google Business Profile review

## Review method

The reviewer read the complete 3,011-word Dutch source, the complete 3,200-word English translation, the translation brief, the English style guide and the glossary. The review covered factual and structural parity, idiomatic international business English, local SEO and GEO intent, Google policy limitations, frontmatter, CTAs, components, FAQs and locale-safe links. No automatic humanizer was used.

The time-sensitive policy claims were checked again against Google's official Business Profile documentation on local ranking, business representation, service areas and review incentives on 18 July 2026.

## `google-business-profiel-optimaliseren`

- Status: approved after correction.
- Confirmed parity across all 13 H2 sections and every source component, including the four-layer audit, category and service-area guidance, photography and review controls, performance framework, maintenance roadmap, seven FAQs and final CTA.
- Preserved all source limitations: local ranking depends mainly on relevance, distance and prominence; distance cannot be optimised away; online-only businesses are not automatically eligible; service-area businesses generally use one profile; business-name keyword padding is prohibited; service areas are capped at twenty and should generally remain within about two hours' drive; home addresses should be hidden when customers are not received there; review incentives are prohibited; and views or clicks do not prove enquiries or sales.
- Corrected the article and brief from non-existent `knowledge-base` routes to the implemented `/en/kennisbank/` public structure.
- Restored canonical internal relationship identities for services, regions, sectors and English knowledge-base partners.
- Reworked literal or imprecise phrases concerning policy compliance, distance, categories and business differentiation.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: passed.
- `npm run audit:locales`: completed with 0 blocking issues.
- Structural parity: 13/13 H2 sections, matching component inventory and seven source/target FAQs.
- Targeted scans found no U+2014/U+2015, mojibake, Dutch public knowledge-base routes or stale `knowledge-base` routes.
- `git diff --check`: passed, with line-ending notices only.

The article is approved for integration. English remains unpublished until the complete knowledge base and final production checks are finished.
