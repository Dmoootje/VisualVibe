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

import {
  applicationCases,
  getLocalizedApplicationCaseById,
} from "@/data/applicationCases";
import { generateStaticParams } from "./page";

describe("application case static publication params", () => {
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
});
