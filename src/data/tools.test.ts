import { describe, expect, it } from "vitest";
import {
  getSeoGeoChecklistItemCount,
  getSeoGeoChecklistItemsById,
  seoGeoChecklistCategories,
  toolCards,
} from "./tools";

describe("VisualVibe tools data", () => {
  it("starts the public tools collection with website analysis and SEO/GEO checklist", () => {
    expect(toolCards.map((tool) => tool.id)).toEqual(["website-analyse", "seo-geo-checklist"]);
    expect(toolCards[0]).toMatchObject({
      name: "Website analyse",
      href: "/website-analyse",
      icon: "seo",
    });
    expect(toolCards[1]).toMatchObject({
      name: "SEO/GEO checklist",
      href: "/tools/seo-geo-checklist",
      icon: "checklist",
    });
  });

  it("covers the main SEO, GEO and performance workstreams", () => {
    expect(seoGeoChecklistCategories.map((category) => category.id)).toEqual([
      "technical-seo",
      "content-keywords",
      "aio-geo",
      "structured-data",
      "performance-media",
      "local-seo",
    ]);
    expect(getSeoGeoChecklistItemCount()).toBeGreaterThanOrEqual(24);
  });

  it("looks up selected checklist items by id for PDF exports", () => {
    const selected = getSeoGeoChecklistItemsById([
      "technical-seo-indexable",
      "aio-geo-direct-answer",
      "local-seo-business-info",
    ]);

    expect(selected.map((item) => item.id)).toEqual([
      "technical-seo-indexable",
      "aio-geo-direct-answer",
      "local-seo-business-info",
    ]);
    expect(selected[0].categoryTitle).toBe("Technische SEO");
    expect(selected[1].categoryTitle).toBe("AEO/GEO & AI-vindbaarheid");
    expect(selected[2].categoryTitle).toBe("Lokale vindbaarheid");
  });
});
