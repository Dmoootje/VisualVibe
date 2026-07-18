import { getCaseBySlug } from "@/data/cases";
import { getCategoryByName, getCategoryBySlug } from "@/data/kennisbankCategories";
import { getRegionBySlug } from "@/data/regions";
import { getSectorBySlug } from "@/data/sectors";
import { getServiceBySlug, serviceHref } from "@/data/services";
import type { BlogPost } from "@/types/blog";

export type KennisbankValidationIssue = {
  code:
    | "duplicate-slug"
    | "duplicate-translation-key"
    | "invalid-category"
    | "invalid-category-slug"
    | "invalid-pillar"
    | "invalid-pillar-relation"
    | "invalid-translation"
    | "missing-english-partner"
    | "cross-locale-link"
    | "missing-related-post"
    | "missing-related-service"
    | "missing-related-region"
    | "missing-related-sector"
    | "missing-related-case"
    | "invalid-source";
  field: string;
  message: string;
  postSlug?: string;
};

function slugFromPath(sitePath: string): string {
  const segments = sitePath.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

function normalizedSitePath(sitePath: string): string {
  const withLeadingSlash = sitePath.startsWith("/") ? sitePath : `/${sitePath}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function isLive(post: BlogPost, now: Date): boolean {
  return post.status === "published" && new Date(post.publishedAt).getTime() <= now.getTime();
}

/**
 * Validates the complete authored dataset, including drafts. Relationship checks
 * are strict for live posts: a published article may never point at a missing,
 * draft, scheduled or archived entity.
 */
export function validateKennisbankPosts(
  posts: BlogPost[],
  now: Date = new Date(),
  options?: { requireEnglishPartners?: boolean },
): KennisbankValidationIssue[] {
  const issues: KennisbankValidationIssue[] = [];
  const postsBySlug = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const localeSlug = `${post.locale}:${post.slug}`;
    const matching = postsBySlug.get(localeSlug) ?? [];
    matching.push(post);
    postsBySlug.set(localeSlug, matching);
  }

  for (const matching of postsBySlug.values()) {
    if (matching.length > 1) {
      const slug = matching[0].slug;
      issues.push({
        code: "duplicate-slug",
        field: "slug",
        postSlug: slug,
        message: `Slug "${slug}" occurs ${matching.length} times for locale ${matching[0].locale}. Every kennisbank slug must be unique within its locale, including drafts.`,
      });
    }
  }

  const translationGroups = new Map<string, BlogPost[]>();
  for (const post of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.translationKey)) {
      issues.push({
        code: "invalid-translation",
        field: "translationKey",
        postSlug: post.slug,
        message: `translationKey "${post.translationKey}" must be a non-empty kebab-case key.`,
      });
    }
    const translations = translationGroups.get(post.translationKey) ?? [];
    translations.push(post);
    translationGroups.set(post.translationKey, translations);
  }

  for (const [translationKey, translations] of translationGroups) {
    const locales = new Set<string>();
    for (const translation of translations) {
      if (locales.has(translation.locale)) {
        issues.push({
          code: "duplicate-translation-key",
          field: "translationKey",
          postSlug: translation.slug,
          message: `Translation group "${translationKey}" contains more than one ${translation.locale} post.`,
        });
      }
      locales.add(translation.locale);
    }
    if (options?.requireEnglishPartners && locales.has("nl") && !locales.has("en")) {
      const dutch = translations.find((translation) => translation.locale === "nl");
      issues.push({
        code: "missing-english-partner",
        field: "translationKey",
        postSlug: dutch?.slug,
        message: `Translation group "${translationKey}" has no English partner.`,
      });
    }
  }

  const livePosts = posts.filter((post) => isLive(post, now));
  const livePostsByLocaleSlug = new Map(
    livePosts.map((post) => [`${post.locale}:${post.slug}`, post])
  );
  const livePostsBySlug = new Map<string, BlogPost[]>();
  for (const post of livePosts) {
    const matching = livePostsBySlug.get(post.slug) ?? [];
    matching.push(post);
    livePostsBySlug.set(post.slug, matching);
  }

  for (const post of posts) {
    const categoryByName = getCategoryByName(post.category);
    const categoryBySlug = getCategoryBySlug(post.categorySlug);

    if (!categoryByName || !categoryBySlug) {
      issues.push({
        code: "invalid-category",
        field: "category",
        postSlug: post.slug,
        message: `Category "${post.category}" (${post.categorySlug}) is not registered in kennisbankCategories.`,
      });
    } else if (categoryByName.slug !== post.categorySlug || categoryBySlug.name !== post.category) {
      issues.push({
        code: "invalid-category-slug",
        field: "categorySlug",
        postSlug: post.slug,
        message: `Category "${post.category}" must use categorySlug "${categoryByName.slug}", not "${post.categorySlug}".`,
      });
    }

    if (post.pillar && post.clusterType === "sub") {
      issues.push({
        code: "invalid-pillar",
        field: "clusterType",
        postSlug: post.slug,
        message: "A pillar post cannot have clusterType \"sub\".",
      });
    }

    if (!post.pillar && post.clusterType === "pillar") {
      issues.push({
        code: "invalid-pillar",
        field: "clusterType",
        postSlug: post.slug,
        message: "A non-pillar post cannot have clusterType \"pillar\".",
      });
    }

    if (post.pillar && post.parentPillar) {
      issues.push({
        code: "invalid-pillar",
        field: "parentPillar",
        postSlug: post.slug,
        message: "A pillar post cannot itself reference a parentPillar.",
      });
    }

    if (post.clusterType === "sub" && !post.parentPillar) {
      issues.push({
        code: "invalid-pillar",
        field: "parentPillar",
        postSlug: post.slug,
        message: "A sub article must reference a live parent pillar.",
      });
    }

    if (post.parentPillar) {
      const parentSlug = slugFromPath(post.parentPillar);
      const parent = livePostsByLocaleSlug.get(`${post.locale}:${parentSlug}`);
      const otherLocaleParent = (livePostsBySlug.get(parentSlug) ?? []).find(
        (candidate) => candidate.locale !== post.locale,
      );
      const expectedPath = parent
        ? `/kennisbank/${parent.categorySlug}/${parent.slug}/`
        : undefined;
      if (
        !parent ||
        !parent.pillar ||
        parent.locale !== post.locale ||
        parent.categorySlug !== post.categorySlug ||
        parent.slug === post.slug ||
        normalizedSitePath(post.parentPillar) !== expectedPath
      ) {
        issues.push({
          code: !parent && otherLocaleParent ? "cross-locale-link" : "invalid-pillar-relation",
          field: "parentPillar",
          postSlug: post.slug,
          message: `parentPillar "${post.parentPillar}" must be the canonical nested path of a different, live ${post.locale} pillar in category "${post.categorySlug}".`,
        });
      }
    }

    // Draft content may be prepared alongside other drafts. Only references
    // emitted on a live page need to resolve to an entity that is live now.
    if (!isLive(post, now)) continue;

    for (const relatedPath of post.relatedPosts ?? []) {
      const relatedSlug = slugFromPath(relatedPath);
      const related = livePostsByLocaleSlug.get(`${post.locale}:${relatedSlug}`);
      const otherLocaleRelated = (livePostsBySlug.get(relatedSlug) ?? []).find(
        (candidate) => candidate.locale !== post.locale,
      );
      const expectedPath = related
        ? `/kennisbank/${related.categorySlug}/${related.slug}/`
        : undefined;
      if (
        !related ||
        related.locale !== post.locale ||
        related.slug === post.slug ||
        normalizedSitePath(relatedPath) !== expectedPath
      ) {
        issues.push({
          code: !related && otherLocaleRelated ? "cross-locale-link" : "missing-related-post",
          field: "relatedPosts",
          postSlug: post.slug,
          message: `relatedPosts entry "${relatedPath}" is not the canonical nested path of a different, live ${post.locale} kennisbank post.`,
        });
      }
    }

    for (const servicePath of post.relatedServices ?? []) {
      const service = getServiceBySlug(slugFromPath(servicePath));
      // Sub-services canonically live under their hoofddienst (serviceHref),
      // so frontmatter must use the same nested path the site links to.
      if (!service || normalizedSitePath(servicePath) !== `${serviceHref(service)}/`) {
        issues.push({
          code: "missing-related-service",
          field: "relatedServices",
          postSlug: post.slug,
          message: `relatedServices entry "${servicePath}" is not the canonical path of a live service${
            service ? ` (expected "${serviceHref(service)}/")` : ""
          }.`,
        });
      }
    }

    for (const regionPath of post.relatedRegions ?? []) {
      const region = getRegionBySlug(slugFromPath(regionPath));
      if (!region || normalizedSitePath(regionPath) !== `/regio/${region.slug}/`) {
        issues.push({
          code: "missing-related-region",
          field: "relatedRegions",
          postSlug: post.slug,
          message: `relatedRegions entry "${regionPath}" is not the canonical path of a live region.`,
        });
      }
    }

    for (const sectorPath of post.relatedSectors ?? []) {
      const sector = getSectorBySlug(slugFromPath(sectorPath));
      if (!sector || normalizedSitePath(sectorPath) !== `/sectoren/${sector.slug}/`) {
        issues.push({
          code: "missing-related-sector",
          field: "relatedSectors",
          postSlug: post.slug,
          message: `relatedSectors entry "${sectorPath}" is not the canonical path of a live sector.`,
        });
      }
    }

    for (const casePath of post.relatedCases ?? []) {
      const relatedCase = getCaseBySlug(slugFromPath(casePath));
      if (
        !relatedCase ||
        normalizedSitePath(casePath) !==
          `/realisaties/${relatedCase.category}/${relatedCase.slug}/`
      ) {
        issues.push({
          code: "missing-related-case",
          field: "relatedCases",
          postSlug: post.slug,
          message: `relatedCases entry "${casePath}" is not the canonical path of a live case.`,
        });
      }
    }

    for (const source of post.sources ?? []) {
      try {
        const url = new URL(source.url);
        if (url.protocol !== "https:" && url.protocol !== "http:") {
          throw new Error("unsupported source protocol");
        }
      } catch {
        issues.push({
          code: "invalid-source",
          field: "sources",
          postSlug: post.slug,
          message: `Source "${source.title}" must use a valid HTTP(S) URL, received "${source.url}".`,
        });
      }
    }
  }

  return issues;
}

export function formatKennisbankValidationIssues(
  issues: KennisbankValidationIssue[]
): string {
  const details = issues
    .map(
      (issue) =>
        `- ${issue.postSlug ? `[${issue.postSlug}] ` : ""}${issue.field}: ${issue.message}`
    )
    .join("\n");

  return `Kennisbank content validation failed with ${issues.length} issue${
    issues.length === 1 ? "" : "s"
  }:\n${details}`;
}

export function assertValidKennisbankPosts(posts: BlogPost[], now: Date = new Date()): void {
  const issues = validateKennisbankPosts(posts, now);
  if (issues.length > 0) {
    throw new Error(formatKennisbankValidationIssues(issues));
  }
}
