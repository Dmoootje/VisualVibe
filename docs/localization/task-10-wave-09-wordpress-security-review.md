# Task 10, wave 09: independent WordPress security review

## Review method

The reviewer read the complete Dutch source, complete English translation, translation brief, English style guide and glossary. The review covered factual and structural parity, idiomatic international business English, security caveats, SEO and GEO intent, frontmatter, CTA copy and locale-correct links. No automatic humanizer was used.

## `wordpress-website-beveiligen`

- Status: approved after editorial correction.
- Confirmed complete parity for the layered security model, quarterly account review, unique passwords, controlled updates, plugin and hosting assessment, multi-factor authentication, off-site backups, logging, forms, custom code, third-party scripts, seven-step incident plan and three misconceptions.
- Preserved all important limits: no website is entirely risk-free, a security plugin is not a complete solution, HTTPS does not prove that the application is secure, and deleting files at random can hinder investigation and recovery.
- Confirmed that the update sequence retains the source requirement to make a recent backup, test major changes on staging and retest critical functions.
- Refined the CTA and a small number of literal phrases so the copy reads as original professional English without changing the commercial scope.
- Confirmed the English metadata, author route, services, regions, related posts and quotation CTA.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: passed.
- `npm run audit:locales`: completed with 0 blocking issues.
- Targeted scans found no U+2014/U+2015, paragraph-leading whitespace, mojibake or Dutch public routes in the English file.
- `git diff --check`: passed, with line-ending notices only.

The article is approved for integration. English remains unpublished until the complete knowledge base and final release checks are finished.
