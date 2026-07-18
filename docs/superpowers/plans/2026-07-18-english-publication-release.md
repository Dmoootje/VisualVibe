# English Publication Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the complete English site under `/en/` with correct routing, canonical URLs, hreflang, sitemap coverage and crawlable internal links, while keeping the language picker hidden and French and German disabled.

**Architecture:** The central locale configuration remains the publication switch. A small pure SEO route-pair layer becomes the shared source for public Dutch and English paths, canonical URLs and hreflang. Existing data IDs and translation keys connect dynamic Dutch and English partners. The final production crawl validates the rendered result instead of trusting source-only checks.

**Tech Stack:** Next.js 15, next-intl 4, TypeScript, Vitest, Next Metadata API, XML sitemap, Node.js release-audit scripts.

## Global Constraints

- English is fully public, indexable and crawlable under `/en/`.
- Dutch remains public under `/be/`; French and German remain disabled and redirect to Dutch.
- No visible language picker is added.
- Locale detection remains disabled and `/` continues to redirect permanently to `/be/`.
- English public aliases `/en/about/`, `/en/request-a-quotation/` and `/en/website-analysis/` must resolve directly without exposing Dutch content.
- English pages use self-referencing canonicals and advertise only existing `nl-BE`, `en-BE` and `x-default` partners.
- No U+2014 or U+2015 dash characters may be introduced.
- User-owned changes outside the isolated worktree must remain untouched.

---

### Task 1: Publish English at the routing boundary

**Files:**
- Modify: `src/i18n/routing.test.ts`
- Modify: `src/middleware.test.ts`
- Modify: `src/i18n/locales.ts`
- Modify: `src/i18n/routing.ts`
- Modify: `src/middleware.ts`
- Modify: `next.config.js`

**Interfaces:**
- Consumes: `LOCALE_CONFIG: Record<SupportedLocale, LocaleConfig>`
- Produces: `getPublishedLocales(): SupportedLocale[]` returning `['nl', 'en']`; public `/be` and `/en` middleware prefixes; no `/en` redirect rules.

- [ ] **Step 1: Write failing publication-boundary tests**

Update the assertions to express the approved release:

```ts
expect(getPublishedLocales()).toEqual(["nl", "en"]);
expect(routing.locales).toEqual(["nl", "en"]);
expect(isPublicLocalePrefix("/en/contact")).toBe(true);
expect(isPublicLocalePrefix("/fr/contact")).toBe(false);
expect(isPublicLocalePrefix("/de/contact")).toBe(false);
expect(redirects.some(({ source }) => source === "/en" || source.startsWith("/en/"))).toBe(false);
for (const locale of ["fr", "de"]) {
  expect(redirects).toContainEqual({
    source: `/${locale}`,
    destination: "/be/",
    permanent: true,
  });
}
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npx vitest run src/i18n/routing.test.ts src/middleware.test.ts`

Expected: failures show that English is still disabled, `/en` is not a public prefix and English redirect rules still exist.

- [ ] **Step 3: Implement the publication switch**

Set English to published:

```ts
export const LOCALE_CONFIG: Record<SupportedLocale, LocaleConfig> = {
  nl: { status: "published" },
  en: { status: "published" },
  fr: { status: "disabled" },
  de: { status: "disabled" },
};
```

Derive public prefixes from published locales while retaining the Dutch `/be` alias:

```ts
const publicPrefix = (locale: SupportedLocale) => locale === "nl" ? "/be" : `/${locale}`;
const PUBLIC_LOCALE_PREFIXES = getPublishedLocales().map(publicPrefix);
const DISABLED_LOCALE_PREFIXES = Object.entries(LOCALE_CONFIG)
  .filter(([, config]) => config.status === "disabled")
  .map(([locale]) => `/${locale}`);
```

Remove only the two English redirect entries from `next.config.js`. Keep the root, French and German permanent redirects. Refresh stale comments in routing and redirect configuration so they describe the bilingual release.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `npx vitest run src/i18n/routing.test.ts src/middleware.test.ts`

Expected: both test files pass.

- [ ] **Step 5: Commit the routing boundary**

