import { Link } from "@/i18n/navigation";
import "@/components/media-patterns.css";
import { ArrowRight } from "lucide-react";
import { categoryToServiceSlug, getLocalizedRealisatieCategoryById } from "@/data/realisatieCategories";
import { subservices } from "@/data/subservices";
import { softwareServices } from "@/data/softwareServices";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { localizedPath } from "@/lib/kennisbank/urls";
import { getHubData } from "@/lib/realisaties/hubData";
import { BreadcrumbJsonLd, FaqPageJsonLd, JsonLd } from "@/components/seo";
import { SectorFaq } from "@/components/sectors";
import { RealisatiesHero } from "@/components/realisaties/RealisatiesHero";
import { RealisatiesAnswerBlock } from "@/components/realisaties/RealisatiesAnswerBlock";
import { FeaturedRealisaties } from "@/components/realisaties/FeaturedRealisaties";
import {
  RealisatieHubCategoryGrid,
  type HubCategoryItem,
} from "@/components/realisaties/RealisatieHubCategoryGrid";
import { RealisatieFilterGrid } from "@/components/realisaties/RealisatieFilterGrid";
import { CompleteTrajectSection } from "@/components/realisaties/CompleteTrajectSection";
import {
  RealisatieContextGrid,
  type HubContextItem,
} from "@/components/realisaties/RealisatieContextGrid";
import type { SupportedLocale } from "@/i18n/locales";
import { getLocalizedServiceById } from "@/data/services";

