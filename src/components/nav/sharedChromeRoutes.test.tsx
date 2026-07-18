import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
  usePathname: () => "/",
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import { MobileNavDrawer } from "./MobileNavDrawer";

const sharedProps = {
  pillars: [{
    id: "fotografie",
    name: "Photography",
    tag: "Photography",
    icon: "camera",
    href: "/diensten/photography",
    subs: [],
  }],
  regions: [{ id: "limburg", slug: "limburg-belgium", title: "Limburg, Belgium", type: "province" }],
  sectorCards: [],
  realisatieCards: [],
  toolsCards: [],
  kennisbankItems: [],
  kennisbankPostCount: 0,
  onClose: () => undefined,
};

describe("rendered mobile chrome routes", () => {
  it("renders canonical aliases and no Dutch-only wedding link in English", () => {
    const html = renderToStaticMarkup(<MobileNavDrawer {...sharedProps} locale="en" />);

    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/request-a-quotation"');
    expect(html).not.toContain('href="/over-ons"');
    expect(html).not.toContain('href="/offerte-aanvragen"');
    expect(html).not.toContain('href="/trouwfotograaf-limburg"');
  });

  it("retains Dutch aliases and the wedding link in Dutch", () => {
    const html = renderToStaticMarkup(<MobileNavDrawer {...sharedProps} locale="nl" />);

    expect(html).toContain('href="/over-ons"');
    expect(html).toContain('href="/offerte-aanvragen"');
    expect(html).toContain('href="/trouwfotograaf-limburg"');
  });
});
