import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  BlogAuthor,
  BlogCta,
  BlogLocale,
  BlogPost,
  BlogPostStatus,
  BlogSearchIntent,
  BlogSource,
} from "@/types/blog";
import type { SupportedLocale } from "@/i18n/locales";
import { getCategoryByName } from "@/data/kennisbankCategories";
import { KENNISBANK_OG, kennisbankFeatured } from "@/data/kennisbankImages";
import {
  assertValidKennisbankPosts,
  formatKennisbankValidationIssues,
  validateKennisbankPosts,
  type KennisbankValidationIssue,
} from "./validation";

const CONTENT_DIR = path.join(process.cwd(), "content", "kennisbank");
const BLOG_LOCALES: BlogLocale[] = ["nl", "fr", "en"];
const BLOG_STATUSES: BlogPostStatus[] = ["draft", "scheduled", "published", "archived"];

export const DEFAULT_BLOG_AUTHOR: BlogAuthor = {
  type: "Person",
  name: "Jens Hardy",
  url: "/over-ons/",
  jobTitle: "Oprichter en creative lead bij VisualVibe",
};

type Frontmatter = Record<string, unknown>;

function contentError(filename: string, field: string, message: string): never {
  throw new Error(`[kennisbank/${filename}] Invalid frontmatter field "${field}": ${message}`);
}

function requiredString(
  data: Frontmatter,
  field: string,
  filename: string
): string {
  const value = data[field];
  if (typeof value !== "string" || value.trim() === "") {
    contentError(filename, field, "expected a non-empty string");
  }
  return value.trim();
}

function optionalString(value: unknown, field: string, filename: string): string | undefined {
  if (value == null) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    contentError(filename, field, "expected a non-empty string when provided");
  }
  return value.trim();
}

function optionalStringArray(
  value: unknown,
  field: string,
  filename: string
): string[] | undefined {
  if (value == null) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    contentError(filename, field, "expected an array of non-empty strings");
  }
  return value.map((item) => (item as string).trim());
}

