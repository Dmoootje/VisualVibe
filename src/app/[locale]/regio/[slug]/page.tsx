import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Container } from "@/components/ui";
import { CTASection } from "@/components/sections";
import { RegionDetailHero, RegionGeo, RegionServicesGrid } from "@/components/regio";
import { SectorMarquee } from "@/components/sectors";
import { regions, getRegionBySlug } from "@/data/regions";
import { getServiceBySlug } from "@/data/services";
import { BreadcrumbJsonLd } from "@/components/seo";

export function generateStaticParams() {
  return regions.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const region = getRegionBySlug(slug);

  if (!region) {
    return {};
  }

  return {
    title: { absolute: region.seo.title },
    description: region.seo.description,
    keywords: region.seo.keywords,
  };
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = getRegionBySlug(slug);

  if (!region) {
    notFound();
  }

  const localServices = region.localServices
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Regio", path: "/regio" },
          { name: region.title, path: `/regio/${region.slug}` },
        ]}
      />

      <RegionDetailHero region={region} />

      {/* 1. Wat we doen - herkenbare dienstenkaarten met iconen. */}
      {localServices.length > 0 && (
        <Section orbs="tl-br">
          <Container>
            <div className="mb-8 max-w-2xl">
              <div className="mb-3 font-mono text-xs font-bold tracking-[0.18em] text-[#FF9A45]">DIENSTEN</div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Wat we voor bedrijven in {region.title} doen
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">
                Van website en lokale SEO tot fotografie, video en dronebeelden: alles om online op
                te vallen in {region.title}, onder een dak.
              </p>
            </div>
            <RegionServicesGrid services={localServices} />
          </Container>
        </Section>
      )}

      {/* 2. Waar we actief zijn - GEO-blok met gemeentes. */}
      <RegionGeo region={region} />

      {/* 3. Voor wie we werken - sectoren als 2 tegengestelde badge-rijen. */}
      <section className="overflow-hidden py-16 sm:py-20">
        <div className="container mx-auto mb-8 px-4">
          <div className="mb-3 font-mono text-xs font-bold tracking-[0.18em] text-[#FF9A45]">SECTOREN</div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Sectoren waarvoor we werken in {region.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Van KMO en horeca tot bouw, retail en events: we kennen de uitdagingen van elke sector
            in {region.title}.
          </p>
        </div>
        <SectorMarquee />
      </section>

      <CTASection title={`Actief in ${region.title}? Laten we kennismaken.`} />
    </div>
  );
}
