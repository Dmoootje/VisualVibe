# Task 9 report

## Status and inventory

- The knowledge base contains exactly 58 Dutch MDX articles.
- Every Dutch article has a required, non-empty, kebab-case `translationKey`.
- All 58 Dutch translation keys are unique. Each currently matches its stable Dutch slug.
- English remains disabled and no English knowledge-base route is emitted by this task.
- The readiness audit reports 58 missing English partners as non-blocking inventory while English is disabled.

## RED evidence

Command: `npx vitest run src/lib/kennisbank/translations.test.ts`

The initial run failed 4 of 6 tests. The failures proved that the old API returned an array from a `BlogPost`, duplicate translation identities had no dedicated code, English partner readiness was unavailable, and cross-locale related-post links were reported only as missing links.

A second RED cycle added locale-aware URL coverage. It failed because `localizedPostHref` did not exist.

A third RED cycle added invalid-key coverage. It failed because non-kebab-case keys were accepted.

## GREEN evidence

- Focused translation-identity tests: 1 file passed, 9 tests passed.
- Full suite: 73 files passed, 284 tests passed.
- TypeScript: `npm run typecheck` passed.
- Content validation: 58 missing English partners, all informational, 0 blocking issues.
- Production build: completed successfully and generated all 58 Dutch article routes.
- The previously blocking Dutch WordPress backup image now has explicit, meaningful alt text.

## Implemented contract

- `BlogPost.translationKey` is required.
- The loader requires `translationKey` frontmatter and the validator enforces non-empty kebab-case identity.
- Slugs are unique and resolved within a locale. Different locales may use different slugs, including the same literal slug without a routing collision.
- `getPostTranslations(translationKey, options?)` returns `Partial<Record<SupportedLocale, BlogPost>>`.
- `localizedPostHref(post)` builds a public path using the translated post's own locale, category and slug.
- Translation validation exposes `duplicate-translation-key`, `missing-english-partner`, and `cross-locale-link` codes.
- `validateKennisbankPosts(posts, now, { requireEnglishPartners: true })` enables the English partner readiness gate. Normal Dutch production validation leaves that gate off until Task 10 supplies the partners.
- Related post and parent-pillar resolution uses locale plus slug, so an article cannot silently resolve to another language.

## Exact Task 10 contract

Task 10 must create exactly one English MDX partner for each of the 58 Dutch `translationKey` values. Each English file must:

1. Keep the Dutch partner's exact `translationKey`.
2. Set `locale: "en"` and use a natural, unique English `slug`.
3. Keep its category relationship valid and use its own locale-specific canonical article path.
4. Rewrite every `parentPillar` and `relatedPosts` entry to the canonical path of a live English partner. A Dutch-only target is a `cross-locale-link` failure.
5. Preserve required metadata, author, dates, status, structured fields and factual scope while translating all public text.
6. Pass `validateKennisbankPosts(posts, now, { requireEnglishPartners: true })` with no duplicate identities, missing English partners or cross-locale links.
7. Produce exactly 58 translation groups containing one Dutch and one English article. `getPostTranslations(key).nl` and `.en` must both exist for every group.
8. Keep English disabled until the complete set and independent editorial review pass.

No Dutch article body was changed in Task 9.
