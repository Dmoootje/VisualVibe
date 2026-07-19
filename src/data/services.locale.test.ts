import { describe, expect, it } from "vitest";
import { services } from "./services";
import { subservices } from "./subservices";
import {
  englishServiceEditorial,
  englishSubserviceEditorial,
} from "./locales/en/services";
import {
  getLocalizedServiceById,
  getServiceByLocalizedSlug,
  serviceHref,
} from "./services";

const prohibitedTypography = /[\u2014\u2015]/u;

describe("English service localisation", () => {
  it("covers every stable Dutch service ID with a complete English record", () => {
    expect(Object.keys(englishServiceEditorial).sort()).toEqual(
      services.map(({ slug }) => slug).sort(),
    );
  });

  it("covers every stable Dutch subservice ID with a complete English record", () => {
    expect(Object.keys(englishSubserviceEditorial).sort()).toEqual(
      subservices.map(({ slug }) => slug).sort(),
    );
  });

  it("contains a full English editorial mirror for every translated subservice", () => {
    for (const record of Object.values(englishSubserviceEditorial)) {
      expect(
        record.editorial,
        `${record.title} has full translated editorial`,
      ).toBeDefined();
      expect(record.editorial?.intro.trim()).not.toBe("");
      expect(record.editorial?.excerpt.trim()).not.toBe("");
      expect(record.editorial?.content?.cta?.title.trim()).not.toBe("");
    }
  });

  it("keeps display slugs unique, natural and separate from stable IDs", () => {
    const records = [
      ...Object.values(englishServiceEditorial),
      ...Object.values(englishSubserviceEditorial),
    ];
    const slugs = records.map(({ displaySlug }) => displaySlug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
    }
  });

  it("contains complete metadata, body, CTA, image text and locale-safe links", () => {
    const records = [
      ...Object.values(englishServiceEditorial),
      ...Object.values(englishSubserviceEditorial),
    ];

    for (const record of records) {
      expect(record.title.trim()).not.toBe("");
      expect(record.summary.trim()).not.toBe("");
      expect(record.body.trim()).not.toBe("");
      expect(record.cta.title.trim()).not.toBe("");
      expect(record.cta.description.trim()).not.toBe("");
      expect(record.cta.label.trim()).not.toBe("");
      expect(record.seo.title.trim()).not.toBe("");
      expect(record.seo.description.trim()).not.toBe("");
      expect(record.imageAlt.trim()).not.toBe("");
      expect(record.internalLinks.length).toBeGreaterThan(0);
      expect(
        record.internalLinks.every(({ href }) => href.startsWith("/en/")),
      ).toBe(true);
      expect(JSON.stringify(record)).not.toMatch(prohibitedTypography);
    }
  });

  it("keeps every generated English service link on a canonical registry path", () => {
    const canonicalPaths = new Set(
      [...services, ...subservices].map(({ slug }) => {
        const localized = getLocalizedServiceById(slug, "en").service;
        return `/en${serviceHref(localized, "en")}/`;
      }),
    );
    const invalidLinks = [
      ...Object.values(englishServiceEditorial),
      ...Object.values(englishSubserviceEditorial),
    ].flatMap((record) =>
      record.internalLinks
        .filter(({ href }) => href.startsWith("/en/services/"))
        .filter(({ href }) => !canonicalPaths.has(href))
        .map(({ href }) => `${record.displaySlug}: ${href}`),
    );

    expect(invalidLinks).toEqual([]);
  });

  it("resolves English display slugs without changing stable Dutch IDs", () => {
    expect(getLocalizedServiceById("webdesign", "en").slug).toBe("web-design");
    expect(getServiceByLocalizedSlug("web-design", "en").id).toBe("webdesign");
    expect(getLocalizedServiceById("webdesign", "nl").slug).toBe("webdesign");
  });
});
