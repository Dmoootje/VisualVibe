import type { Metadata } from "next";
import "@/components/media-patterns.css";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Container,
  Section,
} from "@/components/ui";
import { CTASection, ProcessSteps } from "@/components/sections";
import { ServiceRelatedPosts } from "@/components/sections/ServiceRelatedPosts";
import {
  SubdienstHero,
  SubserviceDeliverables,
  SubserviceIdealFor,
  SubserviceOutcomeCards,
  SubserviceOverview,
  SubservicePricing,
  SubserviceRealisations,
  SubserviceRegions,
  SubserviceWhyVisualVibe,
} from "@/components/subdienst";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";
import { subservices, getSubservicesByParent } from "@/data/subservices";
import { getSubserviceEditorial } from "@/data/subservice-content";
import {
  getLocalizedServiceById,
  getServiceByLocalizedSlug,
  getServiceBySlug,
  serviceHref,
} from "@/data/services";
import { regions } from "@/data/regions";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/posts";
import { getHubData } from "@/lib/realisaties/hubData";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import type { SupportedLocale } from "@/i18n/locales";

const REALISATION_ELIGIBLE_SLUGS = new Set([
  "website-laten-maken",
  "seo-website-laten-maken",
  "lokale-seo",
  "ai-seo-aeo-geo",
  "bedrijfsfotografie",
  "zakelijke-portretten",
  "productfotografie",
  "eventfotografie",
  "vastgoedfotografie",
  "realisatiefotografie",
  "brandingfotografie",
  "bedrijfsvideo",
  "promovideo",
  "social-media-video",
  "event-aftermovie",
  "wervingsvideo",
  "testimonial-video",
  "podcast-video",
  "nieuwsreportage",
  "dronefotografie",
  "dronevideo",
  "fpv-video",
  "vastgoed-dronebeelden",
  "realisatie-dronebeelden",
  "event-dronebeelden",
]);

export const revalidate = 3600;

