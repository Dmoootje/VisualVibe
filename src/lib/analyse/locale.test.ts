import { describe, expect, it } from "vitest";
import { analysisLocale } from "./locale";

describe("analysisLocale", () => {
  it("preserves supported visitor locales and rejects unknown values", () => {
    expect(analysisLocale("en")).toBe("en");
    expect(analysisLocale("fr")).toBe("fr");
    expect(analysisLocale("de")).toBe("nl");
    expect(analysisLocale(undefined)).toBe("nl");
  });
});
