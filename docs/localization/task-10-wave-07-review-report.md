# Task 10, wave 07: independent English knowledge-base review

## Review method

The reviewer read each complete Dutch source, complete English translation, translation brief, English style guide and glossary. The review covered factual and structural parity, idiomatic international business English, Belgian context, SEO and GEO intent, metadata, image text, CTAs, components, internal links and prohibited typography. No automatic humanizer was used.

## Per-article evidence

### `website-laten-maken-kosten`

- Status: approved after correction.
- Compared the complete 4,233-word Dutch source with the complete English article and brief.
- Confirmed parity for all 15 H2 and 25 H3 sections, both comparison tables, the roadmap, checklist, example, nine FAQ entries, source methodology, frontmatter, metadata, image alt/title/caption and CTA.
- Preserved the five-source snapshot date and limitations, observed price range, VAT example, DNS Belgium wholesale-price caveat, Core Web Vitals targets and the explicit absence of an official average or VisualVibe price list.
- Removed a body H1 that did not exist in the Dutch MDX and would duplicate the template-rendered article title.
- Corrected the author route and all invented `/knowledge-base`, `/services`, `/regions` and `/sectors` paths to the public English locale's real route structure and display slugs.

### `ai-applicatie-laten-maken`

- Status: approved after correction.
- Compared the complete 1,310-word Dutch source with the complete English article and brief.
- Confirmed parity for all 13 H2 sections, examples, success measures, data and privacy constraints, cost guidance, prototype scope, frontmatter, metadata and CTA.
- Preserved the distinction between a model and the full application, the retrieval-versus-training explanation, human approval for consequential decisions, access-control boundary and real-example prototype requirement.
- Removed a body H1 absent from the Dutch MDX and corrected the author, service, region and knowledge-base routes.
- Read-aloud review found the English idiomatic and professionally restrained, with no stronger reliability, automation or supplier-independence claims than the source.

### `dronebeelden-voor-bedrijven`

- Status: approved after correction.
- Compared the complete 3,603-word Dutch source with the complete English article and brief.
- Confirmed parity for all 15 H2 sections, three feature grids, seven checklists, two comparison tables, roadmap, related-article block, examples, eight FAQ entries, sources, frontmatter, metadata and CTA.
- Preserved the risk-based category explanation, 120-metre and VLOS boundaries, Belgian geozone checks, FPV visual-observer requirement, privacy distinction and explicit legal and flight-permission caveats.
- Corrected all internal knowledge-base and service paths, including the real construction-project service slug, while leaving the external skeyes URL unchanged.
- Confirmed the copy uses `drone footage for businesses` naturally and does not turn operational conditions into promises.

### `workshop-professioneel-vastleggen`

- Status: approved after correction.
- Compared the complete 3,481-word Dutch source with the complete English article and brief.
- Confirmed parity for the H1 and all 15 H2 sections, both comparison tables, feature cards, checklists, roadmap, examples, eight FAQ entries, sources, frontmatter, metadata, image alt/title/caption and CTA.
- Preserved the separate purposes of a complete recording, highlights and modules; the distinction between recording and reuse permission; the copyright, privacy and legal caveats; human transcript review; and the limits of engagement and completion data.
- Corrected knowledge-base and service routes, including the real `workshop-video-production` display slug.
- Read-aloud review confirmed natural professional English without source-shaped Dutch syntax or generic promotional filler.

## Generic translation test review

The update in `src/lib/kennisbank/translations.test.ts` is correct for the repository's current state. It selects a discovered English post, resolves its Dutch source by stable `translationKey`, fails explicitly if that source is absent, and verifies that `getPostTranslations` returns both locale partners. This avoids the obsolete assumption that the first Dutch post has no English partner while retaining a deterministic identity check.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: 31 tests passed before another parallel workstream added its uncommitted article.
- `npm run validate:subservices`: passed for 46 unique service pages.
- `npm run audit:locales`: completed with 0 blocking issues; 30 informational notices concern Task 10 articles whose English partner has not yet landed.
- Structural comparison confirmed matching heading, component, table, link and FAQ coverage for all four source/translation pairs.
- Targeted scans found no U+2014/U+2015, paragraph-leading whitespace, mojibake or public Dutch residue in the four English files.
- `git diff --check`: passed (line-ending notices only).

A later full `npm test` run found 278 passing and 7 failing tests. Every failure has the same out-of-scope cause: the parallel, uncommitted `content/kennisbank/en/filming-an-online-course.mdx` currently declares the Dutch slug, locale and translation key, creating a duplicate `online-cursus-filmen` Dutch post. None of the failures points to the four articles reviewed here or to the generic translation-test change. This transient shared-worktree issue must be resolved by the owner of that article before final integration verification.

All four wave 07 articles are approved for integration. English remains unpublished until the complete knowledge base and final release checks are finished.
