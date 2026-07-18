import type { Metadata } from "next";
import "@/components/kennisbank/kennisbank.css";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getPostBySlug,
  getPostsByCategory,
  isBlogLocale,
  localizedPath,
  postHref,
  categoryHref,
} from "@/lib/kennisbank/posts";
import {
  getCategoryBySlug,
  kennisbankCategories,
} from "@/data/kennisbankCategories";
import { kennisbankCategoryFeatured } from "@/data/kennisbankImages";
import { businessConfig } from "@/config/business.config";
import { getAuthorPhotoMap } from "@/lib/firestore/profiles";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import {
  KbHeroShell,
  CategoryHeroSearch,
  CategoryRingGraphic,
  CategorySidebar,
  CategoryIcon,
  ArticleCard,
  QuestionCard,
  toArticleCardData,
  knowledgeBaseLabels,
} from "@/components/kennisbank";
import { publishedLanguageAlternates } from "@/lib/seo/publicationRoutes";

const OPEN_GRAPH_LOCALE: Record<string, string> = {
  nl: "nl_BE",
  fr: "fr_BE",
  en: "en_BE",
};

const CONTENT_LANGUAGE: Record<string, string> = {
  nl: "nl-BE",
  fr: "fr-BE",
  en: "en-BE",
};

/** Two-tones a category name: last word becomes the amber accent line. */
function splitCategoryName(name: string): { title: string; titleAccent?: string } {
  const lastSpace = name.lastIndexOf(" ");
  if (lastSpace === -1) return { title: name };
  return { title: name.slice(0, lastSpace), titleAccent: name.slice(lastSpace + 1) };
}

