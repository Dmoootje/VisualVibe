import { ArrowRight, Bot, Braces, Database, Layers3, Workflow } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getSoftwareServices, softwareServiceHref, softwareServiceHubHref } from "@/data/softwareServices";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/urls";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";
import { CTASection, PageHero } from "@/components/sections";
import { Container, Section } from "@/components/ui";

import type { SupportedLocale } from "@/i18n/locales";

const dutchFaqItems = [
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

const dutchProcessSteps = [
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

const englishFaqItems = [
  { question: "What do you mean by custom software?", answer: "Custom software is a digital application designed around your users, data and workflow. It can be a web app, customer portal, internal tool, AI assistant or a focused integration between existing systems." },
  { question: "Does a custom software project always start with development?", answer: "No. We begin with analysis, scope and user journeys. For larger or uncertain ideas, a prototype or MVP tests the important assumptions before full development starts." },
  { question: "Can you connect our existing software?", answer: "Yes. We assess available APIs, data structures, permissions and failure scenarios. A focused integration may be enough, while other projects benefit from an intermediary layer or custom administration environment." },
  { question: "Do you build AI features?", answer: "Yes, when AI supports a clearly bounded task. Examples include document analysis, knowledge assistants, intelligent search, classification and guided automation with human oversight." },
  { question: "Can custom software grow later?", answer: "We account for future development in the architecture. We work modularly, document key decisions and prioritise extensions using real usage evidence." },
];

const englishProcessSteps = [
  { step: "01", title: "Analysis and scope", text: "We turn goals, users, data, exceptions and existing systems into a viable first scope." },
  { step: "02", title: "Journey and prototype", text: "Key screens and processes become tangible before expensive technical choices are final." },
  { step: "03", title: "Modular development", text: "Front end, back end, database and integrations are built in stages and tested with real scenarios." },
  { step: "04", title: "Launch and growth", text: "After delivery, monitoring and support guide focused improvements based on use and priority." },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const en = locale === "en";
  return pageMetadata({
    title: en ? "Custom software development for SMEs in Belgium | VisualVibe" : "Software op maat en apps voor KMO's | VisualVibe",
    description: en ? "Custom apps, web applications, AI solutions and API integrations for SMEs. From focused analysis and prototypes to secure launch and ongoing development." : "Software op maat voor KMO's: apps, webapplicaties, AI-toepassingen, appdesign en API-koppelingen. Van analyse en prototype tot veilige lancering.",
    keywords: en ? ["custom software development", "app development", "web application development", "AI application development", "API integrations"] : ["software op maat", "app laten maken", "webapplicatie laten maken", "AI applicatie laten maken", "API koppeling laten maken"],
    path: `${softwareServiceHubHref(locale as SupportedLocale)}/`,
    locale: locale as SupportedLocale,
    languagePaths: {
      nl: "/diensten/software-op-maat/",
      en: "/services/custom-software/",
    },
  });
}

export default async function SoftwareOpMaatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as SupportedLocale;
  const en = locale === "en";
  const services = getSoftwareServices(locale);
  const hubPath = softwareServiceHubHref(locale);
  const faqItems = en ? englishFaqItems : dutchFaqItems;
  const processSteps = en ? englishProcessSteps : dutchProcessSteps;
  const canonicalUrl = `${businessConfig.url}${localizedPath(en ? "en" : "nl", `${hubPath}/`)}`;

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        locale={en ? "en" : "nl"}
        items={[
          { name: "Home", path: "/" },
          { name: en ? "Services" : "Diensten", path: en ? "/services" : "/diensten" },
          { name: en ? "Custom software" : "Software op maat", path: hubPath },
        ]}
      />
      <ServiceJsonLd
        locale={locale}
        service={{
          name: en ? "Custom software" : "Software op maat",
          description: en ? "Custom apps, web applications, AI solutions, app design and API integrations for SMEs." : "Apps, webapplicaties, AI-toepassingen, appdesign en API-koppelingen op maat van KMO's.",
          url: canonicalUrl,
        }}
      />
      <FaqPageJsonLd items={faqItems} />

      <PageHero
        title={en ? "Custom apps and software built around your business" : "Apps en software op maat voor je echte bedrijfsproces"}
        subtitle={en ? "From an initial app idea to a secure web application, AI solution or system integration. We design the right workflow first, then build only what creates real value." : "Van een eerste appidee tot een veilige webapp, AI-toepassing of systeemkoppeling. We ontwerpen eerst de juiste flow en bouwen daarna alleen wat werkelijk waarde toevoegt."}
      />

      <Section orbs="tl-br">
        <Container>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
              {en ? "From idea to working application" : "Van idee tot werkende toepassing"}
            </p>
            <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
              {en ? "Which digital solution does your business need?" : "Welke digitale oplossing heb je nodig?"}
            </h2>
            <p className="mt-4 leading-relaxed text-white/60">
              {en ? "Not every problem needs a mobile app, and not every automation requires a new platform. We choose the right format based on users, context, data and future growth." : "Niet elk probleem vraagt een mobiele app en niet elke automatisering vereist een volledig nieuw platform. We kiezen de vorm op basis van gebruikers, context, gegevens en gewenste groei."}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = iconBySlug[service.id as keyof typeof iconBySlug];
              return (
                <Link
                  key={service.slug}
                  href={`${softwareServiceHref(service, locale)}/`}
                  className="group flex min-h-[270px] flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition-all hover:-translate-y-1 hover:border-[rgba(255,122,0,0.42)] hover:bg-[rgba(255,122,0,0.055)]"
                >
                  <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-sora text-xl font-extrabold">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/58">{service.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#FF9A45]">
                    {en ? "Explore this service" : "Bekijk deze dienst"}
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
                {en ? "Website" : "Website"}
              </p>
              <h2 className="mt-3 font-sora text-2xl font-extrabold sm:text-3xl">
                {en ? "Inform, build trust and generate enquiries" : "Informeren, overtuigen en aanvragen ontvangen"}
              </h2>
              <p className="mt-4 leading-relaxed text-white/62">
                {en ? "A website presents your offer, builds trust and guides visitors towards contact or purchase. Useful AI features can strengthen that experience, while the public customer journey remains central." : "Een website presenteert je aanbod, bouwt vertrouwen op en leidt bezoekers naar contact of aankoop. Slimme AI-functionaliteiten kunnen die ervaring versterken, maar de publieke klantreis blijft centraal staan."}
              </p>
              <Link
                href={en ? "/services/web-design/" : "/diensten/webdesign/website-met-ai-functionaliteiten/"}
                className="mt-6 inline-flex items-center gap-2 font-bold text-[#FF9A45]"
              >
                {en ? "Explore web design" : "Website met AI-functionaliteiten"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.055)] p-8 sm:p-10">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FF9A45]">
                {en ? "Custom software" : "Software op maat"}
              </p>
              <h2 className="mt-3 font-sora text-2xl font-extrabold sm:text-3xl">
                {en ? "Sign in, manage data and run business processes" : "Inloggen, gegevens beheren en processen uitvoeren"}
              </h2>
              <p className="mt-4 leading-relaxed text-white/68">
                {en ? "Custom software supports the operations behind or alongside your website: planning, case files, dashboards, quotations, customer portals, automation and role-based access." : "Maatwerksoftware ondersteunt de dagelijkse werking achter of naast je website: planning, dossiers, dashboards, offertes, klantenportalen, automatisering en rollen met verschillende toegangsrechten."}
              </p>
              <Link
                href={en ? "/kennisbank/software-op-maat/" : "/kennisbank/software-op-maat/"}
                className="mt-6 inline-flex items-center gap-2 font-bold text-[#FF9A45]"
              >
                {en ? "Learn about apps and custom software" : "Alles over apps en software op maat"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section orbs="tl-br">
        <Container>
          <div className="mb-9 max-w-2xl">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
              {en ? "Our approach" : "Onze werkwijze"}
            </p>
            <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
              {en ? "Understand the problem before writing code" : "Eerst het probleem begrijpen, dan pas code schrijven"}
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
              {en ? "Frequently asked questions about custom software" : "Veelgestelde vragen over software op maat"}
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
        title={en ? "Ready to make your app or software idea concrete?" : "Een app- of software-idee dat je concreet wilt maken?"}
        description={en ? "Tell us which process, problem or idea you want to develop. We will help define the right first release and explain honestly what is and is not needed." : "Vertel ons welk proces, probleem of idee je wilt uitwerken. We helpen de juiste eerste versie afbakenen en geven eerlijk aan wat wel en niet nodig is."}
        primaryLabel={en ? "Request a quotation" : undefined}
        primaryHref={en ? "/request-a-quotation" : undefined}
      />
    </div>
  );
}
