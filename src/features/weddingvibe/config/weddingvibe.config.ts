// Alle copy en instellingen van de WeddingVibe one-pager (/trouwfotograaf-limburg).
// Bron: design_handoff_weddingvibe_onepager (hifi handoff - copy is definitief).
// Beelden: Firebase Storage URL's; een leeg src rendert een stijlvolle
// crème-placeholder tot de echte foto er is (geen beelden in de repo).

export type WvImage = {
  /** Firebase Storage download-URL; leeg = placeholder tonen. */
  src: string;
  alt: string;
};

export type WvGalleryItem = WvImage & {
  label: string;
  /** CSS aspect-ratio, bv. "3/4". */
  ratio: string;
};

export type WvFeaturedWedding = {
  nameA: string;
  nameB: string;
  blurb: string;
  image: WvImage;
};

export type WvService = {
  category: string;
  /** Titel; het deel tussen [accent]...[/accent] wordt italic goud. */
  title: string;
  accent: string;
  paragraphs: [string, string];
  featuresLabel: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  image: WvImage;
  reverse: boolean;
};

export type WvPriceCard = {
  category: string;
  title: string;
  intro: string;
  price: string;
  features: string[];
  ctaLabel: string;
  highlighted: boolean;
};

export type WvReview = {
  quote: string;
  nameA: string;
  nameB: string;
  meta: string;
  image: WvImage;
};

export type WvFaqItem = { question: string; answer: string };

