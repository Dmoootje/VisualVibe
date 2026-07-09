// design-sync shim: @/i18n/navigation wraps next-intl's createNavigation, which
// needs the next-intl request context. In the Claude Design runtime we only need
// the Link to render a real anchor; the router hooks become inert stubs.
import * as React from "react";

export function Link(props: any) {
  const { href, children, locale, prefetch, replace, scroll, ...rest } =
    props ?? {};
  const resolved =
    typeof href === "string"
      ? href
      : href && typeof href === "object" && "pathname" in href
        ? String((href as { pathname?: string }).pathname ?? "#")
        : "#";
  return React.createElement("a", { href: resolved, ...rest }, children);
}

export const redirect = (_href?: string) => {};
export const permanentRedirect = (_href?: string) => {};
export const usePathname = () => "/";
export const getPathname = () => "/";
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
});
