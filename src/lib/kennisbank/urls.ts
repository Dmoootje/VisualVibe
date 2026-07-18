// Pure URL helpers for the kennisbank - NO fs/node imports, so these are safe
// to import from client components (unlike posts.ts, which reads the filesystem).

import type { BlogLocale } from "@/types/blog";

/** Adds the real public locale prefix (`nl` is published under `/be`). */
export function localizedPath(locale: BlogLocale, sitePath: string): string {
  const normalizedPath = sitePath.startsWith("/") ? sitePath : `/${sitePath}`;
  const prefix = locale === "nl" ? "/be" : `/${locale}`;
  return normalizedPath === "/" ? `${prefix}/` : `${prefix}${normalizedPath}`;
}

export function postHref(post: { categorySlug: string; slug: string }): string {
  return `/kennisbank/${post.categorySlug}/${post.slug}/`;
}

/** Uses the translated post's own locale, category and slug. */
export function localizedPostHref(post: {
  locale: BlogLocale;
  categorySlug: string;
  slug: string;
}): string {
  return localizedPath(post.locale, postHref(post));
}

export function categoryHref(categorySlug: string): string {
  return `/kennisbank/${categorySlug}/`;
}
