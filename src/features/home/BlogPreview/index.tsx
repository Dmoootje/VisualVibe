import { blogPosts } from "@/data/blog";
import { BlogBackground, BlogHeader, BlogGrid } from "./components";

export default function BlogPreview() {
  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section
      className="py-5 sm:py-20 md:py-24 relative overflow-hidden"
      aria-labelledby="blog-heading"
    >
      <BlogBackground />
      <div className="container mx-auto px-4 relative z-10">
        <BlogHeader />
        <BlogGrid posts={blogPosts} />
      </div>
    </section>
  );
}
