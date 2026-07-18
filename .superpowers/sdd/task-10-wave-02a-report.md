# Task 10 wave 02a report

| translationKey | Source | English partner | Brief | Result |
| --- | --- | --- | --- | --- |
| `seo-voor-websites-in-limburg` | `content/kennisbank/seo-voor-websites-in-limburg.mdx` | `content/kennisbank/en/seo-for-websites-in-limburg.mdx` | `docs/localization/briefs/knowledge-base/seo-voor-websites-in-limburg.json` | Complete |

## Editorial review

- Read and translated the complete Dutch source as one document.
- Preserved claims, qualifications, dates, author, source URLs and the Limburg, Belgium context.
- Localised the title, H1, metadata, keywords, image text, CTA, FAQ, tables, checklists and roadmap.
- Kept `translationKey` unchanged and assigned a distinct English slug.
- Rewrote internal destinations as English locale routes and checked service routes against their approved briefs.
- Confirmed that the article contains no Dutch public copy, malformed JSX, U+2014, U+2015 or paragraph-leading spaces.

## Verification

- `npm run audit:locales`: passed with 0 blocking issues. Informational findings concern translation partners assigned to other waves.
- Prohibited-character and mojibake scan of the English article: passed.
- Dutch and cross-locale route scan of the English article: passed.
- JSON parse of the translation brief: passed.
