import { describe, expect, it } from "vitest";
import {
  APPLICATION_CASE_IMAGE_SLOTS,
  applicationCases,
  getApplicationCaseByLocalizedSlug,
  getLocalizedApplicationCaseById,
} from "./applicationCases";
import { englishApplicationCaseEditorial } from "./locales/en/applicationCases";

const prohibitedTypography = /[\u2014\u2015]/u;
const obviousDutch = /\b(een|het|voor|met|bekijk|ontwikkeling|reservaties|websiteanalyse)\b/iu;

describe("English application case localisation", () => {
  it("covers every stable Dutch application case ID", () => {
    expect(Object.keys(englishApplicationCaseEditorial).sort()).toEqual(
      applicationCases.map(({ id }) => id).sort(),
    );
  });

  it("contains complete editorial copy, SEO metadata and image alt text", () => {
    for (const source of applicationCases) {
      const record = englishApplicationCaseEditorial[source.id];
      expect(record.displaySlug.trim()).not.toBe("");
      expect(record.title.trim()).not.toBe("");
      expect(record.client.trim()).not.toBe("");
      expect(record.tagline.trim()).not.toBe("");
      expect(record.excerpt.trim()).not.toBe("");
      expect(record.challenge.trim()).not.toBe("");
      expect(record.solution.trim()).not.toBe("");
      expect(record.capabilities).toHaveLength(source.capabilities.length);
      expect(record.technology).toHaveLength(source.technology.length);
      expect(record.results).toHaveLength(source.results.length);
      expect(record.ssr.points).toHaveLength(source.ssr.points.length);
      expect(record.seoTitle.trim()).not.toBe("");
      expect(record.seoDescription.trim()).not.toBe("");
      expect(Object.keys(record.imageAlts).sort()).toEqual(
        APPLICATION_CASE_IMAGE_SLOTS.map(({ slot }) => slot).sort(),
      );
      expect(Object.values(record.imageAlts).every((alt) => alt.trim().length > 0)).toBe(true);
      expect(JSON.stringify(record)).not.toMatch(prohibitedTypography);
      expect(JSON.stringify(record)).not.toMatch(obviousDutch);
    }
  });

  it("uses unique English slugs while preserving stable IDs", () => {
    const slugs = Object.values(englishApplicationCaseEditorial).map(({ displaySlug }) => displaySlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getLocalizedApplicationCaseById("bm-jumpfun", "en").slug).toBe(
      "bm-jumpfun-rental-platform",
    );
    expect(getApplicationCaseByLocalizedSlug("bm-jumpfun-rental-platform", "en").id).toBe(
      "bm-jumpfun",
    );
  });

  it("fails closed when a requested locale has no translation", () => {
    expect(() => getLocalizedApplicationCaseById("visualvibe", "fr")).toThrow(
      "Missing fr translation for applicationCase.visualvibe",
    );
    expect(() => getApplicationCaseByLocalizedSlug("visualvibe-content-platform", "de")).toThrow(
      "Missing de translation for application cases",
    );
  });
});
