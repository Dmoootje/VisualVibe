import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("legal source inventory", () => {
  it("documents that terms translation is blocked because no Dutch public terms route exists", () => {
    const siteRoot = resolve(process.cwd(), "src/app/[locale]/(site)");
    expect(existsSync(resolve(siteRoot, "algemene-voorwaarden/page.tsx"))).toBe(false);
    expect(existsSync(resolve(siteRoot, "voorwaarden/page.tsx"))).toBe(false);
    expect(existsSync(resolve(siteRoot, "terms/page.tsx"))).toBe(false);
  });
});
