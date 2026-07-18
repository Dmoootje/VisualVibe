import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
vi.mock("@/components/seo", () => ({
  BreadcrumbJsonLd: () => null,
  FaqPageJsonLd: () => null,
  JsonLd: () => null,
}));
vi.mock("@/features/home/RegionIntro/components/RegionMiniMap", () => ({
  RegionMiniMap: ({ slug }: { slug: string }) => <span data-map={slug} />,
}));

import RegioHubPage, { generateMetadata } from "./page";

describe("English regions hub route", () => {
  it("renders English metadata, copy and localized display slugs without Dutch leakage", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "en" }) });
    const html = renderToStaticMarkup(await RegioHubPage({ params: Promise.resolve({ locale: "en" }) }));

    expect(metadata.title).toEqual({ absolute: "Service Areas in Belgium and the Netherlands | VisualVibe" });
    expect(metadata.alternates?.canonical).toContain("/en/regio/");
    expect(html).toContain("Regions where VisualVibe works");
    expect(html).toContain('href="/regio/limburg-belgium"');
    expect(html).toContain('href="/regio/flanders"');
    expect(html).not.toMatch(/Ons werkgebied|Kies jouw regio|Bekijk pagina|gemeentes|Nederlands-Limburg|Offerte aanvragen/);
  });
});
