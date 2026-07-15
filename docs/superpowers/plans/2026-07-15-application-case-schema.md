# Application Case Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish truthful page and project structured data for all bespoke application cases without Software App offer or review errors.

**Architecture:** Move application-case JSON-LD construction into one pure builder. The shared dynamic route passes the existing case data, canonical URL and optional cover to that builder, so every case emits a `WebPage` with a nested `CreativeWork` and no unrelated Google rating request.

**Tech Stack:** Next.js 15, React 19, TypeScript, Schema.org JSON-LD, Vitest

## Global Constraints

- Treat every application realization as a bespoke client project, not a publicly sold software product.
- Do not invent pricing, availability, testimonials or app reviews.
- Preserve project name, SEO description, cover, creator, lifecycle status and capabilities.
- Do not change Firestore data, public routes, canonical URLs, visible copy or page layout.
- Keep the existing Google reviews integration unchanged outside application detail pages.
- Do not add dependencies.
- Do not introduce U+2014 or U+2015 characters.

---

### Task 1: Replace Software App markup with project-case markup

**Files:**
- Create: `src/lib/seo/applicationCaseJsonLd.ts`
- Create: `src/lib/seo/applicationCaseJsonLd.test.ts`
- Modify: `src/app/[locale]/(site)/realisaties/applicaties/[slug]/page.tsx:14-28,119-181`

**Interfaces:**
- Consumes: `buildApplicationCaseJsonLd({ project, canonical, cover })` where `project` is `ApplicationCase`, `canonical` is a string and `cover` is an optional string.
- Produces: `Record<string, unknown>` with root `WebPage` and nested `CreativeWork` in `mainEntity`.

- [ ] **Step 1: Write the failing schema-builder regression**

Create `src/lib/seo/applicationCaseJsonLd.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { applicationCases } from "@/data/applicationCases";
import { buildApplicationCaseJsonLd } from "./applicationCaseJsonLd";

describe("buildApplicationCaseJsonLd", () => {
  it("describes a bespoke application as a project case without sales markup", () => {
    const project = applicationCases.find((item) => item.id === "pelletkachelzorg");
    if (!project) throw new Error("Pelletkachelzorg fixture ontbreekt");

    const canonical =
      "https://visualvibe.media/be/realisaties/applicaties/pelletkachelzorg-multisite-commerce-platform/";
    const cover = "https://firebasestorage.googleapis.com/pelletkachelzorg-cover.webp";
    const schema = buildApplicationCaseJsonLd({ project, canonical, cover });

    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: project.seoTitle,
      description: project.seoDescription,
      inLanguage: "nl-BE",
      isPartOf: { "@id": "https://visualvibe.media/#website" },
      publisher: { "@id": "https://visualvibe.media/#organization" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: cover,
      },
      mainEntity: {
        "@type": "CreativeWork",
        "@id": `${canonical}#project`,
        name: project.title,
        description: project.seoDescription,
        genre: "Maatwerk softwareproject",
        creativeWorkStatus: "In development",
        creator: { "@id": "https://visualvibe.media/#organization" },
        keywords: project.capabilities,
        image: cover,
      },
    });

    const serialized = JSON.stringify(schema);
    expect(serialized).not.toContain("SoftwareApplication");
    expect(serialized).not.toContain("aggregateRating");
    expect(serialized).not.toContain('"offers"');
  });
});
```

- [ ] **Step 2: Run the regression and confirm red**

Run:

```text
npm test -- --run src/lib/seo/applicationCaseJsonLd.test.ts
```

Expected: FAIL because `applicationCaseJsonLd.ts` does not exist.

- [ ] **Step 3: Implement the pure builder**

Create `src/lib/seo/applicationCaseJsonLd.ts`:

```ts
import { businessConfig } from "@/config/business.config";
import type { ApplicationCase } from "@/data/applicationCases";

export type ApplicationCaseJsonLdInput = {
  project: ApplicationCase;
  canonical: string;
  cover?: string;
};

export function buildApplicationCaseJsonLd({
  project,
  canonical,
  cover,
}: ApplicationCaseJsonLdInput): Record<string, unknown> {
  const organizationId = `${businessConfig.url}/#organization`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: project.seoTitle,
    description: project.seoDescription,
    inLanguage: "nl-BE",
    isPartOf: { "@id": `${businessConfig.url}/#website` },
    publisher: { "@id": organizationId },
    ...(cover
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: cover,
          },
        }
      : {}),
    mainEntity: {
      "@type": "CreativeWork",
      "@id": `${canonical}#project`,
      name: project.title,
      description: project.seoDescription,
      genre: "Maatwerk softwareproject",
      creativeWorkStatus: project.status === "live" ? "Published" : "In development",
      creator: { "@id": organizationId },
      keywords: project.capabilities,
      ...(cover ? { image: cover } : {}),
    },
  };
}
```

- [ ] **Step 4: Wire the route to the builder and remove the unrelated rating request**

Add this import:

```ts
import { buildApplicationCaseJsonLd } from "@/lib/seo/applicationCaseJsonLd";
```

Remove:

```ts
import { getGoogleRatingSummary } from "@/lib/reviews/google";
```

Restore the route data request to:

```ts
const [project, images] = await Promise.all([
  getApplicationCaseBySlug(slug),
  getApplicationCaseImages(),
]);
```

Replace the inline application JSON-LD object with:

```tsx
<JsonLd
  data={buildApplicationCaseJsonLd({
    project,
    canonical,
    cover,
  })}
/>
```

- [ ] **Step 5: Run the focused regression and inspect the route boundary**

Run:

```text
npm test -- --run src/lib/seo/applicationCaseJsonLd.test.ts
rg -n "SoftwareApplication|getGoogleRatingSummary|aggregateRating|offers:" "src/app/[locale]/(site)/realisaties/applicaties/[slug]/page.tsx"
```

Expected: the test passes and the search returns no matches.

- [ ] **Step 6: Run full local verification**

Run:

```text
npm test
npm run typecheck
npm run lint
npm run build
git diff --check
rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}'
```

Expected: all tests pass, typecheck has no errors, lint has no new errors, the production build succeeds, the diff has no whitespace errors and the forbidden-character scan returns no matches.

- [ ] **Step 7: Commit the schema correction**

```text
git add src/lib/seo/applicationCaseJsonLd.ts src/lib/seo/applicationCaseJsonLd.test.ts "src/app/[locale]/(site)/realisaties/applicaties/[slug]/page.tsx"
git commit -m "fix(seo): describe application cases as bespoke projects"
```
