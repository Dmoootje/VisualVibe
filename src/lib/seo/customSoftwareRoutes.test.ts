import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);

describe("English custom-software public routes", () => {
  it("rewrites the natural English hub and detail paths to the internal route tree", async () => {
    const config = require("../../../next.config.js") as { rewrites: () => Promise<{ beforeFiles: unknown[] }> };
    const rewrites = await config.rewrites();

    expect(rewrites.beforeFiles).toEqual(expect.arrayContaining([
      { source: "/en/diensten/custom-software", destination: "/en/diensten/software-op-maat" },
      { source: "/en/diensten/custom-software/:subslug", destination: "/en/diensten/software-op-maat/:subslug" },
    ]));
  });
});
