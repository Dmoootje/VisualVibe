# Task 8: independent editorial review

## Sub-scope A delivery inventory and TDD evidence

This report covers the service-only boundary of Task 8. The authoritative Dutch inventory contains 8 main services and 46 subservices. English coverage contains exactly the same 54 stable IDs. Each entity has a separate schema-shaped brief in `docs/localization/briefs/services` and a natural English display slug, while its Dutch slug remains the internal ID.

- Main services (8): `webdesign`, `seo`, `fotografie`, `videografie`, `drone-fpv`, `3d-vr-ar`, `podcasting`, `masterclasses`.
- Web design (7): `website-laten-maken`, `webshop-laten-maken`, `onepager-laten-maken`, `website-vernieuwen`, `website-onderhoud`, `wordpress-website-laten-maken`, `seo-website-laten-maken`.
- SEO (5): `lokale-seo`, `technische-seo`, `seo-copywriting`, `google-business-profiel-optimalisatie`, `ai-seo-aeo-geo`.
- Photography (7): `bedrijfsfotografie`, `zakelijke-portretten`, `productfotografie`, `eventfotografie`, `vastgoedfotografie`, `realisatiefotografie`, `brandingfotografie`.
- Videography (8): `bedrijfsvideo`, `promovideo`, `social-media-video`, `event-aftermovie`, `wervingsvideo`, `testimonial-video`, `podcast-video`, `nieuwsreportage`.
- Drone and FPV (6): `dronefotografie`, `dronevideo`, `fpv-video`, `vastgoed-dronebeelden`, `realisatie-dronebeelden`, `event-dronebeelden`.
- 3D and virtual tours (5): `3d-tour`, `virtuele-rondleiding`, `showroom-3d-tour`, `vastgoed-3d-tour`, `horeca-virtuele-tour`.
- Podcasting (5): `bedrijfspodcast`, `videopodcast`, `podcast-opname`, `podcast-traject`, `podcast-voor-experts`.
- Courses and workshops (3): `opleiding-opnemen`, `online-cursus-video`, `workshop-filmen`.

RED evidence: `npm test -- src/data/services.locale.test.ts` initially failed because the English locale owner did not exist. After the strict owner and main records were introduced, the inventory assertion still listed all 46 missing subservice IDs. During implementation that same failure reduced category by category until the final photography records closed the inventory.

GREEN evidence: the focused test now passes all assertions for exact 8/46 ID coverage, complete summaries and bodies, full deep subservice editorials, CTAs, metadata, alt text, English-only public links, unique display slugs, prohibited typography and strict locale lookup. `npm run typecheck` and `npm run validate:subservices` also pass.

Boundary: this sub-scope deliberately does not modify or translate sectors, regions, municipalities, case studies or their route/component owners. English remains disabled in the locale register. Public route activation, sitemap publication and hreflang publication are therefore outside this commit. Dutch service records remain unchanged apart from the additive locale selector import/functions in their existing data owner.

Fresh final verification for sub-scope A:

- `npm test`: 60 test files and 233 tests passed.
- `npm run typecheck`: passed.
- `npm run validate:subservices`: passed for all 46 subservice pages, with complete metadata, editorial sections, FAQs, processes and internal links.
- `npm run build`: passed and generated only the published Dutch routes. Existing lint warnings in unrelated owners remain non-blocking.
- `npm run audit:locales`: completed with one pre-existing blocking Dutch knowledge-base alt-text finding (`wordpress-backup-maken.mdx`) and informational missing English knowledge-base partners. Those belong to the knowledge-base workstream, not this service sub-scope.
- Brief inventory: 54 JSON files parsed successfully.
- U+2014/U+2015 scan and `git diff --check`: clean.

## Scope

Independent source-led review of 27 English subservice editorials. The reviewer did not review the SEO translations they authored.

