import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/i18n/navigation", () => ({ Link: () => null }));
vi.mock("@/components/seo", () => ({
  BreadcrumbJsonLd: () => null,
  JsonLd: () => null,
}));
vi.mock("@/lib/firestore/applicationCases", () => ({
  getApplicationCaseImages: vi.fn(async () => ({})),
}));

import { applicationCases } from "@/data/applicationCases";
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
});
