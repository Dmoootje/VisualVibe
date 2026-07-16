import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

type HeaderEntry = { key: string; value: string };
type HeaderRule = { source: string; headers: HeaderEntry[] };

const require = createRequire(import.meta.url);
const nextConfig = require("../../../next.config.js") as {
  headers: () => Promise<HeaderRule[]>;
};

async function allHeaders() {
  const rules = await nextConfig.headers();
  return rules.flatMap((rule) => rule.headers);
}

function headerMap(headers: HeaderEntry[]) {
  return new Map(headers.map((header) => [header.key.toLowerCase(), header.value]));
}

describe("VisualVibe security headers", () => {
  it("sends the baseline browser security headers on app routes", async () => {
    const rules = await nextConfig.headers();
    const appWideRule = rules.find((rule) => rule.source === "/:path*");

    expect(appWideRule).toBeDefined();

    const headers = headerMap(appWideRule?.headers ?? []);

    expect(headers.get("strict-transport-security")).toBe(
      "max-age=31536000; includeSubDomains; preload",
    );
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("permissions-policy")).toContain("camera=()");
    expect(headers.get("permissions-policy")).toContain("microphone=()");
    expect(headers.get("permissions-policy")).toContain(
      'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com" "https://my.matterport.com")',
    );
    expect(headers.get("permissions-policy")).toContain(
      'fullscreen=(self "https://www.youtube.com" "https://www.youtube-nocookie.com" "https://my.matterport.com" "https://www.google.com" "https://maps.google.com")',
    );
    expect(headers.get("permissions-policy")).toContain(
      'gyroscope=(self "https://www.youtube.com" "https://www.youtube-nocookie.com" "https://my.matterport.com")',
    );
    expect(headers.get("content-security-policy")).toContain("default-src 'self'");
  });

  it("keeps VisualVibe media, analytics and embedded experiences allowed by the CSP", async () => {
    const headers = headerMap(await allHeaders());
    const csp = headers.get("content-security-policy") ?? "";

    expect(csp).toContain("img-src");
    expect(csp).toContain("https://firebasestorage.googleapis.com");
    expect(csp).toContain("https://*.firebasestorage.app");
    expect(csp).toContain("https://images.unsplash.com");
    expect(csp).toContain("https://img.youtube.com");
    expect(csp).toContain("https://*.googleusercontent.com");
    expect(csp).toContain("https://cdn.simpleicons.org");

    expect(csp).toContain("script-src");
    expect(csp).toContain("https://analytics.ahrefs.com");
    expect(csp).toContain("https://www.googletagmanager.com");

    expect(csp).toContain("connect-src");
    expect(csp).toContain("https://www.googleapis.com");
    expect(csp).toContain("https://firestore.googleapis.com");
    expect(csp).toContain("https://identitytoolkit.googleapis.com");
    expect(csp).toContain("https://api.smugmug.com");
    expect(csp).toContain("https://seowebsites.be");

    expect(csp).toContain("frame-src");
    expect(csp).toContain("https://www.youtube.com");
    expect(csp).toContain("https://my.matterport.com");
    expect(csp).toContain("https://*.google.be");
  });

  it("sets a long browser cache lifetime for stable brand assets", async () => {
    const rules = await nextConfig.headers();
    const brandAssetsRule = rules.find((rule) =>
      rule.source.includes("logo\\.svg|logo-email\\.png|weddingvibe-logo\\.svg"),
    );

    expect(brandAssetsRule).toBeDefined();
    expect(headerMap(brandAssetsRule?.headers ?? []).get("cache-control")).toBe(
      "public, max-age=31536000",
    );
  });
});
