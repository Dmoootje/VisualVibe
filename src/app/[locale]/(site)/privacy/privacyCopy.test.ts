import { describe, expect, it } from "vitest";
import { ANALYSIS_RETENTION_COPY, getPrivacyCopy } from "./privacyCopy";

describe("privacy analysis quota retention copy", () => {
  it("distinguishes active counting windows from technical retention", () => {
    expect(ANALYSIS_RETENTION_COPY).toContain("24 uur");
    expect(ANALYSIS_RETENTION_COPY).toContain("30 dagen");
    expect(ANALYSIS_RETENTION_COPY).toContain("HMAC");
    expect(ANALYSIS_RETENTION_COPY).toContain("pseudonieme");
    expect(ANALYSIS_RETENTION_COPY).toContain("91 dagen");
    expect(ANALYSIS_RETENTION_COPY).toContain("verlengt de actieve telvensters niet");
  });
});

describe("English privacy copy", () => {
  it("has unique English metadata and preserves the legal retention meaning", () => {
    const copy = getPrivacyCopy("en", "VisualVibe");
    expect(copy.title).toBe("Privacy policy");
    expect(copy.metaTitle).toBe("Privacy policy | VisualVibe");
    expect(copy.metaDescription).toContain("personal data");
    expect(copy.introduction).toContain("General Data Protection Regulation");
    expect(copy.analysisRetention).toContain("24 hours");
    expect(copy.analysisRetention).toContain("30 days");
    expect(copy.analysisRetention).toContain("91 days");
    expect(copy.analysisRetention).toContain("does not extend the active counting windows");
  });
});
