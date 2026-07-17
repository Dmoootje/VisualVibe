import { describe, expect, it } from "vitest";

import { ENGLISH_GLOSSARY } from "./glossary";

const normalize = (value: string) => value.trim().toLocaleLowerCase("nl-BE");

describe("ENGLISH_GLOSSARY", () => {
  it("contains each normalized Dutch source term only once", () => {
    const normalizedTerms = ENGLISH_GLOSSARY.map((entry) =>
      normalize(entry.source),
    );

    expect(new Set(normalizedTerms).size).toBe(normalizedTerms.length);
  });

  it.each([
    ["KMO", "SME"],
    ["offerte", "quotation"],
    ["realisaties", "case studies"],
    ["websiteanalyse", "website analysis"],
    ["vindbaarheid", "online visibility"],
    ["AEO", "AEO"],
    ["GEO", "GEO"],
    ["FPV", "FPV"],
    ["Limburg", "Limburg"],
  ])("defines an approved English term for %s", (source, target) => {
    const entry = ENGLISH_GLOSSARY.find(
      (candidate) => normalize(candidate.source) === normalize(source),
    );

    expect(entry).toMatchObject({ target });
    expect(entry?.notes.trim().length).toBeGreaterThan(0);
    expect(typeof entry?.preserve).toBe("boolean");
  });

  it.each(["SEO", "AEO", "GEO", "FPV", "VisualVibe", "Limburg"])(
    "marks %s as preserved",
    (source) => {
      const entry = ENGLISH_GLOSSARY.find(
        (candidate) => normalize(candidate.source) === normalize(source),
      );

      expect(entry).toMatchObject({ source, target: source, preserve: true });
    },
  );
});
