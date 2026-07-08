// Pure URL helpers for the kennisbank — NO fs/node imports, so these are safe
// to import from client components (unlike posts.ts, which reads the filesystem).

export function postHref(post: { categorySlug: string; slug: string }): string {
  return `/kennisbank/${post.categorySlug}/${post.slug}/`;
}

export function categoryHref(categorySlug: string): string {
  return `/kennisbank/${categorySlug}/`;
}
