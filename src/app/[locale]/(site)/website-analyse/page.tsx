import Image from "next/image";
import { ArrowRight, CheckCircle2, Gauge, SearchCheck, Sparkles } from "lucide-react";
import { businessConfig } from "@/config/business.config";
import { AnalyseFlow } from "@/components/analyse/AnalyseFlow";
import { WebsiteAnalyseWidget } from "@/components/analyse/WebsiteAnalyseWidget";
import { BreadcrumbJsonLd, FaqPageJsonLd, WebPageJsonLd, type FaqItem } from "@/components/seo";
import { PageAmbient } from "@/components/ui/PageAmbient";
import { getAnalysisIntegrationPublic } from "@/lib/analyse/integration";
import { localizedPath } from "@/lib/kennisbank/urls";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { TOOL_PAGE_IMAGES } from "@/data/toolPageImages";
import { analysisLocale } from "@/lib/analyse/locale";

const PAGE_PATH = "/website-analyse/";
const PAGE_URL = `${businessConfig.url}${localizedPath("nl", PAGE_PATH)}`;

const nlMetadata = pageMetadata({
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
  ogImage: TOOL_PAGE_IMAGES.websiteAnalyse.url,
  ogImageAlt: TOOL_PAGE_IMAGES.websiteAnalyse.alt,
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") return nlMetadata;
  return pageMetadata({
    title: `Free website analysis for SEO and performance | ${businessConfig.displayName}`,
    description: "Run a free website analysis for SEO, speed, technical issues, content and AI search visibility. Get clear priorities from VisualVibe's online tool.",
    keywords: ["free website analysis", "free SEO website analysis", "website performance analysis", "AI search visibility"],
    path: "/website-analysis/", locale: "en", noindex: true,
    ogImage: TOOL_PAGE_IMAGES.websiteAnalyse.url,
    ogImageAlt: "VisualVibe free website analysis for SEO, performance, technical quality and AI search visibility",
  });
}

// De modus en sleutels worden live uit de admin-config gelezen, dus per request
// renderen zodat een wijziging in /admin/settings/analyse meteen zichtbaar is.
export const dynamic = "force-dynamic";

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

export default async function WebsiteAnalysePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: routeLocale } = await params;
  const locale = analysisLocale(routeLocale);
  const integration = await getAnalysisIntegrationPublic();
  const useWidget = integration.mode === "widget";

  if (locale === "en") return <EnglishWebsiteAnalysisPage integration={integration} useWidget={useWidget} />;

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Website analyse", path: "/website-analyse" }]}
      />
      <WebPageJsonLd
        url={PAGE_URL}
        name="Gratis website analyse"
        description="Gratis website analyse van VisualVibe voor SEO, snelheid, techniek, content en AI-vindbaarheid."
        primaryImage={TOOL_PAGE_IMAGES.websiteAnalyse.url}
      />
      <FaqPageJsonLd items={FAQ_ITEMS} />
      <PageAmbient />

      <main className="relative z-10">
        <section className="pb-12 pt-28 sm:pt-32 md:pb-16 md:pt-36">
          <div className="container mx-auto px-2.5 sm:px-4">
            <header className="mx-auto grid max-w-[1120px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
              <div className="text-center lg:text-left">
                <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8a2a]">
                  <span aria-hidden="true" className="h-[1.5px] w-[26px] rounded-full bg-[#ff8a2a]" />
                  Website analyse
                  <span aria-hidden="true" className="h-[1.5px] w-[26px] rounded-full bg-[#ff8a2a]" />
                </p>
                <h1 className="text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl md:text-[62px]">
                  Gratis website analyse
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg lg:mx-0">
                  Vul je website in en ontdek meteen hoe je scoort op SEO, snelheid, techniek,
                  content en AI-vindbaarheid. Je krijgt geen vaag rapport, maar concrete
                  verbeterpunten waarmee je website sterker kan worden in Google én in moderne
                  AI-zoekresultaten.
                </p>
              </div>
              <div className="relative aspect-[1200/630] overflow-hidden rounded-[24px] border border-white/[0.1] bg-white/[0.025] shadow-[0_28px_90px_-44px_rgba(255,117,0,0.72)]">
                <Image
                  src={TOOL_PAGE_IMAGES.websiteAnalyse.url}
                  alt={TOOL_PAGE_IMAGES.websiteAnalyse.alt}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            </header>

            <div className="mx-auto mt-11 max-w-[1120px]">
              {useWidget ? (
                <WebsiteAnalyseWidget
                  scriptSrc={integration.widgetScriptUrl}
                  siteKey={integration.publicKey}
                  locale={locale}
                />
              ) : (
                <AnalyseFlow locale="nl" />
              )}
            </div>

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

const EN_CHECKS = [
  ["Technical SEO", "We review indexability, canonical tags, redirects, robots directives, structured data and the technical signals search engines rely on."],
  ["Performance and Core Web Vitals", "See how loading speed, mobile performance and render-blocking resources affect usability and search visibility."],
  ["Content and search intent", "We check titles, meta descriptions, headings, content structure and how clearly the page answers what visitors are looking for."],
  ["AI search visibility", "The analysis assesses whether your content is clear and structured enough for AI answers, AEO, GEO and modern search experiences."],
  ["Images and accessibility", "We flag missing alt text, oversized images and elements that weaken accessibility or remove useful context."],
  ["Internal links", "We check whether important pages are easy to reach and whether visitors and crawlers have clear routes through your website."],
] as const;

