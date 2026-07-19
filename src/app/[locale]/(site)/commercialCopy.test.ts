import { describe, expect, it } from "vitest";
import { getCommercialCopy } from "./commercialCopy";

describe("commercial page English copy", () => {
  it("provides idiomatic contact copy without Dutch fallback", () => {
    const copy = getCommercialCopy("en");
    expect(copy.contact.intro).toContain("project");
    expect(copy.contact.formTitle).toBe("Send us a message");
    expect(JSON.stringify(copy)).not.toContain("Offerte aanvragen");
  });
});
