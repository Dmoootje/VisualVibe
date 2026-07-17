import { describe, expect, it } from "vitest";
import { getPublishedLocales } from "./locales";
import { routing } from "./routing";

describe("published locale routing", () => {
  it("routes only published locales", () => {
    expect(getPublishedLocales()).toEqual(["nl"]);
    expect(routing.locales).toEqual(["nl"]);
    expect(routing.localePrefix).toEqual({
      mode: "always",
      prefixes: { nl: "/be" },
    });
  });
});
