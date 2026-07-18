import { beforeAll, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("next/server", () => ({
  NextResponse: {
    next: vi.fn(),
    redirect: vi.fn(),
    rewrite: vi.fn(),
  },
}));
vi.mock("next-intl/middleware", () => ({
  default: vi.fn(() => vi.fn(() => "intl middleware")),
}));

let isPublicLocalePrefix: (pathname: string) => boolean;
let runMiddleware: (request: NextRequest) => unknown;

beforeAll(async () => {
  ({ default: runMiddleware, isPublicLocalePrefix } = await import(
    "./middleware"
  ));
});

describe("public locale prefixes", () => {
  it("accepts every published locale prefix", () => {
    expect(isPublicLocalePrefix("/be/contact")).toBe(true);
    expect(isPublicLocalePrefix("/en/contact")).toBe(true);
  });

  it.each(["/fr/contact", "/de/contact"])(
    "rejects disabled locale prefix %s",
    (pathname) => {
      expect(isPublicLocalePrefix(pathname)).toBe(false);
    },
  );

  it("delegates published English paths to the locale middleware", () => {
    const request = {
      nextUrl: {
        pathname: "/en/contact",
        clone: vi.fn(() => ({ pathname: "/en/contact" })),
      },
      headers: new Headers(),
    } as unknown as NextRequest;

    expect(runMiddleware(request)).toBe("intl middleware");
  });

  it("redirects every disabled locale prefix to the published locale", async () => {
    const nextConfig = (await import("../next.config.js")).default as {
      redirects: () => Promise<
        Array<{ source: string; destination: string; permanent: boolean }>
      >;
    };
    const redirects = await nextConfig.redirects();

    expect(
      redirects.some(
        ({ source }) => source === "/en" || source === "/en/:path+",
      ),
    ).toBe(false);

    for (const locale of ["fr", "de"]) {
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
