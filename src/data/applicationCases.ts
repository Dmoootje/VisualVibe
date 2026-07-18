import type { SupportedLocale } from "@/i18n/locales";
import {
  englishApplicationCaseEditorial,
  type EnglishApplicationCaseLocaleRecord,
} from "./locales/en/applicationCases";

export type ApplicationCaseStatus = "live" | "in-development";

export type ApplicationCaseSsr = {
  title: string;
  description: string;
  points: string[];
};

export type ApplicationCase = {
  id: string;
  slug: string;
  title: string;
  client: string;
  websiteUrl: string;
  status: ApplicationCaseStatus;
  published: boolean;
  featured: boolean;
  tags: string[];
  tagline: string;
  excerpt: string;
  challenge: string;
  solution: string;
  capabilities: string[];
  technology: string[];
  results: string[];
  ssr: ApplicationCaseSsr;
  seoTitle: string;
  seoDescription: string;
};

export type ApplicationCaseImageSlot =
  | "cover"
  | "mobile-cover"
  | "home-desktop"
  | "home-mobile"
  | "core-flow"
  | "dashboard"
  | "backend-1"
  | "backend-2"
  | "backend-3"
  | "backend-4"
  | "backend-5"
  | "backend-6";

export const APPLICATION_CASE_IMAGE_SLOTS: {
  slot: ApplicationCaseImageSlot;
  label: string;
  aspect: string;
}[] = [
  { slot: "cover", label: "Cover / kaart", aspect: "aspect-video" },
  { slot: "mobile-cover", label: "Mobiele cover", aspect: "aspect-[3/4]" },
  { slot: "home-desktop", label: "Homepage desktop", aspect: "aspect-video" },
  { slot: "home-mobile", label: "Homepage mobiel", aspect: "aspect-[3/4]" },
  { slot: "core-flow", label: "Belangrijkste gebruikersflow", aspect: "aspect-video" },
  { slot: "dashboard", label: "Dashboard", aspect: "aspect-video" },
  { slot: "backend-1", label: "Backend 1", aspect: "aspect-video" },
  { slot: "backend-2", label: "Backend 2", aspect: "aspect-video" },
  { slot: "backend-3", label: "Backend 3", aspect: "aspect-video" },
  { slot: "backend-4", label: "Backend 4", aspect: "aspect-video" },
  { slot: "backend-5", label: "Backend 5", aspect: "aspect-video" },
  { slot: "backend-6", label: "Backend 6", aspect: "aspect-video" },
];

export const applicationCaseImageKey = (caseId: string, slot: ApplicationCaseImageSlot) =>
  `${caseId}-${slot}`;

