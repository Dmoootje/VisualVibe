import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/components/kennisbank/kennisbank.css";
import {
  getPostBySlug,
  getPostTranslations,
  isBlogLocale,
  localizedPath,
  postHref,
  categoryHref,
} from "@/lib/kennisbank/posts";
import { getCategoryBySlug } from "@/data/kennisbankCategories";
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

const SOFTWARE_POST_SLUGS = [
  "app-laten-maken-complete-gids",
  "wat-kost-een-app-laten-maken",
  "webapp-of-mobiele-app",
  "ai-applicatie-laten-maken",
] as const;

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

function getSoftwarePosts(locale: "nl" | "fr" | "en") {
  return SOFTWARE_POST_SLUGS.map((translationKey) => {
    const translation = getPostTranslations(translationKey)[locale];
    return translation ?? getPostBySlug(translationKey, { locale });
  }).filter((post): post is NonNullable<typeof post> => Boolean(post));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isBlogLocale(locale)) return {};

  const category = getCategoryBySlug("software-op-maat");
  if (!category) return {};

  const posts = getSoftwarePosts(locale);
  const pillar = posts.find((post) => post.pillar) ?? posts[0];
  const canonical = `${businessConfig.url}${localizedPath(
    locale,
    categoryHref("software-op-maat")
  )}`;
  const socialImage = pillar?.ogImage ?? `${businessConfig.url}/image.jpg`;
  const categoryPath = categoryHref("software-op-maat");
  const localizedTitle =
    locale === "en"
      ? "Apps & software guides and advice | VisualVibe"
      : category.seoTitle;
  const localizedDescription =
    locale === "en"
      ? "Practical guides about apps, AI applications, automation and custom software for SMEs, written by VisualVibe."
      : category.seoDescription;
  const languages =
    getSoftwarePosts("nl").length > 0 && getSoftwarePosts("en").length > 0
      ? publishedLanguageAlternates(businessConfig.url, {
          nl: categoryPath,
          en: categoryPath,
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
      images: [{ url: socialImage, alt: locale === "en" ? "Apps and custom software for SMEs" : category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: localizedTitle,
      description: localizedDescription,
      images: [socialImage],
    },
  };
}

export default async function SoftwareKennisbankPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const labels = knowledgeBaseLabels(locale);
  if (!isBlogLocale(locale)) notFound();

  const category = getCategoryBySlug("software-op-maat");
  if (!category) notFound();

  const posts = getSoftwarePosts(locale);
  if (posts.length === 0) notFound();

  const pillarPosts = posts.filter((post) => post.pillar);
  const supportingPosts = posts.filter((post) => !post.pillar);
  const authorImages = await getAuthorPhotoMap();
  const canonicalUrl = `${businessConfig.url}${localizedPath(
    locale,
    categoryHref(category.slug)
  )}`;
  const lastUpdated = new Date(
    Math.max(...posts.map((post) => new Date(post.updatedAt ?? post.publishedAt).getTime()))
  );
  const lastUpdatedLabel = new Intl.DateTimeFormat(CONTENT_LANGUAGE[locale], {
    month: "long",
    year: "numeric",
  }).format(lastUpdated);
  const localizedTitle =
    locale === "en"
      ? "Apps & software guides and advice | VisualVibe"
      : category.seoTitle;
  const localizedDescription =
    locale === "en"
      ? "Practical guides about apps, AI applications, automation and custom software for SMEs, written by VisualVibe."
      : category.seoDescription;

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Home", path: "/" },
          { name: labels.knowledgeBase, path: "/kennisbank/" },
          { name: category.name, path: categoryHref(category.slug) },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          headline: localizedTitle,
          description: localizedDescription,
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
          { label: category.name },
        ]}
        eyebrow={{
          icon: <CategoryIcon slug={category.slug} className="h-3.5 w-3.5" />,
          label: labels.category,
        }}
        title={locale === "en" ? "Apps & custom" : "Apps &"}
        titleAccent={locale === "en" ? "software" : "software"}
        subtitle={locale === "en" ? "Practical guides about apps, AI applications, automation and custom software for SMEs." : category.description}
        stats={[
          { value: String(posts.length), label: labels.articles },
          { value: String(pillarPosts.length), label: pillarPosts.length === 1 ? labels.guide : labels.guides },
          { value: lastUpdatedLabel, label: labels.updated },
        ]}
        graphic={<CategoryRingGraphic slug={category.slug} />}
        search={<CategoryHeroSearch locale={locale} />}
        backgroundImage={pillarPosts[0]?.featuredImage ?? posts[0]?.featuredImage}
        backgroundImageAlt={locale === "en" ? "Custom apps, AI and software for SMEs" : `${category.name}: apps, AI en software op maat laten maken`}
      />

      <section className="relative z-[2]">
        <div className="container mx-auto grid items-start gap-11 px-2.5 py-14 sm:px-4 lg:grid-cols-[1fr_336px]">
          <div className="min-w-0">
            {pillarPosts.length > 0 && (
              <div className="mb-14">
                <div className="mb-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a45]">
                  {labels.startHere}
                </div>
                <h2 className="mb-6 font-sora text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {labels.completeGuide}
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {pillarPosts.map((post, index) => (
                    <ArticleCard
                      key={post.slug}
                      article={toArticleCardData(post, authorImages)}
                      variant="grid"
                      index={index}
                      ctaLabel={labels.readGuide}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a45]">
                {labels.deepDive}
              </div>
              <h2 className="mb-6 font-sora text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {locale === "en" ? "Apps, AI and automation" : "Apps, AI en automatisering"}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {supportingPosts.map((post, index) => (
                  <QuestionCard
                    key={post.slug}
                    article={toArticleCardData(post, authorImages)}
                    index={index}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          </div>

          <CategorySidebar
            locale={locale}
            tocLinks={posts.map((post) => ({ title: post.title, href: postHref(post) }))}
            otherCategories={[]}
            cta={{
              title: locale === "en" ? "Planning an app or software platform?" : "Een app of softwareplatform laten maken?",
              description: locale === "en" ? "We turn your process or idea into a viable first version with clear features, planning and technical choices." : "We vertalen je proces of idee naar een haalbare eerste versie met duidelijke functies, planning en technische keuzes.",
              label: locale === "en" ? "Explore custom software" : "Bekijk software op maat",
              href: locale === "en" ? "/diensten/custom-software/" : "/diensten/software-op-maat/",
            }}
          />
        </div>
      </section>
    </div>
  );
}
