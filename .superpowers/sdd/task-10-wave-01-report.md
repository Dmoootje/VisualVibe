# Task 10 wave 01 report

## Translation ledger

| Dutch source | translationKey | English partner | English slug | Brief | Status |
| --- | --- | --- | --- | --- | --- |
| `podcast-opnemen-met-video.mdx` | `podcast-opnemen-met-video` | `record-a-podcast-with-video.mdx` | `record-a-podcast-with-video` | `podcast-opnemen-met-video.json` | Complete and self-reviewed |
| `wervingsvideo-voor-personeel.mdx` | `wervingsvideo-voor-personeel` | `recruitment-video-for-employers.mdx` | `recruitment-video-for-employers` | `wervingsvideo-voor-personeel.json` | Complete and self-reviewed |
| `webshop-laten-maken-voor-kmo.mdx` | `webshop-laten-maken-voor-kmo` | `online-shop-development-for-smes.mdx` | `online-shop-development-for-smes` | `webshop-laten-maken-voor-kmo.json` | Complete and self-reviewed |
| `productfotografie-voor-webshops.mdx` | `productfotografie-voor-webshops` | `product-photography-for-online-shops.mdx` | `product-photography-for-online-shops` | `productfotografie-voor-webshops.json` | Complete and self-reviewed |

## Editorial decisions

- Used natural international business English and retained the Belgian legal, tax and geographic context.
- Localised search intent and slugs instead of translating Dutch keywords mechanically.
- Preserved the source facts, limitations, dates, rights guidance, platform caveats and non-guarantee language.
- Preserved the full section coverage, MDX content functions, FAQs, metadata, alt text, CTAs and source references.
- Rewrote all public internal routes to locale-safe English destinations and kept external authoritative sources intact.
- Used `SME`, `quotation`, `online visibility` and other approved glossary choices according to context.
- Did not use an automatic humanizer.

## Validation

| Check | Result |
| --- | --- |
| `npm run audit:locales` | Pass, 0 blocking issues. Expected informational notices remain for unassigned English partners. |
| `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts` | Passed with 2 files and 26 tests after the wave 01 category fix. A later rerun was blocked by the concurrent, unassigned `when-to-redesign-your-website` file using the unregistered display label `Web design`; none of the four wave 01 partners was reported. |
| `compileMDX` for all four English partners | Pass, all four compiled. |
| Brief required fields, route patterns, slug patterns and link records | Pass, all four briefs. |
| U+2014 and U+2015 scan on assigned MDX and brief files | Pass, no matches. |
| Public Markdown internal-link scan for destinations outside `/en/` | Pass, no matches. |
| Dutch-fragment scan and paragraph-leading whitespace review | Pass, only required Dutch identity/category values and authoritative Dutch source URLs remain. |

Independent second-agent editorial review is coordinated by the Task 10 owner as a separate acceptance step.
