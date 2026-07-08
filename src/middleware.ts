import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE_NAME } from "./lib/auth/constants";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // Cheap existence check only — the authoritative signature verification
    // happens in src/app/admin/(protected)/layout.tsx via the Admin SDK,
    // which needs the Node.js runtime and can't run in Edge middleware.
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
      return NextResponse.next();
    }

    const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME);
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals, and any path with a file extension (static assets)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
