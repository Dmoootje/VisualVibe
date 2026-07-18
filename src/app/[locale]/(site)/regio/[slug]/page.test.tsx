import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
vi.mock("@/components/seo", () => ({ BreadcrumbJsonLd: () => null, ServiceJsonLd: () => null }));
vi.mock("@/features/home/RegionIntro/components/RegionMiniMap", () => ({
  RegionMiniMap: ({ slug }: { slug: string }) => <span data-map={slug} />,
}));

import RegionDetailPage, { generateMetadata } from "./page";

describe("English region detail route", () => {
  it("resolves the English slug and renders only localized region and service copy", async () => {
    const params = Promise.resolve({ locale: "en" as const, slug: "limburg-belgium" });
    const metadata = await generateMetadata({ params });
    const html = renderToStaticMarkup(await RegionDetailPage({ params }));

    expect(metadata.title).toEqual({ absolute: "Web Design, Photography and Video in Limburg | VisualVibe" });
    expect(metadata.alternates?.canonical).toContain("/en/regio/limburg-belgium/");
    expect(html).toContain("Limburg, Belgium");
    expect(html).toContain("Web design");
    expect(html).toContain('href="/diensten/web-design"');
    expect(html).not.toMatch(/Onze diensten|Bekijk alle diensten|Werkgebied|Kennisbank|Uit de kennisbank|Realisaties|Offerte aanvragen/);
  });
});
