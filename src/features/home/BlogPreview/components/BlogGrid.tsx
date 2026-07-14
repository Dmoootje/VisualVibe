"use client";

import type { BlogCardPost } from "@/lib/kennisbank/blogCard";
import { BlogCard } from "./BlogCard";

const MAX_PREVIEW_POSTS = 3;

export function BlogGrid({ posts }: { posts: BlogCardPost[] }) {
  const preview = posts.slice(0, MAX_PREVIEW_POSTS);

  return (
    <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {preview.map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} hideAuthor />
      ))}
    </div>
  );
}
