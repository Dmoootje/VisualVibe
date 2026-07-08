import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";
import { Section, Container } from "@/components/ui";
import { PageHero, BlogGrid } from "@/components/sections";

export const metadata: Metadata = {
  title: { absolute: `Kennisbank | ${businessConfig.displayName}` },
  description: "Praktische inzichten over webdesign, SEO, fotografie, video, drone en 3D/VR/AR.",
};

export default function KennisbankHubPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Kennisbank", path: "/kennisbank" }]} />

      <PageHero
        title="Kennisbank"
        subtitle="Praktische inzichten over webdesign, SEO (incl. AEO/GEO), fotografie, video, drone en 3D/VR/AR."
      />

      <Section orbs="tl-br">
        <Container>
          <BlogGrid posts={blogPosts} />
        </Container>
      </Section>
    </div>
  );
}
