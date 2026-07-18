import { describe, expect, it } from "vitest";
import { getCookieCopy } from "./cookieCopy";

describe("English cookie copy", () => {
  it("has unique English metadata and preserves consent semantics", () => {
    const copy = getCookieCopy("en", "VisualVibe");
    expect(copy.title).toBe("Cookie policy");
    expect(copy.metaDescription).toContain("Google Analytics");
    expect(copy.introduction).toContain("cookies and similar technologies");
    expect(copy.consent).toBe("Until you make a choice, or if you select Reject, analytics cookies remain disabled through Google Consent Mode and no analytics cookies are stored on your device. If you select Accept, we enable Google Analytics. We remember your preference so that the banner does not reappear on every visit.");
    expect(copy.consent).toContain("Accept");
  });
});
