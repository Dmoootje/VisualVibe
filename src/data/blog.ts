import type { BlogPost } from "@/types";

// Populated in Fase 5 (kennisbank). Kept typed + empty so hub components
// can render a graceful "binnenkort" state rather than assuming data exists.
export const blogPosts: BlogPost[] = [];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
