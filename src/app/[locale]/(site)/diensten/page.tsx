import Image from "next/image";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { services, getServiceBySlug, getLocalizedServiceById, serviceHref } from "@/data/services";
import { regions } from "@/data/regions";
import { FG_HERO_IMAGE, FG_SLIDES } from "@/data/fotografieShowcase";
import { dronePhotos } from "@/data/droneShowcase";
import { matterportTours } from "@/data/matterportTours";
import { businessConfig } from "@/config/business.config";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { localizedPath } from "@/lib/kennisbank/urls";
import { BreadcrumbJsonLd, FaqPageJsonLd, JsonLd, ServiceJsonLd } from "@/components/seo";
import { Section, Container, PageAmbient } from "@/components/ui";
import { CTASection } from "@/components/sections";
import { SectorAnswerIntro, SectorFaq, SectorSectionHeader } from "@/components/sectors";
import { RegionServicesGrid, type FeaturedWork } from "@/components/regio";
import type { Sector } from "@/types";

// Title: 57 chars incl. " | VisualVibe" (55-60 target).
const dutchMetadata = pageMetadata({
  title: "Diensten: webdesign, fotografie, video & SEO | VisualVibe",
  description:
    "Diensten van VisualVibe: webdesign, SEO, fotografie, video, drone, 3D-tours, podcasting en masterclasses. Eén team voor bedrijven in Limburg en Vlaanderen.",
  keywords: [
    "diensten VisualVibe",
    "webdesign Limburg",
    "SEO diensten Limburg",
    "bedrijfsfotografie Limburg",
    "bedrijfsvideo laten maken",
    "drone Limburg",
    "3D tour Limburg",
    "podcast opnemen Limburg",
  ],
  path: "/diensten/",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "en") {
    return pageMetadata({
      locale: "en",
      title: "Services for ambitious businesses | VisualVibe",
      description: "Explore VisualVibe's web design, SEO, photography, video, drone, 3D, podcast and masterclass production services in Limburg, Belgium.",
      path: "/diensten/",
    });
  }
  return dutchMetadata;
}

// Uitgelicht werk per dienst: echte projecten/producties uit de bestaande
// showcase-data (geen verzonnen cases). Beelden zijn Firebase/YouTube-URL's.
const webdesignImage = getServiceBySlug("webdesign")?.seo.ogImage;
const seoImage = getServiceBySlug("seo")?.seo.ogImage;

const FEATURED_WORK: Record<string, FeaturedWork> = {
  webdesign: {
    name: "Gordijnen Myriam",
    sub: "Huisstijl, website, fotografie en SEO + GEO",
    image: webdesignImage,
  },
  seo: {
    name: "Nozeco",
    sub: "SEO rond zonnepanelen en EV-laadstations",
    image: seoImage,
  },
  fotografie: {
    name: "Bedrijfsreportages",
    sub: "Bedrijf, portret, product en event in beeld",
    image: FG_SLIDES[0].image,
  },
  videografie: {
    name: "Zomerspot voor TV Limburg",
    sub: "Promovideo, van concept tot montage",
    image: "https://img.youtube.com/vi/kfjoL_cUTPQ/maxresdefault.jpg",
  },
  "drone-fpv": {
    name: "Dronefotografie",
    sub: "Luchtbeelden voor vastgoed, bouw en events",
    image: dronePhotos[0].src,
  },
  "3d-vr-ar": {
    name: "Navigeerbare 3D-tours",
    sub: `Wandel live door ${matterportTours.length} projecten in 360°`,
  },
  podcasting: {
    name: "Videopodcast-producties",
    sub: "Opname, montage en publicatie in eigen huis",
  },
  masterclasses: {
    name: "Opleiding omzetten in video",
    label: "Uit de kennisbank",
    sub: "Zo film je een masterclass professioneel",
  },
};

// Hero-collage: vier disciplines in beeld, elk klikbaar naar de dienst.
const HERO_TILES = [
  { href: "/diensten/webdesign", label: "Webdesign", image: webdesignImage },
  { href: "/diensten/fotografie", label: "Fotografie", image: FG_SLIDES[1].image },
  {
    href: "/diensten/videografie",
    label: "Videografie",
    image: "https://img.youtube.com/vi/8zGBwfcbX9A/maxresdefault.jpg",
  },
  { href: "/diensten/drone-fpv", label: "Drone & FPV", image: FG_HERO_IMAGE },
].filter((tile): tile is { href: string; label: string; image: string } => Boolean(tile.image));

