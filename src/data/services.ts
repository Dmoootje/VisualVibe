import type { Service } from "@/types";
import { subservices } from "./subservices";

// The 8 hoofddiensten (main services) - used for the top-level grid, nav,
// and footer. Subdiensten (child services with parentSlug set) live in
// ./subservices; use `allServices`/`getServiceBySlug` to look up either.
export const services: Service[] = [
  {
    title: "Webdesign",
    slug: "webdesign",
    category: "webdesign",
    excerpt: "Websites en webshops die klanten opleveren, niet enkel goed ogen.",
    intro:
      "VisualVibe bouwt snelle, gebruiksvriendelijke websites en webshops voor KMO's in Limburg. Van een strakke onepager tot een volledige webshop: elke website wordt opgebouwd rond snelheid, vindbaarheid en een duidelijk pad naar contact.",
    benefits: [
      "Website laten maken",
      "Webshop laten maken",
      "Onepager laten maken",
      "Website vernieuwen",
      "Website-onderhoud",
      "WordPress website laten maken",
      "SEO-website laten maken",
    ],
    process: [
      { title: "Kennismaking & briefing", description: "We bespreken je doelen, doelgroep en gewenste uitstraling." },
      { title: "Concept & structuur", description: "Sitemap, wireframes en een strak designvoorstel." },
      { title: "Bouw & content", description: "Ontwikkeling van de website met aandacht voor snelheid en SEO." },
      { title: "Lancering & onderhoud", description: "Livegang, training en optioneel doorlopend onderhoud." },
    ],
    faqs: [
      {
        question: "Hoeveel kost een website laten maken bij VisualVibe?",
        answer:
          "De prijs hangt af van omvang en functionaliteit - een onepager kost minder dan een webshop. Vraag een vrijblijvende offerte aan voor een prijsvoorstel op maat.",
      },
      {
        question: "Werken jullie met WordPress of maatwerk?",
        answer:
          "Beide: we adviseren WordPress voor KMO's die zelf content willen beheren, en maatwerk (zoals Next.js) wanneer snelheid en schaalbaarheid vooropstaan.",
      },
    ],
    relatedServices: ["seo", "fotografie", "videografie"],
    relatedRegions: ["limburg"],
    relatedCases: [],
    relatedPosts: [],
    seo: {
      title: "Webdesign Limburg | Websites voor KMO's | VisualVibe",
      description:
        "Website laten maken in Limburg? VisualVibe bouwt snelle, professionele websites met sterke beelden, SEO en conversiegerichte structuur.",
      keywords: [
        "webdesign Limburg",
        "website laten maken Limburg",
        "webdesigner Limburg",
        "professionele website laten maken",
        "website laten maken voor KMO",
      ],
    },
  },
  {
    title: "SEO",
    slug: "seo",
    category: "seo",
    excerpt: "Lokale vindbaarheid en zichtbaarheid in AI-zoekresultaten.",
    intro:
      "VisualVibe helpt KMO's in Limburg beter vindbaar worden in Google én in AI-zoekresultaten zoals ChatGPT en Google AI Overviews. Van technische SEO tot lokale optimalisatie en content die vragen van klanten rechtstreeks beantwoordt.",
    benefits: [
      "Lokale SEO",
      "Technische SEO",
      "SEO-copywriting",
      "Google Business Profiel-optimalisatie",
      "AI SEO / AEO / GEO",
    ],
    process: [
      { title: "SEO-audit", description: "Technische en inhoudelijke analyse van je huidige site." },
      { title: "Strategie & keywords", description: "Prioriteiten bepalen op basis van zoekvolume en concurrentie." },
      { title: "Uitvoering", description: "Technische fixes, content en linkstructuur implementeren." },
      { title: "Opvolging", description: "Maandelijkse rapportage en bijsturing." },
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen SEO en AEO/GEO?",
        answer:
          "SEO optimaliseert voor klassieke zoekresultaten; AEO (Answer Engine Optimization) en GEO (Generative Engine Optimization) optimaliseren specifiek voor vraag-antwoord- en AI-gegenereerde resultaten zoals ChatGPT en Google AI Overviews.",
      },
      {
        question: "Hoe snel zie ik resultaat van SEO?",
        answer:
          "Lokale SEO-verbeteringen zijn vaak binnen enkele weken merkbaar; competitieve landelijke termen vragen meestal 3 tot 6 maanden.",
      },
    ],
    relatedServices: ["webdesign", "fotografie"],
    relatedRegions: ["limburg"],
    relatedCases: [],
    relatedPosts: [],
    seo: {
      title: "SEO Bureau Limburg | Lokale Vindbaarheid | VisualVibe",
      description:
        "SEO bureau in Limburg voor lokale vindbaarheid en AI-zoekresultaten. Technische SEO, lokale SEO en GEO-strategie op maat van je KMO.",
      keywords: [
        "SEO Limburg",
        "SEO bureau Limburg",
        "lokale SEO",
        "technische SEO",
        "AI SEO",
        "AEO",
        "GEO",
        "Google vindbaarheid verbeteren",
      ],
    },
  },
  {
    title: "Fotografie",
    slug: "fotografie",
    category: "fotografie",
    excerpt: "Bedrijfsfotografie die je merk professioneel in beeld brengt.",
    intro:
      "Sterke beelden maken het verschil tussen een website die vertrouwen wekt en één die eraan voorbijgaat. VisualVibe fotografeert bedrijven, producten, events en vastgoed in heel Limburg.",
    benefits: [
      "Bedrijfsfotografie",
      "Zakelijke portretten",
      "Productfotografie",
      "Eventfotografie",
      "Vastgoedfotografie",
      "Realisatiefotografie",
      "Brandingfotografie",
    ],
    process: [
      { title: "Voorbereiding", description: "Shotlist en planning afgestemd op je merk en doel." },
      { title: "Shoot", description: "Fotoshoot op locatie of in studio." },
      { title: "Selectie & nabewerking", description: "Beeldselectie en professionele bewerking." },
      { title: "Levering", description: "Beelden geleverd in de juiste formaten voor web en print." },
    ],
    faqs: [
      {
        question: "Komen jullie ook buiten Limburg fotograferen?",
        answer:
          "Ja, we werken in heel Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg - vraag ernaar bij je offerte.",
      },
    ],
    relatedServices: ["videografie", "drone-fpv", "webdesign"],
    relatedRegions: ["limburg"],
    relatedCases: [],
    relatedPosts: [],
    seo: {
      title: "Bedrijfsfotograaf Limburg | VisualVibe",
      description:
        "Bedrijfsfotografie in Limburg voor sterke merken en professionele beelden. Zakelijke portretten, productfotografie en eventfotografie.",
      keywords: [
        "fotograaf Limburg",
        "bedrijfsfotograaf Limburg",
        "bedrijfsfotografie",
        "zakelijke fotografie",
        "productfotografie",
        "eventfotografie",
        "brandingfotografie",
      ],
    },
  },
  {
    title: "Videografie",
    slug: "videografie",
    category: "videografie",
    excerpt: "Bedrijfsvideo's, promovideo's en social content die opvallen.",
    intro:
      "Video is het sterkste middel om je verhaal te vertellen. VisualVibe maakt bedrijfsvideo's, promovideo's, aftermovies en wervingsvideo's voor bedrijven in Limburg en daarbuiten.",
    benefits: [
      "Bedrijfsvideo",
      "Promovideo",
      "Social media video",
      "Event-aftermovie",
      "Wervingsvideo",
      "Testimonial-video",
      "Podcastvideo",
      "Nieuwsreportage",
    ],
    process: [
      { title: "Script & concept", description: "Verhaallijn en boodschap uitwerken." },
      { title: "Opname", description: "Professionele opname op locatie." },
      { title: "Montage", description: "Editing, kleurcorrectie en geluid." },
      { title: "Aflevering", description: "Video's in de juiste formaten voor web en social media." },
    ],
    faqs: [
      {
        question: "Hoe lang duurt het maken van een bedrijfsvideo?",
        answer: "Van briefing tot eindresultaat reken je meestal op 2 tot 4 weken, afhankelijk van de omvang.",
      },
    ],
    relatedServices: ["fotografie", "drone-fpv", "podcasting"],
    relatedRegions: ["limburg"],
    relatedCases: [],
    relatedPosts: [],
    seo: {
      title: "Videograaf Limburg | Bedrijfsvideo laten maken | VisualVibe",
      description:
        "Videografie in Limburg voor bedrijven die willen opvallen. Bedrijfsvideo, promovideo en social media video op maat.",
      keywords: [
        "videograaf Limburg",
        "bedrijfsvideo laten maken",
        "promovideo laten maken",
        "social media video",
        "aftermovie laten maken",
        "wervingsvideo",
      ],
    },
  },
  {
    title: "Drone & FPV",
    slug: "drone-fpv",
    category: "drone-fpv",
    excerpt: "Dronebeelden en FPV-video voor bedrijven, vastgoed en events.",
    intro:
      "Dronebeelden geven een uniek perspectief op je project, gebouw of event. VisualVibe levert professionele drone- en FPV-video voor bedrijven, vastgoed en bouwprojecten in Limburg.",
    benefits: [
      "Dronefotografie",
      "Dronevideo",
      "FPV-video",
      "Vastgoed-dronebeelden",
      "Realisatie-dronebeelden",
      "Event-dronebeelden",
    ],
    process: [
      { title: "Vergunning & planning", description: "Vluchtplanning en waar nodig toestemmingen regelen." },
      { title: "Opname", description: "Drone- en/of FPV-opnames op locatie." },
      { title: "Montage", description: "Verwerking tot een afgewerkte video of beeldenset." },
    ],
    faqs: [],
    relatedServices: ["videografie", "fotografie", "3d-vr-ar"],
    relatedRegions: ["limburg"],
    relatedCases: [],
    relatedPosts: [],
    seo: {
      title: "Drone & FPV Video Limburg | VisualVibe",
      description: "Dronebeelden en FPV-video voor bedrijven, vastgoed en events in Limburg.",
      keywords: ["drone Limburg", "dronefotografie", "dronevideo", "FPV video", "vastgoed dronebeelden"],
    },
  },
  {
    title: "3D, VR & AR",
    slug: "3d-vr-ar",
    category: "3d-vr-ar",
    excerpt: "3D-tours en virtuele rondleidingen voor showrooms, vastgoed en horeca.",
    intro:
      "Een virtuele rondleiding laat klanten een ruimte verkennen nog voor ze binnenstappen. VisualVibe bouwt 3D-tours voor showrooms, vastgoed en horecazaken in Limburg.",
    benefits: [
      "3D-tour",
      "Virtuele rondleiding",
      "Showroom 3D-tour",
      "Vastgoed 3D-tour",
      "Horeca virtuele tour",
    ],
    process: [
      { title: "Opname", description: "360°-opnames van de volledige ruimte." },
      { title: "Verwerking", description: "Opbouw van de navigeerbare 3D-tour." },
      { title: "Integratie", description: "Inbouw op je website of Google Business Profiel." },
    ],
    faqs: [],
    relatedServices: ["drone-fpv", "fotografie"],
    relatedRegions: ["limburg"],
    relatedCases: [],
    relatedPosts: [],
    seo: {
      title: "3D Tour & Virtuele Rondleiding Limburg | VisualVibe",
      description: "3D-tours en virtuele rondleidingen voor showrooms, vastgoed en horeca in Limburg.",
      keywords: ["3D tour Limburg", "virtuele rondleiding", "showroom 3D tour", "vastgoed 3D tour"],
    },
  },
  {
    title: "Podcasting",
    slug: "podcasting",
    category: "podcasting",
    excerpt: "Podcast en videopodcast laten opnemen voor jouw bedrijf.",
    intro:
      "Een podcast positioneert jou of je bedrijf als expert. VisualVibe verzorgt opname, montage en videopodcast-productie, van eenmalige opname tot een volledig traject.",
    benefits: [
      "Bedrijfspodcast",
      "Videopodcast",
      "Podcast-opname",
      "Podcast-traject",
      "Podcast voor experts",
    ],
    process: [
      { title: "Concept", description: "Format en insteek van de podcast bepalen." },
      { title: "Opname", description: "Audio- en/of video-opname in studio of op locatie." },
      { title: "Montage & publicatie", description: "Editing en voorbereiding voor publicatie." },
    ],
    faqs: [],
    relatedServices: ["videografie", "webdesign"],
    relatedRegions: ["limburg"],
    relatedCases: [],
    relatedPosts: [],
    seo: {
      title: "Podcast Laten Opnemen Limburg | VisualVibe",
      description: "Podcast en videopodcast laten opnemen voor jouw bedrijf, van eenmalige opname tot volledig traject.",
      keywords: ["podcast opnemen Limburg", "videopodcast", "bedrijfspodcast", "podcast studio Limburg"],
    },
  },
  {
    title: "Masterclasses",
    slug: "masterclasses",
    category: "masterclasses",
    excerpt: "Masterclasses, opleidingen en workshops professioneel laten opnemen.",
    intro:
      "Zet je opleiding, workshop of masterclass om in professionele video content - voor eigen gebruik of als online cursus.",
    benefits: ["Opleiding opnemen", "Online cursus video", "Workshop filmen"],
    process: [
      { title: "Planning", description: "Afstemmen op locatie, timing en gewenst eindresultaat." },
      { title: "Opname", description: "Multicamera-opname van de sessie." },
      { title: "Montage", description: "Verwerking tot afgewerkte modules of aftermovie." },
    ],
    faqs: [],
    relatedServices: ["videografie", "podcasting"],
    relatedRegions: ["limburg"],
    relatedCases: [],
    relatedPosts: [],
    seo: {
      title: "Masterclass & Opleiding Filmen Limburg | VisualVibe",
      description: "Masterclasses, opleidingen en workshops professioneel laten opnemen in Limburg.",
      keywords: ["masterclass opnemen", "opleiding filmen", "workshop video Limburg"],
    },
  },
];

export const allServices: Service[] = [...services, ...subservices];

export function getServiceBySlug(slug: string): Service | undefined {
  return allServices.find((service) => service.slug === slug);
}
