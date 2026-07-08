import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight, AlertCircle } from "lucide-react";
import { sectors, getSectorBySlug } from "@/data/sectors";
import { getServiceBySlug } from "@/data/services";
import { BreadcrumbJsonLd } from "@/components/seo";

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

  return {
    title: { absolute: sector.seo.title },
    description: sector.seo.description,
    keywords: sector.seo.keywords,
  };
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
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Sectoren", path: "/sectoren" },
          { name: sector.title, path: `/sectoren/${sector.slug}` },
        ]}
      />

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{sector.title}</h1>
        <p className="text-lg text-white/70 mb-12">{sector.intro}</p>

        {sector.painPoints.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Herkenbare uitdagingen</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {sector.painPoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-white/80">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  {point}
                </li>
              ))}
            </ul>
          </section>
        )}

        {recommendedServices.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Aanbevolen diensten</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {recommendedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/diensten/${service.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
                >
                  <span className="font-medium group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/50" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold">Actief in {sector.title.toLowerCase()}? Laten we kennismaken.</h2>
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
