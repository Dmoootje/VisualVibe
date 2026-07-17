# English Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a complete, validated English version of every public VisualVibe page and all 58 knowledge-base articles while keeping English inaccessible to visitors and search engines until a later explicit publication change.

**Architecture:** Keep shared React components and localize their content through a typed four-locale registry, `next-intl` messages, locale-aware content records, and MDX translation pairs. Existing Firestore-backed content gains localized fields only where needed. A strict readiness audit blocks publication when content, metadata, links, alt text, or translation relationships are incomplete.

**Tech Stack:** Next.js 15 App Router, TypeScript, React 19, next-intl 4, MDX, gray-matter, Zod, Firebase Admin/Firestore, Vitest, ESLint.

## Global Constraints

- Supported locales are exactly `nl`, `en`, `fr`, and `de`.
- Nederlands remains published at `/be`; English is prepared for `/en` but remains disabled.
- French and German remain disabled and do not require translated content in this implementation.
- There is no silent Dutch fallback on English pages.
- All public English content, including 58 knowledge-base articles, ships as one integrated delivery.
- Fixed and editorial content remains code-first; only already Firestore-backed content gains localized fields.
- No new general-purpose translation CMS or full Firestore content migration.
- Existing image URLs and filenames are reused; alt text, captions, and link titles are localized.
- Do not publish `/en`, English sitemap URLs, English hreflang, or an English language switcher option.
- Preserve all existing Dutch behavior and content.
- Follow the existing NOVA feature architecture and two-hop barrel exports.
- Never introduce U+2014 or U+2015 anywhere in the repository.
- Do not modify or include the user's pre-existing `storage.rules` and `public/image.jpg` changes in commits.

## Workstream Ownership

- Architecture worker owns Tasks 1 through 4 and all shared locale types, loaders, routing, validation, and scripts.
- Public-interface worker owns Tasks 5 and 6.
- Commercial-content worker owns Tasks 7 and 8.
- Knowledge-base worker owns Tasks 9 and 10.
- The lead worker owns Tasks 11 and 12 and resolves integration issues.
- Workers may run in parallel only after Task 2 establishes the shared interfaces.
- No two workers edit the same central file concurrently. Changes to shared files are queued through the architecture worker.

## File Structure

**New shared locale files**

- `src/i18n/locales.ts`: locale union, public status, locale metadata, and type guards.
- `src/i18n/content.ts`: strict locale value selector with no English-to-Dutch fallback.
- `src/i18n/content.test.ts`: locale selection tests.
- `src/i18n/readiness.ts`: readiness report types and blocking rules.
- `scripts/audit-locales.mjs`: repository-wide message, MDX, metadata, link, and publication audit.
- `src/i18n/glossary.ts`: approved English terminology.
- `messages/de.json`: German message namespace placeholder matching the four-locale architecture.

**Modified locale infrastructure**

- `src/i18n/routing.ts`: derive currently published routes from the locale registry while keeping only Dutch public.
- `src/i18n/request.ts`: load messages only for route-enabled locales.
- `src/i18n/navigation.ts`: continue using routing-derived locale behavior.
- `src/middleware.ts`: preserve `/be` behavior and reject or redirect disabled locale prefixes.
- `next.config.js`: keep `/en`, `/fr`, and `/de` non-public.
- `package.json`: add locale audit scripts to the build gate.

**Modified knowledge-base infrastructure**

- `src/types/blog.ts`: add `de` and required `translationKey` typing.
- `src/lib/kennisbank/posts.ts`: parse and index translation keys and locale-specific slugs.
- `src/lib/kennisbank/validation.ts`: require unique translation pairs and locale-correct internal links.
- `src/lib/kennisbank/urls.ts`: support four locale codes without publishing disabled locales.
- `content/kennisbank/*.mdx`: add `translationKey` to all Dutch posts.
- `content/kennisbank/en/*.mdx`: contain all 58 complete English translations.

**Localized public content**

