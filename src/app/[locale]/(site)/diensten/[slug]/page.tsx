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
import { allServices, services, getServiceBySlug, serviceHref } from "@/data/services";
import { regions } from "@/data/regions";
import { getRealisatieCategoryBySlug, serviceToCategorySlug } from "@/data/realisatieCategories";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { isBlogLocale, localizedPath } from "@/lib/kennisbank/posts";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { getVideografieVideos } from "@/lib/youtube";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";
import type { SupportedLocale } from "@/i18n/locales";

export function generateStaticParams() {
  // Flat route serves hoofddiensten only; sub-services live at /diensten/<parent>/<sub>.
  return services.map((service) => ({ slug: service.slug }));
}

// ISR so admin-managed Webdesign showcase images propagate without a rebuild.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    path: `${serviceHref(service)}/`,
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
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // A sub-service reached via its old flat URL: 308 straight to the final
  // localized nested URL (prefix + trailing slash) so there is exactly one hop.
  if (service.parentSlug) {
    permanentRedirect(localizedPath(isBlogLocale(locale) ? locale : "nl", `${serviceHref(service)}/`));
  }

  const relatedServices = service.relatedServices
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  const parentService = service.parentSlug ? getServiceBySlug(service.parentSlug) : undefined;
  const childServices = allServices.filter((s) => s.parentSlug === service.slug);

  // Realisatie-categorie bij deze dienst (indien die bestaat): voedt de
  // cross-link "Bekijk onze <naam>-realisaties" onder de kennisbank-sectie.
  const realisatieCategorySlug = serviceToCategorySlug[service.slug];
  const realisatieCategory = realisatieCategorySlug
    ? getRealisatieCategoryBySlug(realisatieCategorySlug)
    : undefined;

  // Webdesign and SEO lead with a bespoke animated hero + realisatie showcase
  // (admin-managed images/projects); their regular content follows below.
  const isWebdesign = service.slug === "webdesign";
  const isSeo = service.slug === "seo";
  const isFotografie = service.slug === "fotografie";
  const isVideografie = service.slug === "videografie";
  const isDrone = service.slug === "drone-fpv";
  const is3dVrAr = service.slug === "3d-vr-ar";
  const [webdesignImages, webdesignProjects] =
    isWebdesign || isSeo
      ? await Promise.all([getWebdesignImages(), getWebdesignProjects(locale)])
      : [null, null];

  // Videografie: YouTube-fed video gallery (playlists -> filter tabs).
  const videoData = isVideografie ? await getVideografieVideos() : null;

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
  const kennisbankSection = <ServiceRelatedPosts serviceSlug={service.slug} />;

  const realisatieLinkSection = realisatieCategory ? (
    <Section orbs="tl-br">
      <Container>
        <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Bekijk onze {service.title.toLowerCase()}-realisaties
            </h2>
            <p className="mt-2 max-w-xl text-white/60">{realisatieCategory.description}</p>
          </div>
          <Link
            href={`/realisaties/${realisatieCategory.slug}/`}
            className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white sm:self-center"
          >
            Bekijk de realisaties
            <ArrowRight className="h-[15px] w-[15px]" />
          </Link>
        </div>
      </Container>
    </Section>
  ) : null;

  const regioSection = (
    <Section orbs="tr-bl">
      <Container>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Actief in deze regio&apos;s</h2>
        <p className="mb-6 max-w-2xl text-white/60">
          Vanuit onze thuisbasis in Limburg werken we voor bedrijven in heel Vlaanderen, Antwerpen
          en Nederlands-Limburg.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <RegionMapCard key={region.slug} region={region} />
          ))}
        </div>
      </Container>
    </Section>
  );

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Diensten", path: "/diensten" },
    ...(parentService ? [{ name: parentService.title, path: `/diensten/${parentService.slug}` }] : []),
    { name: service.title, path: `/diensten/${service.slug}` },
  ];

  const jsonLd = (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        service={{
          name: service.title,
          description: service.excerpt,
          url: `${businessConfig.url}${localizedPath("nl", `${serviceHref(service)}/`)}`,
        }}
      />
      {service.faqs.length > 0 && <FaqPageJsonLd items={service.faqs} />}
    </>
  );

  // SEO leads with a fully bespoke, SEO-optimized page (continuous background,
  // animated hero + realisaties, subdiensten cards, sector pills, FAQ).
  if (isSeo && webdesignImages) {
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
  if (isFotografie) {
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
  if (isVideografie && videoData) {
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
  if (isDrone) {
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
  if (is3dVrAr) {
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

      {isWebdesign && webdesignImages && webdesignProjects ? (
        <>
          <WebdesignHero heroImage={webdesignImages.hero} />
          <WebdesignShowcase projects={webdesignProjects} images={webdesignImages} />
        </>
      ) : (
        <PageHero title={service.title} subtitle={service.intro} />
      )}

      {isWebdesign ? (
        <Section orbs="tl-br">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">{service.title} diensten overzicht</h2>
            <SubdienstenGrid services={webdesignSubdiensten} />
          </Container>
        </Section>
      ) : childServices.length > 0 ? (
        <Section orbs="tl-br">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">{service.title} diensten overzicht</h2>
            <ServiceGrid services={childServices} />
          </Container>
        </Section>
      ) : (
        service.benefits.length > 0 && (
          <Section orbs="tl-br">
            <Container>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Wat we voor je doen</h2>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Hoe we werken</h2>
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
        combineWith={service.title}
        relatedServices={relatedServices}
      />

      <CTASection
        title={`Interesse in ${service.title.toLowerCase()}?`}
        description="Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
      />
    </div>
  );
}
