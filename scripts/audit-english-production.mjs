import process from "node:process";
import { pathToFileURL } from "node:url";

export const defaultBaseUrl =
  process.env.PUBLICATION_AUDIT_BASE_URL ?? "http://127.0.0.1:3210";

export const requiredRepresentativePaths = [
  "/en/",
  "/en/about/",
  "/en/contact/",
  "/en/request-a-quotation/",
  "/en/privacy/",
  "/en/diensten/",
  "/en/diensten/web-design/",
  "/en/regio/limburg-belgium/",
  "/en/sectoren/construction-renovation/",
  "/en/realisaties/",
  "/en/diensten/custom-software/",
];

function decodeHtmlEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    quot: '"',
  };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|quot);/giu, (entity, code) => {
    if (code.startsWith("#x")) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    if (code.startsWith("#")) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    return named[code] ?? entity;
  });
}

function attributesOf(tag) {
  const attributes = {};
  for (const match of tag.matchAll(
    /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gu,
  )) {
    attributes[match[1].toLowerCase()] = decodeHtmlEntities(
      match[2] ?? match[3] ?? match[4] ?? "",
    );
  }
  return attributes;
}

export function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/giu)]
    .map((match) => decodeHtmlEntities(match[1].trim()))
    .filter(Boolean);
}

export function extractDocumentSignals(html) {
  let canonical;
  const hreflangs = [];
  for (const match of html.matchAll(/<link\b[^>]*>/giu)) {
    const attributes = attributesOf(match[0]);
    const rel = (attributes.rel ?? "").toLowerCase().split(/\s+/u);
    if (rel.includes("canonical") && attributes.href && canonical === undefined) {
      canonical = attributes.href;
    }
    if (rel.includes("alternate") && attributes.hreflang && attributes.href) {
      hreflangs.push({ language: attributes.hreflang, href: attributes.href });
    }
  }

  const internalLinks = [...html.matchAll(/<a\b[^>]*>/giu)].flatMap((match) => {
    const href = attributesOf(match[0]).href;
    return href ? [href] : [];
  });
  const imageTags = [...html.matchAll(/<img\b[^>]*>/giu)];
  const missingImageAltCount = imageTags.filter(
    (match) => !("alt" in attributesOf(match[0])),
  ).length;

  return { canonical, hreflangs, internalLinks, missingImageAltCount };
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/u, "");
}

function routeOf(url, baseUrl) {
  try {
    const parsed = new URL(url, baseUrl);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return String(url);
  }
}

