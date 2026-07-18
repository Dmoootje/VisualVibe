import type { Metadata } from "next";
import "@/components/media-patterns.css";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cases } from "@/data/cases";
import {
  realisatieCategories,
  getRealisatieCategoryByLocalizedSlug,
  getLocalizedRealisatieCategoryById,
  categoryToServiceSlug,
  shouldIndexRealisatieCategoryWithoutCases,
} from "@/data/realisatieCategories";
import { getLocalizedServiceById, serviceHref } from "@/data/services";
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
import { matterportTours, getLocalizedMatterportTours } from "@/data/matterportTours";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { getVideografieVideos } from "@/lib/youtube";
import { videografieCategories } from "@/config/videografie.config";
import { droneMedia } from "@/config/drone.config";
import { getLocalizedDroneContent } from "@/config/drone.config";
import { getLocalizedWebdesignProject } from "@/data/webdesignShowcase";
import { getLocalizedCaseById } from "@/data/cases";
import type { SupportedLocale } from "@/i18n/locales";

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
  params: Promise<{ category: string; locale: SupportedLocale }>;
}): Promise<Metadata> {
  const { category, locale } = await params;
  const categoryDef = getRealisatieCategoryByLocalizedSlug(category, locale);
  if (!categoryDef || categoryDef.id === "applicaties") return {};
  const dutchCategory = getLocalizedRealisatieCategoryById(categoryDef.id, "nl");
  const englishCategory = getLocalizedRealisatieCategoryById(categoryDef.id, "en");

  const items = cases.filter((item) => item.category === categoryDef.slug);
  const fotoGalleryCount =
    categoryDef.id === "fotografie" && locale === "nl"
      ? (await getFotografieGalleries(locale)).filter((gallery) => gallery.images.length > 0).length
      : 0;
  const hasContent =
    categoryDef.id === "webdesign" ||
    (categoryDef.id === "videografie" && locale === "nl") ||
    (categoryDef.id === "3d-vr" && matterportTours.length > 0) ||
    (categoryDef.id === "drone" && droneMedia.length > 0) ||
    fotoGalleryCount > 0 ||
    items.length > 0 ||
    shouldIndexRealisatieCategoryWithoutCases(categoryDef);
  return pageMetadata({
    locale,
    title: categoryDef.seoTitle,
    description: categoryDef.seoDescription,
    path: `/realisaties/${categoryDef.slug}/`,
    languagePaths: {
      nl: `/realisaties/${dutchCategory.slug}/`,
      en: `/realisaties/${englishCategory.slug}/`,
    },
    noindex: !hasContent,
  });
}

