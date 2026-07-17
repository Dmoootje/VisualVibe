import { describe, expect, it } from "vitest";
import nl from "../../messages/nl.json";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import de from "../../messages/de.json";

function paths(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => paths(child, prefix ? `${prefix}.${key}` : key));
}

describe("shared locale messages", () => {
  it.each([
    ["en", en],
    ["fr", fr],
    ["de", de],
  ])("keeps %s key paths in parity with Dutch", (_locale, messages) => {
    expect(paths(messages).sort()).toEqual(paths(nl).sort());
  });
});
