import { afterEach, describe, expect, it, vi } from "vitest";
import { applicationCases } from "@/data/applicationCases";
import {
  getDataPublicRoutePairs,
  getStaticPublicRoutePairs,
} from "./publicPageInventory";

describe("public page inventory", () => {
  afterEach(() => {
    vi.doUnmock("@/data/cases");
    vi.doUnmock("@/data/realisatieCategories");
  });

  it("resolves static Dutch and English routes from stable content IDs", () => {
    const paths = getStaticPublicRoutePairs();

    expect(paths).toContainEqual(expect.objectContaining({
      nl: "/diensten/webdesign/website-laten-maken/",
      en: "/diensten/web-design/business-website-design/",
    }));
    expect(paths).toContainEqual({
      nl: "/offerte-aanvragen/",
      en: "/request-a-quotation/",
    });
    expect(paths).toContainEqual(expect.objectContaining({
      nl: "/regio/limburg/",
      en: "/regio/limburg-belgium/",
    }));
    expect(paths).toContainEqual({
      nl: "/diensten/software-op-maat/",
      en: "/diensten/custom-software/",
    });
    expect(paths).toContainEqual({
      nl: "/website-analyse/",
      en: "/website-analysis/",
    });
  });

  it("excludes standalone, internal, token and untranslated routes", () => {
    const serialized = JSON.stringify(getStaticPublicRoutePairs());

    expect(serialized).not.toContain("trouwfotograaf-limburg");
    expect(serialized).not.toContain("website-met-ai-functionaliteiten");
    expect(serialized).not.toContain("blog-styleguide");
    expect(serialized).not.toContain("rapport");
    expect(serialized).not.toContain("/fr/");
    expect(serialized).not.toContain("/de/");
  });

  it("keeps dynamic realisation eligibility and resolves published application cases by ID", () => {
    const paths = getDataPublicRoutePairs({
      photographyGalleryCount: 1,
      publishedApplicationCases: [applicationCases[0]],
    });

    expect(paths).toContainEqual({
      nl: "/realisaties/applicaties/bm-jumpfun-verhuurplatform/",
      en: "/realisaties/applications/bm-jumpfun-rental-platform/",
    });
    expect(paths).toContainEqual({
      nl: "/realisaties/applicaties/",
      en: "/realisaties/applications/",
    });
    expect(paths).toContainEqual({ nl: "/realisaties/fotografie/" });
    expect(paths).not.toContainEqual(expect.objectContaining({
      en: "/realisaties/photography/",
    }));
  });

  it("keeps a Dutch photography category when checked-in cases make it indexable", async () => {
    vi.resetModules();
    vi.doMock("@/data/cases", () => ({
      cases: [{ category: "fotografie" }],
    }));
    const { getStaticPublicRoutePairs: getRoutesWithCase } = await import(
      "./publicPageInventory"
    );

    expect(getRoutesWithCase()).toContainEqual({
      nl: "/realisaties/fotografie/",
    });
  });

  it("resolves Dutch-only category paths by stable ID without an English partner", async () => {
    vi.resetModules();
    vi.doMock("@/data/realisatieCategories", async () => {
      const actual = await vi.importActual<typeof import("@/data/realisatieCategories")>(
        "@/data/realisatieCategories",
      );
      return {
        ...actual,
        getLocalizedRealisatieCategoryById: (id: string, locale: "nl" | "en") => {
          const localized = actual.getLocalizedRealisatieCategoryById(id, locale);
          return id === "videografie" && locale === "nl"
            ? { ...localized, slug: "localized-videography-source" }
            : localized;
        },
      };
    });
    const { getStaticPublicRoutePairs: getRoutesWithLocalizedSlug } = await import(
      "./publicPageInventory"
    );

    const paths = getRoutesWithLocalizedSlug();
    expect(paths).toContainEqual({
      nl: "/realisaties/localized-videography-source/",
    });
    expect(paths).not.toContainEqual(expect.objectContaining({
      nl: "/realisaties/localized-videography-source/",
      en: expect.any(String),
    }));
  });
});