- `messages/nl.json`, `messages/en.json`, `messages/fr.json`, `messages/de.json`: matching UI namespaces.
- `src/data/**`, `src/config/**`, `src/features/**/config/**`: convert public Dutch copy to locale-aware records following the owning feature.
- `src/components/**` and `src/app/[locale]/(site)/**`: replace hard-coded visitor-facing copy with strict locale content.
- `src/lib/email/**` and visitor-facing portions of `src/config/leadEmailServiceBlocks.ts`: locale-aware mail content.
- `src/lib/firestore/{applicationCases,droneShowcase,fotografieGalleries,siteSettings,webdesignImages,webdesignProjects}.ts`: normalize localized fields where these values are public.

---

### Task 1: Establish the four-locale registry and strict content selector

**Files:**
- Create: `src/i18n/locales.ts`
- Create: `src/i18n/content.ts`
- Test: `src/i18n/content.test.ts`
- Modify: `src/types/blog.ts`
- Modify: `src/types/lead.ts`
- Modify: `src/types/email.ts`

**Interfaces:**
- Produces: `type SupportedLocale = "nl" | "en" | "fr" | "de"`
- Produces: `type LocaleStatus = "published" | "ready" | "disabled"`
- Produces: `LOCALE_CONFIG: Record<SupportedLocale, LocaleConfig>`
- Produces: `getLocalizedRequired<T>(value: Localized<T>, locale: SupportedLocale, label: string): T`
- Produces: `getPublishedLocales(): SupportedLocale[]`

- [ ] **Step 1: Write failing strict-selection tests**

```ts
import { describe, expect, it } from "vitest";
import { getLocalizedRequired } from "./content";

describe("getLocalizedRequired", () => {
  it("returns the requested locale", () => {
    expect(getLocalizedRequired({ nl: "Hallo", en: "Hello" }, "en", "hero.title")).toBe("Hello");
  });

  it("does not fall back to Dutch", () => {
    expect(() => getLocalizedRequired({ nl: "Hallo" }, "en", "hero.title"))
      .toThrow("Missing en translation for hero.title");
  });
});
```

- [ ] **Step 2: Run `npx vitest run src/i18n/content.test.ts` and confirm failure because `content.ts` does not exist**

- [ ] **Step 3: Implement the locale registry with `nl: published` and `en`, `fr`, `de: disabled`, plus the strict selector shown in the Interfaces block**

- [ ] **Step 4: Replace separate blog, lead, and email locale unions with `SupportedLocale` or explicit compatible aliases, without changing serialized values**

- [ ] **Step 5: Run `npx vitest run src/i18n/content.test.ts` and `npm run typecheck`; expect both to pass**

- [ ] **Step 6: Commit only Task 1 files with `feat: add four-locale content foundation`**

### Task 2: Add the disabled-locale publication gate

**Files:**
- Modify: `src/i18n/routing.ts`
- Modify: `src/i18n/request.ts`
- Modify: `src/middleware.ts`
- Modify: `next.config.js`
- Test: `src/i18n/routing.test.ts`
- Test: `src/middleware.test.ts`

**Interfaces:**
- Consumes: `LOCALE_CONFIG`, `getPublishedLocales()` from Task 1.
- Produces: routing configured from published locales only.
- Produces: `isPublicLocalePrefix(pathname: string): boolean` testable middleware helper.

- [ ] **Step 1: Write tests asserting `/be` is public and `/en`, `/fr`, `/de` are not public**

```ts
expect(getPublishedLocales()).toEqual(["nl"]);
expect(isPublicLocalePrefix("/be/contact")).toBe(true);
expect(isPublicLocalePrefix("/en/contact")).toBe(false);
expect(isPublicLocalePrefix("/fr/contact")).toBe(false);
expect(isPublicLocalePrefix("/de/contact")).toBe(false);
```

- [ ] **Step 2: Run the two test files and confirm the new expectations fail**

