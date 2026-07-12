import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Section, Container } from "@/components/ui";
import { CTASection, ServiceGrid } from "@/components/sections";
import { sectors, getSectorBySlug } from "@/data/sectors";
import { getServiceBySlug } from "@/data/services";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SectorDetailHero, SectorMarquee } from "@/components/sectors";

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

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

  const recommendedServices = sector.recommendedServices
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Sectoren", path: "/sectoren" },
          { name: sector.title, path: `/sectoren/${sector.slug}` },
        ]}
      />

      <SectorDetailHero sector={sector} />

      {/* Andere sectoren marquee. Pulled up on desktop so it tucks into the
          space the large hero emblem leaves below it. */}
      <div className="relative z-10 border-t border-white/[0.08] pb-4 pt-7 md:-mt-[200px]">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
            Andere sectoren
          </p>
        </div>
        {/* Full-bleed: the two rows run edge to edge, only the label stays aligned. */}
        <SectorMarquee exclude={sector.slug} />
      </div>

      {sector.painPoints.length > 0 && (
        <Section orbs="tl-br">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Herkenbare uitdagingen</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {sector.painPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-white/80">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  {point}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {recommendedServices.length > 0 && (
        <Section orbs="tr-bl">
          <Container>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Aanbevolen diensten</h2>
            <ServiceGrid services={recommendedServices} />
          </Container>
        </Section>
      )}

      <CTASection title={`Actief in ${sector.title.toLowerCase()}? Laten we kennismaken.`} />
    </div>
  );
}
