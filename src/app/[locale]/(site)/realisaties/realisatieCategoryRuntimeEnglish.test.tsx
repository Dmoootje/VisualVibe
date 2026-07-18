import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/components/seo", () => ({ BreadcrumbJsonLd: () => null }));
vi.mock("@/components/sections", () => ({
  CaseGrid: () => null,
}));
vi.mock("@/components/sections/ServiceRelatedPosts", () => ({
  ServiceRelatedPosts: () => null,
}));
vi.mock("@/components/ui", () => ({
  Section: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/realisaties/RealisatieCategoryGrid", () => ({
  RealisatieCategoryGrid: () => null,
}));
vi.mock("@/components/realisaties/RealisatieHeader", () => ({
  RealisatieHeader: ({ category }: { category: { title?: string; name?: string } }) => (
    <h1>{category.title ?? category.name}</h1>
  ),
}));
vi.mock("@/components/realisaties/RealisatieWebdesignFeatured", () => ({
  RealisatieWebdesignFeatured: () => <div>English featured project</div>,
}));
vi.mock("@/components/realisaties/RealisatieWebdesignGrid", () => ({
  RealisatieWebdesignGrid: () => null,
}));
vi.mock("@/components/realisaties/RealisatieFotografieGalerijen", () => ({
  RealisatieFotografieGalerijen: () => null,
}));
vi.mock("@/components/realisaties/RealisatieSmugMugGalerijen", () => ({
  RealisatieSmugMugGalerijen: () => null,
}));
vi.mock("@/components/realisaties/RealisatieDroneMedia", () => ({
  RealisatieDroneMedia: () => null,
}));
vi.mock("@/components/videografie", () => ({
  RealisatieVideografieGalerijen: () => null,
}));
vi.mock("@/components/xr", () => ({ RealisatieXrTours: () => null }));
vi.mock("@/lib/firestore/webdesignImages", () => ({
  getWebdesignImages: vi.fn(async () => ({})),
}));
vi.mock("@/lib/firestore/webdesignProjects", async () => {
  const { webdesignProjects } = await import("@/data/webdesignShowcase");
  return {
    getWebdesignProjects: vi.fn(async (locale: string) => {
      if (locale !== "nl") throw new Error(`unsafe project locale: ${locale}`);
      return webdesignProjects;
    }),
  };
});
vi.mock("@/lib/firestore/fotografieGalleries", () => ({
  getFotografieGalleries: vi.fn(async () => {
    throw new Error("English loaded Dutch photography galleries");
  }),
}));
vi.mock("@/lib/smugmug", () => ({ getSmugMugGalleries: vi.fn(async () => []) }));
vi.mock("@/lib/youtube", () => ({
  getVideografieVideos: vi.fn(async () => ({ videos: [], filters: [] })),
}));

describe("English realisation category runtime", () => {
  it("loads Dutch source projects before applying checked-in English overlays", async () => {
    const page = await import("./[category]/page");
    const { getWebdesignProjects } = await import("@/lib/firestore/webdesignProjects");
    const html = renderToStaticMarkup(
      await page.default({
        params: Promise.resolve({ locale: "en", category: "web-design" }),
      }),
    );

    expect(getWebdesignProjects).toHaveBeenCalledWith("nl");
    expect(html).toContain("English featured project");
  });

  it("keeps the empty English photography category free of Dutch gallery data", async () => {
    const page = await import("./[category]/page");
    const { getFotografieGalleries } = await import(
      "@/lib/firestore/fotografieGalleries"
    );
    const html = renderToStaticMarkup(
      await page.default({
        params: Promise.resolve({ locale: "en", category: "photography" }),
      }),
    );

    expect(getFotografieGalleries).not.toHaveBeenCalled();
    expect(html).toContain("Photography case studies");
    expect(html).not.toContain("Realisaties rond");
  });
});
