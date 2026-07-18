# Task 5 report

## Status

Complete locally on `feat/english-publication-release`. English is fully represented in the public and visible sitemap and production crawl. Dutch remains published, French and German remain disabled. The branch is ready for a draft pull request; no merge or deployment has been performed.

## RED evidence

- The initial production crawl reported 44 publication issues.
- Route and source-isolation regressions failed before canonical-link and localized-source corrections.
- The final rendered scan follow-up produced RED failures for four `WebPageJsonLd` call sites, English application-case JSON-LD, the English sector-hub CTA and the English local-SEO route example.
- After the first rendered-copy fix, the permanent audit still failed on one visible hypothetical Dutch route example in the same article.

## GREEN evidence

- Focused copy and metadata regressions: 8 test files, 24 tests passed.
- Follow-up article and audit regressions: 2 test files, 5 tests passed.
- Full suite: 105 test files, 398 tests passed.
- Typecheck: passed.
- Lint: 0 errors, 6 known warnings.
- Content validation: passed; locale audit 0 issues and 0 blocking.
- Fresh production build: passed, 374 of 374 static pages generated.
- Sitemap inventory: 344 URLs, comprising 170 English and 174 Dutch URLs; visible/XML English parity is exactly 170 of 170.
- English publication audit: 170 of 170 English sitemap pages crawled, 510 hreflang references, 6,080 internal English link references, 2 disabled-locale redirects, 0 issues.
- English rendered copy audit: 170 routes, 0 issues across 0 routes.
- Rendered sitemap title check: authored English labels present and representative Dutch slug-derived labels absent.
- U+2014/U+2015 scan: 0 matches.

## Delivered artifacts

- `scripts/audit-english-production.mjs`
- `scripts/audit-english-production.test.mjs`
- `scripts/audit-english-copy.mjs`
- `scripts/audit-english-copy.test.mjs`
- Package commands `audit:english-publication` and `audit:english-copy`
- `docs/localization/english-publication-release-report.md`
- This overwritten task report

## Browser QA

The root coordinator checked the fresh production artifact on desktop and at 390 px mobile width. The reviewed pages and open menu were fully English, the language picker remained absent, and no broken navigation, horizontal overflow, missing alt text or visibly broken image was found.

## Commits

- `de41940 fix: audit rendered English copy and metadata`
- `fce83fc fix: remove obsolete English route example`
- `68699dc fix: support streamed metadata in English copy audit`
- `c7430c3 fix: harden English publication SEO surfaces`
- `70a1668 test: align sitemap checks with shared inventory`
- `32dbce0 fix: localize visible sitemap titles`
- `d528701 test: use canonical English sitemap article`
- Earlier Task 5 implementation commits run from `f9710ed` through `f3f8ca6`.

## Concerns

- Six pre-existing non-blocking lint warnings remain.
- The existing multi-lockfile workspace-root notice and one ambiguous Tailwind class warning remain in build output.
- Four compatibility aliases remain unlinked and absent from the sitemaps, with correct English canonicals; they are non-blocking.

## Self-review

The permanent rendered-copy audit was reviewed to avoid false positives: both `en_BE` and `en_GB` are valid, `Bouw Realisaties` is retained as a proper name, and the published `/en/kennisbank/` namespace remains valid in technical examples. The visible sitemap now fails fast when a canonical English path lacks an authored localized title, preventing Dutch slug-derived labels from silently returning.