function dateString(value: unknown, field: string, filename: string): string {
  const parsed = optionalString(value, field, filename);
  if (!parsed || Number.isNaN(new Date(parsed).getTime())) {
    contentError(filename, field, "expected a valid ISO date string");
  }
  return parsed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeInternalHref(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !/[\r\n]/.test(value);
}

function isSafeProfileUrl(value: string): boolean {
  if (isSafeInternalHref(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function parseAuthor(value: unknown, filename: string): BlogAuthor {
  if (value == null || value === "VisualVibe" || value === DEFAULT_BLOG_AUTHOR.name) {
    return { ...DEFAULT_BLOG_AUTHOR };
  }

  if (typeof value === "string" && value.trim()) {
    return { type: "Person", name: value.trim() };
  }

  if (!isRecord(value)) {
    contentError(filename, "author", "expected a person name or an author object");
  }

  if (value.type != null && value.type !== "Person") {
    contentError(filename, "author.type", "blog authors must have type \"Person\"");
  }

  const name = optionalString(value.name, "author.name", filename);
  if (!name) contentError(filename, "author.name", "expected a non-empty person name");

  const url = optionalString(value.url, "author.url", filename);
  if (url && !isSafeProfileUrl(url)) {
    contentError(filename, "author.url", "expected an internal path or an HTTP(S) URL");
  }

  return {
    type: "Person",
    name,
    url,
    jobTitle: optionalString(value.jobTitle, "author.jobTitle", filename),
  };
}

function parseCta(value: unknown, filename: string): Partial<BlogCta> | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) contentError(filename, "cta", "expected an object");

  const cta: Partial<BlogCta> = {
    title: optionalString(value.title, "cta.title", filename),
    description: optionalString(value.description, "cta.description", filename),
    label: optionalString(value.label, "cta.label", filename),
    href: optionalString(value.href, "cta.href", filename),
  };

  if (cta.href && !isSafeInternalHref(cta.href)) {
    contentError(filename, "cta.href", "expected a safe internal path beginning with a single slash");
  }

  return Object.values(cta).some(Boolean) ? cta : undefined;
}

function parseSearchIntent(value: unknown, filename: string): BlogSearchIntent | undefined {
  if (value == null) return undefined;
  if (typeof value === "string" && value.trim()) {
    return { primary: value.trim(), type: "informational" };
  }
  if (!isRecord(value)) contentError(filename, "searchIntent", "expected a string or object");

  const primary = optionalString(value.primary, "searchIntent.primary", filename);
  if (!primary) {
    contentError(filename, "searchIntent.primary", "expected a non-empty primary intent");
  }

  const type = optionalString(value.type, "searchIntent.type", filename) ?? "informational";
  if (!["informational", "commercial", "transactional", "navigational"].includes(type)) {
    contentError(filename, "searchIntent.type", `unsupported intent type "${type}"`);
  }

  const funnelStage = optionalString(value.funnelStage, "searchIntent.funnelStage", filename);
  if (funnelStage && !["awareness", "consideration", "decision"].includes(funnelStage)) {
    contentError(filename, "searchIntent.funnelStage", `unsupported funnel stage "${funnelStage}"`);
  }

  return {
    primary,
    type: type as BlogSearchIntent["type"],
    audience: optionalString(value.audience, "searchIntent.audience", filename),
    funnelStage: funnelStage as BlogSearchIntent["funnelStage"],
  };
}

function parseSources(value: unknown, filename: string): BlogSource[] | undefined {
  if (value == null) return undefined;
  if (!Array.isArray(value)) contentError(filename, "sources", "expected an array");

  return value.map((source, index) => {
    if (!isRecord(source)) {
      contentError(filename, `sources[${index}]`, "expected an object");
    }
    const title = optionalString(source.title, `sources[${index}].title`, filename);
    const url = optionalString(source.url, `sources[${index}].url`, filename);
    if (!title || !url) {
      contentError(filename, `sources[${index}]`, "both title and url are required");
    }
    return {
      title,
      url,
      publisher: optionalString(source.publisher, `sources[${index}].publisher`, filename),
      accessedAt: source.accessedAt
        ? dateString(source.accessedAt, `sources[${index}].accessedAt`, filename)
        : undefined,
    };
  });
}

/** Fallback slugifier for a category name when it isn't in the registry. */
function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// The page template renders `title` as the page's H1 (via PageHero); MDX
// authors typically repeat it as a leading "# ..." line for readability in
// an editor/preview, so strip that one line here to avoid a duplicate H1.
function stripLeadingH1(content: string, title: string): string {
  const trimmed = content.trimStart();
  const firstLineMatch = trimmed.match(/^#\s+(.+)\n+/);
  if (firstLineMatch && firstLineMatch[1].trim() === title.trim()) {
    return trimmed.slice(firstLineMatch[0].length);
  }
  return content;
}

// Content briefs often reference an og/cover image before it's actually been
// shot/uploaded. A remote URL (the real photo, once uploaded to Storage) is
// used as-is; a local "/..." path is only exposed if that file genuinely
// exists under /public. Either way, consumers never point at a local 404.
function resolveImage(imagePath: string | undefined): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  if (!imagePath.startsWith("/") || imagePath.startsWith("//")) return undefined;

  const publicDir = path.resolve(process.cwd(), "public");
  const absolutePath = path.resolve(publicDir, `.${imagePath}`);
  return absolutePath.startsWith(publicDir) && fs.existsSync(absolutePath) ? imagePath : undefined;
}

// MDX (unlike plain markdown) doesn't support HTML comments - an authored
// `<!-- ... -->` throws a compile error. Strip them so content can still be
// written/annotated as markdown.
function stripHtmlComments(content: string): string {
  return content.replace(/<!--[\s\S]*?-->/g, "");
}

function parseLocale(value: unknown, filename: string): BlogLocale {
  const locale = value == null ? "nl" : optionalString(value, "locale", filename);
  if (!locale || !BLOG_LOCALES.includes(locale as BlogLocale)) {
    contentError(filename, "locale", `expected one of ${BLOG_LOCALES.join(", ")}`);
  }
  return locale as BlogLocale;
}

function parseStatus(data: Frontmatter, filename: string): BlogPostStatus {
  const legacyDraft = data.draft === true;
  const status = legacyDraft
    ? "draft"
    : data.status == null
      ? "published"
      : optionalString(data.status, "status", filename);

  if (!status || !BLOG_STATUSES.includes(status as BlogPostStatus)) {
    contentError(filename, "status", `expected one of ${BLOG_STATUSES.join(", ")}`);
  }
  return status as BlogPostStatus;
}

function readPostFile(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data: rawData, content } = matter(raw);
  const data = rawData as Frontmatter;
  const title = requiredString(data, "title", filename);
  const category = requiredString(data, "category", filename);
  const authorProfile = parseAuthor(data.author, filename);
  const clusterType = optionalString(data.clusterType, "clusterType", filename);

  if (clusterType && clusterType !== "pillar" && clusterType !== "sub") {
    contentError(filename, "clusterType", "expected \"pillar\" or \"sub\"");
  }

  const slug = requiredString(data, "slug", filename);
  const categorySlug =
    optionalString(data.categorySlug, "categorySlug", filename) ??
    getCategoryByName(category)?.slug ??
    slugifyCategory(category);
  // OG (vierkant, met tekst) = social; featured (zonder tekst) = hero + cards.
  // De gegenereerde kennisbankbeelden winnen van de frontmatter-verwijzing.
  const canonicalPath = `/kennisbank/${categorySlug}/${slug}/`;
  const ogImage =
    KENNISBANK_OG[canonicalPath]?.url ?? resolveImage(optionalString(data.ogImage, "ogImage", filename));
  const featuredImage = kennisbankFeatured(categorySlug, slug);

  return {
    title,
    slug,
    category,
    categorySlug,
    pillar: data.pillar === true,
    status: parseStatus(data, filename),
    locale: parseLocale(data.locale, filename),
    translationKey: requiredString(data, "translationKey", filename),
    author: authorProfile.name,
    authorProfile,
    publishedAt: dateString(data.publishedAt, "publishedAt", filename),
    updatedAt: data.updatedAt ? dateString(data.updatedAt, "updatedAt", filename) : undefined,
    readingTime: optionalString(data.readingTime, "readingTime", filename),
    excerpt: requiredString(data, "excerpt", filename),
    content: stripHtmlComments(stripLeadingH1(content, title)),
    focusKeyword: optionalString(data.focusKeyword, "focusKeyword", filename),
    secondaryKeywords: optionalStringArray(data.secondaryKeywords, "secondaryKeywords", filename),
    seoTitle: requiredString(data, "seoTitle", filename),
    seoDescription: requiredString(data, "seoDescription", filename),
    ogTitle: optionalString(data.ogTitle, "ogTitle", filename),
    ogDescription: optionalString(data.ogDescription, "ogDescription", filename),
    ogImage,
    featuredImage,
    heroComposed: data.heroComposed === true,
    heroImageAlt: optionalString(data.heroImageAlt, "heroImageAlt", filename),
    heroImageTitle: optionalString(data.heroImageTitle, "heroImageTitle", filename),
    heroImageCaption: optionalString(data.heroImageCaption, "heroImageCaption", filename),
    robots: optionalString(data.robots, "robots", filename),
    cta: parseCta(data.cta, filename),
    searchIntent: parseSearchIntent(data.searchIntent, filename),
    sources: parseSources(data.sources, filename),
    clusterType: clusterType as BlogPost["clusterType"],
    parentPillar: optionalString(data.parentPillar, "parentPillar", filename),
    relatedServices: optionalStringArray(data.relatedServices, "relatedServices", filename),
    relatedRegions: optionalStringArray(data.relatedRegions, "relatedRegions", filename),
    relatedSectors: optionalStringArray(data.relatedSectors, "relatedSectors", filename),
    relatedCases: optionalStringArray(data.relatedCases, "relatedCases", filename),
    relatedPosts: optionalStringArray(data.relatedPosts, "relatedPosts", filename),
  };
}

export function listPostFiles(directory: string = CONTENT_DIR, prefix = ""): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      return entry.name.startsWith("_")
        ? []
        : listPostFiles(path.join(directory, entry.name), relativePath);
    }
    return entry.isFile() && entry.name.endsWith(".mdx") ? [relativePath] : [];
  });
}

