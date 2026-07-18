import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (relative: string) => fs.readFileSync(path.join(root, relative), "utf8");

const routeFiles = [
  "src/app/[locale]/(site)/realisaties/page.tsx",
  "src/app/[locale]/(site)/realisaties/[category]/page.tsx",
  "src/app/[locale]/(site)/realisaties/applicaties/page.tsx",
  "src/app/[locale]/(site)/realisaties/applicaties/[slug]/page.tsx",
  "src/app/[locale]/(site)/realisaties/applicaties/[slug]/layout.tsx",
];

describe("realisation route locale integration", () => {
  it.each(routeFiles)("threads locale through %s", (file) => {
    const source = read(file);
    expect(source).toContain("locale");
    expect(source).toMatch(/SupportedLocale|assertSupportedLocale/);
  });

  it("uses the strict hub and category selectors", () => {
    expect(read(routeFiles[0])).toContain("getHubData(locale)");
    const category = read(routeFiles[1]);
    expect(category).toContain("getRealisatieCategoryByLocalizedSlug");
    expect(category).toContain("getLocalizedRealisatieCategoryById");
    expect(category).toContain("getLocalizedWebdesignProject");
    expect(category).toContain("await getFotografieGalleries(locale)");
    expect(category).toContain('locale === "nl" ? await getVideografieVideos() : null');
  });

  it("uses strict application selectors for list, detail, metadata and related work", () => {
    for (const file of routeFiles.slice(2)) {
      expect(read(file)).toMatch(/getLocalizedApplicationCaseById|getApplicationCaseByLocalizedSlug/);
    }
    expect(read(routeFiles[3])).not.toContain("getApplicationCaseBySlug(");
  });

  it("keeps locale-sensitive labels outside visitor components", () => {
    const componentFiles = fs
      .readdirSync(path.join(root, "src/components/realisaties"))
      .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
      .filter((file) => !["RealisatieFotografieGalerijen.tsx", "RealisatieSmugMugGalerijen.tsx"].includes(file))
      .map((file) => read(`src/components/realisaties/${file}`))
      .concat(read("src/components/webdesign/RealisatieModal.tsx"));
    for (const source of componentFiles) {
      if (/Realisatie|Bekijk|Offerte|Binnenkort|Sluiten|Vorige|Volgende/.test(source)) {
        expect(source).toMatch(/locale|labels/);
      }
    }
  });
});
