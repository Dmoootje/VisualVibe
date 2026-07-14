import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getApplicationCaseImages,
  getApplicationCases,
} from "@/lib/firestore/applicationCases";
import {
  getRealisatieCategoryBySlug,
  realisatieCategories,
} from "@/data/realisatieCategories";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import { RealisatieHeader } from "@/components/realisaties/RealisatieHeader";
import { RealisatieApplicatieGrid } from "@/components/realisaties/RealisatieApplicatieGrid";
import { RealisatieCategoryGrid } from "@/components/realisaties/RealisatieCategoryGrid";
import { Container, Section } from "@/components/ui";

export const revalidate = 60;

const category = getRealisatieCategoryBySlug("applicaties");

export const metadata = pageMetadata({
  title: category?.seoTitle ?? "Applicaties en software op maat | VisualVibe",
  description:
    category?.seoDescription ??
    "Bekijk webapps, SaaS-platformen en software op maat van VisualVibe.",
  path: "/realisaties/applicaties/",
});

export default async function ApplicatieRealisatiesPage() {
  if (!category) return null;

  const [allProjects, images] = await Promise.all([
    getApplicationCases(),
    getApplicationCaseImages(),
  ]);
  const projects = allProjects.filter((project) => project.published);
  const otherCategories = realisatieCategories.filter(
    (candidate) => candidate.slug !== category.slug,
  );
  const pageUrl = `${businessConfig.url}/be/realisaties/applicaties/`;

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Realisaties", path: "/realisaties/" },
          { name: category.name, path: "/realisaties/applicaties/" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${pageUrl}#webpage`,
          url: pageUrl,
          name: category.seoTitle,
          description: category.seoDescription,
          inLanguage: "nl-BE",
          isPartOf: { "@id": `${businessConfig.url}/#website` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.title,
              url: `${businessConfig.url}/be/realisaties/applicaties/${project.slug}/`,
            })),
          },
        }}
      />

      <RealisatieHeader category={category} />
      <RealisatieApplicatieGrid projects={projects} images={images} />

      <section className="relative py-8 sm:py-12">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="flex flex-col gap-6 rounded-[24px] border border-[rgba(255,122,0,0.24)] bg-white/[0.025] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-2xl">
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
                Apps & software op maat
              </p>
              <h2 className="font-sora text-2xl font-extrabold tracking-tight sm:text-3xl">
                Een eigen webapp, platform of digitale workflow nodig?
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-white/60">
                We brengen gebruikers, processen, gegevens en integraties samen in een haalbare
                eerste versie die later kan doorgroeien.
              </p>
            </div>
            <Link
              href="/diensten/software-op-maat/"
              className="inline-flex flex-none items-center justify-center gap-2 self-start rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5 motion-reduce:transform-none sm:self-center"
            >
              Bekijk software op maat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Section orbs="tr-bl">
        <Container>
          <h2 className="mb-6 text-2xl font-bold">Andere categorieën</h2>
          <RealisatieCategoryGrid items={otherCategories} />
        </Container>
      </Section>
    </div>
  );
}