// Kerncijfers in de hero. 46 = het aantal subdienstpagina's (zie
// scripts/validate-subservices.mjs in de prebuild).
const HERO_STATS = [
  { value: "8", label: "diensten die elkaar versterken" },
  { value: "46", label: "subdiensten met eigen aanpak" },
  { value: "1", label: "team, één aanspreekpunt" },
];

// Antwoord-eerst blok (AEO/GEO), zelfde vorm als op de sectoren- en regiohub.
const ANSWER_INTRO: NonNullable<Sector["answerIntro"]> = {
  title: "Alles voor je online verhaal, onder één dak",
  text: "VisualVibe bundelt acht creatieve diensten: webdesign, SEO, fotografie, videografie, drone & FPV, 3D/VR/AR, podcasting en masterclass-opnames. Het verschil zit in de samenhang: de fotografie past bij je website, de video versterkt je campagne en de SEO zorgt dat dat alles ook gevonden wordt, in Google én in AI-zoekmachines. Zo bouw je geen losse producten, maar één consistent merk dat overal herkenbaar is en klanten oplevert.",
  highlights: [
    {
      title: "Strategie eerst",
      text: "We starten vanuit je doel en doelgroep, niet vanuit een losse dienst. Zo investeer je in wat echt rendeert.",
    },
    {
      title: "Alles in eigen huis",
      text: "Ontwerp, opname, montage en optimalisatie gebeuren door één team, dus stijl en boodschap blijven consistent.",
    },
    {
      title: "Gebouwd om gevonden te worden",
      text: "Elke website en pagina wordt technisch SEO-klaar opgeleverd: zichtbaar in Google én in AI-zoekmachines.",
    },
  ],
};

// Zichtbare FAQ = exact dezelfde items als de FAQPage JSON-LD.
const FAQ_ITEMS = [
  {
    question: "Welke diensten biedt VisualVibe aan?",
    answer:
      "VisualVibe biedt acht hoofddiensten: webdesign, SEO, fotografie, videografie, drone & FPV, 3D/VR/AR, podcasting en masterclass-opnames. Elke dienst heeft eigen subdiensten, van website laten maken en lokale SEO tot bedrijfsvideo en 3D-tours: samen 46 gespecialiseerde pagina's vol uitleg.",
  },
  {
    question: "Wat kost een project bij VisualVibe?",
    answer:
      "Elke offerte is maatwerk: de prijs hangt af van omvang, duur en gewenste afwerking. Een onepager of korte reportage kost minder dan een webshop of bedrijfsfilm met meerdere draaidagen. Vraag een vrijblijvende offerte aan en je krijgt een concreet voorstel op maat.",
  },
  {
    question: "Kan ik meerdere diensten combineren?",
    answer:
      "Ja, dat is zelfs onze kracht. We combineren bijvoorbeeld foto, video en drone in één shoot, of bouwen een website en optimaliseren die meteen met SEO. Omdat alles door één team gebeurt, passen stijl en boodschap altijd bij elkaar.",
  },
  {
    question: "In welke regio's leveren jullie deze diensten?",
    answer:
      "We werken vanuit thuisregio Limburg voor bedrijven in heel Vlaanderen, de provincie Antwerpen en Nederlands-Limburg. Voor grotere projecten komen we ook daarbuiten.",
  },
  {
    question: "Hoe lang duurt een gemiddeld project?",
    answer:
      "Dat verschilt per dienst: voor een website reken je gemiddeld op 3 tot 5 weken, voor een bedrijfsvideo op 3 tot 6 weken, en een fotoshoot of drone-opname plannen we in overleg snel in. Bij de offerte krijg je altijd een concrete planning.",
  },
  {
    question: "Heb ik één aanspreekpunt voor alles?",
    answer:
      "Ja. Je werkt met één team dat strategie, ontwerp, productie en opvolging in eigen huis doet. Dat betekent korte lijnen, één planning en een eindresultaat waarin website, beeld en vindbaarheid op elkaar afgestemd zijn.",
  },
];

