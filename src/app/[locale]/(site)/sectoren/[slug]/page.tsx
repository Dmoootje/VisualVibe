import type { Metadata } from "next";
import "@/components/media-patterns.css";
import { notFound } from "next/navigation";
import { sectors, getLocalizedSectorById, getSectorByLocalizedSlug } from "@/data/sectors";
import { getLocalizedServiceById, serviceHref } from "@/data/services";
import { getLocalizedRegionById } from "@/data/regions";
import { droneMedia } from "@/config/drone.config";
import { getAllPosts, localizedPath } from "@/lib/kennisbank/posts";
import { scoreSectorPosts } from "@/lib/kennisbank/relatedPosts";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getFotografieGalleries } from "@/lib/firestore/fotografieGalleries";
import { getAuthorPhotoMap } from "@/lib/firestore/profiles";
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
import { getPublishedLocales } from "@/i18n/locales";
import { englishSectorEditorial } from "@/data/locales/en/sectors";
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
  SectorIconSprite,
} from "@/components/sectors";
type SectorLocale = "nl" | "en";

export function generateStaticParams() {
  return getPublishedLocales().flatMap((locale) =>
    sectors.map((sector) => ({ locale, slug: getLocalizedSectorById(sector.slug, locale).slug })),
  );
}

// Cases en galerijen zijn Firestore-content (admin-beheerd): net als op de
// realisaties-pagina's revalideren we periodiek zodat admin-wijzigingen
// (sector-tags, nieuwe projecten) zonder rebuild doorstromen.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SectorLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  let sector;
  try { sector = getSectorByLocalizedSlug(slug, locale); } catch { return {}; }
  const dutchSector = getLocalizedSectorById(sector.id, "nl");
  const englishSector = getLocalizedSectorById(sector.id, "en");

  return pageMetadata({
    locale,
    title: sector.seo.title,
    description: sector.seo.description,
    keywords: sector.seo.keywords,
    path: `/sectoren/${sector.slug}/`,
    languagePaths: {
      nl: `/sectoren/${dutchSector.slug}/`,
      en: `/sectoren/${englishSector.slug}/`,
    },
  });
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ locale: SectorLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const en = locale === "en";
  let sector;
  try { sector = getSectorByLocalizedSlug(slug, locale); } catch { notFound(); }
  const localizedSectors = sectors.map((item) => getLocalizedSectorById(item.slug, locale));

  // Echte content: Firestore-projecten/galerijen (met seed-fallback) + YouTube.
  const projects = en ? [] : await getWebdesignProjects();
  const images = en ? {} : await getWebdesignImages();
  const galleries = en ? [] : await getFotografieGalleries();
  const videoData = en ? { videos: [] } : await getVideografieVideos();
  const authorImages = en ? {} : await getAuthorPhotoMap();

  const recommendedServices = sector.recommendedServices
    .map((serviceId) => getLocalizedServiceById(serviceId, locale).service);

  // Selectie: curated featured ids eerst, dan admin-getagde content; niets
  // wordt aangevuld - lege selecties verbergen hun sectie.
  const featuredProjects = en ? [] : selectSectorWebdesignProjects(sector, projects, images);
  const featuredGalleries = en ? [] : selectSectorGalleries(sector, galleries);
  const featuredVideos = en ? [] : selectSectorVideos(sector, videoData.videos, droneMedia);

  // Kennisbank: relevantiescore (geen nieuwste-3-fallback meer). Max 3 zodat
  // de homepage-kaartstijl netjes 1 rij van 3 vult.
  const kennisbankPosts = scoreSectorPosts(getAllPosts({ locale }), sector, { max: 3 });

  const localRegions = (sector.localSection?.regionSlugs ?? [])
    .map((regionId) => getLocalizedRegionById(regionId, locale));

  // ItemList alleen voor zichtbare projecten met een echte live-URL.
  const listedProjects = featuredProjects.filter((project) => project.url);

  return (
    <div className="min-h-screen text-white">
      <SectorIconSprite />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: "Home", path: "/" },
          { name: en ? "Industries" : "Sectoren", path: "/sectoren" },
          { name: sector.title, path: `/sectoren/${sector.slug}` },
        ]}
      />
      {recommendedServices.map((service) => (
        <ServiceJsonLd
          key={service.slug}
          locale={locale}
          service={{
            name: service.title,
            description: service.excerpt,
            url: `${businessConfig.url}${localizedPath(locale, `${serviceHref(service)}/`)}`,
            areaServed: [en ? "Limburg, Belgium" : "Limburg"],
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

      <SectorDetailHero sector={sector} locale={locale} />

      {/* Andere sectoren marquee. Pulled up on desktop so it tucks into the
          space the large hero emblem leaves below it. */}
      <div className="relative z-10 border-t border-white/[0.08] pb-4 pt-7 md:-mt-[200px]">
        <div className="container mx-auto px-2.5 sm:px-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
            {en ? "Other industries" : "Andere sectoren"}
          </p>
        </div>
        {/* Full-bleed: the two rows run edge to edge, only the label stays aligned. */}
        <SectorMarquee exclude={sector.slug} items={localizedSectors} />
      </div>

      {sector.answerIntro && <SectorAnswerIntro answer={sector.answerIntro} />}

      <SectorChallenges
        intro={sector.challengesIntro}
        expanded={sector.painPointsExpanded}
        simple={sector.painPoints}
        locale={en ? "en" : "nl"}
      />

      <SectorServices
        title={sector.servicesTitle}
        intro={sector.servicesIntro}
        services={recommendedServices}
        locale={en ? "en" : "nl"}
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
        <SectorProcess title={sector.processTitle} steps={sector.processSteps} locale={en ? "en" : "nl"} />
      )}

      {sector.proofPoints && sector.proofPoints.length > 0 && (
        <SectorProof title={sector.proofTitle} points={sector.proofPoints} locale={en ? "en" : "nl"} />
      )}

      {sector.localSection && localRegions.length > 0 && (
        <SectorLocal local={sector.localSection} regions={localRegions} locale={en ? "en" : "nl"} />
      )}

      {sector.faq && sector.faq.length > 0 && <SectorFaq items={sector.faq} locale={en ? "en" : "nl"} />}

      <SectorKnowledge posts={kennisbankPosts} authorImages={authorImages} locale={locale} />

      <CTASection
        title={sector.ctaTitle ?? (en ? `Working in ${sector.title.toLowerCase()}? Let's talk.` : `Actief in ${sector.title.toLowerCase()}? Laten we kennismaken.`)}
        description={sector.ctaText}
        primaryHref={en ? englishSectorEditorial[sector.id].cta.href : "/offerte-aanvragen"}
        primaryLabel={en ? "Request a quotation" : undefined}
      />
    </div>
  );
}
