import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getSoftwareService, softwareServices } from "@/data/softwareServices";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/urls";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";
import { CTASection, PageHero } from "@/components/sections";
import { Container, Section } from "@/components/ui";

export function generateStaticParams() {
  return softwareServices.map((service) => ({ subslug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subslug: string }>;
}): Promise<Metadata> {
  const { subslug } = await params;
  const service = getSoftwareService(subslug);

  if (!service) return {};

  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords,
    path: `/diensten/software-op-maat/${service.slug}/`,
  });
}

export default async function SoftwareServicePage({
  params,
}: {
  params: Promise<{ subslug: string }>;
}) {
  const { subslug } = await params;
  const service = getSoftwareService(subslug);

  if (!service) notFound();

  const canonicalPath = `/diensten/software-op-maat/${service.slug}/`;
  const canonicalUrl = `${businessConfig.url}${localizedPath("nl", canonicalPath)}`;
  const related = softwareServices.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
          { name: "Software op maat", path: "/diensten/software-op-maat" },
          { name: service.title, path: canonicalPath },
        ]}
      />
      <ServiceJsonLd
        service={{
          name: service.title,
          description: service.excerpt,
          url: canonicalUrl,
        }}
      />
      <FaqPageJsonLd items={service.faqs} />

      <PageHero title={service.title} subtitle={service.intro} />

      <Section orbs="tl-br">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
                {service.primaryKeyword}
              </p>
              <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
                Wat deze oplossing voor je organisatie kan betekenen
              </h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-white/62">
                De precieze uitwerking hangt af van je gebruikers, gegevens en bestaande systemen. Deze pagina beschrijft
                daarom geen vast pakket, maar de onderdelen die meestal nodig zijn om tot een bruikbare en onderhoudbare
                oplossing te komen.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 text-sm text-white/72">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF9A45]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-[rgba(255,122,0,0.26)] bg-[rgba(255,122,0,0.055)] p-7 sm:p-9">
              <h2 className="font-sora text-2xl font-extrabold">Wat kan in de scope zitten?</h2>
              <ul className="mt-6 space-y-4">
                {service.deliverables.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF7A00] font-mono text-xs font-extrabold text-black">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-white/72">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section orbs="tr-bl">
        <Container>
          <div className="mb-8 max-w-2xl">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
              Geschikt voor
            </p>
            <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
              Wanneer is {service.title.toLowerCase()} een logische stap?
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {service.idealFor.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <p className="font-semibold leading-relaxed text-white/76">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section orbs="tl-br">
        <Container>
          <div className="mb-9 max-w-2xl">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
              Aanpak
            </p>
            <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
              Van vraagstuk naar een testbare eerste versie
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {service.process.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <span className="font-mono text-sm font-extrabold text-[#FF9A45]">0{index + 1}</span>
                <h3 className="mt-4 font-sora text-lg font-extrabold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/56">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section orbs="tr-bl">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-sora text-3xl font-extrabold sm:text-4xl">
              Veelgestelde vragen over {service.title.toLowerCase()}
            </h2>
            <div className="mt-8 space-y-3">
              {service.faqs.map((item) => (
                <details key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 open:border-[rgba(255,122,0,0.32)]">
                  <summary className="cursor-pointer list-none pr-8 font-bold text-white marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-4 leading-relaxed text-white/60">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section orbs="tl-br">
        <Container>
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.025] p-8 sm:p-10">
            <div>
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
                Andere mogelijkheden
              </p>
              <h2 className="font-sora text-2xl font-extrabold sm:text-3xl">
                Combineer functies zonder alles in één project te proppen
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/diensten/software-op-maat/${item.slug}/`}
                  className="group rounded-2xl border border-white/10 bg-black/10 p-5 transition-colors hover:border-[rgba(255,122,0,0.38)]"
                >
                  <h3 className="font-sora font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/52">{item.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FF9A45]">
                    Meer informatie
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title={`Wil je ${service.title.toLowerCase()} concreet laten uitwerken?`}
        description="Beschrijf je gebruikers, huidige werkwijze en grootste knelpunt. We helpen de juiste eerste scope bepalen zonder onnodige functies te verkopen."
      />
    </div>
  );
}
