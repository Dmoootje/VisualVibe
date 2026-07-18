import { describe, expect, it } from "vitest";
import {
  getLocalizedRealisatieCategoryById,
  getRealisatieCategoryByLocalizedSlug,
  realisatieCategories,
} from "./realisatieCategories";
import { englishRealisatieCategories } from "./locales/en/realisatieCategories";

describe("realisation category localisation", () => {
  it("has a complete English overlay for every category", () => {
    expect(Object.keys(englishRealisatieCategories).sort()).toEqual(
      realisatieCategories.map(({ slug }) => slug).sort(),
    );
    for (const record of Object.values(englishRealisatieCategories)) {
      expect(record.displaySlug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(record.name.trim()).not.toBe("");
      expect(record.description.trim()).not.toBe("");
      expect(record.seoTitle.trim()).not.toBe("");
      expect(record.seoDescription.trim()).not.toBe("");
      expect(JSON.stringify(record)).not.toMatch(/[\u2014\u2015]/u);
    }
  });

  it("resolves English display slugs without changing stable IDs", () => {
    expect(getLocalizedRealisatieCategoryById("applicaties", "en").slug).toBe("applications");
    expect(getRealisatieCategoryByLocalizedSlug("case-studies-abroad", "en")?.id).toBe(
      "buitenland",
    );
  });

  it("never falls back to Dutch for an unsupported locale", () => {
    expect(() => getLocalizedRealisatieCategoryById("webdesign", "fr")).toThrow(
      "Missing fr translation for realisation category webdesign",
    );
  });
});
