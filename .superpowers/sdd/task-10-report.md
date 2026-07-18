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

## Wave 06 review evidence

The reviewer read the complete Dutch source, English partner and translation brief for each article, together with the English style guide and glossary. The review covered full frontmatter and informational parity, natural international English, SEO and GEO intent, headings, tables, examples, FAQs, CTAs, image text, factual limitations and locale-safe links. Official-source checks focused separately on Belgian and EU FPV requirements and platform-dependent 3D-tour functions and measurements.

| Translation key | English partner | Independent review evidence | Result |
| --- | --- | --- | --- |
| `app-laten-maken-complete-gids` | `complete-guide-to-building-an-app.mdx` | Full comparison preserved the problem-first method, user and MVP framing, platform choice, security, privacy, integrations, cost drivers, testing, maintenance and bounded AI use. Replaced literal `convenient environment` and `administrative route` wording, corrected the author route, and checked metadata, CTA and all intended links. | APPROVED |
| `fpv-video-voor-bedrijven` | `fpv-video-for-business.mdx` | Full comparison preserved the creative route model, indoor and outdoor distinctions, one-take caveat, privacy and image-rights limits, accessibility and non-guarantee language. Checked the legal claims against current EASA material, clarified the 120-metre reference point, replaced `radio shadows` and `emergency space`, corrected the article route and author route, and expanded the brief to record every intended link. | APPROVED |
| `korte-video-vs-lange-video` | `short-form-vs-long-form-video.mdx` | Full comparison preserved the no-universal-length premise, viewer-task framework, platform snapshots, retention caveats, modular production model, accessibility, measurement and channel logic. Reworked literal headings and the unnatural `use by sales` sentence while preserving metadata, examples, FAQ, CTA and destinations. | APPROVED |
| `wat-is-een-3d-tour` | `what-is-a-3d-tour.mdx` | Full comparison preserved the distinction between panoramas, spatial models, VR, AR and technical scans; capture and privacy controls; accessible alternatives; hosting and account dependency; measurement limitations; and non-guarantee language. Replaced literal media and measurement wording, aligned the brief title, and restored the complete intended link map. | APPROVED |

## Wave 06 validation evidence

- All four briefs pass the Draft 2020-12 translation-brief schema.
- All four English MDX documents compile with `@mdx-js/mdx` after frontmatter extraction.
- Glossary and knowledge-base translation tests report 26 passing assertions and one stale expectation that still assumes the concurrently authored AI-application translation is absent. The failure does not identify a wave 06 article.
- TypeScript typecheck passes.
- Locale audit reports 0 blocking issues. Its 32 informational notices concern untranslated articles outside wave 06.
- Full-repository prohibited-character scanning, assigned-file whitespace scanning, link-map comparison and `git diff --check` pass after the corrections above.

All four wave 06 partners are independently APPROVED.
