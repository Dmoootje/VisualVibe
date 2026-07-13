import type { SubserviceEditorial } from "@/types";

type DroneEditorialSlug =
  | "dronefotografie"
  | "dronevideo"
  | "fpv-video"
  | "vastgoed-dronebeelden"
  | "realisatie-dronebeelden"
  | "event-dronebeelden";

export const droneEditorial = {
  dronefotografie: {
    intro:
      "Met professionele dronefotografie brengen we een gebouw, terrein of bedrijfsomgeving helder in beeld vanuit standpunten die vanaf de grond ontbreken. We vertrekken niet zomaar met een drone: vooraf controleren we de locatie, het luchtruim, de weersverwachting, de omgeving en mogelijke toestemmingen. Zo bouwen we een haalbare fotosessie rond jouw communicatiedoel, met aandacht voor veiligheid, compositie en een consistente afwerking.",
    excerpt:
      "Professionele luchtfoto's van gebouwen, terreinen en projecten, voorbereid op locatie en afgewerkt voor web, drukwerk en communicatie.",
    process: [
      {
        title: "Doel en beeldlijst bepalen",
        description:
          "We bespreken wat de foto's moeten tonen, waar je ze gebruikt en welke verhoudingen nodig zijn. Daarna maken we een compacte beeldlijst met overzicht, context en relevante details.",
      },
      {
        title: "Vluchtomgeving controleren",
        description:
          "We bekijken de exacte locatie, het luchtruim, obstakels, omstanders, privacygevoelige zones en toestemming waar die nodig kan zijn. Pas na die controle leggen we een realistische aanpak vast.",
      },
      {
        title: "Fotograferen op het juiste moment",
        description:
          "Op de draaidag beoordelen we weer, licht en veiligheid opnieuw. We variëren gecontroleerd in hoogte, kijkrichting en afstand om zowel overzicht als architecturale samenhang vast te leggen.",
      },
      {
        title: "Selectie en beeldafwerking",
        description:
          "We selecteren de sterkste opnames en werken kleur, contrast, uitsnede en perspectief zorgvuldig af. Je ontvangt bestanden die passen bij de afgesproken kanalen en toepassingen.",
      },
    ],
    faqs: [
      {
        question: "Kan dronefotografie op elke locatie?",
        answer:
          "Nee. De haalbaarheid hangt onder meer af van het luchtruim, de afstand tot mensen en gebouwen, lokale omstandigheden, obstakels en eventuele toestemmingen. We controleren de locatie vooraf en bevestigen pas daarna welke opnames verantwoord uitvoerbaar zijn. Dat is een praktische productie-inschatting, geen juridisch advies.",
      },
      {
        question: "Wat gebeurt er bij regen of te veel wind?",
        answer:
          "Neerslag, wind, zicht en licht beïnvloeden zowel veiligheid als beeldkwaliteit. Als de omstandigheden onvoldoende zijn, stemmen we een nieuw moment of een aangepast grondgebonden alternatief af. De definitieve beoordeling gebeurt ook op locatie.",
      },
      {
        question: "Welke foto's staan standaard op de beeldlijst?",
        answer:
          "Er bestaat geen vaste standaardset. Voor een bedrijfssite zijn situering, toegang, gebouwen en terreinlogica vaak belangrijk; voor architectuur spelen lijnen, gevels en materiaalcontext meer mee. We maken de lijst op basis van jouw gebruiksdoel.",
      },
      {
        question: "Kunnen luchtfoto's met gewone bedrijfsfotografie worden gecombineerd?",
        answer:
          "Ja. Een gecombineerde sessie levert een samenhangend verhaal op van buitenomgeving, gebouwen, teams en activiteit. We stemmen licht, kleurstijl en planning op elkaar af, zodat de beelden als één reeks aanvoelen.",
      },
      {
        question: "In welke formaten worden de beelden geleverd?",
        answer:
          "We spreken vooraf af of je foto's nodig hebt voor websites, sociale media, presentaties of drukwerk. Op basis daarvan leveren we geschikte resoluties en uitsneden, zonder onnodige varianten die je beeldbank onoverzichtelijk maken.",
      },
    ],
    relatedServices: ["dronevideo", "bedrijfsfotografie", "vastgoedfotografie", "realisatiefotografie"],
    seo: {
      title: "Professionele Dronefotografie Limburg | VisualVibe",
      description:
        "Dronefotografie in Limburg voor gebouwen, terreinen en projecten. Veilig voorbereid, doordacht gefotografeerd en afgewerkt voor jouw communicatie.",
      keywords: ["dronefotografie", "dronefotografie Limburg", "professionele luchtfoto's", "luchtfoto bedrijf"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "dronefotografie",
        supportingKeywords: ["dronefotografie Limburg", "professionele luchtfoto's", "luchtfoto gebouw", "dronefoto bedrijf"],
        type: "commercial",
      },
      overview: {
        title: "Dronefotografie voor een helder beeld van jouw locatie",
        paragraphs: [
          "Dronefotografie maakt ligging, schaal en samenhang zichtbaar. Gebouwen, terrein en omgeving komen in één overzicht bijeen. Dat maakt luchtfoto's bruikbaar voor websites, projectcommunicatie, vastgoedpublicaties en een actuele beeldbank.",
          "We bepalen eerst of herkenbaarheid, architectuur, context of activiteit centraal staat. Daarop stemmen we hoogte, richting en tijdstip af. Locatie, luchtruim, weer, veiligheid, toegang en toestemming waar nodig worden gecontroleerd voordat we bevestigen welke beelden haalbaar zijn.",
        ],
        highlights: [
          "Composities afgestemd op website, campagne of drukwerk",
          "Voorafgaande controle van locatie en vluchtomgeving",
          "Consistente kleurafwerking binnen je bestaande beeldstijl",
        ],
      },
      outcomes: {
        title: "Wat goede luchtfoto's voor je communicatie doen",
        intro:
          "De meerwaarde zit niet enkel in hoogte, maar in beelden die snel relevante context geven en visueel aansluiten bij je merk.",
        items: [
          {
            title: "Ruimtelijk overzicht",
            description:
              "Bezoekers begrijpen in één oogopslag hoe gebouwen, terrein en omgeving zich tot elkaar verhouden.",
          },
          {
            title: "Sterke openingsbeelden",
            description:
              "Een brede luchtfoto kan dienen als visuele blikvanger op een website, brochure of projectpagina zonder de inhoud te overschreeuwen.",
          },
          {
            title: "Samenhangende beeldbank",
            description:
              "Overzicht, halftotaal en detail worden als één reeks gefotografeerd en afgewerkt, zodat je gericht per kanaal kunt kiezen.",
          },
        ],
      },
      idealFor: {
        title: "Wanneer dronefotografie goed past",
        intro:
          "Luchtfotografie is vooral zinvol wanneer locatie, schaal of omgeving een wezenlijk deel van je verhaal vormt.",
        items: [
          {
            title: "Bedrijfsterreinen",
            description:
              "Voor ondernemingen die hun site, bereikbaarheid, infrastructuur of verschillende activiteitenzones overzichtelijk willen presenteren.",
          },
          {
            title: "Architectuur en vastgoed",
            description:
              "Voor gebouwen waarbij volume, perceel, buitenruimte en relatie met de buurt niet vanuit één grondstandpunt zichtbaar zijn.",
          },
          {
            title: "Projecten en realisaties",
            description:
              "Voor ontwerpers, aannemers en organisaties die een afgewerkt resultaat met voldoende context aan hun portfolio willen toevoegen.",
          },
        ],
      },
      deliverables: {
        title: "Wat je ontvangt na de fotosessie",
        intro:
          "We leggen de levering vooraf vast op basis van het aantal toepassingen, zodat elk bestand een duidelijke rol heeft.",
        items: [
          {
            title: "Geselecteerde fotoreeks",
            description:
              "Een zorgvuldige selectie zonder bijna-identieke beelden, opgebouwd rond de afgesproken beeldlijst.",
          },
          {
            title: "Professionele nabewerking",
            description:
              "Afstemming van kleur, helderheid, contrast, horizon en uitsnede voor een natuurlijke, consistente uitstraling.",
          },
          {
            title: "Bestanden voor digitale kanalen",
            description:
              "Praktische formaten voor website, sociale media of presentaties, afgestemd op de overeengekomen inzet.",
          },
          {
            title: "Hoge resolutie",
            description:
              "Geschikte masterbestanden voor geselecteerde druktoepassingen wanneer dat onderdeel is van de briefing.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van dronefotografie?",
        paragraphs: [
          "De prijs omvat meer dan vliegtijd. Voorbereiding, locatiecontrole, beeldvariatie en nabewerking bepalen het productiewerk. Eén compacte gebouwenreeks vraagt een andere aanpak dan meerdere sites met verschillende doelen.",
          "Na de briefing maken we een afgebakend voorstel. Gevolgen van de controle van locatie, luchtruim, weer of veiligheid bespreken we vóór de opname. Zo zijn voorbereiding en levering duidelijk zonder uitvoerbaarheid op elke plek te veronderstellen.",
        ],
        factors: [
          "Aantal locaties en afstand tussen de locaties",
          "Complexiteit van de vluchtomgeving",
          "Gewenste hoeveelheid standpunten en uitsneden",
          "Combinatie met fotografie of video vanaf de grond",
          "Tijdstip en afhankelijkheid van specifiek licht",
          "Niveau van selectie en nabewerking",
        ],
      },
      whyVisualVibe: {
        title: "Waarom VisualVibe voor luchtfotografie",
        intro:
          "We benaderen een drone als beeldmiddel binnen je communicatie, met evenveel aandacht voor voorbereiding als voor de uiteindelijke foto.",
        items: [
          {
            title: "Doelgerichte compositie",
            description:
              "We zoeken geen hoogte om de hoogte, maar standpunten die informatie ordenen en jouw verhaal ondersteunen.",
          },
          {
            title: "Nuchtere haalbaarheidscheck",
            description:
              "Locatie, luchtruim, weer, veiligheid en toestemming worden vooraf praktisch beoordeeld en op de opnamedag opnieuw afgewogen.",
          },
          {
            title: "Eén visuele lijn",
            description:
              "Dronebeelden kunnen inhoudelijk en qua afwerking aansluiten op je bedrijfsfoto's, vastgoedreeks of websiteontwerp.",
          },
        ],
      },
      regional: {
        title: "Dronefotografie in Limburg en omliggende regio's",
        description:
          "VisualVibe plant dronefotografie vanuit Limburg voor opdrachten in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. We bekijken per exacte locatie welke aanpak na controle van luchtruim, omgeving, weer en praktische toestemming haalbaar is.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Vertel welk overzicht je nodig hebt",
        description:
          "Deel de locatie, gewenste toepassingen en timing. We bekijken de beeldmogelijkheden en werken een passend voorstel uit na een eerste haalbaarheidscontrole.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  dronevideo: {
    intro:
      "Met dronevideo voegen we luchtbeelden toe aan een bedrijfsvideo, campagne, locatiepresentatie of los videoconcept. Een goede dronebeweging maakt schaal en omgeving voelbaar zonder dat het een los effect wordt. We stemmen routes en montagefunctie vooraf af en controleren de locatie, het luchtruim, het weer, de veiligheid en mogelijke toestemmingen voordat we de opnamedag definitief invullen.",
    excerpt:
      "Vloeiende dronevideo met een duidelijke rol in je verhaal, van locatie-intro tot cinematische overgang en zelfstandig luchtbeeld.",
    process: [
      {
        title: "Verhaalfunctie vastleggen",
        description:
          "We bepalen waar luchtbeelden in de video waarde toevoegen: als introductie, ruimtelijke uitleg, overgang, sfeerbeeld of afsluiter. Daaruit volgen shotduur, richting en formaat.",
      },
      {
        title: "Routes en risico's verkennen",
        description:
          "Op basis van locatiegegevens bekijken we luchtruim, bebouwing, publiek, obstakels, start- en landingszone en toestemming waar nodig. We ontwerpen alleen routes die na controle realistisch blijven.",
      },
      {
        title: "Bewegingen gecontroleerd opnemen",
        description:
          "Voor vertrek beoordelen we de actuele omstandigheden opnieuw. We filmen meerdere bruikbare takes met rustige versnelling, passende hoogte en voldoende montageruimte.",
      },
      {
        title: "Monteren en visueel afstemmen",
        description:
          "We selecteren shots op inhoud en beweging, corrigeren kleur en verwerken ze in de afgesproken montage of leveren een gecureerde selectie voor jouw productie.",
      },
    ],
    faqs: [
      {
        question: "Hoe lang duurt een dronevideo?",
        answer:
          "Dat hangt af van de toepassing. In een bedrijfsvideo kunnen enkele doelgerichte luchtshots sterker zijn dan een lange aaneenschakeling. Voor een zelfstandige locatievideo bouwen we meer ritme en variatie in. We adviseren een lengte op basis van kanaal en verhaal.",
      },
      {
        question: "Kunnen dronebeelden in een bestaande video worden gemonteerd?",
        answer:
          "Ja, als beeldstijl, resolutie, beeldfrequentie en kleur voldoende aansluiten. We vragen vooraf naar de technische specificaties en bestaande montage, zodat de nieuwe shots gericht worden opgenomen en niet als vreemd element aanvoelen.",
      },
      {
        question: "Is filmen boven mensen mogelijk?",
        answer:
          "Dat kan niet zomaar worden aangenomen. Publieksdichtheid, afstand, vliegomgeving en operationele voorwaarden spelen mee. We beoordelen het plan vooraf en zoeken waar nodig een andere route, ander moment of grondgebonden standpunt. De controle is praktisch en vormt geen juridisch advies.",
      },
      {
        question: "Wat als het weer tijdens de geplande opname omslaat?",
        answer:
          "Wind, regen, zicht en licht worden vlak voor en op het draaimoment beoordeeld. Wanneer veilig of kwalitatief filmen niet verantwoord is, passen we het schema aan of plannen we het luchtgedeelte opnieuw in overleg.",
      },
      {
        question: "Leveren jullie ook verticale dronevideo voor sociale media?",
        answer:
          "Ja. Verticale uitsnedes vragen wel om andere kadrering en vlieglijnen dan breedbeeld. Daarom leggen we vooraf vast welke kanalen prioriteit krijgen en filmen we met voldoende ruimte voor de beoogde formaten.",
      },
    ],
    relatedServices: ["bedrijfsvideo", "promovideo", "dronefotografie", "social-media-video", "fpv-video"],
    seo: {
      title: "Cinematische Dronevideo voor Bedrijven | VisualVibe",
      description:
        "Dronevideo voor bedrijven, vastgoed en locaties in Limburg. Vloeiende luchtbeelden, zorgvuldig gepland en gemonteerd voor web, campagne en social media.",
      keywords: ["dronevideo", "dronevideo Limburg", "dronebeelden bedrijf", "cinematische luchtbeelden"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "dronevideo",
        supportingKeywords: ["dronevideo Limburg", "dronebeelden bedrijf", "luchtbeelden laten maken", "drone videoproductie"],
        type: "commercial",
      },
      overview: {
        title: "Dronevideo die beweging en omgeving betekenis geeft",
        paragraphs: [
          "Dronevideo kan een kijker in enkele seconden oriënteren. Een rustige nadering introduceert een locatie, een zijwaartse beweging toont de lengte van een gebouw en een stijgend shot onthult de ruimere omgeving. De gekozen beweging moet iets vertellen. Daarom vertrekken we vanuit script, boodschap en montage, niet vanuit een lijst spectaculaire manoeuvres.",
          "We kunnen luchtbeelden als afzonderlijke opname produceren of integreren in een bredere videoproductie. Vooraf brengen we het gewenste pad, de start- en landingsruimte, relevante obstakels en aanwezige personen in kaart. Daarna volgen controles van locatie, luchtruim, weersverwachting, veiligheid en toestemming waar nodig. Wat daadwerkelijk wordt gevlogen, blijft afhankelijk van de actuele beoordeling op het moment van opname.",
        ],
        highlights: [
          "Vliegbewegingen ontworpen vanuit script en montage",
          "Horizontale en verticale toepassingen vooraf meegenomen",
          "Afstemming met camera-opnames vanaf de grond",
        ],
      },
      outcomes: {
        title: "Het resultaat van doelgerichte luchtbeweging",
        intro:
          "Een geslaagde dronevideo geeft de kijker overzicht én een natuurlijk gevoel van beweging binnen het verhaal.",
        items: [
          {
            title: "Directe situering",
            description:
              "Een openingsshot maakt meteen duidelijk waar het verhaal plaatsvindt en welke schaal de locatie heeft.",
          },
          {
            title: "Meer visueel ritme",
            description:
              "Luchtbeelden creëren ademruimte en logische overgangen tussen interviews, details en actie op de grond.",
          },
          {
            title: "Breed inzetbare montage",
            description:
              "Door kadrering en take-lengte vooraf te plannen, ontstaan bruikbare fragmenten voor hoofdfilm en geselecteerde korte versies.",
          },
        ],
      },
      idealFor: {
        title: "Voor welke verhalen dronevideo werkt",
        intro:
          "Het luchtperspectief verdient een plaats wanneer ruimte, route of schaal mee betekenis geeft aan je boodschap.",
        items: [
          {
            title: "Bedrijfsvideo's",
            description:
              "Introduceer een vestiging, productieomgeving of buitenactiviteit als onderdeel van een breder bedrijfsverhaal.",
          },
          {
            title: "Locatiepromotie",
            description:
              "Laat bezoekers de opbouw, bereikbaarheid en omgeving van een site, verblijf of recreatieve plek begrijpen.",
          },
          {
            title: "Vastgoed en architectuur",
            description:
              "Verbind gevel, volume, buitenruimte en buurt in vloeiende beelden die fotografie inhoudelijk aanvullen.",
          },
        ],
      },
      deliverables: {
        title: "Mogelijke oplevering van je dronevideo",
        intro:
          "De exacte set volgt uit je productie: gemonteerde video, aanvullende luchtshots of een combinatie met andere opnames.",
        items: [
          {
            title: "Gemonteerde hoofdvideo",
            description:
              "Een afgewerkte verhaallijn met zorgvuldig gekozen luchtbeelden, kleurcorrectie en afgesproken audio-elementen.",
          },
          {
            title: "Selectie gemonteerde luchtshots",
            description:
              "Losse, bruikbare fragmenten met een heldere start en uitloop voor verwerking in een bredere productie.",
          },
          {
            title: "Kanaalgerichte versie",
            description:
              "Een afgesproken uitsnede of korte montage voor een specifiek digitaal kanaal, wanneer voorzien in de scope.",
          },
          {
            title: "Kleurafstemming",
            description:
              "Een natuurlijke beeldafwerking die past bij grondcamera's, huisstijl en de gewenste sfeer van het project.",
          },
        ],
      },
      pricing: {
        title: "Hoe wordt een dronevideoproductie begroot?",
        paragraphs: [
          "Een offerte voor dronevideo omvat voorbereiding, productietijd en montage. Een locatie-intro binnen een draaidag verschilt van een zelfstandige film met meerdere routes of versies. Ook de omgeving beïnvloedt de voorbereiding.",
          "We brengen eerst het doel en de technische levering in kaart. Daarna bekijken we de exacte locatie en de voorziene omstandigheden. De uiteindelijke uitvoering blijft afhankelijk van de controle van luchtruim, weer, veiligheid en toestemming waar relevant. Mogelijke alternatieven of planningsvoorwaarden nemen we transparant mee in het voorstel.",
        ],
        factors: [
          "Aantal locaties en geplande vliegroutes",
          "Rol van de shots binnen script en montage",
          "Complexiteit van luchtruim en directe omgeving",
          "Combinatie met interviews of grondcamera's",
          "Gewenste videolengte en aantal versies",
          "Horizontale, vierkante of verticale formaten",
        ],
      },
      whyVisualVibe: {
        title: "Waarom dronevideo bij VisualVibe",
        intro:
          "We koppelen technische vluchtvoorbereiding aan videoregie, zodat elk luchtshot een duidelijke plaats krijgt in het eindresultaat.",
        items: [
          {
            title: "Montagegericht filmen",
            description:
              "Beweging, duur en kijkrichting worden gekozen met de uiteindelijke verhaallijn en kanalen in gedachten.",
          },
          {
            title: "Volledige productiecontext",
            description:
              "We kunnen luchtbeelden afstemmen op interviews, handheldbeelden, fotografie en grafische elementen binnen één productie.",
          },
          {
            title: "Voorbereiding zonder loze beloftes",
            description:
              "We bespreken kansen en beperkingen na concrete controle van locatie, luchtruim, weer, veiligheid en eventuele toestemming.",
          },
        ],
      },
      regional: {
        title: "Dronevideo in Limburg, Vlaanderen en de grensregio",
        description:
          "Vanuit Limburg plant VisualVibe dronevideo in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. Elke opdracht krijgt een locatiegebonden beoordeling van luchtruim, omgeving, weersomstandigheden, veiligheid en benodigde praktische afstemming.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Geef je videoconcept ook een luchtperspectief",
        description:
          "Stuur ons je locatie, verhaal, kanalen en gewenste timing. We bekijken welke vliegbewegingen inhoudelijk passen en na controle uitvoerbaar lijken.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "fpv-video": {
    intro:
      "Een FPV-video laten maken neemt de kijker mee in één energieke beweging door, langs of rond een locatie. De compacte drone en directe vliegstijl maken routes mogelijk die anders aanvoelen dan klassieke luchtbeelden, maar vragen extra voorbereiding. We ontwerpen het traject rond verhaal, ruimte en ritme en beoordelen vooraf locatie, luchtruim, obstakels, mensen, weer, veiligheid en toestemming waar nodig. Pas na controle bepalen we welke route verantwoord kan worden opgenomen.",
    excerpt:
      "Dynamische FPV-video die de kijker door je locatie leidt, met een vooraf ontworpen route en montage op maat van merk en kanaal.",
    process: [
      {
        title: "Routeverhaal ontwerpen",
        description:
          "We vertalen jouw kernboodschap naar een logische kijkersreis. Elke doorgang, bocht en onthulling krijgt een functie, van eerste herkenning tot het afsluitende beeld.",
      },
      {
        title: "Technische walkthrough",
        description:
          "We onderzoeken breedte, hoogte, obstakels, reflecties, luchtstromen, aanwezigen en veilige zones. Ook luchtruim en noodzakelijke praktische toestemmingen worden voor de beoogde setting gecontroleerd.",
      },
      {
        title: "Choreografie en takes",
        description:
          "Mensen, machines, deuren en acties worden op herkenbare cues afgestemd. We repeteren waar zinvol en nemen meerdere gecontroleerde passages op zonder de veiligheid ondergeschikt te maken aan één take.",
      },
      {
        title: "Ritme en afwerking",
        description:
          "De beste passages worden geselecteerd, vloeiend gemonteerd en op kleur gebracht. Muziek, geluid en eventuele titels versterken de route zonder de oriëntatie te verliezen.",
      },
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen FPV-video en klassieke dronevideo?",
        answer:
          "Klassieke dronevideo legt vaak rustige, stabiele bewegingen op afstand vast. FPV voelt directer en beweegt dichter door een route. Welke aanpak past, hangt af van de locatie, sfeer en veiligheidsruimte. Beide stijlen kunnen ook samen in één montage worden gebruikt.",
      },
      {
        question: "Kan een FPV-drone binnen vliegen?",
        answer:
          "Dat kan in sommige ruimtes, maar niet automatisch. Afmetingen, obstakels, luchtstromen, kwetsbare objecten, mensen en veilige start- en landingszones moeten eerst worden beoordeeld. We passen route en planning aan op wat na de walkthrough haalbaar is.",
      },
      {
        question: "Moet een FPV-video uit één ononderbroken take bestaan?",
        answer:
          "Nee. Een echte doorlopende take kan passend zijn, maar subtiele montage biedt soms meer controle over timing, veiligheid en verhaal. We kiezen de vorm die het concept het best dient en zijn daar vooraf helder over.",
      },
      {
        question: "Kunnen medewerkers of bezoekers in de route meespelen?",
        answer:
          "Ja, wanneer hun positie en beweging vooraf beheersbaar worden georganiseerd. We werken met duidelijke cues en afgebakende zones. Bij publiek of onvoorspelbare bewegingen zoeken we een andere timing of een route met meer afstand.",
      },
      {
        question: "Hoe bereiden we de locatie voor?",
        answer:
          "We vragen doorgaans om de vliegroute vrij te maken, losse voorwerpen weg te nemen, deuren vast te zetten en relevante verlichting te testen. Wie in beeld komt, krijgt vooraf instructies. De precieze checklist volgt uit de walkthrough.",
      },
    ],
    relatedServices: ["dronevideo", "bedrijfsvideo", "promovideo", "social-media-video", "event-aftermovie"],
    seo: {
      title: "Dynamische FPV-video Laten Maken in Limburg | VisualVibe",
      description:
        "FPV-video laten maken in Limburg: een dynamische route door je bedrijf, locatie of event, voorbereid op verhaal, ruimte, veiligheid en montage voor web.",
      keywords: ["FPV-video", "FPV-video laten maken", "FPV drone Limburg", "one take dronevideo"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "FPV-video laten maken",
        supportingKeywords: ["FPV-video", "FPV drone Limburg", "indoor dronevideo", "one take bedrijfsvideo"],
        type: "mixed",
      },
      overview: {
        title: "FPV-video laten maken als vloeiende kijkersreis",
        paragraphs: [
          "Bij FPV bestuurt de piloot vanuit live camerabeeld een driedimensionale route. Voor de kijker voelt dat alsof die zelf door een bedrijf, showroom, productiehal of eventmoment beweegt.",
          "De kracht zit in choreografie. Entree, ontmoeting, actie en onthulling vormen herkenbare hoofdstukken. We analyseren doorgangen, obstakels, personen, lichtwissels en uitwijkzones. Voor buitendelen controleren we ook luchtruim, weer en toestemming waar nodig. De route volgt pas na die concrete beoordeling.",
        ],
        highlights: [
          "Routeconcept met een duidelijke begin- en eindgedachte",
          "Voorbereide interacties met mensen of activiteit",
          "Keuze tussen doorlopende take en onzichtbare montage",
        ],
      },
      outcomes: {
        title: "Wat een doordachte FPV-route oplevert",
        intro:
          "De kijker krijgt niet alleen energie, maar ook een begrijpelijke rondleiding met natuurlijke aandachtspunten.",
        items: [
          {
            title: "Sterke kijkersbetrokkenheid",
            description:
              "De continue voorwaartse beweging nodigt uit om te blijven kijken naar wat achter de volgende doorgang verschijnt.",
          },
          {
            title: "Ruimte met persoonlijkheid",
            description:
              "Architectuur, mensen en activiteit worden verbonden tot één ervaring in plaats van losse sfeerbeelden.",
          },
          {
            title: "Herkenbaar merkritme",
            description:
              "Snelheid, soundtrack, acties en kleur worden afgestemd op de uitstraling van je organisatie en doelgroep.",
          },
        ],
      },
      idealFor: {
        title: "Waar FPV echt tot zijn recht komt",
        intro:
          "FPV past bij locaties met een leesbare route, voldoende controle over de omgeving en een verhaal dat door beweging sterker wordt.",
        items: [
          {
            title: "Productie en logistiek",
            description:
              "Volg een herkenbaar proces door verschillende zones, met geplande activiteit die schaal en samenwerking zichtbaar maakt.",
          },
          {
            title: "Showrooms en beleving",
            description:
              "Beweeg langs presentaties, demonstraties en mensen om het bezoekgevoel compact en energiek over te brengen.",
          },
          {
            title: "Sport en entertainment",
            description:
              "Verbind actie en omgeving in een snelle route, voor zover afstand, controle en veiligheidsvoorwaarden dit toelaten.",
          },
        ],
      },
      deliverables: {
        title: "Onderdelen van een FPV-productie",
        intro:
          "De oplevering wordt gekoppeld aan je campagne en kan naast de hoofdvideo ook zorgvuldig gekozen afgeleide content omvatten.",
        items: [
          {
            title: "Route- en opnameplan",
            description:
              "Een praktisch overzicht van traject, acties, aandachtspunten en volgorde voor alle betrokkenen op de draaidag.",
          },
          {
            title: "Afgewerkte hoofdvideo",
            description:
              "De gekozen take of montage met kleurcorrectie, passend ritme en afgesproken muziek- of geluidselementen.",
          },
          {
            title: "Grafische afwerking",
            description:
              "Titels, logo of call-to-action kunnen subtiel worden verwerkt wanneer dit deel is van het afgesproken concept.",
          },
          {
            title: "Sociale versie",
            description:
              "Een geselecteerde korte of verticale variant wanneer de route daar vooraf voor ontworpen en gekadreerd is.",
          },
        ],
      },
      pricing: {
        title: "Welke elementen bepalen de prijs van FPV-video?",
        paragraphs: [
          "Een FPV-route wordt inhoudelijk ontworpen, technisch verkend en met acties afgestemd. De videolengte zegt daardoor weinig over het werk: een korte route door complexe zones kan veel voorbereiding vragen.",
          "Na bespreking ramen we walkthrough, repetitie, opname en postproductie. Alternatieve routes houden rekening met wijzigingen. Luchtruim, weer, veiligheid, aanwezigen en praktische toestemming blijven bepalend voor de uitvoering.",
        ],
        factors: [
          "Lengte en technische complexiteit van de route",
          "Aantal binnen- en buitenzones",
          "Choreografie met medewerkers, voertuigen of acties",
          "Nood aan locatieverkenning en repetitie",
          "Lichtwissels en gewenste productieafwerking",
        ],
      },
      whyVisualVibe: {
        title: "Waarom een FPV-productie met VisualVibe",
        intro:
          "We combineren routeontwerp, regie en postproductie tot één geheel, met duidelijke grenzen rond de uitvoerbaarheid van elke beweging.",
        items: [
          {
            title: "Verhaal vóór vliegtruc",
            description:
              "Elke bocht en overgang helpt de kijker iets ontdekken over je locatie, aanbod of mensen.",
          },
          {
            title: "Regie voor de hele ruimte",
            description:
              "We bereiden acties, timing, verlichting en achtergrond voor zodat de route levendig maar leesbaar blijft.",
          },
          {
            title: "Concrete veiligheidsafweging",
            description:
              "We controleren omgeving, luchtruim, obstakels, weer, personen en toestemming en passen het concept aan wanneer dat nodig is.",
          },
        ],
      },
      regional: {
        title: "FPV-video in Limburg en daarbuiten",
        description:
          "VisualVibe ontwikkelt FPV-video vanuit Limburg voor locaties in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. Elke binnen- of buitenroute wordt afzonderlijk verkend en beoordeeld op ruimte, luchtruim, weer, veiligheid en praktische toestemming.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Teken samen met ons de route uit",
        description:
          "Bezorg ons een plattegrond, video of korte beschrijving van je locatie en idee. We vertalen die input naar een verhalend FPV-concept en een haalbare volgende stap.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "vastgoed-dronebeelden": {
    intro:
      "Met vastgoed-dronebeelden toon je niet alleen een woning of commercieel pand, maar ook het perceel, de buitenruimte en de relatie met de omgeving. We maken luchtfoto's en, indien gewenst, korte videobewegingen die een vastgoedpresentatie inhoudelijk aanvullen. Vooraf controleren we de exacte locatie, het luchtruim, weersomstandigheden, veiligheid, privacygevoelige standpunten en toestemming waar nodig. Zo bepalen we welke beelden na controle haalbaar en relevant zijn voor de publicatie.",
    excerpt:
      "Luchtfoto's en videobeelden die pand, perceel en omgeving helder situeren voor vastgoedpresentaties en makelaarscommunicatie.",
    process: [
      {
        title: "Verkoopverhaal afbakenen",
        description:
          "We bespreken de kenmerken die vanuit de lucht werkelijk meerwaarde krijgen, zoals perceelvorm, tuin, bijgebouwen, toegang of landschappelijke ligging, en vermijden beelden zonder informatiewaarde.",
      },
      {
        title: "Pand en omgeving toetsen",
        description:
          "We bekijken luchtruim, bebouwing, bomen, kabels, buren, verkeer, aanwezige personen en mogelijke toestemming. Ook privacy en een veilige start- en landingsplek worden praktisch meegenomen.",
      },
      {
        title: "Fotograferen volgens de publicatie",
        description:
          "Op basis van weer en licht kiezen we gecontroleerde standpunten. We maken overzicht, diagonale pandbeelden en relevante omgevingskaders met ruimte voor de formaten van vastgoedplatform en sociale media.",
      },
      {
        title: "Selecteren en laten aansluiten",
        description:
          "We werken de luchtbeelden natuurlijk af en stemmen kleur en volgorde af op de vastgoedfotografie, zodat de volledige reeks één duidelijke rondgang vormt.",
      },
    ],
    faqs: [
      {
        question: "Welke meerwaarde hebben dronebeelden bij een vastgoedadvertentie?",
        answer:
          "Ze geven context die binnen- en gevelbeelden niet kunnen tonen: de verhouding tussen woning en perceel, de buitenzones, toegangsweg en ruimere setting. Dat is vooral relevant wanneer ligging of terrein een belangrijk onderdeel van het aanbod is.",
      },
      {
        question: "Kunnen perceelgrenzen op de luchtfoto worden aangeduid?",
        answer:
          "Een grafische aanduiding kan als afgesproken nabewerking worden toegevoegd op basis van betrouwbare informatie die je aanlevert. Zo'n visualisatie is illustratief en vervangt geen opmeting, plan of juridisch document. We formuleren dat ook duidelijk bij gebruik.",
      },
      {
        question: "Zijn luchtbeelden geschikt voor elk type woning?",
        answer:
          "Niet noodzakelijk. Bij compacte rijwoningen of locaties met veel obstakels kan het luchtperspectief weinig toevoegen of praktisch beperkt zijn. We bekijken doel, locatie, luchtruim, veiligheid, privacy en omgeving vooraf en adviseren eerlijk over de meerwaarde.",
      },
      {
        question: "Kunnen vastgoedfotografie en dronebeelden op dezelfde afspraak?",
        answer:
          "Ja, wanneer planning, weer en locatie dat toelaten. Door beide opnames samen te organiseren kunnen licht, beeldstijl en volgorde goed aansluiten. Het luchtgedeelte blijft wel afhankelijk van de actuele haalbaarheidscontrole.",
      },
      {
        question: "Moet de eigenaar iets voorbereiden voor de luchtfoto's?",
        answer:
          "Een opgeruimde oprit en tuin, gesloten afvalcontainers en verplaatste losse objecten maken het beeld rustiger. We bespreken ook geparkeerde voertuigen, aanwezigen en toegang tot een geschikte startzone. Je ontvangt vooraf gerichte aandachtspunten.",
      },
    ],
    relatedServices: ["vastgoedfotografie", "vastgoed-3d-tour", "dronefotografie", "dronevideo", "website-laten-maken"],
    seo: {
      title: "Sterke Vastgoed Dronebeelden voor Makelaars | VisualVibe",
      description:
        "Vastgoed-dronebeelden in Limburg die pand, perceel en omgeving helder tonen. Voor makelaars, projectpromotie en complete vastgoedpresentaties online.",
      keywords: ["vastgoed dronebeelden", "dronebeelden vastgoed", "dronefotografie woning", "drone makelaar Limburg"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "vastgoed-dronebeelden",
        supportingKeywords: ["dronebeelden vastgoed", "dronefotografie woning", "luchtfoto vastgoed", "drone makelaar Limburg"],
        type: "commercial",
      },
      overview: {
        title: "Vastgoed-dronebeelden voor pand, perceel en ligging",
        paragraphs: [
          "Een vastgoedfoto hoort een concrete vraag te beantwoorden. Gerichte luchtbeelden tonen perceel, tuin, bijgebouwen en toegang in samenhang, zonder de presentatie te vullen met weinig relevante hoogtestandpunten.",
          "De reeks sluit aan op vastgoedfotografie en een eventuele 3D-tour. Voor bevestiging controleren we locatie, luchtruim, obstakels, weer, veiligheid, privacy en toestemming waar nodig. Ook tijdens de afspraak bepaalt de actuele situatie welke beelden verantwoord kunnen worden gemaakt.",
        ],
        highlights: [
          "Duidelijke situering van woning en buitenruimte",
          "Beeldselectie gericht op vastgoedpublicatie",
          "Visuele aansluiting op interieur- en exterieurfoto's",
        ],
      },
      outcomes: {
        title: "Een completer beeld vóór het plaatsbezoek",
        intro:
          "Goede vastgoed-dronebeelden vullen ontbrekende context aan en helpen geïnteresseerden het pand realistischer te plaatsen.",
        items: [
          {
            title: "Leesbaar perceel",
            description:
              "Woning, tuin, oprit en bijgebouwen worden vanuit een geschikt schuin standpunt in hun onderlinge verhouding getoond.",
          },
          {
            title: "Herkenbare ligging",
            description:
              "Een ruimer beeld kan de landschappelijke of stedelijke context verduidelijken zonder onnodige private details te benadrukken.",
          },
          {
            title: "Logische fotoreeks",
            description:
              "Lucht-, gevel- en interieurbeelden vormen een samenhangende presentatie die de kijker stap voor stap door het aanbod leidt.",
          },
        ],
      },
      idealFor: {
        title: "Vastgoed waarbij luchtbeelden informatie toevoegen",
        intro:
          "Niet de verkoopcategorie, maar het belang van ligging, terrein en buitenarchitectuur bepaalt of dronebeelden zinvol zijn.",
        items: [
          {
            title: "Vrijstaande woningen",
            description:
              "Toon de samenhang tussen woning, tuin, terrassen, oprit en omliggende groenstructuur vanuit overzichtelijke hoeken.",
          },
          {
            title: "Projectontwikkeling",
            description:
              "Situeer een gebouw of nieuwe ontwikkeling binnen de bestaande buurt en verzamel beelden voor projectcommunicatie.",
          },
          {
            title: "Commercieel vastgoed",
            description:
              "Breng toegang, parking, laad- of buitenruimte en gebouwvolume compact samen voor zakelijke kandidaat-huurders of kopers.",
          },
        ],
      },
      deliverables: {
        title: "Wat een vastgoedpakket kan bevatten",
        intro:
          "We stellen het pakket samen volgens het publicatieplan en de kenmerken die voor dit specifieke pand relevant zijn.",
        items: [
          {
            title: "Schuine pandoverzichten",
            description:
              "Beelden waarin gevel, dakvolume en buitenzones herkenbaar samenkomen, zonder de ruimtelijke verhoudingen plat te slaan.",
          },
          {
            title: "Situatiefoto's",
            description:
              "Ruimere kadreringen die de ligging verduidelijken wanneer omgeving een relevant verkoopargument vormt.",
          },
          {
            title: "Natuurlijk afgewerkte bestanden",
            description:
              "Kleur, contrast, horizon en uitsnede worden afgestemd op de rest van de vastgoedreportage.",
          },
          {
            title: "Web- en publicatieformaten",
            description:
              "Bestanden in de overeengekomen resoluties voor vastgoedwebsite, platform of sociale post.",
          },
        ],
      },
      pricing: {
        title: "Prijsfactoren voor vastgoed-dronebeelden",
        paragraphs: [
          "De productiekost wordt bepaald door locatie, gewenste set en combinatie met andere vastgoedmedia. Een beperkte luchtfotoreeks tijdens een bestaande fotosessie verschilt van een afzonderlijke afspraak met fotografie, video en meerdere publicatieversies. Ook de omgeving kan extra voorbereiding of een ander opnamemoment vragen.",
          "Na ontvangst van het adres en de briefing doen we een eerste praktische controle. We beschrijven in het voorstel welke beelden en afwerking zijn inbegrepen. De uitvoering blijft afhankelijk van actuele omstandigheden en de beoordeling van luchtruim, weer, veiligheid, privacy en toestemming waar nodig. Bij beperkingen bespreken we een haalbaar alternatief.",
        ],
        factors: [
          "Ligging en complexiteit van de directe omgeving",
          "Grootte en opbouw van pand en perceel",
          "Aantal gewenste foto- en videostandpunten",
          "Combinatie met interieur- en exterieurfotografie",
          "Combinatie met een vastgoed 3D-tour",
        ],
      },
      whyVisualVibe: {
        title: "Waarom VisualVibe voor vastgoed vanuit de lucht",
        intro:
          "We behandelen luchtbeelden als onderdeel van een eerlijke, verzorgde vastgoedpresentatie en niet als een los visueel kunstje.",
        items: [
          {
            title: "Vastgoedgerichte beeldkeuze",
            description:
              "We prioriteren standpunten die perceel, buitenruimte en ligging begrijpelijk maken voor kandidaat-kopers of huurders.",
          },
          {
            title: "Samenhang tussen media",
            description:
              "Fotografie, video en 3D-tour kunnen qua planning, volgorde en visuele afwerking op elkaar worden afgestemd.",
          },
          {
            title: "Zorgvuldige locatiebeoordeling",
            description:
              "Luchtruim, obstakels, weer, veiligheid, privacy en praktische toestemming worden gecontroleerd voordat we mogelijkheden bevestigen.",
          },
        ],
      },
      regional: {
        title: "Vastgoed-dronebeelden in Limburg en de grensregio",
        description:
          "VisualVibe ondersteunt makelaars en vastgoedeigenaars in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. We beoordelen elk adres afzonderlijk op beeldwaarde, luchtruim, omgeving, weer, veiligheid en eventuele praktische toestemming.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Laat zien wat rond het pand belangrijk is",
        description:
          "Bezorg ons het adres, het type vastgoed en je publicatieplanning. We bekijken welke luchtbeelden echt iets toevoegen en maken een gericht voorstel.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "realisatie-dronebeelden": {
    intro:
      "Met realisatie-dronebeelden leggen we de schaal, voortgang en ruimtelijke samenhang van een bouw-, renovatie- of infrastructuurproject vast. Een eenmalige reportage toont het afgewerkte resultaat; een terugkerende reeks maakt verschillende projectfases visueel vergelijkbaar. Voor elk bezoek controleren we de werfsituatie, locatie, het luchtruim, weer, obstakels, veiligheid en toestemming waar nodig. De werfplanning en actuele activiteit bepalen mee welke standpunten na controle verantwoord haalbaar zijn.",
    excerpt:
      "Vergelijkbare luchtfoto's en videobeelden van bouwfases en afgewerkte realisaties, gepland rond werf, communicatie en veiligheid.",
    process: [
      {
        title: "Mijlpalen en kijkrichtingen plannen",
        description:
          "Samen kiezen we welke fasen, zones en constructiedelen relevant zijn. Voor opvolgreeksen leggen we referentiestandpunten en een realistische bezoeksfrequentie vast.",
      },
      {
        title: "Werfcontext vooraf afstemmen",
        description:
          "We bespreken werftoegang, werkzones, kranen, machines, leveringen en contactpersonen. Daarnaast controleren we locatie, luchtruim, omgeving en mogelijke toestemmingen voor het geplande moment.",
      },
      {
        title: "Veilig en vergelijkbaar registreren",
        description:
          "Op locatie stemmen we af met de aangewezen werfverantwoordelijke en beoordelen we weer en activiteit opnieuw. We herhalen referentiekaders en voegen relevante details of overzichtsbewegingen toe.",
      },
      {
        title: "Ordenen per fase en toepassing",
        description:
          "Na selectie en natuurlijke nabewerking structureren we de bestanden op datum, zone of mijlpaal. Zo blijven beelden bruikbaar voor rapportage, portfolio en communicatie.",
      },
    ],
    faqs: [
      {
        question: "Hoe vaak laat je een werf vanuit de lucht fotograferen?",
        answer:
          "Dat hangt af van het communicatiedoel en het bouwtempo. Logische momenten zijn zichtbare mijlpalen, zoals grondwerken, ruwbouw, buitenschil, terreinaanleg en oplevering. We vermijden bezoeken waarbij nauwelijks een relevant visueel verschil te verwachten is.",
      },
      {
        question: "Kunnen beelden vanaf exact hetzelfde standpunt worden herhaald?",
        answer:
          "We kunnen referentierichting, hoogte en kadrering zo consequent mogelijk documenteren en herhalen. Actuele werfinrichting, obstakels, luchtruim, weer en veiligheidsafstand kunnen een aanpassing vereisen. Daarom beloven we vergelijkbaarheid, geen technisch identieke positie onder alle omstandigheden.",
      },
      {
        question: "Mag er worden gevlogen terwijl de werf actief is?",
        answer:
          "Dat wordt per situatie bekeken. Machines, kranen, leveringen en personen beïnvloeden routes en veilige zones. We stemmen met de aangewezen contactpersoon af en kunnen een rustiger tijdvenster of aangepaste route voorstellen. Onze inschatting is productiegericht en geen juridisch advies.",
      },
      {
        question: "Zijn realisatie-dronebeelden bruikbaar als technische inspectie?",
        answer:
          "Deze dienst is bedoeld voor visuele projectregistratie en communicatie. De beelden vervangen geen gecertificeerde inspectie, landmeting of formele werfcontrole. Als je een specialistische analyse nodig hebt, moet scope en deskundigheid afzonderlijk worden bepaald.",
      },
      {
        question: "Kunnen datum of projectfase op de beelden worden vermeld?",
        answer:
          "Ja, we kunnen bestanden systematisch benoemen en afgesproken grafische titels in een video of selectie verwerken. De inhoud en schrijfwijze worden vooraf afgestemd, zodat de reeks intern en extern consistent blijft.",
      },
    ],
    relatedServices: ["realisatiefotografie", "dronefotografie", "dronevideo", "bedrijfsvideo", "website-laten-maken"],
    seo: {
      title: "Realisatie Dronebeelden voor Bouwproject | VisualVibe",
      description:
        "Realisatie-dronebeelden in Limburg voor bouw, renovatie en infrastructuur. Leg voortgang, schaal en oplevering vast in een consistente beeldreeks.",
      keywords: ["realisatie dronebeelden", "dronebeelden bouwproject", "werf dronefotografie", "bouwvoortgang foto's"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "realisatie-dronebeelden",
        supportingKeywords: ["dronebeelden bouwproject", "werf dronefotografie", "bouwvoortgang vastleggen", "dronebeelden renovatie"],
        type: "commercial",
      },
      overview: {
        title: "Realisatie-dronebeelden voor voortgang en eindresultaat",
        paragraphs: [
          "Een bouwproject verandert voortdurend. Vanaf de grond zijn omvang, terreinlogistiek en samenhang tussen zones niet altijd duidelijk te registreren. Luchtbeelden bieden een overzichtelijke visuele momentopname voor projectupdates, interne presentaties, stakeholdercommunicatie en later portfoliogebruik. Door vooraf referentierichtingen te kiezen, kan een reeks de ontwikkeling door verschillende fases herkenbaar volgen.",
          "Projectregistratie vraagt een andere aanpak dan een eenmalige promotieshoot. De planning volgt betekenisvolle mijlpalen en wordt afgestemd op de actuele werfkalender. Voor elk bezoek beoordelen we locatie, luchtruim, weer, kranen en andere obstakels, aanwezige mensen, veilige zones en toestemming waar nodig. We stemmen praktisch af met de aangewezen contactpersoon, maar nemen geen rol van werfcoördinator, landmeter of inspecteur over.",
        ],
        highlights: [
          "Referentiekaders voor herkenbare voortgangsreeksen",
          "Planning rond zichtbare bouwmijlpalen",
          "Bestandsstructuur per datum, fase of projectzone",
        ],
      },
      outcomes: {
        title: "Beeldmateriaal dat met het project meegroeit",
        intro:
          "Een consistente registratiereeks maakt de weg naar het eindresultaat begrijpelijk voor zowel interne als externe doelgroepen.",
        items: [
          {
            title: "Zichtbare projectontwikkeling",
            description:
              "Opeenvolgende overzichten tonen hoe volumes, terreinen en buitenaanleg veranderen tussen afgesproken mijlpalen.",
          },
          {
            title: "Duidelijke schaal",
            description:
              "Luchtstandpunten plaatsen constructie en omgeving in verhouding, wat projectcommunicatie sneller leesbaar maakt.",
          },
          {
            title: "Portfolio met context",
            description:
              "Het afgewerkte project wordt niet alleen als object getoond, maar ook in relatie tot terrein en omliggende infrastructuur.",
          },
        ],
      },
      idealFor: {
        title: "Projecten die baat hebben bij luchtregistratie",
        intro:
          "Luchtbeelden zijn relevant wanneer voortgang, omvang of situering niet volledig vanaf publieke of veilige grondstandpunten zichtbaar is.",
        items: [
          {
            title: "Nieuwbouw en renovatie",
            description:
              "Volg zichtbare mijlpalen of presenteer de afgewerkte architectuur en terreinaanleg als samenhangend geheel.",
          },
          {
            title: "Bedrijfs- en industriebouw",
            description:
              "Breng grote volumes, logistieke zones en buiteninfrastructuur overzichtelijk in beeld voor project- en merkcommunicatie.",
          },
          {
            title: "Infrastructuur en terreinaanleg",
            description:
              "Toon traject, fasering en ruimtelijke relatie van werken die zich over een bredere locatie uitstrekken.",
          },
        ],
      },
      deliverables: {
        title: "Oplevering voor een realisatie- of voortgangsreeks",
        intro:
          "We kiezen een vaste structuur die ook bij latere bezoeken bruikbaar blijft en nieuwe beelden logisch aan het archief toevoegt.",
        items: [
          {
            title: "Luchtoverzichten per bezoek",
            description:
              "Een geselecteerde set met vaste referentierichtingen en aanvullende actuele standpunten waar de situatie dat toelaat.",
          },
          {
            title: "Afgewerkte projectfoto's",
            description:
              "Natuurlijke correctie van kleur, contrast, horizon en uitsnede, afgestemd tussen verschillende opnamemomenten.",
          },
          {
            title: "Chronologische ordening",
            description:
              "Bestanden geordend op datum, fase of afgesproken zone om opvolging en intern gebruik eenvoudiger te maken.",
          },
          {
            title: "Selectie voor communicatie",
            description:
              "Een compacte set die de mijlpaal visueel samenvat voor publicatie, naast de bredere projectlevering indien afgesproken.",
          },
        ],
      },
      pricing: {
        title: "Hoe wordt realisatie-dronewerk geoffreerd?",
        paragraphs: [
          "Bij een opleverreportage bepalen locatie, gewenste beeldreeks en nabewerking de scope. Voor voortgangsregistratie tellen ook bezoeken, referentiekaders en bestandsordening mee. Elk bezoek wordt praktisch afgestemd.",
          "De werf verandert tussen planning en opname. Daarom controleren we voor ieder bezoek opnieuw het weer, luchtruim, obstakels, activiteit en veilige zones. Wanneer omstandigheden een route of tijdstip uitsluiten, bespreken we een alternatief. De offerte beschrijft de communicatieve beeldproductie en omvat geen technische inspectie of formele projectcontrole.",
        ],
        factors: [
          "Eenmalige reportage of terugkerende reeks",
          "Aantal geplande projectmijlpalen",
          "Omvang en complexiteit van de werflocatie",
          "Toegang, onthaal en afstemming op de werf",
          "Aantal referentierichtingen en projectzones",
          "Foto, video of combinatie met grondopnames",
        ],
      },
      whyVisualVibe: {
        title: "Waarom VisualVibe voor projectregistratie",
        intro:
          "We bouwen een visueel bruikbaar archief rond echte projectmijlpalen en houden de praktische werfcontext bij elk bezoek voor ogen.",
        items: [
          {
            title: "Continuïteit in beeld",
            description:
              "Referentiekaders, kleurafwerking en bestandsstructuur zorgen voor samenhang tussen verschillende projectfases.",
          },
          {
            title: "Communicatiegerichte selectie",
            description:
              "We onderscheiden documenterende overzichten van beelden die geschikt zijn voor portfolio, update of eindpresentatie.",
          },
          {
            title: "Praktische werfafstemming",
            description:
              "We plannen rond toegang en activiteit, in overleg met de aangewezen contactpersoon en na controle van actuele omstandigheden.",
          },
        ],
      },
      regional: {
        title: "Realisatie-dronebeelden in Limburg en omliggende regio's",
        description:
          "VisualVibe registreert projecten in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. Per werf en bezoek bekijken we locatie, luchtruim, weer, veranderende obstakels, veiligheid en praktische toestemming voordat de opname doorgaat.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Breng je volgende projectmijlpaal in kaart",
        description:
          "Deel de werflocatie, planning en gewenste gebruiksmomenten. We stellen een eenmalige reportage of een overzichtelijke voortgangsreeks voor.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "event-dronebeelden": {
    intro:
      "Met event-dronebeelden maken we schaal, locatie en publieksbeleving zichtbaar vanuit een aanvullend perspectief. Denk aan een overzicht van de opbouw, een rustige onthulling van het terrein of een gerichte beweging boven een vrije zone. Een evenement is dynamisch en vraagt daarom een zorgvuldig plan. We controleren locatie, luchtruim, weer, veiligheidszones, publieksstromen en toestemming waar nodig, in afstemming met de organisatie. Pas daarna bepalen we welke luchtbeelden op het gekozen moment verantwoord haalbaar zijn.",
    excerpt:
      "Doelgerichte luchtfoto's en videobeelden voor events, voorbereid rond programma, publieksstromen, locatie en veilige opnamemomenten.",
    process: [
      {
        title: "Programma en beeldmomenten kiezen",
        description:
          "We koppelen de gewenste shots aan concrete momenten, zoals lege opbouw, instroom, een gezamenlijke activiteit of sfeervol avondlicht. Zo blijft het luchtdeel compact en betekenisvol.",
      },
      {
        title: "Eventsite en stromen beoordelen",
        description:
          "Met terreinplan en organisatie bekijken we luchtruim, podia, kabels, tenten, bomen, noodroutes, publiekszones, startplek en praktische toestemming voor de beoogde opnames.",
      },
      {
        title: "Op locatie blijven afstemmen",
        description:
          "We melden ons bij de afgesproken contactpersoon en toetsen weer, activiteit en zones opnieuw. Alleen geplande routes die binnen de actuele veiligheidscontext passen, worden uitgevoerd.",
      },
      {
        title: "Sfeer in de montage brengen",
        description:
          "We selecteren overzicht en beweging op ritme en informatiewaarde, stemmen kleur af op de grondcamera's en verwerken beelden in de aftermovie of afgesproken losse levering.",
      },
    ],
    faqs: [
      {
        question: "Kan een drone tijdens elk evenement vliegen?",
        answer:
          "Nee. Locatie, luchtruim, publieksdichtheid, veilige afstand, obstakels, programma, weer en toestemming kunnen opnames beperken of uitsluiten. We beoordelen het plan vooraf en opnieuw op locatie. Dat is een praktische productiebeoordeling, geen juridisch advies of algemene toelating.",
      },
      {
        question: "Vliegen jullie boven het publiek?",
        answer:
          "We gaan daar nooit automatisch van uit. We ontwerpen beelden rond controleerbare zones, geschikte afstanden en momenten met minder of geen publiek waar mogelijk. Als een gewenst standpunt niet verantwoord haalbaar is, kiezen we een andere route of een camera vanaf de grond.",
      },
      {
        question: "Welke eventmomenten zijn interessant vanuit de lucht?",
        answer:
          "Dat verschilt per programma. Opbouw toont terreinlogica, instroom laat schaal zien en een gepland groepsmoment kan de energie samenvatten. We kiezen alleen momenten die visueel iets toevoegen en praktisch beheersbaar georganiseerd kunnen worden.",
      },
      {
        question: "Kunnen event-dronebeelden in de aftermovie worden verwerkt?",
        answer:
          "Ja. We stemmen vliegtempo, beeldfrequentie, kleur en gewenste overgangen af op de rest van de registratie. Wanneer VisualVibe de volledige aftermovie maakt, worden lucht- en grondbeelden vanuit één montageplan opgenomen.",
      },
      {
        question: "Wat moet de eventorganisatie vooraf aanleveren?",
        answer:
          "Een terreinplan, tijdschema, verwachte publieksbewegingen, contactpersoon en relevante locatieafspraken helpen bij de voorbereiding. Ook wijzigingen aan opstelling of programma moeten tijdig worden gedeeld, omdat ze routes en veilige zones kunnen beïnvloeden.",
      },
    ],
    relatedServices: ["eventfotografie", "event-aftermovie", "dronevideo", "social-media-video", "promovideo"],
    seo: {
      title: "Event Dronebeelden en Luchtvideo in Limburg | VisualVibe",
      description:
        "Event-dronebeelden in Limburg voor overzicht, sfeer en aftermovies. Zorgvuldig gepland rond terrein, programma, publieksstromen en veiligheid op locatie.",
      keywords: ["event dronebeelden", "dronebeelden evenement", "drone event Limburg", "luchtvideo event"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "event-dronebeelden",
        supportingKeywords: ["dronebeelden evenement", "drone event Limburg", "luchtvideo event", "dronebeelden aftermovie"],
        type: "commercial",
      },
      overview: {
        title: "Event-dronebeelden voor overzicht, sfeer en context",
        paragraphs: [
          "Een passend luchtstandpunt toont hoe terrein, podia, routing en activiteit samenkomen. Dat vult details vanaf de grond aan in een aftermovie, terugblik of promotie. Het doel blijft herkenbare sfeer, niet zoveel mogelijk hoogte.",
          "We gebruiken terreinplan en timing om relevante momenten, veilige zones en alternatieven te bepalen. Locatie, luchtruim, weer, obstakels, publieksstromen en toestemming waar nodig worden gecontroleerd. Opstelling, drukte of omstandigheden kunnen de route op de eventdag nog wijzigen.",
        ],
        highlights: [
          "Beeldmomenten gekoppeld aan het eventprogramma",
          "Praktische afstemming met één organisatiecontact",
          "Lucht- en grondcamera's vanuit hetzelfde montageplan",
        ],
      },
      outcomes: {
        title: "Wat luchtbeelden aan een eventregistratie toevoegen",
        intro:
          "De beste shots geven in korte tijd informatie over omvang, locatie en energie en versterken zo de rest van het verhaal.",
        items: [
          {
            title: "Schaal in één beeld",
            description:
              "Een zorgvuldig gekozen overzicht verbindt terreinindeling en activiteit zonder de kijker te verliezen in losse details.",
          },
          {
            title: "Sterke overgangen",
            description:
              "Een luchtbeweging kan programmaonderdelen, dagdelen of zones natuurlijk met elkaar verbinden in de aftermovie.",
          },
          {
            title: "Herbruikbare promotiecontent",
            description:
              "Foto's en geselecteerde fragmenten kunnen volgens de afgesproken formats worden ingezet voor terugblik en toekomstige communicatie.",
          },
        ],
      },
      idealFor: {
        title: "Events waar het luchtperspectief iets vertelt",
        intro:
          "Dronebeelden passen vooral bij evenementen met een ruimtelijke opbouw en voldoende mogelijkheden om opnamezones beheersbaar te plannen.",
        items: [
          {
            title: "Bedrijfsevenementen",
            description:
              "Toon locatie, ontvangst en een gepland gezamenlijk moment als onderdeel van een verzorgde interne of externe terugblik.",
          },
          {
            title: "Publieke buitenactiviteiten",
            description:
              "Breng terrein en programma in samenhang, voor zover publieksstromen, luchtruim en veilige routes dat toelaten.",
          },
          {
            title: "Sportieve evenementen",
            description:
              "Situeer parcours, startzone of overzichtelijke actiepunten binnen een vooraf afgestemd en controleerbaar opnameplan.",
          },
        ],
      },
      deliverables: {
        title: "Mogelijke levering voor event-dronebeelden",
        intro:
          "We stemmen output af op je communicatietiming, van een volledige aftermovie tot een gecureerde luchtselectie voor een ander productieteam.",
        items: [
          {
            title: "Afgewerkte luchtfoto's",
            description:
              "Een relevante selectie van terrein, sfeer en geplande eventmomenten met natuurlijke kleur- en contrastafwerking.",
          },
          {
            title: "Geselecteerde videofragmenten",
            description:
              "Stabiele shots met voldoende montageruimte, technisch afgestemd op de overeengekomen eventproductie.",
          },
          {
            title: "Geïntegreerde aftermovie",
            description:
              "Luchtbeelden gemonteerd tussen details, reacties en actie vanaf de grond wanneer de volledige film deel is van de opdracht.",
          },
          {
            title: "Korte kanaalversie",
            description:
              "Een afgesproken teaser of uitsnede voor sociale communicatie, opgebouwd vanuit vooraf geschikte kadreringen.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van event-dronebeelden?",
        paragraphs: [
          "De scope hangt af van programma, duur, terrein en output. Enkele luchtmomenten binnen een eventregistratie verschillen van een aparte ploeg voor foto, video en sociale content. Publieksdrukte beïnvloedt de voorbereiding.",
          "We maken een voorstel nadat terreinplan, timing en gebruiksdoel duidelijk zijn. De planning vermeldt welke beelden prioriteit krijgen en welke fallback mogelijk is. Definitieve uitvoering blijft afhankelijk van controles rond locatie, luchtruim, weer, veiligheid, publieksstromen en toestemming waar nodig. Daardoor blijft de offerte concreet zonder een vlucht onder alle omstandigheden te suggereren.",
        ],
        factors: [
          "Omvang en indeling van het evenemententerrein",
          "Aantal gekozen programma- en vliegmomenten",
          "Verwachte publieksstromen en beheersbare zones",
          "Afstemming met organisatie, locatie en andere productieploegen",
          "Foto, losse videobeelden of volledige aftermovie",
          "Duur van de eventregistratie",
        ],
      },
      whyVisualVibe: {
        title: "Waarom event-dronebeelden via VisualVibe",
        intro:
          "We verbinden eventregie, visuele storytelling en locatiegebonden vluchtvoorbereiding in één overzichtelijk productieplan.",
        items: [
          {
            title: "Selectieve beeldmomenten",
            description:
              "We plannen rond momenten met echte verhaalwaarde in plaats van voortdurend luchtbeelden te verzamelen.",
          },
          {
            title: "Samenhangende registratie",
            description:
              "Drone, grondcamera en fotografie vullen elkaar aan in ritme, kleur en inhoud, met minder dubbel werk op locatie.",
          },
          {
            title: "Afstemming met de organisatie",
            description:
              "Een duidelijke contactlijn en actuele terreininfo helpen routes en timing aan te passen wanneer de eventcontext verandert.",
          },
        ],
      },
      regional: {
        title: "Event-dronebeelden in Limburg en omliggende regio's",
        description:
          "VisualVibe plant event-dronebeelden in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. Voor elke eventsite stemmen we terrein, programma, luchtruim, weer, publieksstromen, veiligheid en praktische toestemming afzonderlijk af.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Plan de luchtmomenten van je event",
        description:
          "Deel je terreinplan, programma, publieksinschatting en gewenste output. We selecteren relevante beeldmomenten en werken een haalbaar productievoorstel uit.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
} satisfies Record<DroneEditorialSlug, SubserviceEditorial>;
