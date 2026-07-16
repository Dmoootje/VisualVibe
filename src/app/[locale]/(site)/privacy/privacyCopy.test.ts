import { describe, expect, it } from "vitest";
import { ANALYSIS_RETENTION_COPY } from "./privacyCopy";

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
