import { describe, expect, it } from "vitest";
import { getCommercialCopy } from "./commercialCopy";

describe("commercial page English copy", () => {
  it("provides idiomatic contact and quotation copy without Dutch fallback", () => {
    const copy = getCommercialCopy("en");
    expect(copy.contact.intro).toContain("project");
    expect(copy.contact.formTitle).toBe("Send us a message");
    expect(copy.quotation.h1).toBe("Request a quotation");
    expect(copy.quotation.intro).toContain("two working days");
    expect(JSON.stringify(copy)).not.toContain("Offerte aanvragen");
  });
});
