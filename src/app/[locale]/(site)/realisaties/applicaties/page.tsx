import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getApplicationCaseImages,
  getApplicationCases,
} from "@/lib/firestore/applicationCases";
import { realisatieCategories } from "@/data/realisatieCategories";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { businessConfig } from "@/config/business.config";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo";
import { RealisatieHeader } from "@/components/realisaties/RealisatieHeader";
import { RealisatieApplicatieGrid } from "@/components/realisaties/RealisatieApplicatieGrid";
import { RealisatieCategoryGrid } from "@/components/realisaties/RealisatieCategoryGrid";
import { Container, Section } from "@/components/ui";
import type { SupportedLocale } from "@/i18n/locales";
import { getLocalizedApplicationCaseById } from "@/data/applicationCases";
import { getLocalizedRealisatieCategoryById } from "@/data/realisatieCategories";
import { localizedPath } from "@/lib/kennisbank/urls";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  const category = getLocalizedRealisatieCategoryById("applicaties", locale);
  const dutchCategory = getLocalizedRealisatieCategoryById(category.id, "nl");
  const englishCategory = getLocalizedRealisatieCategoryById(category.id, "en");
  return pageMetadata({ locale, title: category.seoTitle, description: category.seoDescription, path: `/realisaties/${category.slug}/`, languagePaths: { nl: `/realisaties/${dutchCategory.slug}/`, en: `/realisaties/${englishCategory.slug}/` } });
}

export default async function ApplicatieRealisatiesPage({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  const category = getLocalizedRealisatieCategoryById("applicaties", locale);

  const [allProjects, images] = await Promise.all([
    getApplicationCases("nl"),
    getApplicationCaseImages(),
  ]);
  const projects = allProjects.flatMap((project) => {
    if (!project.published) return [];
    if (locale === "nl") return [project];
    try { return [getLocalizedApplicationCaseById(project.id, locale)]; } catch { return []; }
  });
  const otherCategories = realisatieCategories.filter((candidate) => candidate.slug !== "applicaties").map((candidate) => getLocalizedRealisatieCategoryById(candidate.slug, locale));
  const pageUrl = `${businessConfig.url}${localizedPath(locale === "en" ? "en" : "nl", `/realisaties/${category.slug}/`)}`;
  const en = locale === "en";

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        locale={locale === "en" ? "en" : "nl"}
        items={[
          { name: "Home", path: "/" },
          { name: en ? "Case studies" : "Realisaties", path: "/realisaties/" },
          { name: category.name, path: `/realisaties/${category.slug}/` },
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
          inLanguage: en ? "en-BE" : "nl-BE",
          isPartOf: { "@id": `${businessConfig.url}/#website` },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.title,
              url: `${pageUrl}${project.slug}/`,
            })),
          },
        }}
      />

      <RealisatieHeader category={category} locale={locale} />
      <RealisatieApplicatieGrid projects={projects} images={images} locale={locale} />

      <section className="relative py-8 sm:py-12">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="flex flex-col gap-6 rounded-[24px] border border-[rgba(255,122,0,0.24)] bg-white/[0.025] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-2xl">
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff9a45]">
                {en ? "Custom apps and software" : "Apps & software op maat"}
              </p>
              <h2 className="font-sora text-2xl font-extrabold tracking-tight sm:text-3xl">
                {en ? "Need a web app, platform or digital workflow?" : "Een eigen webapp, platform of digitale workflow nodig?"}
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-white/60">
                {en ? "We bring users, processes, data and integrations together in a viable first version that can grow with your business." : "We brengen gebruikers, processen, gegevens en integraties samen in een haalbare eerste versie die later kan doorgroeien."}
              </p>
            </div>
            <Link
              href={en ? "/services/custom-software/" : "/diensten/software-op-maat/"}
              className="inline-flex flex-none items-center justify-center gap-2 self-start rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5 motion-reduce:transform-none sm:self-center"
            >
              {en ? "Explore custom software" : "Bekijk software op maat"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Section orbs="tr-bl">
        <Container>
          <h2 className="mb-6 text-2xl font-bold">{en ? "Other categories" : "Andere categorieën"}</h2>
          <RealisatieCategoryGrid items={otherCategories} locale={locale} />
        </Container>
      </Section>
    </div>
  );
}
