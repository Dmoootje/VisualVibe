import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Check, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Section,
  Container,
} from "@/components/ui";
import { CTASection, ProcessSteps } from "@/components/sections";
import { ServiceRelatedPosts } from "@/components/sections/ServiceRelatedPosts";
import { SubdienstHero } from "@/components/subdienst";
import { subservices, getSubservicesByParent } from "@/data/subservices";
import { getServiceBySlug, serviceHrefBySlug } from "@/data/services";
import { regions } from "@/data/regions";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";

export function generateStaticParams() {
  return subservices
    .filter((s) => s.parentSlug)
    .map((s) => ({ slug: s.parentSlug as string, sub: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const { slug, sub } = await params;
  const service = getServiceBySlug(sub);
  if (!service || service.parentSlug !== slug) {
    return {};
  }

  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    path: `/diensten/${slug}/${sub}/`,
    ogImage: service.seo.ogImage,
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

  // The sub must exist and genuinely belong to the pillar in the URL.
  if (!service || !parentService || service.parentSlug !== slug) {
    notFound();
  }

  const relatedServices = service.relatedServices
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Diensten", path: "/diensten" },
    { name: parentService.title, path: `/diensten/${parentService.slug}` },
    { name: service.title, path: `/diensten/${parentService.slug}/${service.slug}` },
  ];

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        service={{
          name: service.title,
          description: service.excerpt,
          url: `${businessConfig.url}/diensten/${parentService.slug}/${service.slug}`,
        }}
      />
      {service.faqs.length > 0 && <FaqPageJsonLd items={service.faqs} />}

      <SubdienstHero
        pillar={parentService.title}
        pillarHref={`/diensten/${parentService.slug}`}
        pillarSlug={parentService.slug}
        hero={{
          slug: service.slug,
          name: service.title,
          category: service.category,
          desc: service.intro,
        }}
        siblings={getSubservicesByParent(parentService.slug)
          .filter((s) => s.slug !== service.slug)
          .map((s) => ({ slug: s.slug, name: s.title, category: s.category }))}
      />

      {service.benefits.length > 0 && (
        <Section orbs="tl-br">
          <Container>
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Wat we voor je doen</h2>
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
      )}

      {service.process.length > 0 && (
        <Section orbs="tr-bl">
          <Container>
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Hoe we werken</h2>
            <ProcessSteps steps={service.process} />
          </Container>
        </Section>
      )}

      {service.faqs.length > 0 && (
        <Section orbs="tl-br">
          <Container>
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Veelgestelde vragen</h2>
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
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Gerelateerde diensten</h2>
            <div className="flex flex-wrap gap-3">
              {relatedServices.map((related) => (
                <Link
                  key={related.slug}
                  href={serviceHrefBySlug(related.slug)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {related.title}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Uit de kennisbank: artikels bij de hoofddienst (interne links + GEO). */}
      <ServiceRelatedPosts serviceSlug={parentService.slug} />

      {/* Regio-links: subdienst naar de regio-hubs, als compacte link-rij. */}
      <Section orbs="tl-br">
        <Container>
          <h2 className="mb-2 text-2xl font-bold sm:text-3xl">Actief in deze regio&apos;s</h2>
          <p className="mb-6 max-w-2xl text-white/60">
            Vanuit onze thuisbasis in Limburg werken we voor bedrijven in heel Vlaanderen, Antwerpen
            en Nederlands-Limburg.
          </p>
          <div className="flex flex-wrap gap-3">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/regio/${region.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                {region.title}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title={`Interesse in ${service.title.toLowerCase()}?`}
        description="Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie."
      />
    </div>
  );
}
