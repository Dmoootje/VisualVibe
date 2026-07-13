import type { SubserviceEditorial } from "@/types";

type PodcastingEditorialSlug =
  | "bedrijfspodcast"
  | "videopodcast"
  | "podcast-opname"
  | "podcast-traject"
  | "podcast-voor-experts";

export const podcastingEditorial = {
  bedrijfspodcast: {
    intro:
      "Een bedrijfspodcast geeft je KMO een format om kennis en gesprekken met medewerkers of gasten te delen. VisualVibe helpt de bedrijfspodcast afbakenen en verzorgt afgesproken opname en montage. We bepalen voor wie je spreekt en waarom een luisteraar terugkomt.",
    excerpt:
      "Een herkenbare audioreeks voor je bedrijf, met een werkbaar format, professionele opname en montage die inhoud en merkstem ondersteunt.",
    process: [
      {
        title: "Doelgroep en redactionele lijn",
        description:
          "We bepalen luisteraar, doel, thema's en beschikbare interne kennis. Daaruit volgt een format dat je team ook voor volgende afleveringen kan voorbereiden.",
      },
      {
        title: "Aflevering en gasten voorbereiden",
        description:
          "We maken een draaiboek met onderwerp, vragen, timing, rollen en praktische afspraken, zonder het gesprek woord voor woord vast te zetten.",
      },
      {
        title: "Audio professioneel opnemen",
        description:
          "Op locatie of in een passende opstelling bewaken we microfoonplaatsing, niveaus en een rustige gespreksomgeving, zodat sprekers zich op inhoud richten.",
      },
      {
        title: "Monteren, reviseren en opleveren",
        description:
          "We schonen audio op, structureren het gesprek en verwerken de afgesproken intro of muziek. Na de voorziene feedback leveren we bestanden in overeengekomen formaten.",
      },
    ],
    faqs: [
      {
        question: "Wat maakt een podcast een bedrijfspodcast?",
        answer:
          "De afzender, onderwerpen en doelen sluiten aan bij een onderneming. Dat kan een interviewreeks met vakexperts zijn, een intern gesprek over ontwikkelingen of een programma voor klanten. Het format moet zelfstandig interessant blijven en niet aanvoelen als een lange reclamespot.",
      },
      {
        question: "Moet een bedrijfspodcast uit meerdere afleveringen bestaan?",
        answer:
          "Niet noodzakelijk, maar de naam podcast suggereert vaak een herhaalbaar format. Een beperkte reeks rond één thema kan even zinvol zijn. We toetsen vooraf of je voldoende relevante onderwerpen, gasten en interne tijd hebt om de gekozen frequentie inhoudelijk vol te houden.",
      },
      {
        question: "Nemen jullie de podcast op locatie op?",
        answer:
          "Dat kan wanneer de ruimte akoestisch en praktisch geschikt is. We beoordelen achtergrondgeluid, galm, stroom, opstelling en bereikbaarheid. Een rustige studio-achtige omgeving biedt meer controle; een bedrijfslocatie kan dan weer nuttige sfeer en gemak bieden.",
      },
      {
        question: "Kunnen we onze bedrijfspodcast ook filmen?",
        answer:
          "Ja, dan wordt het een videopodcastproductie met extra aandacht voor licht, decor, camerastandpunten en visuele montage. Die scope verschilt van een audiopodcast. We bepalen vooraf of volledige video of alleen enkele ondersteunende clips je kanalen werkelijk helpt.",
      },
      {
        question: "Publiceert VisualVibe de afleveringen op podcastplatformen?",
        answer:
          "Publicatie en hosting zijn niet automatisch inbegrepen. We kunnen bestanden publicatieklaar aanleveren of distributie opnemen wanneer toegang, accounts, hostingkeuze en verantwoordelijkheden in de offerte staan. Externe kosten blijven zichtbaar.",
      },
    ],
    relatedServices: [
      "podcast-traject",
      "podcast-opname",
      "videopodcast",
      "podcast-voor-experts",
      "brandingfotografie",
    ],
    seo: {
      title: "Bedrijfspodcast laten maken in Limburg | VisualVibe",
      description:
        "Een bedrijfspodcast laten maken voor je KMO? VisualVibe helpt met format, voorbereiding, professionele audio-opname, montage en heldere oplevering.",
      keywords: [
        "bedrijfspodcast",
        "bedrijfspodcast laten maken",
        "podcast voor bedrijven",
        "zakelijke podcast",
        "bedrijfspodcast Limburg",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "bedrijfspodcast",
        supportingKeywords: [
          "bedrijfspodcast laten maken",
          "podcast voor bedrijven",
          "zakelijke podcast",
          "bedrijfspodcast Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "Een bedrijfspodcast met een houdbaar inhoudelijk format",
        paragraphs: [
          "Een goede reeks begint bij een luisterbelofte. We verzamelen vragen van klanten, medewerkers of partners en bepalen wie daar geloofwaardig over spreekt. Daarna kiezen we een geleid interview, gesprek met vaste stemmen of themareeks. Lengte en frequentie volgen uit inhoud en beschikbare voorbereiding.",
          "Audio vraagt helderheid in stem, structuur en geluidskwaliteit. We bereiden openingen en afsluitingen voor en verwijderen in montage wat het gesprek hindert. De aflevering wordt volgens scope geleverd; hosting, kanaalbeheer en publicatie worden afzonderlijk afgesproken.",
        ],
        highlights: [
          "Format vanuit doelgroep en beschikbare expertise",
          "Draaiboek dat richting geeft zonder voor te lezen",
          "Heldere spraak en inhoudelijke audiomontage",
          "Publicatiebestanden en kanaalkeuzes duidelijk afgebakend",
        ],
      },
      outcomes: {
        title: "Wat een doordachte bedrijfspodcast oplevert",
        intro:
          "Je krijgt een herhaalbare manier om complexe kennis in een menselijk gesprek te delen.",
        items: [
          {
            title: "Herkenbare redactionele lijn",
            description:
              "Afleveringen behandelen verschillende onderwerpen binnen één duidelijk kader voor dezelfde beoogde luisteraar.",
          },
          {
            title: "Bruikbare lange vorm",
            description:
              "Experts krijgen ruimte voor uitleg en nuance die in een korte advertentie of sociale post moeilijk past.",
          },
          {
            title: "Efficiëntere opnamevoorbereiding",
            description:
              "Een vast format, rollen en draaiboeksjabloon maken volgende gesprekken voorspelbaarder voor je interne team.",
          },
        ],
      },
      idealFor: {
        title: "Voor welke organisaties past een bedrijfspodcast?",
        intro:
          "Het medium werkt wanneer er echte kennis, verhalen of gesprekspartners beschikbaar zijn en je doelgroep graag luistert.",
        items: [
          {
            title: "Kennisgedreven KMO's",
            description:
              "Je medewerkers kunnen klantvragen, vakontwikkelingen en keuzes toelichten zonder vertrouwelijke informatie te delen.",
          },
          {
            title: "Werkgevers met interne verhalen",
            description:
              "Teams, functies en bedrijfscultuur kunnen via gesprekken een genuanceerde stem krijgen voor relevante doelgroepen.",
          },
          {
            title: "Organisaties met een partnernetwerk",
            description:
              "Gasten brengen aanvullende perspectieven en maken van de reeks meer dan een eenzijdige bedrijfspresentatie.",
          },
        ],
      },
      deliverables: {
        title: "Wat kan een bedrijfspodcastproductie omvatten?",
        intro:
          "De offerte benoemt per aflevering of reeks welke redactionele, technische en publicatieonderdelen zijn voorzien.",
        items: [
          {
            title: "Format- en afleveringskader",
            description:
              "Doelgroep, thema's, rollen, lengte en herhaalbare opbouw worden praktisch vastgelegd.",
          },
          {
            title: "Draaiboek en opnameplanning",
            description:
              "Vragen, timing, gasten, locatie en technische benodigdheden komen samen in één voorbereiding.",
          },
          {
            title: "Meersporige audio-opname",
            description:
              "Sprekers worden afzonderlijk opgenomen waar de opstelling dat toelaat, met controle van niveaus en omgeving.",
          },
          {
            title: "Montage en audiobestanden",
            description:
              "De afgesproken edit, revisie en exports worden geleverd in formaten die aansluiten op het gekozen vervolg.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de investering in een bedrijfspodcast?",
        paragraphs: [
          "De scope hangt af van afleveringen, lengte, stemmen en redactionele begeleiding. Een reeks met gastenplanning en uitgebreide montage vraagt meer voorbereiding dan één gesprek met een vast format.",
          "Ook locatie, muziek, aanvullende video en publicatieondersteuning beïnvloeden het werk. Na de intake ontvang je een offerte met heldere afleveringsonderdelen. Hosting, betaalde muzieklicenties en externe platformkosten worden alleen opgenomen wanneer dat expliciet is afgesproken.",
        ],
        factors: [
          "Aantal en beoogde lengte van afleveringen",
          "Formatontwikkeling en redactionele voorbereiding",
          "Aantal sprekers en gastenplanning",
          "Studio-opstelling of opname op locatie",
          "Montagediepte en aantal revisierondes",
          "Intro, muziek en aanvullende audiovormgeving",
          "Video, clips of fotografie als uitbreiding",
          "Publicatieondersteuning en platformkeuze",
        ],
      },
      whyVisualVibe: {
        title: "Waarom een bedrijfspodcast met VisualVibe?",
        intro:
          "We verbinden redactionele keuzes met productie, zodat techniek het gesprek ondersteunt in plaats van domineert.",
        items: [
          {
            title: "Format vóór apparatuur",
            description:
              "We bepalen eerst wie wil luisteren en waarom, voordat microfoons en opnamelocatie worden gekozen.",
          },
          {
            title: "Audio en video onder één dak",
            description:
              "Wanneer beeld zinvol is, kan dezelfde voorbereiding worden vertaald naar een volwaardige videopodcastscope.",
          },
          {
            title: "Duidelijke oplevergrens",
            description:
              "Bestanden, revisie, hosting en publicatietaken worden vooraf benoemd, zodat verantwoordelijkheden na montage helder blijven.",
          },
        ],
      },
      regional: {
        title: "Bedrijfspodcast opnemen vanuit Limburg",
        description:
          "VisualVibe produceert bedrijfspodcasts voor KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, in een geschikte opstelling of op een vooraf beoordeelde locatie.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Toets je idee voor een bedrijfspodcast",
        description:
          "Deel je doelgroep, thema's en gewenste reeks. We adviseren over format, opnamevorm en oplevering en maken een afgebakende offerte.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  videopodcast: {
    intro:
      "Een videopodcast voegt camerabeeld toe aan een inhoudelijk podcastgesprek. VisualVibe stemt decor, licht, microfoons en camerastandpunten af zodat de videopodcast als volledige aflevering én als audioversie bruikbaar is. Korte fragmenten kunnen als aparte uitbreiding worden gemonteerd, maar de productie vertrekt eerst vanuit een goed gesprek, niet vanuit willekeurige sociale clips.",
    excerpt:
      "Een professioneel opgenomen videopodcast met verstaanbaar geluid, consistente camerabeelden en exports voor de afgesproken kijk- en luisterkanalen.",
    process: [
      {
        title: "Format en beeldopstelling bepalen",
        description:
          "We bespreken gesprek, aantal deelnemers, locatie, decor en gewenste eindformaten en vertalen dat naar een haalbaar camera- en lichtplan.",
      },
      {
        title: "Gesprek en set voorbereiden",
        description:
          "Draaiboek, zitplaatsen, microfoons, branding en praktische timing worden vóór de opnamedag afgestemd met host en gasten.",
      },
      {
        title: "Audio en multicamera opnemen",
        description:
          "We registreren stemmen en camerastandpunten synchroon en bewaken tijdens het gesprek techniek, continuïteit en een natuurlijke presentatie.",
      },
      {
        title: "Video monteren en versies leveren",
        description:
          "We selecteren camerawissels, verzorgen klank en beeld en verwerken afgesproken vormgeving. Na revisie leveren we de vastgelegde volledige en korte versies.",
      },
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen een videopodcast en podcastvideo?",
        answer:
          "Een videopodcast is doorgaans een terugkerend gesprek dat tegelijk voor kijken en luisteren wordt geproduceerd. Podcastvideo kan breder slaan op een losse video-opname van een podcast. In beide gevallen bepalen we vooraf of audio ook zelfstandig begrijpelijk moet blijven.",
      },
      {
        question: "Hoeveel camera's zijn nodig voor een videopodcast?",
        answer:
          "Dat hangt af van deelnemers, ruimte en gewenste montage. Een totaalbeeld en afzonderlijke standpunten geven meer editmogelijkheden, maar vragen extra techniek en dataverwerking. We kiezen alleen camerahoeken die het gesprek duidelijker en visueel rustiger maken.",
      },
      {
        question: "Kan een videopodcast op ons kantoor worden opgenomen?",
        answer:
          "Ja, wanneer ruimte, geluid, licht en stroomvoorziening geschikt zijn. We beoordelen galm, achtergrondgeluid, plaats voor camera's en wat zichtbaar mag zijn. Soms volstaan kleine aanpassingen; soms biedt een gecontroleerde locatie een beter resultaat.",
      },
      {
        question: "Zijn korte clips voor sociale media inbegrepen?",
        answer:
          "Alleen wanneer aantal, lengte, beeldverhouding en ondertiteling in de scope staan. Clips vragen inhoudelijke selectie en een eigen montage. We spreken ook af wie teksten, publicatie en kanaalbeheer verzorgt; uploaden is niet automatisch onderdeel van de opname.",
      },
      {
        question: "Ontvang ik ook een aparte audioversie?",
        answer:
          "Dat kan worden voorzien. We controleren dan of visuele verwijzingen voor luisteraars begrijpelijk blijven en maken een passende audiomix en export. Podcasthosting, feedbeheer en distributie naar platformen worden alleen uitgevoerd wanneer ze afzonderlijk zijn afgesproken.",
      },
    ],
    relatedServices: [
      "podcast-video",
      "podcast-opname",
      "bedrijfspodcast",
      "social-media-video",
      "brandingfotografie",
    ],
    seo: {
      title: "Videopodcast laten opnemen in Limburg | VisualVibe",
      description:
        "Een videopodcast laten opnemen? VisualVibe verzorgt voorbereiding, multicamera, helder geluid, montage en afgesproken versies voor je zakelijke kanalen.",
      keywords: [
        "videopodcast",
        "videopodcast laten opnemen",
        "podcast met video",
        "multicamera podcast",
        "videopodcast Limburg",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "videopodcast",
        supportingKeywords: [
          "videopodcast laten opnemen",
          "podcast met video",
          "multicamera podcast",
          "videopodcast Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "Een videopodcast die ook zonder beeld blijft werken",
        paragraphs: [
          "Bij een videopodcast dragen gezichtsuitdrukking, setting en interactie extra betekenis. Toch moet het gesprek inhoudelijk sterk genoeg zijn om als audio te volgen. We bereiden daarom onderwerp en rollen eerst voor en ontwerpen daarna de set. Camerastandpunten, licht en branding blijven rustig, zodat kijkers aandacht houden voor de sprekers.",
          "Tijdens de montage wisselen we beelden op basis van wie spreekt en wat het gesprek nodig heeft. Geluid krijgt dezelfde prioriteit als video. De volledige aflevering kan worden aangevuld met afgesproken horizontale of verticale fragmenten. Welke platformexports, ondertiteling, thumbnails of uploads nodig zijn, wordt vooraf gekozen en niet als vanzelfsprekend verondersteld.",
        ],
        highlights: [
          "Gespreksformat vóór de visuele set",
          "Synchrone audio- en multicameraregistratie",
          "Montage voor volledige aflevering en gekozen clips",
          "Kanaalformaten en publicatietaken vooraf vastgelegd",
        ],
      },
      outcomes: {
        title: "Wat een professionele videopodcast oplevert",
        intro:
          "Eén gesprek kan in afgesproken versies worden bekeken, beluisterd en inhoudelijk hergebruikt.",
        items: [
          {
            title: "Meer non-verbale context",
            description:
              "Blik, houding en interactie maken een interview persoonlijker zonder de inhoud te vervangen.",
          },
          {
            title: "Consistente reeksuitstraling",
            description:
              "Terugkerende kadrering, kleur en vormgeving maken afleveringen herkenbaar als hetzelfde programma.",
          },
          {
            title: "Gericht hergebruik",
            description:
              "Vooraf gekozen fragmenttypes halen kernmomenten uit het gesprek zonder de volledige aflevering willekeurig op te knippen.",
          },
        ],
      },
      idealFor: {
        title: "Wanneer past een videopodcast?",
        intro:
          "Video is zinvol wanneer gezichten, demonstratie of merkbeleving waarde toevoegen en je team de extra productie kan dragen.",
        items: [
          {
            title: "Gesprekken met herkenbare experts",
            description:
              "Host en gasten mogen zichtbaar zijn en bouwen via een terugkerend gesprek aan een herkenbare presentatie.",
          },
          {
            title: "KMO's met video als belangrijk kanaal",
            description:
              "Je publicatieplan heeft werkelijk plaats voor langere afleveringen en geselecteerde korte videofragmenten.",
          },
          {
            title: "Onderwerpen met visuele uitleg",
            description:
              "Product, schema of demonstratie helpt de kijker, terwijl de kern ook mondeling wordt toegelicht.",
          },
        ],
      },
      deliverables: {
        title: "Wat kan bij een videopodcast inbegrepen zijn?",
        intro:
          "We specificeren per productie welke volledige aflevering, audio-export en aanvullende clips je ontvangt.",
        items: [
          {
            title: "Visueel en technisch opnameplan",
            description:
              "Locatie, decor, branding, camera's, licht, geluid en eindformaten worden op elkaar afgestemd.",
          },
          {
            title: "Multicamera- en audio-opname",
            description:
              "De afgesproken standpunten en afzonderlijke microfoons worden synchroon geregistreerd.",
          },
          {
            title: "Volledige videomontage",
            description:
              "Cameraselectie, klank, kleur en basisvormgeving vormen één afgewerkte aflevering met revisie.",
          },
          {
            title: "Afgesproken exports en clips",
            description:
              "Bestanden worden geleverd in vooraf bepaalde beeldverhoudingen, lengtes en technische formaten.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de investering in een videopodcast?",
        paragraphs: [
          "Het aantal camera's, deelnemers en afleveringen bepaalt een groot deel van opname en montage. Ook locatie, setbouw, licht, grafische vormgeving en gewenste audioversie beïnvloeden de technische voorbereiding.",
          "Korte clips, ondertiteling en verschillende kanaalexports zijn afzonderlijke productietaken. Na de briefing ontvang je een offerte met aantallen en revisieafspraken. Hosting, betaalde platformdiensten en publicatie worden alleen begroot wanneer ze deel zijn van de vraag.",
        ],
        factors: [
          "Aantal afleveringen, sprekers en camera's",
          "Opnamelocatie, decor en lichtopstelling",
          "Lengte en diepte van de volledige montage",
          "Grafische intro, titels en merkassets",
          "Aparte audiomix en podcastexport",
          "Aantal clips en beeldverhoudingen",
          "Ondertiteling en revisierondes",
          "Publicatie- of kanaalondersteuning",
        ],
      },
      whyVisualVibe: {
        title: "Waarom een videopodcast met VisualVibe?",
        intro:
          "Video-, audio- en contentkeuzes worden in één productieplan samengebracht.",
        items: [
          {
            title: "Geluid blijft volwaardig",
            description:
              "Microfoons en audiomontage krijgen prioriteit, ook wanneer de aflevering visueel uitgebreid wordt opgenomen.",
          },
          {
            title: "Beeld met een functie",
            description:
              "Camera's en decor ondersteunen sprekers en merk, zonder onnodige hoeken of beweging toe te voegen.",
          },
          {
            title: "Hergebruik vooraf gepland",
            description:
              "Clips en formaten worden vóór opname gekozen, zodat presentatie en kadrering bij de eindkanalen passen.",
          },
        ],
      },
      regional: {
        title: "Videopodcast opnemen vanuit Limburg",
        description:
          "VisualVibe maakt videopodcasts voor bedrijven in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, op een passende productielocatie of een vooraf gecontroleerde bedrijfssite.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Plan je videopodcast als één productie",
        description:
          "Vertel ons over format, deelnemers, locatie en gewenste afleverings- of clipformaten. We maken een concrete opname- en montagescope.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "podcast-opname": {
    intro:
      "Een podcast-opname is geschikt wanneer format, host en onderwerp al vastliggen, maar je professionele techniek en technische begeleiding nodig hebt. VisualVibe verzorgt de afgesproken audio-opstelling, registratie en montage voor één aflevering of opnamedag. Jij bewaakt de redactionele inhoud; wij zorgen dat stemmen verstaanbaar en bestanden correct opgenomen worden.",
    excerpt:
      "Een afgebakende podcast-opname voor een voorbereid gesprek, met professionele microfoons, technische begeleiding en afgesproken audiomontage.",
    process: [
      {
        title: "Technische intake",
        description:
          "We controleren aantal sprekers, duur, locatie, bestaand format en gewenste bestanden en benoemen welke redactionele voorbereiding bij jou ligt.",
      },
      {
        title: "Opstelling en soundcheck",
        description:
          "Microfoons, hoofdtelefoons en opnamekanalen worden ingericht. Voor start testen we stemmen, achtergrondgeluid en praktische zitpositie.",
      },
      {
        title: "Gesprek registreren",
        description:
          "Tijdens de opname bewaken we niveaus en techniek en markeren we eventuele hernemingen, terwijl host en gast het gesprek voeren.",
      },
      {
        title: "Audio afwerken en leveren",
        description:
          "We voeren de afgesproken basis- of inhoudelijke montage uit, verwerken feedback en leveren de overeengekomen master- en publicatiebestanden.",
      },
    ],
    faqs: [
      {
        question: "Wat moet ik voorbereiden voor een podcast-opname?",
        answer:
          "Zorg voor een duidelijk onderwerp, host, gastinformatie en een werkbaar vragenplan. Deel namen, uitspraak, gewenste duur en eventuele vaste intro tijdig. Bij een losse opname verwachten we dat inhoud en gastenplanning grotendeels rond zijn, tenzij redactionele hulp apart is afgesproken.",
      },
      {
        question: "Kan de opname bij mijn bedrijf plaatsvinden?",
        answer:
          "Dat kan na een praktische beoordeling. Een stille ruimte met weinig galm, voldoende plaats en beperkte onderbrekingen is belangrijk. Airco, verkeer en harde oppervlakken zijn vaak hoorbaar. We adviseren of aanpassingen volstaan of een andere locatie verstandiger is.",
      },
      {
        question: "Krijg ik de ruwe audiobestanden?",
        answer:
          "Dat spreken we vooraf af. Ruwe sporen vragen kennis en software om goed te verwerken en zijn niet hetzelfde als een bruikbare aflevering. De standaardoplevering volgt de offerte, bijvoorbeeld een gemonteerde master, publicatie-export of aanvullend archiefmateriaal.",
      },
      {
        question: "Wat houdt basismontage van een podcast in?",
        answer:
          "Basismontage omvat doorgaans technische opschoning, niveaubalans en het verwijderen van duidelijk afgesproken onderbrekingen. Een sterke inhoudelijke inkorting, verhaalmontage, muziekselectie of veel correctierondes vraagt meer editwerk en wordt daarom apart omschreven.",
      },
      {
        question: "Kunnen jullie de aflevering meteen publiceren?",
        answer:
          "Publicatie is geen standaardonderdeel van een losse opname. We kunnen correcte audio en metadata-aanwijzingen leveren. Upload, hostingaccount, feedinstellingen en distributie kunnen worden toegevoegd wanneer toegang en verantwoordelijkheid vooraf duidelijk zijn vastgelegd.",
      },
    ],
    relatedServices: ["bedrijfspodcast", "videopodcast", "podcast-traject", "podcast-video"],
    seo: {
      title: "Podcast-opname voor bedrijven in Limburg | VisualVibe",
      description:
        "Een podcast-opname met professioneel geluid nodig? VisualVibe verzorgt soundcheck, technische registratie, afgesproken montage en correcte audiobestanden.",
      keywords: [
        "podcast-opname",
        "podcast opnemen Limburg",
        "professionele podcast opname",
        "podcast audio opnemen",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "podcast-opname",
        supportingKeywords: [
          "podcast opnemen Limburg",
          "professionele podcast opname",
          "podcast audio opnemen",
          "podcast opname op locatie",
        ],
        type: "commercial",
      },
      overview: {
        title: "Een podcast-opname voor een gesprek dat al voorbereid is",
        paragraphs: [
          "Bij deze dienst ligt de nadruk op de opnamedag en technische afwerking. We hoeven niet eerst een volledige reeksidentiteit of publicatieplan te ontwikkelen. Wel vragen we tijdig hoeveel mensen spreken, hoe de aflevering verloopt en welk eindbestand je nodig hebt. Zo voorzien we de juiste microfoons, sporen en tijd voor soundcheck en hernemingen.",
          "Een goede registratie begint bij de ruimte. We beperken storende bronnen en plaatsen sprekers zo dat ze natuurlijk kunnen praten zonder voortdurend microfoontechniek te bewaken. Na afloop volgt de montage die in de scope staat. We leveren niet automatisch alle mogelijke versies of publiceren ze niet vanzelf op externe platformen.",
        ],
        highlights: [
          "Duidelijke grens tussen inhoud en technische productie",
          "Soundcheck en afzonderlijke opnamekanalen waar passend",
          "Basis- of inhoudelijke montage vooraf gekozen",
          "Bestandsformaten en publicatietaken expliciet afgesproken",
        ],
      },
      outcomes: {
        title: "Wat een begeleide podcast-opname oplevert",
        intro:
          "Je kan je concentreren op het gesprek terwijl opnamekwaliteit en technische continuïteit worden bewaakt.",
        items: [
          {
            title: "Verstaanbare afzonderlijke stemmen",
            description:
              "Microfoonkeuze en plaatsing worden aangepast aan sprekers, ruimte en gesprekssituatie.",
          },
          {
            title: "Minder technische afleiding",
            description:
              "Een operator volgt niveaus en opname op, zodat de host niet tegelijk apparatuur moet bedienen.",
          },
          {
            title: "Voorspelbare oplevering",
            description:
              "Montagediepte, revisie en bestandsformaten zijn vóór de opname vastgelegd.",
          },
        ],
      },
      idealFor: {
        title: "Wanneer kies je voor een losse podcast-opname?",
        intro:
          "De dienst past wanneer de redactionele formule al werkt en je vooral professionele productiecapaciteit zoekt.",
        items: [
          {
            title: "Bestaande podcasthosts",
            description:
              "Je kent format en workflow, maar wil voor een aflevering betere opname of ontzorging van techniek.",
          },
          {
            title: "Eenmalige expertgesprekken",
            description:
              "Eén inhoudelijk interview moet zorgvuldig worden geregistreerd zonder een volledige reeks op te zetten.",
          },
          {
            title: "Teams met eigen publicatiebeheer",
            description:
              "Je organisatie beheert hosting en kanalen zelf en heeft vooral afgewerkte audiobestanden nodig.",
          },
        ],
      },
      deliverables: {
        title: "Wat kan in de podcast-opname inbegrepen zijn?",
        intro:
          "De technische en montageonderdelen worden gekozen volgens je bestaande workflow en gewenste eindbestand.",
        items: [
          {
            title: "Opnamechecklist",
            description:
              "Sprekers, locatie, duur, rollen, apparatuur en aan te leveren assets worden vooraf bevestigd.",
          },
          {
            title: "Technische audio-opstelling",
            description:
              "We voorzien afgesproken microfoons, monitoring en registratie voor de geplande gesprekssituatie.",
          },
          {
            title: "Begeleide registratie",
            description:
              "Niveaus en technische continuïteit worden tijdens de sessie actief opgevolgd.",
          },
          {
            title: "Montage en exports",
            description:
              "Je ontvangt de voorziene edit en audiobestanden na de afgesproken feedbackronde.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een podcast-opname?",
        paragraphs: [
          "Duur, aantal sprekers en locatie bepalen de opnameopstelling. Extra voorbereiding is nodig bij veel gasten, meerdere ruimtes, remote deelnemers of een locatie met moeilijke akoestiek.",
          "Montagediepte en oplevering tellen eveneens mee. Een technische basisafwerking verschilt van een sterk ingekorte aflevering met muziek en meerdere versies. De offerte vermeldt opnameduur, edit, revisie en bestanden zonder verborgen publicatietaken.",
        ],
        factors: [
          "Opnameduur en aantal afleveringen",
          "Aantal sprekers en opnamekanalen",
          "Locatie en akoestische omstandigheden",
          "Technische basis- of inhoudelijke montage",
          "Intro, outro, muziek en aangeleverde assets",
          "Aantal revisierondes",
          "Gewenste masters en exportformaten",
          "Eventuele video- of publicatie-uitbreiding",
        ],
      },
      whyVisualVibe: {
        title: "Waarom je podcast-opname bij VisualVibe plannen?",
        intro:
          "We houden de losse productiedienst praktisch en maken duidelijk welk voorbereidend werk al van jou verwacht wordt.",
        items: [
          {
            title: "Focus op het gesprek",
            description:
              "Host en gasten hoeven tijdens de sessie geen niveaus of opnameapparatuur te bewaken.",
          },
          {
            title: "Montage naar behoefte",
            description:
              "Je kiest vooraf tussen technische opschoning en een diepere inhoudelijke edit.",
          },
          {
            title: "Geen onduidelijke distributiebelofte",
            description:
              "Audiofiles, hosting en publicatie zijn afzonderlijke verantwoordelijkheden die zichtbaar in de scope staan.",
          },
        ],
      },
      regional: {
        title: "Podcast-opname op locatie vanuit Limburg",
        description:
          "VisualVibe verzorgt podcast-opnames voor bedrijven in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, afhankelijk van locatie, akoestiek en technische haalbaarheid.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Reserveer techniek voor je voorbereide gesprek",
        description:
          "Bezorg datum, locatie, aantal sprekers, duur en gewenste edit. We maken een heldere scope voor opname, montage en bestanden.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "podcast-traject": {
    intro:
      "Een podcast-traject begeleidt je organisatie van een eerste idee naar een werkbare reeks afleveringen. VisualVibe helpt met positionering, format, redactionele planning, opname en montage. Publicatie, hosting en promotionele content worden alleen toegevoegd wanneer ze in het traject zijn afgebakend. Zo weet je team per fase welke beslissingen, gasten en input nodig zijn.",
    excerpt:
      "Een begeleid podcast-traject waarin concept, afleveringsplanning, productie, revisie en gekozen distributietaken op elkaar aansluiten.",
    process: [
      {
        title: "Concept en haalbaarheid",
        description:
          "We leggen doelgroep, doel, thema's, host, vorm en interne capaciteit vast en toetsen of een reeks voldoende relevante inhoud kan dragen.",
      },
      {
        title: "Redactie en productieplanning",
        description:
          "Afleveringen, gasten, draaiboeken, opnamedagen en goedkeuringen komen in een planning die bij de beschikbaarheid van je team past.",
      },
      {
        title: "Opnames en montage",
        description:
          "We begeleiden sprekers technisch, registreren audio of afgesproken video en monteren elke aflevering volgens de vaste reeksstijl.",
      },
      {
        title: "Revisie, oplevering en evaluatie",
        description:
          "Na inhoudelijke feedback leveren we de gekozen bestanden en evalueren we workflow en volgende thema's. Publicatiestappen volgen alleen uit de overeengekomen scope.",
      },
    ],
    faqs: [
      {
        question: "Wat is inbegrepen in een podcast-traject?",
        answer:
          "Een traject kan formatontwikkeling, redactionele planning, draaiboeken, opname, montage en oplevering omvatten. De precieze combinatie hangt af van wat je team zelf doet. Gastenwerving, videoclips, hosting en publicatie zijn alleen inbegrepen wanneer ze expliciet worden benoemd.",
      },
      {
        question: "Hoeveel afleveringen moet een eerste traject hebben?",
        answer:
          "Er is geen verplicht aantal. We kijken naar beschikbare thema's, gasten, budget en interne tijd. Een afgebakende eerste reeks kan helpen het format en de workflow te evalueren voordat je een langere publicatieplanning vastlegt.",
      },
      {
        question: "Helpen jullie een host en gasten voorbereiden?",
        answer:
          "Ja, binnen de redactionele scope. We maken een gespreksoverzicht, bespreken rolverdeling en geven praktische opname-instructies. Je organisatie blijft verantwoordelijk voor inhoudelijke juistheid, toestemming, bereikbaarheid en afspraken met gasten tenzij anders overeengekomen.",
      },
      {
        question: "Kan een podcast-traject audio en video combineren?",
        answer:
          "Dat kan, maar video vergroot de productie met camera's, licht, set, beeldmontage en extra exports. We kiezen aan het begin of video structureel deel is van de reeks. Later toevoegen kan gevolgen hebben voor locatie, planning en vormgeving.",
      },
      {
        question: "Beheren jullie ook hosting en publicatie?",
        answer:
          "Niet standaard. We kunnen adviseren over platformkeuze, publicatiebestanden aanleveren of beheer uitvoeren als accounts, toegang en verantwoordelijkheden in de offerte staan. Je bedrijf blijft eigenaar van de gekozen accounts en houdt zicht op externe voorwaarden en kosten.",
      },
    ],
    relatedServices: [
      "bedrijfspodcast",
      "podcast-opname",
      "videopodcast",
      "podcast-voor-experts",
      "seo-copywriting",
    ],
    seo: {
      title: "Podcast-traject van concept tot montage | VisualVibe",
      description:
        "Een podcast-traject starten? VisualVibe begeleidt format, redactie, planning, opname, montage en afgesproken oplevering voor een werkbare zakelijke reeks.",
      keywords: [
        "podcast-traject",
        "podcast traject bedrijf",
        "podcast opzetten",
        "podcast begeleiding",
        "zakelijke podcastproductie",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "podcast-traject",
        supportingKeywords: [
          "podcast traject bedrijf",
          "podcast opzetten",
          "podcast begeleiding",
          "zakelijke podcastproductie",
        ],
        type: "commercial",
      },
      overview: {
        title: "Een podcast-traject met redactie en productie in één ritme",
        paragraphs: [
          "Een reeks vraagt meer dan een goede eerste opname. Onderwerpen moeten bij dezelfde luisteraar passen, gasten moeten tijdig voorbereid zijn en je team moet feedback kunnen geven zonder elke aflevering opnieuw uit te vinden. We ontwikkelen daarom een formatdocument en redactionele kalender die keuzes vastleggen, maar voldoende ruimte laten voor natuurlijke gesprekken.",
          "Productie wordt vervolgens rond die planning georganiseerd. Afleveringen kunnen afzonderlijk of efficiënt in blokken worden opgenomen wanneer sprekers en inhoud dat toelaten. Montage, revisie en bestandsnamen volgen een vaste workflow. Voor publicatie bepalen we wie metadata, artwork, hosting, uploads en promotie beheert, zodat een afgewerkte aflevering niet tussen verantwoordelijkheden blijft liggen.",
        ],
        highlights: [
          "Haalbaar format op basis van interne capaciteit",
          "Redactionele kalender en gastvoorbereiding",
          "Vaste opname-, montage- en feedbackworkflow",
          "Hosting en publicatie als expliciete keuzes",
        ],
      },
      outcomes: {
        title: "Wat volledige podcastbegeleiding oplevert",
        intro:
          "Het traject maakt rollen en terugkerende stappen voorspelbaar voor iedereen die aan de reeks meewerkt.",
        items: [
          {
            title: "Een format dat herhaalbaar is",
            description:
              "Vaste onderdelen en selectiecriteria helpen nieuwe onderwerpen toetsen zonder dat afleveringen identiek worden.",
          },
          {
            title: "Minder losse productiebeslissingen",
            description:
              "Planning, opname, montage en feedback volgen dezelfde afspraken doorheen de gekozen reeks.",
          },
          {
            title: "Duidelijk intern eigenaarschap",
            description:
              "Je team weet wie inhoud goedkeurt, gasten coördineert en publicatieaccounts beheert.",
          },
        ],
      },
      idealFor: {
        title: "Voor wie past een begeleid podcast-traject?",
        intro:
          "Het traject is bedoeld voor organisaties met inhoudelijke ambitie, maar zonder complete interne podcastworkflow.",
        items: [
          {
            title: "KMO's die een reeks starten",
            description:
              "Je hebt expertise en mogelijke gasten, maar wil format en productie professioneel opzetten.",
          },
          {
            title: "Teams met meerdere inhoudseigenaars",
            description:
              "Marketing, directie en vakexperts hebben duidelijke rollen nodig voor briefing, opname en goedkeuring.",
          },
          {
            title: "Bestaande podcasts zonder workflow",
            description:
              "Afleveringen ontstaan onregelmatig en vragen een stabielere redactionele en technische aanpak.",
          },
        ],
      },
      deliverables: {
        title: "Wat kan het podcast-traject opleveren?",
        intro:
          "We leggen per fase vast welke documenten, producties en beheerhandelingen door VisualVibe worden geleverd.",
        items: [
          {
            title: "Formatdocument",
            description:
              "Doelgroep, luisterbelofte, rubrieken, toon, lengte en rollen vormen een praktisch referentiekader.",
          },
          {
            title: "Redactionele afleveringsplanning",
            description:
              "Thema's, gasten, verantwoordelijken en opnamemomenten worden in een haalbare volgorde gezet.",
          },
          {
            title: "Productie van afgesproken afleveringen",
            description:
              "Voorbereiding, opname, montage en revisie volgen de vaste audio- of videoscope.",
          },
          {
            title: "Oplever- en publicatieworkflow",
            description:
              "Bestanden, metadata, artwork, accounts en uploadverantwoordelijkheden worden concreet toegewezen.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een podcast-traject?",
        paragraphs: [
          "Het aantal afleveringen en de gewenste begeleiding bepalen de basis. Conceptontwikkeling, interviews voorbereiden en gasten coördineren vragen meer redactionele tijd dan een reeks die intern volledig wordt aangeleverd.",
          "Audioproductie verschilt ook van een multicameraformule met clips. We begroten format, opname, montage, revisie en eventuele publicatietaken afzonderlijk. Externe hosting, muziek of platformdiensten worden niet stilzwijgend als inbegrepen beschouwd.",
        ],
        factors: [
          "Diepte van concept- en formatontwikkeling",
          "Aantal afleveringen en productieritme",
          "Redactionele research en gastenbegeleiding",
          "Audio tegenover multicamera video",
          "Studio of verschillende opnamelocaties",
          "Montage, vormgeving en revisierondes",
          "Clips, ondertiteling en extra formaten",
          "Hosting- en publicatieondersteuning",
        ],
      },
      whyVisualVibe: {
        title: "Waarom een podcast-traject met VisualVibe?",
        intro:
          "Eén team bewaakt de aansluiting tussen format, sprekers, techniek en uiteindelijke bestanden.",
        items: [
          {
            title: "Realistische redactionele planning",
            description:
              "We stemmen het aantal afleveringen af op onderwerpen en tijd die je organisatie werkelijk beschikbaar heeft.",
          },
          {
            title: "Audio en video als bewuste keuze",
            description:
              "We adviseren per doel welke productievariant nodig is en benoemen de extra workflow van video.",
          },
          {
            title: "Overdracht zonder platformafhankelijkheid",
            description:
              "Accounts en externe diensten blijven transparant, met duidelijke afspraken over eigendom en beheer.",
          },
        ],
      },
      regional: {
        title: "Een podcast-traject begeleiden vanuit Limburg",
        description:
          "VisualVibe begeleidt podcastreeksen voor KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met digitale redactie en opnames op een geschikte locatie.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Zet je podcastidee om in een werkbaar traject",
        description:
          "Deel je doel, mogelijke thema's, team en gewenste kanalen. We bakenen concept, afleveringen en productieverantwoordelijkheden concreet af.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "podcast-voor-experts": {
    intro:
      "Een podcast voor experts geeft consultants, coaches en specialisten ruimte voor uitleg die niet in een korte post past. VisualVibe helpt expertise afbakenen, onderwerpen kiezen en gesprekken professioneel opnemen, zonder autoriteit, bereik of opdrachten te beloven.",
    excerpt:
      "Een inhoudelijke podcastformule voor experts die hun visie en werkwijze helder willen delen via voorbereide gesprekken of solo-afleveringen.",
    process: [
      {
        title: "Expertise en publiek afbakenen",
        description:
          "We bepalen welke doelgroep je helpt, welke vragen je geloofwaardig kan beantwoorden en welke vertrouwelijke of gereglementeerde grenzen gelden.",
      },
      {
        title: "Contentpijlers en vorm kiezen",
        description:
          "We vertalen kennis naar terugkerende thema's en kiezen tussen solo-uitleg, interviews, casusbespreking of een passende combinatie.",
      },
      {
        title: "Spreker voorbereiden en opnemen",
        description:
          "Draaiboek en oefening geven houvast zonder een onnatuurlijke voorleestekst. Tijdens opname bewaken we tempo, techniek en begrijpelijkheid.",
      },
      {
        title: "Monteren en inhoud herbruikbaar maken",
        description:
          "We werken audio of video af en leveren de afgesproken versies. Eventuele fragmenten of transcriptinput worden vooraf als aparte output bepaald.",
      },
    ],
    faqs: [
      {
        question: "Voor welke experts is een eigen podcast geschikt?",
        answer:
          "Voor professionals met een duidelijke doelgroep, aantoonbare vakkennis en voldoende onderwerpen om regelmatig uit te werken. Consultants, coaches en technische specialisten kunnen allemaal passen, zolang de inhoud concrete vragen behandelt en niet alleen persoonlijke promotie herhaalt.",
      },
      {
        question: "Werk ik beter met solo-afleveringen of gasten?",
        answer:
          "Solo-afleveringen geven controle en zijn geschikt voor gerichte uitleg. Gasten brengen andere ervaringen en een natuurlijk gesprek. Een combinatie kan werken wanneer elke vorm dezelfde inhoudelijke belofte ondersteunt en de extra planning van gasten haalbaar blijft.",
      },
      {
        question: "Moet ik vlot kunnen presenteren?",
        answer:
          "Je hoeft geen radiostem te hebben. Een duidelijk onderwerp, vertrouwd taalgebruik en oefening zijn belangrijker. We helpen met structuur, microfoongebruik en tempo. Sterke inhoud kan worden gemonteerd, maar een volledig onnatuurlijke tekst wordt niet vanzelf een spontaan gesprek.",
      },
      {
        question: "Kunnen klantcases in de podcast worden besproken?",
        answer:
          "Alleen met passende toestemming en respect voor vertrouwelijkheid. We kunnen situaties anonimiseren of werken met algemene patronen. Je blijft verantwoordelijk voor vakinhoudelijke, juridische en sectorgebonden beperkingen en keurt gevoelige passages vóór publicatie goed.",
      },
      {
        question: "Maken jullie ook artikelen of sociale posts uit de podcast?",
        answer:
          "Dat kan als aanvullende contentscope. We spreken af welke fragmenten, transcriptbewerking of artikelen nodig zijn en wie publiceert. Automatische transcriptie is een werkdocument en vraagt redactie voordat ze als leesbare en correcte expertcontent wordt gebruikt.",
      },
    ],
    relatedServices: [
      "podcast-traject",
      "bedrijfspodcast",
      "videopodcast",
      "brandingfotografie",
      "seo-copywriting",
    ],
    seo: {
      title: "Podcast voor experts en consultants in België | VisualVibe",
      description:
        "Een podcast voor experts starten? VisualVibe helpt consultants met positionering, contentpijlers, voorbereiding, opname, montage en heldere versies.",
      keywords: [
        "podcast voor experts",
        "podcast voor consultants",
        "expertpodcast",
        "podcast als expert",
        "kennis delen via podcast",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "podcast voor experts",
        supportingKeywords: [
          "podcast voor consultants",
          "expertpodcast",
          "podcast als expert",
          "kennis delen via podcast",
        ],
        type: "commercial",
      },
      overview: {
        title: "Een podcast voor experts met een duidelijke kennispositie",
        paragraphs: [
          "Expertise wordt geloofwaardig wanneer je afwegingen en adviesgrenzen uitlegt. We verzamelen vragen uit gesprekken, opleidingen en projecten en groeperen ze tot contentpijlers voor meerdere relevante afleveringen.",
          "Het format moet bij je spreekstijl passen. Solo-uitleg kan compact worden voorbereid; een interview laat spontane nuance toe. Draaiboeken bevatten kernpunten, geen verkoopscripts. Distributie, clips en afgeleide tekst volgen alleen wanneer output en kanalen vooraf zijn gekozen.",
        ],
        highlights: [
          "Contentpijlers vanuit echte expertise en vragen",
          "Format afgestemd op je natuurlijke spreekstijl",
          "Voorbereiding zonder stijve voorleestekst",
          "Afgeleide content als bewuste aanvullende scope",
        ],
      },
      outcomes: {
        title: "Wat een expertpodcast inhoudelijk oplevert",
        intro:
          "Je bouwt een geordende bibliotheek van uitleg en gesprekken die je visie op een herkenbare manier weergeeft.",
        items: [
          {
            title: "Meer ruimte voor nuance",
            description:
              "Complexe vragen krijgen context, voorwaarden en voorbeelden die in korte content vaak ontbreken.",
          },
          {
            title: "Een herkenbare eigen stem",
            description:
              "Terugkerende thema's en taal maken duidelijk hoe jij over je vak denkt zonder opgeblazen claims.",
          },
          {
            title: "Bronmateriaal voor verdieping",
            description:
              "Afleveringen kunnen volgens scope input leveren voor geredigeerde artikelen, clips of interne kennisdeling.",
          },
        ],
      },
      idealFor: {
        title: "Wanneer past een podcast bij jouw expertise?",
        intro:
          "Het format werkt het best als je inhoudelijk iets kan toevoegen en tijd wil reserveren voor voorbereiding en opname.",
        items: [
          {
            title: "Consultants met een eigen methodiek",
            description:
              "Je kan processen en beslissingen uitleggen zonder je aanpak te reduceren tot algemene tips.",
          },
          {
            title: "Coaches en opleiders",
            description:
              "Terugkerende vragen uit sessies of trainingen vormen relevante thema's, binnen professionele grenzen.",
          },
          {
            title: "Technische vakspecialisten",
            description:
              "Je wil complexe onderwerpen toegankelijk maken voor beslissers, collega's of toekomstige medewerkers.",
          },
        ],
      },
      deliverables: {
        title: "Wat kan een podcast voor experts omvatten?",
        intro:
          "We combineren alleen de redactionele en technische onderdelen die je zelf niet wil of kan beheren.",
        items: [
          {
            title: "Positionerings- en contentkader",
            description:
              "Doelgroep, vragen, expertisegrenzen, toon en terugkerende thema's worden vastgelegd.",
          },
          {
            title: "Afleveringsbriefings",
            description:
              "Elke opname krijgt kernpunten, voorbeelden, vragen en een duidelijke afsluiting.",
          },
          {
            title: "Audio- of video-opname",
            description:
              "De gekozen formule wordt technisch begeleid in een passende set of locatie.",
          },
          {
            title: "Montage en gekozen contentversies",
            description:
              "Je ontvangt afgewerkte afleveringen en alleen de aanvullende formats die in de scope staan.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een podcast voor experts?",
        paragraphs: [
          "De investering hangt af van de redactionele begeleiding en gekozen productie. Interviews, broncontrole en veel gastafstemming vragen meer voorbereiding dan een expert die zelf een helder solo-draaiboek aanlevert.",
          "Video, clips en geredigeerde artikelen voegen afzonderlijke opname- en montagetaken toe. We maken een offerte per reeks of afgebakende productie. Publicatiebereik, leads of expertstatus worden niet als resultaat gegarandeerd.",
        ],
        factors: [
          "Positionerings- en formatontwikkeling",
          "Aantal thema's en afleveringen",
          "Research, interviews en inhoudelijke redactie",
          "Solo-opname of gastgesprekken",
          "Audio tegenover multicamera video",
          "Locatie en opnamefrequentie",
          "Montage, revisie en vormgeving",
          "Clips, transcriptredactie of artikelen",
        ],
      },
      whyVisualVibe: {
        title: "Waarom je expertpodcast met VisualVibe maken?",
        intro:
          "We behandelen je vakkennis als bronmateriaal en bouwen de productie rond begrijpelijke inhoud.",
        items: [
          {
            title: "Inhoud zonder lege autoriteitsclaims",
            description:
              "Je expertise wordt zichtbaar via concrete uitleg, afwegingen en voorbeelden, niet via onbewezen superlatieven.",
          },
          {
            title: "Presentatie die bij je past",
            description:
              "We kiezen een solo- of gespreksvorm waarin je natuurlijk spreekt en toch voldoende structuur houdt.",
          },
          {
            title: "Samenhangende contentproductie",
            description:
              "Audio, video, fotografie en SEO-copy kunnen als afgebakende onderdelen vanuit dezelfde thema's worden gepland.",
          },
        ],
      },
      regional: {
        title: "Podcast voor experts opnemen vanuit Limburg",
        description:
          "VisualVibe produceert expertpodcasts voor consultants en specialisten in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met voorbereiding digitaal of op locatie.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Vertaal je expertise naar een luisterbaar format",
        description:
          "Deel je doelgroep, vakthema's en voorkeur voor audio of video. We werken een concrete redactionele en technische scope uit.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
} satisfies Record<PodcastingEditorialSlug, SubserviceEditorial>;
