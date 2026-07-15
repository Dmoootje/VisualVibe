# LocalBusiness Country and Price Range Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a valid uppercase Belgian country code and the requested `$$` price range in VisualVibe LocalBusiness JSON-LD.

**Architecture:** Keep business facts in `businessConfig` and normalize the free-form country value only at the JSON-LD boundary. A rendered-component regression test verifies the final public schema rather than an implementation helper.

**Tech Stack:** Next.js 15, React 19, TypeScript, Vitest, React DOM server renderer

## Global Constraints

- Do not write or migrate Firestore data.
- Keep the existing LocalBusiness and site settings interfaces backward compatible.
- Use `BE` in emitted JSON-LD, even when a stored value is lowercase or a legacy country name.
- Emit `priceRange: "$$"` from central business configuration.
- Do not add dependencies.
- Do not introduce U+2014 or U+2015 characters.

---

### Task 1: Correct LocalBusiness structured data

**Files:**
- Create: `src/components/seo/LocalBusinessSettingsJsonLd.test.tsx`
- Modify: `src/config/business.config.ts`
- Modify: `src/components/seo/LocalBusinessSettingsJsonLd.tsx`

**Interfaces:**
- Consumes: `businessConfig.address.addressCountry` and a free-form `SiteSettings.country`
- Produces: LocalBusiness JSON-LD with `address.addressCountry: "BE"` and `priceRange: "$$"`

- [ ] **Step 1: Write the failing rendered-schema test**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/types/siteSettings";
import { LocalBusinessSettingsJsonLd } from "./LocalBusinessSettingsJsonLd";

function renderSchema(country: string): Record<string, unknown> {
  const settings: SiteSettings = {
    id: "default",
    ...DEFAULT_SITE_SETTINGS,
    country,
    createdAt: "2026-07-15T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z",
  };
  const html = renderToStaticMarkup(<LocalBusinessSettingsJsonLd settings={settings} />);
  const json = html.match(/<script[^>]*>(.*)<\/script>/s)?.[1];
  if (!json) throw new Error("JSON-LD script ontbreekt");
  return JSON.parse(json) as Record<string, unknown>;
}

describe("LocalBusinessSettingsJsonLd", () => {
  it("normalizes the country code and publishes the price range", () => {
    const schema = renderSchema("be");
    expect(schema).toMatchObject({
      priceRange: "$$",
      address: { addressCountry: "BE" },
    });
  });
});
```

- [ ] **Step 2: Run the test and confirm the expected failure**

Run: `npm test -- --run src/components/seo/LocalBusinessSettingsJsonLd.test.tsx`

Expected: FAIL because `priceRange` is absent and `addressCountry` is `be`.

- [ ] **Step 3: Add the central fact and boundary normalization**

Add to `businessConfig`:

```ts
priceRange: "$$",
```

Add to `LocalBusinessSettingsJsonLd.tsx`:

```ts
function normalizeAddressCountry(value?: string): string {
  const country = value?.trim();
  return country && /^[a-z]{2}$/i.test(country)
    ? country.toUpperCase()
    : businessConfig.address.addressCountry;
}
```

Use `normalizeAddressCountry(settings.country)` for `addressCountry` and add `priceRange: businessConfig.priceRange` to the LocalBusiness object.

- [ ] **Step 4: Run focused and full verification**

Run:

```text
npm test -- --run src/components/seo/LocalBusinessSettingsJsonLd.test.tsx
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: the focused test passes, all test files pass, typecheck has no errors, lint has no new errors, and the production build succeeds.

- [ ] **Step 5: Commit and update the existing PR branch**

```text
git add src/components/seo/LocalBusinessSettingsJsonLd.test.tsx src/components/seo/LocalBusinessSettingsJsonLd.tsx src/config/business.config.ts
git commit -m "fix(seo): complete local business schema"
git push origin feat/full-website-analysis-report
```
