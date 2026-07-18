# English localisation readiness report

Date: 18 July 2026

## Release status

English content is complete in the repository and remains unpublished. `src/i18n/locales.ts` keeps `en`, `fr` and `de` at `disabled`; only `nl` is `published`.

Task 12 found and fixed publication-boundary, preview and content-link defects. The public sitemap used to load and validate unpublished English articles, the knowledge-base article route used to generate English static pages, and the disabled-locale audit did not expose non-canonical English relationship paths. The enabled-English preview also exposed untranslated shared knowledge-base chrome and Firestore-dependent page failures. These defects now have regression coverage while the deployable configuration keeps English disabled.

## Content, brief and review coverage

- Dutch knowledge-base sources: 58
- English knowledge-base partners: 58
- Knowledge-base translation briefs: 58
- Stable translation-key pairing: 58 of 58
- Independent second-agent knowledge-base review: 58 of 58, recorded across the Task 10 wave review reports and their review commits
- Other English page briefs: 105: 9 commercial, 3 legal, 17 realisations, 5 regions, 11 sectors and 60 services
- Total checked-in English page briefs: 163
- Independent review of the other indexable English page inventory is recorded in `task-8-report.md`, including commercial, legal, service, region, sector and realisation coverage.

## Fresh command evidence

| Command or check | Result |
| --- | --- |
| `rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}' .` | No matches; `rg` exit 1 means the forbidden characters were absent. |
| `npm run test` | Passed: 82 test files, 318 tests. |
| `npx vitest run src/lib/seo/siteUrls.publication.test.ts` | Passed: 1 test file, 2 regression tests. The tests were observed failing before the fixes. |
| `npm run typecheck` | Passed with exit code 0. |
| `npm run lint` | Passed with 0 errors and 6 existing warnings. |
| `npm run validate:content` | Passed. Subservice audit: 46 unique pages. Locale audit: 0 issues, 0 blocking. |
| `npm run build` | Passed. 199 static pages generated; the route table contains only `/nl` locale output and no `/en`, `/fr` or `/de` static paths. |
| Production HTTP smoke test on port 3210 | Representative home, service, subservice, region, realisation, contact form, privacy, tool, knowledge-base hub, category and article URLs under `/be` returned 200. |
| Disabled-locale HTTP smoke test | `/en/`, `/fr/` and `/de/` each returned 308 to `/be/`. |
| Production `/sitemap.xml` scan | No `/en`, `/fr` or `/de` locations and no English hreflang entries. |
| Enabled-English relationship validation | Passed: 58 English articles, 591 checked knowledge-base relationship links, 0 invalid links. The regression was observed failing with 673 issues before canonicalisation. |
| Deployable locale configuration review | Routing, request locale detection, middleware, static parameters and sitemap output derive from the published locale set. No language selector exposes an unpublished locale. |
| `git diff --check` | Passed; only Git line-ending notices were printed. |
| Feature history scan from merge base `ea7c1d96168e59da9338a4a6fea5f0b973820b69` | `storage.rules` and `public/image.jpg` do not occur in feature commits. |

## Visual QA status

Visual QA passed through a temporary, non-committed enabled-English preview on 18 July 2026. The deployable configuration was restored to `en: disabled` immediately afterwards.

- Desktop viewport: home, services, contact, privacy, knowledge-base hub and a full knowledge-base article rendered with English titles, headings and chrome.
- Mobile viewport at 390 by 844: the same representative page types rendered without horizontal overflow, missing alt attributes, broken images or application-error content.
- The custom-software hub was additionally checked on desktop and mobile after final review: English H1, metadata, content and CTA labels; no Dutch leakage; no overflow, missing alt text or broken images; JSON-LD reported `en-BE` and English descriptions.
- The preview found and drove fixes for a Dutch navigation CTA, Dutch hub metadata and headings, missing code-owned English defaults for public site settings, 673 non-canonical English knowledge-base relationships, and remaining Dutch breadcrumbs, search labels, filters, accessibility labels and related-content chrome.
- A final English article scan found none of the known leaked labels (`Kennisbank`, `Zoeken`, `Zoekopdracht wissen`, `Inhoudsopgave`, `Deel dit artikel`, `Gerelateerde artikelen`, `Profielfoto van`, `Binnenkort`).

## Known non-blocking notes

- Lint reports six existing warnings: unused values in the internal blog style guide and SEO components, one unused XR argument, and two LeadForm warnings. There are no lint errors.
- Next.js warns about multiple lockfiles when inferring the workspace root in this linked worktree.
- Tailwind reports the existing ambiguous `duration-[450ms]` class during the build.
- English, French and German requests intentionally redirect to the Dutch `/be` equivalent while those locales remain disabled.

## Later publication procedure

After explicit approval, change English to `published`, enable `/en` routing and middleware-derived output, regenerate sitemap/hreflang and the language selector from published locales, rerun all Task 12 checks including desktop/mobile public URL smoke tests, and only then deploy.
