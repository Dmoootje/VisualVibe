# Task 10 wave 02 remaining report

## Scope

- Completed `dronevideo-voor-bouwprojecten` as `content/kennisbank/en/drone-video-for-construction-projects.mdx`.
- Completed `gevonden-worden-in-ai-zoekresultaten-geo-aeo` as `content/kennisbank/en/how-to-appear-in-ai-search-results-geo-aeo.mdx`.
- Validated and retained both English translation briefs.
- Added recursive knowledge-base file discovery for locale subdirectories.
- Added a focused regression test proving an English MDX file is found below `content/kennisbank/en`.

## Editorial checks

- Read the complete Dutch sources, their frontmatter, sources, CTAs and linked service context before drafting.
- Used the approved English style guide, glossary and briefs.
- Preserved regulatory and platform caveats, dates, source links and the distinction between eligibility and guarantees.
- Localised titles, descriptions, slugs, image text, headings, FAQs and calls to action.
- Used English-locale public links and retained stable translation keys.
- No automatic humanizer was used.

## Verification

- `npm test -- src/lib/kennisbank/translations.test.ts`: 10 tests passed.
- `npm run typecheck`: passed.
- Repository scan for U+2014 and U+2015: no matches.
- Paragraph-leading whitespace was checked in both English MDX files.

## Review handoff

The parent agent should perform the required independent source-to-translation editorial review as part of the combined Task 10 integration review.

## Independent review evidence

### `dronevideo-voor-bouwprojecten`

- Reviewer read the complete 4,059-word Dutch source, the original 2,155-word English draft, the approved brief, style guide, glossary and linked service context.
- The first draft was rejected as materially incomplete. It reduced a five-purpose comparison to three rows, removed both application checklists, the milestone roadmap, the site-safety do/don't grid, the delivery grids, three FAQs and substantial operational, privacy, accessibility, archive and budget qualifications.
- The corrected 4,447-word English article restores every source heading and the complete informational scope without treating marketing footage as inspection evidence or weakening the Belgian and European flight caveats.
- Frontmatter now restores all five related services, four regions, four sectors and six related articles with canonical relationship paths targeting the English article slugs.
- Independent editorial decision: APPROVED after correction.

### `gevonden-worden-in-ai-zoekresultaten-geo-aeo`

- Reviewer read the complete 4,082-word Dutch source, the original 2,247-word English draft, the approved brief, style guide, glossary and relevant SEO/GEO service context.
- The first draft was rejected as materially incomplete. It removed the dated July 2026 notice, concrete vague-versus-specific examples, entity lists, schema examples, crawler comparison, FAQ checklist, media checklists and several official-source distinctions.
- The corrected 3,277-word English article restores those examples, checklists and qualifications while retaining a more economical English syntax. Platform statements remain dated and bounded; crawler access, schema and content structure are never presented as guarantees.
- Frontmatter now restores all five related services, four regions, four sectors and eight related articles with canonical relationship paths targeting the English article slugs.
- Independent editorial decision: APPROVED after correction.

### Fresh verification after independent correction

- `npm test -- src/lib/kennisbank/translations.test.ts`: 10 tests passed.
- `npm run typecheck`: passed.
- `node scripts/audit-locales.mjs`: 0 blocking issues; the reported informational issues concern English partners not yet delivered by other Task 10 work.
- `git diff --check`: no patch errors.
- `npm test`: all 73 test files and 285 tests passed.
- `npm run build`: MDX compilation and type/lint validation passed; static sitemap generation remains blocked by incomplete or non-canonical relationship data across the concurrently developing Task 10 English corpus. The build reported the corpus-wide list rather than an MDX syntax error in either reviewed article.
