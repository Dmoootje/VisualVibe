import { getAllPosts, getPostBySlug } from "@/lib/kennisbank/posts";

// Kennisbank posts are authored as .mdx files in content/kennisbank/ (code-driven,
// edited in VS Code) — this just re-exposes them under the same data/ API the
// rest of the site already uses (BlogGrid, sitemap.ts).
export const blogPosts = getAllPosts();

export function getBlogPostBySlug(slug: string) {
  return getPostBySlug(slug);
}
