import type { Metadata } from "next";
import "@/components/kennisbank/kennisbank.css";
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
import { Link } from "@/i18n/navigation";
import { KennisbankLandingView } from "@/components/kennisbank";
import { toArticleCardData, type KbCategoryData } from "@/components/kennisbank/data";
import { getAuthorPhotoMap } from "@/lib/firestore/profiles";

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

  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    alternates: { canonical },
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
  if (!isBlogLocale(locale)) notFound();

  const posts = getAllPosts({ locale });
  if (posts.length === 0) notFound();

  const authorImages = await getAuthorPhotoMap();

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
    .map((post) => toArticleCardData(post, authorImages));

  if (locale === "en") {
    return <EnglishKnowledgeBase featured={toArticleCardData(featuredPost, authorImages)} articles={articles} total={posts.length} />;
  }

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Home", path: "/" },
          { name: "Kennisbank", path: "/kennisbank/" },
        ]}
      />

      <KennisbankLandingView
        articles={articles}
        featured={toArticleCardData(featuredPost, authorImages)}
        activeCategories={activeCategories}
        allCategories={allCategories}
        totalArticles={posts.length}
      />
    </div>
  );
}

function EnglishKnowledgeBase({ featured, articles, total }: { featured: ReturnType<typeof toArticleCardData>; articles: ReturnType<typeof toArticleCardData>[]; total: number }) {
  return (
    <div className="min-h-screen pb-24 text-white">
      <BreadcrumbJsonLd locale="en" items={[{ name: "Home", path: "/" }, { name: "Knowledge base", path: "/kennisbank/" }]} />
      <header className="border-b border-white/10 pb-14 pt-32">
        <div className="container mx-auto px-2.5 sm:px-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">Knowledge base</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold sm:text-6xl">Grow your business online with practical guidance</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">Explore {total} in-depth articles about web design, SEO and GEO, photography, video, digital applications and content production for SMEs.</p>
        </div>
      </header>
      <main className="container mx-auto px-2.5 py-14 sm:px-4">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">Featured guide</p>
          <Link href={featured.href} className="mt-4 block rounded-2xl border border-[#ff7500]/30 bg-[#ff7500]/[0.06] p-7 transition hover:border-[#ff7500]/60">
            <span className="text-sm font-semibold text-[#ff9a45]">{featured.categoryName}</span>
            <h2 className="mt-2 text-3xl font-bold">{featured.fullTitle}</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-white/65">{featured.excerpt}</p>
            <span className="mt-5 inline-block font-semibold text-[#ff9a45]">Read the guide</span>
          </Link>
        </section>
        <section className="mt-14">
          <h2 className="text-3xl font-bold">Latest articles</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={article.href} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#ff7500]/50">
                <span className="text-xs font-bold uppercase tracking-wide text-[#ff9a45]">{article.categoryName}</span>
                <h3 className="mt-3 text-xl font-bold">{article.fullTitle}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{article.excerpt}</p>
                <span className="mt-5 inline-block font-semibold text-[#ff9a45]">Read article</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
