# English localisation readiness report

Date: 18 July 2026

## Release status

English content is complete in the repository and remains unpublished. `src/i18n/locales.ts` keeps `en`, `fr` and `de` at `disabled`; only `nl` is `published`.

Task 12 found and fixed two publication-boundary defects. The public sitemap used to load and validate unpublished English articles, and the knowledge-base article route used to generate English static pages. Both now derive their output from `getPublishedLocales()`. A regression test covers the sitemap, hreflang-alternate and article-generation boundaries.

## Content, brief and review coverage

- Dutch knowledge-base sources: 58
- English knowledge-base partners: 58
- Knowledge-base translation briefs: 58
- Stable translation-key pairing: 58 of 58
- Independent second-agent knowledge-base review: 58 of 58, recorded across the Task 10 wave review reports and their review commits
- Other English page briefs: 99: 9 commercial, 3 legal, 17 realisations, 5 regions, 11 sectors and 54 services
- Total checked-in English page briefs: 157
- Independent review of the other indexable English page inventory is recorded in `task-8-report.md`, including commercial, legal, service, region, sector and realisation coverage.

## Fresh command evidence

| Command or check | Result |
| --- | --- |
| `rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}' .` | No matches; `rg` exit 1 means the forbidden characters were absent. |
| `npm run test` | Passed: 75 test files, 294 tests. |
| `npx vitest run src/lib/seo/siteUrls.publication.test.ts` | Passed: 1 test file, 2 regression tests. The tests were observed failing before the fixes. |
| `npm run typecheck` | Passed with exit code 0. |
| `npm run lint` | Passed with 0 errors and 6 existing warnings. |
| `npm run validate:content` | Passed. Subservice audit: 46 unique pages. Locale audit: 0 issues, 0 blocking. |
| `npm run build` | Passed. 199 static pages generated; the route table contains only `/nl` locale output and no `/en`, `/fr` or `/de` static paths. |
| Production HTTP smoke test on port 3210 | Representative home, service, subservice, region, realisation, contact form, privacy, tool, knowledge-base hub, category and article URLs under `/be` returned 200. |
| Disabled-locale HTTP smoke test | `/en/`, `/fr/` and `/de/` each returned 308 to `/be/`. |
| Production `/sitemap.xml` scan | No `/en`, `/fr` or `/de` locations and no English hreflang entries. |
| Deployable locale configuration review | Routing, request locale detection, middleware, static parameters and sitemap output derive from the published locale set. No language selector exposes an unpublished locale. |
| `git diff --check` | Passed; only Git line-ending notices were printed. |
| Feature history scan from merge base `ea7c1d96168e59da9338a4a6fea5f0b973820b69` | `storage.rules` and `public/image.jpg` do not occur in feature commits. |

## Visual QA status

Production-server visual QA is pending. The production server started successfully and the HTTP smoke test covered all representative page types, but the in-app browser reported that no browser was available. Desktop and mobile visual approval is therefore deliberately not claimed. It must be completed through the non-public test-only locale rendering path before publication.

## Known non-blocking notes

- Lint reports six existing warnings: unused values in the internal blog style guide and SEO components, one unused XR argument, and two LeadForm warnings. There are no lint errors.
- Next.js warns about multiple lockfiles when inferring the workspace root in this linked worktree.
- Tailwind reports the existing ambiguous `duration-[450ms]` class during the build.
- English, French and German requests intentionally redirect to the Dutch `/be` equivalent while those locales remain disabled.

## Later publication procedure

After explicit approval, change English to `published`, enable `/en` routing and middleware-derived output, regenerate sitemap/hreflang and the language selector from published locales, rerun all Task 12 checks including desktop/mobile public URL smoke tests, and only then deploy.
