# Missing Image Alt Regression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Geef alle opnieuw gemelde auteursfoto's en realisatie-contextbeelden een relevante alttekst zonder afbeeldingen of layout te wijzigen.

**Architecture:** Corrigeer de altprop in de vier bestaande presentatielagen waar beschikbare beschrijvingen nu worden vervangen door een lege waarde. Elke component krijgt een server-renderregressietest die de uiteindelijke HTML controleert.

**Tech Stack:** Next.js 15, React 19, TypeScript, Vitest, `react-dom/server`, `next/image`

## Global Constraints

- De auteursfoto blijft zichtbaar.
- Auteursfoto's gebruiken exact `Profielfoto van ${author}`.
- Realisatie-contextbeelden gebruiken exact `item.image.alt`.
- Geen wijzigingen aan layout, styling, routes, afbeeldingen of Firestore-data.
- U+2014 en U+2015 zijn verboden in code, documentatie, commits en PR-tekst.
- Productiecode wordt pas gewijzigd nadat de bijbehorende test om de verwachte reden rood is uitgevoerd.

---

### Task 1: Auteursalt in dienstkaarten

**Files:**
- Modify: `src/components/sections/ServiceRelatedPosts.test.ts`
- Modify: `src/components/sections/ServiceRelatedPosts.tsx:36-46`

**Interfaces:**
- Consumes: `AuthorMetaProps.author` en `AuthorMetaProps.authorImage`
- Produces: server-HTML met `alt="Profielfoto van Jens Hardy"` wanneer beide waarden aanwezig zijn

- [ ] **Step 1: Voeg de falende regressietest toe**

Breid het lokale testtype uit met `authorImage?: string` en voeg deze test toe:

```ts
it("renders a relevant alt for the author photo", () => {
  const AuthorMeta = Reflect.get(
    serviceRelatedPosts,
    "AuthorMeta",
  ) as ComponentType<AuthorMetaProps> | undefined;

  expect(AuthorMeta).toBeTypeOf("function");
  if (!AuthorMeta) return;

  const html = renderToStaticMarkup(
    createElement(AuthorMeta, {
      author: "Jens Hardy",
      authorImage: "/images/team/profielfoto.webp",
      readingTime: "22 min",
    }),
  );

  expect(html).toContain('alt="Profielfoto van Jens Hardy"');
});
```

- [ ] **Step 2: Voer de gerichte test rood uit**

Run: `npm test -- src/components/sections/ServiceRelatedPosts.test.ts`

Expected: FAIL omdat de HTML nog `alt=""` bevat.

- [ ] **Step 3: Pas alleen de altprop aan**

```tsx
<Image
  src={authorImage}
  alt={`Profielfoto van ${author}`}
  width={28}
  height={28}
  className="h-4 w-4 shrink-0 rounded-full border border-[#ff7500]/40 object-cover"
  aria-hidden="true"
/>
```

- [ ] **Step 4: Voer de gerichte test groen uit**

Run: `npm test -- src/components/sections/ServiceRelatedPosts.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit de dienstkaartcorrectie**

```bash
git add src/components/sections/ServiceRelatedPosts.test.ts src/components/sections/ServiceRelatedPosts.tsx
git commit -m "fix(a11y): describe service author photos"
```

### Task 2: Auteursalt in gedeelde blogkaarten

**Files:**
- Create: `src/features/home/BlogPreview/components/BlogCard.test.ts`
- Modify: `src/features/home/BlogPreview/components/BlogCard.tsx:133-141`

**Interfaces:**
- Consumes: `BlogCardPost.author` en `BlogCardProps.authorImage`
- Produces: server-HTML met de auteursnaam in de alttekst

- [ ] **Step 1: Maak de falende server-rendertest**

```ts
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { BlogCardPost } from "@/lib/kennisbank/blogCard";
import { BlogCard } from "./BlogCard";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) =>
    createElement("a", { href }, children),
}));

describe("BlogCard", () => {
  it("renders a relevant alt for the author photo", () => {
    const post: BlogCardPost = {
      title: "Testartikel",
      slug: "testartikel",
      categorySlug: "seo-geo",
      category: "SEO & GEO",
      publishedAt: "2026-07-15T10:00:00.000Z",
      readingTime: "5 min",
      author: "Jens Hardy",
      excerpt: "Testsamenvatting",
    };

    const html = renderToStaticMarkup(
      createElement(BlogCard, {
        post,
        index: 0,
        authorImage: "/images/team/profielfoto.webp",
      }),
    );

    expect(html).toContain('alt="Profielfoto van Jens Hardy"');
  });
});
```

- [ ] **Step 2: Voer de nieuwe test rood uit**

Run: `npm test -- src/features/home/BlogPreview/components/BlogCard.test.ts`

Expected: FAIL omdat de auteursfoto nog een lege alt heeft.

- [ ] **Step 3: Gebruik de auteursnaam in de altprop**

Vervang alleen `alt=""` door:

```tsx
alt={`Profielfoto van ${post.author}`}
```

- [ ] **Step 4: Voer de test groen uit**

Run: `npm test -- src/features/home/BlogPreview/components/BlogCard.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit de gedeelde blogkaartcorrectie**

```bash
git add src/features/home/BlogPreview/components/BlogCard.test.ts src/features/home/BlogPreview/components/BlogCard.tsx
git commit -m "fix(a11y): describe blog card author photos"
```

### Task 3: Auteursalt in gerelateerde artikels

**Files:**
- Create: `src/components/blog/RelatedArticles.test.ts`
- Modify: `src/components/blog/RelatedArticles.tsx:90-98`

