import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostsByCategory,
  isBlogLocale,
  localizedPath,
} from "@/lib/kennisbank/posts";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";
import { KennisbankLandingView } from "@/components/kennisbank";
import { toArticleCardData, type KbCategoryData } from "@/components/kennisbank/data";

const description =
  "Praktische inzichten over webdesign, SEO, fotografie, video, drone en 3D/VR/AR.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isBlogLocale(locale) || getAllPosts({ locale }).length === 0) {
    return { robots: { index: false, follow: false } };
  }

  return {
    title: { absolute: `Kennisbank | ${businessConfig.displayName}` },
    description,
    alternates: {
      canonical: `${businessConfig.url}${localizedPath(locale, "/kennisbank/")}`,
    },
  };
}

export default async function KennisbankHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isBlogLocale(locale)) notFound();

  const posts = getAllPosts({ locale });
  if (posts.length === 0) notFound();

  // All eight registered categories with live counts (Blader per onderwerp);
  // the subset with content drives the filter chips + sidebar.
  const allCategories: KbCategoryData[] = kennisbankCategories.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description,
    count: getPostsByCategory(category.slug, locale).length,
  }));
  const activeCategories = allCategories.filter((category) => category.count > 0);

  // Featured = newest pillar guide, else the newest post; excluded from the grid.
  const featuredPost = posts.find((post) => post.pillar) ?? posts[0];
  const articles = posts
    .filter((post) => post.slug !== featuredPost.slug)
    .map(toArticleCardData);

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: localizedPath(locale, "/") },
          { name: "Kennisbank", path: localizedPath(locale, "/kennisbank/") },
        ]}
      />

      <KennisbankLandingView
        articles={articles}
        featured={toArticleCardData(featuredPost)}
        activeCategories={activeCategories}
        allCategories={allCategories}
        totalArticles={posts.length}
      />
    </div>
  );
}
