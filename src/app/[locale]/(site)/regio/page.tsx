import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { regions } from "@/data/regions";
import { regionMunicipalities } from "@/data/regionMunicipalities";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { localizedPath } from "@/lib/kennisbank/urls";
import { BreadcrumbJsonLd, FaqPageJsonLd, JsonLd } from "@/components/seo";
import { Section, Container } from "@/components/ui";
import { CTASection } from "@/components/sections";
import { SectorAnswerIntro, SectorFaq, SectorSectionHeader } from "@/components/sectors";
import { RegionAmbient, RegionHubCard } from "@/components/regio";
import { RegionMiniMap } from "@/features/home/RegionIntro/components/RegionMiniMap";
import type { Sector } from "@/types";
import type { Metadata } from "next";
import type { SupportedLocale } from "@/i18n/locales";
import { getLocalizedRegionById } from "@/data/regions";
import { englishRegionHub } from "@/data/locales/en/regionSectorHubs";

const dutchMetadata = pageMetadata({
  title: "Regio's: van Limburg tot Nederlands-Limburg | VisualVibe",
  description:
    "VisualVibe werkt vanuit thuisregio Limburg voor bedrijven in Vlaanderen, Antwerpen en Nederlands-Limburg: webdesign, SEO, fotografie, video, drone en 3D-tours.",
  keywords: [
    "mediabureau Limburg",
    "webdesign Limburg",
    "fotograaf Limburg",
    "webdesign Vlaanderen",
    "fotograaf Antwerpen",
    "webdesign Nederlands-Limburg",
  ],
  path: "/regio/",
});

// Antwoord-eerst blok (AEO/GEO), zelfde vorm als op de sectorenhub.
const ANSWER_INTRO: NonNullable<Sector["answerIntro"]> = {
  title: "Eén creatieve partner, geworteld in Limburg",
  text: "VisualVibe is een creatief mediabureau uit Limburg. We bouwen websites, verzorgen lokale SEO en maken fotografie, video, dronebeelden en 3D-tours voor KMO's en organisaties. Onze thuisregio is Limburg, met klanten van Hasselt en Genk tot Tongeren en Sint-Truiden. Daarnaast werken we in heel Vlaanderen, in de provincie Antwerpen en net over de grens in Nederlands-Limburg. Door regionaal te werken kennen we de markt, de mensen en de plekken die jouw verhaal sterker maken, en dat zie je terug in elk project.",
  highlights: [
    {
      title: "Thuisregio Limburg",
      text: "Onze basis en ons grootste werkgebied: hier kennen we elke gemeente, van de mijnstreek tot Haspengouw, en schakelen we het snelst.",
    },
    {
      title: "Vlaanderen en Antwerpen",
      text: "Voor webdesign, fotografie en video werken we in heel Vlaanderen, en in de provincie Antwerpen groeit ons werkgebied elk jaar.",
    },
    {
      title: "Nederlands-Limburg",
      text: "Van Maastricht tot Venlo helpen we ook Nederlandse bedrijven aan sterke websites en beelden, zonder gedoe over de grens.",
    },
  ],
};

// Zichtbare FAQ = exact dezelfde items als de FAQPage JSON-LD.
const FAQ_ITEMS = [
  {
    question: "In welke regio's is VisualVibe actief?",
    answer:
      "VisualVibe werkt vanuit thuisregio Limburg voor bedrijven in heel Vlaanderen, de provincie Antwerpen en Nederlands-Limburg. Voor grotere projecten komen we ook daarbuiten.",
  },
  {
    question: "Wat is de thuisregio van VisualVibe?",
    answer:
      "Belgisch-Limburg. Ons team is er geworteld en werkt voor klanten van Hasselt, Genk en Bilzen tot Tongeren, Sint-Truiden en Maasmechelen. Hier schakelen we het snelst en kennen we de lokale markt het best.",
  },
  {
    question: "Werken jullie ook in Nederland?",
    answer:
      "Ja. In Nederlands-Limburg helpen we bedrijven van Maastricht, Sittard-Geleen en Heerlen tot Roermond, Venlo en Weert met webdesign, fotografie, videografie en dronebeelden.",
  },
  {
    question: "Komen jullie ter plaatse voor fotografie of video?",
    answer:
      "Zeker. Fotografie, video en drone-opnames gebeuren op locatie: bij jou in de zaak, op de werf of op een plek in de regio die bij je merk past. Verplaatsingen binnen ons werkgebied plannen we gewoon mee in het project.",
  },
  {
    question: "Waarom heeft niet elke stad een eigen pagina?",
    answer:
      "We bouwen alleen pagina's met echte, unieke inhoud. Regiopagina's bundelen wat we in een streek doen; stadspagina's volgen zodra er genoeg eigen projecten en verhalen zijn om ze waardevol te maken. Zo vind je altijd relevante informatie in plaats van kopieën.",
  },
  {
    question: "Mijn regio staat er niet tussen. Kan VisualVibe toch helpen?",
    answer:
      "Vaak wel. De vier regio's zijn ons kernwerkgebied, maar voor grotere projecten in webdesign, video of drone werken we ook elders in België en Nederland. Neem contact op en we bekijken het samen.",
  },
];