**Interfaces:**
- Consumes: `RelatedArticle.author` en `RelatedArticle.authorImage`
- Produces: server-HTML met de auteursnaam in de alttekst

- [ ] **Step 1: Maak de falende server-rendertest**

```ts
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RelatedArticles } from "./RelatedArticles";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) =>
    createElement("a", { href }, children),
}));
vi.mock("@/lib/kennisbank/posts", () => ({ getAllPosts: () => [] }));
vi.mock("@/lib/firestore/profiles", () => ({ getAuthorPhotoMap: async () => ({}) }));

describe("RelatedArticles", () => {
  it("renders a relevant alt for the author photo", async () => {
    const element = await RelatedArticles({
      items: [
        {
          title: "Gerelateerd artikel",
          href: "/kennisbank/seo-geo/gerelateerd-artikel",
          author: "Jens Hardy",
          authorImage: "/images/team/profielfoto.webp",
        },
      ],
    });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('alt="Profielfoto van Jens Hardy"');
  });
});
```

- [ ] **Step 2: Voer de nieuwe test rood uit**

Run: `npm test -- src/components/blog/RelatedArticles.test.ts`

Expected: FAIL omdat de auteursfoto nog een lege alt heeft.

- [ ] **Step 3: Gebruik de auteursnaam in de altprop**

Vervang alleen `alt=""` door:

```tsx
alt={`Profielfoto van ${item.author}`}
```

- [ ] **Step 4: Voer de test groen uit**

Run: `npm test -- src/components/blog/RelatedArticles.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit de gerelateerde-artikelcorrectie**

```bash
git add src/components/blog/RelatedArticles.test.ts src/components/blog/RelatedArticles.tsx
git commit -m "fix(a11y): describe related article authors"
```

### Task 4: Altteksten in realisatie-contextkaarten

**Files:**
- Create: `src/components/realisaties/RealisatieContextGrid.test.ts`
- Modify: `src/components/realisaties/RealisatieContextGrid.tsx:41-46`

**Interfaces:**
- Consumes: `HubContextItem.image.alt`
- Produces: server-HTML waarin de bestaande projectbeschrijving als alt staat

- [ ] **Step 1: Maak de falende server-rendertest**

```ts
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RealisatieContextGrid } from "./RealisatieContextGrid";

vi.mock("@/i18n/navigation", () => ({ Link: () => null }));

describe("RealisatieContextGrid", () => {
  it("uses the existing project description for the context image", () => {
    const html = renderToStaticMarkup(
      createElement(RealisatieContextGrid, {
        items: [
          {
            slug: "bedrijven",
            title: "Bedrijven",
            description: "Projecten voor bedrijven",
            image: {
              src: "/portfolio/bm-jumpfun-cover.webp",
              alt: "BM Jumpfun maatwerkplatform door VisualVibe",
            },
            count: 1,
          },
        ],
      }),
    );

    expect(html).toContain('alt="BM Jumpfun maatwerkplatform door VisualVibe"');
  });
});
```

- [ ] **Step 2: Voer de nieuwe test rood uit**

Run: `npm test -- src/components/realisaties/RealisatieContextGrid.test.ts`

Expected: FAIL omdat de contextafbeelding nog `alt=""` rendert.

- [ ] **Step 3: Geef de bestaande beschrijving door**

Vervang de bestaande comment en de lege alt door:

```tsx
{/* Inhoudelijk projectvoorbeeld met de bestaande projectspecifieke alttekst. */}
<Image
  src={item.image.src}
  alt={item.image.alt}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
  className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
/>
```

- [ ] **Step 4: Voer de test groen uit**

Run: `npm test -- src/components/realisaties/RealisatieContextGrid.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit de realisatiecorrectie**

```bash
git add src/components/realisaties/RealisatieContextGrid.test.ts src/components/realisaties/RealisatieContextGrid.tsx
git commit -m "fix(a11y): describe realisation context images"
```

### Task 5: Volledige verificatie

**Files:**
- Verify only

**Interfaces:**
- Consumes: alle wijzigingen uit Tasks 1 tot en met 4
- Produces: een schone, bouwbare branch zonder lege altwaarden in de vier foutlocaties

- [ ] **Step 1: Voer de vier regressietests samen uit**

Run:

```bash
npm test -- src/components/sections/ServiceRelatedPosts.test.ts src/features/home/BlogPreview/components/BlogCard.test.ts src/components/blog/RelatedArticles.test.ts src/components/realisaties/RealisatieContextGrid.test.ts
```

Expected: vier testbestanden groen.

- [ ] **Step 2: Voer alle tests uit**

Run: `npm test`

Expected: alle tests groen.

- [ ] **Step 3: Controleer types en lint**

Run: `npm run typecheck`

Expected: exitcode 0.

Run: `npm run lint`

Expected: exitcode 0 zonder nieuwe fouten.

- [ ] **Step 4: Bouw de productieversie**

Run: `npm run build`

Expected: succesvolle Next.js production build.

- [ ] **Step 5: Scan de vier productiecomponenten en verboden tekens**

Run:

```bash
rg -n -S 'alt=""' src/components/sections/ServiceRelatedPosts.tsx src/features/home/BlogPreview/components/BlogCard.tsx src/components/blog/RelatedArticles.tsx src/components/realisaties/RealisatieContextGrid.tsx
rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}'
git diff --check origin/main...HEAD
```

Expected: de eerste twee scans leveren geen treffers en `git diff --check` is schoon.

- [ ] **Step 6: Controleer de branchstatus**

Run: `git status --short --branch`

Expected: schone featurebranch die alleen de specificatie, het plan, vier regressietests en vier gerichte productiecorrecties voor deze opdracht bevat.