export const applicationCases: ApplicationCase[] = [
  {
    id: "bm-jumpfun",
    slug: "bm-jumpfun-verhuurplatform",
    title: "BM Jumpfun",
    client: "BM JUMPFUN · VERHUURPLATFORM VOOR SPRINGKASTELEN",
    websiteUrl: "https://www.bmjumpfun.be/nl/",
    status: "live",
    published: true,
    featured: true,
    tags: ["Verhuurplatform", "Reservaties", "React SSR"],
    tagline: "Een meertalig verhuurplatform waarin website, planning en administratie samenkomen.",
    excerpt:
      "BM Jumpfun combineert een snelle publieke verhuursite met beschikbaarheid, reservaties, routeberekening, kalenderkoppeling, facturatie en een uitgebreide beheeromgeving.",
    challenge:
      "Een verhuurbedrijf beheert veel meer dan een productcatalogus. Beschikbaarheid, combinaties, leverafstanden, tijdstippen, klantgegevens, planning, prijzen en communicatie moeten foutloos op elkaar aansluiten. Losse formulieren en agenda’s maken dubbelboekingen en manueel werk bijna onvermijdelijk.",
    solution:
      "We bouwden één centraal platform waarin bezoekers meertalig producten en pakketten kunnen bekijken en reserveren, terwijl de backend dezelfde gegevens gebruikt voor planning, prijsberekening, kalender, klantenopvolging en documenten. De server valideert beschikbaarheid en prijzen opnieuw voordat een reservatie wordt opgeslagen.",
    capabilities: [
      "Meertalige productcatalogus en detailpagina’s",
      "Reservatieflow met pakketten, opties en extra diensten",
      "Beschikbaarheids- en conflictcontrole per springkasteel",
      "Google Calendar-synchronisatie en webhookopvolging",
      "Google Maps-route- en leveringsberekening",
      "Klanten-, reservatie- en productbeheer",
      "PDF-facturen, kortingcodes en e-mailtemplates",
      "Analytics, branding en tenantgebonden instellingen",
    ],
    technology: [
      "React 19",
      "Express",
      "Firebase Auth, Firestore en Admin SDK",
      "Google Calendar en Google Maps API",
      "Nodemailer en PDFKit",
      "Sharp",
      "Cloud Run",
    ],
    results: [
      "Publieke verhuur en dagelijkse administratie in één gegevensstroom",
      "Minder risico op dubbelboekingen door server-side conflictcontrole",
      "Planning en reservaties automatisch verbonden met Google Calendar",
      "Productpagina’s blijven indexeerbaar en deelbaar met eigen metadata",
    ],
    ssr: {
      title: "React SSR met semantische SEO-fallback",
      description:
        "De server rendert de React-route met product- en bedrijfsdata voordat de browser hydrateert. Wanneer een React-rendering zou mislukken, krijgt een crawler nog steeds een semantische HTML-versie in plaats van een lege app-shell.",
      points: [
        "Server-side React-output met vooraf geladen Firestore-data",
        "Dynamische canonical, hreflang en Open Graph per taal en product",
        "Product-, breadcrumb- en bedrijfsdata als JSON-LD",
        "Dynamische sitemap voor NL, FR en EN",
      ],
    },
    seoTitle: "BM Jumpfun verhuurplatform met reservatiebackend | VisualVibe",
    seoDescription:
      "Hoe VisualVibe voor BM Jumpfun een meertalig verhuurplatform bouwde met reservaties, beschikbaarheid, Google Calendar-koppeling, routeberekening en facturatie.",
  },
  {
    id: "seo-websites",
    slug: "seo-websites-saas-platform",
    title: "SEO Websites",
    client: "SEO WEBSITES · AI SEO- EN GEO-SAAS",
    websiteUrl: "https://seowebsites.be/",
    status: "live",
    published: true,
    featured: true,
    tags: ["SaaS", "AI & SEO", "Prerendering"],
    tagline: "Een modulair SaaS-platform voor analyse, content, producten en AI-vindbaarheid.",
    excerpt:
      "SEO Websites brengt websiteanalyse, AI-content, productteksten, SERP-tools, workspaces, betalingen en CMS-integraties samen in één meertalig platform.",
    challenge:
      "SEO-werk bestaat vaak uit tientallen losse tools, spreadsheets en terugkerende controles. Gebruikers hebben niet alleen een generator nodig, maar ook projecten, credits, analyses, publicatiekanalen, kwaliteitsregels en een duidelijke beheerstroom.",
    solution:
      "We ontwikkelden een SaaS-omgeving waarin elke tool onderdeel is van een groter project- en accountmodel. Analyse, AI-generatie, betalingen, plugins en beheer delen dezelfde gebruikers-, tenant- en kwaliteitslogica. Publieke landingspagina’s worden vooraf gerenderd zodat het marketinggedeelte niet afhankelijk is van client-side JavaScript.",
    capabilities: [
      "AI-artikel- en productgenerator",
      "Website- en pagina-analyse met duidelijke verbeterpunten",
      "SERP-, sitemap-, branding- en productmaptools",
      "Projecten en site-workspaces met gedeelde data",
      "Creditwallet, Stripe-betalingen en abonnementslogica",
      "WordPress- en Drupal-integraties",
      "Partner-, ambassadeur- en affiliatefuncties",
      "Meertalige kennisbank, administratie en route-audits",
    ],
    technology: [
      "React 19 en Vite",
      "Express en PostgreSQL",
      "Gemini, OpenAI en Anthropic",
      "Stripe",
      "Firecrawl en Cheerio",
      "WordPress- en Drupal-plugins",
      "Cloud Storage",
    ],
    results: [
      "Eén accountomgeving voor analyse, generatie en publicatie",
      "Modulaire tools die dezelfde projecten en kwaliteitsregels delen",
      "Publieke marketingroutes in vier talen",
      "Uitbreidbare basis voor partners, agencies en integraties",
    ],
    ssr: {
      title: "Streaming prerendering voor alle publieke SEO-routes",
      description:
        "Tijdens de build worden publieke routes met Reacts streaming serverrenderer volledig naar HTML geschreven. Daardoor bevatten de uiteindelijke pagina’s al echte headings, content, metadata en structured data vóór de app in de browser start.",
      points: [
        "renderToPipeableStream wacht op lazy routes en Suspense-content",
        "Canonical en hreflang voor NL, EN, FR en DE",
        "Automatisch JSON-LD en FAQ-schema uit de gerenderde inhoud",
        "Buildcontrole stopt wanneer verplichte SEO-routes leeg blijven",
      ],
    },
    seoTitle: "SEO Websites: AI SEO- en GEO-SaaS platform | VisualVibe",
    seoDescription:
      "Ontdek het SEO Websites SaaS-platform met AI-content, productgenerator, websiteanalyse, workspaces, betalingen, CMS-plugins en server-side prerendering.",
  },
  {
    id: "visualvibe",
    slug: "visualvibe-website-contentplatform",
    title: "VisualVibe",
    client: "VISUALVIBE · WEBSITE, KENNISBANK EN PORTFOLIOPLATFORM",
    websiteUrl: "https://visualvibe.media/be/",
    status: "live",
    published: true,
    featured: false,
    tags: ["Next.js", "Contentplatform", "SSR & ISR"],
    tagline: "Een snelle marketingwebsite met een eigen content-, portfolio- en communicatiebackend.",
    excerpt:
      "De VisualVibe-site combineert uitgebreide dienstarchitectuur, kennisbankclusters, realisaties, sectorpagina’s, leads, e-mail en adminbeheer in één servergerenderde Next.js-app.",
    challenge:
      "Een creatief bureau heeft veel verschillende soorten inhoud: diensten, subdiensten, regio’s, sectoren, artikels, fotografie, video, cases en aanvragen. Die onderdelen moeten SEO-technisch samenhangen zonder dat beheer, performance of navigatie onoverzichtelijk wordt.",
    solution:
      "We bouwden een datagedreven Next.js-platform waarin routes, canonicals, sitemap, navigatie en interne links vanuit dezelfde bronnen worden gevoed. Firestore beheert dynamische portfolio- en admininhoud, terwijl MDX en typed datasets de uitgebreide kennis- en dienstenarchitectuur betrouwbaar publiceren.",
    capabilities: [
      "Diensten-, sector-, regio- en realisatiearchitectuur",
      "Pillar- en clusterkennisbank met validatie",
      "Adminbeheer voor portfolio, fotografie en contentbeelden",
      "Leads, nieuwsbrief en volledige IMAP/SMTP-mailbox",
      "Meertalige routing en canonicalbeheer",
      "Dynamische XML- en zichtbare sitemap",
      "Structured data voor diensten, artikels en collecties",
      "Firebase Storage en Firestore met server-side fallbacks",
    ],
    technology: [
      "Next.js App Router",
      "React 19 Server Components",
      "Firebase Auth, Firestore en Storage",
      "MDX",
      "next-intl",
      "IMAPFlow en Nodemailer",
      "Sharp",
    ],
    results: [
      "Eén onderhoudbare bron voor menu, sitemap en canonicalroutes",
      "Servergerenderde marketing- en kennispagina’s",
      "Portfolio-inhoud zonder nieuwe code via het adminpaneel",
      "Een schaalbare structuur voor nieuwe diensten en clusters",
    ],
    ssr: {
      title: "Next.js Server Components met ISR voor beheerbare inhoud",
      description:
        "Publieke pagina’s worden op de server samengesteld. Firestore-gestuurde realisaties gebruiken korte revalidatie, zodat nieuwe beheerde content verschijnt zonder dat elke bezoeker een lege client-app moet laden.",
      points: [
        "Server Components voor indexeerbare HTML",
        "ISR voor Firestore-gestuurde portfolio-onderdelen",
        "Self-referencing canonicals en locale-routing",
        "Server-side metadata, Open Graph en structured data",
      ],
    },
    seoTitle: "VisualVibe website en servergerenderd contentplatform",
    seoDescription:
      "Bekijk hoe VisualVibe zijn eigen Next.js-platform bouwde met SSR, ISR, kennisbankclusters, realisaties, Firestore-beheer, leads, e-mail en technische SEO.",
  },
  {
    id: "pelletkachelzorg",
    slug: "pelletkachelzorg-multisite-commerce-platform",
    title: "Pelletkachelzorg",
    client: "PELLETKACHELZORG · MULTI-SITE CMS EN E-COMMERCE",
    websiteUrl: "https://pelletkachelzorg.be/",
    status: "in-development",
    published: true,
    featured: false,
    tags: ["In ontwikkeling", "Multi-site", "Commerce & CMS"],
    tagline: "Een multi-site bedrijfsplatform voor verkoop, service, content en communicatie.",
    excerpt:
      "Pelletkachelzorg groeit uit tot een multi-website CMS en shopplatform met catalogus, voorraad, orders, betalingen, builders, communicatie en per-site instellingen.",
    challenge:
      "Verschillende websites, merken en talen moeten producten, content, klanten en communicatie kunnen delen waar dat nuttig is, maar strikt gescheiden blijven waar bedrijf, prijzen, bestellingen of configuratie verschillen. Tegelijk moet de backend bruikbaar blijven voor dagelijkse medewerkers.",
    solution:
      "We ontwikkelen een Next.js-platform waarin iedere website een eigen configuratie, domein, huisstijl, content, shopinstellingen en communicatieomgeving krijgt. De server blijft de bron van waarheid voor prijzen, opties, voorraad, verzending, btw en betalingen. Het CMS en de visuele builders maken de publieke websites beheerbaar zonder code.",
    capabilities: [
      "Multi-site en multi-brand beheer vanuit één omgeving",
      "Producten, variaties, gekoppelde producten en voorraad",
      "Server-authoritative checkout, verzending, btw en B2B/VIES",
      "Mollie-betalingen, orders, statussen en e-mailflows",
      "Pagina-, blog-, diensten- en menubeheer",
      "Visuele header-, footer- en sidebarbuilders",
      "Communicatiecentrum met IMAP, SMTP en offerteaanvragen",
      "Per-site API-, e-mail-, permalink- en onderhoudsinstellingen",
    ],
    technology: [
      "Next.js 16 App Router",
      "React 19",
      "Firebase Auth, Firestore en Storage",
      "Mollie",
      "IMAPFlow en Nodemailer",
      "TipTap",
      "Puppeteer en Sharp",
    ],
    results: [
      "Eén technische basis voor meerdere zelfstandige websites",
      "Strikte scheiding tussen gedeelde kerngegevens en sitespecifieke presentatie",
      "Prijzen, voorraad en bestellingen opnieuw gevalideerd op de server",
      "In ontwikkeling: gefaseerde uitrol van shop, CMS en communicatie",
    ],
    ssr: {
      title: "Next.js SSR met server-authoritative commerce",
      description:
        "De publieke pagina’s en dynamische CMS-routes worden via de App Router op de server opgebouwd. Ook de kritieke commercebeslissingen gebeuren server-side, zodat prijzen, opties en voorraad niet door clientdata kunnen worden gemanipuleerd.",
      points: [
        "Server Components en dynamische catch-all routes",
        "Canonical redirects en sitespecifieke sitemap",
        "Server-side herberekening van catalogus, verzending en btw",
        "Per-site domeinresolutie via Host en X-Forwarded-Host",
      ],
    },
    seoTitle: "Pelletkachelzorg multi-site CMS en commerceplatform",
    seoDescription:
      "Bekijk het Pelletkachelzorg-platform in ontwikkeling: multi-site CMS, catalogus, voorraad, Mollie, server-side checkout, builders en communicatiecentrum.",
  },
];

