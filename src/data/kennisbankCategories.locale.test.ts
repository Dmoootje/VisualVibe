import { describe, expect, it } from "vitest";
import { getLocalizedKennisbankCategoryById } from "./kennisbankCategories";

describe("localized knowledge-base categories", () => {
  it("uses the stable Dutch slug with complete English display and SEO copy", () => {
    expect(getLocalizedKennisbankCategoryById("fotografie", "en")).toMatchObject({
      slug: "fotografie",
      name: "Photography",
      description: expect.stringContaining("photography"),
      seoTitle: expect.stringContaining("Photography"),
      seoDescription: expect.stringContaining("photography"),
    });
    expect(getLocalizedKennisbankCategoryById("webdesign", "en").name).toBe("Web design");
    expect(getLocalizedKennisbankCategoryById("videografie", "en").name).toBe("Videography");
  });

  it("returns the existing Dutch category unchanged", () => {
    expect(getLocalizedKennisbankCategoryById("fotografie", "nl")).toMatchObject({
      slug: "fotografie",
      name: "Fotografie",
    });
  });
});
