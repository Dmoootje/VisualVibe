import { describe, expect, it } from "vitest";
import { regions, getLocalizedRegionById, getRegionByLocalizedSlug } from "./regions";
import { englishRegionEditorial } from "./locales/en/regions";
import { regionMunicipalities } from "./regionMunicipalities";

const prohibitedTypography = /[\u2014\u2015]/u;

describe("English region localisation", () => {
  it("covers every stable Dutch region ID", () => {
    expect(Object.keys(englishRegionEditorial).sort()).toEqual(
      regions.map(({ slug }) => slug).sort(),
    );
  });

  it("contains complete copy, metadata, image text, CTA and English links", () => {
    for (const record of Object.values(englishRegionEditorial)) {
      expect(record.title.trim()).not.toBe("");
      expect(record.summary.trim()).not.toBe("");
      expect(record.body.trim()).not.toBe("");
      expect(record.directAnswer.trim()).not.toBe("");
      expect(record.cta.title.trim()).not.toBe("");
      expect(record.cta.description.trim()).not.toBe("");
      expect(record.cta.label.trim()).not.toBe("");
      expect(record.seo.title.trim()).not.toBe("");
      expect(record.seo.description.trim()).not.toBe("");
      expect(record.imageAlt.trim()).not.toBe("");
      expect(record.internalLinks.length).toBeGreaterThan(0);
      expect(record.internalLinks.every(({ href }) => href.startsWith("/en/"))).toBe(true);
      expect(JSON.stringify(record)).not.toMatch(prohibitedTypography);
    }
  });

  it("uses unique locale-safe display slugs while preserving stable IDs", () => {
    const slugs = Object.values(englishRegionEditorial).map(({ displaySlug }) => displaySlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getLocalizedRegionById("nederlands-limburg", "en").slug).toBe("dutch-limburg");
    expect(getRegionByLocalizedSlug("dutch-limburg", "en").id).toBe("nederlands-limburg");
    expect(() => getLocalizedRegionById("limburg", "fr")).toThrow(
      "Missing fr translation for region.limburg",
    );
  });

  it("preserves every municipality as a proper name under its stable region ID", () => {
    for (const region of regions) {
      expect(regionMunicipalities[region.slug]?.length).toBeGreaterThan(0);
      expect(new Set(regionMunicipalities[region.slug]).size).toBe(
        regionMunicipalities[region.slug].length,
      );
    }
  });
});
