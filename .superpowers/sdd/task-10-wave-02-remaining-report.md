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
