# Task 10, wave 05 long: English knowledge-base translation report

## Completed scope

- `bedrijfspodcast-starten` translated as `how-to-start-a-business-podcast`
- `masterclass-opnemen-voor-bedrijven` translated as `record-a-masterclass-for-business`
- A schema-shaped translation brief was created for each article before translation.
- Both English partners preserve the Dutch source's full heading, component, table, checklist, example, FAQ, source, metadata, image, CTA and factual scope.

## Editorial method

Both Dutch source documents were read completely before drafting. Relevant podcasting and masterclass service briefs, the English style guide, glossary and existing related English articles were reviewed for context. The translations were written as complete documents in natural international business English, with localised search intent and locale-safe public links. No automatic humanizer was used.

The English documents contain no U+2014 or U+2015 characters. A targeted Dutch-residue scan found no public Dutch copy. Both documents preserve all 16 H2 sections and all 8 FAQ entries from their respective sources.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts`: 27 tests passed.
- `npm run validate:subservices`: passed.
- `npm run audit:locales`: completed with 0 blocking issues. Informational missing-partner notices concern other Task 10 articles.
- `npm run build`: compilation and type checking passed. Sitemap prerendering then stopped on the workstream-wide knowledge-base canonical-link validation set (338 issues across parallel English articles). This is an integration-state issue, not an MDX compilation failure in these two documents.
- `git diff --check` on the four owned translation files: passed.

Independent editorial review is scheduled separately by the coordinating agent, as required by the localisation style guide.

## Independent source-led review

### `bedrijfspodcast-starten`

- Status: approved after correction.
- Compared the complete 4,126-word Dutch source with the complete English article and translation brief.
- Confirmed parity for all 16 H2 sections, component blocks, two comparison tables, roadmap, examples, checklists, eight FAQ entries, sources, frontmatter fields, metadata, alt text and CTA content.
- Restored the locale-safe English link to the podcast-video service that had been dropped from the translated body.
- Replaced literal or administrative wording around the communication objective, video text area and reuse-rights duration with idiomatic, scope-equivalent English.
- Confirmed the direct answer, keyword use, Belgian legal caveat, measurement limitations and podcast accessibility guidance remain bounded by the Dutch source.

### `masterclass-opnemen-voor-bedrijven`

- Status: approved after correction.
- Compared the complete 3,835-word Dutch source with the complete English article and translation brief.
- Confirmed parity for all 16 H2 sections, component blocks, comparison table, examples, checklists, eight FAQ entries and plain answers, sources, frontmatter fields, metadata, alt text and CTA content.
- Reworked source-shaped phrases such as `content route`, `safe backup`, `set construction` and `managed knowledge asset` into natural professional English without changing the production advice.
- Confirmed the learning, reach and revenue caveats, rights distinction, captions-versus-transcript guidance, video SEO limitation and price factors remain faithful to the Dutch source.

The independent reviewer did not use an automatic humanizer. Approval covers factual and structural parity, natural language, SEO and GEO intent, metadata, alt text, English route identity, sources, FAQ/schema content and prohibited typography. Command evidence was rerun after the corrections recorded above.
