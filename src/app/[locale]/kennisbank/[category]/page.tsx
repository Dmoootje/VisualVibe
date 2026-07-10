import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getPostBySlug,
  getPostsByCategory,
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
  // Pre-render only categories that have posts. Registered-but-empty pillars
  // render on demand and 404 (see the notFound guard below) until content lands.
  return kennisbankCategories
    .filter((category) => getPostsByCategory(category.slug).length > 0)
    .map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryDef = getCategoryBySlug(category);
  if (!categoryDef) {
    return {};
  }

  return {
    title: { absolute: categoryDef.seoTitle },
    description: categoryDef.seoDescription,
    alternates: { canonical: `${businessConfig.url}${categoryHref(categoryDef.slug)}` },
  };
}

export default async function KennisbankCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryDef = getCategoryBySlug(category);

  // Legacy flat URL (/kennisbank/<post-slug>) lands here - 308 to the nested URL.
  if (!categoryDef) {
    const legacyPost = getPostBySlug(category);
    if (legacyPost) {
      permanentRedirect(postHref(legacyPost));
    }
    notFound();
  }

  const posts = getPostsByCategory(categoryDef.slug);

  // A registered-but-empty category (no posts yet) must not render a thin page.
  if (posts.length === 0) {
    notFound();
  }

  const otherCategories = kennisbankCategories
    .filter((c) => c.slug !== categoryDef.slug)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      count: getPostsByCategory(c.slug).length,
    }))
    .filter((c) => c.count > 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Kennisbank", path: "/kennisbank/" },
          { name: categoryDef.name, path: categoryHref(categoryDef.slug) },
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
          <BlogGrid posts={posts} />
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
