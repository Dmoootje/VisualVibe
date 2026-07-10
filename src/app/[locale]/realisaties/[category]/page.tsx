import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cases } from "@/data/cases";
import { realisatieCategories, getRealisatieCategoryBySlug } from "@/data/realisatieCategories";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";
import { PageHero, Breadcrumbs, CaseGrid } from "@/components/sections";
import { Section, Container } from "@/components/ui";
import { RealisatieCategoryGrid } from "@/components/realisaties/RealisatieCategoryGrid";

export function generateStaticParams() {
  return realisatieCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryDef = getRealisatieCategoryBySlug(category);
  if (!categoryDef) return {};

  const items = cases.filter((item) => item.category === categoryDef.slug);
  return {
    title: { absolute: categoryDef.seoTitle },
    description: categoryDef.seoDescription,
    alternates: { canonical: `${businessConfig.url}/realisaties/${categoryDef.slug}/` },
    // Empty category: keep it reachable but out of the index until cases land.
    robots: items.length === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function RealisatieCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryDef = getRealisatieCategoryBySlug(category);
  if (!categoryDef) notFound();

  const items = cases.filter((item) => item.category === categoryDef.slug);
  const otherCategories = realisatieCategories.filter((c) => c.slug !== categoryDef.slug);

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Realisaties", path: "/realisaties" },
          { name: categoryDef.name, path: `/realisaties/${categoryDef.slug}` },
        ]}
      />

      <PageHero title={categoryDef.name} subtitle={categoryDef.description} />

      <Section orbs="tl-br">
        <Container>
          <Breadcrumbs
            className="mb-8"
            items={[
              { name: "Home", href: "/" },
              { name: "Realisaties", href: "/realisaties" },
              { name: categoryDef.name },
            ]}
          />

          {items.length > 0 ? (
            <CaseGrid cases={items} />
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <h2 className="text-2xl font-bold">Binnenkort realisaties in {categoryDef.name}</h2>
              <p className="max-w-xl text-white/60">
                We voegen hier binnenkort projecten toe. Zin om zelf zo&apos;n realisatie te laten maken?
              </p>
              <Link
                href="/offerte-aanvragen"
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-medium text-white transition-colors hover:from-red-600 hover:to-amber-600"
              >
                Offerte aanvragen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Container>
      </Section>

      <Section orbs="tr-bl">
        <Container>
          <h2 className="mb-6 text-2xl font-bold">Andere categorieën</h2>
          <RealisatieCategoryGrid items={otherCategories} />
        </Container>
      </Section>
    </div>
  );
}
