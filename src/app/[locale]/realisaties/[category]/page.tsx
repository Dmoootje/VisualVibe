import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cases } from "@/data/cases";
import { realisatieCategories, getRealisatieCategoryBySlug } from "@/data/realisatieCategories";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd } from "@/components/seo";
import { CaseGrid } from "@/components/sections";
import { Section, Container } from "@/components/ui";
import { RealisatieCategoryGrid } from "@/components/realisaties/RealisatieCategoryGrid";
import { RealisatieHeader } from "@/components/realisaties/RealisatieHeader";
import { RealisatieWebdesignFeatured } from "@/components/realisaties/RealisatieWebdesignFeatured";
import { RealisatieWebdesignGrid } from "@/components/realisaties/RealisatieWebdesignGrid";
import { getWebdesignImages } from "@/lib/firestore/webdesignImages";
import { getWebdesignProjects } from "@/lib/firestore/webdesignProjects";

export function generateStaticParams() {
  return realisatieCategories.map((category) => ({ category: category.slug }));
}

// ISR so admin-managed Webdesign showcase images/projects propagate without a rebuild.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryDef = getRealisatieCategoryBySlug(category);
  if (!categoryDef) return {};

  const items = cases.filter((item) => item.category === categoryDef.slug);
  // Webdesign carries its own showcase content, so it's always indexable.
  const hasContent = categoryDef.slug === "webdesign" || items.length > 0;
  return {
    title: { absolute: categoryDef.seoTitle },
    description: categoryDef.seoDescription,
    alternates: { canonical: `${businessConfig.url}/realisaties/${categoryDef.slug}/` },
    // Empty category: keep it reachable but out of the index until cases land.
    robots: hasContent ? undefined : { index: false, follow: true },
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

  const isWebdesign = categoryDef.slug === "webdesign";
  const items = cases.filter((item) => item.category === categoryDef.slug);
  const otherCategories = realisatieCategories.filter((c) => c.slug !== categoryDef.slug);

  // Webdesign leads with the featured "Laatste creatie" + Websites/Webshops
  // grid, built from the admin-managed projects + images.
  const [webdesignImages, webdesignProjects] = isWebdesign
    ? await Promise.all([getWebdesignImages(), getWebdesignProjects()])
    : [null, null];
  const featured =
    webdesignProjects?.find((p) => p.id === "gordijnenmyriam") ?? webdesignProjects?.[0] ?? null;
  const gridProjects = webdesignProjects?.filter((p) => p.id !== featured?.id) ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Realisaties", path: "/realisaties" },
          { name: categoryDef.name, path: `/realisaties/${categoryDef.slug}` },
        ]}
      />

      <RealisatieHeader category={categoryDef} />

      {isWebdesign && webdesignImages && featured ? (
        <>
          <RealisatieWebdesignFeatured project={featured} images={webdesignImages} />
          <RealisatieWebdesignGrid projects={gridProjects} images={webdesignImages} />
        </>
      ) : (
        <Section orbs="tl-br">
          <Container>
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
      )}

      <Section orbs="tr-bl">
        <Container>
          <h2 className="mb-6 text-2xl font-bold">Andere categorieën</h2>
          <RealisatieCategoryGrid items={otherCategories} />
        </Container>
      </Section>
    </div>
  );
}
