import { describe, expect, it } from "vitest";
import {
  getRealisatieCategoryBySlug,
  shouldIndexRealisatieCategoryWithoutCases,
} from "./realisatieCategories";

describe("realisatie category indexing", () => {
  it("keeps linked evergreen realisatie categories indexable even before direct cases exist", () => {
    const crawledNoindexSlugs = [
      "podcasting",
      "buitenland",
      "bedrijven",
      "events",
      "sport",
      "projecten",
    ];

    for (const slug of crawledNoindexSlugs) {
      const category = getRealisatieCategoryBySlug(slug);

      expect(category, `${slug} exists`).toBeDefined();
      expect(shouldIndexRealisatieCategoryWithoutCases(category!), `${slug} indexable without cases`).toBe(true);
    }
  });
});