export function generateStaticParams() {
  return subservices
    .filter((service) => service.parentSlug)
    .map((service) => ({ slug: service.parentSlug as string, sub: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SupportedLocale; slug: string; sub: string }>;
}): Promise<Metadata> {
  const { locale, slug, sub } = await params;
  let localizedService;
  let localizedParent;
  try {
    localizedService = getServiceByLocalizedSlug(sub, locale);
    localizedParent = getServiceByLocalizedSlug(slug, locale);
  } catch {
    return {};
  }
  const sourceService = getLocalizedServiceById(localizedService.id, "nl").service;
  const sourceParent = getLocalizedServiceById(localizedParent.id, "nl").service;
  if (sourceParent.parentSlug || sourceService.parentSlug !== localizedParent.id) return {};

  const service = localizedService.service;
  const editorial = locale === "nl" ? getSubserviceEditorial(localizedService.id) : undefined;
  const seo = editorial?.seo ?? service.seo;
  const dutchService = getLocalizedServiceById(localizedService.id, "nl").service;
  const englishService = getLocalizedServiceById(localizedService.id, "en").service;

  return pageMetadata({
    locale,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    path: `${serviceHref(service)}/`,
    languagePaths: {
      nl: `${serviceHref(dutchService)}/`,
      en: `${serviceHref(englishService)}/`,
    },
    ogImage: seo.ogImage,
  });
}

export default async function SubServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const service = getServiceBySlug(sub);
  const parentService = getServiceBySlug(slug);

  if (!service || !parentService || parentService.parentSlug || service.parentSlug !== slug) {
    notFound();
  }

  const editorial = getSubserviceEditorial(service.slug);
  const content = editorial?.content;
  const intro = editorial?.intro ?? service.intro;
  const excerpt = editorial?.excerpt ?? service.excerpt;
  const faqs = editorial?.faqs ?? service.faqs;
  const process = editorial?.process ?? service.process;
  const relatedServiceSlugs = editorial?.relatedServices ?? service.relatedServices;

  const relatedServices = relatedServiceSlugs
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  const regionalSlugs = content?.regional?.regionSlugs;
  const relatedRegions = regionalSlugs?.length
    ? regionalSlugs
        .map((regionSlug) => regions.find((region) => region.slug === regionSlug))
        .filter((region): region is NonNullable<typeof region> => Boolean(region))
    : regions;

  const hasPrimaryContent = Boolean(
    content?.overview || content?.outcomes || content?.idealFor || content?.deliverables,
  );

  const realisationProjects = REALISATION_ELIGIBLE_SLUGS.has(service.slug)
    ? (await getHubData()).projects.filter((project) => project.serviceSlugs.includes(service.slug)).slice(0, 3)
    : [];

  const servicePath = `${serviceHref(service)}/`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Diensten", path: "/diensten" },
    { name: parentService.title, path: serviceHref(parentService) },
    { name: service.title, path: servicePath },
  ];

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        service={{
          name: service.title,
          description: excerpt,
          url: `${businessConfig.url}${localizedPath("nl", servicePath)}`,
          areaServed: relatedRegions.map((region) => region.title),
        }}
      />
      {faqs.length > 0 && <FaqPageJsonLd items={faqs} />}

      <SubdienstHero
        pillar={parentService.title}
        pillarHref={serviceHref(parentService)}
        pillarSlug={parentService.slug}
        hero={{
          slug: service.slug,
          name: service.title,
          category: service.category,
          desc: intro,
        }}
        siblings={getSubservicesByParent(parentService.slug)
          .filter((sibling) => sibling.slug !== service.slug)
          .map((sibling) => ({
            slug: sibling.slug,
            name: sibling.title,
            category: sibling.category,
          }))}
      />

      {hasPrimaryContent ? (
        <>
          {content?.overview && <SubserviceOverview content={content.overview} />}
          {content?.outcomes && <SubserviceOutcomeCards content={content.outcomes} />}
          {content?.idealFor && <SubserviceIdealFor content={content.idealFor} />}
          {content?.deliverables && <SubserviceDeliverables content={content.deliverables} />}
        </>
      ) : (
        service.benefits.length > 0 && (
          <Section className="px-0">
            <Container>
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Wat we voor je doen</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-white/80">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        )
      )}

      {process.length > 0 && (
        <Section className="px-0">
          <Container>
            <h2 className="mb-6 font-sora text-2xl font-extrabold sm:text-3xl">Hoe VisualVibe te werk gaat</h2>
            <ProcessSteps steps={process} />
          </Container>
        </Section>
      )}

      {content?.pricing && <SubservicePricing content={content.pricing} />}
      {content?.whyVisualVibe && <SubserviceWhyVisualVibe content={content.whyVisualVibe} />}

      <SubserviceRealisations projects={realisationProjects} serviceTitle={service.title} />

      {faqs.length > 0 && (
        <Section className="px-0">
          <Container className="max-w-4xl">
            <h2 className="mb-6 font-sora text-2xl font-extrabold sm:text-3xl">Veelgestelde vragen</h2>
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-white/70">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </Section>
      )}

      {relatedServices.length > 0 && (
        <Section className="px-0">
          <Container>
            <h2 className="mb-6 font-sora text-2xl font-extrabold sm:text-3xl">Gerelateerde diensten</h2>
            <ul className="flex flex-wrap gap-3">
              {relatedServices.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={serviceHref(related)}
                    className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:border-amber-400/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <ServiceRelatedPosts
        serviceSlug={service.slug}
        fallbackServiceSlug={parentService.slug}
        intro="Praktische artikels met keuzes en voorbereiding die rechtstreeks bij deze dienst aansluiten."
      />

      {content?.regional ? (
        <SubserviceRegions content={content.regional} regions={relatedRegions} />
      ) : (
        <SubserviceRegions
          content={{
            title: "Actief in deze regio's",
            description:
              "Vanuit Limburg werkt VisualVibe voor zelfstandigen en KMO's in Vlaanderen, Antwerpen en Nederlands-Limburg.",
            regionSlugs: regions.map((region) => region.slug),
          }}
          regions={relatedRegions}
        />
      )}

      <CTASection
        title={content?.cta?.title ?? `Interesse in ${service.title}?`}
        description={
          content?.cta?.description ??
          "Vertel ons wat je nodig hebt. Na een inhoudelijke analyse ontvang je een voorstel dat bij je project past."
        }
        primaryLabel={content?.cta?.label}
        primaryHref={content?.cta?.href}
        variant={0}
        className="px-0"
      />
    </div>
  );
}
