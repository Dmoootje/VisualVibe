import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section, Container } from "@/components/ui";
import { BlogGrid, CTASection, ServiceGrid } from "@/components/sections";
import { sectors, getSectorBySlug } from "@/data/sectors";
import { getServiceBySlug } from "@/data/services";
import { getAllPosts, slugFromPath } from "@/lib/kennisbank/posts";
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

  // Kennisbank-artikels die deze sector vermelden; anders de 3 nieuwste artikels.
  const posts = getAllPosts({ locale: "nl" });
  const sectorPosts = posts.filter((post) =>
    post.relatedSectors?.some((path) => slugFromPath(path) === sector.slug)
  );
  const kennisbankPosts = (sectorPosts.length > 0 ? sectorPosts : posts).slice(0, 3);

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

      {/* Uit de kennisbank: gerelateerde artikels (interne links + GEO). */}
      {kennisbankPosts.length > 0 && (
        <Section orbs="tl-br">
          <Container>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
                  <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
                  Kennisbank
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Lees meer over online groeien in jouw sector
                </h2>
              </div>
              <Link
                href="/kennisbank"
                className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white sm:self-end"
              >
                Alle artikels
                <ArrowRight className="h-[15px] w-[15px]" />
              </Link>
            </div>
            <BlogGrid posts={kennisbankPosts} />
          </Container>
        </Section>
      )}

      <CTASection title={`Actief in ${sector.title.toLowerCase()}? Laten we kennismaken.`} />
    </div>
  );
}
