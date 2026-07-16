import type { Metadata } from "next";
import "@/components/media-patterns.css";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cases } from "@/data/cases";
import {
  realisatieCategories,
  getRealisatieCategoryBySlug,
  categoryToServiceSlug,
  shouldIndexRealisatieCategoryWithoutCases,
} from "@/data/realisatieCategories";
import { getServiceBySlug, serviceHref } from "@/data/services";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { CaseGrid } from "@/components/sections";
import { ServiceRelatedPosts } from "@/components/sections/ServiceRelatedPosts";
import { Section, Container } from "@/components/ui";
import { RealisatieCategoryGrid } from "@/components/realisaties/RealisatieCategoryGrid";
import { RealisatieHeader } from "@/components/realisaties/RealisatieHeader";
import { RealisatieWebdesignFeatured } from "@/components/realisaties/RealisatieWebdesignFeatured";
import { RealisatieWebdesignGrid } from "@/components/realisaties/RealisatieWebdesignGrid";
import { RealisatieFotografieGalerijen } from "@/components/realisaties/RealisatieFotografieGalerijen";
import { RealisatieSmugMugGalerijen } from "@/components/realisaties/RealisatieSmugMugGalerijen";
import { getSmugMugGalleries } from "@/lib/smugmug";
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
  // Applicaties heeft een eigen statische route met Firestore-cases en mag niet
  // nogmaals via het generieke [category]-segment worden gegenereerd.
  return realisatieCategories
    .filter((category) => category.slug !== "applicaties")
    .map((category) => ({ category: category.slug }));
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
  if (!categoryDef || categoryDef.slug === "applicaties") return {};

  const items = cases.filter((item) => item.category === categoryDef.slug);
  const fotoGalleryCount =
    categoryDef.slug === "fotografie"
      ? (await getFotografieGalleries()).filter((gallery) => gallery.images.length > 0).length
      : 0;
  const hasContent =
    categoryDef.slug === "webdesign" ||
    categoryDef.slug === "videografie" ||
    (categoryDef.slug === "3d-vr" && matterportTours.length > 0) ||
    (categoryDef.slug === "drone" && droneMedia.length > 0) ||
    fotoGalleryCount > 0 ||
    items.length > 0 ||
    shouldIndexRealisatieCategoryWithoutCases(categoryDef);
  return pageMetadata({
    title: categoryDef.seoTitle,
    description: categoryDef.seoDescription,
    path: `/realisaties/${categoryDef.slug}/`,
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
  if (!categoryDef || categoryDef.slug === "applicaties") notFound();

  const isWebdesign = categoryDef.slug === "webdesign";
  const isFotografie = categoryDef.slug === "fotografie";
  const isVideografie = categoryDef.slug === "videografie";
  const is3dVr = categoryDef.slug === "3d-vr";
  const isDrone = categoryDef.slug === "drone";
  const items = cases.filter((item) => item.category === categoryDef.slug);
  const otherCategories = realisatieCategories.filter(
    (candidate) => candidate.slug !== categoryDef.slug,
  );

  const mappedServiceSlug = categoryToServiceSlug[categoryDef.slug];
  const mappedService = mappedServiceSlug ? getServiceBySlug(mappedServiceSlug) : undefined;

  const [webdesignImages, webdesignProjects] = isWebdesign
    ? await Promise.all([getWebdesignImages(), getWebdesignProjects()])
    : [null, null];
  const featured =
    webdesignProjects?.find((project) => project.id === "gordijnenmyriam") ??
    webdesignProjects?.[0] ??
    null;
  const gridProjects =
    webdesignProjects?.filter((project) => project.id !== featured?.id) ?? [];

  const fotoGalleries = isFotografie
    ? (await getFotografieGalleries()).filter((gallery) => gallery.images.length > 0)
    : [];
  const smugGalleries = isFotografie ? await getSmugMugGalleries() : [];
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

  const videoData = isVideografie ? await getVideografieVideos() : null;
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

      <RealisatieHeader
        category={categoryDef}
        stats={fotoStats ?? xrStats ?? (isDrone ? droneStats : undefined)}
      />

      {isWebdesign && webdesignImages && featured ? (
        <>
          <RealisatieWebdesignFeatured project={featured} images={webdesignImages} />
          <RealisatieWebdesignGrid projects={gridProjects} images={webdesignImages} />
        </>
      ) : isFotografie && fotoGalleries.length > 0 ? (
        <RealisatieFotografieGalerijen galleries={fotoGalleries} />
      ) : isVideografie && videoData && videoData.videos.length > 0 ? (
        <RealisatieVideografieGalerijen
          videos={videoData.videos}
          categories={videografieCategories}
        />
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
                <h2 className="text-2xl font-bold">Realisaties rond {categoryDef.name}</h2>
                <p className="max-w-xl text-white/60">
                  {categoryDef.description} We vullen deze pagina verder aan met concrete cases,
                  beelden en resultaten. Zin om zelf zo&apos;n realisatie te laten maken?
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

      {isFotografie && <RealisatieSmugMugGalerijen galleries={smugGalleries} />}

      {mappedService && (
        <>
          <ServiceRelatedPosts serviceSlug={mappedService.slug} />
          <section className="relative py-6 sm:py-8">
            <div className="container mx-auto px-2.5 sm:px-4">
              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                <div>
                  <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
                    <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#FF9A45]" />
                    Onze dienst
                  </p>
                  <h2 className="font-sora text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white sm:text-[28px]">
                    Meer weten over onze dienst {mappedService.title}?
                  </h2>
                  <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-white/60">
                    Ontdek onze aanpak, wat we voor je doen en de antwoorden op veelgestelde
                    vragen.
                  </p>
                </div>
                <Link
                  href={`${serviceHref(mappedService)}/`}
                  className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white sm:self-center"
                >
                  Bekijk de dienst
                  <ArrowRight className="h-[15px] w-[15px]" />
                </Link>
              </div>
            </div>
          </section>
        </>
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
