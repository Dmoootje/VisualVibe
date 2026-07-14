import type { Metadata } from "next";
import "@/components/media-patterns.css";
import { notFound } from "next/navigation";
import { sectors, getSectorBySlug } from "@/data/sectors";
import { getServiceBySlug, serviceHref } from "@/data/services";
import { getRegionBySlug } from "@/data/regions";
import { droneMedia } from "@/config/drone.config";
import { getAllPosts, localizedPath } from "@/lib/kennisbank/posts";
import { scoreSectorPosts } from "@/lib/kennisbank/relatedPosts";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { getVideografieVideos } from "@/lib/youtube";
import {
  selectSectorWebdesignProjects,
  selectSectorGalleries,
  selectSectorVideos,
} from "@/lib/sectors/selectSectorContent";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, ServiceJsonLd, FaqPageJsonLd, JsonLd } from "@/components/seo";
import { CTASection } from "@/components/sections";
import {
  SectorDetailHero,
  SectorMarquee,
  SectorAnswerIntro,
  SectorChallenges,
  SectorServices,
  SectorCases,
  SectorRealisations,
  SectorMediaProjects,
  SectorProcess,
  SectorProof,
  SectorLocal,
  SectorFaq,
  SectorKnowledge,
} from "@/components/sectors";
import type { Region } from "@/types";

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

// Cases en galerijen zijn Firestore-content (admin-beheerd): net als op de
// realisaties-pagina's revalideren we periodiek zodat admin-wijzigingen
// (sector-tags, nieuwe projecten) zonder rebuild doorstromen.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  if (!sector) {
    return {};
  }

  return pageMetadata({
    title: sector.seo.title,
    description: sector.seo.description,
    keywords: sector.seo.keywords,
    path: `/sectoren/${sector.slug}/`,
  });
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  if (!sector) {
    notFound();
  }

  // Echte content: Firestore-projecten/galerijen (met seed-fallback) + YouTube.
  const [projects, images, galleries, videoData] = await Promise.all([
    getWebdesignProjects(),
    getWebdesignImages(),
    getFotografieGalleries(),
    getVideografieVideos(),
  ]);

  const recommendedServices = sector.recommendedServices
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  // Selectie: curated featured ids eerst, dan admin-getagde content; niets
  // wordt aangevuld - lege selecties verbergen hun sectie.
  const featuredProjects = selectSectorWebdesignProjects(sector, projects, images);
  const featuredGalleries = selectSectorGalleries(sector, galleries);
  const featuredVideos = selectSectorVideos(sector, videoData.videos, droneMedia);

  // Kennisbank: relevantiescore (geen nieuwste-3-fallback meer). Max 3 zodat
  // de homepage-kaartstijl netjes 1 rij van 3 vult.
  const kennisbankPosts = scoreSectorPosts(getAllPosts({ locale: "nl" }), sector, { max: 3 });

  const localRegions = (sector.localSection?.regionSlugs ?? [])
    .map((regionSlug) => getRegionBySlug(regionSlug))
    .filter((region): region is Region => Boolean(region));

  // ItemList alleen voor zichtbare projecten met een echte live-URL.
  const listedProjects = featuredProjects.filter((project) => project.url);

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Sectoren", path: "/sectoren" },
          { name: sector.title, path: `/sectoren/${sector.slug}` },
        ]}
      />
      {recommendedServices.map((service) => (
        <ServiceJsonLd
          key={service.slug}
          service={{
            name: service.title,
            description: service.excerpt,
            url: `${businessConfig.url}${localizedPath("nl", `${serviceHref(service)}/`)}`,
            areaServed: ["Limburg"],
          }}
        />
      ))}
      {/* Zelfde array als de zichtbare SectorFaq, dus schema == pagina. */}
      <FaqPageJsonLd items={sector.faq ?? []} />
      {listedProjects.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: sector.casesTitle ?? `Webdesignprojecten - ${sector.title}`,
            numberOfItems: listedProjects.length,
            itemListElement: listedProjects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.name,
              url: project.url,
            })),
          }}
        />
      )}

      <SectorDetailHero sector={sector} />

      {/* Andere sectoren marquee. Pulled up on desktop so it tucks into the
          space the large hero emblem leaves below it. */}
      <div className="relative z-10 border-t border-white/[0.08] pb-4 pt-7 md:-mt-[200px]">
        <div className="container mx-auto px-2.5 sm:px-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
            Andere sectoren
          </p>
        </div>
        {/* Full-bleed: the two rows run edge to edge, only the label stays aligned. */}
        <SectorMarquee exclude={sector.slug} />
      </div>

      {sector.answerIntro && <SectorAnswerIntro answer={sector.answerIntro} />}

      <SectorChallenges
        intro={sector.challengesIntro}
        expanded={sector.painPointsExpanded}
        simple={sector.painPoints}
      />

      <SectorServices
        title={sector.servicesTitle}
        intro={sector.servicesIntro}
        services={recommendedServices}
      />

      <SectorCases
        title={sector.casesTitle}
        intro={sector.casesIntro}
        projects={featuredProjects}
        images={images}
      />

      <SectorRealisations
        title={sector.realisationsTitle}
        intro={sector.realisationsIntro}
        galleries={featuredGalleries}
      />

      <SectorMediaProjects
        title={sector.mediaTitle}
        intro={sector.mediaIntro}
        videos={featuredVideos}
      />

      {sector.processSteps && sector.processSteps.length > 0 && (
        <SectorProcess title={sector.processTitle} steps={sector.processSteps} />
      )}

      {sector.proofPoints && sector.proofPoints.length > 0 && (
        <SectorProof title={sector.proofTitle} points={sector.proofPoints} />
      )}

      {sector.localSection && localRegions.length > 0 && (
        <SectorLocal local={sector.localSection} regions={localRegions} />
      )}

      {sector.faq && sector.faq.length > 0 && <SectorFaq items={sector.faq} />}

      <SectorKnowledge posts={kennisbankPosts} />

      <CTASection
        title={sector.ctaTitle ?? `Actief in ${sector.title.toLowerCase()}? Laten we kennismaken.`}
        description={sector.ctaText}
      />
    </div>
  );
}
