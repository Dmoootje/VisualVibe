export type SoftwareFaq = {
  question: string;
  answer: string;
};

export type SoftwareProcessStep = {
  title: string;
  description: string;
};

export type SoftwareService = {
  title: string;
  slug: string;
  excerpt: string;
  intro: string;
  primaryKeyword: string;
  benefits: string[];
  deliverables: string[];
  idealFor: string[];
  process: SoftwareProcessStep[];
  faqs: SoftwareFaq[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export const softwareServices: SoftwareService[] = [
  {
    title: "App laten maken",
    slug: "app-laten-maken",
    excerpt:
      "Een gebruiksvriendelijke app op maat van je klanten, medewerkers en dagelijkse werking.",
    intro:
      "Een app laten maken begint niet bij schermen of technologie, maar bij het probleem dat je wilt oplossen. VisualVibe vertaalt je idee naar een duidelijke gebruikersflow, een schaalbare technische basis en een toepassing die praktisch blijft voor de mensen die ermee werken.",
    primaryKeyword: "app laten maken",
    benefits: [
      "Van eerste idee tot werkende toepassing",
      "Ontwerp rond echte gebruikers en processen",
      "Veilige accounts, rollen en gegevensstromen",
      "Klaar voor uitbreiding en doorontwikkeling",
    ],
    deliverables: [
      "Functionele analyse en afbakening",
      "UX-flow en visueel appdesign",
      "Ontwikkeling van front-end en back-end",
      "Testen, lancering en technische documentatie",
    ],
    idealFor: [
      "KMO's die een intern proces willen digitaliseren",
      "Ondernemers met een platform- of SaaS-idee",
      "Bedrijven die klanten een eigen digitale omgeving willen bieden",
    ],
    process: [
      {
        title: "Probleem en doel scherpstellen",
        description:
          "We brengen gebruikers, processen, gegevens, gewenste resultaten en bestaande systemen in kaart.",
      },
      {
        title: "MVP en gebruikersflow ontwerpen",
        description:
          "We bepalen de kleinste waardevolle eerste versie en werken de schermen en interacties logisch uit.",
      },
      {
        title: "Ontwikkelen en tussentijds testen",
        description:
          "De toepassing wordt modulair gebouwd en op vaste momenten met echte scenario's gecontroleerd.",
      },
      {
        title: "Lanceren en doorontwikkelen",
        description:
          "Na oplevering volgen monitoring, ondersteuning en gerichte uitbreidingen op basis van gebruik.",
      },
    ],
    faqs: [
      {
        question: "Wat kost een app laten maken?",
        answer:
          "De investering hangt vooral af van gebruikersrollen, gegevens, koppelingen, platformkeuze en gewenste automatisering. Na een korte analyse krijg je een afgebakend voorstel met prioriteiten en mogelijke fases.",
      },
      {
        question: "Moet ik meteen een volledige app laten bouwen?",
        answer:
          "Nee. Meestal is een MVP verstandiger: een eerste versie met de functies die het kernprobleem oplossen. Zo kan je sneller testen en later uitbreiden met kennis uit echt gebruik.",
      },
      {
        question: "Bouwen jullie ook de back-end en databank?",
        answer:
          "Ja. We kunnen de volledige toepassing verzorgen, inclusief accounts, rollen, databank, API's, beheeromgeving en koppelingen met bestaande systemen.",
      },
      {
        question: "Kan een app later worden uitgebreid?",
        answer:
          "Dat is het uitgangspunt. We werken modulair, documenteren belangrijke keuzes en vermijden een technische basis die alleen voor de eerste versie bruikbaar is.",
      },
    ],
    seo: {
      title: "App laten maken voor je bedrijf | VisualVibe Limburg",
      description:
        "Een app laten maken voor klanten of medewerkers? VisualVibe ontwerpt en ontwikkelt gebruiksvriendelijke maatwerkapps voor KMO's in Limburg en Vlaanderen.",
      keywords: ["app laten maken", "app ontwikkelaar Limburg", "maatwerk app", "bedrijfsapp laten maken"],
    },
  },
  {
    title: "Webapplicatie laten maken",
    slug: "webapplicatie-laten-maken",
    excerpt:
      "Een snelle webapp voor dashboards, planning, offertes, portalen of volledige bedrijfsprocessen.",
    intro:
      "Een webapplicatie werkt rechtstreeks in de browser en kan daardoor snel beschikbaar zijn op desktop, tablet en smartphone. VisualVibe bouwt webapps voor onder meer planning, offertes, dossiers, rapportering, klantportalen en interne samenwerking.",
    primaryKeyword: "webapplicatie laten maken",
    benefits: [
      "Toegankelijk via elke moderne browser",
      "Eén centrale versie voor alle gebruikers",
      "Geschikt voor dashboards en bedrijfsprocessen",
      "Koppelbaar met bestaande software en API's",
    ],
    deliverables: [
      "Procesanalyse en informatiemodel",
      "Responsieve interface en dashboarddesign",
      "Beveiligde back-end en databank",
      "Beheer, logging en technische overdracht",
    ],
    idealFor: [
      "Bedrijven die spreadsheets willen vervangen",
      "Teams die informatie op één plaats nodig hebben",
      "Organisaties met klant-, partner- of medewerkersportalen",
    ],
    process: [
      {
        title: "Werkproces analyseren",
        description:
          "We bekijken welke stappen, gegevens en uitzonderingen vandaag tijd kosten of fouten veroorzaken.",
      },
      {
        title: "Architectuur en schermen bepalen",
        description:
          "Rollen, dashboards, formulieren, rapporten en koppelingen krijgen een heldere structuur.",
      },
      {
        title: "Gefaseerd ontwikkelen",
        description:
          "We bouwen per werkbare module, zodat belangrijke keuzes vroeg kunnen worden getest.",
      },
      {
        title: "Invoeren en verbeteren",
        description:
          "Gebruikers krijgen begeleiding en verbeterpunten worden op basis van werkelijk gebruik ingepland.",
      },
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen een website en een webapplicatie?",
        answer:
          "Een website informeert en overtuigt vooral bezoekers. Een webapplicatie laat gebruikers inloggen, gegevens beheren, taken uitvoeren en processen doorlopen. Beide kunnen visueel op elkaar aansluiten, maar hebben een andere technische en functionele diepgang.",
      },
      {
        question: "Werkt een webapplicatie ook op smartphone?",
        answer:
          "Ja. De interface wordt responsief ontworpen. Voor intensief mobiel gebruik bekijken we aanvullend of een installeerbare PWA of mobiele app voordelen biedt.",
      },
      {
        question: "Kunnen verschillende gebruikers verschillende rechten krijgen?",
        answer:
          "Ja. Rollen en toegangsrechten kunnen per onderdeel worden ingesteld, bijvoorbeeld voor medewerkers, beheerders, klanten of externe partners.",
      },
      {
        question: "Kunnen bestaande gegevens worden geïmporteerd?",
        answer:
          "Vaak wel. We analyseren de kwaliteit en structuur van bestaande spreadsheets, databanken of exports en bepalen een veilige migratieaanpak.",
      },
    ],
    seo: {
      title: "Webapplicatie laten maken voor KMO's | VisualVibe",
      description:
        "Webapplicatie laten maken voor planning, dashboards, offertes of klantportalen? VisualVibe bouwt veilige maatwerk webapps voor KMO's in Vlaanderen.",
      keywords: ["webapplicatie laten maken", "webapp ontwikkelaar", "maatwerk webapp", "bedrijfssoftware op maat"],
    },
  },
  {
    title: "AI-applicatie laten maken",
    slug: "ai-applicatie-laten-maken",
    excerpt:
      "Een AI-toepassing die documenten, kennis en repetitieve taken bruikbaar verwerkt binnen je bedrijf.",
    intro:
      "Een AI-applicatie is pas waardevol wanneer ze betrouwbare bedrijfsinformatie gebruikt en in een duidelijke workflow past. VisualVibe bouwt toepassingen voor documentanalyse, kennisassistenten, classificatie, samenvattingen, slimme zoekfuncties en begeleide automatisering.",
    primaryKeyword: "AI-applicatie laten maken",
    benefits: [
      "AI gekoppeld aan je eigen kennis en processen",
      "Menselijke controle waar beslissingen belangrijk zijn",
      "Duidelijke logging, rechten en gegevensafbakening",
      "Gefaseerd testen met meetbare praktijkscenario's",
    ],
    deliverables: [
      "AI-usecase en haalbaarheidsanalyse",
      "Datastromen, instructies en evaluatieset",
      "Gebruikersinterface en systeemkoppelingen",
      "Monitoring, feedbacklus en veiligheidsafspraken",
    ],
    idealFor: [
      "Teams die veel documenten of aanvragen verwerken",
      "Bedrijven met verspreide interne kennis",
      "Organisaties die repetitieve kennisvragen willen ondersteunen",
    ],
    process: [
      {
        title: "Usecase en risico's afbakenen",
        description:
          "We bepalen welke taak AI ondersteunt, welke gegevens nodig zijn en waar menselijke controle verplicht blijft.",
      },
      {
        title: "Prototype met echte voorbeelden",
        description:
          "Een beperkte versie wordt getest op representatieve documenten, vragen en uitzonderingen.",
      },
      {
        title: "Integreren in de workflow",
        description:
          "De AI-functie krijgt een bruikbare interface, rechten, logging en koppelingen met bestaande systemen.",
      },
      {
        title: "Meten en bijsturen",
        description:
          "We volgen kwaliteit, foutpatronen en tijdswinst op en verbeteren instructies of gegevensbronnen gericht.",
      },
    ],
    faqs: [
      {
        question: "Kan een AI-applicatie met onze eigen documenten werken?",
        answer:
          "Ja. Afhankelijk van de usecase kan de toepassing relevante interne informatie ophalen en verwerken zonder dat alles in een modeltraining hoeft te worden opgenomen.",
      },
      {
        question: "Is AI altijd volledig automatisch?",
        answer:
          "Nee. Voor veel bedrijfsprocessen is begeleide automatisering beter: AI bereidt iets voor, waarna een medewerker controleert, aanvult of goedkeurt.",
      },
      {
        question: "Hoe controleren jullie de kwaliteit?",
        answer:
          "We werken met vaste testsituaties, verwachte uitkomsten en foutcategorieën. Zo wordt niet alleen bekeken of een demo goed lijkt, maar ook hoe betrouwbaar de toepassing op uitzonderingen reageert.",
      },
      {
        question: "Kunnen bestaande AI-diensten worden gekoppeld?",
        answer:
          "Ja. We kiezen per project welke modellen en diensten functioneel, technisch en financieel passen en bouwen een laag die later kan worden aangepast.",
      },
    ],
    seo: {
      title: "AI-applicatie laten maken voor je bedrijf | VisualVibe",
      description:
        "AI-applicatie laten maken voor documenten, kennis of automatisering? VisualVibe bouwt bruikbare AI-oplossingen met controle, logging en koppelingen.",
      keywords: ["AI applicatie laten maken", "AI software op maat", "AI automatisering", "bedrijfs AI oplossing"],
    },
  },
  {
    title: "API-koppelingen en automatisering",
    slug: "api-koppelingen-en-automatisering",
    excerpt:
      "Laat websites, CRM, boekhouding, planning en andere systemen veilig gegevens uitwisselen.",
    intro:
      "Dubbele invoer ontstaat vaak omdat systemen naast elkaar bestaan. Met API-koppelingen en gerichte automatisering laat VisualVibe gegevens gecontroleerd doorstromen tussen je website, CRM, agenda, mailbox, betaalprovider, boekhouding of interne software.",
    primaryKeyword: "API-koppeling laten maken",
    benefits: [
      "Minder dubbele invoer en manuele controles",
      "Betere gegevenskwaliteit tussen systemen",
      "Logging en foutafhandeling voor kritieke processen",
      "Automatisering afgestemd op uitzonderingen",
    ],
    deliverables: [
      "Analyse van systemen en beschikbare API's",
      "Datamapping en beveiligingsafspraken",
      "Koppeling, webhooks en foutafhandeling",
      "Monitoring en technische documentatie",
    ],
    idealFor: [
      "Bedrijven die dezelfde gegevens op meerdere plaatsen invoeren",
      "Teams die automatische opvolging of notificaties nodig hebben",
      "Organisaties die bestaande software willen behouden maar beter verbinden",
    ],
    process: [
      {
        title: "Systemen en gegevens inventariseren",
        description:
          "We bepalen welke bron leidend is, welke velden nodig zijn en hoe vaak gegevens moeten worden bijgewerkt.",
      },
      {
        title: "Koppelplan en uitzonderingen uitwerken",
        description:
          "Authenticatie, mapping, foutscenario's, limieten en privacy worden vooraf concreet gemaakt.",
      },
      {
        title: "Koppeling bouwen en testen",
        description:
          "Normale stromen en uitzonderingen worden met testgegevens gecontroleerd voordat productiegegevens volgen.",
      },
      {
        title: "Monitoren en onderhouden",
        description:
          "Logs en waarschuwingen maken zichtbaar wanneer externe systemen wijzigen of een verwerking vastloopt.",
      },
    ],
    faqs: [
      {
        question: "Wat is een API-koppeling?",
        answer:
          "Een API-koppeling laat twee systemen volgens afgesproken regels gegevens uitwisselen. Daardoor kan bijvoorbeeld een websiteaanvraag automatisch in een CRM komen of een betaling een interne workflow starten.",
      },
      {
        question: "Kunnen systemen zonder moderne API toch worden gekoppeld?",
        answer:
          "Soms kan dat via bestanden, e-mailverwerking of een tussenlaag. We beoordelen eerst of de methode betrouwbaar en onderhoudbaar genoeg is voor het proces.",
      },
      {
        question: "Wat gebeurt er wanneer een koppeling faalt?",
        answer:
          "Voor belangrijke processen voorzien we logging, herpogingen en meldingen. Gegevens mogen niet stil verdwijnen wanneer een externe dienst tijdelijk niet reageert.",
      },
      {
        question: "Kunnen kleine automatiseringen ook apart worden gebouwd?",
        answer:
          "Ja. Niet elk project vereist een volledige applicatie. Een gerichte koppeling of workflow kan al veel manueel werk wegnemen.",
      },
    ],
    seo: {
      title: "API-koppeling laten maken en automatiseren | VisualVibe",
      description:
        "API-koppeling laten maken tussen website, CRM, planning of boekhouding? VisualVibe automatiseert gegevensstromen met logging en foutafhandeling.",
      keywords: ["API koppeling laten maken", "software koppelen", "bedrijfsprocessen automatiseren", "systeemintegratie"],
    },
  },
  {
    title: "App design en UX/UI",
    slug: "app-design-ux-ui",
    excerpt:
      "Een helder appdesign dat complexe functies begrijpelijk maakt voor klanten en medewerkers.",
    intro:
      "Goed appdesign is meer dan een aantrekkelijke interface. VisualVibe brengt taken, informatie en beslissingen terug tot een logische gebruikersflow en werkt die uit in wireframes, prototypes en een consistente UX/UI voor web- en mobiele toepassingen.",
    primaryKeyword: "app design laten maken",
    benefits: [
      "Gebruikersflows vóór technische ontwikkeling",
      "Klikbaar prototype voor snelle feedback",
      "Consistente componenten en toestanden",
      "Ontwerp voor desktop, tablet en mobiel",
    ],
    deliverables: [
      "Gebruikers- en taakanalyse",
      "Wireframes en informatiestructuur",
      "Klikbaar high-fidelity prototype",
      "Designsystem en overdracht naar ontwikkeling",
    ],
    idealFor: [
      "Startups die hun appidee eerst willen valideren",
      "Bedrijven met een bestaande maar onduidelijke toepassing",
      "Ontwikkelteams die een uitgewerkt UX/UI-ontwerp nodig hebben",
    ],
    process: [
      {
        title: "Gebruikers en taken begrijpen",
        description:
          "We bepalen wie de toepassing gebruikt, met welk doel en waar vandaag verwarring of tijdverlies ontstaat.",
      },
      {
        title: "Flow en wireframes maken",
        description:
          "De belangrijkste routes worden zonder visuele afleiding logisch en volledig uitgewerkt.",
      },
      {
        title: "Visueel ontwerp en prototype",
        description:
          "Merkstijl, componenten, schermen en interacties worden samengebracht in een klikbare demonstratie.",
      },
      {
        title: "Testen en overdragen",
        description:
          "Feedback wordt verwerkt en ontwerpbeslissingen worden bruikbaar gedocumenteerd voor ontwikkeling.",
      },
    ],
    faqs: [
      {
        question: "Kan ik alleen appdesign laten maken zonder ontwikkeling?",
        answer:
          "Ja. Een afgebakend UX/UI-traject kan worden opgeleverd als prototype en designsysteem voor een intern of extern ontwikkelteam.",
      },
      {
        question: "Wat is het verschil tussen UX en UI?",
        answer:
          "UX gaat over de logica, taken en gebruikservaring. UI gaat over de visuele uitwerking van schermen en componenten. Een sterke app heeft beide nodig.",
      },
      {
        question: "Kunnen bestaande apps opnieuw worden ontworpen?",
        answer:
          "Ja. We analyseren gebruiksproblemen, behouden wat werkt en maken verbeteringen zichtbaar in flows en prototypes voordat er code wordt aangepast.",
      },
      {
        question: "Wordt het ontwerp ook op verschillende schermen uitgewerkt?",
        answer:
          "Ja. We bepalen welke schermformaten werkelijk nodig zijn en werken responsief gedrag en belangrijke toestanden mee uit.",
      },
    ],
    seo: {
      title: "App design en UX/UI laten maken | VisualVibe Limburg",
      description:
        "App design laten maken? VisualVibe ontwerpt gebruikersflows, wireframes, prototypes en UX/UI voor webapps en mobiele toepassingen in Limburg.",
      keywords: ["app design laten maken", "UX UI design Limburg", "webapp design", "app prototype laten maken"],
    },
  },
];

export function getSoftwareService(slug: string): SoftwareService | undefined {
  return softwareServices.find((service) => service.slug === slug);
}