```bash
git add src/i18n/locales.ts src/i18n/routing.ts src/i18n/routing.test.ts src/middleware.ts src/middleware.test.ts next.config.js
git commit -m "feat: publish English locale routing"
```

---

### Task 2: Make approved English public aliases and internal links canonical

**Files:**
- Create: `src/i18n/englishPublicRoutes.test.ts`
- Modify: `next.config.js`
- Modify: `src/data/locales/en/services.ts`
- Modify: `src/data/locales/en/subservice-content/drone.ts`
- Modify: `src/data/locales/en/subservice-content/fotografie.ts`
- Modify: `src/data/locales/en/subservice-content/masterclasses.ts`
- Modify: `src/data/locales/en/subservice-content/podcasting.ts`
- Modify: `src/data/locales/en/subservice-content/seo.ts`
- Modify: `src/data/locales/en/subservice-content/videografie.ts`
- Modify: `src/data/locales/en/subservice-content/webdesign.ts`
- Modify: `src/data/locales/en/subservice-content/xr.ts`
- Modify: `content/kennisbank/en/real-estate-drone-photography.mdx`
- Modify: `content/kennisbank/en/seo-content-for-service-businesses.mdx`
- Modify: `content/kennisbank/en/what-is-a-3d-tour.mdx`
- Modify: `content/kennisbank/en/why-invest-in-a-corporate-video.mdx`

**Interfaces:**
- Consumes: Next.js `beforeFiles` rewrites and the established internal route tree.
- Produces: public English aliases that resolve to internal localized pages; source-owned English links that point at canonical `/en/diensten/`, `/en/realisaties/` and `/en/about/` destinations.

- [ ] **Step 1: Write failing alias and source-route tests**

The test loads `next.config.js` and verifies these rewrites:

```ts
const expected = [
  { source: "/en/about", destination: "/en/over-ons" },
  { source: "/en/request-a-quotation", destination: "/en/offerte-aanvragen" },
  { source: "/en/website-analysis", destination: "/en/website-analyse" },
  { source: "/en/website-analysis/report/:token", destination: "/en/website-analyse/rapport/:token" },
];
for (const rule of expected) expect(beforeFiles).toContainEqual(rule);
```

The same test recursively reads the listed English data and MDX files and rejects obsolete public path families:

```ts
for (const forbidden of [
  "/en/services/",
  "/en/case-studies/",
  "/en/about-us/",
  "/en/regions/",
  "/en/sectors/",
  "/en/wedding-photographer-limburg/",
]) {
  expect(englishPublicSource).not.toContain(forbidden);
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npx vitest run src/i18n/englishPublicRoutes.test.ts`

Expected: approved alias rewrites are absent and obsolete `/en/services/`, `/en/case-studies/` or `/en/about-us/` references are reported.

- [ ] **Step 3: Implement alias rewrites and canonicalise owned links**

Add the four exact `beforeFiles` rewrites before the existing custom-software rules. They are internal rewrites, not redirects, so the English public URL remains visible and can be canonical.

Replace source-owned route families mechanically and review every changed destination:

```text
/en/services/      -> /en/diensten/
/en/case-studies/  -> /en/realisaties/
/en/about-us/      -> /en/about/
```

For each corrected service, sector, region and case-study detail URL, use the translated display slug already exported by its data registry. Do not invent new aliases to conceal an invalid link.

- [ ] **Step 4: Run route and content validation and verify GREEN**

Run: `npx vitest run src/i18n/englishPublicRoutes.test.ts src/app/[locale]/\(site\)/task7EditorialCorrections.test.ts`

Run: `npm run validate:content`

Expected: tests pass and locale audit reports zero blocking issues.

- [ ] **Step 5: Commit aliases and link corrections**

```bash
git add next.config.js src/i18n/englishPublicRoutes.test.ts src/data/locales/en content/kennisbank/en
git commit -m "fix: canonicalize English public routes"
```

---

### Task 3: Generate canonicals and hreflang from one route-pair interface

