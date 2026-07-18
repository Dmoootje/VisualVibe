import type { Metadata } from "next";
import "@/components/media-patterns.css";
import { notFound, permanentRedirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Section, Container } from "@/components/ui";
import {
  PageHero,
  CTASection,
  ServiceGrid,
  ProcessSteps,
  ServiceFaqCombine,
} from "@/components/sections";
import { ServiceRelatedPosts } from "@/components/sections/ServiceRelatedPosts";
import { RegionMapCard } from "@/features/home/RegionIntro/components";
import { WebdesignHero, WebdesignShowcase } from "@/components/webdesign";
import { SeoService, type SeoCaseItem } from "@/components/seodienst";
import { FotografieService } from "@/components/fotografie";
import { VideografieService } from "@/components/videografie";
import { DroneFpvService } from "@/components/drone";
import { XrService } from "@/components/xr";
import { SubdienstenGrid } from "@/components/subdiensten";
import { webdesignSubdiensten } from "@/data/webdesignSubdiensten";
import { seoCases } from "@/data/seoShowcase";
import {
  allServices,
  services,
  getLocalizedServiceById,
  getServiceByLocalizedSlug,
  serviceHref,
} from "@/data/services";
import { englishServiceEditorial } from "@/data/locales/en/services";
import { getLocalizedRegionById, regions } from "@/data/regions";
import {
  getLocalizedRealisatieCategoryById,
  serviceToCategorySlug,
} from "@/data/realisatieCategories";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { localizedPath } from "@/lib/kennisbank/posts";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { getVideografieVideos } from "@/lib/youtube";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";
import { getPublishedLocales, type SupportedLocale } from "@/i18n/locales";

export function generateStaticParams() {
  // Flat route serves hoofddiensten only; sub-services live at /diensten/<parent>/<sub>.
  return getPublishedLocales().flatMap((locale) =>
    services.map((service) => ({
      locale,
      slug: getLocalizedServiceById(service.slug, locale).slug,
    })),
  );
}

