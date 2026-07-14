import { ArrowRight, Bot, Check, MessageSquareText, Search, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { businessConfig } from "@/config/business.config";
import { localizedPath } from "@/lib/kennisbank/urls";
import { pageMetadata } from "@/lib/seo/pageMetadata";
import { BreadcrumbJsonLd, FaqPageJsonLd, ServiceJsonLd } from "@/components/seo";
import { CTASection, PageHero } from "@/components/sections";
import { Container, Section } from "@/components/ui";

export const metadata = pageMetadata({
  title: "Website met AI-functionaliteiten laten maken | VisualVibe",
  description:
    "Website met AI-functionaliteiten laten maken? Voeg slimme zoekfuncties, advies, chat of leadkwalificatie toe op basis van je eigen content en processen.",
  keywords: [
    "website met AI",
    "AI chatbot website",
    "slimme zoekfunctie website",
    "AI webdesign",
    "website met AI laten maken",
  ],
  path: "/diensten/webdesign/website-met-ai-functionaliteiten/",
});

const capabilities = [
  {
    icon: MessageSquareText,
    title: "Kennisassistent op je website",
    text: "Beantwoord vragen op basis van gecontroleerde informatie over je diensten, producten, werkwijze en voorwaarden.",
  },
  {
    icon: Search,
    title: "Slimme zoek- en adviesfunctie",
    text: "Help bezoekers sneller het juiste product, de juiste dienst of relevante informatie vinden met natuurlijke vragen.",
  },
  {
    icon: Bot,
    title: "Leadkwalificatie en intake",
    text: "Verzamel gestructureerde informatie vóór een offerte, afspraak of contactmoment zonder een eindeloos formulier.",
  },
  {
    icon: Sparkles,
    title: "Ondersteuning voor beheerders",
    text: "Laat AI conceptteksten, samenvattingen of classificaties voorbereiden, met een menselijke controle vóór publicatie.",
  },
];

const faqItems = [
  {
    question: "Is een website met AI hetzelfde als een AI-applicatie?",
    answer:
      "Nee. Op een website ondersteunt AI meestal de publieke klantreis, bijvoorbeeld zoeken, adviseren of vragen beantwoorden. Een AI-applicatie kan dieper inloggen, bedrijfsdata verwerken en interne workflows uitvoeren.",
  },
  {
    question: "Kan de AI alleen onze eigen informatie gebruiken?",
    answer:
      "Dat kan. We kunnen de functie zo ontwerpen dat antwoorden worden gebaseerd op afgebakende documenten, pagina's of gegevensbronnen en dat onzekerheid duidelijk wordt aangegeven.",
  },
  {
    question: "Moet elke website een chatbot hebben?",
    answer:
      "Nee. Een chatbot zonder duidelijke taak voegt vaak weinig toe. Soms is een slimme zoekfunctie, keuzehulp of korte intake veel nuttiger en beter meetbaar.",
  },
  {
    question: "Kan AI foutieve antwoorden geven?",
    answer:
      "Ja, daarom zijn afbakening, brongebruik, instructies, logging en fallback-routes belangrijk. Voor kritieke informatie voorzien we menselijke controle of verwijzen we bewust naar een medewerker.",
  },
  {
    question: "Kunnen AI-functies later worden toegevoegd aan een bestaande website?",
    answer:
      "Vaak wel. We controleren eerst techniek, contentstructuur, privacy en beschikbare koppelingen. Daarna bepalen we of een gerichte module volstaat of een bredere vernieuwing verstandiger is.",
  },
];

const safeguards = [
  "Een duidelijke taak en afgebakende informatiebronnen",
  "Menselijke controle bij gevoelige of bindende informatie",
  "Logging en tests met echte vragen van klanten",
  "Privacy, toestemming en bewaartermijnen vooraf bepalen",
  "Een gewone contactroute wanneer AI niet zeker is",
];

export default function WebsiteMetAiPage() {
  const canonicalUrl = `${businessConfig.url}${localizedPath(
    "nl",
    "/diensten/webdesign/website-met-ai-functionaliteiten/"
  )}`;

  return (
    <div className="min-h-screen text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
          { name: "Webdesign", path: "/diensten/webdesign" },
          {
            name: "Website met AI-functionaliteiten",
            path: "/diensten/webdesign/website-met-ai-functionaliteiten",
          },
        ]}
      />
      <ServiceJsonLd
        service={{
          name: "Website met AI-functionaliteiten",
          description:
            "Slimme zoekfuncties, advies, chat en leadkwalificatie op basis van gecontroleerde bedrijfscontent.",
          url: canonicalUrl,
        }}
      />
      <FaqPageJsonLd items={faqItems} />

      <PageHero
        title="Een website met AI die bezoekers echt vooruithelpt"
        subtitle="Geen chatbot omdat het hip klinkt, maar een gerichte AI-functie die zoeken, kiezen, vragen stellen of een intake merkbaar eenvoudiger maakt."
      />

      <Section orbs="tl-br">
        <Container>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
              AI-webdesign met een duidelijke taak
            </p>
            <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
              Vier manieren waarop AI een website nuttiger kan maken
            </h2>
            <p className="mt-4 leading-relaxed text-white/60">
              De beste toepassing hangt af van de vragen van je bezoekers en de kwaliteit van je informatie. We kiezen
              één concrete usecase en maken vooraf meetbaar wat beter moet worden.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-sora text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/58">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section orbs="tr-bl">
        <Container>
          <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF9A45]">
                Eerst de inhoud, dan het model
              </p>
              <h2 className="font-sora text-3xl font-extrabold sm:text-4xl">
                Betrouwbaarheid ontstaat door ontwerp en afbakening
              </h2>
              <p className="mt-5 leading-relaxed text-white/62">
                Een AI-functie kan alleen bruikbare antwoorden geven wanneer de broninformatie duidelijk, actueel en
                goed gestructureerd is. Daarom bekijken we ook pagina's, productdata, veelgestelde vragen, rechten en
                escalatie naar een medewerker. De gebruikerservaring en het veiligheidsnet zijn even belangrijk als de
                gekozen AI-technologie.
              </p>
              <Link
                href="/diensten/software-op-maat/ai-applicatie-laten-maken/"
                className="mt-7 inline-flex items-center gap-2 font-bold text-[#FF9A45]"
              >
                Een volledige AI-applicatie nodig?
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-[rgba(255,122,0,0.28)] bg-[rgba(255,122,0,0.055)] p-7 sm:p-9">
              <h3 className="font-sora text-2xl font-extrabold">Minimale kwaliteitsvoorwaarden</h3>
              <ul className="mt-6 space-y-4">
                {safeguards.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/72">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#FF9A45]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section orbs="tl-br">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-sora text-3xl font-extrabold sm:text-4xl">
              Veelgestelde vragen over AI op websites
            </h2>
            <div className="mt-8 space-y-3">
              {faqItems.map((item) => (
                <details key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 open:border-[rgba(255,122,0,0.32)]">
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
        title="Welke vraag moet je website slimmer beantwoorden?"
        description="Vertel ons waar bezoekers vandaag afhaken, zoeken of telkens dezelfde vraag stellen. We bepalen of AI daar werkelijk de beste oplossing is."
      />
    </div>
  );
}
