import type { SubserviceEditorial } from "@/types";

type FotografieSlug =
  | "bedrijfsfotografie"
  | "zakelijke-portretten"
  | "productfotografie"
  | "eventfotografie"
  | "vastgoedfotografie"
  | "realisatiefotografie"
  | "brandingfotografie";

export const fotografieEditorial = {
  bedrijfsfotografie: {
    intro:
      "Met bedrijfsfotografie bouw je een beeldbank op die laat zien wie je onderneming is, hoe je team werkt en waar klanten terechtkomen. We vertalen je merk en praktijk naar foto's voor je website, vacatures, presentaties en sociale media, zonder je werkvloer in een onnatuurlijke fotostudio te veranderen.",
    excerpt:
      "Een doordachte fotosessie op locatie, met herkenbare beelden van je mensen, omgeving en manier van werken.",
    process: [
      {
        title: "Merk en gebruiksmomenten afbakenen",
        description:
          "We bespreken je doelgroep, visuele stijl en de kanalen waarvoor je beelden nodig hebt. Zo weten we vooraf of de nadruk ligt op expertise, samenwerking, gastvrijheid, productie of een combinatie daarvan.",
      },
      {
        title: "Locaties en situaties plannen",
        description:
          "We maken een haalbare shotlist met ruimtes, medewerkers, handelingen en eventuele props. Ook stemmen we kleding, interne planning, privacy en geschikte momenten per afdeling met je af.",
      },
      {
        title: "De werkdag gericht fotograferen",
        description:
          "Op locatie sturen we bij waar dat helpt, maar laten we echte interacties bestaan. We wisselen overzicht, portret, detail en actie af zodat de reeks later breed inzetbaar is.",
      },
      {
        title: "Selecteren voor een bruikbare beeldbank",
        description:
          "We selecteren op verhaal, variatie en technische kwaliteit, werken kleur en uitsnede zorgvuldig af en exporteren bestanden voor de afgesproken digitale en gedrukte toepassingen.",
      },
    ],
    faqs: [
      {
        question: "Moet ons bedrijf tijdens de fotosessie stilgelegd worden?",
        answer:
          "Meestal niet. We plannen per ruimte of team een blok rond je werking. Voor drukke of veiligheidsgevoelige zones spreken we vooraf een geschikt moment en duidelijke werkwijze af.",
      },
      {
        question: "Hoe bereiden medewerkers zich voor op bedrijfsfoto's?",
        answer:
          "Deelnemers krijgen vooraf context over doel, kleding en timing. De keuze moet bij je merk passen. Wij geven praktische richtlijnen op basis van locatie en beeldstijl.",
      },
      {
        question: "Kunnen verschillende vestigingen in één beeldverhaal passen?",
        answer:
          "Ja. We leggen vaste keuzes voor licht, kadrering, achtergronden en nabewerking vast. Daardoor kunnen foto's van verschillende locaties één reeks vormen, ook als de werkomgeving verschilt.",
      },
      {
        question: "Wat als sommige collega's liever niet herkenbaar in beeld komen?",
        answer:
          "Dat nemen we mee in de planning. We kunnen andere medewerkers voorzien, mensen onherkenbaar in een handeling tonen of een scène anders kaderen. Je organisatie blijft verantwoordelijk voor de nodige interne afspraken en toestemmingen.",
      },
      {
        question: "Krijgen we zowel horizontale als verticale bedrijfsbeelden?",
        answer:
          "We fotograferen bewust met verschillende plaatsingen in gedachten. De definitieve mix hangt af van je shotlist en kan uitsneden bevatten voor brede websitebanners, staande sociale posts, presentaties en gewone redactionele kaders.",
      },
    ],
    relatedServices: ["zakelijke-portretten", "brandingfotografie", "bedrijfsvideo", "webdesign"],
    seo: {
      title: "Bedrijfsfotografie voor KMO's in Limburg | VisualVibe",
      description:
        "Bedrijfsfotografie voor KMO's: authentieke beelden van team, werkplek en vakmanschap, voorbereid als veelzijdige beeldbank voor elk communicatiekanaal.",
      keywords: ["bedrijfsfotografie", "bedrijfsfotograaf Limburg", "professionele bedrijfsfoto's", "fotografie voor KMO"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "bedrijfsfotografie",
        supportingKeywords: ["bedrijfsfotograaf Limburg", "professionele bedrijfsfoto's", "foto's van personeel", "fotografie op locatie"],
        type: "commercial",
      },
      overview: {
        title: "Bedrijfsfotografie die je onderneming herkenbaar maakt",
        paragraphs: [
          "Bedrijfsfotografie is meer dan een groepsfoto en enkele beelden van het kantoor. Een sterke reeks maakt je dienstverlening tastbaar: klanten zien de mensen achter je naam, kandidaten krijgen een indruk van de werkomgeving en partners begrijpen hoe je vakmanschap er in de praktijk uitziet. Daarom vertrekken we niet van losse poses, maar van de vragen waarop je communicatie een visueel antwoord nodig heeft.",
          "Tijdens de voorbereiding bepalen we welke personen, locaties en activiteiten je verhaal dragen. We letten op merkkleuren, veiligheid, achtergrond, beschikbaar licht en de ruimte die ontwerpers later voor tekst nodig hebben. Op de opnamedag combineren we geregisseerde sleutelmomenten met spontane observaties. Zo ontstaat een samenhangende beeldbank die niet afhankelijk is van generieke stockfoto's.",
        ],
        highlights: ["Fotografie in je eigen werkomgeving", "Shotlist per kanaal en doelgroep", "Mix van mensen, actie en details"],
      },
      outcomes: {
        title: "Wat een goede bedrijfsreeks mogelijk maakt",
        intro: "Je ontvangt beelden met voldoende variatie om één verhaal op meerdere plaatsen te vertellen.",
        items: [
          { title: "Een menselijk gezicht", description: "Portretten en interacties maken duidelijk met wie klanten en kandidaten zullen samenwerken." },
          { title: "Zichtbaar vakmanschap", description: "Handelingen, materialen en details tonen concreet wat je team dagelijks doet." },
          { title: "Visuele samenhang", description: "Eenzelfde licht- en kleurtaal verbindt website, vacatures, sociale media en presentaties." },
        ],
      },
      idealFor: {
        title: "Voor bedrijven met een echt verhaal op de werkvloer",
        intro: "Bedrijfsfotografie past vooral wanneer je eigen mensen, omgeving of proces mee het verschil uitleggen.",
        items: [
          { title: "KMO's en familiebedrijven", description: "Breng team, cultuur en dagelijkse betrokkenheid in beeld zonder formele afstand." },
          { title: "Technische en uitvoerende teams", description: "Maak moeilijk uit te leggen werkzaamheden zichtbaar via overzicht en detail." },
          { title: "Professionele dienstverleners", description: "Ondersteun expertise met rustige portretten, overlegmomenten en herkenbare situaties." },
        ],
      },
      deliverables: {
        title: "Een bedrijfsbeeldbank klaar voor dagelijks gebruik",
        intro: "De exacte samenstelling volgt uit de briefing, met duidelijke afspraken over selectie en toepassingen.",
        items: [
          { title: "Afgewerkte fotoselectie", description: "Een gecureerde reeks met kleurcorrectie, contrast, uitsnede en consequente uitstraling." },
          { title: "Webbestanden", description: "Geoptimaliseerde exports voor site, blog, nieuwsbrief en online profiel." },
          { title: "Bestanden voor drukwerk", description: "Grotere bestanden voor brochures, beursmateriaal of interne publicaties wanneer afgesproken." },
          { title: "Kanaalgerichte uitsneden", description: "Een afgesproken set liggende, vierkante of staande varianten voor concrete plaatsingen." },
        ],
      },
      pricing: {
        title: "Welke keuzes bepalen de prijs van bedrijfsfotografie?",
        paragraphs: [
          "Een offerte vertrekt van wat er inhoudelijk en organisatorisch nodig is. Een compacte sessie met één team en één ruimte vraagt een andere voorbereiding dan een beeldbank over verschillende afdelingen, processen of vestigingen. We bespreken daarom eerst het gewenste gebruik en de onmisbare scènes.",
          "Ook de hoeveelheid regie, logistiek en nabewerking speelt mee. Door prioriteiten vooraf vast te leggen, kan je kernbeelden onderscheiden van aanvullend materiaal. De offerte benoemt de afgesproken productie en oplevering, zonder een standaardpakket op je organisatie te plakken.",
        ],
        factors: ["Aantal locaties en ruimtes", "Aantal medewerkers of teams", "Omvang en detail van de shotlist", "Benodigde styling en props", "Toegang, veiligheid en logistiek", "Variatie in lichtopstellingen", "Aantal gewenste eindbeelden", "Formaten en nabewerkingsniveau"],
      },
      whyVisualVibe: {
        title: "Waarom bedrijfsfotografie met VisualVibe",
        intro: "We verbinden de fotosessie met het communicatiedoel, zodat mooie beelden ook praktisch inzetbaar blijven.",
        items: [
          { title: "Gerichte voorbereiding", description: "De shotlist koppelt elke belangrijke scène aan doelgroep, boodschap en kanaal." },
          { title: "Rust op locatie", description: "Duidelijke aanwijzingen helpen medewerkers natuurlijk bewegen zonder hun werkcontext te verliezen." },
          { title: "Brede blik op content", description: "We houden rekening met websitekaders, sociale formaten en toekomstige campagnes." },
        ],
      },
      regional: {
        title: "Bedrijfsfotograaf voor Limburg en ruime omgeving",
        description: "Vanuit Limburg plannen we bedrijfsfotografie bij zelfstandigen en KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met aandacht voor de praktische realiteit van elke locatie.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Welke beelden ontbreken nog in je bedrijfscommunicatie?",
        description: "Vertel ons waar je foto's voor wil gebruiken en welke mensen of processen centraal staan. We denken mee over een relevante shotlist en heldere productie.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  "zakelijke-portretten": {
    intro:
      "Zakelijke portretten laten je team professioneel en benaderbaar verschijnen op de website, LinkedIn, in een voorstel of publicatie. We kiezen een portretstijl die klopt met je functie en merk, begeleiden iedereen voor de camera en bewaken de lijn wanneer meerdere collega's worden gefotografeerd.",
    excerpt:
      "Verzorgde portretten met gerichte begeleiding, een passende achtergrond en consistente uitsneden voor elk profiel.",
    process: [
      {
        title: "De gewenste uitstraling bepalen",
        description:
          "We bekijken voorbeelden, merkuitstraling en gebruiksplaatsen. Daarbij kiezen we bewust tussen formeel of losser, studioachtig of contextueel, neutraal of zichtbaar verbonden met je werkplek.",
      },
      {
        title: "Achtergrond en licht voorbereiden",
        description:
          "We beoordelen de beschikbare ruimte, plannen een mobiele lichtopstelling en geven kledingadvies. Voor grotere teams maken we een volgorde die wachttijd en onderbreking beperkt.",
      },
      {
        title: "Iedere persoon gericht begeleiden",
        description:
          "Tijdens de sessie geven we concrete aanwijzingen voor houding, blik en positie. We variëren subtiel, zodat er per persoon een geloofwaardige keuze ontstaat binnen dezelfde portretstijl.",
      },
      {
        title: "Portretten zorgvuldig gelijkmaken",
        description:
          "We selecteren de sterkste beelden en stemmen kleur, helderheid en uitsnede onderling af. Retouche blijft natuurlijk en volgt de vooraf besproken mate van afwerking.",
      },
    ],
    faqs: [
      {
        question: "Kunnen zakelijke portretten gewoon bij ons op kantoor?",
        answer:
          "Ja, als er voldoende geschikte ruimte is voor achtergrond, licht en afstand. We bekijken vooraf foto's of praktische informatie over de locatie. Een vergaderruimte, rustige wand of herkenbare kantoorzone kan elk een andere uitstraling geven.",
      },
      {
        question: "Wat dragen we voor een professionele profielfoto?",
        answer:
          "Kies kleding waarin je je representatief én jezelf voelt. Fijne drukke patronen of glanzende stoffen kunnen afleiden. We stemmen advies af op achtergrond, merkkleuren, functie en de mate waarin je team uniform wil ogen.",
      },
      {
        question: "Wat als iemand ongemakkelijk is voor de camera?",
        answer:
          "Dat komt vaak voor. We bouwen de pose stap voor stap op, houden aanwijzingen eenvoudig en laten ruimte om even te wennen. Kleine aanpassingen in houding en blik geven meestal een natuurlijker resultaat dan een geforceerde glimlach.",
      },
      {
        question: "Kunnen nieuwe medewerkers later in dezelfde stijl worden toegevoegd?",
        answer:
          "Dat kan wanneer achtergrond, lichtopstelling, camerapositie en afwerking reproduceerbaar zijn. We leggen de gekozen stijl zorgvuldig vast. Verschillen in locatie of omgevingslicht bespreken we vooraf, omdat die invloed kunnen hebben op de overeenkomst.",
      },
      {
        question: "Worden huid en kleding geretoucheerd?",
        answer:
          "We corrigeren kleur en kunnen tijdelijke onregelmatigheden of storende plooien subtiel verzorgen wanneer dat is afgesproken. We behouden normale huidtextuur en persoonlijke kenmerken, tenzij je voor de sessie een andere, concrete afwerking vraagt.",
      },
    ],
    relatedServices: ["bedrijfsfotografie", "brandingfotografie", "wervingsvideo", "webdesign"],
    seo: {
      title: "Zakelijke portretten voor teams in Limburg | VisualVibe",
      description:
        "Zakelijke portretten voor website en LinkedIn, met rustige begeleiding, passend licht en consistente afwerking voor zelfstandigen, directies en teams.",
      keywords: ["zakelijke portretten", "zakelijke profielfoto", "LinkedIn foto laten maken", "teamportretten Limburg"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "zakelijke portretten",
        supportingKeywords: ["professionele profielfoto", "LinkedIn foto laten maken", "bedrijfsportret", "teamportretten"],
        type: "commercial",
      },
      overview: {
        title: "Zakelijke portretten die professioneel én eigen voelen",
        paragraphs: [
          "Zakelijke portretten bepalen vaak de eerste indruk nog vóór een gesprek plaatsvindt. Een profielfoto voor een zelfstandig expert vraagt soms om nabijheid en persoonlijkheid, terwijl een directieteam baat kan hebben bij een rustigere, meer uniforme beeldtaal. We zoeken niet naar één standaardpose, maar naar de balans tussen de persoon, de rol en de uitstraling van je organisatie.",
          "Voor een teamreeks zijn herhaalbaarheid en aandacht voor het individu even belangrijk. We zetten licht en kader consequent op, terwijl we houding en expressie per persoon verfijnen. Vooraf bekijken we waar de foto's terechtkomen, want een ronde avatar, smalle teampagina en sprekersbio vragen elk voldoende ruimte rond het gezicht en een geschikte uitsnede.",
        ],
        highlights: ["Individuele begeleiding voor de camera", "Consistente stijl voor volledige teams", "Op locatie met mobiele belichting"],
      },
      outcomes: {
        title: "Portretten die je rol helder ondersteunen",
        intro: "De reeks sluit aan bij je professionele context zonder persoonlijkheid weg te poetsen.",
        items: [
          { title: "Een passende eerste indruk", description: "Licht, achtergrond en expressie sluiten aan bij de gewenste benaderbaarheid en deskundigheid." },
          { title: "Een herkenbaar team", description: "Vaste kaders en afwerking brengen verschillende collega's visueel bij elkaar." },
          { title: "Flexibele profielen", description: "Doordachte kadrering maakt gebruik op teampagina, LinkedIn en publicaties eenvoudiger." },
        ],
      },
      idealFor: {
        title: "Voor professionals die zichtbaar het woord nemen",
        intro: "Een portretsessie is relevant wanneer personen een centrale rol spelen in vertrouwen, advies of vertegenwoordiging.",
        items: [
          { title: "Zelfstandige experts", description: "Gebruik één herkenbaar gezicht over website, profiel en vakinhoudelijke bijdragen." },
          { title: "Directie en management", description: "Creëer een verzorgde reeks voor corporate communicatie, persvragen en presentaties." },
          { title: "Volledige medewerkersploegen", description: "Breng teamleden consequent in beeld voor organisatie- en contactpagina's." },
        ],
      },
      deliverables: {
        title: "Portretbestanden in de juiste verhouding",
        intro: "We spreken vooraf af hoeveel keuzes en welke toepassingen onderdeel zijn van de sessie.",
        items: [
          { title: "Geselecteerde hoofdportretten", description: "Afgewerkte beelden per deelnemer volgens de afgesproken selectiewijze." },
          { title: "Profielformaten", description: "Vierkante of compacte uitsneden die rekening houden met avatars en profielkaarten." },
          { title: "Website-uitsneden", description: "Ruimere varianten voor teamoverzichten, bio's of contactpagina's." },
          { title: "Hoge-resolutiebestanden", description: "Bestanden voor drukwerk of externe publicatie als die toepassing in de briefing staat." },
          { title: "Consistente bestandsnamen", description: "Naamgeving per collega zodat communicatie of HR de portretten efficiënt beheert." },
        ],
      },
      pricing: {
        title: "Hoe wordt een reeks zakelijke portretten begroot?",
        paragraphs: [
          "De prijs hangt af van het aantal personen, de gekozen setting en hoeveel varianten per deelnemer nodig zijn. Eén portret van een zaakvoerder heeft een andere opbouw dan een mobiele set waarmee een volledig team in een identieke stijl wordt gefotografeerd.",
          "Ook voorbereiding, ruimtewissels, haar- of kledingcorrecties en de gewenste retouche hebben invloed. We vragen daarom naar je deelnemerslijst en concrete plaatsingen. Daarmee kunnen we de sessie logisch organiseren en de afwerking nauwkeurig omschrijven in de offerte.",
        ],
        factors: ["Aantal te fotograferen personen", "Aantal beelden per persoon", "Eén of meerdere achtergronden", "Opbouw van mobiele belichting", "Kleding- of stijladvies", "Selectiemethode", "Mate van natuurlijke retouche", "Benodigde uitsneden en exports"],
      },
      whyVisualVibe: {
        title: "Waarom portretten laten maken door VisualVibe",
        intro: "Technische consistentie gaat bij ons samen met duidelijke, menselijke begeleiding.",
        items: [
          { title: "Aandacht per persoon", description: "We zoeken een geloofwaardige houding en expressie in plaats van iedereen identiek te laten poseren." },
          { title: "Een reproduceerbare stijl", description: "Licht, achtergrond en uitsnede worden bewust vastgelegd voor een samenhangende teamreeks." },
          { title: "Kaders met bestemming", description: "De opname houdt al rekening met de plaatsen waar communicatie de portretten nodig heeft." },
        ],
      },
      regional: {
        title: "Zakelijke portretfotografie in Limburg en daarbuiten",
        description: "We bouwen onze mobiele portretopstelling op bij bedrijven in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, afgestemd op de beschikbare ruimte en je teamplanning.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Geef je team een portretstijl die echt past",
        description: "Deel het aantal personen, de locatie en de plekken waar de portretten verschijnen. Dan werken we een passende setting en duidelijke offerte uit.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  productfotografie: {
    intro:
      "Met productfotografie presenteer je elk artikel helder, consistent en passend bij het verkoopkanaal. We stemmen achtergrond, licht, camerastandpunt en styling af op je assortiment, van vrijstaande webshopbeelden tot detailfoto's en sfeerbeelden die materiaal, gebruik en merkgevoel verduidelijken.",
    excerpt:
      "Consistente productbeelden voor webshop, catalogus en campagne, opgebouwd rond je assortiment en technische beeldspecificaties.",
    process: [
      {
        title: "Assortiment en beeldlijst inventariseren",
        description:
          "We brengen producten, varianten, afmetingen en gewenste aanzichten in kaart. Tegelijk verzamelen we de technische eisen van webshop, marktplaats, catalogus of campagne waarvoor de foto's dienen.",
      },
      {
        title: "Een testopstelling vastleggen",
        description:
          "Voor de reeks bepalen we achtergrond, ondergrond, licht, schaduw en camerahoek. Bij sfeerfotografie bespreken we ook props, compositie en de context waarin het product geloofwaardig verschijnt.",
      },
      {
        title: "De productreeks systematisch opnemen",
        description:
          "We werken volgens de goedgekeurde beeldlijst en controleren plaatsing, labels, oppervlakken en kleurreferentie. Zo blijven vergelijkbare producten onderling herkenbaar en is duidelijk welke varianten zijn afgewerkt.",
      },
      {
        title: "Retoucheren en correct exporteren",
        description:
          "Na selectie verzorgen we stofjes, kleine storingen, perspectief en kleur binnen de afgesproken grenzen. Vervolgens leveren we beeldverhouding, resolutie en achtergrond volgens het gekozen kanaal aan.",
      },
    ],
    faqs: [
      {
        question: "Fotograferen jullie op wit én in een sfeeropstelling?",
        answer:
          "Ja. Vrijstaande beelden maken producten vergelijkbaar en overzichtelijk, terwijl sfeerbeelden gebruik en merkcontext tonen. Beide stijlen kunnen in één productie, mits we per opstelling de benodigde aanzichten, props en formaten vooraf bepalen.",
      },
      {
        question: "Hoe leveren we producten aan voor de fotosessie?",
        answer:
          "Producten moeten compleet, correct gelabeld, schoon en bij voorkeur per variant gesorteerd aankomen. We spreken ontvangst, controle, verpakking en retour vooraf af. Breekbare, waardevolle of moeilijk vervoerbare objecten vragen een aangepaste logistieke afspraak.",
      },
      {
        question: "Kunnen glanzende of transparante producten goed gefotografeerd worden?",
        answer:
          "Dat kan, maar reflectie en transparantie vereisen een specifieke lichtopstelling en vaak extra afwerking. We bekijken materiaal, vorm en gewenste achtergrond vooraf, zodat de offerte rekening houdt met de technische moeilijkheid per productgroep.",
      },
      {
        question: "Kloppen kleuren op de foto exact met het echte product?",
        answer:
          "We werken zorgvuldig met gecontroleerd licht en kleurcorrectie, maar schermen, drukprocessen en materialen tonen kleur elk anders. Wanneer kleurkritische weergave belangrijk is, bespreken we referenties, workflow en verwachtingen expliciet voor de opname.",
      },
      {
        question: "Kunnen jullie beelden volgens de eisen van onze webshop exporteren?",
        answer:
          "Ja. Bezorg ons vooraf de gewenste pixels, beeldverhouding, bestandsindeling, achtergrond en naamgeving. We kunnen een afgesproken exportset voorbereiden, zodat je beelden niet achteraf handmatig voor elk product hoeft aan te passen.",
      },
    ],
    relatedServices: ["webshop-laten-maken", "brandingfotografie", "social-media-video", "seo-copywriting"],
    seo: {
      title: "Productfotografie voor webshops in Limburg | VisualVibe",
      description:
        "Productfotografie voor webshop, catalogus en campagne: consistente vrijstaande foto's, details en sfeerbeelden volgens je merk en technische eisen.",
      keywords: ["productfotografie", "productfoto's webshop", "productfotograaf Limburg", "sfeerfoto's producten"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "productfotografie",
        supportingKeywords: ["productfoto's laten maken", "webshop fotografie", "packshot fotografie", "productfotograaf Limburg"],
        type: "commercial",
      },
      overview: {
        title: "Productfotografie die vergelijken én beleven ondersteunt",
        paragraphs: [
          "Productfotografie moet twee taken kunnen vervullen. In een webshop wil een bezoeker vorm, kleur, afwerking en relevante details zonder afleiding beoordelen. In een campagne wil je daarnaast laten voelen hoe het product gebruikt wordt en binnen je merkwereld past. Daarom bepalen we per beeldtype welke informatie centraal staat, in plaats van alle artikelen met dezelfde aanpak te behandelen.",
          "Bij grotere reeksen is een reproduceerbare set essentieel. We leggen camerapositie, brandpunt, lichtverhouding en productplaatsing vast en volgen een duidelijke beeldlijst. Voor sfeerbeelden ontwikkelen we composities rond doelgroep en toepassing. De nabewerking richt zich op een verzorgde, geloofwaardige weergave en op bestanden die technisch passen in je bestaande publicatieproces.",
        ],
        highlights: ["Vrijstaand, detail en sfeer combineerbaar", "Vaste opstelling voor productreeksen", "Exports volgens kanaalspecificaties", "Zorgvuldige kleur- en oppervlakcorrectie"],
      },
      outcomes: {
        title: "Beelden die productinformatie visueel ordenen",
        intro: "Een geplande reeks helpt klanten kijken en geeft je merk een herkenbare productpresentatie.",
        items: [
          { title: "Eenvoudiger vergelijken", description: "Vaste hoeken en schalen brengen varianten binnen een assortiment overzichtelijk samen." },
          { title: "Zichtbare eigenschappen", description: "Details tonen materiaal, textuur, bediening en afwerking waar woorden tekortschieten." },
          { title: "Meer merkcontext", description: "Sfeercomposities verbinden een product met een gebruiksmoment en visuele identiteit." },
        ],
      },
      idealFor: {
        title: "Voor assortimenten die visuele duidelijkheid nodig hebben",
        intro: "De productie wordt afgestemd op de omvang, materialen en verkoopcontext van je collectie.",
        items: [
          { title: "Webshops en merken", description: "Bouw consistente productpagina's met afgesproken hoofdaanzichten en details." },
          { title: "Makers en ontwerpers", description: "Toon afwerking, materiaalkeuze en eigenheid in een verzorgde reeks." },
          { title: "Groothandel en fabrikanten", description: "Structureer veel referenties voor catalogus, dealerportaal of technische communicatie." },
          { title: "Horeca en retail", description: "Combineer heldere aanbodbeelden met sfeervolle toepassingen voor promotie." },
        ],
      },
      deliverables: {
        title: "Een productset afgestemd op je publicatieflow",
        intro: "We leggen aantallen en specificaties vast in een beeldlijst vóór de opname begint.",
        items: [
          { title: "Hoofdaanzichten", description: "Consistente overzichtsfoto's per product of variant volgens afgesproken hoek." },
          { title: "Detailbeelden", description: "Close-ups van relevante materialen, functies, aansluitingen of afwerking." },
          { title: "Vrijstaande exports", description: "Beelden met afgesproken egale of vrijgemaakte achtergrond wanneer de productie dat omvat." },
          { title: "Sfeerselectie", description: "Gestylde beelden rond gebruik, schaal en merkcontext indien voorzien in de briefing." },
          { title: "Technische exportset", description: "Afmetingen, kleurprofiel, bestandsformaat en compressie passend bij je kanalen." },
          { title: "Gestructureerde naamgeving", description: "Bestandsnamen op basis van SKU, productnaam of je eigen importlogica." },
        ],
      },
      pricing: {
        title: "Wat bepaalt de investering in productfotografie?",
        paragraphs: [
          "Productfotografie wordt niet alleen begroot op het aantal artikelen. Een reeks eenvoudige producten in één vaste hoek verschilt sterk van objecten die montage, nauwkeurige styling, meerdere lichtsets of uitgebreide vrijmaking vragen. Ook het aantal varianten en aanzichten telt mee.",
          "We maken de berekening betrouwbaarder met een productlijst, referentiefoto's en de exacte kanaaleisen. Een testbeeld kan helpen om de gewenste standaard vast te leggen. Zo worden productie, retouche en export als afzonderlijke keuzes helder omschreven.",
        ],
        factors: ["Aantal producten en varianten", "Aantal aanzichten per artikel", "Materiaal en reflectiegraad", "Vrijstaand of gestyled beeld", "Benodigde props en ondergronden", "Productvoorbereiding of montage", "Complexiteit van retouche", "Vrijmaken van achtergronden", "Bestandsformaten en naamgeving"],
      },
      whyVisualVibe: {
        title: "Waarom productfotografie door VisualVibe",
        intro: "We behandelen je beelden als een herhaalbaar contentsysteem, niet als een verzameling losse foto's.",
        items: [
          { title: "Technische voorbereiding", description: "Beeldspecificaties en productlijst sturen de opname vanaf het eerste testbeeld." },
          { title: "Consistentie in de reeks", description: "Een vaste set en controlepunten houden hoeken, schaduw en schaal herkenbaar." },
          { title: "Merk en verkoopkanaal verbonden", description: "We combineren visuele stijl met de praktische eisen van webshop, catalogus en campagne." },
        ],
      },
      regional: {
        title: "Productfotograaf voor Limburg en omliggende regio's",
        description: "We plannen productfotografie voor ondernemingen in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, in een geschikte opstelling of op locatie wanneer het product dat vraagt.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Leg je assortiment en gewenste beeldstijl voor",
        description: "Bezorg ons je productlijst, voorbeelden en technische eisen. We vertalen ze naar een duidelijke productieopzet en gerichte offerte.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  eventfotografie: {
    intro:
      "Eventfotografie bewaart wat er gebeurde en maakt zichtbaar hoe een bedrijfsevent aanvoelde en wie betrokken was. We leggen ontvangst, sprekers, publiek, interacties, aankleding en sleutelmomenten vast, met een beeldplan dat aansluit bij communicatie tijdens en na je bijeenkomst.",
    excerpt:
      "Een alert en sfeervol beeldverslag van je bedrijfsevent, met aandacht voor programma, gasten en merkdetails.",
    process: [
      {
        title: "Programma en beeldprioriteiten doornemen",
        description:
          "We bespreken draaiboek, locatie, publiek en publicatiekanalen. Je duidt onmisbare momenten en personen aan, zodat toespraken, onthullingen, partners en netwerkmomenten niet aan toeval worden overgelaten.",
      },
      {
        title: "Fotoposities en afspraken voorbereiden",
        description:
          "We bekijken licht, toegang, podiumroutes, branding en eventuele beperkingen. Ook spreken we af hoe we omgaan met gasten, portretverzoeken en zones waar niet gefotografeerd mag worden.",
      },
      {
        title: "Het evenement als verhaal volgen",
        description:
          "Tijdens het programma bewegen we onopvallend tussen overzicht, actie, reacties en details. Voor belangrijke groepsbeelden of protocollaire momenten nemen we kort de nodige regie.",
      },
      {
        title: "Een ritmische reportagereeks samenstellen",
        description:
          "We verwijderen doublures, kiezen een gevarieerde verhaallijn en werken licht en kleur consistent af. De export sluit aan bij afgesproken pers-, website- en sociale toepassingen.",
      },
    ],
    faqs: [
      {
        question: "Welke informatie heeft een eventfotograaf vooraf nodig?",
        answer:
          "Een actueel draaiboek, adresgegevens, contactpersoon, belangrijke namen en momenten zijn de basis. Daarnaast helpen plattegrond, huisstijl, gewenste publicaties en regels van locatie of organisatie om gericht en zonder onnodige onderbrekingen te werken.",
      },
      {
        question: "Kan er tijdens een lezing discreet worden gefotografeerd?",
        answer:
          "We kiezen posities en bewegingen met respect voor spreker en publiek en vermijden waar mogelijk storende handelingen. De omstandigheden van zaal, podium en licht bepalen welke beelden technisch en praktisch haalbaar zijn zonder het programma te hinderen.",
      },
      {
        question: "Hoe gaan jullie om met gasten die niet op foto willen?",
        answer:
          "De organisator communiceert het eigen foto- en privacybeleid aan bezoekers en wij volgen herkenbare aanwijzingen of afgebakende zones. Bij twijfel kunnen we anders kaderen of een persoon vermijden. Concrete afspraken horen in de briefing.",
      },
      {
        question: "Kunnen we specifieke partners en genodigden laten fotograferen?",
        answer:
          "Zeker. Bezorg een namenlijst en wijs liefst een contactpersoon aan die mensen ter plaatse herkent en samenbrengt. Zo kunnen we geplande combinaties maken zonder de spontane reportage van het overige programma uit het oog te verliezen.",
      },
      {
        question: "Is eventfotografie te combineren met een aftermovie?",
        answer:
          "Ja, fotografie en video kunnen vanuit één draaiboek worden voorbereid. We stemmen posities, sleutelmomenten en prioriteiten af, zodat beide disciplines ruimte hebben en de uiteindelijke content visueel bij elkaar aansluit.",
      },
    ],
    relatedServices: ["event-aftermovie", "event-dronebeelden", "brandingfotografie", "social-media-video"],
    seo: {
      title: "Eventfotografie voor bedrijven in Limburg | VisualVibe",
      description:
        "Eventfotografie voor congressen, openingen en bedrijfsmomenten: een sfeervolle reportage van programma, gasten, sprekers en herkenbare merkdetails.",
      keywords: ["eventfotografie", "eventfotograaf Limburg", "bedrijfsfeest fotograaf", "fotograaf congres"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "eventfotografie",
        supportingKeywords: ["eventfotograaf Limburg", "bedrijfsfeest fotograaf", "congresfotografie", "fotoreportage evenement"],
        type: "commercial",
      },
      overview: {
        title: "Eventfotografie die programma én sfeer samenbrengt",
        paragraphs: [
          "Eventfotografie vraagt voortdurend keuzes. Een applaus duurt maar even, een spreker beweegt door verschillend licht en waardevolle ontmoetingen ontstaan buiten het podium. Met het draaiboek als houvast volgen we de energie van het moment. We brengen niet alleen de formele hoogtepunten in beeld, maar ook reacties, gesprekken, locatie en details die tonen hoe zorgvuldig het evenement is opgebouwd.",
          "Het beoogde gebruik bepaalt mee waar we op letten. Een intern verslag vraagt andere accenten dan partnercommunicatie, een volgende editie of korte sociale updates. Vooraf maken we daarom een prioriteitenlijst en spreken we praktische grenzen af. Na het evenement bouwen we een selectie met variatie in personen, beeldafstand en ritme, zodat de reportage als geheel blijft boeien.",
        ],
        highlights: ["Draaiboekgestuurde reportage", "Aandacht voor gasten en reacties", "Overzicht, actie en merkdetails"],
      },
      outcomes: {
        title: "Een evenement dat zichtbaar verder leeft",
        intro: "De fotoreeks geeft meerdere doelgroepen een geloofwaardige terugblik op inhoud en beleving.",
        items: [
          { title: "Een volledig verslag", description: "Van aankomst tot afsluiting vormen programma en randmomenten samen één herkenbaar verhaal." },
          { title: "Content voor vervolgcommunicatie", description: "Variatie in kaders ondersteunt terugblik, bedanking, partnerbericht en aankondiging." },
          { title: "Zichtbaarheid voor betrokkenen", description: "Sprekers, medewerkers, sponsors en publiek krijgen elk een passende plaats in de reeks." },
        ],
      },
      idealFor: {
        title: "Voor zakelijke bijeenkomsten met momenten die tellen",
        intro: "We stemmen aanwezigheid en stijl af op het programma, de locatie en het publiek.",
        items: [
          { title: "Openingen en lanceringen", description: "Leg onthulling, genodigden, product en merksetting in één reportage vast." },
          { title: "Congressen en studiedagen", description: "Combineer sprekers, publiek, workshops en ontmoetingen met inhoudelijke context." },
          { title: "Bedrijfsfeesten en jubilea", description: "Bewaar sfeer, waardering en informele interactie zonder het feest te regisseren." },
        ],
      },
      deliverables: {
        title: "Een gecureerde fotoreportage per communicatiebehoefte",
        intro: "De overeengekomen selectie en exports volgen de aard van je event en je publicatieplan.",
        items: [
          { title: "Verhalende hoofdselectie", description: "Een afgewerkte reeks met hoogtepunten, sfeer, reacties en context." },
          { title: "Sprekers- en podiummateriaal", description: "Sterke kaders van presentaties, panels, optredens of officiële momenten." },
          { title: "Gasten en interacties", description: "Spontane gesprekken en gerichte groepsbeelden waar het programma ruimte biedt." },
          { title: "Merk- en locatiedetails", description: "Aankleding, signing, catering en architectuur die de identiteit van het event dragen." },
          { title: "Kanaalgerichte bestanden", description: "Web- en drukexports of afgesproken sociale uitsneden voor vervolgcontent." },
        ],
      },
      pricing: {
        title: "Welke factoren bepalen de prijs van eventfotografie?",
        paragraphs: [
          "De omvang van een event is niet alleen een kwestie van aanwezigheid. Een programma op één podium vraagt een andere aanpak dan parallelle sessies, meerdere verdiepingen of veel specifieke gasten. We kijken naar het draaiboek en de verwachte beelddekking.",
          "Verder beïnvloeden bereikbaarheid, lichtomstandigheden, selectievolume en gewenste exports de productie. Als er tijdens het event al materiaal voor communicatie nodig is, vraagt dat een afzonderlijke workflow en afstemming. Alle gekozen onderdelen worden vooraf in de offerte beschreven.",
        ],
        factors: ["Omvang van het programma", "Aantal zalen of eventzones", "Aantal verplichte momenten", "Licht en technische omstandigheden", "Toegang en verplaatsingen", "Gewenste breedte van de selectie", "Eventuele groepsopstellingen", "Exports voor verschillende kanalen", "Afstemming met video of organisatie"],
      },
      whyVisualVibe: {
        title: "Waarom je event laten fotograferen door VisualVibe",
        intro: "We combineren voorbereiding met alertheid, zodat het draaiboek richting geeft zonder spontane momenten te missen.",
        items: [
          { title: "Inhoudelijk voorbereid", description: "Namen, partners en programmaonderdelen krijgen vooraf een duidelijke prioriteit." },
          { title: "Discreet aanwezig", description: "We zoeken sterke posities met zo weinig mogelijk verstoring voor gasten en sprekers." },
          { title: "Communicatiegericht geselecteerd", description: "De eindreeks bevat niet alleen hoogtepunten, maar ook bruikbare overgangen, details en context." },
        ],
      },
      regional: {
        title: "Eventfotograaf in Limburg, Vlaanderen en de grensregio",
        description: "We verzorgen eventfotografie voor organisaties in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met een voorbereiding die rekening houdt met locatie, draaiboek en lokale contactpersonen.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Zet je volgende event al in het juiste kader",
        description: "Bezorg ons datum, locatie, programma en beeldprioriteiten. We bekijken welke reportagevorm en dekking bij je communicatiedoelen passen.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  vastgoedfotografie: {
    intro:
      "Vastgoedfotografie brengt de ruimte, indeling, materialen en sfeer van een pand helder in beeld. Voor makelaars, projectontwikkelaars en professionele eigenaars plannen we de opname rond licht, voorbereiding en publicatiekanaal, zodat woning, kantoor, handelsruimte of project correct en aantrekkelijk wordt gepresenteerd.",
    excerpt:
      "Heldere en evenwichtige vastgoedbeelden met aandacht voor ruimtegevoel, lijnen, licht en relevante verkoopdetails.",
    process: [
      {
        title: "Pand en publicatiedoel inventariseren",
        description:
          "We bespreken type vastgoed, belangrijkste troeven, doelgroep en gewenste kanalen. De contactpersoon ontvangt praktische voorbereidingstips voor opruimen, styling, toegang, verlichting en buitenzones.",
      },
      {
        title: "Opnameroute en lichtmoment kiezen",
        description:
          "We bepalen een logische volgorde door het pand en kijken naar oriëntatie, daglicht en weersgevoelige buitenbeelden. Bij grotere sites duiden we prioritaire ruimtes en zichtlijnen aan.",
      },
      {
        title: "Ruimtes consequent fotograferen",
        description:
          "Op locatie werken we met gecontroleerde standpunten en verticale lijnen. We combineren overzicht met details, corrigeren kleine storingen waar mogelijk en bewaken een natuurlijke indruk van schaal.",
      },
      {
        title: "Licht en perspectief verfijnen",
        description:
          "In de selectie brengen we helderheid en kleur in balans, verzorgen we perspectief en ordenen we de reeks volgens een logische rondgang. Bestanden worden passend geëxporteerd.",
      },
    ],
    faqs: [
      {
        question: "Hoe moet een pand voorbereid zijn voor vastgoedfoto's?",
        answer:
          "Maak oppervlakken vrij, verwijder persoonlijke of tijdelijke spullen, werk kabels weg en controleer lampen, ramen en buitenruimte. Een opgeruimd maar geloofwaardig interieur laat indeling en materiaal beter spreken dan overmatige decoratie.",
      },
      {
        question: "Is vastgoedfotografie ook geschikt voor een leeg pand?",
        answer:
          "Ja. Bij lege ruimtes letten we extra op geometrie, verbinding tussen kamers, licht en afwerking. De opname toont wat werkelijk aanwezig is. Eventuele virtuele inrichting is geen standaardonderdeel en moet afzonderlijk en transparant worden besproken.",
      },
      {
        question: "Wat gebeurt er bij slecht weer op de geplande dag?",
        answer:
          "Binnenbeelden kunnen vaak doorgaan, afhankelijk van het beschikbare licht en het gewenste karakter. Voor belangrijke gevels, uitzichten of tuinen beoordelen we samen of de omstandigheden passend zijn en welke onderdelen eventueel anders gepland moeten worden.",
      },
      {
        question: "Kunnen dronebeelden en een 3D-tour tegelijk worden voorzien?",
        answer:
          "Die diensten kunnen inhoudelijk worden afgestemd rond dezelfde ruimtes en verkoopargumenten. Toegang, omstandigheden en technische of wettelijke randvoorwaarden verschillen per opnamevorm, dus we leggen planning en verantwoordelijkheden vooraf apart vast.",
      },
      {
        question: "Worden storende elementen uit vastgoedfoto's verwijderd?",
        answer:
          "Kleine tijdelijke storingen kunnen binnen de afgesproken nabewerking worden verzorgd. We wijzigen geen wezenlijke kenmerken van het pand. Voor verkoop- of verhuurcommunicatie blijft een eerlijke voorstelling belangrijk en stemt de opdrachtgever publicatie af op toepasselijke regels.",
      },
    ],
    relatedServices: ["vastgoed-3d-tour", "vastgoed-dronebeelden", "virtuele-rondleiding", "promovideo"],
    seo: {
      title: "Vastgoedfotografie voor makelaars Limburg | VisualVibe",
      description:
        "Vastgoedfotografie voor woningen, kantoren en projecten, met heldere ruimtes, verzorgde lijnen en beelden klaar voor advertenties, dossiers en websites.",
      keywords: ["vastgoedfotografie", "vastgoedfotograaf Limburg", "interieurfotografie vastgoed", "woningfotografie"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "vastgoedfotografie",
        supportingKeywords: ["vastgoedfotograaf Limburg", "woning laten fotograferen", "interieurfotografie", "professionele immofoto's"],
        type: "commercial",
      },
      overview: {
        title: "Vastgoedfotografie die ruimte en indeling leesbaar maakt",
        paragraphs: [
          "Vastgoedfotografie helpt een kijker begrijpen hoe een pand in elkaar zit. Een extreem brede hoek kan een kamer groter doen lijken, maar geeft niet noodzakelijk een betrouwbare indruk. We kiezen standpunten die zichtlijnen, verhoudingen en verbindingen duidelijk maken en tegelijk de sterke materialen, lichtinval en functies van de ruimte tonen.",
          "Een goede opname begint vóór de camera wordt opgesteld. Opruimen, verlichting controleren en buitenzones verzorgen heeft rechtstreeks invloed op het beeld. We plannen vervolgens rond daglicht en een logische route. In de nabewerking brengen we binnen- en buitenlicht in evenwicht en verzorgen we lijnen en kleur, zonder structurele eigenschappen te verhullen of een onrealistisch beeld te creëren.",
        ],
        highlights: ["Natuurlijke indruk van ruimte", "Verzorgde verticale lijnen", "Logische reeks door het pand", "Combinatie van overzicht en detail"],
      },
      outcomes: {
        title: "Een pand dat online duidelijk te beoordelen is",
        intro: "De reeks ondersteunt oriëntatie en presentatie met een consistente visuele rondgang.",
        items: [
          { title: "Leesbare indeling", description: "Opeenvolgende beelden helpen kijkers de relatie tussen ruimtes begrijpen." },
          { title: "Zichtbare troeven", description: "Lichtinval, materialen, buitenruimte en afwerkingsdetails krijgen gerichte aandacht." },
          { title: "Consistente presentatie", description: "Een herkenbare beeldstijl brengt panden binnen een portefeuille professioneel samen." },
        ],
      },
      idealFor: {
        title: "Voor vastgoed dat een heldere presentatie verdient",
        intro: "We fotograferen residentiële en zakelijke ruimtes met aandacht voor hun eigen functie en doelgroep.",
        items: [
          { title: "Makelaars en vastgoedkantoren", description: "Voorzie advertenties en dossiers van een consequente, navigeerbare beeldreeks." },
          { title: "Projectontwikkelaars", description: "Presenteer afgewerkte units, modelruimtes en gemeenschappelijke delen in samenhang." },
          { title: "Professionele verhuurders", description: "Toon woningen, kantoren of handelsruimtes duidelijk bij een nieuwe publicatie." },
          { title: "Architectuurgerichte locaties", description: "Leg ruimtelijke keuzes en kenmerkende materialen vast voor communicatie." },
        ],
      },
      deliverables: {
        title: "Een complete vastgoedselectie voor publicatie",
        intro: "Het beeldplan bepaalt welke ruimtes, details en buitenelementen in de reeks worden opgenomen.",
        items: [
          { title: "Interieuroverzichten", description: "Heldere beelden van prioritaire ruimtes met consequente lijnen en belichting." },
          { title: "Exterieurbeelden", description: "Gevel, toegang en relevante buitenruimte wanneer omstandigheden en briefing dat toelaten." },
          { title: "Architecturale details", description: "Gerichte kaders van materialen, maatwerk of kenmerken die het pand onderscheiden." },
          { title: "Webklare exports", description: "Bestanden passend bij vastgoedplatform, website of digitaal dossier." },
          { title: "Hoge-resolutievarianten", description: "Grotere exports voor brochure of presentatie als die vooraf zijn voorzien." },
        ],
      },
      pricing: {
        title: "Hoe komt de prijs voor vastgoedfotografie tot stand?",
        paragraphs: [
          "De omvang en complexiteit van het pand vormen de basis. Een compact appartement, een ingerichte kantoorverdieping en een site met meerdere gebouwen vereisen elk een andere route, hoeveelheid standpunten en voorbereiding. Ook buitenzones en verplaatsing tussen units tellen mee.",
          "Daarnaast kijken we naar stylingbehoefte, toegang, lichtsituatie, gewenste detaillering en exports. Met een plattegrond, adres, recente referentiefoto's en publicatie-eisen kunnen we de opdracht vooraf helder afbakenen en gericht offreren.",
        ],
        factors: ["Type en omvang van het pand", "Aantal ruimtes of units", "Binnen- en buitenopnames", "Styling en voorbereiding ter plaatse", "Lichtomstandigheden en oriëntatie", "Toegang en verplaatsing", "Aantal gewenste eindbeelden", "Nabewerking en perspectiefcorrectie", "Platform- en brochureformaten"],
      },
      whyVisualVibe: {
        title: "Waarom vastgoedfotografie met VisualVibe",
        intro: "We combineren een verzorgde uitstraling met een heldere, geloofwaardige voorstelling van het pand.",
        items: [
          { title: "Ruimtelijk inzicht", description: "Standpunten worden gekozen om indeling en zichtlijnen te verduidelijken." },
          { title: "Voorbereiding die verschil maakt", description: "Je krijgt concrete aandachtspunten voor licht, opruimen, toegang en prioritaire ruimtes." },
          { title: "Samenhang met andere media", description: "Fotografie kan inhoudelijk aansluiten bij dronebeelden, video of een virtuele rondleiding." },
        ],
      },
      regional: {
        title: "Vastgoedfotograaf in Limburg en omliggende markten",
        description: "We plannen vastgoedfotografie voor panden in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met aandacht voor bereikbaarheid, lichtmoment en lokale contactafspraken.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Breng je pand helder en verzorgd in beeld",
        description: "Stuur het adres, type pand, aantal ruimtes en gewenste publicatiekanalen. We bekijken de geschikte opnameopzet en maken een gerichte offerte.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  realisatiefotografie: {
    intro:
      "Realisatiefotografie documenteert werk met aandacht voor ontwerp, uitvoering en materiaal. Voor bouwbedrijven, interieurbouwers, architecten, installateurs en ambachtelijke ondernemingen maken we een projectreeks die laat zien wat werd gerealiseerd, van ruimtelijk overzicht tot kenmerkend detail.",
    excerpt:
      "Projectfoto's die uitvoering, materiaalkeuze en vakmanschap samenbrengen in een overtuigende portfolio-reeks.",
    process: [
      {
        title: "Projectbijdrage en beeldgebruik scherpstellen",
        description:
          "We bespreken wat je onderneming heeft uitgevoerd, welke details belangrijk zijn en waar de foto's verschijnen. Zo richten we de reeks op je expertise in plaats van alleen op het eindbeeld.",
      },
      {
        title: "Locatie, afwerking en omstandigheden afstemmen",
        description:
          "We controleren toegang, opleverstatus, schoonmaak, gebruikers en gevoeligheden. Voor exterieur of specifieke lichtinval bekijken we welk moment de realisatie het best leesbaar maakt.",
      },
      {
        title: "Van geheel naar detail fotograferen",
        description:
          "We bouwen een visuele route op met context, overzicht, verbindingen en close-ups. Standpunt en licht worden gekozen om vorm, maatwerk, textuur en technische uitvoering duidelijk te tonen.",
      },
      {
        title: "Een projectspecifieke selectie afwerken",
        description:
          "We selecteren zonder overbodige herhaling, corrigeren lijnen en kleur zorgvuldig en bereiden exports voor portfolio, casepagina, aanbesteding, presentatie of sociale content voor.",
      },
    ],
    faqs: [
      {
        question: "Wanneer wordt een afgewerkt project het best gefotografeerd?",
        answer:
          "Idealiter is eigen werk volledig klaar, de werf opgeruimd en de ruimte nog niet visueel overbelast. Tegelijk mogen relevante gebruikerssporen soms net context geven. We bepalen het moment op basis van project, licht en communicatiedoel.",
      },
      {
        question: "Kunnen verschillende uitvoerders dezelfde foto's gebruiken?",
        answer:
          "Samenwerking tussen betrokken partijen kan praktisch zijn, maar beeldkeuze en gebruiksafspraken moeten vooraf duidelijk zijn. We stemmen de shotlist af op ieders bijdrage en leggen vast wie opdrachtgever is en welke oplevering voor wie bedoeld is.",
      },
      {
        question: "Hoe maken foto's ons eigen aandeel in een totaalproject zichtbaar?",
        answer:
          "We vragen vooraf welke onderdelen, materialen of technieken door jouw team zijn uitgevoerd. Vervolgens combineren we contextbeelden met gerichte details en standpunten die de relatie tussen je bijdrage en het geheel duidelijk maken.",
      },
      {
        question: "Kunnen medewerkers of bewoners in de realisatiebeelden voorkomen?",
        answer:
          "Ja, wanneer menselijk gebruik de schaal of functie helpt uitleggen en de nodige afspraken zijn gemaakt. We kunnen personen herkenbaar regisseren, subtiel als sfeer inzetten of juist volledig buiten de reeks houden.",
      },
      {
        question: "Is realisatiefotografie te combineren met dronefoto's?",
        answer:
          "Een luchtperspectief kan ligging, dakwerk, terrein of grotere infrastructuur aanvullen. De haalbaarheid hangt af van locatie, omstandigheden en geldende randvoorwaarden. We stemmen grondbeelden en dronebeelden inhoudelijk op dezelfde projecttroeven af.",
      },
    ],
    relatedServices: ["realisatie-dronebeelden", "bedrijfsfotografie", "vastgoedfotografie", "bedrijfsvideo"],
    seo: {
      title: "Realisatiefotografie voor bouw en interieur | VisualVibe",
      description:
        "Realisatiefotografie voor bouw, interieur en vakwerk: projectbeelden van overzicht tot detail, zorgvuldig voorbereid voor portfolio, cases en presentaties.",
      keywords: ["realisatiefotografie", "projectfotografie bouw", "interieurproject fotograferen", "fotografie vakmanschap"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "realisatiefotografie",
        supportingKeywords: ["projectfotografie bouw", "interieurfotografie realisatie", "werf laten fotograferen", "portfoliofotografie"],
        type: "commercial",
      },
      overview: {
        title: "Realisatiefotografie die je eigen vakwerk centraal zet",
        paragraphs: [
          "Realisatiefotografie maakt een voltooid project bruikbaar als bewijsstuk in je communicatie. Een totaalbeeld toont schaal en context, maar vaak zit jouw meerwaarde in de aansluiting, het materiaal, de maatvoering of een technisch detail. We brengen daarom eerst exact in kaart wat je team heeft ontworpen, gebouwd, geplaatst of afgewerkt en welke toekomstige opdrachtgever dat moet begrijpen.",
          "Op locatie werken we van groot naar klein. We tonen hoe de realisatie in haar omgeving staat, hoe ruimtes of onderdelen met elkaar verbinden en welke details de uitvoering typeren. Daarbij bewaken we licht, lijnen en kleur zonder het eindresultaat kunstmatig te veranderen. De selectie wordt opgebouwd als een compacte case die zowel visueel als inhoudelijk logisch leest.",
        ],
        highlights: ["Focus op je concrete projectbijdrage", "Overzicht, verbinding en detail", "Aandacht voor materiaal en uitvoering", "Beeldreeks geschikt voor cases"],
      },
      outcomes: {
        title: "Van afgewerkt project naar bruikbare referentie",
        intro: "Een gerichte reeks helpt nieuwe opdrachtgevers zien welke kwaliteit en aanpak je aanbiedt.",
        items: [
          { title: "Een sterker portfolio", description: "Projecten worden consequent gepresenteerd met genoeg context en technische nuance." },
          { title: "Concreet bewijs van expertise", description: "Details en totaalbeelden maken je specifieke bijdrage zichtbaar en bespreekbaar." },
          { title: "Herbruikbare casecontent", description: "Variatie ondersteunt websitecases, offertes, presentaties en vakgerichte sociale posts." },
        ],
      },
      idealFor: {
        title: "Voor makers die hun afgeronde werk willen tonen",
        intro: "De beeldfocus verschuift mee met de discipline en het type opdrachtgever dat je wil bereiken.",
        items: [
          { title: "Aannemers en bouwteams", description: "Documenteer totaalprojecten, renovaties en specifieke uitvoeringsonderdelen." },
          { title: "Interieur- en maatwerkbedrijven", description: "Toon ruimtelijke samenhang, materiaal, beslag en verfijnde afwerking." },
          { title: "Architecten en ontwerpers", description: "Breng concept, volumes, licht en gebruik in één projectverhaal bijeen." },
          { title: "Installateurs en vakspecialisten", description: "Maak technische kwaliteit zichtbaar in context én in relevante details." },
        ],
      },
      deliverables: {
        title: "Een projectreeks van context tot afwerkingsdetail",
        intro: "De beeldlijst wordt rond je eigen aandeel en geplande communicatie opgebouwd.",
        items: [
          { title: "Contextbeelden", description: "De realisatie in relatie tot gebouw, terrein of omliggende ruimte." },
          { title: "Ruimtelijke overzichten", description: "Composities die indeling, volume en samenhang tussen onderdelen verduidelijken." },
          { title: "Materiaal- en detailfoto's", description: "Gerichte beelden van verbindingen, texturen en kenmerkende uitvoering." },
          { title: "Web- en caseexports", description: "Bestanden voor projectpagina, portfolio en digitale presentatie." },
          { title: "Drukklare varianten", description: "Grotere exports voor offerte, brochure of wedstrijdinzending wanneer afgesproken." },
          { title: "Logisch projectarchief", description: "Een overzichtelijke map- en naamstructuur voor later hergebruik." },
        ],
      },
      pricing: {
        title: "Wat beïnvloedt de prijs van realisatiefotografie?",
        paragraphs: [
          "De offerte volgt uit omvang, locatie en gewenste diepgang. Eén maatwerkinterieur met veel details vraagt andere aandacht dan een buitenterrein, woningrenovatie of reeks technische installaties. We bepalen welke onderdelen essentieel zijn om jouw bijdrage juist te vertellen.",
          "De staat van oplevering, styling, toegang, weersafhankelijkheid en afstemming met andere betrokkenen kunnen eveneens werk vragen. Een heldere projectbrief met foto's, plannen en toepassingen helpt om opname en nabewerking vooraf realistisch af te bakenen.",
        ],
        factors: ["Omvang en type realisatie", "Aantal ruimtes of projectdelen", "Aantal essentiële details", "Binnen-, buiten- of avondlicht", "Opleverstatus en styling", "Toegang en veiligheidsafspraken", "Afstemming met betrokken partijen", "Gewenste beeldselectie", "Web-, druk- en presentatieformaten"],
      },
      whyVisualVibe: {
        title: "Waarom realisatiefotografie door VisualVibe",
        intro: "We verdiepen ons in wat jij hebt gemaakt, zodat de fotografie meer vertelt dan alleen dat een project mooi is.",
        items: [
          { title: "Focus op jouw bijdrage", description: "De shotlist vertrekt van werkzaamheden, materialen en ontwerpkeuzes die je wil aantonen." },
          { title: "Technisch én visueel kijken", description: "Overzichten krijgen ondersteuning van details die uitvoering en functie verklaren." },
          { title: "Denken in projectcases", description: "De selectie wordt bruikbaar opgebouwd voor portfolio, offerte en inhoudelijke toelichting." },
        ],
      },
      regional: {
        title: "Realisatiefotograaf in Limburg en nabije regio's",
        description: "We fotograferen afgewerkte projecten in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met locatieplanning rond oplevering, toegang, daglicht en eventuele buitenomstandigheden.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Maak van je volgende oplevering een sterke case",
        description: "Deel wat je team realiseerde, waar het project ligt en welke details belangrijk zijn. We stellen een passende beeldroute en offerte op.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  brandingfotografie: {
    intro:
      "Brandingfotografie vertaalt je merkstrategie naar een herkenbare beeldwereld met mensen, producten, omgeving en details. We bouwen geen verzameling mooie foto's, maar een veelzijdige merkbeeldbank rond je doelgroep, kernboodschappen en contentplanning, zodat je communicatie persoonlijk én consequent kan blijven.",
    excerpt:
      "Een strategisch voorbereide merkshoot met eigen beelden voor campagnes, website, expertisecontent en sociale media.",
    process: [
      {
        title: "Merkverhaal visueel ontleden",
        description:
          "We bespreken doelgroep, waarden, aanbod, tone of voice en bestaande huisstijl. Uit die informatie halen we thema's, emoties, situaties en beeldkenmerken die fotografie concreet kan dragen.",
      },
      {
        title: "Concept en contentshotlist bouwen",
        description:
          "Met referenties, locaties, styling, props en kanaalformaten ontwikkelen we een beeldplan. Elke scène krijgt een rol, van persoonlijke introductie tot aanbod, proces of seizoenscampagne.",
      },
      {
        title: "De merkwereld gericht creëren",
        description:
          "Tijdens de shoot bewaken we kleur, licht en verhaal. We geven duidelijke regie aan personen en variëren composities zodat één setting meerdere authentieke contentmomenten oplevert.",
      },
      {
        title: "Een veelzijdige beeldbank cureren",
        description:
          "We selecteren op samenhang én variatie, werken de afgesproken beeldstijl consequent af en organiseren exports rond kanalen, campagnes of inhoudelijke thema's.",
      },
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen brandingfotografie en bedrijfsfotografie?",
        answer:
          "Bedrijfsfotografie vertrekt vaak van de bestaande onderneming en werkdag. Brandingfotografie begint nadrukkelijker bij positionering en geplande communicatie. Scènes, styling en symboliek worden bewust ontwikkeld om specifieke merkboodschappen en contentthema's te ondersteunen.",
      },
      {
        question: "Hebben we al een volledig uitgewerkte huisstijl nodig?",
        answer:
          "Niet noodzakelijk, maar duidelijke keuzes over doelgroep, aanbod en gewenste uitstraling zijn wel nodig. Bestaande kleuren, typografie of website helpen bij de afstemming. Als de merkbasis nog onzeker is, bakenen we eerst vast wat fotografie wel kan vertalen.",
      },
      {
        question: "Hoe voorkomen we dat merkfoto's te geposeerd lijken?",
        answer:
          "We bouwen scènes rond echte handelingen, situaties en materialen die bij je werk passen. Regie gebruiken we voor licht, houding en compositie, niet om een geloofwaardige persoonlijkheid te vervangen door toneel.",
      },
      {
        question: "Kunnen we met één shoot content voor verschillende campagnes maken?",
        answer:
          "Dat kan wanneer thema's, props, kledingwissels en formaten vooraf goed worden gepland. We bewaken dat de dag haalbaar blijft en geven kernbeelden voorrang. Een te volle shotlist kan ten koste gaan van variatie en aandacht per scène.",
      },
      {
        question: "Hoe kiezen we een geschikte locatie voor brandingfotografie?",
        answer:
          "De locatie moet inhoudelijk passen, voldoende visuele variatie bieden en praktisch werkbaar zijn voor licht, kleding en props. We beoordelen ook achtergrondkleuren, drukte, toestemming en de ruimte die nodig is voor horizontale en verticale composities.",
      },
    ],
    relatedServices: ["bedrijfsfotografie", "zakelijke-portretten", "promovideo", "webdesign", "social-media-video"],
    seo: {
      title: "Brandingfotografie voor sterke merken | VisualVibe Limburg",
      description:
        "Brandingfotografie met een strategische shotlist, passende locaties en een consistente merkbeeldbank voor website, campagnes en sociale content online.",
      keywords: ["brandingfotografie", "merkfotografie", "personal branding fotograaf", "contentfotografie Limburg"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "brandingfotografie",
        supportingKeywords: ["merkfotografie", "personal branding fotografie", "content shoot", "merkbeeldbank"],
        type: "commercial",
      },
      overview: {
        title: "Brandingfotografie die je merkverhaal zichtbaar maakt",
        paragraphs: [
          "Brandingfotografie vertrekt van betekenis. Welke indruk wil je achterlaten, welke problemen help je oplossen en welke elementen moeten terugkeren zodat iemand je beelden zonder logo al herkent? We vertalen antwoorden naar een visueel concept met terugkerende kleuren, licht, locaties, handelingen en details. Daardoor krijgt elke foto een taak binnen je bredere communicatie.",
          "Een merkbeeldbank moet tegelijk samenhang en speelruimte bieden. We plannen hero-beelden voor belangrijke pagina's, maar ook rustige achtergronden, procesdetails, persoonlijke portretten en varianten voor terugkerende sociale thema's. Tijdens de shoot creëren we bewust lege ruimte voor tekst en wisselen we beeldafstand en oriëntatie. Zo blijft de reeks bruikbaar wanneer je contentkalender verandert.",
        ],
        highlights: ["Visueel concept vanuit je merkstrategie", "Shotlist gekoppeld aan contentthema's", "Styling, locatie en props in samenhang", "Variatie voor meerdere kanalen"],
      },
      outcomes: {
        title: "Een eigen beeldtaal die langer mee kan",
        intro: "De reeks geeft je marketing een herkenbare basis zonder elk bericht identiek te maken.",
        items: [
          { title: "Meer herkenning", description: "Terugkerende kleur, licht en compositie vormen een visuele familie rond je merk." },
          { title: "Minder afhankelijk van stock", description: "Eigen mensen, locaties en details maken je verhaal specifiek en geloofwaardig." },
          { title: "Gerichter content maken", description: "Beelden per thema geven je team concrete aanknopingspunten voor campagnes en posts." },
        ],
      },
      idealFor: {
        title: "Voor merken die persoonlijk en consequent willen communiceren",
        intro: "Brandingfotografie werkt wanneer identiteit en inhoud even belangrijk zijn als een verzorgd beeld.",
        items: [
          { title: "Zelfstandigen en personal brands", description: "Breng persoonlijkheid, expertise en werkwijze samen zonder generieke zakelijke poses." },
          { title: "KMO's met een nieuwe positionering", description: "Laat vernieuwde strategie en huisstijl doorwerken in eigen fotografie." },
          { title: "Dienstverlenende merken", description: "Maak een niet-tastbaar aanbod zichtbaar via mensen, proces en herkenbare situaties." },
        ],
      },
      deliverables: {
        title: "Een merkbeeldbank opgebouwd rond contentthema's",
        intro: "De exacte set volgt uit concept, kanaalkeuzes en prioriteiten in de shotlist.",
        items: [
          { title: "Hero-beelden", description: "Sterke hoofdcomposities voor website, campagne of profielintroductie." },
          { title: "Persoonlijke merkportretten", description: "Gerichte portretten met expressie en context passend bij je positionering." },
          { title: "Proces- en aanbodbeelden", description: "Scènes die tonen hoe je werkt, adviseert, maakt of samenwerkt." },
          { title: "Sfeer en merkdetails", description: "Kleuren, materialen, objecten en omgevingen die je visuele wereld verdiepen." },
          { title: "Sociale formaten", description: "Afgesproken staande, vierkante of tekstvriendelijke uitsneden voor content." },
          { title: "Thematische ordening", description: "Een levering die beelden groepeert volgens campagne, onderwerp of gebruik." },
        ],
      },
      pricing: {
        title: "Welke elementen bepalen de prijs van brandingfotografie?",
        paragraphs: [
          "De investering wordt vooral bepaald door de conceptuele en productionele omvang. Een persoonlijke merkshoot op één locatie is anders dan een beeldbank met meerdere gezichten, settings, producten en campagnethema's. De voorbereiding is een wezenlijk onderdeel van de opdracht.",
          "Daarnaast spelen locatie, styling, props, deelnemers, aantal scènes en nabewerking mee. We prioriteren de shotlist op kernbeelden en aanvullende varianten. Zo is duidelijk welke merkdoelen de productie ondersteunt en wat elke praktische keuze vraagt.",
        ],
        factors: ["Aantal merk- en contentthema's", "Conceptontwikkeling en referenties", "Aantal locaties of sets", "Aantal deelnemers", "Kleding, styling en props", "Producten of handelingen in beeld", "Aantal geplande scènes", "Selectie en kleurafwerking", "Benodigde kanaalvarianten"],
      },
      whyVisualVibe: {
        title: "Waarom brandingfotografie met VisualVibe",
        intro: "We verbinden strategie, productie en praktisch contentgebruik in één visueel plan.",
        items: [
          { title: "Eerst de boodschap", description: "We vertalen doelgroep en positionering naar concrete scènes vóór we camera en licht bepalen." },
          { title: "Regie zonder maskerade", description: "We sturen compositie en houding, terwijl echte persoonlijkheid en werkwijze herkenbaar blijven." },
          { title: "Gemaakt voor je contentmix", description: "De shotlist houdt rekening met hero-posities, tekstvlakken, sociale kaders en thematische variatie." },
        ],
      },
      regional: {
        title: "Brandingfotograaf voor Limburg en omliggende regio's",
        description: "We ontwikkelen merkshoots voor zelfstandigen en KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, op een locatie die inhoudelijk en visueel bij het merk past.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Vertaal je merkplan naar een eigen beeldwereld",
        description: "Vertel ons welke doelgroep, thema's en kanalen je wil voeden. We denken mee over concept, locaties en een haalbare contentgerichte shotlist.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
} satisfies Record<FotografieSlug, SubserviceEditorial>;
