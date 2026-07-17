import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const nextConfig = require("../../../next.config.js") as {
  experimental?: {
    inlineCss?: boolean;
  };
};

describe("VisualVibe Next.js performance configuration", () => {
  it("keeps global CSS out of the initial HTML document", () => {
    expect(nextConfig.experimental?.inlineCss).not.toBe(true);
  });
});
