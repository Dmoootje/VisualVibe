// Pure projection - NO fs/node imports, safe to import from client components.
//
// BlogGrid/BlogCard only render a handful of fields. Passing the full BlogPost
// (with its heavy `content` body and frontmatter arrays) to the *client*
// BlogGrid would serialize all of that into the inline RSC payload of every
// page that uses it. Project to this slim shape on the server first.

import type { BlogPost } from "@/types";

export type BlogCardPost = Pick<
  BlogPost,
  | "title"
  | "slug"
  | "categorySlug"
  | "category"
  | "publishedAt"
  | "readingTime"
  | "author"
  | "excerpt"
  | "featuredImage"
  | "ogImage"
  | "heroComposed"
  | "heroImageAlt"
>;

export function toBlogCardPost(post: BlogPost): BlogCardPost {
  return {
    title: post.title,
    slug: post.slug,
    categorySlug: post.categorySlug,
    category: post.category,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    author: post.author,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    ogImage: post.ogImage,
    heroComposed: post.heroComposed,
    heroImageAlt: post.heroImageAlt,
  };
}