export async function generateMetadata({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  const en = locale === "en";
  return pageMetadata({ locale, title: en ? "Case studies in web, software and visual media | VisualVibe" : "Realisaties in applicaties, webdesign, foto & video | VisualVibe", description: en ? "Explore VisualVibe case studies in applications, SaaS, web design, SEO, photography, videography, drone and FPV, 3D, VR, AR and podcasting." : "Bekijk realisaties van VisualVibe in applicaties, SaaS, webdesign, SEO, fotografie, videografie, drone & FPV, 3D/VR/AR en podcasting.", path: "/realisaties/", languagePaths: { nl: "/realisaties/", en: "/realisaties/" } });
}

// De hub toont Firestore-content (admin-beheerd): net als de categoriepagina's
// periodiek revalideren zodat nieuwe projecten zonder rebuild verschijnen.
export const revalidate = 60;

// Primaire disciplines (volgorde) en context-categorieën.
const PRIMARY_SLUGS = [
  "webdesign",
  "applicaties",
  "fotografie",
  "videografie",
  "drone",
  "3d-vr",
  "podcasting",
];
const CONTEXTS: { slug: string; title: string }[] = [
  { slug: "bedrijven", title: "Bedrijven" },
  { slug: "projecten", title: "Bouw & interieur" },
  { slug: "events", title: "Events" },
  { slug: "sport", title: "Sport" },
  { slug: "buitenland", title: "Buitenland" },
];

const FAQ_ITEMS = [
  {
    question: "Welke soorten realisaties toont VisualVibe?",
    answer:
      "Je vindt hier projecten in applicaties en software op maat, webdesign, SEO, fotografie, videografie, drone en FPV, 3D, VR en AR, podcasting en creatieve content.",
  },
  {
    question: "Tonen jullie bij applicaties ook de backend?",
    answer:
      "Ja. Applicatiecases tonen waar mogelijk zowel de publieke gebruikersflow als dashboards, beheer, automatisering, integraties en server-side architectuur.",
  },
  {
    question: "Kan één project meerdere diensten combineren?",
    answer:
      "Ja. Veel projecten combineren bijvoorbeeld een webapp of website met fotografie, video, SEO, automatisering of backendkoppelingen.",
  },
  {
    question: "Werkt VisualVibe alleen in Limburg?",
    answer:
      "VisualVibe werkt vanuit Limburg voor klanten in Vlaanderen, België, Nederland en voor geselecteerde projecten daarbuiten.",
  },
  {
    question: "Kan ik een gelijkaardig project aanvragen?",
    answer:
      "Ja. Via de offertepagina kun je jouw plannen toelichten. Daarna bekijken we welke disciplines, functies en technische aanpak het beste bij jouw project passen.",
  },
];
const FAQ_ITEMS_EN = [
  { question: "What kinds of case studies does VisualVibe show?", answer: "You will find projects in custom applications and software, web design, SEO, photography, videography, drone and FPV, 3D, VR and AR, podcasting and creative content." },
  { question: "Do application case studies also cover the backend?", answer: "Yes. Where possible, application case studies cover both the public user journey and dashboards, administration, automation, integrations and server-side architecture." },
  { question: "Can one project combine several services?", answer: "Yes. Many projects combine an application or website with photography, video, SEO, automation or backend integrations." },
  { question: "Does VisualVibe only work in Limburg?", answer: "VisualVibe works from Limburg, Belgium, for clients across Flanders, Belgium and the Netherlands, as well as selected projects further afield." },
  { question: "Can I request a similar project?", answer: "Yes. Tell us about your plans on the quotation page. We will then assess which disciplines, features and technical approach best suit your project." },
];

export default async function RealisatiesHubPage({ params }: { params: Promise<{ locale: SupportedLocale }> }) {
  const { locale } = await params;
  const en = locale === "en";
  const faqItems = en ? FAQ_ITEMS_EN : FAQ_ITEMS;
  const hub = await getHubData(locale);
  const baseUrl = `${businessConfig.url}${localizedPath(en ? "en" : "nl", "/realisaties/")}`;

  const categoryItems: HubCategoryItem[] = PRIMARY_SLUGS.map((slug) => {
    const category = getLocalizedRealisatieCategoryById(slug, locale);
    const serviceSlug = categoryToServiceSlug[slug];
    const subdisciplines =
      slug === "applicaties"
        ? (en ? ["Web applications", "SaaS platforms", "Custom software"] : softwareServices.slice(0, 3).map((service) => service.title))
        : subservices
            .filter((service) => service.parentSlug === serviceSlug)
            .slice(0, 3)
            .map((service) => getLocalizedServiceById(service.slug, locale).service.title);

    return {
      category,
      images: hub.stacksByCategory[slug] ?? [],
      count: hub.countsByCategory[slug] ?? 0,
      subdisciplines,
    };
  });

  const contextItems: HubContextItem[] = CONTEXTS.map(({ slug }) => {
    const category = getLocalizedRealisatieCategoryById(slug, locale);
    const matches = hub.projects.filter((project) => project.contexts.includes(slug));
    return {
      slug,
      title: category.name,
      description: category?.description ?? "",
      image: matches[0] ? { src: matches[0].image, alt: matches[0].imageAlt } : undefined,
      count: matches.length,
    };
  });

  const disciplineOptions = PRIMARY_SLUGS.filter(
    (slug) => (hub.countsByCategory[slug] ?? 0) > 0,
  )
    .filter((slug) => hub.projects.some((project) => project.categorySlug === slug))
    .map((slug) => ({
      slug,
      label: getLocalizedRealisatieCategoryById(slug, locale).name,
    }));
  const contextOptions = CONTEXTS.filter(({ slug }) =>
    hub.projects.some((project) => project.contexts.includes(slug)),
  ).map(({ slug }) => ({ slug, label: getLocalizedRealisatieCategoryById(slug, locale).name }));

  const listedCollections = categoryItems
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: `${item.category.name} ${en ? "case studies" : "realisaties"}`,
      url: `${businessConfig.url}${localizedPath(en ? "en" : "nl", `/realisaties/${item.category.slug}/`)}`,
      image: item.images[0]?.src,
    }));

  return (
    <div className="min-h-screen pb-16 text-white">
      <BreadcrumbJsonLd
        locale={locale === "en" ? "en" : "nl"}
        items={[
          { name: "Home", path: "/" },
          { name: en ? "Case studies" : "Realisaties", path: "/realisaties" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}#webpage`,
          url: baseUrl,
          name: en ? "VisualVibe case studies" : "Realisaties van VisualVibe",
          description: en ? "VisualVibe portfolio covering applications, SaaS, web design, SEO, photography, videography, drone and FPV, 3D, VR, AR and podcasting." : "Portfolio van VisualVibe: applicaties, SaaS, webdesign, SEO, fotografie, videografie, drone & FPV, 3D/VR/AR en podcasting.",
          inLanguage: en ? "en-BE" : "nl-BE",
          isPartOf: { "@id": `${businessConfig.url}/#website` },
          about: en ? ["Applications", "Custom software", "SaaS", "Web design", "Photography", "Videography", "Drone photography", "FPV video", "3D visualisation", "Virtual reality", "Podcasting"] : [
            "Applicaties",
            "Software op maat",
            "SaaS",
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
      <FaqPageJsonLd items={faqItems} />

      <RealisatiesHero stack={hub.heroStack} locale={locale} />
      <RealisatiesAnswerBlock locale={locale} />
      <FeaturedRealisaties featured={hub.featured} locale={locale} />
      <RealisatieHubCategoryGrid items={categoryItems} locale={locale} />

      <section id="recent-werk" className="relative scroll-mt-24 py-10 sm:py-14">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="mb-8">
            <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
              <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
              Portfolio
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">{en ? "Recent work" : "Recent werk"}</h2>
            <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed text-white/65">
              {en ? "Filter by discipline or project type and explore work relevant to your plans." : "Filter op discipline of projecttype en ontdek projecten die aansluiten bij jouw plannen."}
            </p>
          </div>
          <RealisatieFilterGrid
            projects={hub.projects}
            disciplines={disciplineOptions}
            contexts={contextOptions}
            locale={locale}
          />
        </div>
      </section>

      <CompleteTrajectSection
        traject={hub.traject}
        ctaHref={contextOptions.some((context) => context.slug === "bedrijven") ? "#werk-bedrijven" : "#recent-werk"}
        locale={locale}
      />
      <RealisatieContextGrid items={contextItems} locale={locale} />

      <SectorFaq title={en ? "Frequently asked questions about our case studies" : "Veelgestelde vragen over onze realisaties"} items={faqItems} />

      <section className="relative py-10 sm:py-14">
        <div className="container mx-auto px-2.5 sm:px-4">
          <div className="flex flex-col items-center gap-5 rounded-[24px] border border-[rgba(255,122,0,0.22)] bg-white/[0.02] px-6 py-12 text-center sm:px-10">
            <h2 className="text-2xl font-bold sm:text-3xl">{en ? "Have a project in mind?" : "Een project in gedachten?"}</h2>
            <p className="max-w-xl text-[15.5px] leading-relaxed text-white/65">
              {en ? "Tell us what you want to create. We will assess which combination of software, web design, photography, video or digital media can move your project forward." : "Vertel ons wat je wilt realiseren. We bekijken welke combinatie van software, webdesign, fotografie, video of digitale media jouw project vooruithelpt."}
            </p>
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={en ? "/request-a-quotation" : "/offerte-aanvragen"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black shadow-[0_10px_30px_-8px_rgba(255,117,0,0.6)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
              >
                {en ? "Discuss your project" : "Bespreek je project"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/diensten"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/[0.16] px-6 py-3 font-medium text-white transition-colors hover:border-[rgba(255,117,0,0.5)] sm:w-auto"
              >
                {en ? "Explore our services" : "Bekijk onze diensten"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