let cachedAuthoredPosts: BlogPost[] | null = null;
let cachedValidationIssues: KennisbankValidationIssue[] | null = null;

function getAuthoredPosts(): BlogPost[] {
  if (cachedAuthoredPosts) return cachedAuthoredPosts;

  if (!fs.existsSync(CONTENT_DIR)) {
    cachedAuthoredPosts = [];
    cachedValidationIssues = [];
    return cachedAuthoredPosts;
  }

  const files = listPostFiles();
  const authoredPosts = files
    .map(readPostFile)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const validationIssues = validateKennisbankPosts(authoredPosts);
  const structuralIssues = validationIssues.filter((issue) =>
    [
      "duplicate-slug",
      "duplicate-translation-key",
      "invalid-category",
      "invalid-category-slug",
      "invalid-pillar",
      "invalid-translation",
    ].includes(issue.code)
  );

  // Ambiguous routing/taxonomy is never safe to continue with. Missing legacy
  // relationships are reported loudly and can be promoted to a hard CI/build
  // failure by calling assertValidKennisbankContent().
  if (structuralIssues.length > 0) {
    throw new Error(formatKennisbankValidationIssues(structuralIssues));
  }
  if (validationIssues.length > 0) {
    console.warn(formatKennisbankValidationIssues(validationIssues));
  }

  cachedAuthoredPosts = authoredPosts;
  cachedValidationIssues = validationIssues;
  return cachedAuthoredPosts;
}