// Interne links naar de andere hubs (linkregels uit het contentblueprint).
const EXPLORE_LINKS = [
  {
    href: "/realisaties",
    title: "Realisaties",
    text: "Bekijk echte projecten in webdesign, fotografie, video, drone en 3D, per discipline gebundeld.",
  },
  {
    href: "/sectoren",
    title: "Sectoren",
    text: "Van bouw en horeca tot vastgoed en industrie: zie welke aanpak werkt in jouw branche.",
  },
  {
    href: "/regio",
    title: "Regio's",
    text: "Ontdek waar we actief zijn: van thuisregio Limburg tot heel Vlaanderen en Nederlands-Limburg.",
  },
];

// Meest gekozen dienstcombinaties (redactioneel blok).
const COMBOS = [
  {
    title: "Website + lokale SEO",
    text: "Eerst gevonden worden, dan overtuigen: een snelle website die meteen scoort op lokale zoektermen.",
  },
  {
    title: "Foto + video + drone in één shoot",
    text: "Eén draaidag, drie soorten content: beelden voor je website, socials en campagnes in dezelfde stijl.",
  },
  {
    title: "3D-tour + Google Business Profiel",
    text: "Laat klanten virtueel binnenstappen nog voor ze langskomen, rechtstreeks vanuit je Google-vermelding.",
  },
];

// Subdiensten-runner: chips uit de benefits van alle diensten (ontdubbeld).
const marqueeSubdiensten = Array.from(
  new Set(services.flatMap((service) => service.benefits.slice(0, 4)))
);

const proseLink =
  "font-semibold text-[#FF9A45] underline decoration-[rgba(255,122,0,0.35)] underline-offset-4 transition-colors hover:text-[#ff7500]";

