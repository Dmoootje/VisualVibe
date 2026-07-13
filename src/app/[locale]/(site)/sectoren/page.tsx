import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { sectors } from "@/data/sectors";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { localizedPath } from "@/lib/kennisbank/urls";
import { BreadcrumbJsonLd, FaqPageJsonLd, JsonLd } from "@/components/seo";
import { Section, Container } from "@/components/ui";
import { CTASection } from "@/components/sections";
import { SectorCard, SectorAnswerIntro, SectorFaq, SectorSectionHeader } from "@/components/sectors";
import type { Sector } from "@/types";

export const metadata = pageMetadata({
  title: "Webdesign, fotografie, video en SEO per sector | VisualVibe",
  description:
    "Ontdek hoe VisualVibe bedrijven in tien sectoren versterkt met webdesign, fotografie, video, drone en lokale SEO: van bouw en horeca tot vastgoed en industrie.",
  keywords: [
    "webdesign per sector",
    "marketing per sector",
    "sectorgerichte marketing",
    "fotografie bedrijven Limburg",
    "video per branche",
    "creatieve media agency Limburg",
  ],
  path: "/sectoren/",
});

// Antwoord-eerst blok (AEO/GEO), zelfde vorm als op de sectordetailpagina's.
const ANSWER_INTRO: NonNullable<Sector["answerIntro"]> = {
  title: "Eén creatieve partner voor elke sector",
  text: "VisualVibe combineert webdesign, fotografie, videografie, drone en lokale SEO tot één geheel dat past bij jouw branche. We kennen de uitdagingen van elke sector, van bouwbedrijven die hun realisaties willen tonen tot horecazaken die meer reservaties zoeken, en vertalen die naar een aanpak die klanten oplevert.",
  highlights: [
    {
      title: "Sectorkennis die rendeert",
      text: "We spreken de taal van jouw branche en weten welke beelden, teksten en zoektermen jouw klanten overtuigen.",
    },
    {
      title: "Alles onder één dak",
      text: "Website, foto, video, drone en SEO versterken elkaar omdat ze door één team worden bedacht en uitgevoerd.",
    },
    {
      title: "Lokaal sterk in jouw regio",
      text: "We bouwen zichtbaarheid op waar jouw klanten zoeken: in jouw regio, jouw sector en de kanalen die ertoe doen.",
    },
  ],
};

// Zichtbare FAQ = exact dezelfde items als de FAQPage JSON-LD.
const FAQ_ITEMS = [
  {
    question: "Voor welke sectoren werkt VisualVibe?",
    answer:
      "VisualVibe werkt onder meer voor KMO's, bouw- en renovatiebedrijven, horeca, vastgoed, retail en webshops, events, sportclubs, opleidingen, wellness en industrie.",
  },
  {
    question: "Waarom kiest VisualVibe voor een sectorgerichte aanpak?",
    answer:
      "Elke sector heeft een eigen publiek, eigen zoekgedrag en eigen beeldtaal. Door per sector te werken sluiten website, fotografie, video en SEO beter aan bij wat jouw klanten verwachten.",
  },
  {
    question: "Wat vind ik op een sectorpagina?",
    answer:
      "Elke sectorpagina toont de typische uitdagingen in die branche, de diensten die daarbij passen, echte realisaties en projecten, onze werkwijze en antwoorden op veelgestelde vragen.",
  },
  {
    question: "Mijn sector staat er niet tussen. Kan VisualVibe toch helpen?",
    answer:
      "Zeker. De sectorpagina's tonen onze meest gevraagde branches, maar de aanpak werkt voor elk bedrijf. Neem contact op en we bekijken samen wat jouw sector nodig heeft.",
  },
  {
    question: "In welke regio's is VisualVibe actief?",
    answer:
      "VisualVibe werkt vanuit Limburg voor bedrijven in heel Vlaanderen en Nederlands-Limburg. Voor grotere projecten komen we ook daarbuiten.",
  },
];

// Interne links naar de andere hubs (linkregels uit het contentblueprint).
const EXPLORE_LINKS = [
  {
    href: "/diensten",
    title: "Alle diensten",
    text: "Van webdesign en SEO tot drone en podcasting: ontdek alles wat we voor jouw bedrijf kunnen betekenen.",
  },
  {
    href: "/realisaties",
    title: "Realisaties",
    text: "Bekijk echte projecten in webdesign, fotografie, video en drone, per discipline en per projecttype.",
  },
  {
    href: "/regio",
    title: "Regio's",
    text: "Ontdek waar we actief zijn: van Hasselt en Genk tot heel Vlaanderen en Nederlands-Limburg.",
  },
];

export default function SectorenHubPage() {
  const baseUrl = `${businessConfig.url}${localizedPath("nl", "/sectoren/")}`;

  return (
    <div className="min-h-screen pb-10 pt-28 text-white">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Sectoren", path: "/sectoren" }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}#webpage`,
          url: baseUrl,
          name: "Sectoren waarin VisualVibe uitblinkt",
          description:
            "Overzicht van de sectoren waarvoor VisualVibe webdesign, fotografie, video, drone en lokale SEO verzorgt, van bouw en horeca tot vastgoed en industrie.",
          inLanguage: "nl-BE",
          isPartOf: { "@id": `${businessConfig.url}/#website` },
          about: sectors.map((sector) => sector.title),
          mainEntity: { "@id": `${baseUrl}#sector-list` },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${baseUrl}#sector-list`,
          numberOfItems: sectors.length,
          itemListElement: sectors.map((sector, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: sector.title,
            url: `${businessConfig.url}${localizedPath("nl", `/sectoren/${sector.slug}/`)}`,
          })),
        }}
      />
      <FaqPageJsonLd items={FAQ_ITEMS} />

      <div className="container mx-auto px-2.5 sm:px-4">
        {/* Centered header */}
        <div className="mx-auto mb-[52px] max-w-[640px] text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-5 bg-[#ff7500]" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ff7500]">Overzicht</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Sectoren waarin wij uitblinken
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Tien werelden, één doel: jouw merk laten opvallen met werk dat past bij jouw publiek.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          {sectors.map((sector) => (
            <SectorCard key={sector.slug} sector={sector} />
          ))}
        </div>
      </div>

      <SectorAnswerIntro answer={ANSWER_INTRO} />

      {/* Interne links naar de andere hubs */}
      <Section className="py-10 sm:py-14">
        <Container>
          <SectorSectionHeader
            eyebrow="Ontdek meer"
            title="Verder kijken dan jouw sector"
            intro="Een sectorpagina is een startpunt. Ontdek ook onze diensten, bekijk realisaties of vind jouw regio."
          />
          <div className="grid gap-[18px] md:grid-cols-3">
            {EXPLORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col rounded-[20px] border border-white/[0.09] bg-white/[0.02] p-[26px] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.4)] hover:shadow-[0_20px_55px_-22px_rgba(255,117,0,0.5)]"
              >
                <h3 className="text-xl font-semibold text-white">{link.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/60">{link.text}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#ff7500] transition-all duration-300 group-hover:gap-2.5">
                  Bekijk pagina
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <SectorFaq title="Veelgestelde vragen over onze sectoraanpak" items={FAQ_ITEMS} />

      <CTASection
        title="Jouw sector online versterken?"
        description="Vertel ons in welke branche je actief bent en wat je wilt bereiken. We stellen een aanpak voor die past bij jouw sector, jouw regio en jouw budget."
      />
    </div>
  );
}
