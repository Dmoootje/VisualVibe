# Task 7 report

## Status

Partially implemented. English remains disabled. The contact and quotation pages now select strict Dutch or English page copy, and the shared metadata builder can emit locale-specific canonicals and Open Graph locales. Eight commercial translation briefs were created and schema-validated. The home, about, sitemap, tools, checklist and full website-analysis page bodies still require implementation and independent editorial review before Task 7 can be considered complete.

## Route inventory and ownership

- Task 7: `/`, `/contact`, `/offerte-aanvragen`, `/over-ons`, `/sitemap`, `/tools`, `/tools/seo-geo-checklist`, `/website-analyse`.
- Task 6 boundary: `/privacy` and `/cookies` were not changed.
- Task 8 boundary: all `/diensten`, `/sectoren`, `/regio` and `/realisaties` routes and their records were not changed.
- Task 10 boundary: all `/kennisbank` routes and content were not changed.
- Excluded: `/internal/blog-styleguide`, analysis report tokens and other non-index landing destinations.

## Context and research decisions

The full Dutch contact and quotation pages, their dynamic site settings, form integration, approved style guide, glossary and metadata builder were read before translation. The other six source owners were inventoried and read before their briefs were drafted. Keyword choices were unambiguous category and navigational terms, so no speculative external keyword-volume claims were introduced. English wording localises intent and uses `quotation`, `website analysis`, `SME`, `online visibility`, and preserved SEO/AEO/GEO terminology as required.

## Brief coverage

Validated briefs exist for home, contact, request a quotation, about, tools, SEO/GEO checklist, website analysis and sitemap in `docs/localization/briefs/commercial`.

## RED and GREEN evidence

- RED: `pageMetadata.test.ts` failed because English still canonicalised to `/be/contact/` and emitted `nl_BE`.
- GREEN: the same test passes after locale-aware canonical and Open Graph selection.
- RED: `commercialCopy.test.ts` failed because the strict commercial copy owner did not exist.
- GREEN: the test passes after adding complete Dutch and English contact/quotation records.
- Typecheck passes after replacing the knowledge-base-only path helper with a four-locale metadata prefix.

## Verification

- Focused tests: 2 files, 2 tests passed.
- Typecheck: passed.
- Eight translation briefs: Draft 2020-12 schema validation passed.
- Prohibited U+2014/U+2015 scan of changed content: clean.
- Locale audit: ran with 59 existing findings and one blocking Dutch knowledge-base missing-alt issue in `wordpress-backup-maken.mdx`, outside Task 7.

## Remaining work and review

The six larger page bodies are not yet English-renderable, so their briefs are preparation rather than acceptance evidence. The contact and quotation copy still needs the mandatory second-agent source-and-brief editorial review. The English target slug decisions in briefs also require integration with the translation identity/routing work before publication. Task 8 owns the English destinations linked from general pages and may alter those target slugs; no service record was changed here.

## Continuation evidence

The tools hub and the complete 24-item SEO/GEO checklist now render dedicated English page copy, metadata, Open Graph alt text, categories, item guidance, interaction labels, errors and calls to action. Dutch output remains unchanged. English records are owned separately in `src/data/toolsEnglish.ts` and selected strictly by locale.

- RED: both page-group tests failed because no locale metadata function existed.
- GREEN: 6 focused tools/checklist tests pass in 2 files, including English render and metadata assertions.
- Typecheck passes after the implementation.

Still incomplete: home, about, sitemap, website analysis and analysis report chrome/body. Those routes prevent a zero-remaining Task 7 inventory and therefore prevent editorial review or completion status.

## Task 7 continuation: core pages sub-scope A

Home, about and the public sitemap now have strict English page bodies and locale-specific metadata while preserving the existing Dutch render path. The English homepage presents the agency positioning, core disciplines, regional reach, working process, review signal, FAQs and calls to action as one coherent English document. The about page covers the founder, 2020 origin, seven disciplines, one-point-of-contact model, three named partners and regional scope. The English sitemap deliberately lists only page groups already prepared in English and does not fall back to Dutch knowledge-base titles.

