import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("next/server", () => ({
  NextResponse: {
    next: vi.fn(),
    redirect: vi.fn(),
    rewrite: vi.fn(),
  },
}));
vi.mock("next-intl/middleware", () => ({ default: vi.fn(() => vi.fn()) }));

let isPublicLocalePrefix: (pathname: string) => boolean;

beforeAll(async () => {
  ({ isPublicLocalePrefix } = await import("./middleware"));
});

describe("public locale prefixes", () => {
  it("accepts the published Dutch prefix", () => {
    expect(isPublicLocalePrefix("/be/contact")).toBe(true);
  });

  it.each(["/en/contact", "/fr/contact", "/de/contact"])(
    "rejects disabled locale prefix %s",
    (pathname) => {
      expect(isPublicLocalePrefix(pathname)).toBe(false);
    },
  );

  it("redirects every disabled locale prefix to the published locale", async () => {
    const nextConfig = (await import("../next.config.js")).default as {
      redirects: () => Promise<
        Array<{ source: string; destination: string; permanent: boolean }>
      >;
    };
    const redirects = await nextConfig.redirects();

    for (const locale of ["en", "fr", "de"]) {
      expect(redirects).toContainEqual({
        source: `/${locale}`,
        destination: "/be/",
        permanent: true,
      });
      expect(redirects).toContainEqual({
        source: `/${locale}/:path+`,
        destination: "/be/:path+/",
        permanent: true,
      });
    }
  });
});
