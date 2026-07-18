import type { Metadata } from "next";
import "@/components/kennisbank/kennisbank.css";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostsByCategory,
  isBlogLocale,
  localizedPath,
} from "@/lib/kennisbank/posts";
import {
  getLocalizedKennisbankCategoryById,
  kennisbankCategories,
} from "@/data/kennisbankCategories";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";
import { KennisbankLandingView, knowledgeBaseLabels } from "@/components/kennisbank";
import { toArticleCardData, type KbCategoryData } from "@/components/kennisbank/data";
import { getAuthorPhotoMap } from "@/lib/firestore/profiles";
import { publishedLanguageAlternates } from "@/lib/seo/publicationRoutes";

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
  const socialImage = `${businessConfig.url}/image.jpg`;
  const metaTitle = locale === "en" ? "Knowledge base: web design, SEO and media guides | VisualVibe" : title;
  const metaDescription = locale === "en" ? "Practical guides for SMEs about web design, SEO, GEO, photography, video and digital growth, written by VisualVibe in Limburg, Belgium." : description;
  const languages =
    getAllPosts({ locale: "nl" }).length > 0 &&
    getAllPosts({ locale: "en" }).length > 0
      ? publishedLanguageAlternates(businessConfig.url, {
          nl: "/kennisbank/",
          en: "/kennisbank/",
        })
      : undefined;

  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: businessConfig.displayName,
      locale: OPEN_GRAPH_LOCALE[locale],
      title: metaTitle,
      description: metaDescription,
      images: [{ url: socialImage, width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
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
  const labels = knowledgeBaseLabels(locale);
  if (!isBlogLocale(locale)) notFound();

  const posts = getAllPosts({ locale });
  if (posts.length === 0) notFound();

  const authorImages = await getAuthorPhotoMap();

  // All eight registered categories with live counts (Blader per onderwerp);
  // the subset with content drives the filter chips + sidebar.
  const allCategories: KbCategoryData[] = kennisbankCategories.map((category) => {
    const localized = getLocalizedKennisbankCategoryById(category.slug, locale);
    return {
      slug: localized.slug,
      name: localized.name,
      description: localized.description,
      count: getPostsByCategory(category.slug, locale).length,
    };
  });
  const activeCategories = allCategories.filter((category) => category.count > 0);

  // Featured = newest pillar guide, else the newest post; excluded from the grid.
  const featuredPost = posts.find((post) => post.pillar) ?? posts[0];
  const articles = posts
    .filter((post) => post.slug !== featuredPost.slug)
    .map((post) => toArticleCardData(post, authorImages));

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Home", path: "/" },
          { name: labels.knowledgeBase, path: "/kennisbank/" },
        ]}
      />

      <KennisbankLandingView
        articles={articles}
        featured={toArticleCardData(featuredPost, authorImages)}
        activeCategories={activeCategories}
        allCategories={allCategories}
        totalArticles={posts.length}
        locale={locale}
      />
    </div>
  );
}
