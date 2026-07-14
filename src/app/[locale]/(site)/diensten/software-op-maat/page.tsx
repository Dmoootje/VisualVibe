import { ArrowRight, Bot, Braces, Database, Layers3, Workflow } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { softwareServices } from "@/data/softwareServices";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/urls";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";
import { CTASection, PageHero } from "@/components/sections";
import { Container, Section } from "@/components/ui";

export const metadata = pageMetadata({
  title: "Software op maat en apps voor KMO's | VisualVibe",
  description:
    "Software op maat voor KMO's: apps, webapplicaties, AI-toepassingen, appdesign en API-koppelingen. Van analyse en prototype tot veilige lancering.",
  keywords: [
    "software op maat",
    "app laten maken",
    "webapplicatie laten maken",
    "AI applicatie laten maken",
    "API koppeling laten maken",
  ],
  path: "/diensten/software-op-maat/",
});

const faqItems = [
  {
    question: "Wat bedoelen jullie met software op maat?",
    answer:
      "Software op maat is een digitale toepassing die rond je eigen gebruikers, gegevens en werkproces wordt ontworpen. Dat kan een webapp, klantenportaal, interne tool, AI-assistent of gerichte koppeling tussen bestaande systemen zijn.",
  },
  {
    question: "Start een maatwerkproject altijd met ontwikkeling?",
    answer:
      "Nee. We beginnen met analyse, afbakening en gebruikersflows. Bij grotere of onzekere ideeën maken we eerst een prototype of MVP, zodat belangrijke keuzes kunnen worden getest voordat de volledige ontwikkeling start.",
  },
  {
    question: "Kunnen jullie bestaande software koppelen?",
    answer:
      "Ja. We bekijken beschikbare API's, gegevensstructuren, rechten en foutscenario's. Soms volstaat een gerichte koppeling; in andere gevallen is een tussenlaag of eigen beheeromgeving nuttiger.",
  },
  {
    question: "Bouwen jullie ook AI-functionaliteit?",
    answer:
      "Ja, wanneer AI een duidelijke taak ondersteunt. Voorbeelden zijn documentanalyse, een kennisassistent, slimme zoekfuncties, classificatie en begeleide automatisering met menselijke controle.",
  },
  {
    question: "Kan software later worden uitgebreid?",
    answer:
      "Daar houden we vanaf de architectuur rekening mee. We werken modulair, documenteren belangrijke keuzes en plannen uitbreidingen op basis van prioriteit en werkelijk gebruik.",
  },
];

const iconBySlug = {
  "app-laten-maken": Layers3,
  "webapplicatie-laten-maken": Database,
  "ai-applicatie-laten-maken": Bot,
  "api-koppelingen-en-automatisering": Workflow,
  "app-design-ux-ui": Braces,
} as const;

const processSteps = [
  {
    step: "01",
    title: "Analyse en afbakening",
    text: "We brengen doel, gebruikers, gegevens, uitzonderingen en bestaande systemen samen in een haalbare eerste scope.",
  },
  {
    step: "02",
    title: "Flow en prototype",
    text: "Belangrijke schermen en processen worden zichtbaar voordat kostbare technische keuzes definitief zijn.",
  },
  {
    step: "03",
    title: "Modulaire ontwikkeling",
    text: "Front-end, back-end, databank en koppelingen worden gefaseerd gebouwd en met echte scenario's getest.",
  },
  {
    step: "04",
    title: "Lancering en groei",
    text: "Na oplevering volgen monitoring, ondersteuning en gerichte doorontwikkeling op basis van gebruik en prioriteit.",
  },
];