// Interne links naar de andere hubs (linkregels uit het contentblueprint).
const EXPLORE_LINKS = [
  {
    href: "/diensten",
    title: "Alle diensten",
    text: "Van webdesign en lokale SEO tot fotografie, video, drone en 3D: ontdek wat we voor jouw bedrijf kunnen betekenen.",
  },
  {
    href: "/realisaties",
    title: "Realisaties",
    text: "Bekijk projecten uit Limburg en daarbuiten: websites, fotografie, video en drone, per discipline gebundeld.",
  },
  {
    href: "/sectoren",
    title: "Sectoren",
    text: "Van bouw en horeca tot vastgoed en industrie: zie hoe we per sector werken, in elke regio.",
  },
];

// Kerncijfers in de hero. 80+ komt uit regionMunicipalities (86 vermeldingen,
// ~80 unieke gemeentes over de vier regio's heen).
const HERO_STATS = [
  { value: "4", label: "regio's in België en Nederland" },
  { value: "80+", label: "gemeentes waarin we werken" },
  { value: "1", label: "team voor web, beeld en SEO" },
];

// Gemeente-runner: mix van de vier regio's (eerste 9 per regio, ontdubbeld).
const marqueeMunicipalities = Array.from(
  new Set(regions.flatMap((region) => (regionMunicipalities[region.slug] ?? []).slice(0, 9)))
);

const proseLink =
  "font-semibold text-[#FF9A45] underline decoration-[rgba(255,122,0,0.35)] underline-offset-4 transition-colors hover:text-[#ff7500]";

