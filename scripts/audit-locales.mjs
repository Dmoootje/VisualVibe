import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import matter from "gray-matter";

const root = process.cwd();
const localeSource = fs.readFileSync(path.join(root, "src/i18n/locales.ts"), "utf8");
const locales = [...localeSource.matchAll(/^\s*(nl|en|fr|de): \{ status: "(published|ready|disabled)" \}/gm)]
  .map(([, locale, status]) => ({ locale, status }));
const statuses = new Map(locales.map(({ locale, status }) => [locale, status]));
const issues = [];

function add(code, locale, source, message) {
  issues.push({ code, locale, source: source.replaceAll("\\", "/"), message });
}

function flattenKeys(value, prefix = "") {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child)
      ? flattenKeys(child, next)
      : [next];
  });
}

const messageKeys = new Map();
for (const { locale } of locales) {
  const relative = `messages/${locale}.json`;
  const filename = path.join(root, relative);
  if (!fs.existsSync(filename)) {
    add("missing_content", locale, relative, `Missing message catalog for ${locale}`);
    messageKeys.set(locale, new Set());
    continue;
  }

  const parsed = JSON.parse(fs.readFileSync(filename, "utf8"));
  messageKeys.set(locale, new Set(flattenKeys(parsed)));
}

const baselineKeys = messageKeys.get("nl") ?? new Set();
for (const { locale } of locales) {
  if (locale === "nl") continue;
  const available = messageKeys.get(locale) ?? new Set();
  for (const key of baselineKeys) {
    if (!available.has(key)) {
      add("missing_message", locale, key, `Missing ${locale} message: ${key}`);
    }
  }
}

function walk(directory, accept) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(filename, accept);
    return accept(filename) ? [filename] : [];
  });
}

const articles = [];
for (const filename of walk(path.join(root, "content"), (file) => file.endsWith(".mdx"))) {
  const relative = path.relative(root, filename);
  const document = matter(fs.readFileSync(filename, "utf8"));
  const locale = typeof document.data.locale === "string" ? document.data.locale : "nl";
  const translationKey = document.data.translationKey;
  articles.push({ locale, translationKey, relative });

  if (!translationKey) {
    add("missing_translation_partner", locale, relative, "Missing translationKey");
  }
  for (const field of ["seoTitle", "seoDescription"]) {
    if (typeof document.data[field] !== "string" || !document.data[field].trim()) {
      add("missing_metadata", locale, `${relative}:${field}`, `Missing metadata field: ${field}`);
    }
  }
  if (document.data.ogImage && (typeof document.data.heroImageAlt !== "string" || !document.data.heroImageAlt.trim())) {
    add("missing_alt", locale, `${relative}:heroImageAlt`, "Missing meaningful hero image alt text");
  }

  const localePrefixes = { nl: "/be", en: "/en", fr: "/fr", de: "/de" };
  const otherPrefixes = Object.entries(localePrefixes)
    .filter(([candidate]) => candidate !== locale)
    .map(([, prefix]) => prefix);
  const strings = JSON.stringify(document.data).match(/"\/(?:be|en|fr|de)(?:\/[^"#?]*)?"/g) ?? [];
  const bodyLinks = [...document.content.matchAll(/\]\((\/(?:be|en|fr|de)(?:\/[^\s)#?]*)?)/g)].map((match) => match[1]);
  const links = [...strings.map((item) => JSON.parse(item)), ...bodyLinks];
  for (const link of new Set(links)) {
    if (otherPrefixes.some((prefix) => link === prefix || link.startsWith(`${prefix}/`))) {
      add("cross_locale_link", locale, `${relative}:${link}`, `Link targets another locale: ${link}`);
    }
  }
}

const partners = new Map();
for (const article of articles) {
  if (!article.translationKey) continue;
  const key = String(article.translationKey);
  if (!partners.has(key)) partners.set(key, new Set());
  partners.get(key).add(article.locale);
}
for (const article of articles.filter(({ locale }) => locale === "nl")) {
  if (article.translationKey && !partners.get(String(article.translationKey))?.has("en")) {
    add("missing_translation_partner", "en", article.relative, `Missing English partner for ${article.translationKey}`);
  }
}

for (const { locale, status } of locales) {
  if (status === "published") continue;
  for (const base of ["src/app", "public"]) {
    const relative = `${base}/${locale}`;
    if (fs.existsSync(path.join(root, relative))) {
      add("published_route_leak", locale, relative, `Unpublished locale has a public route directory: /${locale}`);
    }
  }
}

const ignored = new Set([".git", ".next", "node_modules"]);
function scanForbidden(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      scanForbidden(filename);
      continue;
    }
    let value;
    try {
      value = fs.readFileSync(filename, "utf8");
    } catch {
      continue;
    }
    if (value.includes("\u2014") || value.includes("\u2015")) {
      add("forbidden_character", "repository", path.relative(root, filename), "Contains U+2014 or U+2015");
    }
  }
}
scanForbidden(root);

issues.sort((left, right) =>
  left.code.localeCompare(right.code) ||
  left.locale.localeCompare(right.locale) ||
  left.source.localeCompare(right.source),
);

const blocking = issues.filter((issue) =>
  issue.code === "forbidden_character" || ["published", "ready"].includes(statuses.get(issue.locale)),
);
console.log(`Locale audit: ${issues.length} issue(s), ${blocking.length} blocking.`);
for (const issue of issues) {
  const severity = blocking.includes(issue) ? "BLOCK" : "INFO";
  console.log(`[${severity}] ${issue.code} ${issue.locale} ${issue.source}: ${issue.message}`);
}

if (blocking.length > 0) process.exitCode = 1;
