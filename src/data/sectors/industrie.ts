import type { Sector } from "@/types";

// Volledig uitgewerkte SEO/AEO/GEO-sectorpagina voor industriële en technische
// bedrijven, opgebouwd volgens het referentiebestand bouw-renovatie.ts.
// Featured ids verwijzen naar echte content in de fotogalerijen en videografie.
export const industrie: Sector = {
  title: "Industrie",
  slug: "industrie",
  icon: "industrie",
  tag: "Techniek & productie",
  cardDescription: "Technische bedrijven helder en modern gepositioneerd.",
  heroTitle: "Bedrijfsfotografie, video en webdesign voor industriële bedrijven",
  intro:
    "VisualVibe helpt industriële en technische bedrijven om hun schaal, machines, processen en mensen professioneel te presenteren met bedrijfsfotografie, dronebeelden, video en een heldere website die B2B-klanten en sollicitanten overtuigt.",
  painPoints: [
    "Moeilijk om technische processen visueel begrijpelijk te maken",
    "Website communiceert onvoldoende de schaal en expertise van het bedrijf",
    "Weinig zichtbaarheid bij potentiële B2B-klanten en sollicitanten",
  ],
  recommendedServices: ["bedrijfsfotografie", "realisatie-dronebeelden", "wervingsvideo"],
  relatedCases: [],
  relatedPosts: [],
  seo: {
    title: "Fotografie en video voor industriële bedrijven | VisualVibe",
    description:
      "Bedrijfsfotografie, dronebeelden, wervingsvideo en webdesign voor industriële bedrijven in Limburg en Vlaanderen. Overtuig B2B-klanten en sollicitanten.",
    keywords: [
      "bedrijfsfotografie industrie",
      "industriële fotografie Limburg",
      "dronebeelden bedrijf",
      "wervingsvideo techniekers",
      "webdesign industrieel bedrijf",
      "video productiebedrijf",
      "employer branding industrie",
      "machinefotografie",
    ],
  },

  answerIntro: {
    title: "Online groeien als industrieel of technisch bedrijf",
    text: "Een sterke online aanwezigheid voor een industrieel bedrijf moet meer doen dan producten en machines opsommen. B2B-klanten willen zien hoe je werkt, welke schaal je aankan en welke expertise er op de werkvloer staat, en potentiële medewerkers willen weten waar ze terechtkomen. VisualVibe combineert bedrijfsfotografie, dronebeelden, video en webdesign tot één helder digitaal verhaal. Zo wordt technische kwaliteit zichtbaar voor iedereen die je bedrijf online ontdekt.",
    highlights: [
      {
        title: "Een website die expertise uitstraalt",
        text: "Breng activiteiten, capaciteiten, sectoren en contactmogelijkheden helder samen in een snelle website die professioneel aanvoelt voor inkopers, partners en sollicitanten.",
      },
      {
        title: "Beelden die schaal en techniek tonen",
        text: "Met professionele fotografie van machines, productieprocessen en mensen, aangevuld met dronebeelden van het terrein, ziet een bezoeker onmiddellijk waartoe je bedrijf in staat is.",
      },
      {
        title: "Zichtbaar voor klanten én talent",
        text: "Door diensten, beeldmateriaal en wervingscontent logisch met elkaar te verbinden, bouw je zichtbaarheid op bij B2B-klanten en bij de technische profielen die je zoekt.",
      },
    ],
  },

  challengesIntro:
    "Veel industriële bedrijven leveren technisch hoogstaand werk, maar hun online presentatie blijft daarbij achter. Daardoor blijft de schaal van het bedrijf onzichtbaar voor potentiële klanten en haken technische profielen af nog voor ze solliciteren.",
  painPointsExpanded: [
    {
      title: "Technische processen blijven abstract",
      text: "Wat er in de productiehal gebeurt, is voor buitenstaanders moeilijk te vatten zonder beelden die het proces begrijpelijk en aantrekkelijk maken.",
    },
    {
      title: "Schaal en capaciteit onzichtbaar",
      text: "De website toont onvoldoende hoe groot het machinepark, het terrein en het team werkelijk zijn, terwijl dat net vertrouwen geeft aan B2B-klanten.",
    },
    {
      title: "Moeilijk technische profielen aantrekken",
      text: "Zonder beeld van de werkvloer, de collega's en het soort werk blijft een vacature een tekstblok waar sterke kandidaten aan voorbijgaan.",
    },
    {
      title: "Verouderde of anonieme website",
      text: "Een gedateerde website zonder eigen beeldmateriaal straalt weinig vertrouwen uit richting inkopers die leveranciers vergelijken.",
    },
    {
      title: "Stockbeelden in plaats van eigen werkvloer",
      text: "Generieke stockfoto's tonen niet jouw machines, mensen of afwerking, waardoor het bedrijf inwisselbaar oogt.",
    },
    {
      title: "Onduidelijk aanbod en geen volgende stap",
      text: "Als activiteiten en specialisaties online niet helder zijn en een duidelijke route naar contact ontbreekt, haken geïnteresseerde bezoekers af.",
    },
  ],

  servicesTitle: "Marketingdiensten voor industriële en technische bedrijven",
  servicesIntro:
    "Van bedrijfsfotografie op de werkvloer tot dronebeelden van het terrein en een wervingsvideo voor techniekers: we combineren de diensten die een industrieel bedrijf nodig heeft om expertise zichtbaar te maken.",

  realisationsTitle: "Industriële bedrijven professioneel in beeld",
  realisationsIntro:
    "Sterke bedrijfsfotografie toont machines, mensen, werkvloer en schaal zoals ze werkelijk zijn. Zo zien B2B-klanten en sollicitanten niet alleen wat je doet, maar vooral met welke precisie en op welk niveau je werkt.",
  // Live Firestore-id: bedrijfsfotografie bij een heftruckbedrijf (Immer Goed
  // Heftrucks). Onbekende ids worden geskipt.
  featuredGalleryIds: ["g-883e23c5"],

  mediaTitle: "Video en dronebeelden voor industriële bedrijven",
  mediaIntro:
    "Video maakt technische processen en de sfeer op de werkvloer tastbaar, en is bijzonder sterk voor het aantrekken van technische profielen. Dronebeelden tonen terrein, hallen en installaties in één oogopslag, breed inzetbaar op website en sociale media.",
  // zj4hvA8tdTA = wervingsvideo voor techniekers (Baldewijns);
  // ZXJNLr5W8eA = drone-reel met luchtbeelden.
  featuredVideoIds: ["zj4hvA8tdTA", "ZXJNLr5W8eA"],

  processTitle: "Zo brengen we jouw industrieel bedrijf sterker in beeld",
  processSteps: [
    {
      title: "Kennismaking en positionering",
      description: "We brengen activiteiten, doelgroepen, regio en onderscheidende technische expertise in kaart, ook met het oog op werving.",
    },
    {
      title: "Content en beeldplan",
      description: "We bepalen welke processen, machines, mensen en locaties in beeld moeten komen, en welke foto's, video en teksten daarbij horen.",
    },
    {
      title: "Website en vindbaarheid",
      description: "We bouwen de website rond duidelijke activiteiten, sterk eigen beeldmateriaal, lokale relevantie en eenvoudige contactmomenten.",
    },
    {
      title: "Groeien met nieuw beeldmateriaal",
      description: "Nieuwe projecten, machines of vacatures kunnen later als galerij, video of kennisartikel worden toegevoegd.",
    },
  ],

  proofTitle: "Waarom industriële bedrijven voor VisualVibe kiezen",
  proofPoints: [
    {
      title: "Alles bij één partner",
      text: "Webdesign en professionele visuals bij één partner, zodat website en beeldmateriaal naadloos op elkaar aansluiten.",
    },
    {
      title: "Eigen fotografie",
      text: "Eigen fotografie van jouw werkvloer, machines en mensen in plaats van generieke stockbeelden, zodat bezoekers je echte bedrijf zien.",
    },
    {
      title: "Gecertificeerde drone-opnames",
      text: "Drone-opnames zijn EASA-gecertificeerd en verzekerd, ideaal om terreinen, hallen en installaties van bovenaf in beeld te brengen.",
    },
    {
      title: "Websites die meegroeien",
      text: "Websites die meegroeien met nieuwe activiteiten, projecten en vacatures, zodat je online verhaal actueel blijft.",
    },
    {
      title: "Lokale kennis",
      text: "Lokale kennis van Limburg en Vlaanderen, en van de regio's waar jouw B2B-klanten en toekomstige medewerkers zich bevinden.",
    },
    {
      title: "Eén consistente stijl",
      text: "Eén consistente stijl voor website, foto, video en sociale media, herkenbaar voor klanten én kandidaten op elk kanaal.",
    },
  ],

  localSection: {
    title: "Creatieve partner voor industriële bedrijven in Limburg en Vlaanderen",
    text: "VisualVibe is gevestigd in Tongeren-Borgloon en werkt voor industriële en technische bedrijven in Limburg en de rest van Vlaanderen. Voor fotografie, video en drone-opnames komen we op locatie, tot op de werkvloer. Websites, campagnes en content worden vanuit één centrale strategie ontwikkeld.",
    regionSlugs: ["limburg", "vlaanderen"],
  },

  faq: [
    {
      question: "Wat kost bedrijfsfotografie voor een industrieel bedrijf?",
      answer:
        "De prijs hangt af van het aantal locaties, de omvang van de shoot, het aantal gewenste beelden en of er ook dronebeelden of video nodig zijn. Na een kennismaking ontvang je een duidelijke offerte op maat.",
    },
    {
      question: "Wat moet er op de website van een industrieel bedrijf staan?",
      answer:
        "Een sterke website bevat duidelijke activiteiten en specialisaties, informatie over capaciteit en machinepark, eigen beeldmateriaal van de werkvloer, referentiesectoren, een vacaturesectie en een eenvoudige manier om contact op te nemen of een offerte aan te vragen.",
    },
    {
      question: "Kunnen jullie ook filmen en fotograferen in een productieomgeving?",
      answer:
        "Ja. Voor fotografie, video en drone-opnames komen we op locatie, ook op de werkvloer of het bedrijfsterrein. Vooraf stemmen we de planning, de veiligheidsafspraken en de te filmen processen samen af, zodat de opnames de productie niet verstoren.",
    },
    {
      question: "Helpt video bij het vinden van technische medewerkers?",
      answer:
        "Een wervingsvideo toont de werkvloer, de collega's en het soort werk zoals het echt is. Daardoor krijgen technische profielen een concreet beeld van de job en het bedrijf voor ze solliciteren, wat een vacature een stuk overtuigender maakt dan tekst alleen.",
    },
    {
      question: "Kunnen we later nieuwe content laten toevoegen?",
      answer:
        "Dat hangt af van de gekozen websiteopbouw. We kunnen een beheersysteem voorzien waarmee nieuwe projecten, foto's, video's en vacatures eenvoudig kunnen worden toegevoegd.",
    },
    {
      question: "Werkt VisualVibe alleen in Limburg?",
      answer:
        "VisualVibe is gevestigd in Limburg en werkt voor klanten in heel Vlaanderen. Voor fotografie, video en drone-opnames wordt vooraf bekeken wat praktisch mogelijk is op de locatie.",
    },
  ],

  knowledgeKeywords: [
    "industrie",
    "bedrijfsfotografie",
    "dronebeelden",
    "wervingsvideo",
    "techniekers",
    "productie",
    "machines",
    "werkvloer",
    "employer branding",
    "b2b",
  ],
  knowledgeCategories: ["fotografie", "videografie", "drone", "webdesign", "seo-geo"],

  ctaTitle: "Klaar om jouw industrieel bedrijf sterker in beeld te brengen?",
  ctaText:
    "Vertel ons over je bedrijf, je werkvloer en je plannen. Je ontvangt een duidelijke offerte op maat, zonder verplichtingen.",
};