// ISR so admin-managed Webdesign showcase images propagate without a rebuild.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SupportedLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  let localizedService;
  try {
    localizedService = getServiceByLocalizedSlug(slug, locale);
  } catch {
    return {};
  }
  const service = localizedService.service;
  const dutchService = getLocalizedServiceById(localizedService.id, "nl").service;
  const englishService = getLocalizedServiceById(localizedService.id, "en").service;

  return pageMetadata({
    locale,
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    path: `${serviceHref(service)}/`,
    languagePaths: {
      nl: `${serviceHref(dutchService)}/`,
      en: `${serviceHref(englishService)}/`,
    },
    ogImage: service.seo.ogImage,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as SupportedLocale;
  if (locale !== "nl" && locale !== "en") notFound();
  let localizedService;
  try {
    localizedService = getServiceByLocalizedSlug(slug, locale);
  } catch {
    notFound();
  }
  const service = localizedService.service;
  const sourceService = getLocalizedServiceById(localizedService.id, "nl").service;
  const en = locale === "en";

  // A sub-service reached via its old flat URL: 308 straight to the final
  // localized nested URL (prefix + trailing slash) so there is exactly one hop.
  if (sourceService.parentSlug) {
    permanentRedirect(localizedPath(locale, `${serviceHref(service)}/`));
  }

  const relatedServices = sourceService.relatedServices.flatMap((relatedId) => {
    try {
      return [getLocalizedServiceById(relatedId, locale).service];
    } catch {
      return [];
    }
  });

  const parentService = sourceService.parentSlug
    ? getLocalizedServiceById(sourceService.parentSlug, locale).service
    : undefined;
  const childServices = allServices
    .filter((candidate) => candidate.parentSlug === sourceService.slug)
    .map((candidate) => getLocalizedServiceById(candidate.slug, locale).service);
  const localizedRegions = regions.map((region) =>
    getLocalizedRegionById(region.slug, locale),
  );
  const englishContent = en ? englishServiceEditorial[localizedService.id] : undefined;

  // Realisatie-categorie bij deze dienst (indien die bestaat): voedt de
  // cross-link "Bekijk onze <naam>-realisaties" onder de kennisbank-sectie.
  const realisatieCategorySlug = serviceToCategorySlug[sourceService.slug];
  const realisatieCategory = realisatieCategorySlug
    ? getLocalizedRealisatieCategoryById(realisatieCategorySlug, locale)
    : undefined;

  // Webdesign and SEO lead with a bespoke animated hero + realisatie showcase
  // (admin-managed images/projects); their regular content follows below.
  const isWebdesign = sourceService.slug === "webdesign";
  const isSeo = sourceService.slug === "seo";
  const isFotografie = sourceService.slug === "fotografie";
  const isVideografie = sourceService.slug === "videografie";
  const isDrone = sourceService.slug === "drone-fpv";
  const is3dVrAr = sourceService.slug === "3d-vr-ar";
  const [webdesignImages, webdesignProjects] =
    !en && (isWebdesign || isSeo)
      ? await Promise.all([getWebdesignImages(), getWebdesignProjects(locale)])
      : [null, null];

  // Videografie: YouTube-fed video gallery (playlists -> filter tabs).
  const videoData = !en && isVideografie ? await getVideografieVideos() : null;

  // SEO cases = the SEO/GEO-tagged webdesign projects, in configured order.
  const seoItems: SeoCaseItem[] =
    isSeo && webdesignProjects
      ? seoCases
          .map((sc) => {
            const project = webdesignProjects.find((p) => p.id === sc.id);
            return project ? { project, badge: sc.badge, tags: sc.tags, teaser: sc.teaser } : null;
          })
          .filter((it): it is SeoCaseItem => it !== null)
      : [];

  // Gedeelde cross-link-secties (kennisbank, realisaties, regio's) conform de
  // interne-link-regels: elke dienstpagina rendert ze, ook de bespoke varianten.
  const kennisbankSection = en ? null : (
    <ServiceRelatedPosts serviceSlug={sourceService.slug} />
  );

  const realisatieLinkSection = realisatieCategory ? (
    <Section orbs="tl-br">
      <Container>
        <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {en
                ? `View our ${service.title.toLowerCase()} case studies`
                : `Bekijk onze ${service.title.toLowerCase()}-realisaties`}
            </h2>
            <p className="mt-2 max-w-xl text-white/60">{realisatieCategory.description}</p>
          </div>
          <Link
            href={`/realisaties/${realisatieCategory.slug}/`}
            className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white sm:self-center"
          >
            {en ? "View case studies" : "Bekijk de realisaties"}
            <ArrowRight className="h-[15px] w-[15px]" />
          </Link>
        </div>
      </Container>
    </Section>
  ) : null;

  const regioSection = (
    <Section orbs="tr-bl">
      <Container>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          {en ? "Active in these regions" : <>Actief in deze regio&apos;s</>}
        </h2>
        <p className="mb-6 max-w-2xl text-white/60">
          {en
            ? "From our base in Limburg, Belgium, we work with businesses across Flanders, Antwerp province and Dutch Limburg."
            : "Vanuit onze thuisbasis in Limburg werken we voor bedrijven in heel Vlaanderen, Antwerpen en Nederlands-Limburg."}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {localizedRegions.map((region) => (
            <RegionMapCard key={region.slug} region={region} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: en ? "Services" : "Diensten", path: "/diensten" },
    ...(parentService
      ? [{ name: parentService.title, path: serviceHref(parentService) }]
      : []),
    { name: service.title, path: serviceHref(service) },
  ];

  const jsonLd = (
    <>
      <BreadcrumbJsonLd locale={locale} items={breadcrumbItems} />
      <ServiceJsonLd
        locale={locale}
        service={{
          name: service.title,
          description: service.excerpt,
          url: `${businessConfig.url}${localizedPath(locale, `${serviceHref(service)}/`)}`,
        }}
      />
      {service.faqs.length > 0 && <FaqPageJsonLd items={service.faqs} />}
    </>
  );

  // SEO leads with a fully bespoke, SEO-optimized page (continuous background,
  // animated hero + realisaties, subdiensten cards, sector pills, FAQ).
  if (!en && isSeo && webdesignImages) {
    return (
      <div className="min-h-screen text-white">
        {jsonLd}
        <SeoService
          service={service}
          seoItems={seoItems}
          images={webdesignImages}
          relatedServices={relatedServices}
          crossLinks={
            <>
              {realisatieLinkSection}
              {regioSection}
            </>
          }
        />
      </div>
    );
  }

  // Fotografie leads with the cinematic viewfinder hero + gallery lightbox.
  if (!en && isFotografie) {
    return (
      <div className="min-h-screen text-white">
        {jsonLd}
        <FotografieService
          service={service}
          relatedServices={relatedServices}
          crossLinks={
            <>
              {kennisbankSection}
              {realisatieLinkSection}
              {regioSection}
            </>
          }
        />
      </div>
    );
  }

  // Videografie leads with the video-player hero + YouTube gallery lightbox.
  if (!en && isVideografie && videoData) {
    return (
      <div className="min-h-screen text-white">
        {jsonLd}
        <VideografieService
          service={service}
          subServices={childServices}
          relatedServices={relatedServices}
          videos={videoData.videos}
          filters={videoData.filters}
          crossLinks={
            <>
              {realisatieLinkSection}
              {regioSection}
            </>
          }
        />
      </div>
    );
  }

  // Drone & FPV leads with the quadcopter/FPV hero + drone realisaties split.
  if (!en && isDrone) {
    return (
      <div className="min-h-screen text-white">
        {jsonLd}
        <DroneFpvService
          locale={locale}
          service={service}
          subServices={childServices}
          relatedServices={relatedServices}
          crossLinks={
            <>
              {kennisbankSection}
              {realisatieLinkSection}
              {regioSection}
            </>
          }
        />
      </div>
    );
  }

  // 3D, VR & AR leads with the immersive cursor-driven 3D hero, video showreel,
  // and the two most recent Matterport tours embedded live in-page.
  if (!en && is3dVrAr) {
    return (
      <div className="min-h-screen text-white">
        {jsonLd}
        <XrService
          service={service}
          relatedServices={relatedServices}
          crossLinks={
            <>
              {kennisbankSection}
              {realisatieLinkSection}
              {regioSection}
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {jsonLd}

      {!en && isWebdesign && webdesignImages && webdesignProjects ? (
        <>
          <WebdesignHero heroImage={webdesignImages.hero} />
          <WebdesignShowcase projects={webdesignProjects} images={webdesignImages} />
        </>
      ) : (
        <PageHero title={service.title} subtitle={service.intro} />
      )}

      {!en && isWebdesign ? (
        <Section orbs="tl-br">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">{service.title} diensten overzicht</h2>
            <SubdienstenGrid services={webdesignSubdiensten} />
          </Container>
        </Section>
      ) : childServices.length > 0 ? (
        <Section orbs="tl-br">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              {en ? "Service overview" : `${service.title} diensten overzicht`}
            </h2>
            <ServiceGrid services={childServices} />
          </Container>
        </Section>
      ) : (
        service.benefits.length > 0 && (
          <Section orbs="tl-br">
            <Container>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                {en ? "What we do" : "Wat we voor je doen"}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-white/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        )
      )}

      {service.process.length > 0 && (
        <Section orbs="tr-bl">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              {en ? "How we work" : "Hoe we werken"}
            </h2>
            <ProcessSteps steps={service.process} />
          </Container>
        </Section>
      )}

      {/* Uit de kennisbank: gerelateerde artikels (interne links + GEO). */}
      {kennisbankSection}

      {/* Cross-link naar de realisaties van deze dienst. */}
      {realisatieLinkSection}

      {/* Regio-links: dienst naar regio-hubs, conform de interne-link-regels. */}
      {regioSection}

      {/* Veelgestelde vragen (links) + Combineer <dienst> met (rechts). */}
      <ServiceFaqCombine
        faqs={service.faqs}
        faqHeading={en ? "Frequently asked questions" : undefined}
        combineWith={service.title}
        combineEyebrow={en ? "More services" : undefined}
        combineHeading={en ? `Combine ${service.title} with` : undefined}
        relatedServices={relatedServices}
      />

      <CTASection
        title={englishContent?.cta.title ?? `Interesse in ${service.title.toLowerCase()}?`}
        description={
          englishContent?.cta.description ??
          "Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
        }
        primaryLabel={englishContent?.cta.label}
        primaryHref={englishContent?.cta.href.replace(/^\/en(?=\/)/u, "")}
      />
    </div>
  );
}