export default async function RealisatieCategoryPage({
  params,
}: {
  params: Promise<{ category: string; locale: SupportedLocale }>;
}) {
  const { category, locale } = await params;
  const categoryDef = getRealisatieCategoryByLocalizedSlug(category, locale);
  if (!categoryDef || categoryDef.id === "applicaties") notFound();
  const stableCategory = categoryDef.id;
  const en = locale === "en";

  const isWebdesign = stableCategory === "webdesign";
  const isFotografie = stableCategory === "fotografie";
  const isVideografie = stableCategory === "videografie";
  const is3dVr = stableCategory === "3d-vr";
  const isDrone = stableCategory === "drone";
  const items = cases.filter((item) => item.category === stableCategory).flatMap((item) => { try { return [getLocalizedCaseById(item.slug, locale)]; } catch { return []; } });
  const otherCategories = realisatieCategories.filter((candidate) => candidate.slug !== stableCategory).map((candidate) => getLocalizedRealisatieCategoryById(candidate.slug, locale));

  const mappedServiceSlug = categoryToServiceSlug[stableCategory];
  const mappedService = mappedServiceSlug ? getLocalizedServiceById(mappedServiceSlug, locale).service : undefined;

  const [webdesignImages, webdesignProjects] = isWebdesign
    ? await Promise.all([getWebdesignImages(), getWebdesignProjects("nl")])
    : [null, null];
  const localizedWebdesignProjects = (webdesignProjects?.flatMap((project) => {
    try {
      const localized = getLocalizedWebdesignProject(project, locale);
      return localized ? [localized] : [];
    } catch { return []; }
  }) ?? []);
  const featured =
    localizedWebdesignProjects.find((project) => project.id === "gordijnenmyriam") ??
    localizedWebdesignProjects[0] ??
    null;
  const gridProjects =
    localizedWebdesignProjects.filter((project) => project.id !== featured?.id);

  const fotoGalleries = isFotografie && locale === "nl"
    ? (await getFotografieGalleries(locale)).filter((gallery) => gallery.images.length > 0)
    : [];
  const smugGalleries = isFotografie && locale === "nl" ? await getSmugMugGalleries() : [];
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

  const videoData = isVideografie ? (locale === "nl" ? await getVideografieVideos() : null) : null;
  const localizedTours = is3dVr ? getLocalizedMatterportTours(locale) : [];
  const localizedDrone = isDrone ? getLocalizedDroneContent(locale) : null;
  const xrStats = is3dVr
    ? [
        { value: String(localizedTours.length), label: en ? "virtual\ntours" : "virtuele\ntours" },
        { value: "360°", label: "Matterport\nscans", accent: true },
      ]
    : undefined;

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        locale={locale === "en" ? "en" : "nl"}
        items={[
          { name: "Home", path: "/" },
          { name: en ? "Case studies" : "Realisaties", path: "/realisaties" },
          { name: categoryDef.name, path: `/realisaties/${categoryDef.slug}` },
        ]}
      />

      <RealisatieHeader
        category={categoryDef}
        stats={fotoStats ?? xrStats ?? (isDrone ? localizedDrone?.stats : undefined)}
        locale={locale}
      />

      {isWebdesign && webdesignImages && featured ? (
        <>
          <RealisatieWebdesignFeatured project={featured} images={webdesignImages} locale={locale} />
          <RealisatieWebdesignGrid projects={gridProjects} images={webdesignImages} locale={locale} />
        </>
      ) : isFotografie && fotoGalleries.length > 0 ? (
        <RealisatieFotografieGalerijen galleries={fotoGalleries} />
      ) : isVideografie && videoData && videoData.videos.length > 0 ? (
        <RealisatieVideografieGalerijen
          videos={videoData.videos}
          categories={videografieCategories}
        />
      ) : isDrone ? (
        <RealisatieDroneMedia media={localizedDrone?.media ?? []} categories={localizedDrone?.categories ?? []} locale={locale} />
      ) : is3dVr ? (
        <RealisatieXrTours tours={localizedTours} />
      ) : (
        <Section orbs="tl-br">
          <Container>
            {items.length > 0 ? (
              <CaseGrid cases={items} />
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
                <h2 className="text-2xl font-bold">{en ? `${categoryDef.name} case studies` : `Realisaties rond ${categoryDef.name}`}</h2>
                <p className="max-w-xl text-white/60">
                  {en ? `${categoryDef.description} We will add documented projects, imagery and results as they become available. Planning a similar project?` : <>{categoryDef.description} We vullen deze pagina verder aan met concrete cases, beelden en resultaten. Zin om zelf zo&apos;n realisatie te laten maken?</>}
                </p>
                <Link
                  href={en ? "/request-a-quotation" : "/offerte-aanvragen"}
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-medium text-white transition-colors hover:from-red-600 hover:to-amber-600"
                >
                  {en ? "Request a quotation" : "Offerte aanvragen"}
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
          {locale === "nl" && <ServiceRelatedPosts serviceSlug={mappedService.slug} />}
          <section className="relative py-6 sm:py-8">
            <div className="container mx-auto px-2.5 sm:px-4">
              <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                <div>
                  <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
                    <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#FF9A45]" />
                    {en ? "Our service" : "Onze dienst"}
                  </p>
                  <h2 className="font-sora text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white sm:text-[28px]">
                    {en ? `Learn more about ${mappedService.title}` : `Meer weten over onze dienst ${mappedService.title}?`}
                  </h2>
                  <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-white/60">
                    {en
                      ? "Explore our approach, what we do for you and answers to frequently asked questions."
                      : "Ontdek onze aanpak, wat we voor je doen en de antwoorden op veelgestelde vragen."}
                  </p>
                </div>
                <Link
                  href={`${serviceHref(mappedService)}/`}
                  className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white sm:self-center"
                >
                  {en ? "Explore the service" : "Bekijk de dienst"}
                  <ArrowRight className="h-[15px] w-[15px]" />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      <Section orbs="tr-bl">
        <Container>
          <h2 className="mb-6 text-2xl font-bold">{en ? "Other categories" : "Andere categorieën"}</h2>
          <RealisatieCategoryGrid items={otherCategories} locale={locale} />
        </Container>
      </Section>
    </div>
  );
}
