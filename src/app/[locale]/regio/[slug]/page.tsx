import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Container } from "@/components/ui";
import { PageHero, CTASection, ServiceGrid } from "@/components/sections";
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

      <PageHero title={region.title} subtitle={region.intro} backLink={{ label: "Alle regio's", href: "/regio" }} />

      {localServices.length > 0 && (
        <Section orbs="tl-br">
          <Container className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Onze diensten in {region.title}</h2>
            <ServiceGrid services={localServices} />
          </Container>
        </Section>
      )}

      <CTASection title={`Actief in ${region.title}? Laten we kennismaken.`} />
    </div>
  );
}
