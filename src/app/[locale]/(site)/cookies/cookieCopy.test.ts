import { describe, expect, it } from "vitest";
import { getCookieCopy } from "./cookieCopy";

describe("English cookie copy", () => {
  it("has unique English metadata and preserves consent semantics", () => {
    const copy = getCookieCopy("en", "VisualVibe");
    expect(copy.title).toBe("Cookie policy");
    expect(copy.metaDescription).toContain("Google Analytics");
    expect(copy.introduction).toContain("cookies and similar technologies");
    expect(copy.consent).toContain("no analytics cookies are stored on your device");
    expect(copy.consent).toContain("Accept");
  });
});
