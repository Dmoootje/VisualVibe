import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

describe("English translation brief schema", () => {
  const schema = JSON.parse(
    readFileSync(
      resolve("docs/localization/translation-brief.schema.json"),
      "utf8",
    ),
  ) as {
    required: string[];
    properties: Record<string, unknown>;
  };

  it("rejects a brief that omits the primary Dutch search intent", () => {
    const briefWithoutDutchIntent = Object.fromEntries(
      schema.required
        .filter((field) => field !== "primaryDutchSearchIntent")
        .map((field) => [field, "present"]),
    );
    const missingRequiredFields = schema.required.filter(
      (field) => !Object.hasOwn(briefWithoutDutchIntent, field),
    );

    expect(schema.properties).toHaveProperty("primaryDutchSearchIntent");
    expect(missingRequiredFields).toContain("primaryDutchSearchIntent");
  });
});
