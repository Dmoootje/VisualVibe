import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Section,
  Container,
} from "@/components/ui";
import { PageHero, CTASection, ServiceGrid, ProcessSteps } from "@/components/sections";
import { WebdesignHero, WebdesignShowcase } from "@/components/webdesign";
import { SeoService, type SeoCaseItem } from "@/components/seodienst";
import { FotografieService } from "@/components/fotografie";
import { SubdienstenGrid } from "@/components/subdiensten";
import { webdesignSubdiensten } from "@/data/webdesignSubdiensten";
import { seoCases } from "@/data/seoShowcase";
import { allServices, services, getServiceBySlug, serviceHref, serviceHrefBySlug } from "@/data/services";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";

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

  return {
    title: { absolute: service.seo.title },
    description: service.seo.description,
    keywords: service.seo.keywords,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // A sub-service reached via its old flat URL: 308 to the nested canonical.
  if (service.parentSlug) {
    permanentRedirect(serviceHref(service));
  }

  const relatedServices = service.relatedServices
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  const parentService = service.parentSlug ? getServiceBySlug(service.parentSlug) : undefined;
  const childServices = allServices.filter((s) => s.parentSlug === service.slug);

  // Webdesign and SEO lead with a bespoke animated hero + realisatie showcase
  // (admin-managed images/projects); their regular content follows below.
  const isWebdesign = service.slug === "webdesign";
  const isSeo = service.slug === "seo";
  const isFotografie = service.slug === "fotografie";
  const [webdesignImages, webdesignProjects] =
    isWebdesign || isSeo
      ? await Promise.all([getWebdesignImages(), getWebdesignProjects()])
      : [null, null];

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
          url: `${businessConfig.url}/diensten/${service.slug}`,
        }}
      />
      {service.faqs.length > 0 && <FaqPageJsonLd items={service.faqs} />}
    </>
  );

  // SEO leads with a fully bespoke, SEO-optimized page (continuous background,
  // animated hero + realisaties, subdiensten cards, sector pills, FAQ).
  if (isSeo && webdesignImages) {
    return (
      <div className="min-h-screen bg-black text-white">
        {jsonLd}
        <SeoService service={service} seoItems={seoItems} images={webdesignImages} relatedServices={relatedServices} />
      </div>
    );
  }

  // Fotografie leads with the cinematic viewfinder hero + gallery lightbox.
  if (isFotografie) {
    return (
      <div className="min-h-screen bg-black text-white">
        {jsonLd}
        <FotografieService service={service} relatedServices={relatedServices} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
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

      {service.faqs.length > 0 && (
        <Section orbs="tl-br">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Veelgestelde vragen</h2>
            <Accordion type="single" collapsible>
              {service.faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-white/70">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </Section>
      )}

      {relatedServices.length > 0 && (
        <Section orbs="tr-bl">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Gerelateerde diensten</h2>
            <div className="flex flex-wrap gap-3">
              {relatedServices.map((related) => (
                <Link
                  key={related.slug}
                  href={serviceHrefBySlug(related.slug)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {related.title}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CTASection
        title={`Interesse in ${service.title.toLowerCase()}?`}
        description="Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
      />
    </div>
  );
}