- Videography: `bedrijfsvideo`, `promovideo`, `social-media-video`, `event-aftermovie`, `wervingsvideo`, `testimonial-video`, `podcast-video`, `nieuwsreportage`
- Drone and FPV: `dronefotografie`, `dronevideo`, `fpv-video`, `vastgoed-dronebeelden`, `realisatie-dronebeelden`, `event-dronebeelden`
- 3D and virtual tours: `3d-tour`, `virtuele-rondleiding`, `showroom-3d-tour`, `vastgoed-3d-tour`, `horeca-virtuele-tour`
- Podcasting: `bedrijfspodcast`, `videopodcast`, `podcast-opname`, `podcast-traject`, `podcast-voor-experts`
- Courses and workshops: `opleiding-opnemen`, `online-cursus-video`, `workshop-filmen`

The English files were checked against the corresponding complete Dutch editorial objects, their translation briefs, the English style guide and the approved glossary. Review covered intent, factual limits, scope and quotation language, page structure, SEO fields, regional meaning, CTA destinations, terminology and prohibited typography.

## Findings and corrections

### Videography

All eight records preserve the source service boundaries, production dependencies, permission responsibilities and non-guaranteed outcomes. No prices, delivery promises or performance claims were added. Several passages followed Dutch syntax too closely. The corporate-video opening now uses idiomatic production language; `draaiboek` is rendered as `production schedule` or `running order` according to context rather than the ambiguous `script`; `werkwijze` is rendered by meaning; and the news-style report now clearly distinguishes commissioned corporate communication from independent journalism. The event-aftermovie overview was rewritten to remove the literal terms `registration`, `atmospheric images` and `program developed`.

### Drone and FPV

