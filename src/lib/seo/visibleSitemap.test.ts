import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firestore/fotografieGalleries", () => ({
  getFotografieGalleries: vi.fn(async () => [{ images: [{}] }]),
}));
vi.mock("@/lib/firestore/applicationCases", () => ({
  getApplicationCases: vi.fn(async () => [
    { id: "bm-jumpfun", slug: "bm-jumpfun-verhuurplatform", published: true },
    { id: "seo-websites", slug: "seo-websites-saas-platform", published: true },
    { id: "visualvibe", slug: "visualvibe-website-contentplatform", published: true },
    { id: "pelletkachelzorg", slug: "pelletkachelzorg-multisite-commerce-platform", published: true },
  ]),
}));

import { getSitemapEntries } from "./siteUrls";
import {
  flattenVisibleSitemapHrefs,
  getEnglishVisibleSitemap,
} from "./visibleSitemap";

describe("English visible sitemap inventory", () => {
  it("matches every canonical English XML sitemap path", async () => {
    const entries = await getSitemapEntries();
    const view = getEnglishVisibleSitemap(entries);
    const xmlPaths = entries
      .map(({ url }) => new URL(url).pathname)
      .filter((pathname) => pathname.startsWith("/en/"))
      .sort();

    expect(xmlPaths).toHaveLength(169);
    expect(flattenVisibleSitemapHrefs(view).sort()).toEqual(xmlPaths);
    expect(view.total).toBe(169);
  });

  it("groups representative services, regions, sectors, case studies and knowledge pages", async () => {
    const view = getEnglishVisibleSitemap(await getSitemapEntries());
    const hrefs = flattenVisibleSitemapHrefs(view);

    expect(hrefs).toEqual(expect.arrayContaining([
      "/en/services/web-design/business-website-design/",
      "/en/regio/limburg-belgium/",
      "/en/sectoren/construction-renovation/",
      "/en/realisaties/web-design/",
      "/en/realisaties/applications/bm-jumpfun-rental-platform/",
      "/en/kennisbank/",
      "/en/kennisbank/webdesign/website-development-costs/",
    ]));
    expect(view.sections.map(({ title }) => title)).toEqual([
      "General pages",
      "Services",
      "Regions",
      "Industries",
      "Case studies",
      "Knowledge base",
      "Tools",
    ]);
  });

  it("uses authored English titles instead of deriving labels from URL slugs", async () => {
    const view = getEnglishVisibleSitemap(await getSitemapEntries());
    const titlesByHref = new Map(
      view.sections.flatMap((section) => [
        [section.href, section.title] as const,
        ...section.nodes.map(({ href, title }) => [href, title] as const),
      ]),
    );

    expect(titlesByHref.get("/en/services/photography/")).toBe("Photography");
    expect(titlesByHref.get("/en/services/videography/")).toBe("Videography");
    expect(titlesByHref.get("/en/services/custom-software/")).toBe("Custom software");
    expect(titlesByHref.get("/en/kennisbank/fotografie/")).toBe("Photography");
    expect(titlesByHref.get("/en/kennisbank/webdesign/website-development-costs/")).toBe(
      "How much does a website cost in Belgium?",
    );
    expect([...titlesByHref.values()]).not.toContain("Software Op Maat");
  });
});
