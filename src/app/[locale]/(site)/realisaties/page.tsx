import { Link } from "@/i18n/navigation";
import "@/components/media-patterns.css";
import { ArrowRight } from "lucide-react";
import { realisatieCategories, categoryToServiceSlug } from "@/data/realisatieCategories";
import { subservices } from "@/data/subservices";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { localizedPath } from "@/lib/kennisbank/urls";
import { getHubData } from "@/lib/realisaties/hubData";
import { BreadcrumbJsonLd, FaqPageJsonLd, JsonLd } from "@/components/seo";
import { SectorFaq } from "@/components/sectors";
import { RealisatiesHero } from "@/components/realisaties/RealisatiesHero";
import { RealisatiesAnswerBlock } from "@/components/realisaties/RealisatiesAnswerBlock";
import { FeaturedRealisaties } from "@/components/realisaties/FeaturedRealisaties";
import { RealisatieHubCategoryGrid, type HubCategoryItem } from "@/components/realisaties/RealisatieHubCategoryGrid";
import { RealisatieFilterGrid } from "@/components/realisaties/RealisatieFilterGrid";
import { CompleteTrajectSection } from "@/components/realisaties/CompleteTrajectSection";
import { RealisatieContextGrid, type HubContextItem } from "@/components/realisaties/RealisatieContextGrid";

export const metadata = pageMetadata({
  title: "Realisaties in webdesign, fotografie, video & drone | VisualVibe",
  description:
    "Bekijk realisaties van VisualVibe in webdesign, SEO, fotografie, videografie, drone & FPV, 3D/VR/AR en podcasting voor bedrijven in Limburg en daarbuiten.",
  path: "/realisaties/",
});

// De hub toont Firestore-content (admin-beheerd): net als de categoriepagina's
// periodiek revalideren zodat nieuwe projecten zonder rebuild verschijnen.
export const revalidate = 60;

// Primaire disciplines (volgorde) en context-categorieën (bestaande slugs;
// "projecten" krijgt de duidelijkere zichtbare titel, de slug blijft).
const PRIMARY_SLUGS = ["webdesign", "fotografie", "videografie", "drone", "3d-vr", "podcasting"];
const CONTEXTS: { slug: string; title: string }[] = [
  { slug: "bedrijven", title: "Bedrijven" },
  { slug: "projecten", title: "Bouw & interieur" },
  { slug: "events", title: "Events" },
  { slug: "sport", title: "Sport" },
  { slug: "buitenland", title: "Buitenland" },
];

// Zichtbare FAQ = exact dezelfde items als de FAQPage JSON-LD.
const FAQ_ITEMS = [
  {
    question: "Welke soorten realisaties toont VisualVibe?",
    answer:
      "Je vindt hier projecten in webdesign, SEO, fotografie, videografie, drone en FPV, 3D, VR en AR, podcasting en creatieve content.",
  },
  {
    question: "Kan één project meerdere diensten combineren?",
    answer:
      "Ja. Veel projecten combineren bijvoorbeeld webdesign met fotografie, video, dronebeelden of brandingcontent.",
  },
  {
    question: "Werkt VisualVibe alleen in Limburg?",
    answer:
      "VisualVibe werkt vanuit Limburg voor klanten in Vlaanderen, België, Nederland en voor geselecteerde projecten daarbuiten.",
  },
  {
    question: "Kan ik een gelijkaardig project aanvragen?",
    answer:
      "Ja. Via de offertepagina kun je jouw plannen toelichten. Daarna bekijken we welke disciplines en aanpak het beste bij jouw project passen.",
  },
];

