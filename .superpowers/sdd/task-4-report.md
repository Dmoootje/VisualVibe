# Task 4 report: complete English sitemap inventory

## Status

Complete. The XML sitemap now consumes a pure public-route inventory, publishes complete Dutch and English commercial route sets, and keeps knowledge-base output translation-key driven. English website analysis is now indexable so its sitemap entry no longer conflicts with page robots metadata.

## RED evidence

Initial command:

```text
npx vitest run src/lib/seo/publicPageInventory.test.ts src/lib/seo/siteUrls.publication.test.ts "src/app/[locale]/(site)/website-analyse/page.test.tsx"
```

Observed before implementation:

```text
Test Files  3 failed (3)
Tests       2 failed | 6 passed (8)
Exit code   1
```

The inventory suite could not import `./publicPageInventory`; the sitemap boundary lacked `/en/diensten/web-design/business-website-design/`; and English website-analysis metadata returned `robots.index: false` instead of the approved public `index: true` state.

Self-review found a future-state eligibility edge. A second RED run mocked a checked-in photography case and failed because the static inventory omitted `/realisaties/fotografie/` when no Firestore galleries were present:

```text
npx vitest run src/lib/seo/publicPageInventory.test.ts
Test Files  1 failed (1)
Tests       1 failed | 3 passed (4)
Exit code   1
```

## GREEN evidence

The focused inventory, sitemap boundary and website-analysis suite passed after implementation and the edge fix:

```text
npx vitest run src/lib/seo/publicPageInventory.test.ts src/lib/seo/siteUrls.publication.test.ts "src/app/[locale]/(site)/website-analyse/page.test.tsx"
Test Files  3 passed (3)
Tests       12 passed (12)
Exit code   0
```

The exact Task 4 sitemap/content-focused command also passed:

```text
npx vitest run src/lib/seo/publicPageInventory.test.ts src/lib/seo/siteUrls.publication.test.ts src/i18n/routing.test.ts
Test Files  3 passed (3)
Tests       9 passed (9)
Exit code   0
```

## Inventory and sitemap evidence

- Production-like checked-in data produces 98 static route records and 6 Firestore-bound route records.
- The 104 route records contain 102 genuine bilingual pairs and two intentional Dutch-only realisation category routes.
- This yields 104 Dutch and 102 English commercial locale URLs, with no duplicate path inside either locale.
- Representative stable-ID pairs include `/diensten/webdesign/website-laten-maken/` with `/diensten/web-design/business-website-design/`, `/regio/limburg/` with `/regio/limburg-belgium/`, and `/offerte-aanvragen/` with `/request-a-quotation/`.
- Every bilingual sitemap entry receives the same `nl-BE`, `en-BE` and Dutch `x-default` language map.
- Photography and videography remain Dutch-only because their current English realisation pages are intentionally empty/noindex; they receive no fabricated English alternate.
- Published Firestore application-case IDs resolve through the checked-in stable-ID translation registry. The current four published checked-in projects therefore receive Dutch and English detail URLs.
- The boundary test finds exactly 58 English and 58 Dutch knowledge-base article entries. Each translation-key pair shares an identical hreflang map.
- `/fr/`, `/de/`, Dutch-only standalone routes, internal style guides, report-token routes and the language picker are absent from the inventory.

## Validation

```text
npm run validate:content
Subdienst-audit geslaagd: 46 unieke pagina's
Locale audit: 0 issue(s), 0 blocking.
Exit code 0
```

```text
npm run typecheck
tsc --noEmit
Exit code 0
```

```text
npm test
Test Files  85 passed (85)
Tests       331 passed (331)
Exit code   0
```

`git diff --check` completed without whitespace errors. Git only reported the repository's existing LF-to-CRLF checkout warning.

## Files changed

- `src/lib/seo/publicPageInventory.ts`
- `src/lib/seo/publicPageInventory.test.ts`
- `src/lib/seo/siteUrls.ts`
- `src/lib/seo/siteUrls.publication.test.ts`
- `src/app/[locale]/(site)/website-analyse/page.tsx`
- `src/app/[locale]/(site)/website-analyse/page.test.tsx`
- `.superpowers/sdd/task-4-report.md`

The website-analysis page and test are an approved scope expansion: including `/en/website-analysis/` in the sitemap required removing its stale English-only `noindex` directive.

## Self-review

- Checked the implementation line by line against the Task 4 brief and English publication design.
- Confirmed static routes are derived from existing service, software, region, sector and realisation stable IDs rather than translated by string replacement.
- Confirmed Firestore fetching remains in `siteUrls.ts`; the inventory stays pure and accepts published application cases plus the photography-gallery count as input.
- Confirmed application publication status, gallery presence, checked-in cases, static media presence and `indexWhenEmpty` rules remain represented.
- Confirmed bilingual pairs share one alternate map, while Dutch-only eligible routes omit alternates.
- Confirmed the knowledge-base remains translation-key driven and no language-picker behavior was introduced.
- Confirmed no same-locale inventory duplicates and no unrelated production files changed.

## Concerns

No blocking concerns. A future Firestore application case without a matching checked-in stable-ID translation is intentionally omitted from detail sitemap entries; it must first gain a real localized route and page owner. English photography and videography realisation categories remain excluded until those pages become genuinely indexable.

## Re-review resolution

The independent re-review withdrew its checked-in case-detail finding: `cases` is currently empty and the application has no generic `realisaties/[category]/[slug]` page owner, so emitting those URLs would create sitemap 404s. Checked-in cases correctly remain an input to category indexability only.

The remaining Important finding was valid. Dutch-only realisation category paths interpolated the stable source slug directly instead of resolving the Dutch public slug through `getLocalizedRealisatieCategoryById`.

Focused RED:

```text
npx vitest run src/lib/seo/publicPageInventory.test.ts
Test Files  1 failed (1)
Tests       1 failed | 4 passed (5)
Exit code   1
```

The regression replaced the Dutch videography public slug at the stable-ID resolver boundary. The inventory continued to emit `/realisaties/videografie/`, proving it bypassed the resolver.

Focused GREEN after routing the Dutch-only branch through the stable-ID helper:

```text
npx vitest run src/lib/seo/publicPageInventory.test.ts src/lib/seo/siteUrls.publication.test.ts
Test Files  2 passed (2)
Tests       9 passed (9)
Exit code   0
```

The regression also asserts that the Dutch-only category record has no English path, so sitemap generation cannot fabricate English hreflang or an English entry for it. Per the re-review instruction, the full suite was not rerun for this pure path-resolution fix.
