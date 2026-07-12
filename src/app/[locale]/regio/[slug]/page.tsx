import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui";
import { CTASection } from "@/components/sections";
import { RegionAmbient, RegionDetailHero, RegionGeo, RegionServicesGrid } from "@/components/regio";
import { SectorMarquee } from "@/components/sectors";
import { regions, getRegionBySlug } from "@/data/regions";
import { getServiceBySlug } from "@/data/services";
import { pageMetadata } from "@/lib/seo/pageMetadata";
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

  return pageMetadata({
    title: region.seo.title,
    description: region.seo.description,
    keywords: region.seo.keywords,
    path: `/regio/${region.slug}/`,
  });
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
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Regio", path: "/regio" },
          { name: region.title, path: `/regio/${region.slug}` },
        ]}
      />

      {/* Eén doorlopende, paginabrede achtergrond; alle secties zijn transparant. */}
      <RegionAmbient />

      <div className="relative z-10">
      <RegionDetailHero region={region} />

      {/* 1. Wat we doen - dienstenkaarten als bento (design_handoff_regio_vlaanderen). */}
      {localServices.length > 0 && (
        <section className="relative px-4 pt-8 pb-16 md:pt-10 md:pb-24">
          <Container>
            <div className="mb-9 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
              <div className="max-w-xl">
                <p className="mb-3.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
                  <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
                  Onze diensten
                </p>
                <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-[38px]">
                  Wat we voor bedrijven in {region.title} doen
                </h2>
                <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/60">
                  Van website en lokale SEO tot fotografie, video en dronebeelden: alles om online op
                  te vallen in {region.title}, onder een dak.
                </p>
              </div>
              <Link
                href="/diensten"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white"
              >
                Bekijk alle diensten
                <ArrowRight className="h-[15px] w-[15px]" />
              </Link>
            </div>
            <RegionServicesGrid services={localServices} />
          </Container>
        </section>
      )}

      {/* 2. Waar we actief zijn - GEO-blok met gemeentes. */}
      <RegionGeo region={region} />

      {/* 3. Voor wie we werken - sectoren als 2 tegengestelde badge-rijen. */}
      <section className="overflow-hidden py-12 sm:py-16">
        <div className="container mx-auto mb-8 px-4">
          <p className="mb-3.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
            Sectoren
          </p>
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

      <CTASection className="bg-transparent" title={`Actief in ${region.title}? Laten we kennismaken.`} />
      </div>
    </div>
  );
}
