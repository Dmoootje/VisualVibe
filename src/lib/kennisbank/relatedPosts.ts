// Relevance scorer for "relevante kennisbankartikels" on sector pages.
// Replaces the old newest-3 fallback: a post must earn a minimum score via a
// real signal or it is excluded - fewer (or zero) relevant articles is fine.

import type { BlogPost, Sector } from "@/types";

/** Last non-empty segment of a site path ("/sectoren/bouw-renovatie/" -> "bouw-renovatie"). */
function lastSegment(sitePath: string): string {
  const parts = sitePath.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function contains(haystack: string | undefined, needle: string): boolean {
  return Boolean(haystack && haystack.toLowerCase().includes(needle.toLowerCase()));
}

/**
 * Signals are weight-tiered so a higher-priority signal always outranks any
 * sum of lower ones: curated sector.relatedPosts (+1000) > post.relatedSectors
 * (+500) > category match (+100) > keyword matches (capped +75) > title/excerpt
 * matches (capped +30). Publication date is only the tie-break.
 */
export function scoreSectorPosts(
  posts: BlogPost[],
  sector: Sector,
  opts?: { max?: number; minScore?: number },
): BlogPost[] {
  const max = opts?.max ?? 4;
  const minScore = opts?.minScore ?? 25;
  const curatedSlugs = new Set((sector.relatedPosts ?? []).map(lastSegment).filter(Boolean));
  const categories = new Set(sector.knowledgeCategories ?? []);
  const keywords = sector.knowledgeKeywords ?? [];

  const scored = posts.map((post) => {
    let score = 0;
    if (curatedSlugs.has(post.slug)) score += 1000;
    if (post.relatedSectors?.some((path) => lastSegment(path) === sector.slug)) score += 500;
    if (categories.has(post.categorySlug)) score += 100;

    let keywordScore = 0;
    let textScore = 0;
    for (const keyword of keywords) {
      if (
        contains(post.focusKeyword, keyword) ||
        post.secondaryKeywords?.some((k) => contains(k, keyword))
      ) {
        keywordScore += 25;
      }
      if (contains(post.title, keyword) || contains(post.excerpt, keyword)) {
        textScore += 10;
      }
    }
    score += Math.min(keywordScore, 75) + Math.min(textScore, 30);

    return { post, score };
  });

  return scored
    .filter((entry) => entry.score >= minScore)
    .sort(
      (a, b) =>
        b.score - a.score ||
        +new Date(b.post.publishedAt) - +new Date(a.post.publishedAt),
    )
    .slice(0, max)
    .map((entry) => entry.post);
}
