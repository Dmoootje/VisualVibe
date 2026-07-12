import type { Sector } from "@/types";

// Volledig uitgewerkte SEO/AEO/GEO-sectorpagina voor winkels en webshops,
// opgebouwd volgens het referentievoorbeeld bouw-renovatie. Featured ids
// verwijzen naar echte content in de webdesign showcase en fotogalerijen.
export const retailWebshops: Sector = {
  title: "Retail & Webshops",
  slug: "retail-webshops",
  icon: "retail",
  tag: "Online & offline verkoop",
  cardDescription: "Webshops en campagnes die verkopen, online én in de winkel.",
  heroTitle: "Webshops en productfotografie voor winkels en webshops",
  intro:
    "VisualVibe helpt winkels en webshops om hun producten aantrekkelijk te presenteren met webdesign, productfotografie, video en lokale vindbaarheid, zodat bezoekers klanten worden, online én in de winkel.",
  painPoints: [
    "Productfoto's ogen niet professioneel genoeg tussen grotere concurrenten",
    "Webshop is traag of moeilijk te beheren",
    "Weinig terugkerende klanten door een zwakke online uitstraling",
  ],
  recommendedServices: ["webshop-laten-maken", "productfotografie", "social-media-video"],
  relatedCases: [],
  relatedPosts: [],
  seo: {
    title: "Webshops en productfotografie voor winkels | VisualVibe",
    description:
      "Webshops, productfotografie, video en lokale SEO voor winkels en webshops in Limburg en Vlaanderen. Eén partner voor je webshop en al je beeldmateriaal.",
    keywords: [
      "webshop laten maken",
      "productfotografie webshop",
      "website winkel",
      "webdesign retail",
      "productfotografie Limburg",
      "webshop Limburg",
      "lokale SEO winkel",
      "marketing webshop",
    ],
  },

  answerIntro: {
    title: "Online groeien als winkel of webshop",
    text: "Een sterke webshop of winkelwebsite moet meer doen dan producten opsommen. Bezoekers willen producten helder in beeld zien, vlot vinden wat ze zoeken en zonder drempels kunnen bestellen of langskomen. VisualVibe combineert webdesign, productfotografie, video en lokale vindbaarheid tot één digitaal geheel dat online en in de winkel verkoopt.",
    highlights: [
      {
        title: "Een webshop die verkoopt",
        text: "Breng assortiment, productinformatie, bestelmogelijkheden en winkelgegevens helder samen in een snelle webshop die vlot werkt op desktop en mobiel.",
      },
      {
        title: "Productfoto's die overtuigen",
        text: "Met professionele productfotografie, sfeerbeelden en detailopnames zien bezoekers meteen de kwaliteit van je producten en de beleving van je winkel.",
      },
      {
        title: "Gevonden worden door lokale kopers",
        text: "Door producten, categorieën, winkelinformatie en relevante regiopagina's logisch met elkaar te verbinden, bouw je duurzame zichtbaarheid op bij mensen die willen kopen.",
      },
    ],
  },

  challengesIntro:
    "Veel winkels en webshops hebben een sterk assortiment, maar hun online presentatie doet dat onvoldoende recht. Daardoor kiezen potentiële klanten voor grotere spelers, terwijl kwaliteit, service en beleving nauwelijks zichtbaar worden.",
  painPointsExpanded: [
    {
      title: "Productfoto's overtuigen niet",
      text: "Snelle smartphonefoto's vallen weg naast de verzorgde beelden van grotere concurrenten, waardoor producten minder waardevol ogen dan ze zijn.",
    },
    {
      title: "Trage of logge webshop",
      text: "Een webshop die traag laadt of moeilijk te beheren is, kost verkopen en maakt het bijhouden van assortiment en voorraad onnodig zwaar.",
    },
    {
      title: "Weinig terugkerende klanten",
      text: "Zonder herkenbare stijl en verzorgde uitstraling blijft je merk niet hangen en komen klanten na één aankoop niet vanzelf terug.",
    },
    {
      title: "Online en winkel sluiten niet aan",
      text: "De webshop en de fysieke winkel vertellen elk een ander verhaal, waardoor klanten de herkenbaarheid en het vertrouwen missen.",
    },
    {
      title: "Producten slecht vindbaar",
      text: "Zonder duidelijke categorieën, sterke productteksten en een technisch gezonde basis worden producten niet gevonden door wie er online naar zoekt.",
    },
    {
      title: "Geen duidelijke route naar aankoop",
      text: "Bezoekers vinden niet vlot wat ze zoeken of stranden onderweg, waardoor ze afhaken voor ze bestellen of langskomen.",
    },
  ],

  servicesTitle: "Marketingdiensten voor winkels en webshops",
  servicesIntro:
    "Van een snelle webshop tot professionele productfoto's en video voor sociale media: we combineren de diensten die een winkel nodig heeft om producten aantrekkelijk te tonen en meer te verkopen.",

  casesTitle: "Websites en webshops voor winkels",
  casesIntro:
    "Een goede winkelwebsite verbindt assortiment, huisstijl en beeldmateriaal tot één herkenbaar geheel dat klanten overtuigt om te bestellen of langs te komen.",
  featuredWebdesignIds: ["gordijnenmyriam"],

  realisationsTitle: "Producten en winkels professioneel in beeld",
  realisationsIntro:
    "Sterke productfotografie toont materiaal, kleur, afwerking en de beleving van je winkel. Zo zien klanten niet alleen wat je verkoopt, maar vooral waarom het de aankoop waard is.",
  // Live Firestore-ids eerst (productfotografie kleding, bedrijfsfotografie
  // schoenenwinkel en slaapcomfortzaak); "product" is de gelijkaardige galerij
  // in de seed-fallback. Onbekende ids worden geskipt.
  featuredGalleryIds: ["g-c8ed509d", "g-dad68230", "g-10ce584e", "product"],

  processTitle: "Zo brengen we jouw winkel of webshop sterker in beeld",
  processSteps: [
    {
      title: "Kennismaking en positionering",
      description: "We brengen assortiment, doelgroep, regio en het onderscheidend vermogen van je winkel of webshop in kaart.",
    },
    {
      title: "Content en beeldplan",
      description: "We bepalen welke productfoto's, sfeerbeelden, video en teksten nodig zijn om producten aantrekkelijk en geloofwaardig te tonen.",
    },
    {
      title: "Webshop en vindbaarheid",
      description: "We bouwen de webshop rond duidelijke categorieën, sterke productpresentatie, lokale relevantie en een vlotte weg naar aankoop of winkelbezoek.",
    },
    {
      title: "Groeien met nieuw aanbod",
      description: "Nieuwe collecties, producten en acties kunnen later als productpagina, galerij of kennisartikel worden toegevoegd.",
    },
  ],

  proofTitle: "Waarom winkels en webshops voor VisualVibe kiezen",
  proofPoints: [
    {
      title: "Alles bij één partner",
      text: "Webdesign en professionele visuals bij één partner, zodat webshop en beeldmateriaal naadloos op elkaar aansluiten.",
    },
    {
      title: "Ervaring met productpresentatie",
      text: "Ervaring met productfotografie en bedrijfsreportages voor winkels: we weten hoe je producten en winkelbeleving in beeld brengt.",
    },
    {
      title: "Eigen fotografie",
      text: "Eigen fotografie in plaats van generieke stockbeelden, zodat bezoekers jouw echte producten en jouw echte winkel zien.",
    },
    {
      title: "Webshops die meegroeien",
      text: "Webshops die met nieuwe collecties meegroeien: elk nieuw product of seizoen versterkt je online aanbod.",
    },
    {
      title: "Lokale kennis",
      text: "Lokale kennis van Limburg en Vlaanderen, en van de regio's waar jouw klanten winkelen en online bestellen.",
    },
    {
      title: "Eén consistente stijl",
      text: "Eén consistente stijl voor webshop, foto, video en sociale media, herkenbaar op elk kanaal, van etalage tot productpagina.",
    },
  ],

  localSection: {
    title: "Creatieve partner voor winkels en webshops in Limburg en Vlaanderen",
    text: "VisualVibe is gevestigd in Tongeren-Borgloon en werkt voor winkels, webshops en retailers in Limburg en de rest van Vlaanderen. Voor productfotografie en video komen we op locatie of richten we een setting in die bij je producten past. Webshops, campagnes en content worden vanuit één centrale strategie ontwikkeld.",
    regionSlugs: ["limburg", "vlaanderen"],
  },

  faq: [
    {
      question: "Wat kost een webshop voor een winkel?",
      answer:
        "De prijs hangt af van het aantal producten, gewenste functies zoals betalingen en voorraadbeheer, productfotografie, talen en koppelingen. Na een kennismaking ontvang je een duidelijke offerte op maat.",
    },
    {
      question: "Wat moet er op de website van een winkel of webshop staan?",
      answer:
        "Een sterke winkelwebsite bevat duidelijke productcategorieën, sterke productfoto's en productinformatie, openingsuren en winkelgegevens, informatie over levering of afhaling, vertrouwenwekkende bedrijfsinformatie en een eenvoudige weg naar bestellen of contact.",
    },
    {
      question: "Kunnen jullie ook onze productfoto's maken?",
      answer:
        "Ja. VisualVibe combineert webdesign met productfotografie, bedrijfsfotografie en video. Daardoor sluiten webshop en beeldmateriaal visueel en inhoudelijk op elkaar aan.",
    },
    {
      question: "Hoe wordt een winkel of webshop lokaal beter gevonden?",
      answer:
        "Lokale vindbaarheid ontstaat door een technisch sterke website, duidelijke categorie- en productpagina's, relevante regio-informatie, consistente bedrijfsgegevens, echte productfoto's en nuttige content rond de vragen van potentiële klanten.",
    },
    {
      question: "Kunnen we later zelf producten en foto's toevoegen?",
      answer:
        "Dat hangt af van de gekozen opbouw. We kunnen een beheersysteem voorzien waarmee nieuwe producten, foto's en teksten eenvoudig kunnen worden toegevoegd.",
    },
    {
      question: "Werkt VisualVibe alleen in Limburg?",
      answer:
        "VisualVibe is gevestigd in Limburg en werkt voor klanten in heel Vlaanderen. Voor fotografie, video en drone-opnames wordt vooraf bekeken wat praktisch mogelijk is op de locatie.",
    },
  ],

  knowledgeKeywords: [
    "webshop",
    "e-commerce",
    "productfotografie",
    "productfoto",
    "retail",
    "winkel",
    "conversie",
    "lokale seo",
    "online verkopen",
    "social media",
  ],
  knowledgeCategories: ["webdesign", "fotografie", "videografie", "seo-geo"],

  ctaTitle: "Klaar om meer te verkopen, online en in de winkel?",
  ctaText:
    "Vertel ons over je winkel, je webshop en je producten. Je ontvangt een duidelijke offerte op maat, zonder verplichtingen.",
};
