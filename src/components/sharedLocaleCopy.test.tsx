import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.ComponentProps<"a">) =>
    createElement("a", { href: String(href), ...props }, children),
}));
vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: React.ComponentProps<"img"> & { fill?: boolean; priority?: boolean }) =>
    createElement("img", props),
}));

import { RegionCard } from "@/components/cards/RegionCard";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { KbHeroShell } from "@/components/kennisbank/KbHeroShell";
import { ContactMap } from "@/components/contact/ContactMap";
import { SectorIcon } from "@/components/sectors/SectorIcon";
import { RegionMapCard } from "@/features/home/RegionIntro/components/RegionMapCard";
import RegionIntro from "@/features/home/RegionIntro";
import { getLocalizedRegionById } from "@/data/regions";

type LocaleProp = { locale?: "nl" | "en" };

describe("shared locale-aware copy", () => {
  it("renders English region labels and CTA while preserving the Dutch labels", () => {
    const englishRegion = getLocalizedRegionById("limburg", "en");
    const dutchRegion = getLocalizedRegionById("limburg", "nl");
    const EnglishRegionCard = RegionCard as React.ComponentType<React.ComponentProps<typeof RegionCard> & LocaleProp>;
    const EnglishRegionMapCard = RegionMapCard as React.ComponentType<React.ComponentProps<typeof RegionMapCard> & LocaleProp>;

    const english = renderToStaticMarkup(<><EnglishRegionCard region={englishRegion} locale="en" /><EnglishRegionMapCard region={englishRegion} locale="en" /></>);
    const dutch = renderToStaticMarkup(<><EnglishRegionCard region={dutchRegion} locale="nl" /><EnglishRegionMapCard region={dutchRegion} locale="nl" /></>);

    expect(english).toContain("Home region");
    expect(english).toContain("Explore region");
    expect(english).not.toContain("Thuisregio");
    expect(english).not.toContain("Ontdek regio");
    expect(dutch).toContain("Thuisregio");
    expect(dutch).toContain("Ontdek regio");
  });

  it("passes an explicit locale through the home region section", () => {
    const english = renderToStaticMarkup(<RegionIntro locale="en" />);

    expect(english).toContain("Based in Limburg, active across several regions");
    expect(english).toContain("Home region");
    expect(english).toContain("Explore region");
    expect(english).not.toContain("Thuisregio");
  });

  it("uses an English accessible name for both breadcrumb components", () => {
    const LocalizedBreadcrumbs = Breadcrumbs as React.ComponentType<React.ComponentProps<typeof Breadcrumbs> & LocaleProp>;
    const LocalizedHero = KbHeroShell as React.ComponentType<React.ComponentProps<typeof KbHeroShell> & LocaleProp>;
    const heroProps: React.ComponentProps<typeof KbHeroShell> = {
      breadcrumb: [{ label: "Home" }, { label: "Knowledge base" }],
      eyebrow: { icon: null, label: "Category" },
      title: "Photography",
      subtitle: "Guides",
      stats: [],
      search: null,
    };
    const english = renderToStaticMarkup(<><LocalizedBreadcrumbs locale="en" items={[{ name: "Home" }]} /><LocalizedHero {...heroProps} locale="en" /></>);
    const dutch = renderToStaticMarkup(<><LocalizedBreadcrumbs locale="nl" items={[{ name: "Home" }]} /><LocalizedHero {...heroProps} locale="nl" /></>);

    expect(english.match(/aria-label="Breadcrumbs"/g)).toHaveLength(2);
    expect(english).not.toContain("Kruimelpad");
    expect(dutch.match(/aria-label="Kruimelpad"/g)).toHaveLength(2);
  });

  it("localizes the contact route action and keeps sector icons decorative", () => {
    const LocalizedContactMap = ContactMap as React.ComponentType<React.ComponentProps<typeof ContactMap> & LocaleProp>;
    const english = renderToStaticMarkup(<LocalizedContactMap locale="en" addressLines={["Example"]} />);
    const dutch = renderToStaticMarkup(<LocalizedContactMap locale="nl" addressLines={["Voorbeeld"]} />);
    const icon = renderToStaticMarkup(<SectorIcon id="kmo" />);

    expect(english).toContain("View route");
    expect(english).not.toContain("Bekijk route");
    expect(dutch).toContain("Bekijk route");
    expect(icon).not.toContain('aria-label="kmo"');
    expect(icon).toContain('aria-hidden="true"');
  });
});
