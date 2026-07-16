import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

type RewriteRule = {
  source: string;
  destination: string;
};

const require = createRequire(import.meta.url);
const nextConfig = require("../../../next.config.js") as {
  rewrites: () => Promise<{
    afterFiles: RewriteRule[];
  }>;
};

describe("IndexNow keyfile rewrite", () => {
  it("passes the key as a route segment instead of a query string", async () => {
    const rewrites = await nextConfig.rewrites();
    const keyfileRewrite = rewrites.afterFiles.find(
      (rule) => rule.source === "/:key([a-zA-Z0-9-]{8,128}).txt",
    );

    expect(keyfileRewrite?.destination).toBe("/api/indexnow/keyfile/:key/");
  });
});
