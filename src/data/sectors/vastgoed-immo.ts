import type { Sector } from "@/types";

// Volledig uitgewerkte SEO/AEO/GEO-sectorpagina (zelfde opzet als
// bouw-renovatie). Featured ids verwijzen naar echte content in de
// webdesign showcase en de fotogalerijen.
export const vastgoedImmo: Sector = {
  title: "Vastgoed & Immo",
  slug: "vastgoed-immo",
  icon: "vastgoed",
  tag: "Panden & makelaardij",
  cardDescription: "Panden presenteren met sfeervolle sites en visuals.",
  heroTitle: "Vastgoedfotografie, 3D-tours en dronebeelden voor makelaars en verhuurders",
  intro:
    "VisualVibe helpt makelaars, vastgoedkantoren en verhuurders om panden op hun best te presenteren met vastgoedfotografie, 3D-tours, dronebeelden en een sterke, vindbare website. Zo trekt elk zoekertje de juiste kandidaten aan en verkoopt of verhuurt een pand sneller.",
  painPoints: [
    "Te veel vrijblijvende bezichtigingen door onduidelijke online presentatie",
    "Panden vallen niet op tussen honderden andere zoekertjes",
    "Beperkte tijd om elk pand uitgebreid te presenteren",
  ],
  recommendedServices: ["vastgoedfotografie", "vastgoed-3d-tour", "vastgoed-dronebeelden"],
  relatedCases: [],
  relatedPosts: [],
  seo: {
    title: "Vastgoedfotografie en 3D-tours voor makelaars | VisualVibe",
    description:
      "Vastgoedfotografie, 3D-tours, dronebeelden en webdesign voor makelaars, vastgoedkantoren en verhuurders in Limburg en Vlaanderen. Verkoop of verhuur sneller.",
    keywords: [
      "vastgoedfotografie makelaar",
      "3d tour vastgoed Limburg",
      "dronebeelden vastgoed",
      "website makelaar",
      "webdesign vastgoedkantoor",
      "interieurfotografie vastgoed",
      "vastgoedfotografie Limburg",
      "marketing vastgoedkantoor",
    ],
  },

  answerIntro: {
    title: "Online groeien als makelaar of vastgoedkantoor",
    text: "Kopers en huurders beslissen online of een pand een bezichtiging waard is. Sterke foto's, een virtuele rondleiding en heldere informatie bepalen dus rechtstreeks hoe snel een pand verkocht of verhuurd raakt. VisualVibe combineert vastgoedfotografie, 3D-tours, dronebeelden en webdesign tot één professionele online presentatie voor makelaars, vastgoedkantoren en verhuurders.",
    highlights: [
      {
        title: "Beelden die panden doen opvallen",
        text: "Professionele interieur- en exterieurfotografie toont ruimte, lichtinval en afwerking zoals kandidaten ze willen zien, zodat een zoekertje opvalt tussen de rest.",
      },
      {
        title: "3D-tours en dronebeelden",
        text: "Met een virtuele rondleiding en dronebeelden van ligging en omgeving weten kandidaten vooraf wat ze mogen verwachten, zodat vooral echt geïnteresseerde mensen een bezichtiging aanvragen.",
      },
      {
        title: "Een kantoor dat lokaal gevonden wordt",
        text: "Een snelle, vindbare website met duidelijk aanbod en werkgebied zorgt dat eigenaars die willen verkopen of verhuren jouw kantoor vinden in plaats van een concurrent.",
      },
    ],
  },

  challengesIntro:
    "Veel makelaars en verhuurders hebben een sterk aanbod, maar online komt dat onvoldoende tot zijn recht. Daardoor blijven panden langer staan en gaat kostbare tijd verloren aan bezichtigingen met kandidaten die eigenlijk iets anders zoeken.",
  painPointsExpanded: [
    {
      title: "Zoekertjes vallen niet op",
      text: "Tussen honderden gelijkaardige zoekertjes verdwijnt zelfs een sterk pand als de foto's niet meteen overtuigen.",
    },
    {
      title: "Vrijblijvende bezichtigingen",
      text: "Een onduidelijke presentatie trekt kandidaten aan die het pand pas ter plaatse echt leren kennen, en dan afhaken.",
    },
    {
      title: "Te weinig tijd per pand",
      text: "Elk pand uitgebreid fotograferen en presenteren kost tijd die er in een druk kantoor zelden is.",
    },
    {
      title: "Foto's doen het pand geen recht",
      text: "Snelle smartphonefoto's vertekenen ruimtes en missen lichtinval en afwerking, net de elementen die een pand aantrekkelijk maken.",
    },
    {
      title: "Verouderde kantoorwebsite",
      text: "Eigenaars kiezen hun makelaar mee op basis van de website; een verouderde site straalt weinig vertrouwen uit bij het binnenhalen van nieuwe mandaten.",
    },
    {
      title: "Weinig lokale zichtbaarheid",
      text: "Wie in de regio een makelaar of huurwoning zoekt, vindt het kantoor niet, waardoor aanvragen naar beter vindbare concurrenten gaan.",
    },
  ],

  servicesTitle: "Marketingdiensten voor makelaars en vastgoedkantoren",
  servicesIntro:
    "Van vastgoedfotografie en 3D-tours tot dronebeelden: we combineren de diensten die een vastgoedkantoor nodig heeft om elk pand professioneel te presenteren en sneller te verkopen of verhuren.",

  casesTitle: "Websites voor vastgoed en verhuur",
  casesIntro:
    "Een sterke vastgoedwebsite presenteert het aanbod helder, beantwoordt de vragen van kandidaten en maakt contact opnemen of reserveren eenvoudig, ook op mobiel.",
  featuredWebdesignIds: ["studentenkot"],

  realisationsTitle: "Panden professioneel in beeld",
  realisationsIntro:
    "Sterke vastgoedfotografie toont ruimte, lichtinval, afwerking en ligging zoals een kandidaat ze wil zien. Zo krijgt elk pand een presentatie die opvalt tussen andere zoekertjes en de juiste verwachtingen schept voor de bezichtiging.",
  // Live Firestore-ids (Vastgoedfotografie Markus Vastgoed en
  // Realisatiefotografie vastgoed Medapro) eerst; "vastgoed" is de
  // seed-fallback-galerij Vastgoedfotografie. Onbekende ids worden geskipt.
  featuredGalleryIds: ["g-6e1c8210", "g-218fcbe1", "vastgoed"],

  processTitle: "Zo brengen we jouw vastgoedaanbod sterker in beeld",
  processSteps: [
    {
      title: "Kennismaking en positionering",
      description: "We brengen je aanbod, doelgroep, werkgebied en de sterktes van je kantoor in kaart.",
    },
    {
      title: "Content en beeldplan",
      description: "We bepalen welke fotografie, 3D-tours, dronebeelden en teksten elk pand en het kantoor zelf nodig hebben.",
    },
    {
      title: "Website en vindbaarheid",
      description: "We bouwen de website rond een helder aanbod, sterke pandpresentaties, lokale relevantie en eenvoudige contactmomenten.",
    },
    {
      title: "Groeien met nieuw aanbod",
      description: "Nieuwe panden en projecten kunnen later als aanbod, galerij, case of kennisartikel worden toegevoegd.",
    },
  ],

  proofTitle: "Waarom makelaars en verhuurders voor VisualVibe kiezen",
  proofPoints: [
    {
      title: "Alles bij één partner",
      text: "Webdesign en professionele visuals bij één partner, zodat website, zoekertjes en beeldmateriaal naadloos op elkaar aansluiten.",
    },
    {
      title: "Foto, drone en 3D onder één dak",
      text: "Fotografie, dronebeelden en 3D-tours van hetzelfde pand in één planning; drone-opnames gebeuren EASA-gecertificeerd en verzekerd.",
    },
    {
      title: "Eigen fotografie",
      text: "Eigen fotografie in plaats van generieke stockbeelden, zodat kandidaten het echte pand en het echte kantoor zien.",
    },
    {
      title: "Websites die meegroeien",
      text: "Websites die met nieuw aanbod meegroeien: elk pand en elk project versterkt je online aanwezigheid.",
    },
    {
      title: "Lokale kennis",
      text: "Lokale kennis van Limburg en Vlaanderen, en van de regio's waar jouw kopers, huurders en eigenaars zoeken.",
    },
    {
      title: "Eén consistente stijl",
      text: "Eén consistente stijl voor website, foto, video en sociale media, herkenbaar bij elk pand en op elk kanaal.",
    },
  ],

  localSection: {
    title: "Creatieve partner voor vastgoedkantoren in Limburg en Vlaanderen",
    text: "VisualVibe is gevestigd in Tongeren-Borgloon en werkt voor makelaars, vastgoedkantoren en verhuurders in Limburg en de rest van Vlaanderen. Voor fotografie, video en dronebeelden komen we op locatie bij elk pand. Websites, campagnes en content worden vanuit één centrale strategie ontwikkeld.",
    regionSlugs: ["limburg", "vlaanderen"],
  },

  faq: [
    {
      question: "Wat kost vastgoedfotografie voor een makelaar?",
      answer:
        "De prijs hangt af van het type en de grootte van het pand, het aantal panden, en of je fotografie combineert met een 3D-tour of dronebeelden. Na een kennismaking ontvang je een duidelijke offerte op maat.",
    },
    {
      question: "Wat moet er op de website van een vastgoedkantoor staan?",
      answer:
        "Een sterke website bevat een helder aanbod met professionele pandpresentaties, duidelijke diensten zoals verkoop, verhuur en schatting, het werkgebied, informatie over de werkwijze, vertrouwenwekkende kantoorinformatie en een eenvoudige manier om contact op te nemen.",
    },
    {
      question: "Hoe wordt een vastgoedkantoor lokaal beter gevonden?",
      answer:
        "Lokale vindbaarheid ontstaat door een technisch sterke website, duidelijke dienstenpagina's, relevante regio-informatie, consistente bedrijfsgegevens, een actueel aanbod en nuttige content rond de vragen van kopers, huurders en eigenaars.",
    },
    {
      question: "Maken jullie ook 3D-tours en dronebeelden van panden?",
      answer:
        "Ja. VisualVibe combineert vastgoedfotografie met 3D-tours en dronebeelden, zodat kandidaten het pand virtueel kunnen bekijken en de ligging meteen begrijpen. Drone-opnames gebeuren EASA-gecertificeerd en verzekerd.",
    },
    {
      question: "Kunnen we later zelf nieuwe panden toevoegen?",
      answer:
        "Dat hangt af van de gekozen websiteopbouw. We kunnen een beheersysteem voorzien waarmee nieuwe panden, foto's en teksten eenvoudig kunnen worden toegevoegd.",
    },
    {
      question: "Werkt VisualVibe alleen in Limburg?",
      answer:
        "VisualVibe is gevestigd in Limburg en werkt voor klanten in heel Vlaanderen. Voor fotografie, video en drone-opnames wordt vooraf bekeken wat praktisch mogelijk is op de locatie.",
    },
  ],

  knowledgeKeywords: [
    "makelaar",
    "vastgoed",
    "immo",
    "vastgoedfotografie",
    "interieurfotografie",
    "3d-tour",
    "dronebeelden",
    "verhuur",
    "woningfotografie",
    "lokale seo",
  ],
  knowledgeCategories: ["webdesign", "fotografie", "drone", "3d-vr", "seo-geo"],

  ctaTitle: "Klaar om je panden op hun best te presenteren?",
  ctaText:
    "Vertel ons over je kantoor en je aanbod. Je ontvangt een duidelijke offerte op maat, zonder verplichtingen.",
};