export default async function RealisatiesHubPage() {
  const hub = await getHubData();
  const baseUrl = `${businessConfig.url}${localizedPath("nl", "/realisaties/")}`;

  // Disciplinekaarten: echte beelden, echte aantallen, echte subdienst-namen.
  const categoryItems: HubCategoryItem[] = PRIMARY_SLUGS.map((slug) => {
    const category = realisatieCategories.find((c) => c.slug === slug);
    if (!category) return null;
    const serviceSlug = categoryToServiceSlug[slug];
    return {
      category,
      images: hub.stacksByCategory[slug] ?? [],
      count: hub.countsByCategory[slug] ?? 0,
      subdisciplines: subservices
        .filter((s) => s.parentSlug === serviceSlug)
        .slice(0, 3)
        .map((s) => s.title),
    };
  }).filter((item): item is HubCategoryItem => item !== null);

  // Contexttegels: aantal + beeld uitsluitend uit echt gekoppelde projecten.
  const contextItems: HubContextItem[] = CONTEXTS.map(({ slug, title }) => {
    const category = realisatieCategories.find((c) => c.slug === slug);
    const matches = hub.projects.filter((p) => p.contexts.includes(slug));
    return {
      slug,
      title,
      description: category?.description ?? "",
      image: matches[0] ? { src: matches[0].image, alt: matches[0].imageAlt } : undefined,
      count: matches.length,
    };
  });

  const disciplineOptions = PRIMARY_SLUGS.filter((slug) => (hub.countsByCategory[slug] ?? 0) > 0)
    .filter((slug) => hub.projects.some((p) => p.categorySlug === slug))
    .map((slug) => ({
      slug,
      label: realisatieCategories.find((c) => c.slug === slug)?.name ?? slug,
    }));
  const contextOptions = CONTEXTS.filter(({ slug }) =>
    hub.projects.some((p) => p.contexts.includes(slug)),
  ).map(({ slug, title }) => ({ slug, label: title }));

  // ItemList: de discipline-collecties (unieke, echt bestaande URL's). Losse
  // projecten hebben geen eigen route, dus per project een ListItem zou enkel
  // duplicaat-URL's naar dezelfde categoriepagina opleveren.
  const listedCollections = categoryItems
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: `${item.category.name} realisaties`,
      url: `${businessConfig.url}${localizedPath("nl", `/realisaties/${item.category.slug}/`)}`,
      image: item.images[0]?.src,
    }));

  return (
    <div className="min-h-screen text-white pb-16">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Realisaties", path: "/realisaties" }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}#webpage`,
          url: baseUrl,
          name: "Realisaties van VisualVibe",
          description:
            "Portfolio van VisualVibe: realisaties in webdesign, SEO, fotografie, videografie, drone & FPV, 3D/VR/AR en podcasting voor bedrijven in Limburg en daarbuiten.",
          inLanguage: "nl-BE",
          isPartOf: { "@id": `${businessConfig.url}/#website` },
          about: [
            "Webdesign",
            "Fotografie",
            "Videografie",
            "Dronefotografie",
            "FPV-video",
            "3D-visualisatie",
            "Virtual reality",
            "Podcasting",
          ],
          mainEntity: { "@id": `${baseUrl}#project-list` },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${baseUrl}#project-list`,
          numberOfItems: listedCollections.length,
          itemListElement: listedCollections.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            url: item.url,
            ...(item.image ? { image: item.image } : {}),
          })),
        }}
      />
      <FaqPageJsonLd items={FAQ_ITEMS} />

      <RealisatiesHero stack={hub.heroStack} />
      <RealisatiesAnswerBlock />
      <FeaturedRealisaties featured={hub.featured} />
      <RealisatieHubCategoryGrid items={categoryItems} />

      {/* Recent werk: filters + grid (enkel dit eiland is client-side). */}
      <section id="recent-werk" className="relative scroll-mt-24 py-10 sm:py-14">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="mb-8">
            <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
              <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
              Portfolio
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">Recent werk</h2>
            <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed text-white/65">
              Filter op discipline of projecttype en ontdek projecten die aansluiten bij jouw
              plannen.
            </p>
          </div>
          <RealisatieFilterGrid
            projects={hub.projects}
            disciplines={disciplineOptions}
            contexts={contextOptions}
          />
        </div>
      </section>

      <CompleteTrajectSection
        traject={hub.traject}
        // "Complete trajecten" = context Bedrijven wanneer die projecten heeft.
        ctaHref={contextOptions.some((c) => c.slug === "bedrijven") ? "#werk-bedrijven" : "#recent-werk"}
      />
      <RealisatieContextGrid items={contextItems} />

      <SectorFaq title="Veelgestelde vragen over onze realisaties" items={FAQ_ITEMS} />

      {/* Afsluitende CTA */}
      <section className="relative py-10 sm:py-14">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="flex flex-col items-center gap-5 rounded-[24px] border border-[rgba(255,122,0,0.22)] bg-white/[0.02] px-6 py-12 text-center sm:px-10">
            <h2 className="text-2xl font-bold sm:text-3xl">Een project in gedachten?</h2>
            <p className="max-w-xl text-[15.5px] leading-relaxed text-white/65">
              Vertel ons wat je wilt realiseren. We bekijken welke combinatie van webdesign,
              fotografie, video of digitale media jouw verhaal het sterkst overbrengt.
            </p>
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="/offerte-aanvragen"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black shadow-[0_10px_30px_-8px_rgba(255,117,0,0.6)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
              >
                Bespreek je project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/diensten"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/[0.16] px-6 py-3 font-medium text-white transition-colors hover:border-[rgba(255,117,0,0.5)] sm:w-auto"
              >
                Bekijk onze diensten
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