const EN_FAQS: FaqItem[] = [
  { question: "What is a website analysis?", answer: "A website analysis is a focused check of your SEO, performance, technical setup, content and online visibility. It shows what works and where there is room to improve." },
  { question: "Is the website analysis free?", answer: "Yes. VisualVibe's basic website analysis is free and carries no obligation. You receive a score and practical findings that show where your website could be stronger." },
  { question: "What does the analysis check?", answer: "It covers technical SEO, Core Web Vitals, mobile performance, content structure, metadata, images, internal links, structured data and AI search visibility." },
  { question: "Why do I need to confirm my email address?", answer: "Email verification helps prevent abuse and automated spam requests, keeping free analyses available to genuine businesses and website owners." },
  { question: "Can I analyse my website again?", answer: "Yes. Run another analysis after making changes to see whether your score and priorities have changed." },
  { question: "How is this different from a full SEO audit?", answer: "The free analysis is a quick snapshot of the main priorities. A full SEO audit goes deeper into strategy, keywords, competitors, content planning, technical optimisation and conversion opportunities." },
];

function EnglishWebsiteAnalysisPage({ integration, useWidget }: { integration: Awaited<ReturnType<typeof getAnalysisIntegrationPublic>>; useWidget: boolean }) {
  return <div className="relative min-h-screen overflow-hidden text-white">
    <BreadcrumbJsonLd locale="en" items={[{ name: "Home", path: "/" }, { name: "Website analysis", path: "/website-analysis" }]} />
    <WebPageJsonLd url={`${businessConfig.url}/en/website-analysis/`} name="Free website analysis" description="Free VisualVibe website analysis for SEO, performance, technical quality, content and AI search visibility." primaryImage={TOOL_PAGE_IMAGES.websiteAnalyse.url} />
    <FaqPageJsonLd items={EN_FAQS} /><PageAmbient />
    <main className="relative z-10">
      <section className="pb-12 pt-28 sm:pt-32"><div className="container mx-auto px-2.5 sm:px-4"><header className="mx-auto grid max-w-[1120px] items-center gap-8 lg:grid-cols-2"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8a2a]">Website analysis</p><h1 className="text-4xl font-extrabold sm:text-5xl">Free website analysis</h1><p className="mt-5 text-lg leading-relaxed text-white/68">Enter your website to see how it performs across SEO, speed, technical quality, content and AI search visibility. You receive clear priorities, not a vague automated score.</p></div><div className="relative aspect-[1200/630] overflow-hidden rounded-[24px]"><Image src={TOOL_PAGE_IMAGES.websiteAnalyse.url} alt="VisualVibe free website analysis for SEO, performance, technical quality and AI search visibility" fill priority sizes="(max-width: 1023px) 100vw, 600px" className="object-cover" /></div></header><div className="mx-auto mt-11 max-w-[1120px]">{useWidget ? <WebsiteAnalyseWidget scriptSrc={integration.widgetScriptUrl} siteKey={integration.publicKey} locale="en" /> : <AnalyseFlow locale="en" />}</div></div></section>
      <section className="py-12" id="analysis-checks"><div className="container mx-auto px-2.5 sm:px-4"><SectionHeader eyebrow="Checks" title="What does our website analysis check?" intro="The scan looks beyond a handful of SEO tags. It combines technical signals, content quality, performance, accessibility and AI search visibility in one practical report." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{EN_CHECKS.map(([title,text]) => <article key={title} className="rounded-[22px] border border-white/[0.09] bg-white/[0.025] p-6"><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/62">{text}</p></article>)}</div></div></section>
      <section className="py-12"><div className="container mx-auto px-2.5 sm:px-4"><SectionHeader eyebrow="Your report" title="A score with priorities you can act on" intro="The report combines a score out of 100 with checks, strengths and recommendations, helping you separate urgent issues from worthwhile refinements." /><div className="rounded-[26px] border border-white/10 bg-white/[0.025] p-7"><p className="text-5xl font-bold text-green-400">92 <span className="text-xl text-white/45">/ 100</span></p><ul className="mt-5 grid gap-3 sm:grid-cols-2"><li>Clear checks and practical recommendations</li><li>Priorities for SEO, performance, content and AI visibility</li><li>Technical and accessibility signals in one view</li><li>A useful starting point for your next improvements</li></ul></div></div></section>
      <section className="py-12"><div className="container mx-auto px-2.5 sm:px-4"><SectionHeader eyebrow="Next step" title="Free analysis or a full SEO audit?" intro="The free analysis quickly identifies likely obstacles. A full audit goes deeper into keywords, competitors, content, technical architecture, conversion and a prioritised roadmap." /><div className="flex flex-wrap gap-3"><a href="/en/services/seo/" className="rounded-full bg-[#ff7500] px-6 py-3 font-semibold text-black">Explore our SEO service</a><a href="/en/services/web-design/" className="rounded-full border border-white/15 px-6 py-3">Improve your website</a><a href="/en/request-a-quotation/" className="rounded-full border border-white/15 px-6 py-3">Discuss your report</a></div></div></section>
      <section className="py-12"><div className="container mx-auto px-2.5 sm:px-4"><SectionHeader eyebrow="FAQ" title="Frequently asked questions" intro="Straight answers to common questions before you run the analysis." /><div className="grid gap-3 lg:grid-cols-2">{EN_FAQS.map(item => <article key={item.question} className="rounded-2xl border border-white/10 p-5"><h3 className="font-bold">{item.question}</h3><p className="mt-2 text-sm leading-6 text-white/62">{item.answer}</p></article>)}</div></div></section>
    </main>
  </div>;
}
