import { ArrowRight, CheckCircle2, Gauge, SearchCheck, Sparkles } from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { AnalyseFlow } from "@/components/analyse/AnalyseFlow";
import { WebsiteAnalyseWidget } from "@/components/analyse/WebsiteAnalyseWidget";
import { BreadcrumbJsonLd, FaqPageJsonLd, WebPageJsonLd, type FaqItem } from "@/components/seo";
import { PageAmbient } from "@/components/ui/PageAmbient";
import { getAnalysisIntegrationPublic } from "@/lib/analyse/integration";
import { localizedPath } from "@/lib/kennisbank/urls";
import { pageMetadata } from "@/lib/seo/pageMetadata";

const PAGE_PATH = "/website-analyse/";
const PAGE_URL = `${businessConfig.url}${localizedPath("nl", PAGE_PATH)}`;

export const metadata = pageMetadata({
  title: `Gratis website analyse: SEO, snelheid en techniek | ${businessConfig.displayName}`,
  description:
    "Doe een gratis website analyse en ontdek hoe je website scoort op SEO, snelheid, techniek en AI-vindbaarheid. Ontvang concrete verbeterpunten.",
  keywords: [
    "website analyse",
    "gratis website analyse",
    "SEO check",
    "website SEO analyse",
    "technische SEO audit",
    "website snelheid testen",
    "Core Web Vitals",
    "AI vindbaarheid",
    "GEO analyse",
  ],
  path: PAGE_PATH,
});

// De modus en sleutels worden live uit de admin-config gelezen, dus per request
// renderen zodat een wijziging in /admin/settings/analyse meteen zichtbaar is.
export const dynamic = "force-dynamic";

const HOW_IT_WORKS = [
  "Vul je website-URL en je gegevens in.",
  "Bevestig je e-mailadres met de 6-cijferige code die je van ons ontvangt.",
  "Ontvang meteen je score en een rapport met concrete verbeterpunten.",
];

const CHECKS = [
  {
    title: "Technische SEO",
    text: "We kijken naar indexeerbaarheid, canonical-tags, redirects, robots-instellingen, structured data en technische signalen die zoekmachines nodig hebben.",
  },
  {
    title: "Snelheid & Core Web Vitals",
    text: "Je krijgt zicht op laadtijd, mobiele performance, render-blokkades en signalen die invloed hebben op gebruikservaring en vindbaarheid.",
  },
  {
    title: "Content & zoekintentie",
    text: "We controleren titels, meta descriptions, headings, tekststructuur en of je pagina duidelijk genoeg antwoord geeft op wat bezoekers zoeken.",
  },
  {
    title: "AI-vindbaarheid",
    text: "De analyse bekijkt of je content helder genoeg is voor AI-antwoorden, AEO, GEO en moderne zoekervaringen waarin structuur steeds belangrijker wordt.",
  },
  {
    title: "Afbeeldingen & toegankelijkheid",
    text: "We signaleren ontbrekende alt-teksten, zware afbeeldingen en onderdelen die de toegankelijkheid of context van je pagina kunnen verzwakken.",
  },
  {
    title: "Interne links",
    text: "We kijken of belangrijke pagina's logisch bereikbaar zijn en of je website voldoende duidelijke interne routes heeft voor bezoekers en crawlers.",
  },
];

const REPORT_BENEFITS = [
  "Een duidelijke score op 100, zodat je meteen weet waar je staat.",
  "Concrete meldingen en tips die je open kunt klikken in het rapport.",
  "Prioriteiten: wat is belangrijk, wat is mooi meegenomen en wat kan wachten.",
  "Aanwijzingen voor SEO, techniek, snelheid, content en AI-vindbaarheid.",
];

const COMMON_ISSUES = [
  "Ontbrekende of dubbele meta descriptions",
  "Te lange titels of zwakke H1-structuur",
  "Pagina's die traag laden op mobiel",
  "Geen of onvolledige structured data",
  "Afbeeldingen zonder relevante alt-tekst",
  "Interne links die kansen laten liggen",
  "Content die te weinig antwoordgericht is",
  "Technische signalen die crawlers verwarren",
];

