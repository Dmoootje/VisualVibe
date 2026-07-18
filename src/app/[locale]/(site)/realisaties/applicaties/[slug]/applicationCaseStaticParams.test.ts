import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const firestoreMocks = vi.hoisted(() => ({
  getApplicationCases: vi.fn(),
  getApplicationCaseImages: vi.fn(async () => ({})),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/i18n/navigation", () => ({ Link: () => null }));
vi.mock("@/components/seo", () => ({
  BreadcrumbJsonLd: () => null,
  JsonLd: () => null,
}));
vi.mock("@/lib/firestore/applicationCases", () => firestoreMocks);
vi.mock("@/components/realisaties/ApplicationPortfolioCarousel", () => ({
  ApplicationPortfolioCarousel: ({ projects }: { projects: unknown }) => JSON.stringify(projects),
}));
vi.mock("@/components/realisaties/RealisatieHeader", () => ({ RealisatieHeader: () => null }));
vi.mock("@/components/realisaties/RealisatieApplicatieGrid", () => ({
  RealisatieApplicatieGrid: ({ projects }: { projects: unknown }) => JSON.stringify(projects),
}));
vi.mock("@/components/realisaties/RealisatieCategoryGrid", () => ({ RealisatieCategoryGrid: () => null }));
vi.mock("@/components/ui", () => ({
  Container: ({ children }: { children: unknown }) => children,
  Section: ({ children }: { children: unknown }) => children,
}));

import {
  applicationCases,
  getLocalizedApplicationCaseById,
} from "@/data/applicationCases";
import { generateStaticParams } from "./page";
import { localizedApplicationWebsiteUrl } from "./applicationWebsiteUrl";

describe("application case static publication params", () => {
  it("keeps the VisualVibe case-study website link in the current publication", () => {
    expect(localizedApplicationWebsiteUrl(
      "https://visualvibe.media/be/",
      "en",
    )).toBe("https://visualvibe.media/en/");
    expect(localizedApplicationWebsiteUrl(
      "https://visualvibe.media/be/",
      "nl",
    )).toBe("https://visualvibe.media/be/");
  });

  it("keeps a published Dutch-only application in nl and excludes it from en", () => {
    const dutchOnly = {
      ...applicationCases[0],
      id: "published-dutch-only",
      slug: "gepubliceerde-nederlandse-applicatie",
      published: true,
    };
    applicationCases.push(dutchOnly);

    try {
      const params = generateStaticParams();

      expect(params).toContainEqual({
        locale: "nl",
        slug: dutchOnly.slug,
      });
      expect(params).not.toContainEqual(expect.objectContaining({
        locale: "en",
        slug: dutchOnly.slug,
      }));
    } finally {
      applicationCases.pop();
    }
  });

  it("builds English related cards from Dutch source records without Dutch leaks", async () => {
    firestoreMocks.getApplicationCases.mockReset();
    const current = applicationCases[0];
    const related = {
      ...applicationCases[1],
      title: "Nederlandse beheertitel voor SEO",
    };
    const dutchOnly = {
      ...applicationCases[2],
      id: "firestore-only",
      slug: "alleen-nederlandse-firestore-app",
      title: "Alleen Nederlandse Firestore-app",
      published: true,
    };
    firestoreMocks.getApplicationCases.mockResolvedValue([current, related, dutchOnly]);

    const layout = await import("./layout");
    const englishCurrent = getLocalizedApplicationCaseById(current.id, "en");
    const englishRelated = getLocalizedApplicationCaseById(related.id, "en");
    const html = renderToStaticMarkup(await layout.default({
      children: createElement("main"),
      params: Promise.resolve({ locale: "en", slug: englishCurrent.slug }),
    }));

    expect(firestoreMocks.getApplicationCases).toHaveBeenCalledWith("nl");
    expect(html).toContain(englishRelated.title);
    expect(html).toContain(englishRelated.slug);
    expect(html).not.toContain(related.title);
    expect(html).not.toContain(related.slug);
    expect(html).not.toContain(dutchOnly.title);
    expect(html).not.toContain(dutchOnly.slug);
  });

  it("builds the English application hub from Dutch source records without Dutch leaks", async () => {
    firestoreMocks.getApplicationCases.mockReset();
    const reviewedSource = {
      ...applicationCases[1],
      slug: "nederlandse-beheerroute-voor-seo",
      title: "Nederlandse beheertitel voor SEO",
    };
    const dutchOnly = {
      ...applicationCases[2],
      id: "firestore-only-hub",
      slug: "alleen-nederlandse-hub-app",
      title: "Alleen Nederlandse hub-app",
      published: true,
    };
    firestoreMocks.getApplicationCases.mockResolvedValue([reviewedSource, dutchOnly]);

    const hub = await import("../page");
    const englishReviewed = getLocalizedApplicationCaseById(reviewedSource.id, "en");
    const html = renderToStaticMarkup(await hub.default({
      params: Promise.resolve({ locale: "en" }),
    }));

    expect(firestoreMocks.getApplicationCases).toHaveBeenCalledWith("nl");
    expect(html).toContain(englishReviewed.title);
    expect(html).toContain(englishReviewed.slug);
    expect(html).not.toContain(reviewedSource.title);
    expect(html).not.toContain(reviewedSource.slug);
    expect(html).not.toContain(dutchOnly.title);
    expect(html).not.toContain(dutchOnly.slug);
  });
});
