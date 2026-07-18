# English Publication Release Design

Date: 18 July 2026

## Goal

Publish the completed English site under `/en/` as a normal, indexable production locale. Ahrefs and search engines must be able to crawl the complete English site directly from `/en/`. Dutch remains live under `/be/`. French and German remain unavailable. No language picker is added or exposed in this release.

## Chosen approach

Use a complete SEO publication release, not a route-only flag change.

A minimal switch would make English pages return `200`, but it would leave some commercial English pages out of the XML sitemap and could preserve incorrect Dutch canonicals. That is not sufficient for a production launch or a meaningful Ahrefs crawl. The release therefore publishes the locale and verifies its entire discoverability boundary in one change.

## Publication behaviour

- Change English from `disabled` to `published` in the central locale configuration.
- Make `nl` and `en` the only routable public locales.
- Remove the permanent `/en` to `/be` redirects.
- Keep the `/fr` and `/de` redirects to their Dutch equivalents.
- Keep locale detection disabled. The bare domain continues to redirect to `/be/` and never selects English from the browser language.
- Do not add a language picker to desktop navigation, mobile navigation, the footer or any other shared chrome.
- Direct English navigation and internal English links remain available under `/en/`.

## SEO behaviour

- Every indexable English page emits an English self-referencing canonical.
- Every Dutch and English page pair emits valid `nl-BE`, `en-BE` and `x-default` hreflang references. `x-default` points to the Dutch partner.
- A hreflang entry is emitted only when the translated partner genuinely exists. No French or German alternates are advertised.
- The XML sitemap includes the complete canonical English inventory: commercial pages, forms, legal pages, services and subservices, sectors, regions, case studies, custom software pages, tools and all 58 English knowledge-base articles.
- The sitemap uses the real public English canonical path for exceptions such as `/en/request-a-quotation/` and `/en/diensten/custom-software/`.
- English pages remain `index, follow`. There is no preview `noindex` layer.
- `robots.txt` continues to allow `/en/` and continues to reference the XML sitemap.
- Existing English structured data must use the English URL and `en-BE` language where the page has localized schema.

## Canonical route inventory

The central publication code must distinguish a route's stable identity from its public path. Routes whose Dutch and English paths are identical after the locale prefix may share the path. Routes with translated public paths must declare both paths explicitly. Sitemap generation, canonical metadata and hreflang generation must read from the same route-pair information so they cannot drift.

Knowledge-base partners continue to use their existing `translationKey`. Dynamic services, regions, sectors and case studies use their existing stable data identifiers and localized slugs. Firestore-driven pages are included only when they are published and indexable according to the existing Dutch rules.

## Failure handling

- A published English route that redirects to Dutch, returns an error, has a Dutch canonical or is missing from the expected sitemap inventory fails the release checks.
- An English page that links internally to `/be/`, except for an explicitly intentional cross-language reference, fails the locale audit.
- A sitemap or hreflang target that does not return a successful canonical page fails validation.
- Empty and intentionally non-indexable dynamic categories keep their existing `noindex` behaviour and are not forced into the sitemap.

## Verification

Automated tests are added before the publication change and must first demonstrate the current disabled behaviour.

The final release gate requires:

- Unit and publication-boundary tests for `nl` and `en` published, with `fr` and `de` disabled.
- Redirect tests proving `/en/` is no longer folded into `/be/`, while `/fr/` and `/de/` still are.
- Metadata tests for English canonical, robots and hreflang output, including translated-path exceptions.
- Sitemap tests proving English commercial and knowledge-base URLs are present and disabled locales are absent.
- Full test suite, typecheck, lint, content validation and production build.
- Production-server smoke checks for representative English home, commercial, form, legal, service, sector, region, case-study, custom-software and knowledge-base URLs.
- Crawl checks confirming sitemap and hreflang targets return successful canonical pages, internal English links do not redirect to Dutch, and meaningful images retain alt text.
- Desktop and mobile visual smoke checks on representative `/en/` pages.

## Release handoff

The change is delivered as a separate pull request from the updated `main` branch. Merging and deploying that pull request makes English public. After deployment, Ahrefs can start a crawl at the production `/en/` URL. The first crawl should use JavaScript rendering and follow internal links, canonical tags and sitemap URLs.

## Out of scope

- A visible language picker.
- Publishing or indexing French or German.
- Automatic locale detection.
- Rewriting already approved English content solely for stylistic preference.
- Changes to unrelated user-owned workspace files.
