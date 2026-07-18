import { describe, expect, it } from "vitest";
import {
  mergeDutchVisitorFields,
  mergeDutchRecords,
  readLocalizedOptional,
  readLocalizedRequired,
} from "./localizedContent";

describe("Firestore localized public content", () => {
  it("treats a legacy scalar as Dutch-only", () => {
    expect(readLocalizedRequired("Titel", "nl", "project.title")).toBe("Titel");
    expect(() => readLocalizedRequired("Titel", "en", "project.title")).toThrow(
      "Missing en translation for project.title",
    );
  });

  it("treats a legacy structured value as Dutch-only", () => {
    const value = { title: "SSR", points: ["Server rendering"] };
    expect(readLocalizedRequired(value, "nl", "project.ssr")).toEqual(value);
    expect(() => readLocalizedRequired(value, "en", "project.ssr")).toThrow(
      "Missing en translation for project.ssr",
    );
  });

  it("reads the requested value from a localized map", () => {
    expect(
      readLocalizedRequired({ nl: "Titel", en: "Title" }, "en", "project.title"),
    ).toBe("Title");
    expect(readLocalizedOptional({ nl: "Bijschrift", en: "Caption" }, "en", "image.caption"))
      .toBe("Caption");
  });

  it("fails closed when an English value is missing", () => {
    expect(() =>
      readLocalizedRequired({ nl: "Titel", fr: "Titre" }, "en", "project.title"),
    ).toThrow("Missing en translation for project.title");
  });

  it("preserves en, fr and de values when Dutch is edited", () => {
    expect(
      mergeDutchVisitorFields(
        {
          id: "case-1",
          title: { nl: "Oud", en: "Old", fr: "Ancien", de: "Alt" },
          description: { nl: "Beschrijving", en: "Description" },
        },
        { id: "case-1", title: "Nieuw", description: "Nieuwe beschrijving" },
        ["title", "description"],
      ),
    ).toMatchObject({
      title: { nl: "Nieuw", en: "Old", fr: "Ancien", de: "Alt" },
      description: { nl: "Nieuwe beschrijving", en: "Description" },
    });
  });

  it("clears an optional Dutch value without emitting undefined or erasing English", () => {
    expect(
      mergeDutchVisitorFields(
        { caption: { nl: "Oud", en: "Caption" } },
        { caption: undefined },
        ["caption"],
      ),
    ).toEqual({ caption: { nl: null, en: "Caption" } });
  });

  it("preserves localized fields in ordered array records by stable identity", () => {
    expect(
      mergeDutchRecords(
        [
          { id: "second", title: { nl: "Tweede", en: "Second" } },
          { id: "first", title: { nl: "Eerste", en: "First" } },
        ],
        [
          { id: "first", title: "Eerste aangepast" },
          { id: "second", title: "Tweede aangepast" },
        ],
        ["title"],
      ),
    ).toEqual([
      { id: "first", title: { nl: "Eerste aangepast", en: "First" } },
      { id: "second", title: { nl: "Tweede aangepast", en: "Second" } },
    ]);
  });
});
