# English publication release report

Date: 2026-07-18

Branch: `feat/english-publication-release`

## Outcome

The English publication surface is ready for release from the audited local production artifact. The sitemap publishes Dutch and English only, all 170 English sitemap routes were crawled successfully, canonical and hreflang relationships are valid, internal English links resolve to their canonical targets, and the rendered English copy, attributes and language metadata audit reports zero issues.

No branch push or pull request was created.

## Release scope and corrections

- Added a permanent production crawl in `scripts/audit-english-production.mjs` with unit coverage and the `audit:english-publication` package command.
- Added a permanent rendered copy and metadata crawl in `scripts/audit-english-copy.mjs` with unit coverage and the `audit:english-copy` package command.
- Published complete English route inventories for commercial pages, services, subservices, sectors, regions, case studies, tools and knowledge-base content.
- Kept French and German disabled. The build generated only Dutch and English locale params, and the audit verified both disabled-locale redirects.
- Canonicalized remaining English aliases and internal links, including legacy knowledge-base paths and locale-relative region, sector, service and case-study links.
- Localized shared navigation, menus, forms, footer, consent UI, calls to action and related visitor-facing interface copy.
- Corrected English `WebPage` and application-case JSON-LD to use `inLanguage: en-BE`; localized the application-case schema genre.
- Corrected the English sector-hub quotation label.
- Replaced visible legacy Dutch route examples in English knowledge-base articles with canonical English examples or natural English wording.

## Audit history

The first production publication crawl exposed 44 canonical, hreflang or internal-link issues. Targeted source fixes reduced that to one remaining noncanonical link, then to zero.

An exploratory rendered-copy scan initially reported 83 flags across 77 routes. Review showed that 69 Open Graph flags were valid `en_BE` values, while `Bouw Realisaties` was a proper project name and `/en/kennisbank/` was a valid published route namespace in a technical example. The actionable findings were eight English routes with Dutch JSON-LD language metadata, one Dutch sector-hub CTA and obsolete visible route examples in one English article. The permanent audit now accepts both valid English OG forms (`en_BE` and `en_GB`) while retaining checks for Dutch visitor copy, attributes, obsolete routes and JSON-LD metadata.

## Final automated evidence

- `npm test`: 102 test files passed, 389 tests passed, 0 failures.
- `npm run typecheck`: passed.
- `npm run lint`: 0 errors and 6 known warnings.
- `npm run validate:content`: passed; 46 unique subservice pages, word range 965 to 1426, knowledge base 45 direct and 1 parent fallback, locale audit 0 issues and 0 blocking.
- `npm run build`: passed; compiled in 9.4 seconds and generated 374 of 374 static pages.
- Build locale output: Dutch and English only; no French or German static locale params.
- `npm run audit:english-publication`: 342 sitemap URLs total, 170 English sitemap URLs, 170 English pages crawled, 510 hreflang references, 5,937 internal English link references, 2 disabled-locale redirects and 0 issues.
- `npm run audit:english-copy`: 170 routes, 0 issues across 0 routes.
- U+2014/U+2015 scan across `src`, `content`, `scripts` and `docs`: 0 matches.

## Browser QA

The root coordinator performed release browser QA against the fresh production server on desktop and at a 390 px mobile viewport. The checked pages and open navigation menu remained fully English, no language picker was exposed, and the pass found no broken navigation, horizontal overflow, missing image alternative text or visibly broken images.

## Review notes

- The six lint warnings are pre-existing and non-blocking: one internal style-guide unused import, two lead-form warnings, two SEO-service unused declarations and one XR unused argument.
- The build also prints the existing multi-lockfile workspace-root notice and one ambiguous Tailwind class warning. Neither blocks compilation, static generation or the release audits.
- A fresh production server is intentionally left running at `http://127.0.0.1:3210` for coordinator QA.

## Final commits

- `f9710ed` - publication audit and release regression coverage
- `fef4fd0` through `f3f8ca6` - English route publication, source isolation, shared copy and canonical-link corrections
- `de41940` - permanent rendered English copy audit plus JSON-LD, CTA and article corrections
- `fce83fc` - removal of the final obsolete visible route example
