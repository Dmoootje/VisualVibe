export type ToolCard = {
  id: "website-analyse" | "seo-geo-checklist";
  name: string;
  href: string;
  icon: string;
  tag: string;
  desc: string;
  cta: string;
  previewTitle: string;
  previewText: string;
  previewPoints: string[];
};

export type SeoGeoChecklistItem = {
  id: string;
  title: string;
  help: string;
  impact: "basis" | "sterk" | "expert";
};

export type SeoGeoChecklistCategory = {
  id:
    | "technical-seo"
    | "content-keywords"
    | "aio-geo"
    | "structured-data"
    | "performance-media"
    | "local-seo";
  title: string;
  intro: string;
  items: SeoGeoChecklistItem[];
};

export type SelectedSeoGeoChecklistItem = SeoGeoChecklistItem & {
  categoryId: SeoGeoChecklistCategory["id"];
  categoryTitle: string;
};

export const toolCards: ToolCard[] = [
  {
    id: "website-analyse",
    name: "Website analyse",
    href: "/website-analyse",
    icon: "seo",
    tag: "Gratis scan",
    desc: "Laat je website controleren op SEO, snelheid, techniek, content en AI-vindbaarheid.",
    cta: "Start gratis analyse",
    previewTitle: "Gratis rapport op 100",
    previewText: "Een duidelijke score, meldingen per onderdeel en tips die je meteen kunt openklikken.",
    previewPoints: ["SEO & techniek", "Core Web Vitals", "AI-vindbaarheid"],
  },
  {
    id: "seo-geo-checklist",
    name: "SEO/GEO checklist",
    href: "/tools/seo-geo-checklist",
    icon: "checklist",
    tag: "Aanvinkbaar + PDF",
    desc: "Controleer je pagina stap voor stap en download je gekozen punten als VisualVibe PDF.",
    cta: "Maak je checklist",
    previewTitle: "Checklist voor Google én AI",
    previewText: "Vink af wat klaar is, zie je voortgang en neem een branded PDF mee voor jezelf of je team.",
    previewPoints: ["Technische SEO", "AEO/GEO", "Structured data"],
  },
];

