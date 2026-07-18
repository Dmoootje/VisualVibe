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
