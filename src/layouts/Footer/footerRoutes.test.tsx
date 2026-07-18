import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const localeState = vi.hoisted(() => ({ current: "en" }));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next-intl/server", () => ({
  getLocale: async () => localeState.current,
  getTranslations: async () => (key: string) => key,
}));

vi.mock("@/lib/firestore/siteSettings", () => ({
  getSiteSettings: async () => ({
    street: "Example street",
    houseNumber: "1",
    postalCode: "3500",
    city: "Hasselt",
    country: "België",
    fullAddress: "Example street 1, 3500 Hasselt, België",
  }),
}));

import { Footer } from "./index";

describe("rendered footer routes", () => {
  it("renders canonical localized links and hides WeddingVibe in English", async () => {
    localeState.current = "en";
    const html = renderToStaticMarkup(await Footer());

    expect(html).toContain('href="/diensten/web-design"');
    expect(html).toContain('href="/regio/limburg-belgium"');
    expect(html).toContain('href="/about"');
    expect(html).not.toContain('href="/diensten/webdesign"');
    expect(html).not.toContain('href="/regio/limburg"');
    expect(html).not.toContain('href="/over-ons"');
    expect(html).not.toContain('href="/trouwfotograaf-limburg"');
    expect(html).toContain("Belgium");
    expect(html).not.toContain("België");
  });

  it("retains the Dutch footer routes", async () => {
    localeState.current = "nl";
    const html = renderToStaticMarkup(await Footer());

    expect(html).toContain('href="/diensten/webdesign"');
    expect(html).toContain('href="/regio/limburg"');
    expect(html).toContain('href="/over-ons"');
    expect(html).toContain('href="/trouwfotograaf-limburg"');
    expect(html).toContain("België");
  });
});