Brief coverage: the existing validated `home.json`, `about.json` and `sitemap.json` briefs were checked against the complete Dutch owners before implementation. The translations preserve their stated audiences, search intent, key facts and terminology. No extra keyword-volume claims were introduced.

RED evidence: `corePagesEnglish.test.tsx` initially failed all three page groups because the homepage rendered Dutch copy and locale-agnostic metadata, while about and sitemap exposed static Dutch metadata and accepted no locale-aware page contract. After correcting the test harness navigation mock, each assertion failed on the missing English behavior it specifies.

GREEN evidence: the focused core-page, metadata and homepage configuration suite passes (3 files, 5 tests). Typecheck passes. `git diff --check` passes. The prohibited U+2014/U+2015 scan of all four changed source/test files is clean.

Changed files: `src/app/[locale]/(site)/page.tsx`, `src/app/[locale]/(site)/over-ons/page.tsx`, `src/app/[locale]/(site)/sitemap/page.tsx`, and `src/app/[locale]/(site)/corePagesEnglish.test.tsx`.

Independent editorial review is still required at Task 7 integration level. Task 7B remains unresolved: `/website-analyse` and `/website-analyse/rapport/[token]` still require complete English body and report-chrome localisation. English publication remains disabled.

## Task 7B continuation evidence

The website-analysis landing page now has a dedicated, noindex English metadata result and a coherent English body covering the direct answer, checks, report value, audit distinction, CTAs, FAQ structured data and contextual image alt text. A report-specific brief records its private/noindex audience, dynamic-language boundary, token behaviour, legacy handling and CTA destinations.

The report chrome now selects Dutch or English labels for scores, summaries, quick-win metrics, AIO/GEO health, keyword density, severity, strengths, issues, category advice, page details, dates and CTAs. Partner findings are displayed on the English route only when `outputLanguage` is explicitly `en`; Dutch and unknown-language reports use a safe English unavailable state. Legacy reports remain available unchanged in Dutch and are never implicitly treated as English.

RED evidence: the new English landing-page test failed because locale metadata and English content did not exist. The English report tests failed on Dutch score, metric, detail and missing-density labels. The output-language test failed because no display guard existed.

GREEN evidence: 12 focused tests pass across 4 files, including 100/100, missing keyword density and unavailable/legacy output-language rules. Typecheck and `git diff --check` pass. The U+2014/U+2015 scan of the new landing and report copy is clean.

Remaining blocker: the internal API-mode `AnalyseFlow` is still Dutch-only. Because the integration can select this flow instead of the already locale-aware partner widget, its form fields, consent, verification, progress, quota, errors and retry states prevent claiming that `/website-analyse` has complete English visitor copy. A full build and locale audit were therefore not used as completion evidence.

Partial Task 7B commit: `6a27c4e5f65d1fcf8cce11057f821457022a50bb` (`feat: localize website analysis landing and report chrome`). Fresh pre-commit verification: 12 focused tests passed across 4 files, `npm run typecheck` passed, and `git diff --check` passed.

## Task 7B completion: internal API analysis flow

The complete internal API-mode flow now selects an explicit Dutch or English copy record. The English journey covers the initial URL form, visitor details, privacy consent and privacy link, newsletter consent, verification instructions, six-digit validation, resend and cooldown notices, progress phases, slow-crawl and email-completion states, quota and reset notices, safe failures, retries and all associated status/alert labels. Dutch copy remains in its dedicated record and the Dutch route explicitly requests it; the English route explicitly requests English. The analysis request continues to send the selected output locale, while dynamic report findings remain governed by the existing explicit `outputLanguage` display guard.

Raw API `error` and `message` fields are no longer rendered. Start, verify, resend, quota and analysis failures map to bounded visitor-safe copy, preventing internal provider, database or implementation details from reaching either locale. English quota dates use `en-GB`; Dutch dates and wording remain unchanged.

