import process from "node:process";
import { pathToFileURL } from "node:url";
import { parseSitemapUrls } from "./audit-english-production.mjs";

export const defaultBaseUrl =
  process.env.ENGLISH_COPY_AUDIT_BASE_URL ??
  process.env.PUBLICATION_AUDIT_BASE_URL ??
  "http://127.0.0.1:3210";

const visibleChecks = [
  ["dutch-home-region", /\bThuisregio\b/iu],
  ["dutch-quotation-cta", /\bOfferte aanvragen\b/iu],
  ["dutch-view-route", /\bBekijk route\b/iu],
  ["dutch-category-filter", /Filter op categorie/iu],
  ["dutch-approach-heading", /\bOnze aanpak\b/iu],
  ["dutch-faq-heading", /Veelgestelde vragen/iu],
  ["dutch-read-article", /Lees het volledige artikel/iu],
  ["dutch-source-label", /Auteursrecht van FOD/iu],
  ["dutch-author-label", /\bAuteur\b/iu],
  ["dutch-country-name", /\bBelgië\b/iu],
  ["visible-dutch-route-example", /(?:^|[\s"'>(])\/(?:diensten|regio|over-ons|offerte-aanvragen)(?:\/|\b)/iu],
];

const attributeChecks = [
  ["dutch-breadcrumb-aria", /aria-label=["']Kruimelpad["']/iu],
  ["dutch-same-site-anchor", /<a\b[^>]*href=["'](?:https:\/\/visualvibe\.media)?\/be\//iu],
  ["double-english-prefix", /<a\b[^>]*href=["']\/en\/en\//iu],
  ["obsolete-quotation-anchor", /<a\b[^>]*href=["']\/en\/offerte-aanvragen\/?["']/iu],
  ["obsolete-wedding-anchor", /<a\b[^>]*href=["']\/en\/trouwfotograaf-limburg\/?["']/iu],
  ["dutch-sector-aria", /aria-label=["'](?:kmo|bouw-renovatie|horeca|industrie|vastgoed-immo|retail-webshops|sportclubs-verenigingen|opleidingen-masterclasses|wellness-beauty)["']/iu],
];

export function visibleTextOf(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
    .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&nbsp;/giu, " ")
    .replace(/&amp;/giu, "&")
    .replace(/&#x27;|&#39;/giu, "'")
    .replace(/&quot;/giu, '"')
    .replace(/\s+/gu, " ")
    .trim();
}

function hasEnglishOgLocale(html) {
  return [...html.matchAll(/<meta\b[^>]*>/giu)].some((match) => {
    const tag = match[0];
    return (
      /property=["']og:locale["']/iu.test(tag) &&
      /content=["']en_(?:BE|GB)["']/iu.test(tag)
    );
  });
}

export function analyzeRenderedEnglishPage(html) {
  const visible = visibleTextOf(html);
  const issues = [];

  for (const [code, pattern] of visibleChecks) {
    if (pattern.test(visible)) issues.push(`visible:${code}`);
  }
  for (const [code, pattern] of attributeChecks) {
    if (pattern.test(html)) issues.push(`attribute:${code}`);
  }
  if (!/<html\b[^>]*lang=["']en["']/iu.test(html)) issues.push("meta:html-lang");
  // Next.js may stream route metadata after the initial <head>. Crawlers and
  // browsers still receive the meta element in the rendered HTML document.
  if (!hasEnglishOgLocale(html)) issues.push("meta:og-locale");
  if (/"inLanguage"\s*:\s*"nl(?:-BE)?"/iu.test(html)) {
    issues.push("meta:jsonld-dutch-language");
  }
  if (/"genre"\s*:\s*"Maatwerk softwareproject"/iu.test(html)) {
    issues.push("meta:jsonld-dutch-copy");
  }
  return issues;
}

export async function auditEnglishCopy({
  baseUrl = defaultBaseUrl,
  fetchImpl = fetch,
} = {}) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/u, "");
  const sitemapResponse = await fetchImpl(`${normalizedBaseUrl}/sitemap.xml`);
  if (!sitemapResponse.ok) {
    throw new Error(`Sitemap request failed with ${sitemapResponse.status}`);
  }
  const sitemap = await sitemapResponse.text();
  const paths = parseSitemapUrls(sitemap)
    .map((url) => new URL(url).pathname)
    .filter((pathname) => pathname.startsWith("/en/"));

  const rows = await Promise.all(paths.map(async (pathname) => {
    const response = await fetchImpl(`${normalizedBaseUrl}${pathname}`);
    if (!response.ok) {
      return { pathname, issues: [`request:http-${response.status}`] };
    }
    return { pathname, issues: analyzeRenderedEnglishPage(await response.text()) };
  }));
  const failures = rows.filter((row) => row.issues.length > 0);
  return {
    paths,
    rows,
    failures,
    issueCount: failures.reduce((sum, row) => sum + row.issues.length, 0),
  };
}

export function formatEnglishCopyAudit(result) {
  const lines = [
    `English rendered copy audit: ${result.paths.length} route(s), ${result.issueCount} issue(s) across ${result.failures.length} route(s).`,
  ];
  for (const row of result.failures) {
    lines.push(`${row.pathname} :: ${row.issues.join(", ")}`);
  }
  return lines.join("\n");
}

async function main() {
  const result = await auditEnglishCopy();
  console.log(formatEnglishCopyAudit(result));
  if (result.failures.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
