import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cases } from "@/data/cases";
import { realisatieCategories, getRealisatieCategoryBySlug } from "@/data/realisatieCategories";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { CaseGrid } from "@/components/sections";
import { Section, Container } from "@/components/ui";
import { RealisatieCategoryGrid } from "@/components/realisaties/RealisatieCategoryGrid";
import { RealisatieHeader } from "@/components/realisaties/RealisatieHeader";
import { RealisatieWebdesignFeatured } from "@/components/realisaties/RealisatieWebdesignFeatured";
import { RealisatieWebdesignGrid } from "@/components/realisaties/RealisatieWebdesignGrid";
import { RealisatieFotografieGalerijen } from "@/components/realisaties/RealisatieFotografieGalerijen";
import { RealisatieDroneMedia } from "@/components/realisaties/RealisatieDroneMedia";
import { RealisatieVideografieGalerijen } from "@/components/videografie";
import { RealisatieXrTours } from "@/components/xr";
import { matterportTours } from "@/data/matterportTours";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { getVideografieVideos } from "@/lib/youtube";
import { videografieCategories } from "@/config/videografie.config";
import { droneMedia, droneCategories, droneStats } from "@/config/drone.config";

export function generateStaticParams() {
  return realisatieCategories.map((category) => ({ category: category.slug }));
}

// ISR so admin-managed Webdesign showcase images/projects propagate without a rebuild.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryDef = getRealisatieCategoryBySlug(category);
  if (!categoryDef) return {};

  const items = cases.filter((item) => item.category === categoryDef.slug);
  // Fotografie is indexable once it has at least one non-empty gallery.
  const fotoGalleryCount =
    categoryDef.slug === "fotografie"
      ? (await getFotografieGalleries()).filter((g) => g.images.length > 0).length
      : 0;
  // Webdesign, videografie + 3D/VR/AR carry their own showcase content, so always indexable.
  const hasContent =
    categoryDef.slug === "webdesign" ||
    categoryDef.slug === "videografie" ||
    categoryDef.slug === "3d-vr" ||
    categoryDef.slug === "drone" ||
    fotoGalleryCount > 0 ||
    items.length > 0;
  return pageMetadata({
    title: categoryDef.seoTitle,
    description: categoryDef.seoDescription,
    path: `/realisaties/${categoryDef.slug}/`,
    // Empty category: keep it reachable but out of the index until content lands.
    noindex: !hasContent,
  });
}

export default async function RealisatieCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryDef = getRealisatieCategoryBySlug(category);
  if (!categoryDef) notFound();

  const isWebdesign = categoryDef.slug === "webdesign";
  const isFotografie = categoryDef.slug === "fotografie";
  const isVideografie = categoryDef.slug === "videografie";
  const is3dVr = categoryDef.slug === "3d-vr";
  const isDrone = categoryDef.slug === "drone";
  const items = cases.filter((item) => item.category === categoryDef.slug);
  const otherCategories = realisatieCategories.filter((c) => c.slug !== categoryDef.slug);

  // Webdesign leads with the featured "Laatste creatie" + Websites/Webshops
  // grid, built from the admin-managed projects + images.
  const [webdesignImages, webdesignProjects] = isWebdesign
    ? await Promise.all([getWebdesignImages(), getWebdesignProjects()])
    : [null, null];
  const featured =
    webdesignProjects?.find((p) => p.id === "gordijnenmyriam") ?? webdesignProjects?.[0] ?? null;
  const gridProjects = webdesignProjects?.filter((p) => p.id !== featured?.id) ?? [];

  // Fotografie shows admin-managed galleries; empty galleries are skipped.
  const fotoGalleries = isFotografie
    ? (await getFotografieGalleries()).filter((g) => g.images.length > 0)
    : [];

  // Content-driven stat rail: gallery count + a fixed in-house claim. Only shown
  // once at least one gallery exists (otherwise the header keeps its plain look).
  const fotoStats =
    isFotografie && fotoGalleries.length > 0
      ? [
          {
            value: String(fotoGalleries.length),
            label: `fotografie-\n${fotoGalleries.length === 1 ? "stijl" : "stijlen"}`,
          },
          { value: "100%", label: "in-house\ngeschoten", accent: true },
        ]
      : undefined;

  // Videografie shows the YouTube-fed realisaties gallery (featured + filter grid).
  const videoData = isVideografie ? await getVideografieVideos() : null;

  // 3D/VR/AR shows all Matterport tours as a grid + lightbox; the header carries
  // a tour-count + Matterport stat rail.
  const xrStats = is3dVr
    ? [
        { value: String(matterportTours.length), label: "virtuele\ntours" },
        { value: "360°", label: "Matterport\nscans", accent: true },
      ]
    : undefined;

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Realisaties", path: "/realisaties" },
          { name: categoryDef.name, path: `/realisaties/${categoryDef.slug}` },
        ]}
      />

      <RealisatieHeader category={categoryDef} stats={fotoStats ?? xrStats ?? (isDrone ? droneStats : undefined)} />

      {isWebdesign && webdesignImages && featured ? (
        <>
          <RealisatieWebdesignFeatured project={featured} images={webdesignImages} />
          <RealisatieWebdesignGrid projects={gridProjects} images={webdesignImages} />
        </>
      ) : isFotografie && fotoGalleries.length > 0 ? (
        <RealisatieFotografieGalerijen galleries={fotoGalleries} />
      ) : isVideografie && videoData && videoData.videos.length > 0 ? (
        <RealisatieVideografieGalerijen videos={videoData.videos} categories={videografieCategories} />
      ) : isDrone ? (
        <RealisatieDroneMedia media={droneMedia} categories={droneCategories} />
      ) : is3dVr ? (
        <RealisatieXrTours tours={matterportTours} />
      ) : (
        <Section orbs="tl-br">
          <Container>
            {items.length > 0 ? (
              <CaseGrid cases={items} />
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
                <h2 className="text-2xl font-bold">Binnenkort realisaties in {categoryDef.name}</h2>
                <p className="max-w-xl text-white/60">
                  We voegen hier binnenkort projecten toe. Zin om zelf zo&apos;n realisatie te laten maken?
                </p>
                <Link
                  href="/offerte-aanvragen"
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-medium text-white transition-colors hover:from-red-600 hover:to-amber-600"
                >
                  Offerte aanvragen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </Container>
        </Section>
      )}

      <Section orbs="tr-bl">
        <Container>
          <h2 className="mb-6 text-2xl font-bold">Andere categorieën</h2>
          <RealisatieCategoryGrid items={otherCategories} />
        </Container>
      </Section>
    </div>
  );
}