export default async function DienstenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale === "en") return <EnglishServicesPage />;
  const baseUrl = `${businessConfig.url}${localizedPath("nl", "/diensten/")}`;
  const areaServed = regions.map((region) => region.title);
  // Dupliceren zodat de -50% marquee-keyframe naadloos doorloopt.
  const runner = [...marqueeSubdiensten, ...marqueeSubdiensten];

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Diensten", path: "/diensten" }]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${baseUrl}#webpage`,
          url: baseUrl,
          name: "Diensten van VisualVibe",
          description:
            "Overzicht van alle diensten van VisualVibe: webdesign, SEO, fotografie, videografie, drone & FPV, 3D/VR/AR, podcasting en masterclass-opnames.",
          inLanguage: "nl-BE",
          isPartOf: { "@id": `${businessConfig.url}/#website` },
          about: services.map((service) => service.title),
          mainEntity: { "@id": `${baseUrl}#diensten-list` },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${baseUrl}#diensten-list`,
          numberOfItems: services.length,
          itemListElement: services.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: service.title,
            url: `${businessConfig.url}${localizedPath("nl", `${serviceHref(service)}/`)}`,
          })),
        }}
      />
      {services.map((service) => (
        <ServiceJsonLd
          key={service.slug}
          service={{
            name: service.title,
            description: service.excerpt,
            url: `${businessConfig.url}${localizedPath("nl", `${serviceHref(service)}/`)}`,
            areaServed,
          }}
        />
      ))}
      <FaqPageJsonLd items={FAQ_ITEMS} />

      {/* Eén doorlopende, paginabrede achtergrond; alle secties zijn transparant. */}
      <PageAmbient />

      <div className="relative z-10">
        {/* Hero: copy + kerncijfers links, beeldcollage van vier disciplines rechts. */}
        <section className="relative overflow-x-clip pb-8 pt-28 sm:pt-32">
          {/* Vaag raster dat richting de collage (rechtsboven) invloeit. */}
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
                  Diensten
                </p>

                <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-[52px]">
                  Creatieve diensten voor bedrijven die beter zichtbaar willen zijn
                </h1>

                <p className="mt-5 max-w-[540px] text-lg leading-relaxed text-white/65">
                  VisualVibe bundelt acht diensten onder één dak: webdesign, SEO, fotografie,
                  videografie, drone & FPV, 3D/VR/AR, podcasting en masterclass-opnames. Eén team
                  dat je website, beelden en vindbaarheid op elkaar afstemt, voor bedrijven in
                  Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg.
                </p>

                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/offerte-aanvragen"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black shadow-[0_10px_30px_-8px_rgba(255,117,0,0.6)] transition-transform hover:-translate-y-0.5"
                  >
                    Offerte aanvragen
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

              {/* Rechts: 2x2-collage van echte beelden per discipline, elk klikbaar. */}
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,117,0,0.14),transparent_65%)] blur-xl"
                />
                <div className="relative grid grid-cols-2 gap-3.5 sm:gap-4">
                  {HERO_TILES.map((tile, i) => (
                    <Link
                      key={tile.href}
                      href={tile.href}
                      className={`group relative aspect-[5/4] overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/60 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.45)] hover:shadow-[0_18px_50px_-18px_rgba(255,117,0,0.55)] ${
                        i % 2 === 1 ? "sm:translate-y-5" : ""
                      }`}
                    >
                      <Image
                        src={tile.image}
                        alt={`${tile.label} door VisualVibe`}
                        fill
                        sizes="(max-width: 768px) 50vw, 24vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                      />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/70 px-3 py-1.5 text-[12px] font-semibold text-white/85 backdrop-blur-sm">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#ff7500]" />
                        {tile.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Subdiensten-runner: alle specialisaties in één oogopslag. */}
            <div className="relative z-[1] mt-12">
              <span className="mb-3.5 block text-[11.5px] font-bold uppercase tracking-[0.15em] text-white/40">
                46 subdiensten, o.a.
              </span>
              <div
                className="vv-mq-contain relative left-1/2 w-screen -translate-x-1/2"
                aria-label="Subdiensten van VisualVibe"
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

        {/* De acht diensten als bento, elk met een uitgelichte realisatie. */}
        <section className="relative py-10 sm:py-14">
          <Container>
            <SectorSectionHeader
              eyebrow="Aanbod"
              title="Acht diensten, één samenhangend geheel"
              intro="Elke dienstpagina toont de subdiensten, onze werkwijze, echte realisaties en antwoorden op veelgestelde vragen. Onderaan elke kaart zie je alvast één uitgelicht project."
            />
            <RegionServicesGrid services={services} featuredWork={FEATURED_WORK} />
          </Container>
        </section>

        {/* Antwoord-eerst blok (AEO/GEO). */}
        <SectorAnswerIntro answer={ANSWER_INTRO} />

        {/* Redactioneel: de juiste dienst kiezen + sterke combinaties. */}
        <Section className="py-10 sm:py-14">
          <Container>
            <SectorSectionHeader
              eyebrow="Wegwijzer"
              title="Hoe kies je de juiste dienst?"
              intro="Niet zeker waar je moet starten? Vertrek vanuit wat je wilt bereiken; wij vertalen dat naar de juiste combinatie van website, beeld en vindbaarheid."
            />
            <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
              <div className="space-y-4 text-[15.5px] leading-[1.75] text-white/70">
                <h3 className="text-lg font-bold text-white">
                  Start vanuit je doel, niet vanuit het middel
                </h3>
                <p>
                  Meer aanvragen, sneller personeel vinden, een nieuw product lanceren of gewoon
                  professioneler ogen: elk doel vraagt een andere mix. Wie lokaal gevonden wil
                  worden, start meestal met een sterke{" "}
                  <Link href="/diensten/webdesign/website-laten-maken" className={proseLink}>
                    website
                  </Link>{" "}
                  en{" "}
                  <Link href="/diensten/seo/lokale-seo" className={proseLink}>
                    lokale SEO
                  </Link>
                  . Wie vertrouwen wil wekken, zet in op{" "}
                  <Link href="/diensten/fotografie/bedrijfsfotografie" className={proseLink}>
                    bedrijfsfotografie
                  </Link>{" "}
                  en een{" "}
                  <Link href="/diensten/videografie/bedrijfsvideo" className={proseLink}>
                    bedrijfsvideo
                  </Link>{" "}
                  die tonen wie er achter je zaak zit.
                </p>
                <p>
                  Twijfel je? Bekijk per dienst de subdiensten, veelgestelde vragen en realisaties,
                  of vraag meteen een vrijblijvende{" "}
                  <Link href="/offerte-aanvragen" className={proseLink}>
                    offerte
                  </Link>{" "}
                  aan: we denken graag mee over de beste volgorde voor jouw budget.
                </p>
              </div>
              <div className="space-y-4 text-[15.5px] leading-[1.75] text-white/70">
                <h3 className="text-lg font-bold text-white">
                  Waarom diensten combineren zo goed werkt
                </h3>
                <p>
                  De beste resultaten ontstaan wanneer diensten elkaar versterken. Een nieuwe
                  website presteert beter met professionele foto&apos;s en een korte video, en
                  diezelfde beelden voeden maandenlang je social media. Eén draaidag levert zo
                  materiaal op voor je hele communicatie.
                </p>
                <p>
                  Daarom plannen we slim: foto, video en drone combineren we waar mogelijk in één
                  shoot, en elke website bouwen we meteen SEO-klaar op. Bekijk onze{" "}
                  <Link href="/realisaties" className={proseLink}>
                    realisaties
                  </Link>{" "}
                  of ontdek per{" "}
                  <Link href="/sectoren" className={proseLink}>
                    sector
                  </Link>{" "}
                  wat werkt, van{" "}
                  <Link href="/sectoren/bouw-renovatie" className={proseLink}>
                    bouw
                  </Link>{" "}
                  tot{" "}
                  <Link href="/sectoren/horeca" className={proseLink}>
                    horeca
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Meest gekozen combinaties */}
            <div className="mt-10 grid gap-[18px] md:grid-cols-3">
              {COMBOS.map((combo, i) => (
                <div
                  key={combo.title}
                  className="rounded-[17px] border border-white/[0.09] bg-white/[0.02] p-6"
                >
                  <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] font-mono text-xs font-bold text-[#FF9A45]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mb-2 text-[16px] font-bold text-white">{combo.title}</h3>
                  <p className="text-[14px] leading-relaxed text-white/60">{combo.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Interne links naar de andere hubs */}
        <Section className="py-10 sm:py-14">
          <Container>
            <SectorSectionHeader
              eyebrow="Ontdek meer"
              title="Verder kijken dan één dienst"
              intro="Een dienstpagina is een startpunt. Bekijk ook onze realisaties, vind jouw sector of ontdek waar we actief zijn."
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

        <SectorFaq title="Veelgestelde vragen over onze diensten" items={FAQ_ITEMS} />

        <CTASection
          title="Niet zeker welke dienst je nodig hebt?"
          description="Vertel ons wat je wilt bereiken en we stellen de juiste combinatie voor: passend bij jouw doel, jouw sector en jouw budget."
        />
      </div>
    </div>
  );
}

function EnglishServicesPage() {
  const englishServices = services.map((service) => getLocalizedServiceById(service.slug, "en"));
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd locale="en" items={[{ name: "Home", path: "/" }, { name: "Services", path: "/diensten" }]} />
      <PageAmbient />
      <main className="relative z-10">
        <section className="pb-14 pt-32">
          <Container>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">Services</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">Creative services for businesses that want to stand out</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">VisualVibe brings web design, SEO, photography, video production, drone footage, immersive 3D experiences, podcasting and masterclass production together in one team. Strategy, technology and visual content therefore support the same business goal.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/offerte-aanvragen" className="inline-flex items-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black">Request a quotation <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/realisaties" className="rounded-full border border-white/15 px-6 py-3 font-semibold">View our work</Link>
            </div>
          </Container>
        </section>
        <section className="pb-20">
          <Container>
            <h2 className="mb-8 text-3xl font-bold">Eight services, one consistent direction</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {englishServices.map(({ id, slug, service }) => (
                <Link key={id} href={`/diensten/${slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#ff7500]/50">
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{service.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#ff9a45]">Explore this service <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
        <CTASection title="Ready to bring your project to life?" description="Tell us what you want to achieve. We will recommend a practical combination of services and prepare a tailored quotation." primaryLabel="Discuss your project" primaryHref="/offerte-aanvragen" />
      </main>
    </div>
  );
}
