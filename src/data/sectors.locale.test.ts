import { describe, expect, it } from "vitest";
import { sectors, getLocalizedSectorById, getSectorByLocalizedSlug } from "./sectors";
import { englishSectorEditorial } from "./locales/en/sectors";
import { getLocalizedServiceById, getServiceByLocalizedSlug } from "./services";
import { getRegionByLocalizedSlug } from "./regions";

const prohibitedTypography = /[\u2014\u2015]/u;

describe("English sector localisation", () => {
  it("covers every stable Dutch sector ID", () => {
    expect(Object.keys(englishSectorEditorial).sort()).toEqual(
      sectors.map(({ slug }) => slug).sort(),
    );
  });

  it("contains complete body, CTA, metadata, image text and locale-safe links", () => {
    for (const source of sectors) {
      const record = englishSectorEditorial[source.slug];
      expect(record.title.trim()).not.toBe("");
      expect(record.summary.trim()).not.toBe("");
      expect(record.body.trim()).not.toBe("");
      expect(record.directAnswer.trim()).not.toBe("");
      expect(record.answerIntro?.text.trim()).not.toBe("");
      expect(record.faq?.length).toBeGreaterThan(0);
      expect(record.cta.title.trim()).not.toBe("");
      expect(record.cta.description.trim()).not.toBe("");
      expect(record.cta.label.trim()).not.toBe("");
      expect(record.seo.title.trim()).not.toBe("");
      expect(record.seo.description.trim()).not.toBe("");
      expect(record.imageAlt.trim()).not.toBe("");
      expect(record.internalLinks.length).toBeGreaterThan(0);
      expect(record.internalLinks.every(({ href }) => href.startsWith("/en/"))).toBe(true);
      expect(JSON.stringify(record)).not.toMatch(prohibitedTypography);

      for (const field of [
        "answerIntro", "challengesIntro", "painPointsExpanded", "servicesTitle",
        "servicesIntro", "casesTitle", "casesIntro", "realisationsTitle",
        "realisationsIntro", "mediaTitle", "mediaIntro", "processTitle",
        "processSteps", "proofTitle", "proofPoints", "localSection", "faq",
        "ctaTitle", "ctaText",
      ] as const) {
        if (source[field] !== undefined) expect(record[field], `${source.slug}.${field}`).toBeDefined();
      }
      for (const field of ["painPoints", "painPointsExpanded", "processSteps", "proofPoints", "faq"] as const) {
        if (source[field]) expect(record[field]?.length, `${source.slug}.${field}`).toBe(source[field]?.length);
      }
    }
  });

  it("uses unique display slugs while preserving stable IDs", () => {
    const slugs = Object.values(englishSectorEditorial).map(({ displaySlug }) => displaySlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getLocalizedSectorById("bouw-renovatie", "en").slug).toBe("construction-renovation");
    expect(getSectorByLocalizedSlug("construction-renovation", "en").id).toBe("bouw-renovatie");
  });

  it("resolves every English internal link against the current route tree", () => {
    for (const record of Object.values(englishSectorEditorial)) {
      for (const { href } of record.internalLinks) {
        const segments = href.replace(/^\/en\//u, "").replace(/\/$/u, "").split("/");
        if (segments[0] === "services") {
          const service = getServiceByLocalizedSlug(segments.at(-1) ?? "", "en");
          expect(segments.length).toBe(service.service.parentSlug ? 3 : 2);
        } else if (segments[0] === "regio") {
          expect(getRegionByLocalizedSlug(segments[1] ?? "", "en").id).not.toBe("");
        } else {
          expect(["contact", "request-a-quotation", "sectoren", "realisaties"]).toContain(segments[0]);
        }
      }
    }
  });

  it("keeps every recommended service as a resolvable stable service ID", () => {
    for (const record of Object.values(englishSectorEditorial)) {
      for (const serviceId of record.recommendedServices) {
        expect(() => getLocalizedServiceById(serviceId, "en"), `${record.slug}: ${serviceId}`).not.toThrow();
      }
    }
  });
});
