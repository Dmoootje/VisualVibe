import { describe, expect, it } from "vitest";
import { getFooterLinkGroups } from "./footer.config";

describe("localized footer links", () => {
  it("uses canonical English service paths and the English about alias", () => {
    const groups = getFooterLinkGroups("en");
    const hrefs = groups.flatMap((group) => group.links.map((link) => link.href));

    expect(groups[0]?.links).toContainEqual({
      label: "Web design",
      href: "/services/web-design",
    });
    expect(hrefs).toContain("/about");
    expect(hrefs).not.toContain("/over-ons");
    expect(hrefs).not.toContain("/diensten/webdesign");
  });

  it("keeps Dutch footer links unchanged", () => {
    const hrefs = getFooterLinkGroups("nl").flatMap((group) =>
      group.links.map((link) => link.href),
    );

    expect(hrefs).toContain("/over-ons");
    expect(hrefs).toContain("/diensten/webdesign");
  });
});