RED evidence: `AnalyseFlow.test.tsx` had four expected failures because no English copy selector, complete state copy or safe-error mapper existed. The tests specifically failed on the English initial/details/verification/progress/failure/completion contract, strict locale selection, validation/resend wording and suppression of a simulated Firebase permission error. The first production build then reproduced a pre-existing Task 7B integration error: the website-analysis page exported both `metadata` and `generateMetadata`.

GREEN evidence: 83 analysis and website-analysis tests pass across 16 files. This includes English initial render, Dutch preservation, strict unsupported-locale rejection, validation attempt singular/plural, verification, progress, quota/reset copy, failure/retry, pending completion, privacy consent/link coverage and raw-error suppression. `npm run typecheck` passes. The production build completes all 199 static pages after retaining only the locale-aware metadata export. `git diff --check` passes, and scans find no U+2014/U+2015 characters or raw `data.error`/`data.message` render paths in the API-mode owners.

The full locale audit still reports its previously documented 59 knowledge-base findings, including the existing blocking missing Dutch hero alt text in `wordpress-backup-maken.mdx`. None is owned by this API-flow sub-scope. English remains disabled.

## Independent editorial correction matrix

The binding second-agent review in `task-7-editorial-findings.md` was applied in full. Dutch rendering and publication state remain unchanged.

| Finding | Correction | Regression evidence |
| --- | --- | --- |
| Homepage review leakage | Replaced the English review summary and attribution with the exact approved English wording. | `task7EditorialCorrections.test.ts` and English homepage render test |
| Homepage metadata | Applied the exact English title, natural English keyword set and approved Open Graph alt text. | Homepage render and source-contract tests |
| Homepage parity | Expanded the English journey to all seven disciplines and added regional, sector, testimonial, knowledge-preview, process, FAQ and CTA sections. | Full English homepage parity assertions |
| Form locale | `LeadForm` now requires and submits an explicit supported locale; contact and quotation pass it directly. English service options no longer fall back to Dutch labels. | Form-locale source contract plus shared-message tests |
| Firestore prose leakage | English contact hides response-time, opening-hours, appointment and urgent-contact prose until localized values exist. Neutral contact details remain visible. | No-Dutch-settings regression assertion |
| Contact and quotation copy | Applied both exact reviewed introductions. | Exact-copy regression assertion |
| Tools and checklist | Tool cards use link components with explicit English targets; the checklist CTA selects `/en/website-analysis/`; both exact description replacements were applied. | Tools page tests and editorial route/copy contract |
| Structured data | Checklist JSON-LD uses the exact English URL. Website analysis now emits an English breadcrumb and route. | URL and breadcrumb assertions |
| Private report | English metadata uses locale `en`, `/website-analysis/report/[token]/` and `noindex`; English CTA targets are consistent. | Report tests and editorial metadata contract |
| About and WeddingVibe | Applied the exact natural metadata title, `/about/` canonical/breadcrumb, dedicated-label sentence and English WeddingVibe destination. | About render and exact-copy assertions |
| Sitemap and slugs | English sitemap advertises `/en/about/`, `/en/request-a-quotation/` and `/en/website-analysis/`, with matching canonical, breadcrumb and internal-link targets across Task 7 owners. | Sitemap route assertions |
| Abuse wording | Applied the exact approved email-verification sentence. | Exact-copy regression assertion |

### RED

The new four-case editorial suite initially failed all four categories: homepage parity and leakage, form locale and settings leakage, routes and structured data, and exact reviewed copy. The complete test suite also exposed that importing the locale-navigation client in the tools owner broke server rendering under Vitest; the tool cards now use Next's link component with explicit English destinations.

### GREEN and final verification

- Focused Task 7/editorial suite: 7 files, 21 tests passed.
- Full suite: 57 files, 217 tests passed.
- Typecheck: passed.
- Production build: passed and generated 199 static pages.
- `git diff --check`: passed.
- U+2014/U+2015 scan of Task 7 owners: clean.
- Locale audit: completed with the same 59 knowledge-base findings and one pre-existing blocking Dutch missing-alt finding in `wordpress-backup-maken.mdx`; none is introduced or owned by Task 7.

