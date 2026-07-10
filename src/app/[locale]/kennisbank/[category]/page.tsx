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
import { Section, Container } from "@/components/ui";
import { PageHero, Breadcrumbs, BlogGrid, CategoryGrid } from "@/components/sections";
import { BreadcrumbJsonLd } from "@/components/seo";

export function generateStaticParams() {
  // Pre-render only categories that contain live content in at least one locale.
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

  const empty = getPostsByCategory(categoryDef.slug, locale).length === 0;
  return {
    title: { absolute: categoryDef.seoTitle },
    description: categoryDef.seoDescription,
    alternates: {
      canonical: `${businessConfig.url}${localizedPath(
        locale,
        categoryHref(categoryDef.slug)
      )}`,
    },
    // Empty category: reachable + in the menu, but out of the index until posts land.
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
      description: c.description,
      count: getPostsByCategory(c.slug, locale).length,
    }))
    .filter((otherCategory) => otherCategory.count > 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: localizedPath(locale, "/") },
          { name: "Kennisbank", path: localizedPath(locale, "/kennisbank/") },
          {
            name: categoryDef.name,
            path: localizedPath(locale, categoryHref(categoryDef.slug)),
          },
        ]}
      />

      <PageHero title={categoryDef.name} subtitle={categoryDef.description} />

      <Section orbs="tl-br">
        <Container>
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "Home", href: "/" },
              { name: "Kennisbank", href: "/kennisbank/" },
              { name: categoryDef.name },
            ]}
          />
          {pillarPosts.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                Start hier
              </p>
              <h2 className="mb-4 text-2xl font-bold">
                {pillarPosts.length === 1 ? "Complete gids" : "Complete gidsen"}
              </h2>
              <BlogGrid posts={pillarPosts} />
            </div>
          )}

          {supportingPosts.length > 0 && (
            <div className={pillarPosts.length > 0 ? "mt-12" : undefined}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                Verdieping
              </p>
              <h2 className="mb-4 text-2xl font-bold">Artikels per vraag</h2>
              <BlogGrid posts={supportingPosts} />
            </div>
          )}
        </Container>
      </Section>

      {otherCategories.length > 0 && (
        <Section orbs="tr-bl">
          <Container>
            <h2 className="mb-6 text-2xl font-bold">Andere categorieën</h2>
            <CategoryGrid items={otherCategories} />
          </Container>
        </Section>
      )}
    </div>
  );
}
