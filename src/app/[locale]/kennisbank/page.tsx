import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";

export const metadata: Metadata = {
  title: { absolute: `Kennisbank | ${businessConfig.displayName}` },
  description: "Praktische inzichten over webdesign, SEO, fotografie, video, drone en 3D/VR/AR.",
};

export default function KennisbankHubPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Kennisbank", path: "/kennisbank" }]} />

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Kennisbank</h1>
        <p className="text-lg text-white/70 mb-12">
          Binnenkort delen we hier praktische inzichten over webdesign, SEO (incl. AEO/GEO), fotografie, video,
          drone en 3D/VR/AR.
        </p>

        {blogPosts.length === 0 && (
          <p className="text-center text-sm text-white/40">De eerste artikels volgen binnenkort.</p>
        )}
      </div>
    </div>
  );
}