The shared next-intl pathname table is deliberately not enabled piecemeal: adding only these four translated paths would make its generated `Link` type reject every other existing route. While English is disabled, middleware and permanent redirects continue to prevent public `/en` access. The approved English URLs above are now the sole advertised targets in Task 7 content and SEO output; the exhaustive four-language pathname table and removal of the publication redirects belong to the final all-route activation after the remaining service and knowledge-base destinations are complete.

## Re-review correction evidence

All seven re-review findings were resolved:

1. The English homepage now renders the actual Google review records returned by `getGoogleReviews`, including real quote, author, role and rating evidence. It no longer substitutes generic review claims. The real locale-selecting `BlogPreview` owner is mounted directly; its header, dates, accessibility labels, CTA and `/en/kennisbank/...` article destinations now localize with the records. No generic unlinked cards remain.
2. `RequestNewAnalysisButton` now renders `/en/website-analysis/` for English reports through a fully prefixed Next link.
3. English sitemap, tools and checklist breadcrumbs now pass locale `en`, while Dutch continues to pass or default to `nl`.
4. The English sitemap now displays and links the final `/en/`, `/en/tools/` and prepared English child URLs consistently.
5. Fully prefixed English destinations use `next/link`; locale-aware `@/i18n/navigation` links receive only locale-free Dutch/internal paths. Render tests assert final hrefs and reject `/en/en/` double prefixes.
6. English contact addresses are composed only from language-neutral street, house number, postcode and city values plus the code-owned `Belgium` label. English no longer renders Firestore `country`, `fullAddress` or `mapMarkerTitle`; the map marker uses an explicit English label.
7. The About discipline sentence is exactly `Online visibility in Google Search and AI-generated answers.`

RED: the new re-review assertions failed on generic homepage substitutes, missing real review records and BlogPreview, three Dutch breadcrumb defaults, incomplete sitemap targets, the report restart route, Dutch address fallbacks and the old About sentence.

GREEN: focused re-review and real-preview tests pass (3 files, 11 tests). The full suite passes (57 files, 220 tests), typecheck passes, the production build completes all 199 static pages, and `git diff --check` plus the U+2014/U+2015 scan are clean. The locale audit remains at the same 59 knowledge-base findings with the one pre-existing Dutch missing-alt block outside Task 7.

## Locale-aware Google review evidence

The homepage now passes its resolved `en` or `nl` locale into `getGoogleReviews`. Both Places search and details requests use that language code with region `BE`, so Google's returned quote and relative-date attribution match the requested page language. English mapping uses `Google user` and `Google review` fallbacks; Dutch retains `Google-gebruiker` and `Google review`. English deliberately ignores `originalText` when the requested translated `text` field is absent, preventing a Dutch original from silently entering the English page. The English testimonial renderer no longer marks the returned English quote as Dutch.

RED: focused tests reproduced the hard-coded `languageCode=nl`, Dutch `originalText` fallback, missing homepage locale argument and `lang="nl"` output. GREEN: 2 focused files and 6 tests pass; full suite is 58 files and 223 tests, typecheck and the 199-page production build pass, prohibited-dash/diff scans are clean, and the locale audit remains unchanged at the documented knowledge-base findings.

## Formal route integrity correction

Task 7 now links only to destinations that exist in the current shared route tree: `/en/diensten/`, `/en/regio/`, `/en/sectoren/`, `/en/realisaties/`, `/en/diensten/seo/`, `/en/diensten/webdesign/` and `/en/trouwfotograaf-limburg/`. The invented English route names were removed. The analysis restart button resolves to `/be/website-analyse/` in Dutch and `/en/website-analysis/` in English. The commercial translation briefs use the same implemented destinations.

`website-analysis-report.json` is a supplemental brief for the private, noindex analysis result. It is not an indexable public landing page and is not counted among the eight required indexable commercial briefs.

## Knowledge route ownership correction

The English homepage preview now uses the currently owned `/en/kennisbank/` route tree for both its hub CTA and article cards. It deliberately does not advertise `/en/knowledge-base/` before Task 10 supplies and verifies that pathname mapping. Dutch hub and article destinations remain unchanged. The homepage brief records the same hub and article-link contract.