function sameUrl(left, right, baseUrl) {
  try {
    const first = new URL(left, baseUrl);
    const second = new URL(right, baseUrl);
    first.hash = "";
    second.hash = "";
    return first.href === second.href;
  } catch {
    return false;
  }
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

export async function auditEnglishPublication({
  baseUrl = defaultBaseUrl,
  fetchImpl = fetch,
} = {}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const baseOrigin = new URL(normalizedBaseUrl).origin;
  const issues = [];
  const addIssue = (route, code, message, target) => {
    issues.push({ route, code, message, ...(target ? { target } : {}) });
  };

  const responseCache = new Map();
  const fetchDocument = (url, redirect = "follow") => {
    const key = `${redirect}:${url}`;
    if (!responseCache.has(key)) {
      responseCache.set(key, (async () => {
        try {
          const response = await fetchImpl(url, { redirect });
          return { response, body: await response.text(), error: undefined };
        } catch (error) {
          return { response: undefined, body: "", error };
        }
      })());
    }
    return responseCache.get(key);
  };

  const sitemapUrl = `${normalizedBaseUrl}/sitemap.xml`;
  const sitemapResult = await fetchDocument(sitemapUrl);
  let sitemapUrls = [];
  if (sitemapResult.error || !sitemapResult.response?.ok) {
    addIssue(
      "/sitemap.xml",
      "broken_sitemap",
      sitemapResult.error
        ? `Sitemap request failed: ${sitemapResult.error.message}`
        : `Sitemap returned HTTP ${sitemapResult.response?.status ?? "unknown"}`,
    );
  } else {
    sitemapUrls = parseSitemapUrls(sitemapResult.body);
  }

  const publicOrigins = new Set();
  const englishSitemapUrls = [...new Set(sitemapUrls.filter((value) => {
    try {
      const url = new URL(value);
      publicOrigins.add(url.origin);
      return url.pathname === "/en" || url.pathname.startsWith("/en/");
    } catch {
      addIssue("/sitemap.xml", "invalid_sitemap_url", `Invalid sitemap URL: ${value}`, value);
      return false;
    }
  }))];
  const toFetchUrl = (publicUrl) => {
    const parsed = new URL(publicUrl, normalizedBaseUrl);
    return publicOrigins.has(parsed.origin) || parsed.origin === baseOrigin
      ? `${normalizedBaseUrl}${parsed.pathname}${parsed.search}`
      : parsed.href;
  };
  const isSiteOrigin = (origin) => origin === baseOrigin || publicOrigins.has(origin);

  const englishSitemapSet = new Set(englishSitemapUrls.map((value) => new URL(value).pathname));
  for (const path of requiredRepresentativePaths) {
    if (!englishSitemapSet.has(path)) {
      addIssue(path, "missing_representative_path", "Required English path is absent from the sitemap");
    }
  }

  let disabledLocaleRedirects = 0;
  for (const locale of ["fr", "de"]) {
    const route = `/${locale}/`;
    const result = await fetchDocument(`${normalizedBaseUrl}${route}`, "manual");
    const location = result.response?.headers.get("location");
    let locationPath;
    try {
      locationPath = location ? new URL(location, normalizedBaseUrl).pathname : undefined;
    } catch {
      locationPath = undefined;
    }
    if (result.error || result.response?.status !== 308 || locationPath !== "/be/") {
      addIssue(
        route,
        "invalid_disabled_locale_redirect",
        `Expected HTTP 308 to /be/, received ${result.response?.status ?? "request error"} to ${location ?? "no location"}`,
      );
    } else {
      disabledLocaleRedirects += 1;
    }
  }

  const englishRoot = await fetchDocument(`${normalizedBaseUrl}/en/`, "manual");
  if (englishRoot.error || englishRoot.response?.status !== 200) {
    addIssue(
      "/en/",
      "invalid_english_root_status",
      `Expected HTTP 200 without redirect, received ${englishRoot.response?.status ?? "request error"}`,
    );
  }

  const hreflangReferences = [];
  const internalLinkReferences = [];
  let crawledEnglishPages = 0;
  await mapWithConcurrency(englishSitemapUrls, 8, async (pageUrl) => {
    const route = routeOf(pageUrl, normalizedBaseUrl);
    const pageFetchUrl = toFetchUrl(pageUrl);
    const result = await fetchDocument(pageFetchUrl);
    if (result.error || !result.response?.ok) {
      addIssue(
        route,
        "broken_sitemap_target",
        result.error
          ? `Request failed: ${result.error.message}`
          : `Sitemap target returned HTTP ${result.response?.status}`,
        pageUrl,
      );
      return;
    }
    crawledEnglishPages += 1;

    const finalUrl = result.response.url || pageFetchUrl;
    if (!sameUrl(finalUrl, pageFetchUrl, normalizedBaseUrl)) {
      const finalRoute = routeOf(finalUrl, normalizedBaseUrl);
      addIssue(
        route,
        finalRoute === "/be/" || finalRoute.startsWith("/be/")
          ? "dutch_redirect"
          : "redirected_sitemap_target",
        `Sitemap target resolved to ${finalRoute}`,
        finalUrl,
      );
    }

    const signals = extractDocumentSignals(result.body);
    if (!signals.canonical || !sameUrl(signals.canonical, pageUrl, normalizedBaseUrl)) {
      addIssue(
        route,
        "missing_self_canonical",
        `Expected self-canonical ${pageUrl}, received ${signals.canonical ?? "none"}`,
        signals.canonical,
      );
    }
    if (signals.missingImageAltCount > 0) {
      addIssue(
        route,
        "missing_image_alt",
        `${signals.missingImageAltCount} image(s) have no alt attribute`,
      );
    }
    for (const alternate of signals.hreflangs) {
      hreflangReferences.push({ route, sourcePublicUrl: pageUrl, ...alternate });
    }
    for (const href of signals.internalLinks) {
      let target;
      try {
        target = new URL(href, pageUrl);
      } catch {
        continue;
      }
      if (
        isSiteOrigin(target.origin) &&
        (target.pathname === "/be" || target.pathname.startsWith("/be/"))
      ) {
        target.hash = "";
        addIssue(
          route,
          "dutch_internal_link",
          "English page renders a same-site Dutch link",
          target.href,
        );
        continue;
      }
      if (
        isSiteOrigin(target.origin) &&
        (target.pathname === "/en" || target.pathname.startsWith("/en/"))
      ) {
        target.hash = "";
        internalLinkReferences.push({
          route,
          href: target.href,
          fetchUrl: toFetchUrl(target.href),
        });
      }
    }
  });

  const uniqueHreflangReferences = [...new Map(
    hreflangReferences.map((reference) => [`${reference.route}\n${reference.language}\n${reference.href}`, reference]),
  ).values()];
  await mapWithConcurrency(uniqueHreflangReferences, 8, async (reference) => {
    let targetUrl;
    try {
      targetUrl = new URL(reference.href, reference.sourcePublicUrl).href;
    } catch {
      addIssue(reference.route, "invalid_hreflang_target", `Invalid ${reference.language} URL`, reference.href);
      return;
    }
    const targetFetchUrl = toFetchUrl(targetUrl);
    const result = await fetchDocument(targetFetchUrl);
    const finalUrl = result.response?.url || targetFetchUrl;
    if (
      result.error ||
      !result.response?.ok ||
      !sameUrl(finalUrl, targetFetchUrl, normalizedBaseUrl)
    ) {
      addIssue(
        reference.route,
        "invalid_hreflang_target",
        `${reference.language} target is not a successful canonical URL`,
        targetUrl,
      );
      return;
    }
    const canonical = extractDocumentSignals(result.body).canonical;
    if (!canonical || !sameUrl(canonical, targetUrl, normalizedBaseUrl)) {
      addIssue(
        reference.route,
        "invalid_hreflang_target",
        `${reference.language} target lacks a matching self-canonical`,
        targetUrl,
      );
    }
  });

  const uniqueInternalLinks = [...new Map(
    internalLinkReferences.map((reference) => [`${reference.route}\n${reference.href}`, reference]),
  ).values()];
  await mapWithConcurrency(uniqueInternalLinks, 8, async (reference) => {
    const result = await fetchDocument(reference.fetchUrl);
    const finalUrl = result.response?.url || reference.fetchUrl;
    const finalRoute = routeOf(finalUrl, normalizedBaseUrl);
    if (
      result.error ||
      !result.response?.ok ||
      !sameUrl(finalUrl, reference.fetchUrl, normalizedBaseUrl)
    ) {
      addIssue(
        reference.route,
        finalRoute === "/be/" || finalRoute.startsWith("/be/")
          ? "dutch_redirect"
          : "broken_internal_link",
        result.error
          ? `Internal English link request failed: ${result.error.message}`
          : `Internal English link returned ${result.response?.status ?? "unknown"} at ${finalRoute}`,
        reference.href,
      );
      return;
    }
    const canonical = extractDocumentSignals(result.body).canonical;
    if (!canonical || !sameUrl(canonical, reference.href, normalizedBaseUrl)) {
      addIssue(
        reference.route,
        "noncanonical_internal_link",
        `Internal English link lacks matching self-canonical ${reference.href}`,
        reference.href,
      );
    }
  });

  issues.sort((left, right) =>
    left.route.localeCompare(right.route) ||
    left.code.localeCompare(right.code) ||
    (left.target ?? "").localeCompare(right.target ?? ""),
  );

  return {
    baseUrl: normalizedBaseUrl,
    issues,
    counts: {
      sitemapUrls: sitemapUrls.length,
      englishSitemapUrls: englishSitemapUrls.length,
      crawledEnglishPages,
      hreflangTargets: uniqueHreflangReferences.length,
      internalEnglishTargets: uniqueInternalLinks.length,
      disabledLocaleRedirects,
    },
  };
}

export function formatAuditReport(result) {
  const { counts, issues } = result;
  const lines = [
    `English publication audit: ${counts.englishSitemapUrls} English sitemap URL(s), ${counts.crawledEnglishPages} crawled, ${counts.hreflangTargets} hreflang reference(s), ${counts.internalEnglishTargets} internal English link reference(s).`,
  ];
  if (issues.length === 0) {
    lines.push("English publication audit passed with 0 issue(s).");
    return lines.join("\n");
  }

  const routes = new Map();
  for (const issue of issues) {
    if (!routes.has(issue.route)) routes.set(issue.route, []);
    routes.get(issue.route).push(issue);
  }
  lines.push(`English publication audit failed with ${issues.length} issue(s) across ${routes.size} route(s).`);
  for (const [route, routeIssues] of routes) {
    lines.push(`\n[${route}]`);
    for (const issue of routeIssues) {
      lines.push(`- ${issue.code}: ${issue.message}${issue.target ? ` (${issue.target})` : ""}`);
    }
  }
  return lines.join("\n");
}

async function main() {
  const result = await auditEnglishPublication();
  console.log(formatAuditReport(result));
  if (result.issues.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
