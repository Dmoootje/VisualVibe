import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("English podcast article source copy", () => {
  it("uses an English source label while preserving the official Dutch PDF URL", () => {
    const source = readFileSync(
      "content/kennisbank/en/podcast-for-experts-and-consultants.mdx",
      "utf8",
    );

    expect(source).toContain("[FPS Economy copyright FAQ]");
    expect(source).toContain("https://economie.fgov.be/sites/default/files/Files/Publications/files/FAQ-auteursrecht.pdf");
    expect(source).not.toContain("[FAQ Auteursrecht van FOD Economie]");
  });
});
