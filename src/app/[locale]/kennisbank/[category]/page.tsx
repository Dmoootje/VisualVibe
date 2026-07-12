import type { Metadata } from "next";
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
import { businessConfig } from "@/config/business.config";
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
} from "@/components/kennisbank";

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

  return {
    title: { absolute: categoryDef.seoTitle },
    description: categoryDef.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: categoryDef.seoTitle,
      description: categoryDef.seoDescription,
      url: canonical,
      type: "website",
      siteName: businessConfig.displayName,
      locale: OPEN_GRAPH_LOCALE[locale],
      images: [{ url: socialImage, alt: featuredPost?.heroImageAlt ?? categoryDef.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: categoryDef.seoTitle,
      description: categoryDef.seoDescription,
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

  const pillarPosts = posts.filter((post) => post.pillar);
  const supportingPosts = posts.filter((post) => !post.pillar);

  const otherCategories = kennisbankCategories
    .filter((c) => c.slug !== categoryDef.slug)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      count: getPostsByCategory(c.slug, locale).length,
    }))
    .filter((otherCategory) => otherCategory.count > 0);

  const { title, titleAccent } = splitCategoryName(categoryDef.name);
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
          { name: "Kennisbank", path: "/kennisbank/" },
          {
            name: categoryDef.name,
            path: categoryHref(categoryDef.slug),
          },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: categoryDef.name,
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
          { label: "Kennisbank", href: "/kennisbank/" },
          { label: categoryDef.name },
        ]}
        eyebrow={{
          icon: <CategoryIcon slug={categoryDef.slug} className="h-3.5 w-3.5" />,
          label: "Categorie",
        }}
        title={title}
        titleAccent={titleAccent}
        subtitle={categoryDef.description}
        stats={[
          { value: String(posts.length), label: posts.length === 1 ? "artikel" : "artikels" },
          { value: String(pillarPosts.length), label: pillarPosts.length === 1 ? "gids" : "gidsen" },
          { value: lastUpdatedLabel, label: "bijgewerkt" },
        ]}
        graphic={<CategoryRingGraphic slug={categoryDef.slug} />}
        search={<CategoryHeroSearch />}
      />

      <section className="relative z-[2]">
        <div className="container mx-auto grid items-start gap-11 px-4 py-14 lg:grid-cols-[1fr_336px]">
          <div className="min-w-0">
            {pillarPosts.length > 0 && (
              <div className="mb-14">
                <div
                  className="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ff9a45]"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  Start hier
                </div>
                <h2
                  className="mb-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  {pillarPosts.length === 1 ? "Complete gids" : "Complete gidsen"}
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {pillarPosts.map((post, i) => (
                    <ArticleCard
                      key={post.slug}
                      article={toArticleCardData(post)}
                      variant="grid"
                      index={i}
                      ctaLabel="Lees de gids"
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
                  Verdieping
                </div>
                <h2
                  className="mb-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  Artikels per vraag
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {supportingPosts.map((post, i) => (
                    <QuestionCard key={post.slug} article={toArticleCardData(post)} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <CategorySidebar
            tocLinks={posts.map((post) => ({ title: post.title, href: postHref(post) }))}
            otherCategories={otherCategories}
            cta={{
              title: `Hulp nodig met ${categoryDef.name}?`,
              description:
                "Wij helpen KMO's in Limburg vooruit met concrete, meetbare resultaten. Vraag vrijblijvend advies aan.",
              label: "Vraag advies aan",
              href: "/offerte-aanvragen/",
            }}
          />
        </div>
      </section>
    </div>
  );
}
