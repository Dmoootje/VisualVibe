import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { getPostsByCategory } from "@/lib/kennisbank/posts";
import { kennisbankCategories } from "@/data/kennisbankCategories";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";
import { Section, Container } from "@/components/ui";
import { PageHero, BlogGrid, CategoryGrid } from "@/components/sections";

export const metadata: Metadata = {
  title: { absolute: `Kennisbank | ${businessConfig.displayName}` },
  description: "Praktische inzichten over webdesign, SEO, fotografie, video, drone en 3D/VR/AR.",
  alternates: { canonical: `${businessConfig.url}/kennisbank/` },
};

export default function KennisbankHubPage() {
  const categoryCards = kennisbankCategories.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description,
    count: getPostsByCategory(category.slug).length,
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Kennisbank", path: "/kennisbank/" },
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