function DutchRegioHubPage() {
  const baseUrl = `${businessConfig.url}${localizedPath("nl", "/regio/")}`;
  // Dupliceren zodat de -50% marquee-keyframe naadloos doorloopt.
  const runner = [...marqueeMunicipalities, ...marqueeMunicipalities];

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Regio", path: "/regio" }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}#webpage`,
          url: baseUrl,
          name: "In welke regio's is VisualVibe actief?",
          description:
            "Overzicht van de regio's waar VisualVibe webdesign, SEO, fotografie, video, drone en 3D-tours verzorgt: Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg.",
          inLanguage: "nl-BE",
          isPartOf: { "@id": `${businessConfig.url}/#website` },
          about: regions.map((region) => region.title),
          mainEntity: { "@id": `${baseUrl}#regio-list` },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${baseUrl}#regio-list`,
          numberOfItems: regions.length,
          itemListElement: regions.map((region, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: region.title,
            url: `${businessConfig.url}${localizedPath("nl", `/regio/${region.slug}/`)}`,
          })),
        }}
      />
      <FaqPageJsonLd items={FAQ_ITEMS} />

      {/* Eén doorlopende, paginabrede achtergrond; alle secties zijn transparant. */}
      <RegionAmbient />

      <div className="relative z-10">
        {/* Hero: copy + kerncijfers links, de Limburg-kaart (thuisbasis) rechts. */}
        <section className="relative overflow-x-clip pb-8 pt-28 sm:pt-32">
          {/* Vaag raster dat richting de kaart (rechtsboven) invloeit. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              WebkitMaskImage: "radial-gradient(ellipse at 70% 40%, #000, transparent 74%)",
              maskImage: "radial-gradient(ellipse at 70% 40%, #000, transparent 74%)",
            }}
          />

          <div className="container relative z-10 mx-auto">
            <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
              {/* Links: copy */}
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
                  <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
                  Ons werkgebied
                </p>

                <h1 className="text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-[56px]">
                  In welke regio&apos;s zijn we actief?
                </h1>

                <p className="mt-5 max-w-[520px] text-lg leading-relaxed text-white/65">
                  VisualVibe is een creatief mediabureau met thuisbasis in Limburg. Van daaruit
                  werken we voor bedrijven in heel Vlaanderen, de provincie Antwerpen en
                  Nederlands-Limburg: webdesign, lokale SEO, fotografie, videografie, drone en 3D,
                  altijd dicht bij jouw markt.
                </p>

                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/offerte-aanvragen"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black shadow-[0_10px_30px_-8px_rgba(255,117,0,0.6)] transition-transform hover:-translate-y-0.5"
                  >
                    Start je project
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/realisaties"
                    className="inline-flex items-center justify-center rounded-full border border-white/[0.16] px-6 py-3 font-medium text-white transition-colors hover:border-[rgba(255,117,0,0.5)]"
                  >
                    Bekijk realisaties
                  </Link>
                </div>

                {/* Kerncijfers */}
                <dl className="mt-9 grid max-w-[520px] grid-cols-3 gap-3">
                  {HERO_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/[0.09] bg-white/[0.02] px-4 py-3.5"
                    >
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="text-2xl font-bold text-white">{stat.value}</dd>
                      <dd className="mt-1 text-[12px] leading-snug text-white/55">{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Rechts: de Limburg-kaart (thuisbasis), groot, met pulserende marker. */}
              <div className="flex justify-center md:justify-end">
                <div className="group relative aspect-[6/5] w-full max-w-[560px]">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,117,0,0.18),transparent_65%)] blur-xl"
                  />
                  <RegionMiniMap slug="limburg" />
                  <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-neutral-950/70 px-4 py-2 text-[12.5px] font-semibold text-white/80 backdrop-blur-sm md:left-auto md:right-6 md:translate-x-0">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#ff7500]" />
                    Thuisbasis: Limburg
                  </span>
                </div>
              </div>
            </div>

            {/* Gemeente-runner: "Actief in o.a." over de vier regio's heen. */}
            <div className="relative z-[1] mt-10 md:mt-4">
              <span className="mb-3.5 block text-[11.5px] font-bold uppercase tracking-[0.15em] text-white/40">
                Actief in o.a.
              </span>
              <div
                className="vv-mq-contain relative left-1/2 w-screen -translate-x-1/2"
                aria-label="Gemeentes waarin VisualVibe actief is"
              >
                <div className="vv-mq-track vv-mq-l">
                  {runner.map((name, i) => (
                    <span
                      key={`${name}-${i}`}
                      className="inline-flex flex-none items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.02] px-[18px] py-[9px] text-sm font-semibold text-white/[0.78]"
                    >
                      <span className="h-[5px] w-[5px] flex-none rounded-full bg-[#ff7500]" />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* De vier regio's, elk met hun echte kaart. */}
        <section className="relative py-10 sm:py-14">
          <Container>
            <SectorSectionHeader
              eyebrow="Werkgebied"
              title="Kies jouw regio"
              intro="Elke regiopagina toont wat we er doen, in welke gemeentes we actief zijn en welke diensten er het meest gevraagd worden. Klik door naar jouw regio voor een aanpak op maat."
            />
            <div className="grid gap-5 md:grid-cols-2">
              {regions.map((region) => (
                <RegionHubCard key={region.slug} region={region} />
              ))}
            </div>
          </Container>
        </section>

        {/* Antwoord-eerst blok (AEO/GEO). */}
        <SectorAnswerIntro answer={ANSWER_INTRO} />

        {/* Redactioneel: waarom regionaal werken loont + hoe we het aanpakken. */}
        <Section className="py-10 sm:py-14">
          <Container>
            <SectorSectionHeader
              eyebrow="Regionaal sterk"
              title="Waarom werken met een mediabureau uit jouw regio?"
              intro="Een website of video kan overal gemaakt worden, maar zichtbaarheid wordt lokaal gewonnen. Wie jouw regio kent, maakt content die klopt: de juiste zoektermen, herkenbare locaties en beelden die jouw klanten vertrouwen."
            />
            <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
              <div className="space-y-4 text-[15.5px] leading-[1.75] text-white/70">
                <h3 className="text-lg font-bold text-white">
                  Dicht bij jouw markt, dicht bij jouw klanten
                </h3>
                <p>
                  Klanten zoeken zelden naar een dienst alleen: ze zoeken een webdesigner in
                  Hasselt, een fotograaf in Genk of een videograaf in de buurt van Antwerpen.
                  Daarom bouwen we onze aanpak rond jouw regio. Met doordachte{" "}
                  <Link href="/diensten/seo/lokale-seo" className={proseLink}>
                    lokale SEO
                  </Link>{" "}
                  zorgen we dat je gevonden wordt waar jouw klanten echt zoeken, en met{" "}
                  <Link href="/diensten/fotografie" className={proseLink}>
                    fotografie
                  </Link>{" "}
                  en{" "}
                  <Link href="/diensten/videografie" className={proseLink}>
                    video
                  </Link>{" "}
                  op locatie tonen we jouw zaak zoals ze echt is.
                </p>
                <p>
                  Die nabijheid heeft ook praktische voordelen. Shoots plannen we snel in, een
                  extra opnamedag of een tussentijds overleg is zo geregeld, en we kennen de
                  plekken die jouw beelden sterker maken: van het industriële decor van de
                  mijnstreek tot de Maasvallei en het Haspengouwse landschap.
                </p>
              </div>
              <div className="space-y-4 text-[15.5px] leading-[1.75] text-white/70">
                <h3 className="text-lg font-bold text-white">
                  Hoe pakken we een project in jouw regio aan?
                </h3>
                <p>
                  Elk project start met een kennismaking, bij jou op locatie of online. We bekijken
                  samen waar je vandaag staat, wie je wilt bereiken en welke combinatie van
                  website, beeld en SEO daarvoor nodig is. Daarna volgt een concreet voorstel met
                  een duidelijke planning.
                </p>
                <p>
                  Vervolgens gaan we aan de slag: we ontwerpen en bouwen je{" "}
                  <Link href="/diensten/webdesign" className={proseLink}>
                    website
                  </Link>
                  , plannen shoots op locatie en werken alles af tot één samenhangend geheel.
                  Bekijk onze{" "}
                  <Link href="/realisaties" className={proseLink}>
                    realisaties
                  </Link>{" "}
                  om te zien wat dat oplevert, of neem{" "}
                  <Link href="/contact" className={proseLink}>
                    contact
                  </Link>{" "}
                  op om jouw project te bespreken.
                </p>
              </div>
            </div>

            {/* Regiohub-eerst: eerlijk over waarom er geen dunne stadspagina's zijn. */}
            <div className="mt-10 rounded-[17px] border border-white/[0.09] bg-white/[0.02] p-6 sm:p-7">
              <h3 className="text-[16px] font-bold text-white">
                Bewust geen dunne stadspagina&apos;s
              </h3>
              <p className="mt-2.5 max-w-3xl text-[14.5px] leading-relaxed text-white/60">
                We kiezen voor volwaardige regiopagina&apos;s in plaats van tientallen bijna
                identieke stadspagina&apos;s. Elke regiopagina bundelt echte informatie: de
                diensten die er het meest gevraagd worden, de gemeentes waarin we werken en
                projecten uit de streek. Zodra een stad genoeg eigen verhalen en cases heeft,
                krijgt ze een eigen pagina met unieke inhoud.
              </p>
            </div>
          </Container>
        </Section>

        {/* Interne links naar de andere hubs */}
        <Section className="py-10 sm:py-14">
          <Container>
            <SectorSectionHeader
              eyebrow="Ontdek meer"
              title="Verder kijken dan jouw regio"
              intro="Een regiopagina is een startpunt. Ontdek ook onze diensten, bekijk realisaties of vind jouw sector."
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

        <SectorFaq title="Veelgestelde vragen over ons werkgebied" items={FAQ_ITEMS} />

        <CTASection
          title="Samenwerken in jouw regio?"
          description="Vertel ons waar je gevestigd bent en wat je wilt bereiken. We stellen een aanpak voor die past bij jouw regio, jouw sector en jouw budget."
        />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: SupportedLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "nl") return dutchMetadata;
  if (locale !== "en") throw new Error(`Missing ${locale} regions hub translation`);
  return pageMetadata({ locale, ...englishRegionHub.seo, path: "/regio/" });
}

export default async function RegioHubPage({
  params,
}: {
  params: Promise<{ locale: SupportedLocale }>;
}) {
  const { locale } = await params;
  if (locale === "nl") return <DutchRegioHubPage />;
  if (locale !== "en") throw new Error(`Missing ${locale} regions hub translation`);

  const localizedRegions = regions.map((region) => getLocalizedRegionById(region.slug, locale));

  return (
    <div className="relative min-h-screen overflow-hidden pb-16 pt-28 text-white">
      <RegionAmbient />
      <main className="container relative z-10 mx-auto">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">Service areas</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{englishRegionHub.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-white/65">{englishRegionHub.summary}</p>
          <p className="mt-4 text-base leading-relaxed text-white/75">{englishRegionHub.directAnswer}</p>
        </header>

        <section className="mt-14 grid gap-5 md:grid-cols-2" aria-label="VisualVibe service areas">
          {localizedRegions.map((region) => (
            <Link
              key={region.id}
              href={`/regio/${region.slug}`}
              className="rounded-[22px] border border-white/10 bg-neutral-950/60 p-7 transition-colors hover:border-[rgba(255,117,0,0.4)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ff7500]">
                {region.type === "province" ? "Home region" : "Service area"}
              </p>
              <h2 className="mt-3 text-2xl font-bold">{region.title}</h2>
              <p className="mt-3 leading-relaxed text-white/65">{region.intro}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#ff7500]">
                Explore {region.title}<ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </section>

        <CTASection
          title={englishRegionHub.cta.title}
          description={englishRegionHub.cta.description}
          primaryLabel={englishRegionHub.cta.label}
          primaryHref="/offerte-aanvragen"
        />
      </main>
    </div>
  );
}
