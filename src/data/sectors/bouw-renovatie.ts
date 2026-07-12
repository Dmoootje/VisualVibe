import type { Sector } from "@/types";

// Volledig uitgewerkte SEO/AEO/GEO-sectorpagina (referentie voor de andere
// sectoren). Copy komt uit de sectorpagina-handoff; featured ids verwijzen
// naar echte content in de webdesign showcase, fotogalerijen en dronemedia.
export const bouwRenovatie: Sector = {
  title: "Bouw & Renovatie",
  slug: "bouw-renovatie",
  icon: "bouw",
  tag: "Constructie & vakwerk",
  cardDescription: "Digitale uitstraling voor aannemers en renovatiespecialisten.",
  heroTitle: "Webdesign en fotografie voor bouw- en renovatiebedrijven",
  intro:
    "VisualVibe helpt bouwbedrijven, aannemers en renovatiespecialisten om hun vakmanschap professioneel te presenteren met webdesign, realisatiefotografie, video en lokale vindbaarheid.",
  painPoints: [
    "Moeilijk om de kwaliteit van afgewerkt werk online te tonen",
    "Website toont geen recente realisaties",
    "Weinig zichtbaarheid bij mensen die een aannemer zoeken in hun regio",
  ],
  recommendedServices: ["website-laten-maken", "realisatiefotografie", "realisatie-dronebeelden", "lokale-seo"],
  relatedCases: [],
  relatedPosts: [],
  seo: {
    title: "Webdesign en fotografie voor bouwbedrijven | VisualVibe",
    description:
      "Webdesign, realisatiefotografie, video en lokale SEO voor bouwbedrijven, aannemers en renovatiefirma's in Limburg en Vlaanderen.",
    keywords: [
      "webdesign bouwbedrijf",
      "website aannemer",
      "website renovatiebedrijf",
      "realisatiefotografie bouw",
      "bouwfotografie Limburg",
      "video bouwbedrijf",
      "lokale SEO aannemer",
      "marketing bouwbedrijf",
    ],
  },

  answerIntro: {
    title: "Online groeien als bouw- of renovatiebedrijf",
    text: "Een professionele website voor een bouw- of renovatiebedrijf moet meer doen dan diensten opsommen. Potentiële klanten willen afgewerkte projecten zien, vertrouwen krijgen in het vakmanschap en snel een offerte kunnen aanvragen. VisualVibe combineert webdesign, realisatiefotografie, video en lokale vindbaarheid tot één sterk digitaal geheel.",
    highlights: [
      {
        title: "Een website die vertrouwen opbouwt",
        text: "Breng specialisaties, werkgebieden, realisaties en contactmogelijkheden helder samen in een snelle website die professioneel aanvoelt op desktop en mobiel.",
      },
      {
        title: "Realisaties die het vakmanschap bewijzen",
        text: "Met professionele projectfoto's, detailbeelden, voor-en-na-opnames en video ziet een potentiële klant onmiddellijk welke kwaliteit je levert.",
      },
      {
        title: "Gevonden worden in de juiste regio",
        text: "Door diensten, projecten, sectorinformatie en relevante regiopagina's logisch met elkaar te verbinden, bouw je duurzame lokale zichtbaarheid op.",
      },
    ],
  },

  challengesIntro:
    "Veel bouwbedrijven leveren uitstekend werk, maar hun online presentatie toont dat onvoldoende. Daardoor vergelijken potentiële klanten vooral op prijs, terwijl ervaring, afwerking en betrouwbaarheid nauwelijks zichtbaar worden.",
  painPointsExpanded: [
    {
      title: "Verouderde website",
      text: "Een verouderde website straalt weinig vertrouwen uit, terwijl een offerteaanvraag net op vertrouwen gebouwd is.",
    },
    {
      title: "Projecten blijven onzichtbaar",
      text: "Afgewerkte projecten professioneel tonen is moeilijk zonder goede foto's en een plek waar ze tot hun recht komen.",
    },
    {
      title: "Te weinig lokale aanvragen",
      text: "Er komen te weinig kwalitatieve aanvragen binnen uit de eigen regio, waar het bouwbedrijf net het sterkst staat.",
    },
    {
      title: "Onduidelijk aanbod",
      text: "Diensten en specialisaties zijn online niet duidelijk genoeg, waardoor bezoekers niet zien waarvoor ze je kunnen contacteren.",
    },
    {
      title: "Foto's doen het vakwerk geen recht",
      text: "Snelle werffoto's tonen onvoldoende de kwaliteit van materiaalkeuze en afwerking die het verschil maken.",
    },
    {
      title: "Geen duidelijke volgende stap",
      text: "Zonder duidelijke route naar contact of offerteaanvraag haken geïnteresseerde bezoekers af voor ze iets vragen.",
    },
  ],

  servicesTitle: "Marketingdiensten voor bouw- en renovatiebedrijven",
  servicesIntro:
    "Van een nieuwe website tot professionele projectbeelden: we combineren de diensten die een bouwbedrijf nodig heeft om expertise zichtbaar te maken en meer vertrouwen op te bouwen.",

  casesTitle: "Websites voor bouw- en renovatiebedrijven",
  featuredWebdesignIds: ["snellinx", "aussems"],

  realisationsTitle: "Bouw- en renovatieprojecten professioneel in beeld",
  realisationsIntro:
    "Sterke realisatiefotografie toont materiaalgebruik, afwerking, ruimte en vakmanschap. Zo zien nieuwe klanten niet alleen wat je doet, maar vooral welk resultaat ze mogen verwachten.",
  // Live Firestore-id (Realisatiefotografie Medapro) eerst; "realisatie" is de
  // gelijkaardige galerij in de seed-fallback. Onbekende ids worden geskipt.
  featuredGalleryIds: ["g-218fcbe1", "realisatie"],

  mediaTitle: "Video en dronebeelden voor bouwprojecten",
  mediaIntro:
    "Video en dronebeelden tonen projectvoortgang, schaal en ligging van een werf in één oogopslag. Ze zijn breed inzetbaar: van voor-en-na-opnames en portfolio tot sociale media.",
  featuredVideoIds: ["8zGBwfcbX9A", "FdzjPybGWSo"],

  processTitle: "Zo brengen we jouw bouwbedrijf sterker in beeld",
  processSteps: [
    {
      title: "Kennismaking en positionering",
      description: "We brengen specialisaties, doelgroep, regio en onderscheidende vakkennis in kaart.",
    },
    {
      title: "Content en beeldplan",
      description: "We bepalen welke diensten, projecten, foto's, video en teksten nodig zijn om vertrouwen op te bouwen.",
    },
    {
      title: "Website en vindbaarheid",
      description: "We bouwen de website rond duidelijke diensten, sterke realisaties, lokale relevantie en eenvoudige contactmomenten.",
    },
    {
      title: "Groeien met nieuwe projecten",
      description: "Nieuwe realisaties kunnen later als project, galerij, case of kennisartikel worden toegevoegd.",
    },
  ],

  proofTitle: "Waarom bouwbedrijven voor VisualVibe kiezen",
  proofPoints: [
    {
      title: "Alles bij één partner",
      text: "Webdesign en professionele visuals bij één partner, zodat website en beeldmateriaal naadloos op elkaar aansluiten.",
    },
    {
      title: "Ervaring met realisaties",
      text: "Ervaring met realisaties, interieurs, vastgoed en technische bedrijven: we weten wat afwerking in beeld vraagt.",
    },
    {
      title: "Eigen fotografie",
      text: "Eigen fotografie in plaats van generieke stockbeelden, zodat bezoekers jouw echte werk zien.",
    },
    {
      title: "Websites die meegroeien",
      text: "Websites die met nieuwe projecten meegroeien: elke afgewerkte werf versterkt je online portfolio.",
    },
    {
      title: "Lokale kennis",
      text: "Lokale kennis van Limburg en Vlaanderen, en van de regio's waar jouw klanten een aannemer zoeken.",
    },
    {
      title: "Eén consistente stijl",
      text: "Eén consistente stijl voor website, foto, video en sociale media, herkenbaar op elk kanaal.",
    },
  ],

  localSection: {
    title: "Creatieve partner voor bouwbedrijven in Limburg en Vlaanderen",
    text: "VisualVibe is gevestigd in Tongeren-Borgloon en werkt voor bouwbedrijven, aannemers en renovatiespecialisten in Limburg en de rest van Vlaanderen. Voor fotografie en video komen we op locatie. Websites, campagnes en content worden vanuit één centrale strategie ontwikkeld.",
    regionSlugs: ["limburg", "vlaanderen"],
  },

  faq: [
    {
      question: "Wat kost een website voor een bouwbedrijf?",
      answer:
        "De prijs hangt af van de omvang van de website, het aantal diensten en projecten, gewenste fotografie of video, talen, koppelingen en de offerteflow. Na een kennismaking ontvang je een duidelijke offerte op maat.",
    },
    {
      question: "Wat moet er op een website van een aannemer staan?",
      answer:
        "Een sterke website bevat duidelijke diensten, specialisaties, werkgebied, recente realisaties, informatie over de werkwijze, vertrouwenwekkende bedrijfsinformatie en een eenvoudige manier om contact op te nemen of een offerte aan te vragen.",
    },
    {
      question: "Kunnen jullie ook foto's van onze realisaties maken?",
      answer:
        "Ja. VisualVibe combineert webdesign met realisatiefotografie, bedrijfsfotografie, video en dronebeelden. Daardoor sluiten website en beeldmateriaal visueel en inhoudelijk op elkaar aan.",
    },
    {
      question: "Hoe wordt een bouwbedrijf lokaal beter gevonden?",
      answer:
        "Lokale vindbaarheid ontstaat door een technisch sterke website, duidelijke dienstenpagina's, relevante regio-informatie, consistente bedrijfsgegevens, echte realisaties en nuttige content rond de vragen van potentiële klanten.",
    },
    {
      question: "Kunnen we later zelf nieuwe projecten toevoegen?",
      answer:
        "Dat hangt af van de gekozen websiteopbouw. We kunnen een beheersysteem voorzien waarmee nieuwe projecten, foto's en teksten eenvoudig kunnen worden toegevoegd.",
    },
    {
      question: "Werkt VisualVibe alleen in Limburg?",
      answer:
        "VisualVibe is gevestigd in Limburg en werkt voor klanten in heel Vlaanderen. Voor fotografie, video en drone-opnames wordt vooraf bekeken wat praktisch mogelijk is op de locatie.",
    },
  ],

  knowledgeKeywords: [
    "bouwbedrijf",
    "aannemer",
    "renovatie",
    "realisatiefotografie",
    "bouwfotografie",
    "dronebeelden",
    "lokale seo",
    "voor-en-na",
    "portfolio",
    "werf",
  ],
  knowledgeCategories: ["webdesign", "fotografie", "drone", "seo-geo"],

  ctaTitle: "Klaar om jouw vakmanschap online te tonen?",
  ctaText:
    "Vertel ons over je bedrijf en je projecten. Je ontvangt een duidelijke offerte op maat, zonder verplichtingen.",
};
