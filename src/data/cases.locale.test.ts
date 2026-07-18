import { describe, expect, it } from "vitest";

import {
  cases,
  getCaseByLocalizedSlug,
  getLocalizedCaseById,
} from "./cases";
import { englishCaseEditorial } from "./locales/en/cases";

describe("case-study localisation", () => {
  it("keeps the English overlay in exact parity with the published Dutch case inventory", () => {
    expect(Object.keys(englishCaseEditorial).sort()).toEqual(
      cases.map((item) => item.slug).sort(),
    );
  });

  it("does not invent an English case when the Dutch source inventory is empty", () => {
    expect(cases).toEqual([]);
    expect(englishCaseEditorial).toEqual({});
  });

  it("rejects unknown stable IDs and localized slugs instead of falling back across languages", () => {
    expect(() => getLocalizedCaseById("missing-case", "en")).toThrow(
      "Unknown case ID: missing-case",
    );
    expect(() => getCaseByLocalizedSlug("missing-case", "en")).toThrow(
      "Unknown en case slug: missing-case",
    );
  });
});
