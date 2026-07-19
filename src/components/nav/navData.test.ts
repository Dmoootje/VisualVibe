import { describe, expect, it } from "vitest";
import {
  getKennisbankCards,
  getNavPillars,
  getNavRegions,
  getRealisatieCards,
  getSectorCards,
  getToolsCards,
  toolsCards,
} from "./navData";

describe("navigation tools cards", () => {
  it("exposes website analysis and SEO/GEO checklist in the menu data", () => {
    expect(toolsCards).toEqual([
      expect.objectContaining({
        name: "Website analyse",
        href: "/website-analyse",
        icon: "seo",
      }),
      expect.objectContaining({
        name: "SEO/GEO checklist",
        href: "/tools/seo-geo-checklist",
        icon: "checklist",
      }),
    ]);
  });
});

describe("localized navigation routes", () => {
  it("builds every English overlay card from a stable localized registry", () => {
    expect(getSectorCards("en")).toContainEqual(expect.objectContaining({
      name: "Construction and renovation",
      href: "/sectoren/construction-renovation",
    }));
    expect(getRealisatieCards("en")).toContainEqual(expect.objectContaining({
      name: "Photography",
      href: "/realisaties/photography",
    }));
    expect(getToolsCards("en")).toContainEqual(expect.objectContaining({
      name: "Website analysis",
      href: "/website-analysis/",
    }));
    expect(getKennisbankCards("en")).toContainEqual(expect.objectContaining({
      name: "Photography",
      href: "/kennisbank/fotografie",
      desc: expect.stringContaining("photography"),
    }));

    const hrefs = [
      ...getRealisatieCards("en"),
      ...getToolsCards("en"),
    ].map((card) => card.href);
    expect(hrefs.every((href) => !href.startsWith("/en/"))).toBe(true);
    expect(hrefs).not.toContain("/realisaties/fotografie");
  });

  it("keeps the existing Dutch overlay cards unchanged", () => {
    expect(getToolsCards("nl")).toEqual(toolsCards);
    expect(getRealisatieCards("nl")).toContainEqual(expect.objectContaining({
      name: "Fotografie",
      href: "/realisaties/fotografie",
    }));
    expect(getKennisbankCards("nl")).toContainEqual(expect.objectContaining({
      name: "Fotografie",
      href: "/kennisbank/fotografie",
    }));
  });

  it("resolves English service and software links from stable IDs", () => {
    const pillars = getNavPillars("en");
    const webDesign = pillars.find((pillar) => pillar.id === "webdesign");
    const software = pillars.find((pillar) => pillar.id === "software-op-maat");

    expect(webDesign).toEqual(expect.objectContaining({
      name: "Web design",
      href: "/services/web-design",
    }));
    expect(webDesign?.subs).toContainEqual(expect.objectContaining({
      name: "Business website design",
      href: "/services/web-design/business-website-design",
    }));
    expect(software).toEqual(expect.objectContaining({
      href: "/services/custom-software",
    }));
    expect(software?.subs).toContainEqual(expect.objectContaining({
      href: "/services/custom-software/app-development",
    }));

    const hrefs = pillars.flatMap((pillar) => [
      pillar.href,
      ...pillar.subs.map((sub) => sub.href),
    ]);
    expect(hrefs).not.toContain("/diensten/webdesign");
    expect(hrefs).not.toContain("/diensten/webdesign/website-met-ai-functionaliteiten");
    expect(hrefs).not.toContain("/diensten/software-op-maat");
  });

  it("resolves English region links from stable IDs while retaining their map IDs", () => {
    expect(getNavRegions("en")).toEqual([
      expect.objectContaining({ id: "limburg", slug: "limburg-belgium", title: "Limburg, Belgium" }),
      expect.objectContaining({ id: "vlaanderen", slug: "flanders", title: "Flanders" }),
      expect.objectContaining({ id: "antwerpen", slug: "antwerp-province", title: "Antwerp province" }),
      expect.objectContaining({ id: "nederlands-limburg", slug: "dutch-limburg", title: "Dutch Limburg" }),
    ]);
  });

  it("keeps Dutch service and region routes unchanged", () => {
    expect(getNavPillars("nl")).toContainEqual(expect.objectContaining({
      id: "webdesign",
      href: "/diensten/webdesign",
    }));
    expect(getNavRegions("nl")).toContainEqual(expect.objectContaining({
      id: "limburg",
      slug: "limburg",
    }));
  });
});
