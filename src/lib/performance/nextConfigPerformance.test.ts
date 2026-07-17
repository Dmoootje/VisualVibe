import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const nextConfig = require("../../../next.config.js") as {
  experimental?: {
    inlineCss?: boolean;
  };
  headers: () => Promise<
    Array<{
      source: string;
      headers: Array<{ key: string; value: string }>;
    }>
  >;
};

describe("VisualVibe Next.js performance configuration", () => {
  it("keeps global CSS out of the initial HTML document", () => {
    expect(nextConfig.experimental?.inlineCss).not.toBe(true);
  });

  it("scopes immutable caching to hashed Next static assets", async () => {
    const rules = await nextConfig.headers();
    const staticRule = rules.find((rule) => rule.source === "/_next/static/:path*");
    const cacheControl = staticRule?.headers.find(
      (header) => header.key.toLowerCase() === "cache-control",
    );

    expect(cacheControl?.value).toBe("public, max-age=31536000, immutable");
    expect(
      rules.some(
        (rule) =>
          rule.source === "/:path*" &&
          rule.headers.some(
            (header) =>
              header.key.toLowerCase() === "cache-control" &&
              header.value.includes("s-maxage"),
          ),
      ),
    ).toBe(false);
  });
});
