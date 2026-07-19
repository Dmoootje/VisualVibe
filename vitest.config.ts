import { fileURLToPath, URL } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    exclude: [
      ...configDefaults.exclude,
      ".worktrees/**",
      "**/.worktrees/**",
      "scripts/lib/analysis-quota-rollout.test.mjs",
      // Playwright specs (tests/, see playwright.config.ts) run via
      // `npx playwright test`, not vitest.
      "tests/**",
    ],
  },
});
