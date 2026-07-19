import { describe, expect, it } from "vitest";
import { getChromeRoutes } from "./chromeRoutes";

describe("shared chrome aliases", () => {
  it("emits canonical English aliases and excludes the Dutch-only wedding route", () => {
    expect(getChromeRoutes("en")).toEqual({
      about: "/about",
      wedding: null,
    });
  });

  it("retains the existing Dutch routes", () => {
    expect(getChromeRoutes("nl")).toEqual({
      about: "/over-ons",
      wedding: "/trouwfotograaf-limburg",
    });
  });
});