**Files:**
- Create: `src/lib/seo/publicationRoutes.ts`
- Create: `src/lib/seo/publicationRoutes.test.ts`
- Modify: `src/lib/seo/pageMetadata.ts`
- Modify: `src/lib/seo/pageMetadata.test.ts`
- Modify: `src/app/[locale]/(site)/page.tsx`
- Modify: `src/app/[locale]/(site)/over-ons/page.tsx`
- Modify: `src/app/[locale]/(site)/contact/page.tsx`
- Modify: `src/app/[locale]/(site)/offerte-aanvragen/page.tsx`
- Modify: `src/app/[locale]/(site)/privacy/page.tsx`
- Modify: `src/app/[locale]/(site)/cookies/page.tsx`
- Modify: `src/app/[locale]/(site)/sitemap/page.tsx`
- Modify: `src/app/[locale]/(site)/diensten/page.tsx`
- Modify: `src/app/[locale]/(site)/diensten/[slug]/page.tsx`
- Modify: `src/app/[locale]/(site)/diensten/[slug]/[sub]/page.tsx`
- Modify: `src/app/[locale]/(site)/diensten/software-op-maat/page.tsx`
- Modify: `src/app/[locale]/(site)/diensten/software-op-maat/[subslug]/page.tsx`
- Modify: `src/app/[locale]/(site)/regio/page.tsx`
- Modify: `src/app/[locale]/(site)/regio/[slug]/page.tsx`
- Modify: `src/app/[locale]/(site)/sectoren/page.tsx`
- Modify: `src/app/[locale]/(site)/sectoren/[slug]/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/[category]/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/applicaties/page.tsx`
- Modify: `src/app/[locale]/(site)/realisaties/applicaties/[slug]/page.tsx`
- Modify: `src/app/[locale]/(site)/tools/page.tsx`
- Modify: `src/app/[locale]/(site)/tools/seo-geo-checklist/page.tsx`
- Modify: `src/app/[locale]/(site)/website-analyse/page.tsx`

**Interfaces:**
- Produces: `type LocalePathPair = Readonly<Record<'nl' | 'en', string>>`
- Produces: `localizedPublicUrl(baseUrl: string, locale: 'nl' | 'en', path: string): string`
- Produces: `publishedLanguageAlternates(baseUrl: string, pair: LocalePathPair): Record<string, string>`
- Extends: `PageMetadataInput` with `languagePaths?: LocalePathPair`.

- [ ] **Step 1: Write failing pure route-pair and metadata tests**

```ts
const pair = { nl: "/offerte-aanvragen/", en: "/request-a-quotation/" } as const;
expect(localizedPublicUrl("https://visualvibe.be", "nl", pair.nl))
  .toBe("https://visualvibe.be/be/offerte-aanvragen/");
expect(localizedPublicUrl("https://visualvibe.be", "en", pair.en))
  .toBe("https://visualvibe.be/en/request-a-quotation/");
expect(publishedLanguageAlternates("https://visualvibe.be", pair)).toEqual({
  "nl-BE": "https://visualvibe.be/be/offerte-aanvragen/",
  "en-BE": "https://visualvibe.be/en/request-a-quotation/",
  "x-default": "https://visualvibe.be/be/offerte-aanvragen/",
});
```

