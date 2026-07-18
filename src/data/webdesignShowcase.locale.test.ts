import { describe, expect, it } from "vitest";
import { englishWebdesignProjects } from "./locales/en/webdesignShowcase";
import { getLocalizedWebdesignProject, webdesignProjects } from "./webdesignShowcase";

describe("web design showcase localisation", () => {
  it("covers every static project and every public copy field", () => {
    expect(Object.keys(englishWebdesignProjects).sort()).toEqual(
      webdesignProjects.map(({ id }) => id).sort(),
    );
    for (const source of webdesignProjects) {
      const translated = englishWebdesignProjects[source.id];
      expect(translated.client.trim()).not.toBe("");
      expect(translated.tags).toHaveLength(source.tags.length);
      expect(translated.features).toHaveLength(source.features.length);
      expect(translated.terms).toHaveLength(source.terms.length);
      expect(translated.teaser.trim()).not.toBe("");
      expect(translated.text.trim()).not.toBe("");
    }
  });

  it("does not expose Dutch for unknown dynamic records in English", () => {
    expect(getLocalizedWebdesignProject({ ...webdesignProjects[0], id: "admin-only" }, "en"))
      .toBeUndefined();
    expect(() => getLocalizedWebdesignProject(webdesignProjects[0], "fr")).toThrow(
      "Missing fr translation for web design project gordijnenmyriam",
    );
  });
});
