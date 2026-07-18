# Task 10 independent editorial review

## Wave 01 review evidence

The reviewer read each complete Dutch source, English partner, translation brief, style guide and glossary. The review covered document-level meaning and tone, all frontmatter and public copy, headings, emphasis, components, FAQs, CTAs, image text, factual and legal limitations, SEO/GEO intent and every internal destination.

| Translation key | English partner | Independent review evidence | Result |
| --- | --- | --- | --- |
| `podcast-opnemen-met-video` | `record-a-podcast-with-video.mdx` | Full source comparison preserved the audio-first premise, production workflow, YouTube and Spotify distinctions, accessibility roles, rights limits and non-guarantee language. Rephrased an awkward rights heading into idiomatic English. Metadata, FAQ, CTA and locale-safe links checked. | APPROVED |
| `wervingsvideo-voor-personeel` | `recruitment-video-for-employers.mdx` | Full source comparison preserved equal-treatment guidance, CAO/CCT no. 38 context, employee consent limits, accessibility, measurement caveats and production scope. Removed Dutch-influenced wording in the image-rights and duration headings. Metadata, FAQ, CTA and locale-safe links checked. | APPROVED |
| `webshop-laten-maken-voor-kmo` | `online-shop-development-for-smes.mdx` | Full source comparison preserved Belgian and EU consumer, VAT, privacy, cookie, payment, delivery and withdrawal caveats without broadening legal claims. Replaced a literal closing heading with natural English. Metadata, FAQ, CTA and locale-safe links checked. | APPROVED |
| `productfotografie-voor-webshops` | `product-photography-for-online-shops.mdx` | Full source comparison preserved colour and scale limitations, SKU workflow, rights, accessibility, feed and measurement guidance. Corrected the closing heading's missing article. Metadata, FAQ, CTA and locale-safe links checked. | APPROVED |
| `seo-voor-websites-in-limburg` | `seo-for-websites-in-limburg.mdx` | Full source comparison preserved Limburg, Belgium context, search-intent framing, distance limitation, evidence requirements and ranking caveats. Expanded the brief to record every intended article link and anchor. Metadata, FAQ, CTA and all locale-safe destinations checked. | APPROVED |
| `website-vernieuwen-wanneer` | `when-to-redesign-your-website.mdx` | Full source comparison preserved the optimise/redesign/rebuild distinction, baseline and migration guidance, 301/308 and one-year redirect facts, accessibility and performance limits, and the no-ranking-guarantee caveat. Corrected the registered category label, one broken knowledge-base destination and the brief's complete link map. Metadata, FAQ and CTA checked. | APPROVED |

## Validation evidence

- All six briefs pass the Draft 2020-12 translation-brief schema.
- All six English MDX documents compile with `@mdx-js/mdx`.
- Knowledge-base translation and glossary tests pass: 2 files, 27 tests.
- TypeScript typecheck passes.
- Locale audit reports 0 blocking issues; informational notices concern untranslated articles outside this review set.
- Assigned-file scans found no U+2014/U+2015 characters, public cross-language internal links or unexplained Dutch fragments. Remaining Dutch strings are translation identities and authoritative Belgian source URLs.

All six wave 01 partners are independently APPROVED.

## Wave 03 review evidence

The reviewer read each complete Dutch source, English partner, translation brief, style guide and glossary. The review covered full frontmatter and informational parity, natural international English, factual and legal caveats, SEO/GEO intent, headings, tables, examples, FAQs, CTAs, image text and locale-safe links.

| Translation key | English partner | Independent review evidence | Result |
| --- | --- | --- | --- |
| `dronebeelden-combineren-met-bedrijfsvideo` | `combine-drone-footage-with-corporate-video.mdx` | Full comparison preserved the division of roles between aerial and ground footage, production planning, flight constraints, Belgian privacy context, accessibility and non-guarantee language. Reworked literal uses of `drone images`, `basic image`, `realization`, `flying lock` and other Dutch-influenced phrasing across metadata, lead copy, tables, headings and FAQ text. Internal destinations and CTA checked. | APPROVED |
| `podcast-voor-experts-en-consultants` | `podcast-for-experts-and-consultants.mdx` | Full comparison preserved the editorial premise, pilot and format choices, preparation workload, guest and rights considerations, distribution mechanics and measurement caveats. Rewrote literal `sender`, `delivery`, `substantive owner`, `substantive letter` and related calques into natural editorial English without strengthening commercial claims. Metadata, FAQ and links checked. | APPROVED |
| `realisatiefotografie-voor-aannemers` | `project-photography-for-contractors.mdx` | Full comparison preserved project-phase planning, site-safety requirements, image-rights limitations, attribution, copyright and licence caveats, accessibility and evidence-led case-study guidance. Replaced `realization photography`, `executor`, `readmission`, `telephone` and other machine-like wording throughout metadata, checklists, FAQ and CTA. Links and image text checked. | APPROVED |
| `wordpress-onderhoud-checklist` | `wordpress-maintenance-checklist.mdx` | Full comparison preserved the weekly, monthly, quarterly and annual schedule, backup-versus-restore distinction, staging advice, security, permissions, performance, SEO, integrations and maintenance ownership. Corrected malformed checklist questions and literal wording such as `webshop`, `at mobile speed`, `executor` and `maintenance moment`. Metadata, CTA and internal destinations checked. | APPROVED |

## Wave 03 validation evidence

- All four briefs pass the Draft 2020-12 translation-brief schema.
- All four English MDX documents compile with `@mdx-js/mdx`.
- Knowledge-base translation and glossary tests passed before a concurrent, out-of-scope article introduced an unregistered `Videography` category. The latest run has 24 passing and 3 failing assertions, all blocked during global content loading by `why-invest-in-a-corporate-video`; none of the failures identifies a wave 03 article.
- TypeScript typecheck passes.
- Locale audit reports 0 blocking issues; its informational notices concern untranslated articles outside wave 03.
- Assigned-file scans and `git diff --check` found no U+2014/U+2015 characters or whitespace errors.

All four wave 03 partners are independently APPROVED.