const INTERNAL_LINKS = [
  {
    href: "/be/diensten/seo/",
    title: "SEO laten verbeteren",
    text: "Wil je na de scan concreet aan je vindbaarheid werken? Bekijk onze SEO-aanpak voor Google én AI-zoekmachines.",
  },
  {
    href: "/be/diensten/webdesign/",
    title: "Website laten maken",
    text: "Als techniek, snelheid of structuur de rem is, bouwen we een snelle website die vanaf dag één SEO-klaar staat.",
  },
  {
    href: "/be/offerte-aanvragen/",
    title: "Resultaten bespreken",
    text: "Heb je een rapport en wil je weten wat eerst moet gebeuren? Vraag vrijblijvend advies of een offerte op maat.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Wat is een website analyse?",
    answer:
      "Een website analyse is een snelle controle van je website op SEO, snelheid, techniek, content en vindbaarheid. Je ziet welke onderdelen goed zitten en waar verbeterkansen liggen.",
  },
  {
    question: "Is de website analyse gratis?",
    answer:
      "Ja. De basisanalyse van VisualVibe is gratis en vrijblijvend. Je ontvangt een score en concrete verbeterpunten waarmee je meteen ziet waar je website sterker kan worden.",
  },
  {
    question: "Wat controleert de analyse?",
    answer:
      "De analyse controleert onder meer technische SEO, Core Web Vitals, mobiele snelheid, contentstructuur, meta-informatie, afbeeldingen, interne links, structured data en AI-vindbaarheid.",
  },
  {
    question: "Waarom moet ik mijn e-mailadres bevestigen?",
    answer:
      "We vragen e-mailverificatie om misbruik en automatische spam-aanvragen te voorkomen. Zo blijven de gratis analyses beschikbaar voor echte ondernemers en website-eigenaars.",
  },
  {
    question: "Kan ik mijn website opnieuw analyseren?",
    answer:
      "Ja. Je kunt je website opnieuw analyseren wanneer je aanpassingen hebt gedaan. Zo zie je snel of je score en verbeterpunten veranderd zijn.",
  },
  {
    question: "Wat is het verschil met een volledige SEO-audit?",
    answer:
      "De gratis analyse geeft een snelle momentopname met de belangrijkste verbeterpunten. Een volledige SEO-audit gaat dieper in op strategie, zoekwoorden, concurrenten, contentplanning, technische optimalisatie en conversiekansen.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff7500]">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="mt-4 text-base leading-relaxed text-white/65">{intro}</p>
    </div>
  );
}

