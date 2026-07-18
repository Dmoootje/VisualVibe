import {
  getLocalizedServiceById,
  getServiceByLocalizedSlug,
  getServiceBySlug,
  serviceHref,
} from "@/data/services";
import {
  getLocalizedRegionById,
  getRegionByLocalizedSlug,
  getRegionBySlug,
} from "@/data/regions";
import {
  getLocalizedSoftwareServiceBySlug,
  getSoftwareService,
  getSoftwareServices,
  softwareServiceHref,
  softwareServiceHubHref,
} from "@/data/softwareServices";
import type { BlogLocale } from "@/types/blog";
import type { Region, Service } from "@/types";

const LOCALE_PREFIX = /^\/(?:en|be|nl)(?=\/|$)/i;
const DUTCH_ONLY_ENGLISH_PATHS = new Set([
  "/trouwfotograaf-limburg",
  "/realisaties/fotografie",
  "/realisaties/photography",
]);

function splitSuffix(href: string): { pathname: string; suffix: string } {
  const suffixStart = href.search(/[?#]/);
  return suffixStart === -1
    ? { pathname: href, suffix: "" }
    : { pathname: href.slice(0, suffixStart), suffix: href.slice(suffixStart) };
}

function withoutLocalePrefix(pathname: string): string {
  let normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  while (LOCALE_PREFIX.test(normalized)) {
    normalized = normalized.replace(LOCALE_PREFIX, "") || "/";
  }
  return normalized;
}

function keepsTrailingSlash(pathname: string): boolean {
  return pathname.length > 1 && pathname.endsWith("/");
}

function withOptionalTrailingSlash(pathname: string, trailingSlash: boolean): string {
  const withoutTrailingSlash = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
  return trailingSlash && withoutTrailingSlash !== "/"
    ? `${withoutTrailingSlash}/`
    : withoutTrailingSlash;
}

function serviceIdFromSlug(slug: string, locale: BlogLocale): string | undefined {
  const source = getServiceBySlug(slug);
  if (source) return source.slug;
  if (locale !== "en") return undefined;

  try {
    return getServiceByLocalizedSlug(slug, "en").id;
  } catch {
    return undefined;
  }
}

function regionIdFromSlug(slug: string, locale: BlogLocale): string | undefined {
  const source = getRegionBySlug(slug);
  if (source) return source.slug;
  if (locale !== "en") return undefined;

  try {
    return getRegionByLocalizedSlug(slug, "en").id;
  } catch {
    return undefined;
  }
}

export function resolveKnowledgeBaseService(
  href: string,
  locale: BlogLocale,
): Service | undefined {
  const { pathname } = splitSuffix(href);
  const slug = withoutLocalePrefix(pathname).split("/").filter(Boolean).at(-1);
  if (!slug) return undefined;
  const id = serviceIdFromSlug(slug, locale);
  if (!id) return undefined;
  return locale === "en" ? getLocalizedServiceById(id, "en").service : getServiceBySlug(id);
}

export function resolveKnowledgeBaseRegion(
  href: string,
  locale: BlogLocale,
): Region | undefined {
  const { pathname } = splitSuffix(href);
  const slug = withoutLocalePrefix(pathname).split("/").filter(Boolean).at(-1);
  if (!slug) return undefined;
  const id = regionIdFromSlug(slug, locale);
  if (!id) return undefined;
  return locale === "en" ? getLocalizedRegionById(id, "en") : getRegionBySlug(id);
}

function normalizeServicePath(
  pathname: string,
  locale: BlogLocale,
  trailingSlash: boolean,
): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "diensten") return undefined;
  if (segments.length === 1) return withOptionalTrailingSlash("/diensten", trailingSlash);

  const slug = segments.at(-1)!;
  const serviceId = serviceIdFromSlug(slug, locale);
  if (serviceId) {
    const service =
      locale === "en"
        ? getLocalizedServiceById(serviceId, "en").service
        : getServiceBySlug(serviceId);
    return service
      ? withOptionalTrailingSlash(serviceHref(service), trailingSlash)
      : undefined;
  }

  const isSoftwareHub =
    segments[1] === "software-op-maat" || segments[1] === "custom-software";
  if (!isSoftwareHub) return undefined;
  if (segments.length === 2) {
    return withOptionalTrailingSlash(softwareServiceHubHref(locale), trailingSlash);
  }

  const sourceSoftware = getSoftwareService(slug);
  const localizedSoftware =
    sourceSoftware ?? getLocalizedSoftwareServiceBySlug(slug, locale);
  const softwareId = localizedSoftware?.id;
  const target = softwareId
    ? getSoftwareServices(locale).find((service) => service.id === softwareId)
    : undefined;
  return target
    ? withOptionalTrailingSlash(softwareServiceHref(target, locale), trailingSlash)
    : undefined;
}

function normalizeRegionPath(
  pathname: string,
  locale: BlogLocale,
  trailingSlash: boolean,
): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "regio" || segments.length !== 2) return undefined;
  const id = regionIdFromSlug(segments[1], locale);
  if (!id) return undefined;
  const region = locale === "en" ? getLocalizedRegionById(id, "en") : getRegionBySlug(id);
  return region
    ? withOptionalTrailingSlash(`/regio/${region.slug}`, trailingSlash)
    : undefined;
}

/**
 * Converts repository-authored knowledge-base links to locale-relative public
 * routes before they reach next-intl's locale-aware Link component.
 */
export function normalizeKnowledgeBaseHref(
  href: string,
  locale: BlogLocale,
): string | null {
  const trimmed = href.trim();
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("?") ||
    /^(?:mailto|tel):/i.test(trimmed) ||
    /^(?:https?:)?\/\//i.test(trimmed)
  ) {
    return trimmed;
  }

  const { pathname: authoredPathname, suffix } = splitSuffix(trimmed);
  const trailingSlash = keepsTrailingSlash(authoredPathname);
  const pathname = withoutLocalePrefix(authoredPathname);
  const comparablePath = pathname.toLowerCase().replace(/\/+$/, "") || "/";

  if (locale === "en" && DUTCH_ONLY_ENGLISH_PATHS.has(comparablePath)) {
    return null;
  }
  if (comparablePath === "/offerte-aanvragen" || comparablePath === "/request-a-quotation") {
    return `${locale === "en" ? "/request-a-quotation/" : "/offerte-aanvragen/"}${suffix}`;
  }
  if (comparablePath === "/over-ons" || comparablePath === "/about") {
    return `${locale === "en" ? "/about/" : "/over-ons/"}${suffix}`;
  }

  const servicePath = normalizeServicePath(pathname, locale, trailingSlash);
  if (servicePath) return `${servicePath}${suffix}`;
  const regionPath = normalizeRegionPath(pathname, locale, trailingSlash);
  if (regionPath) return `${regionPath}${suffix}`;

  return `${pathname}${suffix}`;
}