All six records retain the source's airspace, location, weather, obstacle, privacy, permission and on-the-day feasibility conditions. The review found prominent literal phrases such as `we don't just leave with a drone`, `image list`, `recordings can be performed`, `make context visible` and unidiomatic property-copy constructions. These were corrected to professional production English, including `shot list`, `production assessment`, `aerial photographs`, `property listing` and `prospective buyers or tenants`. No wording implies that VisualVibe provides legal advice or can guarantee a flight.

### 3D and virtual tours

All five records preserve the distinction between scanning, hosting, embedding, privacy, excluded areas, publication and later updating or unpublishing. The property-tour opening and supporting copy were revised to replace awkward Dutch-led constructions such as `tailor the tour to photography, publication and viewing process`, `tailor-made preparation` and `well-organized real estate media`. The revised copy uses natural property and tour terminology without altering scope.

### Podcasting

All five records retain the source distinction between format development, editorial preparation, recording, editing, hosting, publication and promotional derivatives. Account ownership, guest permission, specialist accuracy and external platform costs remain bounded by the quotation. No factual or link correction was required. Some phrasing remains intentionally restrained because the Dutch source explicitly avoids promising reach, leads or expert status.

### Courses and workshops

All three records preserve the distinction between a full recording, modular course video, summary and atmosphere-led aftermovie. Literal uses of `registration`, repeated `recording` and `full report` were corrected to `full recording`, `workshop video` and `distinct deliverables`. Hosting, platform subscriptions, licensing, upload work and e-learning design remain outside the default production scope unless expressly included.

## SEO, links and typography

- English CTA routes in the reviewed editorials point to `/en/request-a-quotation/`.
- Related-service records use stable Dutch IDs internally, as required by the locale mapping, while public routes are generated under `/en/services/`.
- No U+2014 or U+2015 dash remains in the reviewed files.
- No Dutch `Offerte`, `KMO` or Dutch public CTA route remains in the reviewed English copy.
- Regional references preserve Limburg, Belgium, Flanders, Antwerp and the Dutch province of Limburg without inventing a location or service commitment.
- Titles and descriptions remain page-specific; no English locale canonical is introduced here.

## Verification result

TypeScript and target-file linting pass after the editorial corrections. The complete locale coverage test remains dependent on photography records outside this review scope. The locale audit also reports the pre-existing Dutch knowledge-base alt-text blocker and untranslated knowledge-base partners; neither is caused by these 27 editorials.

## Review decision

Approved after correction for factual scope, idiomatic English, terminology, SEO intent, links and typography. No open finding remains within these 27 records.

## Addendum: eight main service overlays

The eight English main-service records in `src/data/locales/en/services.ts` were independently compared with the complete Dutch `services.ts` records and the relevant service briefs. Aggregator imports and merge order were deliberately left unchanged.

### Corrections made

- Removed the unsupported global promise to reply within two working days from the shared quotation CTA. The CTA now commits only to reviewing the context and proposing a defined next step.
- Reframed the SEO introduction so it describes improving conventional and AI-assisted search visibility without implying guaranteed rankings or citations.
- Restored omitted Dutch FAQ coverage for web design, SEO, photography, videography and drone/FPV, including mobile delivery, content management, usage rights, production cost factors, local SEO boundaries, contracts, rebuild decisions, video formats, regional travel and flight feasibility.
- Kept the source's three-to-five-week website and three-to-six-week video indications as qualified estimates, with the original dependencies intact.
- Clarified that drone flights remain location-specific and subject to airspace, permission and on-the-day conditions. Certification and insurance statements remain equal to the Dutch source.
- Brought the 3D/VR/AR overview back to the actual Dutch service scope. Unsupported generic `VR and AR applications` were removed from the benefit list, and the workflow now mirrors 360-degree capture, processing and integration.
- Corrected the podcast overlay so publication is not presented as automatically included. It now promises publication-ready files and publication support only when agreed.
- Aligned the masterclasses benefits and three-step process with the Dutch record instead of adding synchronised slides and other deliverables at main-service level.

### Main-service review decision

Approved after correction. The eight records preserve the Dutch factual scope, regional context, qualified timing, service dependencies and quotation model. Their English slugs, metadata, alt text and internal links remain locale-safe and page-specific. No main-service review finding remains open.

## Addendum: seven web design subservices

The seven completed web design subservice editorials and their briefs were independently compared with the full Dutch source objects:

- `website-laten-maken`
- `webshop-laten-maken`
- `onepager-laten-maken`
- `website-vernieuwen`
- `website-onderhoud`
- `wordpress-website-laten-maken`
- `seo-website-laten-maken`

### Findings and corrections

The translations preserve the source distinctions between a business website, online shop, one-page site, redesign, maintenance agreement, WordPress implementation and SEO-ready website. Prices remain quotation-based. Timelines, migration risks, external licence and platform costs, maintenance boundaries, security limits and non-guaranteed rankings remain qualified exactly where the source requires them.

The briefs use distinct English search intents, titles, H1s, slugs and direct answers rather than literal Dutch keyword translations. CTA routes and manually defined related links use English destinations. Stable Dutch IDs remain internal only, as required by the locale architecture.

Three conspicuous Dutch-led uses of `protect` were corrected. The revised copy now says that development pays close attention to accessibility and performance, that mobile layouts keep text concise and media lightweight, and that SEO-ready development maintains a clear heading structure and accurate metadata. No meaning or service commitment changed.

### Web design review decision

Approved after correction for factual scope, idiomatic English, terminology, SEO intent, links and typography. No open finding remains within the seven web design subservices or their briefs.

## Addendum: five SEO subservices

An independent reviewer compared the five SEO editorials and translation briefs with their complete Dutch source objects:

- `lokale-seo`
- `technische-seo`
- `seo-copywriting`
- `google-business-profiel-optimalisatie`
- `ai-seo-aeo-geo`

### Findings and corrections

All five translations preserve the source boundaries around ranking uncertainty, platform decisions, authorised access, specialist fact checking, external listings and the distinction between technical implementation and continuing optimisation. No traffic, lead, Google Maps placement, AI citation or recommendation guarantee was introduced.

The technical SEO copy mixed the less natural term `indexation` with `indexing` and described rendered output as being presented to `clients and crawlers`. Reader-facing overlay copy also used the Dutch-led phrase `protecting the experience`. These passages now use consistent search-industry English: `indexing`, `browsers and crawlers`, and `maintaining a usable experience`. The local SEO definition now uses `trustworthiness` and `service area`, which more accurately reflect the Dutch source than `credibility` and the ambiguous `operating area`. The AI SEO H1 now uses the standard spelling `citable`.

The five briefs used a generic audience shared across unrelated SEO services and their title and description fields did not consistently match the approved page metadata. Each audience is now specific to the service, and titles and descriptions align with the translated editorial while retaining distinct search intent. The underlying Dutch intent, regional scope and non-guarantee facts remain unchanged.

### SEO review decision

Approved after correction for factual fidelity, idiomatic English, technical terminology, SEO and GEO intent, metadata consistency, links and typography. No open finding remains within the five SEO subservices or their briefs.

## Addendum: seven photography subservices

The seven photography editorials and translation briefs were independently checked against the complete Dutch source objects:

- `bedrijfsfotografie`
- `zakelijke-portretten`
- `productfotografie`
- `eventfotografie`
- `vastgoedfotografie`
- `realisatiefotografie`
- `brandingfotografie`

### Findings and corrections

The English copy preserves the source boundaries around preparation, shot lists, participant and employee arrangements, privacy, client approvals, location conditions, retouching, usage context, delivery scope and quotation-based pricing. It does not introduce fixed delivery promises, guaranteed coverage of every event moment, misleading property presentation or unlimited third-party image rights.

Three internal destinations in the photography overlays did not match the approved English display slugs. These were corrected from `property-3d-tour`, `property-drone-footage` and `project-drone-footage` to `real-estate-3d-tour`, `real-estate-drone-footage` and `construction-project-drone-footage`. The corrected links now resolve to the equivalent English XR and drone records.

Several literal Dutch photography terms were also localised. `Event reportage` and `photo reportage` are now expressed as `event coverage`, `event story` or `photographic approach` according to context. Literal constructions such as `make our role visible`, `make an intangible offer visible` and `working method` were rewritten in idiomatic professional English. The brand-photography H1 and its brief now use `brings your story to life`; the event brief replaces unnatural search phrases with `corporate event photography coverage` and `event photo story`.

### Photography review decision

Approved after correction for factual scope, natural photography terminology, SEO intent, internal destinations and typography. No open finding remains within the seven photography editorials or briefs.

## Addendum: sectors, regions and municipalities

### Inventory and architecture

This sub-scope covers every current indexable sector and region owner without creating thin municipality pages:

- 10 sectors: `kmo`, `bouw-renovatie`, `horeca`, `vastgoed-immo`, `retail-webshops`, `events`, `sportclubs`, `opleidingen-masterclasses`, `wellness-beauty`, `industrie`
- 4 region hubs: `limburg`, `vlaanderen`, `antwerpen`, `nederlands-limburg`
- the sectors overview and regions overview
- every municipality name in `regionMunicipalities.ts`, preserved as a proper name under its stable region ID
- 16 validated-shape translation briefs: one for each detail page and one for each overview

English sector and region records are strict overlays keyed by the existing stable Dutch IDs. Their public display slugs are separate and locale-safe. `getLocalizedSectorById`, `getSectorByLocalizedSlug`, `getLocalizedRegionById` and `getRegionByLocalizedSlug` throw when a requested non-Dutch translation is absent. No Dutch fallback was added. English remains disabled and no sitemap, hreflang or public locale switcher setting changed.

Municipalities remain part of the GEO sections and marquee data. They are not promoted to indexable city pages because the Dutch source explicitly requires unique project evidence before such pages are created.

### Translation and review evidence

The complete Dutch records were used as the factual owners. The English overlays cover titles, card and hero copy, direct answers, challenges, services, project and media sections, process steps, proof points, local sections, FAQs, CTAs, metadata, image alt text and English internal links wherever the Dutch owner defines them.

- Set A authorship: `e25866f` (`bouw-renovatie`, `events`, `horeca`, `industrie`, `kmo`)
- Set A independent review correction: `60a30db`, narrowing `bedrijfsfeesten` to the accurate `company parties`
- Set B initial authorship: `3c4e687`
- Set B parity completion: `e78b408`, restoring every source-owned section for all five records
- Set B independent review correction: `436f5ab`, replacing generic retail, real-estate and wellness brief language with page-specific English search intent
- Region independent review removed unsupported city lists and an unsupported expansion-area claim from the English overlay and briefs before acceptance

The independent reviewers compared each English record with the complete Dutch source and its brief. Final approval covers factual limits, geographic distinctions, natural language, terminology, SEO and GEO intent, metadata, links and prohibited typography. Belgian Limburg remains explicit as `Limburg, Belgium`; `Dutch Limburg` always refers to the province in the Netherlands.

### Boundaries

This sub-scope does not modify or translate realizations or case studies, which remain owned by Task 8C. It does not create municipality detail routes, alter Firestore content or publish English. Existing image files and URLs remain unchanged.
