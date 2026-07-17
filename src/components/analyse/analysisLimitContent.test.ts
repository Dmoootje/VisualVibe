import { describe, expect, it } from "vitest";
import {
  COMPLETE_AUDIT_URL,
  PAGE_ANALYZER_URL,
  getAnalysisLimitContent,
} from "./analysisLimitContent";

describe("analysis limit content", () => {
  it("promises three renewed tests for email and device limits", () => {
    const content = getAnalysisLimitContent({
      decision: "limit_device",
      message: "Het maximum aantal gratis analyses voor dit apparaat is bereikt.",
      resetsAt: "2026-07-16T18:30:00.000Z",
    });

    expect(content.heading).toBe("Je gratis analyses zijn gebruikt");
    expect(content.description).toContain("donderdag 16 juli");
    expect(content.description).toContain("20:30");
    expect(content.description).toContain("opnieuw 3 gratis analyses");
  });

  it("does not promise three tests for an IP monthly limit", () => {
    const content = getAnalysisLimitContent({
      decision: "limit_ip_monthly",
      message: "Het maandelijkse maximum aan aanvragen vanaf dit netwerk is bereikt.",
      resetsAt: "2026-07-20T18:30:00.000Z",
    });

    expect(content.description).not.toContain("opnieuw 3 gratis analyses");
    expect(content.description).toContain("maandag 20 juli");
  });

  it("uses the approved destinations", () => {
    expect(PAGE_ANALYZER_URL).toBe("https://seowebsites.be/nl/seo-website-analyse");
    expect(COMPLETE_AUDIT_URL).toBe("https://seowebsites.be/AIGEOprofiler/");
  });
});