export type LocalizedApplicationCaseRecord = ApplicationCase & {
  id: string;
  imageAlts?: EnglishApplicationCaseLocaleRecord["imageAlts"];
};

/**
 * Resolves the checked-in default records only. Firestore can replace the Dutch
 * project array at runtime, but its legacy free-text records do not yet carry
 * locale-keyed editorial fields. Callers must not treat those records as English.
 */
export function getLocalizedApplicationCaseById(
  id: string,
  locale: SupportedLocale,
): LocalizedApplicationCaseRecord {
  const source = applicationCases.find((project) => project.id === id);
  if (!source) throw new Error(`Unknown application case ID: ${id}`);
  if (locale === "nl") return { ...source, id };
  if (locale !== "en") {
    throw new Error(`Missing ${locale} translation for applicationCase.${id}`);
  }
  const translated = englishApplicationCaseEditorial[id];
  if (!translated) throw new Error(`Missing en translation for applicationCase.${id}`);
  return {
    ...source,
    ...translated,
    id,
    slug: translated.displaySlug,
  };
}

export function getApplicationCaseByLocalizedSlug(
  slug: string,
  locale: SupportedLocale,
): LocalizedApplicationCaseRecord {
  if (locale === "nl") {
    const source = applicationCases.find((project) => project.slug === slug);
    if (!source) throw new Error(`Unknown nl application case slug: ${slug}`);
    return { ...source, id: source.id };
  }
  if (locale !== "en") throw new Error(`Missing ${locale} translation for application cases`);
  const entry = Object.entries(englishApplicationCaseEditorial).find(
    ([, record]) => record.displaySlug === slug,
  );
  if (!entry) throw new Error(`Unknown ${locale} application case slug: ${slug}`);
  return getLocalizedApplicationCaseById(entry[0], locale);
}