export default function SoftwareOpMaatPage() {
  const canonicalUrl = `${businessConfig.url}${localizedPath("nl", "/diensten/software-op-maat/")}`;

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
          { name: "Software op maat", path: "/diensten/software-op-maat" },
        ]}
      />
      <ServiceJsonLd
        service={{
          name: "Software op maat",
          description:
            "Apps, webapplicaties, AI-toepassingen, appdesign en API-koppelingen op maat van KMO's.",
          url: canonicalUrl,
        }}
      />
      <FaqPageJsonLd items={faqItems} />

      <PageHero
        title="Apps en software op maat voor je echte bedrijfsproces"
        subtitle="Van een eerste appidee tot een veilige webapp, AI-toepassing of systeemkoppeling. We ontwerpen eerst de juiste flow en bouwen daarna alleen wat werkelijk waarde toevoegt."
      />

      <Section orbs="tl-br">
        <Container>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
              Van idee tot werkende toepassing
            </p>
            <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
              Welke digitale oplossing heb je nodig?
            </h2>
            <p className="mt-4 leading-relaxed text-white/60">
              Niet elk probleem vraagt een mobiele app en niet elke automatisering vereist een volledig nieuw platform.
              We kiezen de vorm op basis van gebruikers, context, gegevens en gewenste groei.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {softwareServices.map((service) => {
              const Icon = iconBySlug[service.slug as keyof typeof iconBySlug];
              return (
                <Link
                  key={service.slug}
                  href={`/diensten/software-op-maat/${service.slug}/`}
                  className="group flex min-h-[270px] flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition-all hover:-translate-y-1 hover:border-[rgba(255,122,0,0.42)] hover:bg-[rgba(255,122,0,0.055)]"
                >
                  <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-sora text-xl font-extrabold">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/58">{service.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#FF9A45]">
                    Bekijk deze dienst
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section orbs="tr-bl">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 sm:p-10">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">
                Website
              </p>
              <h2 className="mt-3 font-sora text-2xl font-extrabold sm:text-3xl">
                Informeren, overtuigen en aanvragen ontvangen
              </h2>
              <p className="mt-4 leading-relaxed text-white/62">
                Een website presenteert je aanbod, bouwt vertrouwen op en leidt bezoekers naar contact of aankoop. Slimme
                AI-functionaliteiten kunnen die ervaring versterken, maar de publieke klantreis blijft centraal staan.
              </p>
              <Link
                href="/diensten/webdesign/website-met-ai-functionaliteiten/"
                className="mt-6 inline-flex items-center gap-2 font-bold text-[#FF9A45]"
              >
                Website met AI-functionaliteiten
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.055)] p-8 sm:p-10">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">
                Software op maat
              </p>
              <h2 className="mt-3 font-sora text-2xl font-extrabold sm:text-3xl">
                Inloggen, gegevens beheren en processen uitvoeren
              </h2>
              <p className="mt-4 leading-relaxed text-white/68">
                Maatwerksoftware ondersteunt de dagelijkse werking achter of naast je website: planning, dossiers,
                dashboards, offertes, klantenportalen, automatisering en rollen met verschillende toegangsrechten.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section orbs="tl-br">
        <Container>
          <div className="mb-9 max-w-2xl">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
              Onze werkwijze
            </p>
            <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
              Eerst het probleem begrijpen, dan pas code schrijven
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((item) => (
              <div key={item.step} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <span className="font-mono text-sm font-extrabold text-[#FF9A45]">{item.step}</span>
                <h3 className="mt-4 font-sora text-lg font-extrabold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/56">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section orbs="tr-bl">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-sora text-3xl font-extrabold sm:text-4xl">
              Veelgestelde vragen over software op maat
            </h2>
            <div className="mt-8 space-y-3">
              {faqItems.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 open:border-[rgba(255,122,0,0.32)]">
                  <summary className="cursor-pointer list-none pr-8 font-bold text-white marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-4 leading-relaxed text-white/60">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title="Een app- of software-idee dat je concreet wilt maken?"
        description="Vertel ons welk proces, probleem of idee je wilt uitwerken. We helpen de juiste eerste versie afbakenen en geven eerlijk aan wat wel en niet nodig is."
      />
    </div>
  );
}
