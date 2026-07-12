import type { BlogPost } from "@/types/blog";
import { postHref, categoryHref } from "@/lib/kennisbank/urls";

/**
 * Lightweight, serialisable shape passed from the server pages into the client
 * kennisbank views. Deliberately excludes the heavy MDX `content` so the full
 * article bodies never ship to the browser for the listing/search UI.
 */
export type ArticleCardData = {
  /** Post slug, used as a stable list key. */
  id: string;
  href: string;
  categorySlug: string;
  categoryName: string;
  /** Title up to and including the first colon (the white lead line). */
  title: string;
  /** Remainder of the title (the amber accent line); empty when no colon. */
  titleAccent: string;
  /** Untouched full title, for aria labels and search. */
  fullTitle: string;
  excerpt: string;
  readingTime?: string;
  /** Pre-formatted nl-BE date for display. */
  date: string;
  author: string;
  /** Profielfoto van de auteur (admin-profiel); valt terug op het User-icoon. */
  authorImage?: string;
  image?: string;
  imageAlt?: string;
  heroComposed: boolean;
  pillar: boolean;
};

export type KbCategoryData = {
  slug: string;
  name: string;
  description: string;
  count: number;
};

/** Splits "Lead: hook" into a white lead line and an amber accent line. */
export function splitTitle(title: string): { title: string; titleAccent: string } {
  const colon = title.indexOf(":");
  if (colon === -1) return { title, titleAccent: "" };
  const lead = title.slice(0, colon + 1).trim();
  const rest = title.slice(colon + 1).trim();
  return { title: lead, titleAccent: rest.charAt(0).toUpperCase() + rest.slice(1) };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function toArticleCardData(
  post: BlogPost,
  authorImages?: Record<string, string>,
): ArticleCardData {
  const { title, titleAccent } = splitTitle(post.title);
  return {
    id: post.slug,
    href: postHref(post),
    categorySlug: post.categorySlug,
    categoryName: post.category,
    title,
    titleAccent,
    fullTitle: post.title,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
    date: formatDate(post.publishedAt),
    author: post.author,
    authorImage: authorImages?.[post.author],
    image: post.ogImage,
    imageAlt: post.heroImageAlt ?? post.title,
    heroComposed: Boolean(post.heroComposed),
    pillar: Boolean(post.pillar),
  };
}

export { categoryHref };
