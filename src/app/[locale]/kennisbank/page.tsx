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

// Title: 59 chars incl. " | VisualVibe"; description: 155 chars.
const title = "Kennisbank: gidsen over webdesign, SEO & media | VisualVibe";
const description =
  "Praktische gidsen voor KMO's in Limburg over webdesign, SEO, AEO/GEO, fotografie en video. Leer hoe je online beter gevonden wordt en meer klanten bereikt.";

const OPEN_GRAPH_LOCALE: Record<string, string> = {
  nl: "nl_BE",
  fr: "fr_BE",
  en: "en_BE",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isBlogLocale(locale) || getAllPosts({ locale }).length === 0) {
    return { robots: { index: false, follow: false } };
  }

  // Kennisbank has real per-locale translations, so (unlike the nl-only
  // marketing pages) the canonical stays per-locale.
  const canonical = `${businessConfig.url}${localizedPath(locale, "/kennisbank/")}`;
  const socialImage = `${businessConfig.url}/image.png`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: businessConfig.displayName,
      locale: OPEN_GRAPH_LOCALE[locale],
      title,
      description,
      images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
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
