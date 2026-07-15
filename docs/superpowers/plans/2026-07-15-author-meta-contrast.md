# Author Meta Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the shared service-related article author and reading-time contrast from about 3.8:1 to about 8.2:1.

**Architecture:** Keep the existing `AuthorMeta` markup and expose that focused component as a named export for a rendered regression test. Change only its inherited Tailwind foreground opacity, so every service and realization page using `ServiceRelatedPosts` receives the fix centrally.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Vitest, React DOM server renderer

## Global Constraints

- Use `text-white/65` for the shared author name and reading time.
- Keep avatar, icon, spacing, font size, responsive layout and visible copy unchanged.
- Do not add dependencies.
- Do not change unrelated low-contrast text.
- Do not introduce U+2014 or U+2015 characters.

---

### Task 1: Make shared author metadata accessible

**Files:**
- Create: `src/components/sections/ServiceRelatedPosts.test.ts`
- Modify: `src/components/sections/ServiceRelatedPosts.tsx:23-55`

**Interfaces:**
- Consumes: `AuthorMetaProps` with optional `author`, `authorImage`, `readingTime` and `className` strings.
- Produces: named component `AuthorMeta(props: AuthorMetaProps)` whose wrapper uses `text-white/65`.

- [ ] **Step 1: Write the failing rendered-component regression**

Create `src/components/sections/ServiceRelatedPosts.test.ts`:

```ts
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import * as serviceRelatedPosts from "./ServiceRelatedPosts";

type AuthorMetaProps = {
  author?: string;
  readingTime?: string;
};

describe("AuthorMeta", () => {
  it("uses the approved accessible foreground for author and reading time", () => {
    const AuthorMeta = Reflect.get(
      serviceRelatedPosts,
      "AuthorMeta",
    ) as ComponentType<AuthorMetaProps> | undefined;

    expect(AuthorMeta).toBeTypeOf("function");
    if (!AuthorMeta) return;

    const html = renderToStaticMarkup(
      createElement(AuthorMeta, {
        author: "Jens Hardy",
        readingTime: "22 min",
      }),
    );

    expect(html).toContain("text-white/65");
    expect(html).not.toContain("text-white/40");
    expect(html).toContain("Jens Hardy");
    expect(html).toContain("22 min");
  });
});
```

- [ ] **Step 2: Run the regression and confirm red**

Run:

```text
npm test -- --run src/components/sections/ServiceRelatedPosts.test.ts
```

Expected: FAIL because `AuthorMeta` is not exported yet.

- [ ] **Step 3: Export the component and apply the approved foreground**

Replace the local inline props type and function declaration with:

```tsx
export type AuthorMetaProps = {
  author?: string;
  authorImage?: string;
  readingTime?: string;
  className?: string;
};

export function AuthorMeta({
  author,
  authorImage,
  readingTime,
  className = "",
}: AuthorMetaProps) {
  if (!author && !readingTime) return null;
  return (
    <span className={`flex min-w-0 items-center gap-1.5 font-mono font-semibold text-white/65 ${className}`}>
      {author && (
        <>
          {authorImage ? (
            <Image
              src={authorImage}
              alt=""
              width={28}
              height={28}
              className="h-4 w-4 shrink-0 rounded-full border border-[#ff7500]/40 object-cover"
              aria-hidden="true"
            />
          ) : (
            <User className="h-3 w-3 shrink-0 text-[#ff7500]" aria-hidden="true" />
          )}
          <span className="truncate" aria-label={`Auteur: ${author}`}>
            {author}
          </span>
        </>
      )}
      {readingTime && <span className="shrink-0">{author ? `· ${readingTime}` : readingTime}</span>}
    </span>
  );
}
```

- [ ] **Step 4: Run focused and full tests**

Run:

```text
npm test -- --run src/components/sections/ServiceRelatedPosts.test.ts
npm test
```

Expected: the focused test passes and all test files pass.

- [ ] **Step 5: Commit the accessible metadata change**

```text
git add src/components/sections/ServiceRelatedPosts.test.ts src/components/sections/ServiceRelatedPosts.tsx
git commit -m "fix(a11y): increase article author contrast"
```
