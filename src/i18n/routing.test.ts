import { describe, expect, it } from "vitest";
import { getPublishedLocales } from "./locales";
import { routing } from "./routing";

describe("published locale routing", () => {
  it("routes only published locales", () => {
    expect(getPublishedLocales()).toEqual(["nl", "en"]);
    expect(routing.locales).toEqual(["nl", "en"]);
    expect(routing.localePrefix).toEqual({
      mode: "always",
      prefixes: { nl: "/be" },
    });
  });
});
