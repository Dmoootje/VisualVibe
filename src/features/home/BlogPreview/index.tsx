import { getLocale } from "next-intl/server";
import { getAllPosts, isBlogLocale } from "@/lib/kennisbank/posts";
import { toBlogCardPost } from "@/lib/kennisbank/blogCard";
import { BlogHeader, BlogGrid } from "./components";

// Keep in sync with MAX_PREVIEW_POSTS in ./components/BlogGrid. We slice here,
// on the server, so only these few posts (not all ~50) get serialized into the
// RSC flight payload that ships inline in the HTML - a big page-weight win.
const PREVIEW_COUNT = 3;

export default async function BlogPreview() {
  const locale = await getLocale();
  const blogPosts = isBlogLocale(locale)
    ? getAllPosts({ locale }).slice(0, PREVIEW_COUNT).map(toBlogCardPost)
    : [];

  if (blogPosts.length === 0) {
    return null;
  }
  const copyLocale = locale === "en" ? "en" : "nl";

  return (
    <section
      className="home-deferred-section relative overflow-hidden py-5 sm:py-20 md:py-24"
      aria-labelledby="blog-heading"
    >
      <div className="container mx-auto px-2.5 sm:px-4 relative z-10">
        <BlogHeader locale={copyLocale} />
        <BlogGrid posts={blogPosts} locale={copyLocale} />
      </div>
    </section>
  );
}
