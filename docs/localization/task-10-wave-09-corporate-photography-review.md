# Task 10, wave 09: independent corporate photography review

## Review method

The reviewer read the complete Dutch source, complete English translation, validated brief, English style guide and glossary. The review covered factual and structural parity, idiomatic international business English, image-rights and copyright caveats, SEO and GEO intent, frontmatter, image text, CTAs, components and locale-correct links. No automatic humanizer was used.

## `wat-is-bedrijfsfotografie`

- Status: approved after correction.
- Confirmed parity for all 16 H2 sections, the seven-image-type table, supporting guide grid, preparation and scope checklists, production roadmap, two do/don't grids, seven FAQs and final CTA.
- Preserved the commercial limits: an image library may remain useful for years but has no guaranteed lifespan, original photography can support trust but does not guarantee sales, and one production day can combine media only when planning and circumstances allow.
- Preserved the legal and accessibility boundaries: recording consent does not automatically cover every publication, file possession is not copyright transfer, the article is not legal advice, meaningful images require appropriate text alternatives and alt text must not be stuffed with keywords.
- Corrected the Antwerp, construction and retail sector routes to actual English display slugs.
- Corrected stale web-design routes and the corporate-video category and anchor in both the article and brief.

## Validation evidence

- `npm run typecheck`: passed.
- Full Vitest suite: passed before independent corrections; targeted translation, glossary and locale-audit suites passed after correction.
- `npm run audit:locales`: completed with 0 blocking issues.
- Structural parity: 16/16 H2 sections and matching lead, quotes, table, feature grids, seven checklists, notice, roadmap, two do/don't grids, FAQ and CTA.
- Targeted scans found no U+2014/U+2015, paragraph-leading whitespace, mojibake, Dutch public routes or stale display slugs.
- `git diff --check`: passed, with line-ending notices only.

The article is approved for integration. English remains unpublished until the complete knowledge base and final release checks are finished.
