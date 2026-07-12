import type { Sector } from "@/types";

// Volledig uitgewerkte SEO/AEO/GEO-sectorpagina voor KMO's en lokale
// ondernemers. Structuur volgt bouw-renovatie.ts; featured ids verwijzen
// naar echte content in de webdesign showcase, fotogalerijen en video's.
export const kmo: Sector = {
  title: "KMO",
  slug: "kmo",
  icon: "kmo",
  tag: "Ondernemerschap & lokaal",
  cardDescription: "Websites en branding die lokale ondernemers doen opvallen.",
  heroTitle: "Webdesign, lokale SEO en fotografie voor KMO's en lokale ondernemers",
  intro:
    "VisualVibe helpt KMO's, zelfstandigen en lokale ondernemers om professioneel voor de dag te komen met webdesign, lokale SEO, bedrijfsfotografie en video, zodat klanten in de eigen regio je vinden en vertrouwen.",
  painPoints: [
    "Beperkt budget voor marketing en online zichtbaarheid",
    "Verouderde of trage website die geen leads oplevert",
    "Moeilijk om lokaal gevonden te worden tussen grotere concurrenten",
  ],
  recommendedServices: ["website-laten-maken", "lokale-seo", "bedrijfsfotografie"],
  relatedCases: [],
  relatedPosts: [],
  seo: {
    title: "Webdesign en lokale SEO voor KMO's in Limburg | VisualVibe",
    description:
      "Webdesign, lokale SEO, bedrijfsfotografie en video voor KMO's en lokale ondernemers in Limburg en Vlaanderen. Eén partner voor je website en beeldmateriaal.",
    keywords: [
      "webdesign KMO",
      "website KMO Limburg",
      "lokale SEO KMO",
      "bedrijfsfotografie Limburg",
      "marketing KMO",
      "website kleine onderneming",
      "SEO lokale ondernemer",
      "mediabureau Limburg",
    ],
  },

  answerIntro: {
    title: "Online groeien als KMO of lokale ondernemer",
    text: "Een KMO wint klanten met vertrouwen en nabijheid, en dat moet ook online zichtbaar zijn. Een sterke website toont in enkele seconden wat je doet, voor wie en in welke regio, en maakt contact opnemen vanzelfsprekend. VisualVibe combineert webdesign, lokale SEO, bedrijfsfotografie en video tot één samenhangend geheel. Zo kom je professioneel over, ook naast concurrenten met een groter marketingbudget.",
    highlights: [
      {
        title: "Een website die klanten oplevert",
        text: "Breng je aanbod, je verhaal, je regio en je contactmogelijkheden helder samen in een snelle website die professioneel aanvoelt op desktop en mobiel.",
      },
      {
        title: "Eigen beelden met een echt gezicht",
        text: "Met professionele foto's van je team, je zaak en je werk zien bezoekers meteen wie ze contacteren, in plaats van inwisselbare stockbeelden.",
      },
      {
        title: "Gevonden worden in de eigen regio",
        text: "Door een duidelijk aanbod, consistente bedrijfsgegevens en relevante regio-informatie bouw je duurzame lokale zichtbaarheid op waar je klanten zoeken.",
      },
    ],
  },

  challengesIntro:
    "Veel KMO's leveren sterk werk en hebben tevreden klanten, maar hun online aanwezigheid blijft achter op de kwaliteit van de zaak zelf. Daardoor gaan aanvragen naar concurrenten die online net iets professioneler en zichtbaarder overkomen.",
  painPointsExpanded: [
    {
      title: "Beperkt marketingbudget",
      text: "Elke euro moet renderen, waardoor er weinig ruimte is voor losse experimenten bij verschillende leveranciers zonder duidelijk plan.",
    },
    {
      title: "Verouderde of trage website",
      text: "Een verouderde of trage website straalt weinig vertrouwen uit en levert nauwelijks aanvragen op, hoe goed de zaak zelf ook draait.",
    },
    {
      title: "Onzichtbaar in de eigen regio",
      text: "Grotere concurrenten en ketens nemen de zoekresultaten in, terwijl een KMO het net moet hebben van klanten uit de eigen streek.",
    },
    {
      title: "Geen tijd voor marketing",
      text: "De zaak runnen vraagt alle aandacht, waardoor website, teksten en beelden blijven liggen tot het echt niet anders meer kan.",
    },
    {
      title: "Stockbeelden in plaats van een eigen gezicht",
      text: "Generieke stockfoto's verbergen net wat een lokale zaak sterk maakt: het team, de zaak en de mensen erachter.",
    },
    {
      title: "Versnipperde online aanwezigheid",
      text: "Website, sociale media en bedrijfsgegevens vertellen elk een ander verhaal, zonder duidelijke volgende stap voor de bezoeker.",
    },
  ],

  servicesTitle: "Marketingdiensten voor KMO's en lokale ondernemers",
  servicesIntro:
    "Van een snelle website tot lokale vindbaarheid en professionele bedrijfsfotografie: we combineren de diensten die een KMO nodig heeft om op te vallen en meer aanvragen uit de eigen regio te krijgen.",

  casesTitle: "Websites voor KMO's en lokale ondernemers",
  casesIntro:
    "Bekijk hoe andere lokale ondernemers hun zaak online presenteren: van winkel tot technisch dienstenbedrijf, telkens met een duidelijke structuur en een vlotte weg naar contact of offerte.",
  featuredWebdesignIds: ["gordijnenmyriam", "eluk", "nozeco"],

  realisationsTitle: "Lokale zaken en teams professioneel in beeld",
  realisationsIntro:
    "Sterke bedrijfsfotografie toont je zaak, je team en je manier van werken zoals klanten die ter plaatse ervaren. Zo zien bezoekers niet alleen wat je aanbiedt, maar vooral bij wie ze terechtkomen.",
  // Live Firestore-ids (Bedrijfsfotografie Gordijnen Myriam Hasselt en
  // Bedrijfsfotografie Kinderrijck Bilzen) eerst; "bedrijf" is de
  // seed-fallback-galerij Bedrijfsfotografie. Onbekende ids worden geskipt.
  featuredGalleryIds: ["g-554fd891", "g-0ba1ec1a", "bedrijf"],

  mediaTitle: "Video voor KMO's en lokale ondernemers",
  mediaIntro:
    "Een bedrijfs-, wervings- of promovideo laat zien wie er achter de zaak zit en waarom klanten en medewerkers voor jou kiezen. Zo'n video is breed inzetbaar: op je website, op sociale media en in regionale campagnes.",
  featuredVideoIds: ["zj4hvA8tdTA", "kfjoL_cUTPQ"],

  processTitle: "Zo brengen we jouw zaak sterker in beeld",
  processSteps: [
    {
      title: "Kennismaking en positionering",
      description: "We brengen je aanbod, doelgroep, regio en wat jouw zaak onderscheidt van grotere concurrenten in kaart.",
    },
    {
      title: "Content en beeldplan",
      description: "We bepalen welke pagina's, foto's, video en teksten nodig zijn om vertrouwen op te bouwen en aanvragen te krijgen.",
    },
    {
      title: "Website en vindbaarheid",
      description: "We bouwen de website rond een duidelijk aanbod, eigen beelden, lokale relevantie en eenvoudige contactmomenten.",
    },
    {
      title: "Groeien op eigen tempo",
      description: "Nieuwe diensten, acties, foto's of kennisartikelen kunnen later stap voor stap worden toegevoegd, op het ritme van je zaak.",
    },
  ],

  proofTitle: "Waarom KMO's voor VisualVibe kiezen",
  proofPoints: [
    {
      title: "Alles bij één partner",
      text: "Webdesign en professionele visuals bij één partner, zodat website en beeldmateriaal naadloos op elkaar aansluiten.",
    },
    {
      title: "Op maat van een KMO",
      text: "Heldere afspraken en een offerte op maat, zonder onnodig grote trajecten: we bouwen wat jouw zaak nu nodig heeft.",
    },
    {
      title: "Eigen fotografie",
      text: "Eigen fotografie in plaats van generieke stockbeelden, zodat bezoekers jouw echte zaak en jouw team zien.",
    },
    {
      title: "Websites die meegroeien",
      text: "Websites die met je zaak meegroeien: nieuwe diensten, acties en content krijgen later eenvoudig een plek.",
    },
    {
      title: "Lokale kennis",
      text: "Lokale kennis van Limburg en Vlaanderen, en van de regio's waar jouw klanten een lokale ondernemer zoeken.",
    },
    {
      title: "Eén consistente stijl",
      text: "Eén consistente stijl voor website, foto, video en sociale media, herkenbaar op elk kanaal.",
    },
  ],

  localSection: {
    title: "Creatieve partner voor KMO's in Limburg en Vlaanderen",
    text: "VisualVibe is gevestigd in Tongeren-Borgloon en werkt voor KMO's, zelfstandigen en lokale ondernemers in Limburg en de rest van Vlaanderen. Voor fotografie en video komen we op locatie. Websites, campagnes en content worden vanuit één centrale strategie ontwikkeld.",
    regionSlugs: ["limburg", "vlaanderen"],
  },

  faq: [
    {
      question: "Wat kost een website voor een KMO?",
      answer:
        "De prijs hangt af van de omvang van de website, het aantal diensten en pagina's, gewenste fotografie of video, talen en koppelingen. Na een kennismaking ontvang je een duidelijke offerte op maat, afgestemd op wat jouw zaak nu nodig heeft.",
    },
    {
      question: "Wat moet er op de website van een KMO staan?",
      answer:
        "Een sterke website bevat een duidelijk aanbod, informatie over de zaak en het team, het werkgebied, praktische gegevens zoals contactinformatie en bereikbaarheid, en een eenvoudige manier om contact op te nemen of een offerte aan te vragen.",
    },
    {
      question: "Hoe wordt een KMO lokaal beter gevonden?",
      answer:
        "Lokale vindbaarheid ontstaat door een technisch sterke website, duidelijke dienstenpagina's, relevante regio-informatie, consistente bedrijfsgegevens, echte beelden van de zaak en nuttige content rond de vragen van potentiële klanten.",
    },
    {
      question: "Kunnen jullie ook foto's en video van onze zaak maken?",
      answer:
        "Ja. VisualVibe combineert webdesign met bedrijfsfotografie, video en dronebeelden en komt daarvoor op locatie. Daardoor sluiten website en beeldmateriaal visueel en inhoudelijk op elkaar aan.",
    },
    {
      question: "Kunnen we later zelf content toevoegen?",
      answer:
        "Dat hangt af van de gekozen websiteopbouw. We kunnen een beheersysteem voorzien waarmee nieuwe diensten, acties, foto's en teksten eenvoudig kunnen worden toegevoegd.",
    },
    {
      question: "Werkt VisualVibe alleen in Limburg?",
      answer:
        "VisualVibe is gevestigd in Limburg en werkt voor klanten in heel Vlaanderen. Voor fotografie, video en drone-opnames wordt vooraf bekeken wat praktisch mogelijk is op de locatie.",
    },
  ],

  knowledgeKeywords: [
    "kmo",
    "lokale ondernemer",
    "zelfstandige",
    "lokale seo",
    "bedrijfsfotografie",
    "website laten maken",
    "vindbaarheid",
    "google bedrijfsprofiel",
    "huisstijl",
    "bedrijfsvideo",
  ],
  knowledgeCategories: ["webdesign", "seo-geo", "fotografie", "videografie"],

  ctaTitle: "Klaar om jouw zaak online te laten opvallen?",
  ctaText:
    "Vertel ons over je zaak en je plannen. Je ontvangt een duidelijke offerte op maat, zonder verplichtingen.",
};
