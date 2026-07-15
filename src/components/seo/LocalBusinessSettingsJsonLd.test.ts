import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/types/siteSettings";
import { LocalBusinessSettingsJsonLd } from "./LocalBusinessSettingsJsonLd";

function renderSchema(country: string): Record<string, unknown> {
  const settings: SiteSettings = {
    id: "default",
    ...DEFAULT_SITE_SETTINGS,
    country,
    createdAt: "2026-07-15T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z",
  };
  const html = renderToStaticMarkup(
    createElement(LocalBusinessSettingsJsonLd, { settings }),
  );
  const json = html.match(/<script[^>]*>([\s\S]*)<\/script>/)?.[1];
  if (!json) throw new Error("JSON-LD script ontbreekt");
  return JSON.parse(json) as Record<string, unknown>;
}

describe("LocalBusinessSettingsJsonLd", () => {
  it("normalizes the country code and publishes the price range", () => {
    const schema = renderSchema("be");

    expect(schema).toMatchObject({
      priceRange: "$$",
      address: { addressCountry: "BE" },
    });
  });

  it("falls back to the configured country code for a legacy country name", () => {
    const schema = renderSchema("België");

    expect(schema).toMatchObject({
      address: { addressCountry: "BE" },
    });
  });
});
