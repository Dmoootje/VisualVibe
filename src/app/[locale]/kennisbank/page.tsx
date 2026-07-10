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
import { Section, Container } from "@/components/ui";
import { PageHero, BlogGrid, CategoryGrid } from "@/components/sections";

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

  const blogPosts = getAllPosts({ locale });
  if (blogPosts.length === 0) notFound();

  // Empty clusters stay hidden until their first substantial article is live.
  const categoryCards = kennisbankCategories
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      description: category.description,
      count: getPostsByCategory(category.slug, locale).length,
    }))
    .filter((category) => category.count > 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: localizedPath(locale, "/") },
          { name: "Kennisbank", path: localizedPath(locale, "/kennisbank/") },
        ]}
      />

      <PageHero
        title="Kennisbank"
        subtitle="Praktische inzichten over webdesign, SEO (incl. AEO/GEO), fotografie, video, drone en 3D/VR/AR."
      />

      <Section orbs="tl-br">
        <Container>
          <h2 className="mb-6 text-2xl font-bold">Categorieën</h2>
          <CategoryGrid items={categoryCards} />
        </Container>
      </Section>

      <Section orbs="tr-bl">
        <Container>
          <h2 className="mb-6 text-2xl font-bold">Alle artikels</h2>
          <BlogGrid posts={blogPosts} />
        </Container>
      </Section>
    </div>
  );
}