export const weddingVibeConfig = {
  path: "/trouwfotograaf-limburg",

  settings: {
    /** Dwarrelende bloemblaadjes in de hero. */
    bloemblaadjes: true,
    /** Vanaf-prijzen tonen; false = "Prijs op aanvraag". */
    prijzenTonen: true,
    /** YouTube-id van de herovideo (autoplay, muted, loop). */
    heroVideoId: "g6-6KvNlbtM",
    contactEmail: "jens@weddingvibe.be",
    whatsapp: "https://wa.me/32472964599",
    telefoon: "+32 472 96 45 99",
    telefoonHref: "tel:+32472964599",
  },

  seo: {
    title: "Trouwfotograaf Limburg: trouwfotografie en huwelijksvideo",
    description:
      "WeddingVibe, het trouwlabel van VisualVibe, legt jullie huwelijk spontaan en stijlvol vast: trouwfotografie, huwelijksfilm, dronebeelden en bruiloftwebsites.",
    keywords: [
      "trouwfotograaf Limburg",
      "trouwfotografie",
      "huwelijksvideo",
      "huwelijksfilm",
      "trouwvideograaf",
      "bruiloftwebsite",
      "WeddingVibe",
      "destination wedding fotograaf",
    ],
    /** Introfoto als social share-beeld tot er een eigen OG-beeld is. */
    ogImage:
      "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fweddingvibe%2Ftrouwfotografie%20Limburg.webp?alt=media&token=579ee564-66f9-4b7f-946b-5d5bd605e786",
  },

  nav: {
    links: [
      { label: "Ons werk", href: "#werk" },
      { label: "Foto & film", href: "#diensten" },
      { label: "Over Jens", href: "#jens" },
      { label: "Investering", href: "#investering" },
      { label: "Vragen", href: "#faq" },
    ],
    cta: "Controleer jullie datum",
  },

  hero: {
    overline: "Trouwfotografie & huwelijksvideo",
    titleLines: ["Jullie dag.", "Jullie verhaal."],
    script: "Voor altijd voelbaar.",
    intro:
      "Jullie trouwdag zit vol momenten die je nooit volledig kunt plannen. Een blik, een lach, een traan en alles wat tussendoor gebeurt. WeddingVibe legt jullie dag vast zoals hij echt is: spontaan, stijlvol en vol gevoel.",
    primaryCta: "Bekijk onze huwelijken",
    secondaryCta: "Controleer jullie datum",
    trustLine: "Fotografie · Film · Dronebeelden · Bruiloftwebsites",
    trustSub: "Beschikbaar in heel België en voor destination weddings",
    fallbackImage: { src: "", alt: "WeddingVibe trouwreportage" } satisfies WvImage,
  },

  intro: {
    overline: "Echte momenten, echt vastgelegd",
    title: "Geen stijve reportage, maar jullie huwelijk",
    accent: "zoals het werkelijk voelde",
    paragraphs: [
      "De mooiste beelden ontstaan meestal wanneer jullie even vergeten dat er een camera aanwezig is.",
      "Daarom draait onze aanpak niet om voortdurend poseren. We zoeken naar de kleine momenten die jullie dag bijzonder maken: de zenuwen voor de ceremonie, de reactie van familie, die ene blik tijdens de geloften en het feest waarop niemand nog aan de camera denkt.",
      "Het resultaat is geen verzameling losse foto's of videobeelden, maar het volledige verhaal van jullie huwelijk.",
    ],
    ctaLabel: "Ontdek onze stijl",
    imageLarge: {
      src: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fweddingvibe%2Ftrouwfotografie%20Limburg.webp?alt=media&token=579ee564-66f9-4b7f-946b-5d5bd605e786",
      alt: "Trouwfotografie in Limburg door WeddingVibe",
    } satisfies WvImage,
    imageDetail: {
      src: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fweddingvibe%2Ftrouwfotograaf%20limburg%20-%20detailfoto%20trouwringen.webp?alt=media&token=b77a3bf8-4212-4646-a7a4-cf5c5446a66c",
      alt: "Detailfoto van trouwringen",
    } satisfies WvImage,
  },

  portfolio: {
    title: "Verhalen die we mochten",
    accent: "bewaren",
    intro:
      "Elke trouwdag heeft een eigen sfeer. Intiem en klein, uitbundig en groots of ergens ver weg. Bekijk enkele huwelijken die we al mochten vastleggen.",
    gallery: [
      {
        label: "Voorbereiding",
        ratio: "3/4",
        src: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fweddingvibe%2Ftrouwfotos%20voorbereiding.webp?alt=media&token=9ab2ca8b-7c66-4678-8abf-c13b5bb8c54c",
        alt: "Trouwfoto's van de voorbereiding",
      },
      { label: "First look", ratio: "1/1", src: "", alt: "First look" },
      { label: "Ceremonie", ratio: "4/5", src: "", alt: "Ceremonie" },
      { label: "Portret", ratio: "3/4", src: "", alt: "Portret van het bruidspaar" },
      { label: "Familie", ratio: "4/3", src: "", alt: "Familiefoto" },
      { label: "Openingsdans", ratio: "3/4", src: "", alt: "Openingsdans" },
      { label: "Avondfeest", ratio: "1/1", src: "", alt: "Avondfeest" },
      { label: "Details", ratio: "4/5", src: "", alt: "Detailbeeld" },
    ] satisfies WvGalleryItem[],
    featured: [
      {
        nameA: "Sophie",
        nameB: "Duco",
        blurb: "Een warme trouwdag vol spontane momenten.",
        image: { src: "", alt: "Huwelijk van Sophie en Duco" },
      },
      {
        nameA: "Tess",
        nameB: "Pierre",
        blurb: "Romantiek, familie en een onvergetelijk avondfeest.",
        image: { src: "", alt: "Huwelijk van Tess en Pierre" },
      },
      {
        nameA: "Jolien",
        nameB: "Jef",
        blurb: "Een dag waarop alles even vanzelf leek te gaan.",
        image: { src: "", alt: "Huwelijk van Jolien en Jef" },
      },
    ] satisfies WvFeaturedWedding[],
    moreCta: "Bekijk meer huwelijken",
  },

  video: {
    overline: "Beleef het opnieuw",
    title: "Sommige momenten wil je niet alleen bekijken.",
    script: "Je wilt ze opnieuw voelen.",
    intro:
      "Een huwelijksfilm brengt beweging, stemmen en emoties opnieuw tot leven. Van de geloften en speeches tot de muziek van jullie openingsdans. Druk op play en ontdek hoe een trouwfilm van WeddingVibe aanvoelt.",
    linkLabel: "Bekijk een huwelijksfilm",
    /** YouTube-id van de voorbeeldfilm; leeg = alleen posterbeeld. */
    videoId: "",
    poster: { src: "", alt: "Still uit een huwelijksfilm van WeddingVibe" } satisfies WvImage,
  },

  services: [
    {
      category: "Trouwfotografie",
      title: "Momenten die",
      accent: "blijven",
      paragraphs: [
        "Een volledige fotografische reportage van jullie huwelijk, van de eerste voorbereidingen tot het feest.",
        "We combineren spontane beelden met stijlvolle portretten, details, groepsfoto's en dronebeelden waar dat mogelijk is.",
      ],
      featuresLabel: "Inbegrepen afhankelijk van het gekozen pakket",
      features: [
        "Eén of twee fotografen",
        "Volledige dagreportage",
        "Sneak peek kort na het huwelijk",
        "Online fotogalerij",
        "Beelden in kleur en zwart-wit",
        "Mogelijkheid tot fotoalbum",
      ],
      ctaLabel: "Bekijk trouwfotografie",
      ctaHref: "#investering",
      image: { src: "", alt: "Reportagefoto van een huwelijk" },
      reverse: false,
    },
    {
      category: "Huwelijksfilm",
      title: "Jullie dag",
      accent: "in beweging",
      paragraphs: [
        "Herbeleef de stemmen, reacties, speeches en kleine gebeurtenissen die je op de dag zelf misschien niet eens hebt gezien.",
        "We maken een filmische teaser en kunnen daarnaast ook een langere huwelijksfilm voorzien met de belangrijkste onderdelen van jullie dag.",
      ],
      featuresLabel: "Mogelijkheden",
      features: [
        "Eén of twee videografen",
        "Filmische huwelijksteaser",
        "Uitgebreide huwelijksfilm",
        "Dronebeelden",
        "Meerdere camerastandpunten",
        "Levering via persoonlijke online omgeving",
      ],
      ctaLabel: "Bekijk huwelijksvideo",
      ctaHref: "#investering",
      image: { src: "", alt: "Filmisch videostill van een huwelijk" },
      reverse: true,
    },
    {
      category: "Foto & video",
      title: "Eén verhaal,",
      accent: "volledig verteld",
      paragraphs: [
        "Willen jullie zowel foto's als een huwelijksfilm? Dan werken fotograaf en videograaf als één team.",
        "Zo worden de belangrijkste momenten vanuit verschillende invalshoeken vastgelegd, zonder dat jullie dag aanvoelt als een filmproductie.",
      ],
      featuresLabel: "De complete ervaring",
      features: [
        "Fotograaf en videograaf",
        "Volledige dag aanwezig",
        "Foto's, teaser en uitgebreide film",
        "Dronebeelden",
        "Eén gezamenlijke voorbereiding",
        "Een consistente visuele stijl",
      ],
      ctaLabel: "Bekijk het combopakket",
      ctaHref: "#investering",
      image: { src: "", alt: "Fotograaf en videograaf samen aan het werk" },
      reverse: false,
    },
    {
      category: "Persoonlijke bruiloftwebsite",
      title: "Alle informatie voor jullie gasten",
      accent: "op één plaats",
      paragraphs: [
        "Met een persoonlijke trouwwebsite delen jullie de dagindeling, praktische informatie, dresscode, cadeautips en contactgegevens.",
        "Gasten kunnen bovendien rechtstreeks via de website laten weten of ze aanwezig zijn.",
      ],
      featuresLabel: "Mogelijke onderdelen",
      features: [
        "Eigen domeinnaam",
        "RSVP-formulier",
        "Countdown naar jullie trouwdag",
        "Dagindeling",
        "Dresscode en praktische informatie",
        "Meerdere talen",
        "Ontwerp passend bij jullie uitnodiging",
      ],
      ctaLabel: "Ontdek de bruiloftwebsite",
      ctaHref: "#contact",
      image: { src: "", alt: "Bruiloftwebsite op laptop en telefoon" },
      reverse: true,
    },
  ] satisfies WvService[],

  why: {
    overline: "Meer dan mooie beelden",
    title: "Op jullie trouwdag moeten jullie maar één ding doen:",
    accent: "genieten",
    intro:
      "Wij zorgen ervoor dat de belangrijke momenten worden vastgelegd zonder voortdurend in de weg te lopen of jullie dag te onderbreken.",
    image: { src: "", alt: "Genietend bruidspaar" } satisfies WvImage,
    points: [
      {
        title: "Een persoonlijke aanpak",
        text: "Vooraf bespreken we jullie planning, verwachtingen en de mensen en momenten die belangrijk voor jullie zijn.",
      },
      {
        title: "Spontaan en ongedwongen",
        text: "We sturen bij wanneer dat nodig is, maar laten de dag vooral natuurlijk verlopen.",
      },
      {
        title: "Alles op elkaar afgestemd",
        text: "Foto, film, dronebeelden en jullie bruiloftwebsite kunnen binnen één stijl en één traject worden verzorgd.",
      },
      {
        title: "Ervaring van begin tot einde",
        text: "Van de eerste kennismaking tot de uiteindelijke levering weten jullie duidelijk wat de volgende stap is.",
      },
    ],
  },

  werkwijze: {
    overline: "Van eerste bericht tot blijvende herinnering",
    title: "Zo verloopt",
    accent: "jullie traject",
    steps: [
      {
        title: "Kennismaken",
        text: "Tijdens een vrijblijvend gesprek luisteren we naar jullie plannen, locatie, timing en verwachtingen.",
      },
      {
        title: "Jullie datum vastleggen",
        text: "Past onze stijl bij jullie en is de datum nog beschikbaar? Dan leggen we alles duidelijk vast.",
      },
      {
        title: "De voorbereiding",
        text: "Voor het huwelijk overlopen we samen de dagplanning, belangrijke personen, locaties en speciale wensen.",
      },
      {
        title: "Jullie trouwdag",
        text: "Wij volgen de dag op een rustige manier en zorgen ervoor dat geen enkel belangrijk moment verloren gaat.",
      },
      {
        title: "Selectie en montage",
        text: "Na het huwelijk worden alle beelden zorgvuldig geselecteerd, bewerkt en gemonteerd.",
      },
      {
        title: "Opnieuw beleven",
        text: "Jullie ontvangen de foto's en films digitaal, zodat jullie ze gemakkelijk kunnen bekijken, bewaren en delen.",
      },
    ],
    cta: "Plan een vrijblijvende kennismaking",
  },

  jens: {
    overline: "De persoon achter de camera",
    title: "Hey, ik ben",
    accent: "Jens",
    paragraphs: [
      "Mijn eerste huwelijk fotografeerde ik in 2019. Het was de trouwdag van mijn buurman Cédric, een dag die me tot vandaag is bijgebleven.",
      "Niet alleen door de mooie beelden, maar vooral door alles wat er rondom gebeurde: de spanning vooraf, de reacties van familie en de momenten die niemand had kunnen plannen. Daar is WeddingVibe uit ontstaan.",
      "Mijn doel is niet alleen om technisch mooie foto's en films te maken. Ik wil beelden afleveren die jullie jaren later opnieuw naar die dag terugbrengen.",
      "Tijdens jullie huwelijk ben ik aanwezig wanneer het moet, maar geef ik jullie vooral de ruimte om de dag echt te beleven.",
    ],
    closing: "Hopelijk mag ik binnenkort ook jullie verhaal leren kennen.",
    signature: "- Jens",
    cta: "Maak kennis met Jens",
    image: { src: "", alt: "Jens aan het werk tijdens een huwelijk" } satisfies WvImage,
  },

  investering: {
    overline: "Investering",
    cards: [
      {
        category: "Fotografie",
        title: "Jullie verhaal in beelden",
        intro: "Volledige fotografische reportage van jullie trouwdag.",
        price: "€2.150",
        features: [
          "Eén fotograaf",
          "Tot veertien uur aanwezigheid",
          "Sneak peek",
          "Online galerij",
          "Dronebeelden indien mogelijk",
          "Digitale aflevering",
        ],
        ctaLabel: "Bekijk fotografie",
        highlighted: false,
      },
      {
        category: "Film",
        title: "Jullie dag opnieuw beleven",
        intro: "Een filmische registratie van alle belangrijke momenten.",
        price: "€2.500",
        features: [
          "Eén videograaf",
          "Tot veertien uur aanwezigheid",
          "Huwelijksteaser",
          "Uitgebreide huwelijksfilm",
          "Dronebeelden indien mogelijk",
          "Digitale aflevering",
        ],
        ctaLabel: "Bekijk video",
        highlighted: false,
      },
      {
        category: "Foto & video",
        title: "Het volledige verhaal",
        intro: "Fotografie en video gecombineerd in één traject.",
        price: "€3.800",
        features: [
          "Fotograaf en videograaf",
          "Volledige dagreportage",
          "Online fotogalerij",
          "Huwelijksteaser",
          "Uitgebreide huwelijksfilm",
          "Dronebeelden indien mogelijk",
        ],
        ctaLabel: "Bekijk het combopakket",
        highlighted: true,
      },
    ] satisfies WvPriceCard[],
    note1:
      "Ieder huwelijk is anders. Tijdens een vrijblijvend gesprek bekijken we welke formule het beste aansluit bij jullie dag en verwachtingen.",
    note2:
      "Mogelijke uitbreidingen zijn onder andere een extra fotograaf of videograaf, extra uren, een fotoalbum, USB-aflevering en een huwelijksvideoboek.",
    cta: "Vraag de volledige prijsbrochure aan",
  },

  album: {
    title: "Een herinnering die je ook kunt",
    accent: "vasthouden",
    paragraphs: [
      "Niet iedere herinnering hoort alleen op een scherm thuis.",
      "Laat jullie favoriete beelden bundelen in een stijlvol fotoalbum of kies voor een huwelijksvideoboek met ingebouwd scherm. Zodra jullie het boek openen, begint de trouwfilm automatisch te spelen.",
    ],
    cta: "Ontdek de mogelijkheden",
    image1: { src: "", alt: "Huwelijksvideoboek met ingebouwd scherm" } satisfies WvImage,
    image2: { src: "", alt: "Stijlvol fotoalbum" } satisfies WvImage,
  },

  reviews: {
    title: "Zij beleefden hun dag met",
    accent: "WeddingVibe",
    /** Uitsluitend ECHTE reviews toevoegen; leeg = sectie wordt niet getoond. */
    items: [] as WvReview[],
  },

  faq: {
    overline: "Veelgestelde vragen",
    title: "Misschien vragen jullie je",
    accent: "dit nog af",
    items: [
      {
        question: "Hoeveel foto's ontvangen we?",
        answer:
          "Het exacte aantal verschilt per huwelijk. Bij een volledige dagreportage kunnen jullie rekenen op een uitgebreide selectie van zorgvuldig bewerkte beelden.",
      },
      {
        question: "Wanneer ontvangen we onze foto's en film?",
        answer: "De huidige maximale aflevertermijn bedraagt twee maanden na de trouwdatum.",
      },
      {
        question: "Kunnen we een extra fotograaf of videograaf boeken?",
        answer:
          "Ja. Voor grotere huwelijken of een uitgebreidere registratie kunnen we met meerdere fotografen of videografen werken.",
      },
      {
        question: "Maken jullie ook dronebeelden?",
        answer:
          "Waar de locatie, weersomstandigheden en geldende regels het toelaten, kunnen dronebeelden deel uitmaken van de reportage.",
      },
      {
        question: "Zijn jullie ook beschikbaar buiten Limburg?",
        answer:
          "Ja. WeddingVibe werkt in heel België en is ook beschikbaar voor huwelijken in het buitenland.",
      },
      {
        question: "Kunnen we een album of videoboek bestellen?",
        answer: "Ja. Zowel een fotoalbum als een huwelijksvideoboek behoort tot de mogelijkheden.",
      },
      {
        question: "Hoe leggen we onze trouwdatum vast?",
        answer:
          "Na een vrijblijvende kennismaking ontvangen jullie een duidelijk voorstel. Zodra de afspraken zijn bevestigd, wordt jullie datum gereserveerd.",
      },
      {
        question: "Kunnen we eerst kennismaken?",
        answer:
          "Natuurlijk. Een eerste gesprek is volledig vrijblijvend en kan gebruikt worden om jullie plannen en verwachtingen te bespreken.",
      },
    ] satisfies WvFaqItem[],
  },

  contact: {
    overline: "Zullen we jullie verhaal vastleggen?",
    title: "Vertel ons over",
    accent: "jullie trouwdag",
    intro:
      "Hebben jullie al een datum, locatie of eerste planning? Laat hieronder enkele gegevens achter. Jens neemt persoonlijk contact met jullie op om kennis te maken en de mogelijkheden te bespreken.",
    directLabel: "Liever rechtstreeks contact?",
    interesses: ["Fotografie", "Huwelijksfilm", "Foto & video", "Bruiloftwebsite", "Nog niet zeker"],
    submitLabel: "Controleer onze beschikbaarheid",
    submittedLabel: "Bedankt! Jens neemt snel contact op",
    background: { src: "", alt: "Emotioneel moment tijdens een huwelijk" } satisfies WvImage,
  },

  footer: {
    tagline:
      "Spontane trouwfotografie en filmische huwelijksvideo's voor koppels in België en daarbuiten.",
    nav: [
      { label: "Ons werk", href: "#werk" },
      { label: "Foto & film", href: "#diensten" },
      { label: "Over Jens", href: "#jens" },
      { label: "Investering", href: "#investering" },
      { label: "Veelgestelde vragen", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    diensten: [
      { label: "Trouwfotografie", href: "#diensten" },
      { label: "Huwelijksvideo", href: "#diensten" },
      { label: "Foto & video", href: "#diensten" },
      { label: "Bruiloftwebsite", href: "#diensten" },
      { label: "Fotoalbum", href: "#investering" },
      { label: "Videoboek", href: "#investering" },
    ],
    regios: ["Bilzen – Hoeselt", "Tongeren – Borgloon"],
    wereldwijd: "Wereldwijd beschikbaar",
    copyright: "© 2026 WeddingVibe - een zusje van VisualVibe",
  },

  modal: {
    overline: "Controleer jullie datum",
    title: "Is jullie datum",
    accent: "nog vrij?",
    intro:
      "Laat jullie gegevens achter en Jens laat zo snel mogelijk weten of jullie trouwdatum nog beschikbaar is.",
    submitLabel: "Controleer jullie datum",
    bedanktScript: "Proficiat!",
    bedanktSub:
      "Jens neemt zo snel mogelijk persoonlijk contact met jullie op om te laten weten of jullie datum nog beschikbaar is.",
  },
} as const;

export type WeddingVibeConfig = typeof weddingVibeConfig;