export const seoGeoChecklistCategories: SeoGeoChecklistCategory[] = [
  {
    id: "technical-seo",
    title: "Technische SEO",
    intro: "Zorg dat zoekmachines je pagina correct kunnen vinden, begrijpen en indexeren.",
    items: [
      {
        id: "technical-seo-indexable",
        title: "De pagina is indexeerbaar en staat niet op noindex",
        help: "Controleer robots, meta robots, canonical en eventuele beveiligde omgevingen.",
        impact: "basis",
      },
      {
        id: "technical-seo-canonical",
        title: "De canonical verwijst naar de juiste publieke URL",
        help: "Voorkom dat Google twijfelt tussen varianten met of zonder slash, parameters of taalpad.",
        impact: "basis",
      },
      {
        id: "technical-seo-title-description",
        title: "Title en meta description zijn uniek en klikwaardig",
        help: "Gebruik één duidelijke zoekintentie per pagina en schrijf de description als mini-advertentie.",
        impact: "sterk",
      },
      {
        id: "technical-seo-headings",
        title: "Er is één duidelijke H1 en een logische H2/H3-structuur",
        help: "Koppen moeten de inhoud scannenbaar maken voor bezoekers, Google en AI-systemen.",
        impact: "basis",
      },
    ],
  },
  {
    id: "content-keywords",
    title: "Content & zoekwoorden",
    intro: "Maak duidelijk voor wie de pagina is, welk probleem ze oplost en welke woorden daarbij horen.",
    items: [
      {
        id: "content-primary-keyword",
        title: "Het hoofdzoekwoord staat natuurlijk in titel, intro en minstens één tussenkop",
        help: "Niet proppen: één duidelijke focus is beter dan tien geforceerde varianten.",
        impact: "basis",
      },
      {
        id: "content-search-intent",
        title: "De pagina beantwoordt de echte zoekintentie",
        help: "Leg uit wat het is, voor wie het is, wat het oplevert en wat de volgende stap is.",
        impact: "sterk",
      },
      {
        id: "content-proof",
        title: "Er staat bewijs op de pagina",
        help: "Gebruik cases, resultaten, voorbeelden, screenshots, reviews of concrete werkwijze.",
        impact: "sterk",
      },
      {
        id: "content-internal-links",
        title: "Er zijn interne links naar relevante diensten, cases en kennisbankitems",
        help: "Help bezoekers én crawlers logisch verder door je website.",
        impact: "basis",
      },
    ],
  },
  {
    id: "aio-geo",
    title: "AEO/GEO & AI-vindbaarheid",
    intro: "Schrijf niet alleen voor klassieke zoekresultaten, maar ook voor AI-antwoorden en samenvattingen.",
    items: [
      {
        id: "aio-geo-direct-answer",
        title: "De pagina bevat een kort direct antwoord bovenaan",
        help: "AI-systemen halen graag compacte definities, stappen of samenvattingen uit duidelijke blokken.",
        impact: "basis",
      },
      {
        id: "aio-geo-faq",
        title: "Veelgestelde vragen beantwoorden echte klantvragen",
        help: "Gebruik vragen die een prospect letterlijk zou stellen, niet alleen marketingkoppen.",
        impact: "sterk",
      },
      {
        id: "aio-geo-entities",
        title: "Belangrijke entiteiten worden expliciet genoemd",
        help: "Denk aan merknaam, regio, dienst, doelgroep, technologieën en concrete toepassingen.",
        impact: "sterk",
      },
      {
        id: "aio-geo-process",
        title: "Het proces of stappenplan staat duidelijk uitgelegd",
        help: "Een heldere werkwijze helpt AI en bezoekers inschatten wat er precies gebeurt.",
        impact: "basis",
      },
    ],
  },
  {
    id: "structured-data",
    title: "Structured data",
    intro: "Voeg context toe die zoekmachines niet hoeven te raden.",
    items: [
      {
        id: "structured-data-organization",
        title: "Organization of LocalBusiness-schema is aanwezig waar relevant",
        help: "Gebruik bedrijfsnaam, URL, logo, contactgegevens en waar mogelijk werkgebied.",
        impact: "basis",
      },
      {
        id: "structured-data-breadcrumb",
        title: "BreadcrumbList-schema volgt de zichtbare paginastructuur",
        help: "Breadcrumbs helpen Google en gebruikers de plek van de pagina te begrijpen.",
        impact: "basis",
      },
      {
        id: "structured-data-faq",
        title: "FAQ-schema wordt alleen gebruikt bij zichtbare FAQ’s",
        help: "Gebruik geen verborgen of verzonnen FAQ’s; schema moet overeenkomen met zichtbare content.",
        impact: "sterk",
      },
      {
        id: "structured-data-service",
        title: "Dienstpagina’s gebruiken passende Service-data",
        help: "Beschrijf dienst, aanbieder, regio en relevante categorieën waar dat logisch is.",
        impact: "expert",
      },
    ],
  },
  {
    id: "performance-media",
    title: "Snelheid & afbeeldingen",
    intro: "Hou de pagina snel, helder en bruikbaar op desktop én mobiel.",
    items: [
      {
        id: "performance-lcp-image",
        title: "De belangrijkste hero-afbeelding is geoptimaliseerd voor LCP",
        help: "Gebruik het juiste formaat, moderne compressie en vermijd onnodig zware eerste beelden.",
        impact: "basis",
      },
      {
        id: "performance-alt-text",
        title: "Belangrijke afbeeldingen hebben relevante alt-tekst",
        help: "Beschrijf wat de afbeelding bijdraagt; decoratieve beelden mogen leeg blijven.",
        impact: "basis",
      },
      {
        id: "performance-cache",
        title: "Statische assets krijgen een efficiënte cache policy",
        help: "Logo’s, fonts en scripts met vaste bestandsnamen mogen niet onnodig kort gecachet worden.",
        impact: "sterk",
      },
      {
        id: "performance-render-blocking",
        title: "CSS, fonts en scripts blokkeren de eerste weergave zo weinig mogelijk",
        help: "Meet vooral de eerste HTML-response, LCP en blocking time; niet alleen totale bestandsgrootte.",
        impact: "expert",
      },
    ],
  },
  {
    id: "local-seo",
    title: "Lokale vindbaarheid",
    intro: "Maak duidelijk waar je werkt en waarom lokale klanten jou mogen vertrouwen.",
    items: [
      {
        id: "local-seo-business-info",
        title: "Bedrijfsnaam, regio, contactgegevens en aanbod zijn duidelijk zichtbaar",
        help: "Lokale signalen helpen bezoekers en zoekmachines begrijpen waar je actief bent.",
        impact: "basis",
      },
      {
        id: "local-seo-regions",
        title: "Belangrijke regio’s krijgen eigen, inhoudelijke pagina’s",
        help: "Vermijd lege plaatsnaam-pagina’s; geef echte context, cases en diensten per regio.",
        impact: "sterk",
      },
      {
        id: "local-seo-reviews",
        title: "Reviews, cases of lokale referenties ondersteunen je geloofwaardigheid",
        help: "Bewijs uit de regio werkt vaak sterker dan algemene claims.",
        impact: "sterk",
      },
      {
        id: "local-seo-nap",
        title: "Naam, adres en contactgegevens zijn consistent op website en externe profielen",
        help: "Zorg dat Google Business Profile, social profielen en website elkaar niet tegenspreken.",
        impact: "basis",
      },
    ],
  },
];

export function getSeoGeoChecklistItemCount(): number {
  return seoGeoChecklistCategories.reduce((total, category) => total + category.items.length, 0);
}

const itemLookup = new Map<string, SelectedSeoGeoChecklistItem>(
  seoGeoChecklistCategories.flatMap((category) =>
    category.items.map((item) => [
      item.id,
      {
        ...item,
        categoryId: category.id,
        categoryTitle: category.title,
      },
    ]),
  ),
);

export function getSeoGeoChecklistItemsById(ids: string[]): SelectedSeoGeoChecklistItem[] {
  return ids.flatMap((id) => {
    const item = itemLookup.get(id);
    return item ? [item] : [];
  });
}
