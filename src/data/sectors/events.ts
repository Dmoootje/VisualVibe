import type { Sector } from "@/types";

// Volledig uitgewerkte SEO/AEO/GEO-sectorpagina voor bedrijfsevents, feesten
// en organisatoren, opgebouwd volgens het referentievoorbeeld bouw-renovatie.
// Featured ids verwijzen naar echte content in de webdesign showcase en de
// fotogalerijen.
export const events: Sector = {
  title: "Events",
  slug: "events",
  icon: "events",
  tag: "Sfeer & organisatie",
  cardDescription: "Strakke event-branding, van teaser tot aftermovie.",
  heroTitle: "Eventfotografie en aftermovies voor bedrijfsevents en feesten",
  intro:
    "VisualVibe helpt organisatoren van bedrijfsevents, feesten en publieksevents om de sfeer van elke editie professioneel vast te leggen met eventfotografie, aftermovies en dronebeelden, en om die beelden in te zetten voor de promotie van de volgende editie.",
  painPoints: [
    "Geen professioneel beeldmateriaal om de volgende editie te promoten",
    "Moeilijk om de schaal en drukte van het event te tonen",
    "Beperkt budget voor uitgebreide mediaproductie tijdens het event",
  ],
  recommendedServices: ["eventfotografie", "event-aftermovie", "event-dronebeelden"],
  relatedCases: [],
  relatedPosts: [],
  seo: {
    title: "Eventfotografie en aftermovies voor bedrijven | VisualVibe",
    description:
      "Eventfotografie, aftermovies en dronebeelden voor bedrijfsevents, feesten en organisatoren in Limburg en Vlaanderen. Sterke beelden voor je volgende editie.",
    keywords: [
      "eventfotografie Limburg",
      "aftermovie event",
      "bedrijfsevent fotografie",
      "fotograaf bedrijfsfeest",
      "eventvideografie",
      "dronebeelden event",
      "aftermovie laten maken",
      "eventfotograaf Vlaanderen",
    ],
  },

  answerIntro: {
    title: "Online groeien als eventorganisator",
    text: "Wie een bedrijfsevent, feest of publieksevent organiseert, verkoopt beleving. Deelnemers, klanten en partners beslissen op basis van wat ze zien: de sfeer, de opkomst en de professionaliteit van vorige edities. VisualVibe legt die beleving vast met eventfotografie, aftermovies en dronebeelden, en helpt organisatoren om die content in te zetten voor promotie en vindbaarheid. Zo wordt elke editie het startpunt van de communicatie voor de volgende.",
    highlights: [
      {
        title: "Beelden die de sfeer echt vastleggen",
        text: "Eventfotografie die gasten, sprekers, details en ambiance vastlegt zonder het event te verstoren, zodat de beleving van de avond ook nadien voelbaar blijft.",
      },
      {
        title: "Een aftermovie die de volgende editie verkoopt",
        text: "Een aftermovie vat het hele event samen in een korte, energieke video die breed inzetbaar is: van uitnodiging en website tot sociale media.",
      },
      {
        title: "Content die blijft werken na het event",
        text: "Foto's, video en dronebeelden vormen samen een archief waarmee je sponsors overtuigt, deelnemers bedankt en de promotie van de volgende editie voedt.",
      },
    ],
  },

  challengesIntro:
    "Veel events zijn op de dag zelf een succes, maar dat succes is nadien nergens meer te zien. Zonder professioneel beeldmateriaal wordt het moeilijk om sponsors te overtuigen, tickets te verkopen of de volgende editie geloofwaardig te promoten.",
  painPointsExpanded: [
    {
      title: "Geen bruikbaar beeldmateriaal",
      text: "Losse smartphonefoto's van gasten tonen niet de kwaliteit en sfeer van het event, waardoor er na afloop niets bruikbaars overblijft voor promotie.",
    },
    {
      title: "Schaal en drukte blijven onzichtbaar",
      text: "Vanaf de grond is moeilijk te tonen hoe groot en druk een event echt was, terwijl net dat overzicht sponsors en deelnemers overtuigt.",
    },
    {
      title: "Media komt op de laatste plaats",
      text: "Het budget gaat naar locatie, catering en programma, terwijl beeldmateriaal net het onderdeel is dat na het event het langst blijft renderen.",
    },
    {
      title: "Promotie start telkens van nul",
      text: "Zonder archief van sterke foto's en video begint de communicatie voor elke nieuwe editie zonder bewijs van wat het event waard is.",
    },
    {
      title: "Sponsors zien hun return niet",
      text: "Partners en sponsors willen achteraf zien dat hun aanwezigheid zichtbaar was; zonder professionele beelden is dat moeilijk aan te tonen.",
    },
    {
      title: "Versnipperde communicatie",
      text: "Uitnodiging, website en sociale media ogen verschillend, waardoor het event geen herkenbare, professionele stijl opbouwt.",
    },
  ],

  servicesTitle: "Marketingdiensten voor bedrijfsevents, feesten en organisatoren",
  servicesIntro:
    "Van eventfotografie tot aftermovie en dronebeelden: we combineren de diensten die een organisator nodig heeft om de sfeer vast te leggen en de volgende editie sterker te promoten.",

  casesTitle: "Websites in de event- en feestwereld",
  casesIntro:
    "Ook merken die van feesten en events hun vak maken, hebben een sterke website nodig. Bekijk hieronder een portfolio-site die we bouwden voor een huwelijksfotografiemerk in Limburg, met duidelijke prijsinformatie en een eenvoudige contactflow.",
  featuredWebdesignIds: ["weddingvibe"],

  realisationsTitle: "Bedrijfsevents en feesten professioneel in beeld",
  realisationsIntro:
    "Sterke eventfotografie toont de sfeer, de opkomst en de details waar je als organisator maanden aan werkte. Zo zien deelnemers, klanten en sponsors niet alleen dat het event plaatsvond, maar vooral hoe het voelde om erbij te zijn.",
  // Live Firestore-id (Eventfotografie Afterwork Explorijck) eerst; "event" is
  // de gelijkaardige galerij in de seed-fallback. Onbekende ids worden geskipt.
  featuredGalleryIds: ["g-dde5133f", "event"],

  processTitle: "Zo brengen we jouw event sterker in beeld",
  processSteps: [
    {
      title: "Kennismaking en positionering",
      description: "We brengen het type event, de doelgroep, de locatie en de doelen van jouw organisatie in kaart.",
    },
    {
      title: "Content en beeldplan",
      description: "We bepalen vooraf welke momenten, sprekers en details vastgelegd moeten worden en hoe foto, video en drone elkaar aanvullen.",
    },
    {
      title: "Website en vindbaarheid",
      description: "We zorgen dat de beelden terechtkomen waar ze renderen: op een snelle website of eventpagina die lokaal gevonden wordt en inschrijven eenvoudig maakt.",
    },
    {
      title: "Groeien met elke editie",
      description: "Elke editie levert nieuw materiaal op dat als galerij, aftermovie of kennisartikel de promotie van de volgende versterkt.",
    },
  ],

  proofTitle: "Waarom organisatoren voor VisualVibe kiezen",
  proofPoints: [
    {
      title: "Alles bij één partner",
      text: "Webdesign en professionele visuals bij één partner, zodat eventpagina, foto's en aftermovie naadloos op elkaar aansluiten.",
    },
    {
      title: "Eigen fotografie",
      text: "Eigen fotografie in plaats van generieke stockbeelden, zodat bezoekers de echte sfeer van jouw event zien.",
    },
    {
      title: "Gecertificeerde drone-opnames",
      text: "Drone-opnames zijn EASA-gecertificeerd en verzekerd. Vooraf bekijken we wat op de eventlocatie praktisch en veilig mogelijk is.",
    },
    {
      title: "Websites die meegroeien",
      text: "Websites die met elke editie meegroeien: nieuwe foto's, aftermovies en programma-informatie versterken het online verhaal.",
    },
    {
      title: "Lokale kennis",
      text: "Lokale kennis van Limburg en Vlaanderen, en van de regio's waar jouw deelnemers en klanten vandaan komen.",
    },
    {
      title: "Eén consistente stijl",
      text: "Eén consistente stijl voor website, foto, video en sociale media, zodat het event op elk kanaal herkenbaar is.",
    },
  ],

  localSection: {
    title: "Creatieve partner voor events in Limburg en Vlaanderen",
    text: "VisualVibe is gevestigd in Tongeren-Borgloon en werkt voor organisatoren van bedrijfsevents, feesten en publieksevents in Limburg en de rest van Vlaanderen. Voor fotografie en video komen we op locatie. Websites, campagnes en content worden vanuit één centrale strategie ontwikkeld.",
    regionSlugs: ["limburg", "vlaanderen"],
  },

  faq: [
    {
      question: "Wat kost eventfotografie of een aftermovie?",
      answer:
        "De prijs hangt af van de duur van het event, de gewenste combinatie van foto, video en dronebeelden, het aantal locaties en hoe de beelden nadien gebruikt worden. Na een kennismaking ontvang je een duidelijke offerte op maat.",
    },
    {
      question: "Wat wordt er vastgelegd tijdens een bedrijfsevent of feest?",
      answer:
        "We leggen vooraf samen vast welke momenten belangrijk zijn: de aankomst van gasten, sprekers of optredens, de sfeer op de vloer, details van de aankleding en de mensen achter de organisatie. Zo mist het eindresultaat geen enkel kernmoment.",
    },
    {
      question: "Kunnen jullie ook dronebeelden maken op een event?",
      answer:
        "Ja. Dronebeelden tonen de schaal, de drukte en de ligging van een event in één beeld. Onze drone-opnames zijn EASA-gecertificeerd en verzekerd, en vooraf wordt bekeken wat op de locatie praktisch en veilig mogelijk is.",
    },
    {
      question: "Hoe helpt beeldmateriaal om een volgende editie te promoten?",
      answer:
        "Foto's en een aftermovie bewijzen wat het event waard is: de sfeer, de opkomst en de professionaliteit. Die beelden zijn inzetbaar op de website, in uitnodigingen, op sociale media en in gesprekken met sponsors en partners.",
    },
    {
      question: "Kunnen jullie ook een website voor ons event of onze organisatie maken?",
      answer:
        "Ja. VisualVibe combineert webdesign met fotografie en video, zodat eventpagina en beeldmateriaal visueel en inhoudelijk op elkaar aansluiten. Nieuwe edities, galerijen en programma-informatie kunnen later worden toegevoegd.",
    },
    {
      question: "Werkt VisualVibe alleen in Limburg?",
      answer:
        "VisualVibe is gevestigd in Limburg en werkt voor klanten in heel Vlaanderen. Voor fotografie, video en drone-opnames wordt vooraf bekeken wat praktisch mogelijk is op de locatie.",
    },
  ],

  knowledgeKeywords: [
    "eventfotografie",
    "aftermovie",
    "bedrijfsevent",
    "bedrijfsfeest",
    "personeelsfeest",
    "eventvideografie",
    "dronebeelden",
    "sfeerbeelden",
    "organisator",
    "teambuilding",
  ],
  knowledgeCategories: ["fotografie", "videografie", "drone", "webdesign"],

  ctaTitle: "Klaar om jouw volgende editie sterker te promoten?",
  ctaText:
    "Vertel ons over je event en je plannen. Je ontvangt een duidelijke offerte op maat, zonder verplichtingen.",
};
