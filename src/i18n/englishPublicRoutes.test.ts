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
  it("rewrites approved public aliases to the established internal route tree", async () => {
    const config = require("../../next.config.js") as {
      rewrites: () => Promise<{ beforeFiles: unknown[] }>;
    };
    const { beforeFiles } = await config.rewrites();
    const expected = [
      { source: "/en/about", destination: "/en/over-ons" },
      {
        source: "/en/request-a-quotation",
        destination: "/en/offerte-aanvragen",
      },
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
        "/en/diensten/custom-software",
    );
    for (const rule of expected) {
      const aliasIndex = beforeFiles.findIndex(
        (candidate) =>
          (candidate as { source?: string }).source === rule.source,
      );
      expect(aliasIndex).toBeGreaterThanOrEqual(0);
      expect(aliasIndex).toBeLessThan(customSoftwareIndex);
    }
  });

  it("keeps source-owned English links on canonical public path families", () => {
    const englishPublicSource = [
      readTree("src/data/locales/en"),
      readTree("content/kennisbank/en"),
    ].join("\n");

    for (const forbidden of [
      "/en/services/",
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

    expect(categorySource).not.toContain("/services/");
    for (const source of applicationSources) {
      expect(source).not.toContain("/services/");
      expect(source).toContain("/diensten/custom-software/");
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
