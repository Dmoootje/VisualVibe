import { describe, expect, it } from "vitest";
import { getLocalizedRequired } from "./content";

describe("getLocalizedRequired", () => {
  it("returns the requested locale", () => {
    expect(getLocalizedRequired({ nl: "Hallo", en: "Hello" }, "en", "hero.title")).toBe("Hello");
  });

  it("does not fall back to Dutch", () => {
    expect(() => getLocalizedRequired({ nl: "Hallo" }, "en", "hero.title"))
      .toThrow("Missing en translation for hero.title");
  });
});
