import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function expectServerComponent(path: string) {
  expect(source(path)).not.toMatch(/^\s*["']use client["'];/m);
}

describe("homepage hydration boundaries", () => {
  it("keeps static homepage section shells on the server", () => {
    expectServerComponent("src/features/home/Features/index.tsx");
    expectServerComponent("src/features/home/HowItWorks/index.tsx");
    expectServerComponent("src/features/home/Testimonials/index.tsx");
    expectServerComponent("src/features/home/Cta/index.tsx");
    expectServerComponent("src/features/home/BlogPreview/components/BlogGrid.tsx");

    expect(source("src/features/home/Features/index.tsx")).toContain("FeaturesInteractive");
    expect(source("src/features/home/HowItWorks/index.tsx")).toContain("ProcessExplorer");
    expect(source("src/features/home/HowItWorks/index.tsx")).toContain("ActiveProcessLink");
    expect(source("src/features/home/Testimonials/index.tsx")).toContain(
      "TestimonialsCarousel",
    );

    expect(
      source("src/features/home/HowItWorks/components/ProcessExplorer.tsx"),
    ).not.toContain("header: ReactNode");
    expect(
      source("src/features/home/Testimonials/components/TestimonialsCarousel.tsx"),
    ).not.toContain("header: ReactNode");
    expect(source("src/features/home/Testimonials/index.tsx")).toContain("<section");
  });

  it("uses CSS instead of browser observers for the homepage sector marquee", () => {
    const marquee = source(
      "src/features/home/SectorIntro/components/HomeSectorMarquee.tsx",
    );

    expect(marquee).not.toMatch(/^\s*["']use client["'];/m);
    expect(marquee).not.toContain("IntersectionObserver");
    expect(marquee).not.toContain("useEffect");
    expect(marquee).toContain("<SectorMarquee");
  });

  it("does not wrap the public app in an unused theme client provider", () => {
    const layout = source("src/app/[locale]/layout.tsx");

    expect(layout).not.toContain('import { ThemeProvider } from "@/providers"');
    expect(layout).not.toContain("<ThemeProvider");
  });

  it("does not ship the full sector SVG sprite on every public page", () => {
    const layout = source("src/app/[locale]/layout.tsx");
    const sectorPage = source("src/app/[locale]/(site)/sectoren/[slug]/page.tsx");
    const sectorIcon = source("src/components/sectors/SectorIcon.tsx");

    expect(layout).not.toContain("SectorIconSprite");
    expect(sectorPage).toContain("<SectorIconSprite />");
    expect(sectorIcon).toContain("SECTOR_ICONS");
  });

  it("draws repeated hero film frames and equalizers with CSS", () => {
    const stage = source("src/features/home/Hero/lib/stage.ts");

    expect(stage).not.toContain("Array.from({ length: 28 })");
    expect(stage).not.toContain("Array.from({ length: 40 })");
    expect(stage).not.toContain("Array.from({ length: 30 })");
    expect(stage).toContain("vvh-stripFrames");
    expect(stage).toContain("vvh-eqVideo");
    expect(stage).toContain("vvh-eqPodcast");
    expect(stage).not.toContain("const droneQuad");
    expect(stage).not.toContain("<svg");
  });

  it("does not serialize large decorative partner SVG strings in the footer", () => {
    const partners = source("src/layouts/Footer/components/FooterPartners.tsx");

    expect(partners).not.toContain("PARTNER_LOGOS");
    expect(partners).not.toContain("dangerouslySetInnerHTML");
    expect(partners).toContain("p.alt");
  });

  it("loads the full quote form only after a quote action", () => {
    const controllerPath = resolve(
      process.cwd(),
      "src/components/quote/QuoteModalController.tsx",
    );

    expect(existsSync(controllerPath)).toBe(true);
    if (!existsSync(controllerPath)) return;

    const controller = readFileSync(controllerPath, "utf8");
    const siteLayout = source("src/app/[locale]/(site)/layout.tsx");
    const quoteButton = source("src/components/quote/QuoteButton.tsx");

    expect(controller).toContain('dynamic(() => import("./QuoteModal")');
    expect(controller).toMatch(/open\s*&&\s*<QuoteModalContent/);
    expect(controller).not.toContain('from "./QuoteModal";');
    expect(controller).not.toContain("createContext");
    expect(controller).not.toContain("children: ReactNode");
    expect(siteLayout).toContain("<QuoteModalController />");
    expect(siteLayout).not.toContain("<QuoteModalProvider>");
    expect(quoteButton).not.toMatch(/^\s*["']use client["'];/m);
    expect(quoteButton).toContain("data-quote-modal={mode}");
  });

  it("keeps large barrel modules out of the shared navigation bundle", () => {
    const navigation = source("src/components/nav/Nav.tsx");

    expect(navigation).toContain(
      'from "@/components/sectors/SectorIcon"',
    );
    expect(navigation).not.toContain('from "@/components/sectors"');
    expect(navigation).toContain('from "@/data/toolCards"');
    expect(navigation).not.toContain('from "@/data/tools"');
  });

  it("loads the full mobile drawer only when the menu is opened", () => {
    const navigation = source("src/components/nav/Nav.tsx");
    const drawer = source("src/components/nav/MobileNavDrawer.tsx");

    expect(navigation).toContain('dynamic(() => import("./MobileNavDrawer")');
    expect(navigation).toMatch(/drawer\s*&&\s*<MobileNavDrawer/);
    expect(navigation).not.toContain('className="vvnav-mvPanel"');
    expect(drawer).toMatch(/^\s*["']use client["'];/m);
    expect(drawer).toContain('className="vvnav-mvPanel"');
  });
});