export function generateStaticParams() {
  return kennisbankCategories
    .filter((category) => getPostsByCategory(category.slug).length > 0)
    .map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isBlogLocale(locale)) return {};

  const categoryDef = getCategoryBySlug(category);
  if (!categoryDef) {
    return {};
  }

  const posts = getPostsByCategory(categoryDef.slug, locale);
  const empty = posts.length === 0;
  const canonical = `${businessConfig.url}${localizedPath(
    locale,
    categoryHref(categoryDef.slug)
  )}`;
  const featuredPost = posts.find((post) => post.pillar) ?? posts[0];
  const socialImage = featuredPost?.ogImage ?? `${businessConfig.url}/image.jpg`;
  const localizedName = locale === "en" ? (featuredPost?.category ?? categoryDef.name) : categoryDef.name;
  const localizedTitle = locale === "en" ? `${localizedName} guides and advice | VisualVibe` : categoryDef.seoTitle;
  const localizedDescription = locale === "en" ? `Practical ${localizedName} guides and answers for SMEs, written by VisualVibe.` : categoryDef.seoDescription;
  const languages =
    getPostsByCategory(categoryDef.slug, "nl").length > 0 &&
    getPostsByCategory(categoryDef.slug, "en").length > 0
      ? publishedLanguageAlternates(businessConfig.url, {
          nl: categoryHref(categoryDef.slug),
          en: categoryHref(categoryDef.slug),
        })
      : undefined;

  return {
    title: { absolute: localizedTitle },
    description: localizedDescription,
    alternates: { canonical, languages },
    openGraph: {
      title: localizedTitle,
      description: localizedDescription,
      url: canonical,
      type: "website",
      siteName: businessConfig.displayName,
      locale: OPEN_GRAPH_LOCALE[locale],
      images: [{ url: socialImage, alt: featuredPost?.heroImageAlt ?? categoryDef.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: localizedTitle,
      description: localizedDescription,
      images: [socialImage],
    },
    robots: empty ? { index: false, follow: true } : undefined,
  };
}

export default async function KennisbankCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const labels = knowledgeBaseLabels(locale);
  if (!isBlogLocale(locale)) notFound();

  const categoryDef = getCategoryBySlug(category);

  // Legacy flat URL (/kennisbank/<post-slug>) lands here - 308 to the nested URL.
  if (!categoryDef) {
    const legacyPost = getPostBySlug(category, { locale });
    if (legacyPost) {
      permanentRedirect(localizedPath(locale, postHref(legacyPost)));
    }
    notFound();
  }

  const posts = getPostsByCategory(categoryDef.slug, locale);
  if (posts.length === 0) notFound();
  const localizedCategoryName = locale === "en" ? posts[0].category : categoryDef.name;

  const pillarPosts = posts.filter((post) => post.pillar);
  const supportingPosts = posts.filter((post) => !post.pillar);
  const authorImages = await getAuthorPhotoMap();

  const otherCategories = kennisbankCategories
    .filter((c) => c.slug !== categoryDef.slug)
    .map((c) => ({
      slug: c.slug,
      name: locale === "en" ? (getPostsByCategory(c.slug, locale)[0]?.category ?? c.name) : c.name,
      count: getPostsByCategory(c.slug, locale).length,
    }))
    .filter((otherCategory) => otherCategory.count > 0);

  const { title, titleAccent } = splitCategoryName(localizedCategoryName);
  const canonicalUrl = `${businessConfig.url}${localizedPath(locale, categoryHref(categoryDef.slug))}`;

  // Echte freshness-claim: de recentste update binnen de categorie.
  const lastUpdated = new Date(
    Math.max(...posts.map((post) => new Date(post.updatedAt ?? post.publishedAt).getTime()))
  );
  const lastUpdatedLabel = new Intl.DateTimeFormat(CONTENT_LANGUAGE[locale], {
    month: "long",
    year: "numeric",
  }).format(lastUpdated);

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Home", path: "/" },
          { name: labels.knowledgeBase, path: "/kennisbank/" },
          {
            name: localizedCategoryName,
            path: categoryHref(categoryDef.slug),
          },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: localizedCategoryName,
          headline: categoryDef.seoTitle,
          description: categoryDef.seoDescription,
          url: canonicalUrl,
          inLanguage: CONTENT_LANGUAGE[locale],
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: post.title,
              url: `${businessConfig.url}${localizedPath(locale, postHref(post))}`,
            })),
          },
        }}
      />

      <KbHeroShell
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: labels.knowledgeBase, href: "/kennisbank/" },
          { label: localizedCategoryName },
        ]}
        eyebrow={{
          icon: <CategoryIcon slug={categoryDef.slug} className="h-3.5 w-3.5" />,
          label: labels.category,
        }}
        title={title}
        titleAccent={titleAccent}
        subtitle={locale === "en" ? `Practical guides and clear answers about ${localizedCategoryName.toLowerCase()} for SMEs.` : categoryDef.description}
        stats={[
          { value: String(posts.length), label: posts.length === 1 ? labels.article : labels.articles },
          { value: String(pillarPosts.length), label: pillarPosts.length === 1 ? labels.guide : labels.guides },
          { value: lastUpdatedLabel, label: labels.updated },
        ]}
        graphic={<CategoryRingGraphic slug={categoryDef.slug} />}
        search={<CategoryHeroSearch locale={locale} />}
        backgroundImage={kennisbankCategoryFeatured(categoryDef.slug)}
        backgroundImageAlt={`${labels.knowledgeBase}: ${localizedCategoryName} by VisualVibe`}
      />

      <section className="relative z-[2]">
        <div className="container mx-auto grid items-start gap-11 px-2.5 sm:px-4 py-14 lg:grid-cols-[1fr_336px]">
          <div className="min-w-0">
            {pillarPosts.length > 0 && (
              <div className="mb-14">
                <div
                  className="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a45]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {labels.startHere}
                </div>
                <h2
                  className="mb-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  {pillarPosts.length === 1 ? labels.completeGuide : labels.completeGuides}
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {pillarPosts.map((post, i) => (
                    <ArticleCard
                      key={post.slug}
                      article={toArticleCardData(post, authorImages)}
                      variant="grid"
                      index={i}
                      ctaLabel={labels.readGuide}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}

            {supportingPosts.length > 0 && (
              <div>
                <div
                  className="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a45]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  {labels.deepDive}
                </div>
                <h2
                  className="mb-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  {labels.articlesByQuestion}
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {supportingPosts.map((post, i) => (
                    <QuestionCard key={post.slug} article={toArticleCardData(post, authorImages)} index={i} locale={locale} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <CategorySidebar
            locale={locale}
            tocLinks={posts.map((post) => ({ title: post.title, href: postHref(post) }))}
            otherCategories={otherCategories}
            cta={{
              title: locale === "en" ? `Need help with ${localizedCategoryName.toLowerCase()}?` : `Hulp nodig met ${categoryDef.name}?`,
              description: locale === "en" ? "We help SMEs achieve concrete, measurable results. Ask us for advice with no obligation." : "Wij helpen KMO's in Limburg vooruit met concrete, meetbare resultaten. Vraag vrijblijvend advies aan.",
              label: locale === "en" ? "Ask for advice" : "Vraag advies aan",
              href: "/offerte-aanvragen/",
            }}
          />
        </div>
      </section>
    </div>
  );
}
