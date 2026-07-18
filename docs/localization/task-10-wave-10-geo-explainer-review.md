# Task 10, wave 10: independent GEO explainer review

## Review method

The reviewer read the complete 2,863-word Dutch source, the complete 3,045-word English translation, the translation brief, the English style guide and the glossary. The review covered factual and structural parity, idiomatic international business English, SEO and GEO intent, crawler and platform caveats, frontmatter, CTAs, components, FAQs and locale-safe links. No automatic humanizer was used.

Time-sensitive claims were checked again against the official Google Search Central AI-features guidance, Google Search Console Generative AI report documentation, OpenAI crawler documentation and publisher FAQ on 18 July 2026.

## `wat-is-geo-generative-engine-optimization`

- Status: approved after correction.
- Confirmed parity across all 11 H2 sections and every source component, including the four-stage retrieval model, both comparison tables, source-quality criteria, crawler controls, measurement framework, seven-step SME plan, eight FAQs and final CTA.
- Preserved the benchmark context: the GEO paper was submitted in November 2023, accepted at KDD 2024 and reported improvements of up to 40 percent only within its specific experimental setup.
- Reconfirmed Google's current limitations: AI Overviews and AI Mode may use query fan-out; supporting-link candidates must be indexed and eligible for a Search snippet; no special AI file or schema is required; and inclusion is never guaranteed.
- Reconfirmed OpenAI's current controls: OAI-SearchBot and GPTBot are independent; Search robots changes may take about 24 hours; blocked content may still appear as a navigational link; noindex must be crawlable to be read; and robots.txt may not apply to user-initiated ChatGPT-User actions.
- Preserved the reporting caveats for Bing AI Performance and Google's limited Generative AI performance rollout. Citations, impressions, rankings, traffic, conversions and revenue remain distinct measures.
- Corrected public links and the brief to the implemented `/en/kennisbank/` route structure, and restored canonical internal identities for relationships.
- Refined literal phrases concerning source credibility and topical versus technical availability.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: passed.
- `npm run audit:locales`: completed with 0 blocking issues.
- Structural parity: 11/11 H2 sections, matching component inventory and eight source/target FAQs.
- Targeted scans found no U+2014/U+2015, mojibake, Dutch public knowledge-base routes or stale `knowledge-base` routes.
- `git diff --check`: passed, with line-ending notices only.

The article is approved for integration. English remains unpublished until the complete knowledge base and final production checks are finished.
