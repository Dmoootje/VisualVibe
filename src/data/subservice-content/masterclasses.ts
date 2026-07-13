import type { SubserviceEditorial } from "@/types";

type MasterclassesEditorialSlug =
  | "opleiding-opnemen"
  | "online-cursus-video"
  | "workshop-filmen";

export const masterclassesEditorial = {
  "opleiding-opnemen": {
    intro:
      "Een opleiding opnemen maakt een bestaande training herbruikbaar voor deelnemers, collega's of interne kennisoverdracht. VisualVibe registreert docent, presentatie en afgesproken interactie met professioneel beeld en geluid. We bepalen of je een volledige registratie, hoofdstukken of aanvullend cursusmateriaal nodig hebt. Een opname is niet automatisch een ontworpen e-learningmodule.",
    excerpt:
      "Een professionele video-opname van je opleiding, met verstaanbare uitleg, leesbare presentatie en een montagevorm die past bij het beoogde hergebruik.",
    process: [
      {
        title: "Leerdoel en gebruikssituatie bepalen",
        description:
          "We bespreken doelgroep, duur, locatie, presentatievorm en hoe deelnemers de video later bekijken. Dat bepaalt opname en hoofdstukindeling.",
      },
      {
        title: "Docent, slides en ruimte voorbereiden",
        description:
          "We controleren draaiboek, presentaties, demo's, audio, licht, camerazichtlijnen en toestemming van aanwezigen vóór de opleidingsdag.",
      },
      {
        title: "Opleiding technisch registreren",
        description:
          "Camera's en microfoons volgen docent en afgesproken leermiddelen, terwijl de sessie voor aanwezige deelnemers natuurlijk kan doorgaan.",
      },
      {
        title: "Monteren, reviseren en opleveren",
        description:
          "We combineren beeld, klank en presentatie, verwijderen afgesproken onderbrekingen en leveren na feedback de vastgelegde volledige of opgedeelde video's.",
      },
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen een opleiding opnemen en een online cursus maken?",
        answer:
          "Een opleidingsopname registreert meestal een bestaande sessie met haar natuurlijke verloop. Een online cursus wordt vanaf het begin ontworpen als korte zelfstandige modules, vaak zonder livepubliek. Een opname kan later worden opgedeeld, maar wordt daardoor niet automatisch didactisch gelijk aan e-learning.",
      },
      {
        question: "Kunnen slides leesbaar in beeld worden verwerkt?",
        answer:
          "Ja, wanneer we de originele presentatie tijdig ontvangen. We kunnen slides rechtstreeks combineren met docentbeeld in plaats van alleen een projectiescherm te filmen. Animaties, lettertypes en ingebedde media worden vooraf getest om onverwachte verschillen te beperken.",
      },
      {
        question: "Worden vragen van deelnemers mee opgenomen?",
        answer:
          "Alleen als dat inhoudelijk gewenst is en technisch en juridisch is voorbereid. Deelnemers moeten weten wat wordt opgenomen en vragen moeten verstaanbaar worden geregistreerd. We kunnen ook de docent de vraag laten herhalen of publieksdelen uit de uiteindelijke montage houden.",
      },
      {
        question: "Kan een volledige opleidingsdag in één video?",
        answer:
          "Technisch kan dat, maar lange bestanden zijn niet altijd prettig om terug te kijken. Hoofdstukken per onderwerp maken gericht herbekijken eenvoudiger. We bepalen vooraf welke pauzes, oefeningen en overlegmomenten behouden blijven en waar logische knipmomenten liggen.",
      },
      {
        question: "Plaatsen jullie de video's in ons leerplatform?",
        answer:
          "Dat is niet standaard inbegrepen. We leveren exports volgens afgesproken technische vereisten. Upload, platforminrichting, toegangsbeheer, toetsen en hosting kunnen alleen worden opgenomen na controle van het gekozen systeem, de beschikbare toegang en verantwoordelijkheden.",
      },
    ],
    relatedServices: [
      "online-cursus-video",
      "workshop-filmen",
      "bedrijfsvideo",
      "social-media-video",
      "brandingfotografie",
    ],
    seo: {
      title: "Opleiding opnemen met professionele video | VisualVibe",
      description:
        "Een opleiding opnemen voor later hergebruik? VisualVibe filmt docent, presentatie en afgesproken interactie en levert heldere, gemonteerde video's.",
      keywords: [
        "opleiding opnemen",
        "opleiding laten filmen",
        "training opnemen",
        "opleidingsvideo",
        "opleiding video Limburg",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "opleiding opnemen",
        supportingKeywords: [
          "opleiding laten filmen",
          "training opnemen",
          "opleidingsvideo",
          "opleiding video Limburg",
        ],
        type: "commercial",
      },
      overview: {
        title: "Een opleiding opnemen voor gericht hergebruik",
        paragraphs: [
          "We vertrekken van het latere gebruik. Een interne referentievideo mag het natuurlijke lesverloop bewaren, terwijl betaalde deelnemers vaak sneller naar een specifiek hoofdstuk willen springen. Dat verschil beïnvloedt camerakeuze, draaiboek en montage. Ook bepalen we of oefeningen, pauzes en vragen waarde toevoegen of vooral afleiden wanneer de sessie niet live wordt bekeken.",
          "Tijdens de voorbereiding krijgen slides en demonstraties evenveel aandacht als de docent. Kleine tekst of een slecht zichtbaar scherm kan achteraf niet altijd worden hersteld. Daarom vragen we bronbestanden en testen we media vooraf. De uiteindelijke video's worden geleverd in overeengekomen hoofdstukken en formaten. Leerplatform, hosting en deelnemersbeheer blijven afzonderlijke keuzes.",
        ],
        highlights: [
          "Opnamevorm afgestemd op later leergebruik",
          "Docent, slides en demonstraties leesbaar gecombineerd",
          "Duidelijke afspraken over publieksinteractie",
          "Exports voorbereid voor een gekozen vervolgplatform",
        ],
      },
      outcomes: {
        title: "Wat een professionele opleidingsopname oplevert",
        intro:
          "Je bestaande sessie wordt een navigeerbare videobron zonder de leercontext uit het oog te verliezen.",
        items: [
          {
            title: "Verstaanbare kennisoverdracht",
            description:
              "Microfoons volgen de docent en afgesproken interactie, zodat uitleg niet afhankelijk is van camerageluid.",
          },
          {
            title: "Gerichter terugkijken",
            description:
              "Logische hoofdstukken en titels helpen gebruikers een onderwerp terugvinden zonder de hele dag te doorlopen.",
          },
          {
            title: "Consistente trainingsbestanden",
            description:
              "Beeld, slides, klank en vormgeving worden volgens dezelfde technische afspraken opgeleverd.",
          },
        ],
      },
      idealFor: {
        title: "Wanneer is een opleidingsregistratie geschikt?",
        intro:
          "Registratie past wanneer een bestaande training inhoudelijk werkt en je die voor een afgebakende doelgroep wil bewaren.",
        items: [
          {
            title: "Interne bedrijfsopleidingen",
            description:
              "Terugkerende uitleg kan beschikbaar blijven voor onboarding, naslag of collega's die niet aanwezig waren.",
          },
          {
            title: "Vaktechnische trainingen",
            description:
              "Docent, presentatie en demonstratie moeten samen zichtbaar zijn om handelingen begrijpelijk te houden.",
          },
          {
            title: "Opleiders met een liveprogramma",
            description:
              "Een bewezen sessie krijgt een videoversie zonder meteen een volledig nieuw online curriculum te ontwerpen.",
          },
        ],
      },
      deliverables: {
        title: "Wat kan bij een opleiding opnemen inbegrepen zijn?",
        intro:
          "We specificeren welke lesonderdelen, presentatiemedia en videoversies deel uitmaken van de registratie.",
        items: [
          {
            title: "Technisch draaiboek",
            description:
              "Lesverloop, camera's, audio, slides, demo's, pauzes en toestemming worden vooraf afgestemd.",
          },
          {
            title: "Multicamera- en geluidsregistratie",
            description:
              "Docent en relevante leermiddelen worden met de afgesproken standpunten en microfoons opgenomen.",
          },
          {
            title: "Montage met presentatiemateriaal",
            description:
              "Slides, schermbeelden en titels worden waar voorzien leesbaar met docentbeeld gecombineerd.",
          },
          {
            title: "Hoofdstukken en video-exports",
            description:
              "Na revisie leveren we de afgesproken volledige of modulaire bestanden voor je eigen vervolgproces.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een opleiding opnemen?",
        paragraphs: [
          "Duur, locatie, aantal camera's en complexiteit van presentatiemateriaal bepalen de registratie. Een demonstratie met verschillende zichtlijnen vraagt meer voorbereiding dan een docent met vaste slides.",
          "De montage hangt af van hoofdstukken, publieksvragen, schermopnames en correcties. Na inzage in programma en ruimte ontvang je een offerte. Platformhosting, licenties en uploadwerk zijn alleen inbegrepen wanneer ze expliciet worden toegevoegd.",
        ],
        factors: [
          "Duur en aantal opleidingssessies",
          "Aantal camera's en microfoons",
          "Locatie, licht en akoestiek",
          "Slides, schermopnames en demonstraties",
          "Publieksinteractie en toestemmingen",
          "Aantal hoofdstukken en montagediepte",
          "Ondertiteling en revisierondes",
          "Exports of ondersteuning voor een leerplatform",
        ],
      },
      whyVisualVibe: {
        title: "Waarom je opleiding laten opnemen door VisualVibe?",
        intro:
          "We bekijken lesinhoud, livepraktijk en videoproductie samen, zodat de registratie bruikbaar blijft na de sessie.",
        items: [
          {
            title: "Leerdoel bepaalt het beeld",
            description:
              "Camerastandpunten volgen wat deelnemers moeten zien, niet enkel wat er filmisch aantrekkelijk uitziet.",
          },
          {
            title: "Presentatiemateriaal als echte bron",
            description:
              "We verwerken originele slides en schermbeelden waar mogelijk voor betere leesbaarheid.",
          },
          {
            title: "Registratie eerlijk afgebakend",
            description:
              "We maken duidelijk wanneer je een opname krijgt en wanneer aanvullend didactisch ontwerp of platformwerk nodig is.",
          },
        ],
      },
      regional: {
        title: "Opleiding opnemen op locatie vanuit Limburg",
        description:
          "VisualVibe registreert opleidingen in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, na afstemming van lesruimte, programma, techniek en aanwezigen.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Maak je opleiding opnieuw bruikbaar op video",
        description:
          "Bezorg programma, locatie, presentatiemateriaal en gewenst hergebruik. We adviseren over registratie, hoofdstukken en technische oplevering.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "online-cursus-video": {
    intro:
      "Een online cursus video wordt ontworpen voor zelfstandig leren, met één helder doel per module en een consistente presentatie. VisualVibe helpt je lange lesinhoud opdelen, scripts en visuele middelen voorbereiden en de video's professioneel opnemen en monteren. We leveren bestanden volgens de afgesproken platformvereisten, maar leerplatformhosting en cursusbeheer zijn niet automatisch inbegrepen.",
    excerpt:
      "Modulaire e-learningvideo's met een duidelijke lesstructuur, professionele presentatie en technische exports voor het gekozen cursusplatform.",
    process: [
      {
        title: "Curriculum en platformcontext bespreken",
        description:
          "We bekijken doelgroep, leerdoelen, modules, videotypes en technische eisen van het platform waarop je de cursus zelf wil aanbieden.",
      },
      {
        title: "Modules en scripts productieproof maken",
        description:
          "Lange lesstof wordt verdeeld in opneembare eenheden met kernpunten, voorbeelden, slides, demo's en een logische volgorde.",
      },
      {
        title: "Cursusvideo's in blokken opnemen",
        description:
          "We registreren docent, stem, presentatie of scherm volgens een vaste set en bewaken continuïteit tussen modules.",
      },
      {
        title: "Monteren, reviseren en exporteren",
        description:
          "Elke module krijgt afgesproken titels, media en afwerking. Na gebundelde feedback leveren we genummerde bestanden volgens de gekozen specificaties.",
      },
    ],
    faqs: [
      {
        question: "Hoe lang hoort een online cursus video te zijn?",
        answer:
          "Er is geen universele ideale lengte. Eén video behandelt best één duidelijke leertaak zonder onnodige herhaling. Een complex voorbeeld kan meer tijd vragen dan een definitie. We delen inhoud op natuurlijke beslis- en oefenmomenten in plaats van op een vaste minutengrens.",
      },
      {
        question: "Moet ik elk woord van mijn cursus uitschrijven?",
        answer:
          "Dat hangt af van je presentatiestijl en de technische nauwkeurigheid. Een volledig script helpt bij precieze formuleringen en autocue, maar kan stijf klinken. Een spreekschema met kernpunten werkt voor ervaren docenten vaak natuurlijker. We testen de aanpak vóór een lange opnamedag.",
      },
      {
        question: "Kunnen schermopnames en slides worden toegevoegd?",
        answer:
          "Ja. We bepalen of een live schermdemonstratie, voorbereide schermopname, animatie of slide het leerdoel het best ondersteunt. Bronbestanden moeten tijdig beschikbaar zijn. Complexe animatie en interactie zijn aparte productietaken en worden vooraf begroot.",
      },
      {
        question: "Welk platform heb ik nodig voor mijn online cursus?",
        answer:
          "Dat hangt af van verkoop, gebruikersbeheer, toetsen, rapportage, integraties en privacybehoeften. We kunnen technische videovereisten helpen vergelijken, maar kiezen niet zonder je bedrijfsproces te kennen. Accounts, abonnementen, inrichting en ondersteuning worden afzonderlijk afgesproken.",
      },
      {
        question: "Leveren jullie ook toetsen en cursusdownloads?",
        answer:
          "Alleen als didactische ontwikkeling en vormgeving deel zijn van de scope. Video's alleen vormen niet noodzakelijk een complete cursus. Je vakexpert blijft verantwoordelijk voor juiste inhoud; we kunnen helpen om opdrachten, werkbladen of begeleidende assets productiegeschikt te maken.",
      },
    ],
    relatedServices: [
      "opleiding-opnemen",
      "workshop-filmen",
      "bedrijfsvideo",
      "social-media-video",
      "seo-copywriting",
    ],
    seo: {
      title: "Online cursus video professioneel maken | VisualVibe",
      description:
        "Een online cursus video laten maken? VisualVibe helpt met modulaire structuur, scripts, opname, montage en exports voor je gekozen leerplatform in België.",
      keywords: [
        "online cursus video",
        "online cursus video laten maken",
        "e-learning video",
        "cursusvideo opnemen",
        "videocursus produceren",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "online cursus video",
        supportingKeywords: [
          "online cursus video laten maken",
          "e-learning video",
          "cursusvideo opnemen",
          "videocursus produceren",
        ],
        type: "commercial",
      },
      overview: {
        title: "Online cursus video opbouwen in zelfstandige modules",
        paragraphs: [
          "Online deelnemers kunnen niet altijd direct een vervolgvraag stellen. Elke module moet daarom voldoende context geven, begrippen consequent gebruiken en helder aangeven wat de kijker daarna kan toepassen. We vertalen je curriculum naar een videoplan met één onderwerp per eenheid. Voorbeelden, slides, schermbeelden en downloads krijgen alleen een plaats wanneer ze het leerdoel ondersteunen.",
          "Een vaste set, kadrering en vormgeving zorgen voor continuïteit tussen opnamedagen. We plannen modules in efficiënte opnameblokken, maar houden rekening met kleding, props en softwareversies. In de montage krijgen bestanden vaste namen en volgorde. Het gekozen platform bepaalt onder meer resolutie en maximale bestandsgrootte; upload en gebruikersbeheer vallen buiten productie tenzij anders afgesproken.",
        ],
        highlights: [
          "Eén leerdoel per afgebakende videomodule",
          "Scripts, slides en demo's vóór opname gecontroleerd",
          "Consistente set en vormgeving door de reeks",
          "Exports afgestemd op bekende platformvereisten",
        ],
      },
      outcomes: {
        title: "Wat modulaire cursusvideo's opleveren",
        intro:
          "Deelnemers krijgen een voorspelbare videostructuur waarin uitleg en toepassing per onderwerp samenkomen.",
        items: [
          {
            title: "Gerichte leerstappen",
            description:
              "Elke module behandelt een herkenbare vraag of handeling en verwijst logisch naar het vervolg.",
          },
          {
            title: "Eenvoudiger actualiseren",
            description:
              "Een afgebakende module kan later afzonderlijk opnieuw worden geproduceerd wanneer inhoud verandert.",
          },
          {
            title: "Consistente leerervaring",
            description:
              "Stem, beeld, titels en bestandsstructuur volgen dezelfde afspraken doorheen de cursus.",
          },
        ],
      },
      idealFor: {
        title: "Voor wie zijn online cursusvideo's geschikt?",
        intro:
          "De formule past bij experts met een uitgewerkt curriculum en een duidelijke doelgroep voor zelfstandig leren.",
        items: [
          {
            title: "Opleiders met bewezen lesmateriaal",
            description:
              "Je programma werkt live en kan doelgericht worden herontworpen voor modules zonder publiek.",
          },
          {
            title: "KMO's met terugkerende onboarding",
            description:
              "Vaste uitleg kan als onderdeel van een breder intern leerpad beschikbaar worden gemaakt.",
          },
          {
            title: "Software- en procesexperts",
            description:
              "Schermopnames, demonstraties en docentvideo kunnen complexe stappen in een vaste volgorde toelichten.",
          },
        ],
      },
      deliverables: {
        title: "Wat kan een online cursus videoproductie omvatten?",
        intro:
          "We bakenen videoproductie, didactische redactie en platformtaken afzonderlijk af.",
        items: [
          {
            title: "Module- en videoplan",
            description:
              "Leerdoelen, volgorde, videotypes, benodigde media en gewenste lengte worden per onderdeel beschreven.",
          },
          {
            title: "Productieklare scripts en assets",
            description:
              "Spreektekst of kernpunten, slides, schermen en voorbeelden worden vóór opname gecontroleerd.",
          },
          {
            title: "Geplande video-opnames",
            description:
              "Docent, audio en aanvullende beelden worden in een consistente technische en visuele opstelling geregistreerd.",
          },
          {
            title: "Gemonteerde cursusmodules",
            description:
              "Je ontvangt gereviseerde, genummerde video's in de overeengekomen technische formaten.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van online cursus video?",
        paragraphs: [
          "Aantal modules, scriptstatus en presentatievorm bepalen de voorbereiding. Een docent in een vaste set vraagt een andere productie dan softwaredemo's, meerdere locaties of uitgebreide grafische animatie.",
          "Montage, ondertiteling, revisie en platformexports worden per reeks afgebakend. We maken een offerte na inzage in curriculum en voorbeeldmodule. Hosting, platformabonnementen en verkoopfunctionaliteit zijn niet standaard onderdeel van videoproductie.",
        ],
        factors: [
          "Aantal modules en totale opnameduur",
          "Didactische redactie en scriptbegeleiding",
          "Docentvideo, slides of schermdemonstratie",
          "Studio, locatie en aantal opnamedagen",
          "Grafische vormgeving en animatie",
          "Montagediepte en revisierondes",
          "Ondertiteling en aanvullende assets",
          "Platformexports of uploadondersteuning",
        ],
      },
      whyVisualVibe: {
        title: "Waarom online cursus video met VisualVibe?",
        intro:
          "We verbinden inhoudsopdeling met opname en montage, zodat modules productiepraktisch én begrijpelijk worden.",
        items: [
          {
            title: "Eerst een voorbeeldmodule",
            description:
              "Stijl en workflow kunnen vroeg worden getoetst voordat een volledige reeks wordt opgenomen.",
          },
          {
            title: "Continuïteit tussen opnamedagen",
            description:
              "Set, assets, bestandsnamen en presentatieafspraken worden doorheen de productie bewaakt.",
          },
          {
            title: "Heldere platformgrens",
            description:
              "We leveren technisch passende video's en benoemen apart wie hosting, gebruikers en cursuspublicatie beheert.",
          },
        ],
      },
      regional: {
        title: "Online cursus video produceren vanuit Limburg",
        description:
          "VisualVibe produceert modulaire cursusvideo's voor opleiders en KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met voorbereiding grotendeels digitaal.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Toets je curriculum aan een videostructuur",
        description:
          "Deel leerdoelen, modules, voorbeeldmateriaal en platformkeuze. We werken een concrete scope voor voorbereiding, opname en montage uit.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "workshop-filmen": {
    intro:
      "Een workshop filmen kan inhoud bewaren of sfeer en kernmomenten samenvatten. VisualVibe bepaalt welke sprekers, oefeningen en interacties belangrijk zijn en registreert met aandacht voor geluid, zichtlijnen en deelnemers. Een volledig verslag, inhoudelijke edit en aftermovie zijn afzonderlijke montagevormen.",
    excerpt:
      "Een professionele workshopregistratie die inhoud, demonstraties en afgesproken interactie vastlegt als volledig verslag, samenvatting of aftermovie.",
    process: [
      {
        title: "Doel en gewenste filmvorm kiezen",
        description:
          "We bepalen of de video dient voor deelnemers, interne kennis, promotie of verslag en welke volledige en korte versies daarbij passen.",
      },
      {
        title: "Programma en locatie voorbereiden",
        description:
          "Sprekers, oefeningen, zaalindeling, licht, audio, presentaties, publiekszones en toestemming worden in een technisch draaiboek verwerkt.",
      },
      {
        title: "Workshop discreet registreren",
        description:
          "We filmen presentator, demonstraties en afgesproken interactie zonder deelnemers of werkvormen onnodig te hinderen.",
      },
      {
        title: "Selecteren, monteren en opleveren",
        description:
          "Beeld en geluid worden volgens de gekozen filmvorm gemonteerd. Na revisie leveren we de afgesproken volledige registratie, samenvatting of korte versie.",
      },
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen een workshopregistratie en aftermovie?",
        answer:
          "Een registratie bewaart de inhoud en volgt belangrijke onderdelen in voldoende lengte. Een aftermovie is een korte sfeergerichte samenvatting en kan de volledige les niet vervangen. We kunnen beide maken wanneer opnameplan en montagebudget daarop zijn voorzien.",
      },
      {
        question: "Moeten deelnemers toestemming geven om gefilmd te worden?",
        answer:
          "De organisator moet deelnemers tijdig informeren en een passende toestemming of andere rechtsgrond regelen. We bespreken publieksvrije zones, camerakaders en omgang met vragen. VisualVibe geeft productieadvies, maar de organisator blijft verantwoordelijk voor deelnemerscommunicatie en juridische beoordeling.",
      },
      {
        question: "Kunnen vragen en groepsgesprekken verstaanbaar worden opgenomen?",
        answer:
          "Dat vraagt extra audiovoorzieningen en duidelijke werkafspraken. Een zaalmicrofoon registreert niet automatisch elke deelnemer goed. We kunnen een vraagmicrofoon voorzien, de spreker vragen vragen te herhalen of specifieke groepen gericht opnemen wanneer dat vooraf gepland is.",
      },
      {
        question: "Kan de workshop doorgaan zoals gewoonlijk?",
        answer:
          "Meestal wel, maar camera's hebben zichtlijnen en korte opbouwtijd nodig. Zeer beweeglijke oefeningen of kleine groepen vragen extra afstemming. We kiezen posities en momenten die de sessie zo weinig mogelijk verstoren en informeren de begeleider over praktische beperkingen.",
      },
      {
        question: "Leveren jullie video's voor sociale media en ons platform?",
        answer:
          "We kunnen verschillende exports of korte fragmenten voorzien als aantallen, lengte en beeldverhouding zijn afgesproken. Upload, hosting en platformbeheer zijn niet standaard inbegrepen. De organisator bepaalt ook of deelnemerstoestemming het beoogde publicatiegebruik dekt.",
      },
    ],
    relatedServices: [
      "opleiding-opnemen",
      "online-cursus-video",
      "event-aftermovie",
      "eventfotografie",
      "social-media-video",
    ],
    seo: {
      title: "Workshop filmen voor hergebruik en verslag | VisualVibe",
      description:
        "Een workshop filmen voor verslag of hergebruik? VisualVibe plant beeld, geluid, deelnemerskaders en montage voor een volledige registratie of samenvatting.",
      keywords: [
        "workshop filmen",
        "workshop laten filmen",
        "masterclass opnemen",
        "workshop videoregistratie",
        "workshop aftermovie",
      ],
    },
    content: {
      searchIntent: {
        primaryKeyword: "workshop filmen",
        supportingKeywords: [
          "workshop laten filmen",
          "masterclass opnemen",
          "workshop videoregistratie",
          "workshop aftermovie",
        ],
        type: "commercial",
      },
      overview: {
        title: "Workshop filmen als inhoudelijk verslag of korte samenvatting",
        paragraphs: [
          "De montage bepaalt wat we opnemen. Voor herbekijken zijn uitleg, demonstraties en verstaanbare vragen belangrijk. Een aftermovie vraagt daarnaast reacties en details die sfeer tonen. Eén camera dient zelden beide doelen, dus leggen we prioriteiten, publiekskaders en eindlengtes vast.",
          "Workshops zijn beweeglijker dan klassieke presentaties. Deelnemers werken in groep, de begeleider loopt rond en belangrijke momenten ontstaan niet altijd op het podium. Het draaiboek markeert oefeningen en feedbackmomenten, terwijl de crew ruimte houdt voor het echte verloop. Na opname worden alleen de afgesproken versies gemonteerd; platformuploads en bredere distributie vragen aparte toegang en toestemming.",
        ],
        highlights: [
          "Registratie en aftermovie als verschillende producten",
          "Audio-oplossing voor docent en geplande vragen",
          "Camerakaders afgestemd op deelnemerstoestemming",
          "Montagevorm en publicatiegebruik vooraf bepaald",
        ],
      },
      outcomes: {
        title: "Wat een doelgerichte workshopvideo oplevert",
        intro:
          "Je ontvangt beeld dat past bij het gekozen doel, in plaats van één lange opname zonder bruikbare structuur.",
        items: [
          {
            title: "Bewaarde kerninhoud",
            description:
              "Belangrijke uitleg, demonstraties en conclusies blijven beschikbaar in de gekozen volledige of verkorte vorm.",
          },
          {
            title: "Herkenbare workshopdynamiek",
            description:
              "Gerichte sfeerbeelden tonen interactie en werkvormen zonder inhoud of deelnemerscontext te verdraaien.",
          },
          {
            title: "Versies per gebruiksdoel",
            description:
              "Een registratie, samenvatting en sociale clip krijgen elk een passende lengte en montage wanneer voorzien.",
          },
        ],
      },
      idealFor: {
        title: "Wanneer is een workshop filmen zinvol?",
        intro:
          "Film is passend wanneer inhoud of sfeer na de livebijeenkomst een concreet en toegestaan vervolggebruik heeft.",
        items: [
          {
            title: "Masterclasses met unieke uitleg",
            description:
              "Een specialist behandelt een afgebakend onderwerp dat deelnemers later inhoudelijk willen herbekijken.",
          },
          {
            title: "Interne workshops en kennisdagen",
            description:
              "Kerninzichten moeten binnen de organisatie worden gedeeld met collega's die niet aanwezig waren.",
          },
          {
            title: "Publieke events met vervolgcommunicatie",
            description:
              "Een korte samenvatting toont opzet en sfeer, mits toestemming en publicatiedoel vooraf duidelijk zijn.",
          },
        ],
      },
      deliverables: {
        title: "Wat kan bij een workshop filmen inbegrepen zijn?",
        intro:
          "De gekozen output bepaalt camera-, audio- en montageplan en wordt vóór de workshop concreet vastgelegd.",
        items: [
          {
            title: "Workshopdraaiboek",
            description:
              "Programma, sprekers, oefeningen, publiekskaders en verwachte kernmomenten sturen de registratie.",
          },
          {
            title: "Beeld- en geluidsopname",
            description:
              "Presentator, demonstraties, sfeer en afgesproken vragen worden met passende apparatuur vastgelegd.",
          },
          {
            title: "Inhoudelijke registratie",
            description:
              "De volledige of ingekorte sessie wordt gemonteerd met relevante slides, titels en klankafwerking.",
          },
          {
            title: "Samenvatting of aftermovie",
            description:
              "Waar voorzien maken we een afzonderlijke korte versie met kernuitspraken en workshopbeelden.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een workshop filmen?",
        paragraphs: [
          "Duur, programma, locatie en aantal gelijktijdige activiteiten bepalen hoeveel camera- en audiodekking nodig is. Meerdere ruimtes of groepsoefeningen vragen meer voorbereiding dan één spreker op een vaste plaats.",
          "Ook het aantal eindversies weegt mee. Een volledige registratie, inhoudelijke samenvatting en aftermovie hebben elk een eigen selectie en montage. Na inzage in programma en locatie maken we een afgebakende offerte zonder publicatiebereik te beloven.",
        ],
        factors: [
          "Duur en opbouw van de workshop",
          "Aantal ruimtes, sprekers en werkvormen",
          "Camera's, microfoons en lichtbehoefte",
          "Publieksvragen en deelnemersregistratie",
          "Slides, demonstraties en schermbeelden",
          "Volledige registratie of inhoudelijke inkorting",
          "Extra aftermovie, clips en ondertiteling",
          "Revisies, exports en publicatieondersteuning",
        ],
      },
      whyVisualVibe: {
        title: "Waarom je workshop laten filmen door VisualVibe?",
        intro:
          "We combineren eventregistratie met kennis van opleidingsvideo en maken montagekeuzes vanuit het beoogde gebruik.",
        items: [
          {
            title: "Inhoud en sfeer apart gepland",
            description:
              "We bepalen welke camerabeelden nodig zijn voor volledig begrip en welke momenten een korte samenvatting dragen.",
          },
          {
            title: "Aandacht voor deelnemers",
            description:
              "Opstelling, publiekszones en interactie worden vooraf met de organisator afgestemd.",
          },
          {
            title: "Eerlijke opleveringskeuzes",
            description:
              "Je kiest concreet tussen registratie, samenvatting en clips en betaalt niet ongemerkt voor alle mogelijke varianten.",
          },
        ],
      },
      regional: {
        title: "Workshop filmen op locatie vanuit Limburg",
        description:
          "VisualVibe filmt workshops en masterclasses in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, na controle van programma, ruimte en deelnemersafspraken.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Kies welke workshopmomenten verder moeten leven",
        description:
          "Bezorg programma, locatie, deelnemerscontext en gewenste videoformats. We maken een duidelijk plan voor registratie en montage.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
} satisfies Record<MasterclassesEditorialSlug, SubserviceEditorial>;
