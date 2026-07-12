import { getLocale } from "next-intl/server";
import { getAllPosts, isBlogLocale } from "@/lib/kennisbank/posts";
import { BlogHeader, BlogGrid } from "./components";

export default async function BlogPreview() {
  const locale = await getLocale();
  const blogPosts = isBlogLocale(locale) ? getAllPosts({ locale }) : [];

  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <section
      className="py-5 sm:py-20 md:py-24 relative overflow-hidden"
      aria-labelledby="blog-heading"
    >
      <div className="container mx-auto px-4 relative z-10">
        <BlogHeader />
        <BlogGrid posts={blogPosts} />
      </div>
    </section>
  );
}
