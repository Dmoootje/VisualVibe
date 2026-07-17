import { describe, expect, it } from "vitest";
import { toolsCards } from "./navData";

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