export default async function WebsiteAnalysePage() {
  const integration = await getAnalysisIntegrationPublic();
  const useWidget = integration.mode === "widget";

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Website analyse", path: "/website-analyse" }]}
      />
      <WebPageJsonLd
        url={PAGE_URL}
        name="Gratis website analyse"
        description="Gratis website analyse van VisualVibe voor SEO, snelheid, techniek, content en AI-vindbaarheid."
      />
      <FaqPageJsonLd items={FAQ_ITEMS} />
      <PageAmbient />

      <main className="relative z-10">
        <section className="pb-12 pt-28 sm:pt-32 md:pb-16 md:pt-36">
          <div className="container mx-auto px-2.5 sm:px-4">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ff7500]">
                  <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
                  Website analyse
                </p>
                <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-[58px]">
                  Gratis website analyse
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/68">
                  Vul je website in en ontdek meteen hoe je scoort op SEO, snelheid, techniek,
                  content en AI-vindbaarheid. Je krijgt geen vaag rapport, maar concrete
                  verbeterpunten waarmee je website sterker kan worden in Google én in moderne
                  AI-zoekresultaten.
                </p>

                <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
                  {[
                    { value: "100", label: "score op basis van kernsignalen" },
                    { value: "3", label: "gratis analyses per 24 uur" },
                    { value: "SEO", label: "techniek, content en snelheid" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-4"
                    >
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <p className="mt-1 text-xs leading-snug text-white/55">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:pt-10">
                {useWidget ? (
                  <WebsiteAnalyseWidget
                    scriptSrc={integration.widgetScriptUrl}
                    siteKey={integration.publicKey}
                  />
                ) : (
                  <AnalyseFlow />
                )}
              </div>
            </div>

            <section className="mt-12 max-w-3xl" aria-labelledby="hoe-werkt-het">
              <h2 id="hoe-werkt-het" className="mb-5 text-xl font-bold">
                Hoe werkt het?
              </h2>
              <ol className="grid gap-4 md:grid-cols-3">
                {HOW_IT_WORKS.map((step, index) => (
                  <li
                    key={step}
                    className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5"
                  >
                    <span
                      aria-hidden="true"
                      className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-sm font-bold text-[#FF9A45]"
                    >
                      {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-white/70">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="analyse-controles">
          <div className="container mx-auto px-2.5 sm:px-4">
            <SectionHeader
              eyebrow="Controlepunten"
              title="Wat controleert onze website analyse?"
              intro="De scan kijkt breder dan alleen een paar SEO-tags. We combineren technische signalen, contentkwaliteit, snelheid, toegankelijkheid en AI-vindbaarheid tot één begrijpelijk rapport."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {CHECKS.map((check) => (
                <article
                  key={check.title}
                  className="group rounded-[22px] border border-white/[0.09] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.38)] hover:bg-white/[0.04]"
                >
                  <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.1)] text-[#FF9A45]">
                    <SearchCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold text-white">{check.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/62">{check.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="rapport-resultaat">
          <div className="container mx-auto px-2.5 sm:px-4">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <SectionHeader
                  eyebrow="Rapport"
                  title="Wat krijg je in het rapport?"
                  intro="Je ziet niet alleen een score, maar ook meldingen, sterke punten en tips. Ideaal om snel te bepalen of je website vooral technische, inhoudelijke of snelheidsproblemen heeft."
                />
                <a
                  href="#analyse-controles"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[rgba(255,117,0,0.48)] hover:text-[#FF9A45]"
                >
                  Bekijk controlepunten
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div className="rounded-[26px] border border-white/[0.1] bg-[radial-gradient(circle_at_top_left,rgba(255,117,0,0.14),rgba(255,255,255,0.025)_42%,rgba(255,255,255,0.015)_100%)] p-6 shadow-[0_26px_90px_-48px_rgba(255,117,0,0.7)] sm:p-8">
                <div className="mb-7 flex items-end gap-3">
                  <span className="text-6xl font-bold text-green-400">92</span>
                  <span className="pb-2 text-xl text-white/45">/ 100</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {REPORT_BENEFITS.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-4"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-green-400"
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed text-white/68">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="audit-verschil">
          <div className="container mx-auto px-2.5 sm:px-4">
            <div className="rounded-[28px] border border-white/[0.1] bg-white/[0.025] p-6 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#ff7500]">
                    Volgende stap
                  </p>
                  <h2 id="audit-verschil" className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Gratis analyse of volledige SEO-audit?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white/65">
                    De gratis website analyse is perfect om snel knelpunten te vinden. Wil je
                    daarna structureel groeien, dan kijken we dieper naar zoekwoorden, concurrenten,
                    content, techniek, conversie en je volledige website-architectuur.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.09] bg-black/20 p-5">
                    <Gauge className="mb-4 h-6 w-6 text-[#FF9A45]" aria-hidden="true" />
                    <h3 className="font-bold text-white">Gratis analyse</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">
                      Snelle score, concrete meldingen en eerste verbeterpunten voor één website.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[rgba(255,117,0,0.32)] bg-[rgba(255,117,0,0.08)] p-5">
                    <Sparkles className="mb-4 h-6 w-6 text-[#FF9A45]" aria-hidden="true" />
                    <h3 className="font-bold text-white">Volledige SEO-audit</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/68">
                      Strategie, prioriteiten, technische roadmap en groeikansen voor je hele site.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="/be/diensten/seo/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black shadow-[0_10px_30px_-10px_rgba(255,117,0,0.75)] transition-transform hover:-translate-y-0.5"
                >
                  Bekijk SEO-dienst
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="/be/diensten/webdesign/"
                  className="inline-flex items-center justify-center rounded-full border border-white/[0.14] px-6 py-3 font-semibold text-white transition-colors hover:border-[rgba(255,117,0,0.5)]"
                >
                  Website laten verbeteren
                </a>
                <a
                  href="/be/offerte-aanvragen/"
                  className="inline-flex items-center justify-center rounded-full border border-white/[0.14] px-6 py-3 font-semibold text-white transition-colors hover:border-[rgba(255,117,0,0.5)]"
                >
                  Rapport bespreken
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="veelvoorkomende-problemen">
          <div className="container mx-auto px-2.5 sm:px-4">
            <SectionHeader
              eyebrow="Veelvoorkomende fouten"
              title="Problemen die we vaak opsporen"
              intro="Veel websites zien er mooi uit, maar verliezen toch zichtbaarheid door kleine technische of inhoudelijke dingen. De analyse brengt die snel naar boven."
            />
            <ul className="flex flex-wrap gap-3">
              {COMMON_ISSUES.map((issue) => (
                <li
                  key={issue}
                  className="rounded-full border border-white/[0.1] bg-white/[0.025] px-4 py-2 text-sm text-white/68"
                >
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="verder-verbeteren">
          <div className="container mx-auto px-2.5 sm:px-4">
            <SectionHeader
              eyebrow="Verbeteren"
              title="Van scan naar betere resultaten"
              intro="Een analyse is pas waardevol als je er iets mee doet. Daarom linken we meteen door naar de meest logische vervolgstappen binnen VisualVibe."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {INTERNAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex min-h-[210px] flex-col rounded-[22px] border border-white/[0.09] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,117,0,0.4)] hover:bg-white/[0.04]"
                >
                  <h3 className="text-lg font-bold text-white">{link.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/62">{link.text}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#FF9A45] transition-all group-hover:gap-3">
                    Bekijk pagina
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="faq">
          <div className="container mx-auto px-2.5 sm:px-4">
            <SectionHeader
              eyebrow="FAQ"
              title="Veelgestelde vragen"
              intro="Korte antwoorden op de vragen die ondernemers meestal hebben voordat ze hun website laten analyseren."
            />

            <div className="grid gap-3 lg:grid-cols-2">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 open:border-[rgba(255,117,0,0.35)] open:bg-white/[0.04]"
                >
                  <summary className="cursor-pointer list-none text-base font-bold text-white marker:hidden">
                    <span className="flex items-start justify-between gap-4">
                      {item.question}
                      <span
                        aria-hidden="true"
                        className="mt-0.5 text-[#FF9A45] transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-white/64">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
