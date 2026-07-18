import { BlogCard } from "@/features/home/BlogPreview/components/BlogCard";
import type { BlogCardPost } from "@/lib/kennisbank/blogCard";

/**
 * Gerelateerde-artikels grid voor regio-, diensten-, sector- en realisatiepagina's.
 * Gebruikt exact dezelfde uitgelichte kaart als de homepage-BlogPreview en de
 * SectorKnowledge-sectie (beeld, categoriebadge, meta en CTA), zodat elke
 * "Lees meer"-sectie op de site identiek oogt. BlogCard is presentational en
 * server-compatibel; de auteur valt zonder profielfoto terug op het User-icoon.
 */
export function BlogGrid({
  posts,
  locale = "nl",
}: {
  posts: BlogCardPost[];
  locale?: "nl" | "en";
}) {
  if (posts.length === 0) {
    return <p className="text-center text-sm text-white/40">De eerste artikels volgen binnenkort.</p>;
  }

  return (
    <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} locale={locale} />
      ))}
    </div>
  );
}