- [ ] **Step 3: Make routing derive its active locales from `getPublishedLocales()` and preserve the `nl: /be` prefix mapping**

- [ ] **Step 4: Make middleware and Next redirects reject disabled language prefixes without creating hreflang or locale cookies**

- [ ] **Step 5: Run locale tests, `npm run typecheck`, and `npm run build`; expect `/en` to remain unavailable and the build to pass**

- [ ] **Step 6: Commit with `feat: gate unpublished locales`**

### Task 3: Build locale readiness and repository audits

**Files:**
- Create: `src/i18n/readiness.ts`
- Create: `src/i18n/readiness.test.ts`
- Create: `scripts/audit-locales.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `LocaleReadinessIssue { code, locale, source, message }`.
- Produces: `evaluateLocaleReadiness(input): { ready: boolean; issues: LocaleReadinessIssue[] }`.
- Produces: commands `npm run audit:locales` and `npm run validate:content`.

- [ ] **Step 1: Write failing tests that missing messages, metadata, alt text, translation partners, and cross-locale links each block readiness**

- [ ] **Step 2: Run `npx vitest run src/i18n/readiness.test.ts`; confirm failure**

- [ ] **Step 3: Implement deterministic readiness issue codes `missing_message`, `missing_content`, `missing_metadata`, `missing_alt`, `missing_translation_partner`, `cross_locale_link`, and `published_route_leak`**

- [ ] **Step 4: Implement `scripts/audit-locales.mjs` to scan message key parity, MDX frontmatter, locale links, forbidden public prefixes, and U+2014/U+2015**

- [ ] **Step 5: Add scripts**

```json
{
  "audit:locales": "node scripts/audit-locales.mjs",
  "validate:content": "npm run validate:subservices && npm run audit:locales"
}
```

- [ ] **Step 6: Run tests and `npm run audit:locales`; the audit may report untranslated inventory but must execute without crashing**

- [ ] **Step 7: Commit with `feat: add localization readiness audit`**

### Task 4: Create the English glossary and translation contract

**Files:**
- Create: `src/i18n/glossary.ts`
- Create: `docs/localization/english-style-guide.md`
- Test: `src/i18n/glossary.test.ts`

**Interfaces:**
- Produces: `ENGLISH_GLOSSARY` with approved source term, target term, notes, and preserve flag.
- Produces: writing rules used by all content workers.

- [ ] **Step 1: Write a test requiring unique normalized source terms and entries for `KMO`, `offerte`, `realisaties`, `websiteanalyse`, `vindbaarheid`, `AEO`, `GEO`, `FPV`, and `Limburg`**

- [ ] **Step 2: Implement glossary entries using `SME`, `quotation`, `case studies`, `website analysis`, and context-specific `online visibility`; preserve `SEO`, `AEO`, `GEO`, `FPV`, `VisualVibe`, and geographic proper names**

- [ ] **Step 3: Document English as natural international business English, preserving factual claims, prices, legal meaning, and Belgian geographic context**

- [ ] **Step 4: Run the glossary test and commit with `docs: add English localization guide`**

### Task 5: Localize shared navigation, chrome, forms, consent, and errors

**Files:**
- Modify: `messages/nl.json`
- Modify: `messages/en.json`
- Modify: `messages/fr.json`
- Create: `messages/de.json`
- Modify: `src/components/nav/Nav.tsx`
- Modify: `src/components/nav/MobileNavDrawer.tsx`
- Modify: `src/components/Footer.tsx` or the current footer owner found through `rg -n "function Footer|export.*Footer" src`
- Modify: `src/components/forms/LeadForm.tsx`
- Modify: `src/components/quote/QuoteModal.tsx`
- Modify: `src/components/consent/CookieConsent.tsx`
- Modify: `src/app/not-found.tsx`
- Test: colocated existing tests plus `src/i18n/sharedMessages.test.ts`

**Interfaces:**
- Consumes: Task 1 locale types and strict selection.
- Produces: complete Dutch and English shared message namespaces; French and German preserve schema parity while disabled.

- [ ] **Step 1: Inventory every literal visitor-facing string in the listed files with `rg -n '>[[:space:]]*[A-Za-zÀ-ÿ]|alt=|title=|placeholder='` and record each as a stable nested message key**

- [ ] **Step 2: Write a parity test that recursively compares all locale message key paths and rejects missing keys**

- [ ] **Step 3: Run the parity test and confirm failure on the current 46-byte message files**

- [ ] **Step 4: Add complete Dutch and English messages, and schema-compatible disabled-locale values for French and German that are never routed publicly**

- [ ] **Step 5: Replace hard-coded copy, aria labels, placeholders, alt text, title attributes, validation, success, and failure messages with `useTranslations` or `getTranslations` according to server/client ownership**

- [ ] **Step 6: Run focused component tests, message parity, typecheck, and locale audit**

- [ ] **Step 7: Commit with `feat: localize shared visitor interface`**

### Task 6: Localize visitor-facing emails and legal pages

**Files:**
- Modify: `src/lib/email/**`
- Modify: `src/config/leadEmailServiceBlocks.ts`
- Modify: legal page files under `src/app/[locale]/(site)` located with `rg -l "privacy|cookie|voorwaarden|conditions" src/app src/features`
- Test: existing `src/lib/email/*.test.ts` and page tests.

**Interfaces:**
- Consumes: `SupportedLocale`, glossary, and message/content selection.
- Produces: English subjects, preheaders, headings, body copy, CTA labels, footers, privacy, cookie, and terms content.

- [ ] **Step 1: Add failing mail snapshot/assertion tests for an English lead acknowledgement and English website-analysis report email**

- [ ] **Step 2: Add failing page assertions for unique English legal title, description, heading, and body**

- [ ] **Step 3: Implement locale-driven mail copy while retaining existing Dutch output byte-for-byte where tests currently assert it**

- [ ] **Step 4: Translate legal content faithfully without changing company identity, jurisdiction, contact information, retention periods, or consent semantics**

- [ ] **Step 5: Run email tests, legal page tests, typecheck, and locale audit**

- [ ] **Step 6: Commit with `feat: add English emails and legal content`**

### Task 7: Localize general commercial pages and SEO output

**Files:**
- Modify: public page owners under `src/app/[locale]/(site)/**` excluding knowledge base.
- Modify: matching `src/features/**/config/**`, `src/config/**`, and `src/data/**` records.
- Modify: `src/lib/seo/**` and `src/components/seo/**` where locale assumptions remain Dutch-only.
- Test: existing page and SEO tests plus new locale assertions colocated with each changed owner.

**Interfaces:**
- Consumes: Task 1 strict locale selection and Task 4 glossary.
- Produces: English home, about, contact, tools, website-analysis, metadata, Open Graph, JSON-LD, breadcrumbs, alt text, captions, and link titles.

- [ ] **Step 1: Generate the exact page inventory with `rg --files 'src/app/[locale]/(site)' | sort` and classify every non-admin, non-internal route**

- [ ] **Step 2: For each page owner, add a failing English render or metadata assertion before changing its content source**

- [ ] **Step 3: Convert Dutch-only content records to `Localized<T>` at their existing owning module, keeping component structure shared**

- [ ] **Step 4: Translate all visible copy, metadata, FAQ/schema text, accessible names, alt text, captions, and title attributes using the style guide**

- [ ] **Step 5: Verify every internal English link is generated through locale-aware navigation and never hard-coded to `/be`**

- [ ] **Step 6: Run all affected page tests, SEO tests, typecheck, and locale audit**

- [ ] **Step 7: Commit with `feat: localize core marketing pages`**

### Task 8: Localize services, subservices, sectors, regions, and case studies

**Files:**
- Modify: `src/data/services.ts`
- Modify: `src/data/subservices.ts`
- Modify: `src/data/subservice-content/**`
- Modify: `src/data/serviceCategories.ts`
- Modify: `src/data/regions.ts`
- Modify: `src/data/regionMunicipalities.ts`
- Modify: sector and realization records found with `rg -l "Sector|sector|Realisatie|realisatie" src/data src/features src/components`
- Modify: corresponding route and component owners.
- Test: existing service, subservice, region, sector, and realization tests plus locale tests.

**Interfaces:**
- Produces: locale-aware commercial records keyed by stable business identifiers, with translated display slugs separated from internal IDs.

- [ ] **Step 1: Write data-shape tests that every published Dutch service, subservice, sector, region, and case has complete English title, summary, body, CTA, metadata, and image text**

- [ ] **Step 2: Run tests and record the failing entity IDs as the authoritative translation inventory**

- [ ] **Step 3: Add English content for every failing entity without duplicating React components or changing factual claims**

- [ ] **Step 4: Add natural English slugs and a locale-aware slug lookup that preserves stable internal IDs**

- [ ] **Step 5: Update related-content selectors so cards and links never mix locales**

- [ ] **Step 6: Run entity tests, route tests, typecheck, locale audit, and build**

- [ ] **Step 7: Commit with `feat: localize services regions and case studies`**

### Task 9: Add knowledge-base translation identity and validation

**Files:**
- Modify: `src/types/blog.ts`
- Modify: `src/lib/kennisbank/posts.ts`
- Modify: `src/lib/kennisbank/validation.ts`
- Modify: `src/lib/kennisbank/urls.ts`
- Modify: all 58 `content/kennisbank/*.mdx` Dutch source files.
- Test: existing knowledge-base tests and `src/lib/kennisbank/translations.test.ts`.

**Interfaces:**
- Produces: required `translationKey: string` on `BlogPost`.
- Produces: `getPostTranslations(translationKey: string): Partial<Record<SupportedLocale, BlogPost>>`.
- Produces: validation codes for duplicate keys, missing English partner, and cross-locale links.

- [ ] **Step 1: Write failing tests for unique translation keys, locale-specific slug lookup, and English-partner readiness**

- [ ] **Step 2: Add a stable kebab-case `translationKey` to every Dutch article, normally equal to the current Dutch slug, and reject duplicates**

- [ ] **Step 3: Update loader, URL helpers, related-post logic, and validation to group by translation key while resolving locale-specific slugs**

- [ ] **Step 4: Keep the missing-English-partner check available to readiness auditing without breaking the still-Dutch-only production build before Task 10**

- [ ] **Step 5: Run knowledge-base tests, typecheck, and commit with `feat: add knowledge base translation identities`**

### Task 10: Translate all 58 knowledge-base articles

**Files:**
- Create: `content/kennisbank/en/*.mdx`, exactly one file for each Dutch `translationKey`.
- Modify: `src/data/kennisbankCategories.ts`
- Modify: knowledge-base hub, category, article, card, CTA, and sidebar owners under `src/app/[locale]/(site)/kennisbank` and `src/components/kennisbank`, `src/components/blog`.
- Test: knowledge-base validation and render tests.

**Interfaces:**
- Consumes: Task 9 translation identity and Task 4 style guide.
- Produces: a complete English article set with valid frontmatter and locale-correct internal links.

- [ ] **Step 1: Divide the 58 source files into mutually exclusive alphabetical agent sets; each agent owns only its assigned new English MDX files**

- [ ] **Step 2: For each Dutch article, create a complete English MDX partner with the same `translationKey`, `locale: en`, natural English slug, translated title, description, headings, body, FAQ, metadata, alt text, CTA, and preserved factual values**

- [ ] **Step 3: Rewrite internal links to the matching English slug; when the target is outside the knowledge base, use the locale-aware English route mapping**

- [ ] **Step 4: Translate knowledge-base categories, hub copy, article chrome, table of contents, related-content labels, author labels, and structured data**

- [ ] **Step 5: Run `npm run audit:locales` and knowledge-base tests; require exactly 58 valid Dutch-English translation pairs and zero cross-locale internal links**

- [ ] **Step 6: Perform a second-agent language review of every English file for accuracy, natural phrasing, glossary consistency, and unchanged claims; fixes remain in the owning file set**

- [ ] **Step 7: Commit all reviewed article files and knowledge-base UI with `feat: add complete English knowledge base`**

### Task 11: Localize existing Firestore-backed public content

**Files:**
- Modify: `src/lib/firestore/applicationCases.ts`
- Modify: `src/lib/firestore/droneShowcase.ts`
- Modify: `src/lib/firestore/fotografieGalleries.ts`
- Modify: `src/lib/firestore/siteSettings.ts`
- Modify: `src/lib/firestore/webdesignImages.ts`
- Modify: `src/lib/firestore/webdesignProjects.ts`
- Modify: associated types, admin writes, and public readers.
- Test: colocated Firestore tests.

**Interfaces:**
- Consumes: `Localized<T>` and `getLocalizedRequired`.
- Produces: backward-compatible normalizers that read legacy scalar values as Dutch only and localized maps for other languages.

- [ ] **Step 1: Write tests for legacy scalar reads, localized map reads, preservation on merge writes, and an error when English is requested but absent**

- [ ] **Step 2: Add localized field types only to visitor-visible strings, including titles, descriptions, alt text, captions, and CTA labels**

- [ ] **Step 3: Preserve existing Firestore document paths and legacy Dutch data; do not run destructive migrations**

- [ ] **Step 4: Update admin merge writes so editing Dutch content cannot erase `en`, `fr`, or `de` maps**

- [ ] **Step 5: Run Firestore tests, typecheck, and locale audit**

- [ ] **Step 6: Commit with `feat: support localized dynamic site content`**

### Task 12: Integrate, audit, visually verify, and keep English disabled

**Files:**
- Modify: only files required to resolve integration defects.
- Create: `docs/localization/english-readiness-report.md`
- Modify: tests and audit fixtures as defects are found.

**Interfaces:**
- Consumes: all prior task outputs.
- Produces: final evidence that English content is complete but unpublished.

- [ ] **Step 1: Run `rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}' .`; expect no matches**

- [ ] **Step 2: Run `npm run test`; expect all Vitest suites to pass**

- [ ] **Step 3: Run `npm run typecheck`; expect exit code 0**

- [ ] **Step 4: Run `npm run lint`; expect no errors**

- [ ] **Step 5: Run `npm run validate:content`; expect zero blocking English readiness issues**

- [ ] **Step 6: Run `npm run build`; expect a successful production build with no public `/en`, `/fr`, or `/de` routes**

- [ ] **Step 7: Start the production server and verify representative home, service, subservice, region, case, form, legal, tool, knowledge-base hub, category, and article pages on desktop and mobile through a test-only locale rendering path that cannot be deployed publicly**

- [ ] **Step 8: Confirm `/en`, `/fr`, and `/de` requests remain rejected or redirected in the deployable configuration and are absent from sitemap, hreflang, navigation, and locale detection**

- [ ] **Step 9: Record commands, results, article pair count, known non-blocking language notes, and the later one-line publication procedure in `docs/localization/english-readiness-report.md`**

- [ ] **Step 10: Review `git diff --stat` and `git diff --check`; confirm `storage.rules` and `public/image.jpg` are absent from all feature commits**

- [ ] **Step 11: Commit integration fixes and the readiness report with `test: verify complete English localization`**

## Later Publication Procedure

Publication is deliberately outside this implementation. After the user explicitly approves the finished English site, a separate small change must:

1. change `en` from `disabled` to `published` in `src/i18n/locales.ts`;
2. enable `/en` in routing and middleware-derived output;
3. regenerate sitemap and hreflang from the now-published locale set;
4. expose English in the language selector;
5. run the complete Task 12 verification again;
6. deploy only after the public URL smoke test passes.

