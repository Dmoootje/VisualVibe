import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);

function readTree(directory: string): string {
  return readdirSync(directory, { withFileTypes: true })
    .map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? readTree(path) : readFileSync(path, "utf8");
    })
    .join("\n");
}

describe("English public routes", () => {
  it("redirects Dutch-only English URLs to an intentional published destination", async () => {
    const config = require("../../next.config.js") as {
      redirects: () => Promise<
        Array<{ source: string; destination: string; permanent: boolean }>
      >;
    };
    const redirects = await config.redirects();

    expect(redirects).toEqual(expect.arrayContaining([
      {
        source: "/en/trouwfotograaf-limburg",
        destination: "/be/trouwfotograaf-limburg/",
        permanent: true,
      },
      {
        source: "/en/diensten/webdesign/website-met-ai-functionaliteiten",
        destination: "/en/services/custom-software/ai-application-development/",
        permanent: true,
      },
      // English services moved from /en/diensten/* to /en/services/*.
      { source: "/en/diensten", destination: "/en/services/", permanent: true },
      { source: "/en/diensten/:path+", destination: "/en/services/:path+/", permanent: true },
      // The quotation page was removed; old URLs land on the contact page.
      { source: "/en/request-a-quotation", destination: "/en/contact/", permanent: true },
      { source: "/en/offerte-aanvragen", destination: "/en/contact/", permanent: true },
    ]));
    expect(redirects.some(({ source }) =>
      source === "/en" || source === "/en/:path+"
    )).toBe(false);
  });

  it("rewrites approved public aliases to the established internal route tree", async () => {
    const config = require("../../next.config.js") as {
      rewrites: () => Promise<{ beforeFiles: unknown[] }>;
    };
    const { beforeFiles } = await config.rewrites();
    const expected = [
      { source: "/en/about", destination: "/en/over-ons" },
      {
        source: "/en/website-analysis",
        destination: "/en/website-analyse",
      },
      {
        source: "/en/website-analysis/report/:token",
        destination: "/en/website-analyse/rapport/:token",
      },
    ];

    for (const rule of expected) expect(beforeFiles).toContainEqual(rule);

    const customSoftwareIndex = beforeFiles.findIndex(
      (rule) =>
        (rule as { source?: string }).source ===
        "/en/services/custom-software",
    );
    for (const rule of expected) {
      const aliasIndex = beforeFiles.findIndex(
        (candidate) =>
          (candidate as { source?: string }).source === rule.source,
      );
      expect(aliasIndex).toBeGreaterThanOrEqual(0);
      expect(aliasIndex).toBeLessThan(customSoftwareIndex);
    }

    // The specific custom-software mapping must win before the generic
    // /en/services catch-all rewrite.
    const genericServicesIndex = beforeFiles.findIndex(
      (rule) => (rule as { source?: string }).source === "/en/services/:path*",
    );
    expect(customSoftwareIndex).toBeGreaterThanOrEqual(0);
    expect(genericServicesIndex).toBeGreaterThan(customSoftwareIndex);
  });

  it("keeps source-owned English links on canonical public path families", () => {
    const englishPublicSource = [
      readTree("src/data/locales/en"),
      readTree("content/kennisbank/en"),
    ].join("\n");

    for (const forbidden of [
      "/en/diensten/",
      "/en/case-studies/",
      "/en/about-us/",
      "/en/regions/",
      "/en/sectors/",
      "/en/wedding-photographer-limburg/",
    ]) {
      expect(englishPublicSource).not.toContain(forbidden);
    }
  });

  it("rewrites English application routes and keeps their visible links canonical", async () => {
    const config = require("../../next.config.js") as {
      rewrites: () => Promise<{ beforeFiles: unknown[] }>;
    };
    const { beforeFiles } = await config.rewrites();

    expect(beforeFiles).toEqual(expect.arrayContaining([
      {
        source: "/en/realisaties/applications",
        destination: "/en/realisaties/applicaties",
      },
      {
        source: "/en/realisaties/applications/:slug",
        destination: "/en/realisaties/applicaties/:slug",
      },
    ]));

    const categorySource = readFileSync(
      "src/app/[locale]/(site)/realisaties/[category]/page.tsx",
      "utf8",
    );
    const applicationSources = [
      readFileSync(
        "src/app/[locale]/(site)/realisaties/applicaties/page.tsx",
        "utf8",
      ),
      readFileSync(
        "src/app/[locale]/(site)/realisaties/applicaties/[slug]/page.tsx",
        "utf8",
      ),
    ];

    expect(categorySource).not.toContain('"/diensten/custom-software/"');
    for (const source of applicationSources) {
      expect(source).toContain('"/services/custom-software/"');
      expect(source).not.toContain('en ? "/diensten/');
    }
  });

  it("uses the translated case-study category slug from the English registry", () => {
    const article = readFileSync(
      "content/kennisbank/en/what-is-a-3d-tour.mdx",
      "utf8",
    );

    expect(article).toContain("/en/realisaties/3d-vr-ar/");
    expect(article).not.toContain("/en/realisaties/3d-vr/");
  });
});
