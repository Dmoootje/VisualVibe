import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { sectors, getSectorBySlug } from "@/data/sectors";
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
