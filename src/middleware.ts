import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import {
  getPublishedLocales,
  LOCALE_CONFIG,
  type SupportedLocale,
} from "./i18n/locales";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE_NAME } from "./lib/auth/constants";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const INTERNAL_LOCALE_REWRITE_HEADER = "x-visualvibe-internal-locale-rewrite";
const publicPrefix = (locale: SupportedLocale) =>
  locale === "nl" ? "/be" : `/${locale}`;
const DUTCH_PUBLIC_PREFIX = publicPrefix("nl");
const PUBLIC_LOCALE_PREFIXES = getPublishedLocales().map(publicPrefix);
const DISABLED_LOCALE_PREFIXES = Object.entries(LOCALE_CONFIG)
  .filter(([, config]) => config.status === "disabled")
  .map(([locale]) => `/${locale}`);

export function isPublicLocalePrefix(pathname: string): boolean {
  return PUBLIC_LOCALE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // `trailingSlash: true` means paths arrive as "/admin/login/"; normalise the
    // trailing slash before matching public paths, otherwise the public-path
    // check never matches and login redirects into an infinite loop.
    const normalizedPath =
      pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    // Cheap existence check only. The authoritative signature verification
    // happens in src/app/admin/(protected)/layout.tsx via the Admin SDK,
    // which needs the Node.js runtime and can't run in Edge middleware.
    if (PUBLIC_ADMIN_PATHS.includes(normalizedPath)) {
      return NextResponse.next();
    }

    const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME);
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // /be is the public prefix for the internal nl locale. Handle this alias
  // directly so Next never exposes /nl while normalizing trailing slashes.
  // The marker also prevents locale middleware from processing the internal
  // rewrite a second time in runtimes that re-enter middleware on rewrites.
  if (request.headers.get(INTERNAL_LOCALE_REWRITE_HEADER) === "nl") {
    return NextResponse.next();
  }

  const disabledPrefix = DISABLED_LOCALE_PREFIXES.find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (disabledPrefix) {
    const suffix = pathname.slice(disabledPrefix.length);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/be${suffix || "/"}`;
    if (!redirectUrl.pathname.endsWith("/")) redirectUrl.pathname += "/";
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (
    pathname === DUTCH_PUBLIC_PREFIX ||
    pathname.startsWith(`${DUTCH_PUBLIC_PREFIX}/`)
  ) {
    const suffix = pathname.slice(DUTCH_PUBLIC_PREFIX.length) || "/";
    // Keep the origin exactly as request.nextUrl: overriding the host (e.g.
    // with the Host header) makes the rewrite cross-origin, so Next proxies it
    // over the network to <host>:8080 and every /be page 500s with ETIMEDOUT
    // behind Firebase App Hosting (site-down incident 2026-07-14).
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/nl${suffix}`;
    if (!rewriteUrl.pathname.endsWith("/")) rewriteUrl.pathname += "/";

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(INTERNAL_LOCALE_REWRITE_HEADER, "nl");
    requestHeaders.set("x-next-intl-locale", "nl");

    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals, and any path with a file extension (static assets)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
