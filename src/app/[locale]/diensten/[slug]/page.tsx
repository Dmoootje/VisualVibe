import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Check } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { allServices, getServiceBySlug } from "@/data/services";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";

export function generateStaticParams() {
  return allServices.map((service) => ({ slug: service.slug }));
}

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

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Diensten", path: "/diensten" },
    ...(parentService ? [{ name: parentService.title, path: `/diensten/${parentService.slug}` }] : []),
    { name: service.title, path: `/diensten/${service.slug}` },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ServiceJsonLd
        service={{
          name: service.title,
          description: service.excerpt,
          url: `${businessConfig.url}/diensten/${service.slug}`,
        }}
      />
      {service.faqs.length > 0 && <FaqPageJsonLd items={service.faqs} />}

      <div className="container mx-auto max-w-4xl">
        {parentService && (
          <Link
            href={`/diensten/${parentService.slug}`}
            className="inline-block mb-4 text-sm text-white/50 hover:text-white transition-colors"
          >
            &larr; Onderdeel van {parentService.title}
          </Link>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
        <p className="text-lg text-white/70 mb-10">{service.intro}</p>

        {childServices.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Subdiensten</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {childServices.map((child) => (
                <Link
                  key={child.slug}
                  href={`/diensten/${child.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
                >
                  <span className="font-medium group-hover:text-amber-400 transition-colors">{child.title}</span>
                  <ArrowRight className="h-4 w-4 text-white/50" />
                </Link>
              ))}
            </div>
          </section>
        ) : (
          service.benefits.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Wat we voor je doen</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-white/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          )
        )}

        {service.process.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Hoe we werken</h2>
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
          </section>
        )}

        {service.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Veelgestelde vragen</h2>
            <Accordion type="single" collapsible>
              {service.faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-white/70">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {relatedServices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Gerelateerde diensten</h2>
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
          </section>
        )}

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold">Interesse in {service.title.toLowerCase()}?</h2>
          <p className="max-w-xl text-white/70">
            Vraag een vrijblijvende offerte aan en ontvang binnen de 2 werkdagen een reactie.
          </p>
          <Link
            href="/offerte-aanvragen"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-medium text-white hover:from-red-600 hover:to-amber-600 transition-colors"
          >
            Offerte aanvragen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