For `pageMetadata`, assert the English canonical and the exact three language entries when `languagePaths` is passed. Also assert a Dutch-only metadata call without `languagePaths` does not fabricate alternates.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npx vitest run src/lib/seo/publicationRoutes.test.ts src/lib/seo/pageMetadata.test.ts`

Expected: the new helpers and `languagePaths` input do not exist.

- [ ] **Step 3: Implement the pure route-pair interface**

Normalise every path to a leading and trailing slash. Prefix Dutch with `/be` and English with `/en`. Filter alternates through `getPublishedLocales()` and use BCP 47 labels `nl-BE` and `en-BE`. Add `x-default` only when Dutch is published.

In `pageMetadata`, preserve the existing self-canonical and add:

```ts
alternates: {
  canonical: url,
  languages: languagePaths
    ? publishedLanguageAlternates(businessConfig.url, languagePaths)
    : undefined,
},
```

- [ ] **Step 4: Wire route pairs into translated page metadata**

Pass identical NL/EN paths when the public suffix is shared. Pass explicit exceptions for:

```ts
{ nl: "/over-ons/", en: "/about/" }
{ nl: "/offerte-aanvragen/", en: "/request-a-quotation/" }
{ nl: "/website-analyse/", en: "/website-analysis/" }
{ nl: "/diensten/software-op-maat/", en: "/diensten/custom-software/" }
```

For service, region, sector, realisation category, software service and application detail pages, construct both paths from the stable source ID plus `getLocalized...ById` helpers. Fix every English metadata call that currently omits `locale`, including privacy, cookies and realisations.

- [ ] **Step 5: Run metadata and representative page tests**

Run: `npx vitest run src/lib/seo/publicationRoutes.test.ts src/lib/seo/pageMetadata.test.ts src/app/[locale]/\(site\)/corePagesEnglish.test.tsx src/app/[locale]/\(site\)/englishPreviewBlockers.test.tsx src/app/[locale]/\(site\)/regio/page.test.tsx src/app/[locale]/\(site\)/regio/[slug]/page.test.tsx src/app/[locale]/\(site\)/sectoren/sectorRoutesEnglish.test.tsx src/app/[locale]/\(site\)/diensten/software-op-maat/softwareEnglish.test.tsx`

Expected: all selected tests pass; English metadata has English canonicals and valid Dutch/English partner URLs.

- [ ] **Step 6: Commit metadata and hreflang support**

```bash
git add src/lib/seo/publicationRoutes.ts src/lib/seo/publicationRoutes.test.ts src/lib/seo/pageMetadata.ts src/lib/seo/pageMetadata.test.ts src/app/[locale]
git commit -m "feat: add bilingual canonical and hreflang metadata"
```

---

### Task 4: Publish the complete English sitemap inventory

**Files:**
- Create: `src/lib/seo/publicPageInventory.ts`
- Create: `src/lib/seo/publicPageInventory.test.ts`
- Modify: `src/lib/seo/siteUrls.ts`
- Modify: `src/lib/seo/siteUrls.publication.test.ts`

**Interfaces:**
- Consumes: stable IDs from services, software services, regions, sectors, realisation categories, cases and application cases.
- Produces: `getStaticPublicRoutePairs(): PublicRoutePair[]`
- Produces: `getDataPublicRoutePairs(input): PublicRoutePair[]`
- Produces: sitemap entries for each published locale with shared language alternates.

- [ ] **Step 1: Write failing inventory and sitemap-boundary tests**

The pure inventory test must assert representative translated paths:

```ts
expect(paths).toContainEqual(expect.objectContaining({
  nl: "/diensten/webdesign/website-laten-maken/",
  en: "/diensten/web-design/business-website-design/",
}));
expect(paths).toContainEqual({
  nl: "/offerte-aanvragen/",
  en: "/request-a-quotation/",
});
expect(paths).toContainEqual(expect.objectContaining({
  nl: "/regio/limburg/",
  en: "/regio/limburg-belgium/",
}));
```

Update the sitemap publication test to require both published locale sets and to reject `/fr/` and `/de/` output.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npx vitest run src/lib/seo/publicPageInventory.test.ts src/lib/seo/siteUrls.publication.test.ts`

Expected: no reusable bilingual inventory exists and commercial English sitemap entries are absent.

- [ ] **Step 3: Implement the pure bilingual route inventory**

Build page pairs for core pages, services and subservices, custom software, regions, sectors, realisation categories and checked-in cases. Use source IDs to resolve translated slugs. Accept published Firestore application cases as function input so the pure module does not fetch external state.

Exclude Dutch-only standalone pages, internal style guides, report tokens and intentionally noindex pages. Include tools and the public website-analysis landing page because complete English content exists.

- [ ] **Step 4: Refactor sitemap generation to consume the inventory**

For each route pair, emit one entry per published locale and attach the same `nl-BE`, `en-BE` and `x-default` language map. Keep the existing indexability conditions for Firestore-dependent galleries, applications and empty realisation categories.