export function isBlogLocale(value: string): value is BlogLocale {
  return BLOG_LOCALES.includes(value as BlogLocale);
}

export function isBlogPostLive(post: BlogPost, now: Date = new Date()): boolean {
  return post.status === "published" && new Date(post.publishedAt).getTime() <= now.getTime();
}

export function getAllPosts(options?: {
  includeDrafts?: boolean;
  locale?: BlogLocale;
}): BlogPost[] {
  const posts = options?.includeDrafts
    ? getAuthoredPosts()
    : getAuthoredPosts().filter((post) => isBlogPostLive(post));
  return options?.locale ? posts.filter((post) => post.locale === options.locale) : posts;
}

export function getPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean; locale?: BlogLocale }
): BlogPost | undefined {
  return getAllPosts(options).find((post) => post.slug === slug);
}

export function getPostsByCategory(
  categorySlug: string,
  locale?: BlogLocale
): BlogPost[] {
  return getAllPosts({ locale }).filter((post) => post.categorySlug === categorySlug);
}

/** Returns translations explicitly connected through a stable translation key. */
export function getPostTranslations(
  translationKey: string,
  options?: { includeDrafts?: boolean },
): Partial<Record<SupportedLocale, BlogPost>> {
  return Object.fromEntries(
    getAllPosts(options)
      .filter((candidate) => candidate.translationKey === translationKey)
      .map((candidate) => [candidate.locale, candidate]),
  );
}

export function getKennisbankValidationIssues(): KennisbankValidationIssue[] {
  getAuthoredPosts();
  return cachedValidationIssues ? [...cachedValidationIssues] : [];
}

/** CI/build hook: fails with a complete, actionable list of invalid live references. */
export function assertValidKennisbankContent(locales?: readonly SupportedLocale[]): void {
  const authoredPosts = getAuthoredPosts();
  const posts = locales
    ? authoredPosts.filter((post) => locales.includes(post.locale as SupportedLocale))
    : authoredPosts;
  assertValidKennisbankPosts(posts);
}

// Pure URL helpers live in ./urls (no fs) so client components can use them too.
export { postHref, localizedPostHref, categoryHref, localizedPath } from "./urls";

/** Extracts the last non-empty path segment from an absolute site path. */
export function slugFromPath(sitePath: string): string {
  const segments = sitePath.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

/** Sub-articles whose parentPillar resolves to the given pillar post's slug. */
export function getClusterPosts(pillarSlug: string, locale?: BlogLocale): BlogPost[] {
  return getAllPosts({ locale }).filter(
    (post) => post.parentPillar && slugFromPath(post.parentPillar) === pillarSlug
  );
}
