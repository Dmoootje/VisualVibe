import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { PageHero, CTASection, ServiceGrid } from "@/components/sections";
import { WebdesignHero, WebdesignShowcase } from "@/components/webdesign";
import { allServices, getServiceBySlug } from "@/data/services";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";

export function generateStaticParams() {
  return allServices.map((service) => ({ slug: service.slug }));
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

  const relatedServices = service.relatedServices
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => Boolean(related));

  const parentService = service.parentSlug ? getServiceBySlug(service.parentSlug) : undefined;
  const childServices = allServices.filter((s) => s.parentSlug === service.slug);

  // The Webdesign service leads with the bespoke animated hero + realisatie
  // showcase (admin-managed images); its regular content follows below.
  const isWebdesign = service.slug === "webdesign";
  const webdesignImages = isWebdesign ? await getWebdesignImages() : null;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Diensten", path: "/diensten" },
    ...(parentService ? [{ name: parentService.title, path: `/diensten/${parentService.slug}` }] : []),
    { name: service.title, path: `/diensten/${service.slug}` },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        service={{
          name: service.title,
          description: service.excerpt,
          url: `${businessConfig.url}/diensten/${service.slug}`,
        }}
      />
      {service.faqs.length > 0 && <FaqPageJsonLd items={service.faqs} />}

      {isWebdesign && webdesignImages ? (
        <>
          <WebdesignHero heroImage={webdesignImages.hero} />
          <WebdesignShowcase images={webdesignImages} />
        </>
      ) : (
        <PageHero
          title={service.title}
          subtitle={service.intro}
          backLink={parentService ? { label: `Onderdeel van ${parentService.title}`, href: `/diensten/${parentService.slug}` } : undefined}
        />
      )}

      {childServices.length > 0 ? (
        <Section orbs="tl-br">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Subdiensten</h2>
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
            <ol className="grid gap-6 sm:grid-cols-2">
              {service.process.map((step, index) => (
                <li key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <span className="text-sm text-amber-400 font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm">{step.description}</p>
                </li>
              ))}
            </ol>
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
                  href={`/diensten/${related.slug}`}
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