Keep knowledge-base entries translation-key driven. With English published, all 58 English partners enter the sitemap and each Dutch/English article pair shares consistent hreflang.

- [ ] **Step 5: Run sitemap and content tests**

Run: `npx vitest run src/lib/seo/publicPageInventory.test.ts src/lib/seo/siteUrls.publication.test.ts src/i18n/routing.test.ts`

Run: `npm run validate:content`

Expected: tests pass; locale audit reports zero blocking issues.

- [ ] **Step 6: Commit the bilingual sitemap inventory**

```bash
git add src/lib/seo/publicPageInventory.ts src/lib/seo/publicPageInventory.test.ts src/lib/seo/siteUrls.ts src/lib/seo/siteUrls.publication.test.ts
git commit -m "feat: publish complete English sitemap"
```

---

### Task 5: Prove the production release and prepare the pull request

**Files:**
- Create: `scripts/audit-english-production.mjs`
- Create: `docs/localization/english-publication-release-report.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: a running production server base URL and `/sitemap.xml`.
- Produces: a nonzero exit code for any broken sitemap target, Dutch redirect, missing self-canonical, invalid hreflang target, missing `alt` attribute or broken internal `/en/` link.

- [ ] **Step 1: Write the release audit before changing its targets**

The script must:

```js
const baseUrl = process.env.PUBLICATION_AUDIT_BASE_URL ?? "http://127.0.0.1:3210";
const requiredRepresentativePaths = [
  "/en/",
  "/en/about/",
  "/en/contact/",
  "/en/request-a-quotation/",
  "/en/privacy/",
  "/en/diensten/",
  "/en/diensten/web-design/",
  "/en/regio/limburg-belgium/",
  "/en/sectoren/construction-renovation/",
  "/en/realisaties/",
  "/en/diensten/custom-software/",
];
```

Fetch the sitemap, crawl every English sitemap URL, parse HTML links, canonicals, hreflang and image `alt` attributes, and fail with a grouped route report. Every image must have an `alt` attribute; an empty value remains valid for a decorative image. Fetch `/fr/` and `/de/` without following redirects and require `308` to `/be/`. Fetch `/en/` without following redirects and require `200`.

- [ ] **Step 2: Run complete static verification**

Run: `npm test`

Expected: all test files and tests pass.

Run: `npm run typecheck`

Expected: exit code 0.

Run: `npm run lint`

Expected: 0 errors; only the previously documented warnings are acceptable.

Run: `npm run validate:content`

Expected: subservice validation passes and locale audit reports 0 blocking issues.

Run: `rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}' .`

Expected: no matches.

Run: `npm run build`

Expected: production build succeeds and includes both `/nl` and `/en` locale output, with no `/fr` or `/de` static locale output.

- [ ] **Step 3: Run production HTTP and crawl verification**

Start: `npm start -- --hostname 127.0.0.1 --port 3210`

Run: `npm run audit:english-publication`

Expected: every sitemap and internal English target is successful, canonical and free of Dutch redirects; aliases resolve; French and German retain their permanent Dutch redirect.

- [ ] **Step 4: Perform desktop and mobile visual smoke checks**

Inspect `/en/`, `/en/diensten/`, `/en/request-a-quotation/`, `/en/privacy/`, `/en/kennisbank/`, one English article and `/en/diensten/custom-software/` at desktop and 390 by 844 mobile widths. Require English chrome, no horizontal overflow, no broken images, no visible Dutch text in shared controls and no application error content.

- [ ] **Step 5: Record evidence and commit**

Write exact command counts, route counts, warning counts and visual-check results to `docs/localization/english-publication-release-report.md`.

```bash
git add scripts/audit-english-production.mjs package.json docs/localization/english-publication-release-report.md
git commit -m "test: verify English publication release"
```

- [ ] **Step 6: Review, push and open a draft pull request**

Run: `git diff --check origin/main...HEAD`

Run: `git status --short --branch`

Expected: clean worktree and only intentional release commits ahead of `origin/main`.

Push `feat/english-publication-release` and create a draft pull request targeting `main`. The PR description must state that merging and deploying publishes English, keeps the language picker absent and leaves French and German disabled.
