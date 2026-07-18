# Task 4 report: English glossary and translation contract

## Status

Implemented the glossary, professional English localisation guide, translation brief schema and briefs directory. No page copy was translated.

## Source-context findings

Representative homepage, web design, SEO and knowledge-base copy consistently uses a practical, evidence-aware voice. It explains process and trade-offs, avoids hard performance guarantees, and connects creative production to technical and commercial outcomes. The English guide therefore requires concrete international business English rather than promotional rewriting.

The Dutch content uses `vindbaarheid` at several levels: general digital presence, visibility in search, and the reader-facing idea of being easier to find. A single rigid target would sound translated, so the glossary specifies `online visibility` as the default and documents contextual alternatives.

`Realisaties` covers both documented client projects and visual galleries. `Case studies` is the route-level default, while `selected work` is limited to galleries without a case narrative. `Offerte` normally describes a scoped, priced response, so `quotation` and `request a quotation` are preferred over the broader `proposal`.

The source treats Limburg and Belgium as meaningful service context, not disposable keyword modifiers. Geographic names are preserved, with `Limburg, Belgium` clarification for international readers where ambiguity with Dutch Limburg is possible.

## RED evidence

Command:

`npm test -- src/i18n/glossary.test.ts`

Expected failure observed before implementation:

`Cannot find module './glossary'`

The test could not load `ENGLISH_GLOSSARY` because the production module did not yet exist.

## GREEN evidence

Command:

`npm test -- src/i18n/glossary.test.ts`

Result after implementation:

- 1 test file passed
- 16 tests passed
- 0 failed

The suite checks normalized source uniqueness, required source-to-target mappings, notes and boolean preserve flags, plus preservation of SEO, AEO, GEO, FPV, VisualVibe and Limburg.

## Schema validation

The schema was checked with the Python `jsonschema` Draft 2020-12 validator. A representative complete website-service brief validated successfully. The sample covered all required fields, structured search intent, locale routes, keywords, direct answer, metadata, internal-link mapping and facts to preserve.

## Self-review

- Requirements from Task 4 and the approved design quality section were checked line by line.
- The style guide includes the mandatory full-source and 500-word-ahead workflow.
- Independent second-agent review is mandatory before acceptance.
- Paragraph-leading whitespace, U+2014, U+2015, literal Dutch syntax, unsupported claims, keyword stuffing and automatic humanizer rewrites are explicitly prohibited.
- Facts, prices, legal meaning and Belgian context are protected.
- SEO and GEO adaptation covers headings, emphasis, quotes, metadata, direct answers, internal links and locale-specific canonicals.
- A repository scan for U+2014 and U+2015 returned no matches.

## Concerns

The glossary is deliberately small and authoritative for the first high-risk terms. Content workers should add new recurring decisions through reviewed glossary changes instead of inventing page-local terminology. Keyword selection still requires page-specific research whenever the Dutch source does not establish English search behaviour reliably.

## Important finding fix

An independent review identified that the schema recorded intended English search intent but did not explicitly preserve the source-side Dutch search intent. A regression test was added first and failed because `primaryDutchSearchIntent` was absent from both `properties` and `required`.

The schema now requires `primaryDutchSearchIntent` as the main question or need answered by the Dutch source, recorded in Dutch before localisation. The style guide distinguishes this source record from the separate English `searchIntent`, which captures the target audience's researched question, intent type and geographic context.

The representative validation sample now contains `primaryDutchSearchIntent`. A negative validation removes that field and confirms one schema error with validator `required` and path `primaryDutchSearchIntent`.
