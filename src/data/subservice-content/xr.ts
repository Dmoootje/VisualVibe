import type { SubserviceEditorial } from "@/types";

type XrEditorialSlug =
  | "3d-tour"
  | "virtuele-rondleiding"
  | "showroom-3d-tour"
  | "vastgoed-3d-tour"
  | "horeca-virtuele-tour";

export const xrEditorial = {
  "3d-tour": {
    intro:
      "Een professionele 3D-tour laten maken geeft bezoekers een echte ruimte om online te verkennen. We plannen de route, gekoppelde standpunten en een rondgang voor je website. Vooraf bespreken we voorbereiding, zichtbare informatie, publicatie en hosting. Zo weet je hoe opname, beheer en latere actualisatie verlopen.",
    excerpt:
      "Een navigeerbare 3D-tour van je locatie, zorgvuldig gescand, opgebouwd, gepubliceerd en ingebed voor een duidelijke online ruimtebeleving.",
    process: [
      {
        title: "Doel en bezoekersroute uitwerken",
        description:
          "We kiezen relevante ruimtes, startpunt en volgorde. Ook websiteplaatsing en eventuele informatiepunten worden besproken.",
      },
      {
        title: "Ruimte opnameklaar maken",
        description:
          "Je ontvangt een checklist voor styling, verlichting, spiegels, schermen en gevoelige gegevens. Voor de scan volgt een visuele ronde.",
      },
      {
        title: "Standpunten scannen en verbinden",
        description:
          "We registreren opeenvolgende posities, houden doorgangen vrij en beperken beweging voor een heldere navigatie.",
      },
      {
        title: "Tour afwerken en publiceren",
        description:
          "We controleren route, startbeeld en zichtbare zones, voegen labels toe en leveren link of embedcode. Hosting en updates worden verduidelijkt.",
      },
    ],
    faqs: [
      {
        question: "Wat is het verschil tussen een 3D-tour en een gewone video?",
        answer:
          "Een video volgt een montage die voor de kijker is bepaald. In een 3D-tour kiest de bezoeker zelf de richting en het tempo tussen gekoppelde standpunten. Video is sterker voor een gestuurd verhaal; een tour is geschikt om een echte ruimte zelfstandig te verkennen.",
      },
      {
        question: "Hoe moet de ruimte worden voorbereid?",
        answer:
          "Ruim persoonlijke en tijdelijke spullen op, werk zichtbare kabels weg, stem verlichting af en controleer spiegels, ramen en schermen. De inrichting blijft tijdens het scannen best ongewijzigd. We sturen vooraf een checklist die past bij jouw type locatie.",
      },
      {
        question: "Kunnen mensen aanwezig zijn tijdens het scannen?",
        answer:
          "Beweging tussen opeenvolgende standpunten kan storende of gedeeltelijke personen opleveren. Daarom werken we liefst in lege of gecontroleerde zones en verplaatst de aanwezige begeleider zich volgens instructie. Voor levendige sfeerbeelden kan aparte fotografie geschikter zijn.",
      },
      {
        question: "Hoe komt de 3D-tour op onze website?",
        answer:
          "Meestal wordt de gepubliceerde tour via een link of embedcode in een webpagina geplaatst. We leveren de afgesproken gegevens en kunnen de implementatie mee verzorgen wanneer we toegang en technische context hebben. Werking blijft mede afhankelijk van website, browser en hostingplatform.",
      },
      {
        question: "Is hosting inbegrepen en blijft de tour onbeperkt online?",
        answer:
          "Hosting is een terugkerend onderdeel dat we duidelijk in het voorstel omschrijven, inclusief periode en gekozen beheerwijze. We beloven geen onbeperkte beschikbaarheid van externe platformen. Voor verlenging, overdracht of stopzetting spreken we praktische voorwaarden af.",
      },
    ],
    relatedServices: ["virtuele-rondleiding", "showroom-3d-tour", "vastgoed-3d-tour", "bedrijfsfotografie", "website-laten-maken"],
    seo: {
      title: "Professionele 3D-tour Laten Maken in Limburg | VisualVibe",
      description:
        "3D-tour laten maken in Limburg? We scannen je ruimte, bouwen de route op en verzorgen publicatie, hostingafspraken en embed voor je website online.",
      keywords: ["3D-tour laten maken", "3D-tour Limburg", "virtuele 3D-tour", "ruimte digitaal scannen"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "3D-tour laten maken",
        supportingKeywords: ["3D-tour Limburg", "virtuele 3D-tour", "interactieve rondleiding", "ruimte digitaal scannen"],
        type: "mixed",
      },
      overview: {
        title: "Een 3D-tour laten maken die logisch navigeert",
        paragraphs: [
          "Een 3D-tour verbindt visuele standpunten tot een ruimtelijke rondgang. Bezoekers bewegen zelf, kijken om en kiezen waar ze stilstaan. Dat maakt indeling en sfeer begrijpelijker dan één overzichtsbeeld.",
          "We bepalen zichtbare zones en bereiden de ruimte voor. Na verwerking controleren we route en startpunt en voegen afgesproken labels toe. De tour wordt via link of embed gepubliceerd. Hosting, beheer en een mogelijke herscan bij veranderingen worden vooraf uitgelegd.",
        ],
        highlights: [
          "Scanplan op basis van een logische bezoekersroute",
          "Voorbereidingschecklist voor ruimte en zichtbare details",
          "Controle van startpunt, navigatie en uitgesloten zones",
        ],
      },
      outcomes: {
        title: "Wat een heldere digitale rondgang oplevert",
        intro:
          "De tour geeft bezoekers meer autonomie en biedt je organisatie een vaste, deelbare presentatie van de ruimte op het moment van opname.",
        items: [
          {
            title: "Zelfstandig verkennen",
            description:
              "De bezoeker kiest een eigen route en kan relevante zones in het gewenste tempo bekijken zonder een lineaire video te volgen.",
          },
          {
            title: "Betere ruimtelijke verwachting",
            description:
              "Indeling, verbindingen en sfeer worden begrijpelijker dan met uitsluitend losse foto's van afzonderlijke kamers.",
          },
          {
            title: "Eenvoudig deelbare presentatie",
            description:
              "Een publicatielink kan volgens de afgesproken instellingen worden gedeeld of via een embed in je website worden geplaatst.",
          },
        ],
      },
      idealFor: {
        title: "Ruimtes waarvoor een 3D-tour waarde toevoegt",
        intro:
          "De vorm werkt goed wanneer bezoekers vooraf willen begrijpen hoe een locatie eruitziet, is ingedeeld of doorlopen wordt.",
        items: [
          {
            title: "Publiekslocaties",
            description:
              "Geef bezoekers vooraf een beeld van ontvangst, route en verschillende zones in een zaak, centrum of ontmoetingsplek.",
          },
          {
            title: "Showrooms en winkels",
            description:
              "Laat categorieën en opstellingen in hun ruimtelijke context zien en voeg waar passend gerichte informatiepunten toe.",
          },
          {
            title: "Vastgoed en verblijven",
            description:
              "Maak indeling en verbinding tussen kamers begrijpelijk als aanvulling op fotografie en praktische beschrijving.",
          },
        ],
      },
      deliverables: {
        title: "Wat je bij een 3D-tour kunt ontvangen",
        intro:
          "De concrete oplevering volgt uit het platform, de gewenste publicatie en eventuele begeleiding bij de website-integratie.",
        items: [
          {
            title: "Afgewerkte navigeerbare tour",
            description:
              "Een digitaal opgebouwde rondgang door de afgesproken ruimtes, met een gecontroleerd startpunt en logische verbindingen.",
          },
          {
            title: "Publicatielink",
            description:
              "Een deelbare URL volgens de gekozen publicatie-instellingen en binnen de afgesproken hostingperiode.",
          },
          {
            title: "Embedgegevens",
            description:
              "De nodige code of instructie om de tour in een geschikte webpagina te tonen, eventueel met implementatie als aparte taak.",
          },
          {
            title: "Informatielabels",
            description:
              "Afgesproken titels, korte toelichtingen of links op relevante plekken, binnen de mogelijkheden van de gekozen omgeving.",
          },
        ],
      },
      pricing: {
        title: "Hoe wordt de prijs van een 3D-tour bepaald?",
        paragraphs: [
          "Oppervlakte, verdiepingen en routecomplexiteit bepalen de omvang. Kleine kamers, trappen en afgesloten zones vragen meer dan één open ruimte. Ook labels en websitehulp tellen mee.",
          "Productie, publicatieperiode en hosting worden apart benoemd. Bij regelmatige veranderingen bespreken we actualisatie of herscan. Externe platformwerking en toekomstige functies worden niet gegarandeerd.",
        ],
        factors: [
          "Totale oppervlakte en aantal verdiepingen",
          "Aantal ruimtes, doorgangen en trappen",
          "Voorbereiding en gewenste locatiebegeleiding",
          "Aantal informatiepunten en aangeleverde inhoud",
          "Gewenste hostingperiode en beheerwijze",
        ],
      },
      whyVisualVibe: {
        title: "Waarom je 3D-tour laten bouwen door VisualVibe",
        intro:
          "We kijken verder dan de scan en verbinden ruimtevoorbereiding, navigatie, publicatie en webgebruik tot één praktisch traject.",
        items: [
          {
            title: "Route vanuit bezoekersperspectief",
            description:
              "Startpunt en verbindingen worden gekozen op basis van wat een nieuwe bezoeker logisch wil ontdekken.",
          },
          {
            title: "Heldere voorbereiding",
            description:
              "Je krijgt concrete aanwijzingen voor styling, privacy, verlichting en toegang, zodat verrassingen op de opnamedag beperkt blijven.",
          },
          {
            title: "Publicatie met context",
            description:
              "We verduidelijken embed, hosting en beheer in plaats van alleen een losse tourlink over te dragen.",
          },
        ],
      },
      regional: {
        title: "3D-tour laten maken in Limburg en omgeving",
        description:
          "VisualVibe scant locaties in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. We stemmen per opdracht bereikbaarheid, ruimtevoorbereiding, scanroute, publicatie, hosting en eventuele website-embed praktisch af.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Maak je ruimte online verkenbaar",
        description:
          "Vertel ons welke zones je wilt tonen, wie de tour gebruikt en waar je die wilt publiceren. We werken een scan- en publicatievoorstel op maat uit.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "virtuele-rondleiding": {
    intro:
      "Een virtuele rondleiding geeft toekomstige bezoekers een realistisch eerste gevoel bij je zaak, praktijk, werkplek of publiekslocatie. We vertalen de fysieke route naar een digitale ervaring met duidelijke navigatie, verzorgde zichtlijnen en informatie op relevante plekken. Het traject omvat voorbereiding, scanning, controle, publicatie en afspraken over hosting en website-embed. Wanneer je inrichting later wezenlijk verandert, bekijken we samen welke zones opnieuw moeten worden opgenomen.",
    excerpt:
      "Een verzorgde virtuele rondleiding die nieuwe bezoekers door je locatie leidt, met duidelijke publicatie-, hosting- en embedafspraken.",
    process: [
      {
        title: "Bezoekersvragen verzamelen",
        description:
          "We bepalen wat iemand vóór een bezoek wil weten: entree, toegankelijkheid, sfeer, wachtruimte, aanbod of routing. Die vragen sturen de digitale rondgang.",
      },
      {
        title: "Locatie zorgvuldig voorbereiden",
        description:
          "Samen controleren we zichtbare gegevens, tijdelijke materialen, persoonlijke spullen, verlichting, deuren en styling. Niet-publieke zones worden duidelijk afgebakend.",
      },
      {
        title: "Rondgang in rustige zones scannen",
        description:
          "We leggen opeenvolgende standpunten vast wanneer de locatie zo leeg en stabiel mogelijk is. Dat beperkt visuele verstoring en ondersteunt een natuurlijke navigatie.",
      },
      {
        title: "Publiceren en bezoekers sturen",
        description:
          "Na controle stellen we het startbeeld en afgesproken informatiepunten in. Vervolgens leveren of plaatsen we de embed en documenteren we hosting en toekomstig beheer.",
      },
    ],
    faqs: [
      {
        question: "Voor welke organisaties is een virtuele rondleiding nuttig?",
        answer:
          "Vooral voor locaties waar sfeer, indeling of de route een rol speelt in de beslissing om langs te komen. Denk aan praktijken, winkels, ontmoetingslocaties, kantoren en recreatieve ruimtes. We bekijken of interactieve navigatie echt meerwaarde heeft tegenover foto's of video.",
      },
      {
        question: "Kunnen we bepaalde kamers buiten de rondleiding houden?",
        answer:
          "Ja. We spreken vooraf af welke zones publiek, beperkt of volledig uitgesloten zijn. De scanroute wordt daarop ingericht. Deuren, zichtlijnen en reflecties verdienen aandacht, omdat uitgesloten ruimtes niet toevallig herkenbaar in beeld mogen komen.",
      },
      {
        question: "Kan de tour toegankelijkheid tonen?",
        answer:
          "De rondleiding kan entrees, gangen, liften of aangepaste voorzieningen visueel tonen en via labels toelichten. Ze vervangt geen formele toegankelijkheidsaudit. Informatie over maten of voorzieningen moet door de opdrachtgever correct worden aangeleverd en actueel gehouden.",
      },
      {
        question: "Werkt een virtuele rondleiding op mobiel?",
        answer:
          "De gekozen publicatieoplossing is doorgaans bedoeld voor moderne desktop- en mobiele browsers, maar we beloven geen identieke werking op elk toestel of in elke toekomstige softwareversie. We testen de plaatsing in de relevante websitecontext vóór oplevering waar dat in scope zit.",
      },
      {
        question: "Hoe lang duurt de opname?",
        answer:
          "Dat hangt af van oppervlakte, aantal ruimtes, trappen, zichtlijnen en hoe opnameklaar de locatie is. We geven na plattegrond, foto's of een korte intake een praktische tijdsinschatting en plannen liefst buiten drukke bezoekersuren.",
      },
    ],
    relatedServices: ["3d-tour", "bedrijfsfotografie", "bedrijfsvideo", "google-business-profiel-optimalisatie", "website-laten-maken"],
    seo: {
      title: "Virtuele Rondleiding voor je Zaak in Limburg | VisualVibe",
      description:
        "Virtuele rondleiding laten maken in Limburg? Toon sfeer, indeling en route online met professionele scanning, hostingafspraken en website-embed op maat.",
      keywords: ["virtuele rondleiding", "virtuele rondleiding laten maken", "virtual tour Limburg", "online rondleiding bedrijf"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "virtuele rondleiding",
        supportingKeywords: ["virtuele rondleiding laten maken", "virtual tour Limburg", "online rondleiding bedrijf", "interactieve bedrijfstour"],
        type: "mixed",
      },
      overview: {
        title: "Virtuele rondleiding voor een vertrouwde eerste indruk",
        paragraphs: [
          "Nieuwe bezoekers willen weten waar ze binnenkomen, hoe de ruimte voelt en welke zones er zijn. Een virtuele rondleiding maakt dat visueel en laat mensen zelfstandig kijken, zonder vaste videomontage.",
          "We bouwen rond de echte bezoekersroute en bepalen wat zichtbaar is. De locatie wordt voorbereid en op gevoelige details gecontroleerd. Daarna stellen we startpunt, navigatie en labels in. Publicatie, hosting, embed en een eventuele herscan bij veranderingen worden vooraf toegelicht.",
        ],
        highlights: [
          "Rondgang opgebouwd vanuit vragen van nieuwe bezoekers",
          "Niet-publieke en privacygevoelige zones vooraf bepaald",
          "Informatiepunten voor praktische context",
        ],
      },
      outcomes: {
        title: "Een bezoek dat al online begint",
        intro:
          "De digitale rondgang verlaagt onzekerheid en geeft je team een consistente manier om de locatie op afstand te tonen.",
        items: [
          {
            title: "Verwachtingen verduidelijken",
            description:
              "Bezoekers zien vooraf sfeer en route en kunnen beter inschatten of de locatie aansluit bij hun behoefte.",
          },
          {
            title: "Vragen visueel beantwoorden",
            description:
              "Ingang, ontvangst, zones en voorzieningen worden in context getoond in plaats van alleen tekstueel beschreven.",
          },
          {
            title: "Altijd dezelfde rondleiding",
            description:
              "Sales, onthaal en communicatie kunnen één goed voorbereide tour delen als actuele digitale presentatie van de gescande situatie.",
          },
        ],
      },
      idealFor: {
        title: "Locaties die bezoekers vooraf willen meenemen",
        intro:
          "Een rondleiding werkt wanneer de fysieke ervaring een belangrijke drempel, vraag of keuze in de klantreis beïnvloedt.",
        items: [
          {
            title: "Praktijken en welzijnslocaties",
            description:
              "Maak ontvangst en omgeving herkenbaar voor mensen die rust en voorspelbaarheid waarderen vóór hun eerste afspraak.",
          },
          {
            title: "Kantoren en opleidingsruimtes",
            description:
              "Toon kandidaat-medewerkers, deelnemers of partners waar ze terechtkomen en hoe verschillende zones verbonden zijn.",
          },
          {
            title: "Retail en dienstverlening",
            description:
              "Laat winkelindeling, advieszones of faciliteiten zien als aanvulling op product- en bedrijfsfotografie.",
          },
        ],
      },
      deliverables: {
        title: "Onderdelen van je virtuele rondleiding",
        intro:
          "We leveren niet alleen de scan, maar spreken ook af hoe de tour online komt en wie de publicatie later opvolgt.",
        items: [
          {
            title: "Navigeerbare locatietour",
            description:
              "Een verbonden digitale route door de afgesproken publiekszones, gecontroleerd op startpunt en logische doorgangen.",
          },
          {
            title: "Gerichte informatiepunten",
            description:
              "Korte teksten of links voor voorzieningen, diensten of praktische uitleg, voor zover voorzien in het gekozen platform en de scope.",
          },
          {
            title: "Deelbare publicatielink",
            description:
              "Een URL waarmee de rondleiding binnen de afgesproken publicatie-instellingen en hostingperiode kan worden geopend.",
          },
          {
            title: "Website-embed",
            description:
              "Code of technische plaatsing voor een geschikte pagina, met afstemming op beschikbare ruimte, privacykeuzes en laadtijd.",
          },
        ],
      },
      pricing: {
        title: "Wat beïnvloedt de prijs van een virtuele rondleiding?",
        paragraphs: [
          "Oppervlakte, kamers, verdiepingen, trappen en doorgangen bepalen het aantal standpunten. Ook informatiepunten, uitgesloten zones en websiteondersteuning tellen mee.",
          "Productie en hostingperiode worden apart benoemd. Bij een vaak wijzigende locatie bespreken we onderhoud, zonder te suggereren dat elke aanpassing naadloos in de bestaande tour past.",
        ],
        factors: [
          "Oppervlakte en aantal publiekszones",
          "Verdiepingen, trappen en complexe verbindingen",
          "Mate waarin de locatie opnameklaar is",
          "Aantal afgesproken informatiepunten",
          "Uitsluiting van gevoelige of private zones",
        ],
      },
      whyVisualVibe: {
        title: "Waarom VisualVibe voor je digitale rondleiding",
        intro:
          "We bekijken de tour als onderdeel van je bezoekerscommunicatie en begeleiden de route van eerste voorbereiding tot online plaatsing.",
        items: [
          {
            title: "Aandacht voor de klantreis",
            description:
              "We kiezen start, volgorde en informatie vanuit wat een nieuwe bezoeker werkelijk wil begrijpen.",
          },
          {
            title: "Privacybewuste voorbereiding",
            description:
              "Zichtbare gegevens, schermen, personen en niet-publieke ruimtes worden vóór de scan concreet besproken.",
          },
          {
            title: "Websitekennis in huis",
            description:
              "We kunnen de embed benaderen binnen de bredere pagina-opbouw, content en technische context van je website.",
          },
        ],
      },
      regional: {
        title: "Virtuele rondleiding in Limburg en omliggende regio's",
        description:
          "VisualVibe maakt virtuele rondleidingen voor locaties in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. Scanplanning, ruimtevoorbereiding, hosting, website-embed en latere actualisatie stemmen we per organisatie af.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Nodig bezoekers digitaal binnen",
        description:
          "Deel het type locatie, de ruimtes die je wilt tonen en je websitecontext. We stellen een rondgang voor die praktisch te scannen en helder te publiceren is.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "showroom-3d-tour": {
    intro:
      "Met een showroom 3D-tour kunnen klanten je collectie en presentatiezones online verkennen voordat ze een bezoek plannen. We brengen routing, categorieën en inspirerende opstellingen samen in een navigeerbare omgeving en voegen waar passend informatiepunten toe. Voor de scan bereiden we producten, prijscommunicatie, verlichting en zichtbare gegevens zorgvuldig voor. Ook hosting, website-embed en de impact van seizoens- of collectiewissels worden vooraf besproken.",
    excerpt:
      "Een navigeerbare showroom 3D-tour met logische zones, verzorgde productpresentatie en heldere afspraken over publicatie en updates.",
    process: [
      {
        title: "Assortiment en zones structureren",
        description:
          "We bepalen welke collecties, inspiratiehoeken en adviespunten prioriteit krijgen. De start en route sluiten aan op hoe klanten de showroom fysiek ontdekken.",
      },
      {
        title: "Presentatie scanvast voorbereiden",
        description:
          "Displays worden afgewerkt, tijdelijke dozen verdwijnen en prijs- of productschermen worden gecontroleerd. We leggen vast welke informatie tijdloos genoeg is om zichtbaar te blijven.",
      },
      {
        title: "Scannen zonder winkelbeweging",
        description:
          "We registreren opeenvolgende standpunten buiten drukke uren. De inrichting blijft tijdens de opname gelijk, zodat verbindingen tussen productzones zo rustig mogelijk worden opgebouwd.",
      },
      {
        title: "Tour verrijken en activeren",
        description:
          "Na routecontrole plaatsen we afgesproken labels of links, stellen we de beginscène in en verzorgen we de publicatielink of embed binnen de vastgelegde hostingcontext.",
      },
    ],
    faqs: [
      {
        question: "Kunnen producten in de tour aanklikbaar worden gemaakt?",
        answer:
          "Op relevante posities kunnen informatiepunten met korte tekst of een link worden toegevoegd, afhankelijk van de gekozen publicatieomgeving. We selecteren ze gericht om visuele drukte te vermijden. Productdata en bestemmingslinks worden door jou correct aangeleverd en onderhouden.",
      },
      {
        question: "Wat doen we met prijzen die vaak veranderen?",
        answer:
          "Vermijd waar mogelijk tijdelijke prijskaarten in het gescande beeld en link liever naar een actuele webpagina. Wat fysiek in de scan zichtbaar is, verandert niet automatisch mee. Voor commerciële informatie maken we dus een bewuste keuze tussen tijdloos beeld en beheerbare labels.",
      },
      {
        question: "Moet de showroom sluiten voor de opname?",
        answer:
          "We scannen bij voorkeur vóór opening, na sluiting of in een volledig afgebakende periode. Bewegende bezoekers en medewerkers kunnen de verbinding en beeldrust verstoren. Bij grote showrooms kan een planning per afgesloten zone worden besproken.",
      },
      {
        question: "Hoe vaak moet een showroomtour worden vernieuwd?",
        answer:
          "Dat hangt af van hoe sterk indeling en collectie wisselen. Een tijdloze basisopstelling blijft langer bruikbaar dan een seizoenspresentatie. Bij grote route- of interieurwijzigingen beoordelen we of betrokken zones aanvullend kunnen worden gescand of een nieuwe tour beter is.",
      },
      {
        question: "Kan de 3D-tour onze webshop vervangen?",
        answer:
          "Nee. Een tour helpt klanten oriënteren en inspiratie opdoen, maar biedt niet automatisch voorraad, prijzen, filters, betaling of orderbeheer. Via gerichte links kan hij wel bezoekers naar relevante webshopcategorieën of afspraakpagina's leiden.",
      },
    ],
    relatedServices: ["3d-tour", "virtuele-rondleiding", "productfotografie", "website-laten-maken", "webshop-laten-maken"],
    seo: {
      title: "Showroom 3D-tour voor Meer Online Beleving | VisualVibe",
      description:
        "Showroom 3D-tour laten maken in Limburg? Laat klanten zones en collecties verkennen met professionele scanning, informatielinks en website-embed.",
      keywords: ["showroom 3D-tour", "3D-tour showroom", "virtuele showroom", "showroom online bekijken"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "showroom 3D-tour",
        supportingKeywords: ["3D-tour showroom", "virtuele showroom", "showroom online bekijken", "interactieve showroomtour"],
        type: "commercial",
      },
      overview: {
        title: "Showroom 3D-tour die collectie en ruimte verbindt",
        paragraphs: [
          "Opstellingen, combinaties, looproutes en advieszones geven producten context. Een 3D-tour laat bezoekers zelf tussen categorieën bewegen en ondersteunt oriëntatie vóór een bezoek of vanuit een campagne.",
          "We kiezen een representatieve, tijdloze opstelling en verwijderen tijdelijke informatie. Na de scan bouwen we navigatie op en koppelen afgesproken labels aan actuele pagina's. Link, embed en hosting worden vastgelegd. Bij een nieuwe collectie beoordelen we of actualisatie nodig is.",
        ],
        highlights: [
          "Digitale route volgens de fysieke showroomlogica",
          "Productzones en inspiratieopstellingen in samenhang",
          "Gerichte links naar actuele categorie- of afspraakpagina's",
        ],
      },
      outcomes: {
        title: "Van online inspiratie naar gericht showroombezoek",
        intro:
          "De tour helpt klanten verkennen en voorbereiden, terwijl je team een vaste visuele introductie van de showroom kan delen.",
        items: [
          {
            title: "Collecties in context",
            description:
              "Klanten zien hoe productgroepen en stijlen samen worden gepresenteerd, in plaats van enkel losse packshots te bekijken.",
          },
          {
            title: "Zelfgekozen ontdekking",
            description:
              "De bezoeker beweegt naar de zones die relevant voelen en kan daarna via een link verder lezen of een afspraak plannen.",
          },
          {
            title: "Ondersteuning voor sales",
            description:
              "Medewerkers kunnen tijdens een gesprek naar een herkenbare zone verwijzen en de digitale rondgang gericht delen.",
          },
        ],
      },
      idealFor: {
        title: "Showrooms waar ruimtelijke inspiratie centraal staat",
        intro:
          "De tour past bij aanbod dat sterker wordt wanneer klanten opstellingen, schaal en combinatiemogelijkheden kunnen ervaren.",
        items: [
          {
            title: "Interieur en wonen",
            description:
              "Presenteer kamers, materialen en stijlen als samenhangende inspiratiezones die online zelfstandig verkend kunnen worden.",
          },
          {
            title: "Keukens en badkamers",
            description:
              "Laat verschillende opstellingen en afwerkingsrichtingen zien en verwijs naar advies of een relevante collectiepagina.",
          },
          {
            title: "Mobiliteit en techniek",
            description:
              "Geef overzicht over modellen, demonstratiezones en adviespunten zonder actuele voorraadstatus te suggereren.",
          },
        ],
      },
      deliverables: {
        title: "Wat je showroomtour kan omvatten",
        intro:
          "We stemmen route, verrijking en publicatie af op de manier waarop je marketing- en salesteam de tour werkelijk gaat gebruiken.",
        items: [
          {
            title: "Volledige navigeerbare showroom",
            description:
              "De afgesproken zones gekoppeld tot een heldere route met een representatief startbeeld en logische overgangen.",
          },
          {
            title: "Zone- en productlabels",
            description:
              "Een beperkt aantal gerichte informatiepunten met aangeleverde tekst of link, passend binnen het gekozen platform.",
          },
          {
            title: "Deelbare link en embedcode",
            description:
              "Publicatiegegevens voor website, campagne of persoonlijk salescontact binnen de overeengekomen hostinginstellingen.",
          },
          {
            title: "Websiteplaatsing als optie",
            description:
              "Technische integratie in een geschikte pagina wanneer toegang, platform en scope vooraf zijn afgestemd.",
          },
        ],
      },
      pricing: {
        title: "Prijsopbouw van een showroom 3D-tour",
        paragraphs: [
          "De omvang van de showroom en de dichtheid van opstellingen bepalen hoeveel scanstandpunten nodig zijn. Meerdere verdiepingen, smalle doorgangen en afzonderlijke presentatieruimtes vragen extra planning. Ook de gewenste informatiepunten en hulp bij webintegratie hebben invloed op de productiescope.",
          "We bespreken hostingduur en hoe vaak de showroom verandert. Hosting is niet stilzwijgend onbeperkt. Bij wissels of verbouwingen beoordelen we of aanvulling of een nieuwe opname consistenter is.",
        ],
        factors: [
          "Totale showroomoppervlakte en verdiepingen",
          "Dichtheid van opstellingen en doorgangen",
          "Aantal collectiezones en informatiepunten",
          "Opnameplanning buiten openingsuren",
          "Voorbereiding van tijdelijke prijs- en productinformatie",
        ],
      },
      whyVisualVibe: {
        title: "Waarom VisualVibe voor je showroomtour",
        intro:
          "We verbinden een verzorgde scan met commerciële structuur, webgebruik en realistisch beheer wanneer je presentatie verandert.",
        items: [
          {
            title: "Selectieve informatie",
            description:
              "We plaatsen niet overal labels, maar sturen bezoekers op logische punten naar actuele en relevante vervolginformatie.",
          },
          {
            title: "Oog voor presentatie",
            description:
              "Routing, zichtlijnen, verlichting en tijdelijke elementen worden vooraf bekeken vanuit de uiteindelijke online ervaring.",
          },
          {
            title: "Koppeling met je website",
            description:
              "De tour wordt benaderd als onderdeel van de showroompagina en klantreis, niet als een geïsoleerde externe link.",
          },
        ],
      },
      regional: {
        title: "Showroom 3D-tour in Limburg en omliggende regio's",
        description:
          "VisualVibe scant showrooms in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. We plannen opname, ruimtevoorbereiding, informatielinks, hosting, embed en toekomstige actualisatie rond je showroomwerking.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Open je showroom ook voor online bezoekers",
        description:
          "Bezorg ons de oppervlakte, indeling, belangrijkste zones en websitecontext. We maken een voorstel voor scan, verrijking, publicatie en beheer.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "vastgoed-3d-tour": {
    intro:
      "Met een vastgoed 3D-tour kunnen kandidaat-kopers of huurders de indeling van een woning, appartement of commercieel pand zelfstandig online verkennen. We scannen de ruimtes in een logische volgorde en stemmen de tour af op fotografie, publicatie en bezichtigingsproces. Vooraf bereiden we het pand zorgvuldig voor en bepalen we welke zones zichtbaar zijn. Ook hosting, website-embed, privacy en de geldigheid van de tour nadat het pand wijzigt of van de markt gaat, worden concreet afgesproken.",
    excerpt:
      "Een navigeerbare vastgoed 3D-tour die indeling en ruimtegevoel verduidelijkt, met voorbereiding, publicatie en beheer op maat.",
    process: [
      {
        title: "Publicatie en scope bepalen",
        description:
          "We bespreken doelgroep, type pand, ruimtes, kanalen en gewenste timing. Berging, technische zones, persoonlijke kamers en buitenruimtes worden bewust opgenomen of uitgesloten.",
      },
      {
        title: "Pand verkoopklaar voorbereiden",
        description:
          "De eigenaar ontvangt een checklist voor opruimen, styling, verlichting, deuren, spiegels, documenten en persoonlijke gegevens. De opstelling blijft tijdens de scan ongewijzigd.",
      },
      {
        title: "Verdieping per verdieping scannen",
        description:
          "We leggen verbonden standpunten vast met aandacht voor doorgangen en oriëntatie. Aanwezigen blijven uit de actieve zones om visuele verstoring zoveel mogelijk te vermijden.",
      },
      {
        title: "Tour controleren en publiceren",
        description:
          "We controleren startpunt, navigatie en afgesproken zichtbaarheid, verzorgen de publicatielink of embed en leggen vast hoe hosting, depublicatie en eventuele correcties worden beheerd.",
      },
    ],
    faqs: [
      {
        question: "Wat voegt een vastgoed 3D-tour toe naast foto's?",
        answer:
          "Fotografie selecteert sterke standpunten en sfeer. Een 3D-tour maakt vooral de verbinding tussen kamers en verdiepingen begrijpelijk. Kandidaten kiezen zelf waar ze kijken en krijgen daardoor een ander soort ruimtelijke context. Beide media vullen elkaar aan.",
      },
      {
        question: "Moet het pand volledig leeg zijn?",
        answer:
          "Nee. Een bewoond of ingericht pand kan worden gescand als het rustig en verzorgd is. Persoonlijke foto's, documenten, medicatie, schermen en waardevolle details worden best weggehaald. Tijdens de opname mogen spullen niet meer van positie wisselen.",
      },
      {
        question: "Kan een plattegrond uit de scan worden gebruikt voor officiële maten?",
        answer:
          "Een eventuele visuele indeling of maatweergave is bedoeld als presentatiehulpmiddel en vervangt geen professionele opmeting, officieel plan of juridisch document. Voor formele oppervlaktes en maatvoering moet de opdrachtgever betrouwbare brongegevens gebruiken.",
      },
      {
        question: "Hoe beschermen we de privacy van bewoners?",
        answer:
          "Voor de scan ruimen bewoners identificeerbare en gevoelige informatie weg. We bepalen welke ruimtes niet worden opgenomen en controleren zichtlijnen, spiegels en schermen. Omdat een tour breed kan worden bekeken, is goede voorbereiding belangrijker dan achteraf veel te verbergen.",
      },
      {
        question: "Hoe lang blijft de tour online na verkoop of verhuur?",
        answer:
          "Dat leggen we vast in de hosting- en publicatieafspraken. De makelaar of opdrachtgever meldt wanneer de status verandert en de tour moet worden verwijderd of afgeschermd. Externe beschikbaarheid wordt niet onbeperkt gegarandeerd.",
      },
    ],
    relatedServices: ["vastgoedfotografie", "vastgoed-dronebeelden", "3d-tour", "website-laten-maken", "promovideo"],
    seo: {
      title: "Vastgoed 3D-tour voor Immo en Verkoop | VisualVibe",
      description:
        "Vastgoed 3D-tour laten maken in Limburg? Toon indeling en ruimtegevoel met professionele scanning, publicatie, hostingafspraken en website-embed.",
      keywords: ["vastgoed 3D-tour", "3D-tour vastgoed", "virtuele bezichtiging", "3D-tour makelaar"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "vastgoed 3D-tour",
        supportingKeywords: ["3D-tour vastgoed", "virtuele bezichtiging", "3D-tour makelaar", "woning virtueel bezichtigen"],
        type: "commercial",
      },
      overview: {
        title: "Vastgoed 3D-tour voor indeling en ruimtegevoel",
        paragraphs: [
          "Foto's tonen hoe aantrekkelijk een pand is; een interactieve tour verduidelijkt hoe ruimtes samenhangen. De bezoeker beweegt digitaal van entree naar leefruimte en verdieping en kan zelf terugkeren.",
          "De scan sluit aan op de vastgoedpresentatie. We bereiden het pand voor, verwijderen gevoelige informatie en leggen uitgesloten zones vast. Daarna controleren we route en publicatie. Hosting, depublicatie en actualisatie bij een gewijzigde inrichting worden expliciet beheerd.",
        ],
        highlights: [
          "Navigatie die de echte indeling begrijpelijk maakt",
          "Voorbereidingschecklist voor bewoond of leeg vastgoed",
          "Privacygevoelige en uitgesloten ruimtes vooraf besproken",
        ],
      },
      outcomes: {
        title: "Een completere digitale bezichtiging",
        intro:
          "De tour helpt kandidaten het pand inhoudelijk verkennen en geeft de makelaar een consistente presentatie om gericht te delen.",
        items: [
          {
            title: "Begrijpelijke kamerverbindingen",
            description:
              "Kijkers zien hoe entree, leefruimtes, verdiepingen en buitenrelaties op het moment van opname met elkaar samenhangen.",
          },
          {
            title: "Zelfstandig terugkijken",
            description:
              "Een geïnteresseerde kan relevante zones opnieuw bezoeken zonder door een vaste fotovolgorde of video te moeten bladeren.",
          },
          {
            title: "Samenhangende mediapresentatie",
            description:
              "De tour ondersteunt foto's, beschrijving en luchtbeelden met extra ruimtelijke context op de vastgoedpagina.",
          },
        ],
      },
      idealFor: {
        title: "Vastgoed dat online ruimtelijke uitleg nodig heeft",
        intro:
          "Een interactieve bezichtiging is vooral nuttig wanneer indeling, schaal of verbinding tussen verschillende zones moeilijk in losse beelden past.",
        items: [
          {
            title: "Woningen met meerdere niveaus",
            description:
              "Maak de relatie tussen woonlagen, trappen en functionele zones begrijpelijk voor kandidaten die zich vooraf oriënteren.",
          },
          {
            title: "Appartementen en nieuwbouw",
            description:
              "Toon een afgewerkt appartement of modelunit als navigeerbare aanvulling op plannen, fotografie en projectinformatie.",
          },
          {
            title: "Commerciële panden",
            description:
              "Laat winkel-, kantoor- of praktijkruimtes digitaal doorlopen en maak verschillende functies of toegangszones herkenbaar.",
          },
        ],
      },
      deliverables: {
        title: "Wat je ontvangt bij een vastgoed 3D-tour",
        intro:
          "De oplevering wordt afgestemd op je publicatieproces en bevat duidelijke afspraken over toegang, online looptijd en beheer.",
        items: [
          {
            title: "Navigeerbare pandtour",
            description:
              "Een verbonden rondgang door de overeengekomen ruimtes, met een logisch startpunt en gecontroleerde overgangen.",
          },
          {
            title: "Deelbare publicatielink",
            description:
              "Een URL voor gebruik binnen de afgesproken kanalen en hostingperiode, volgens de ingestelde zichtbaarheid.",
          },
          {
            title: "Embed voor eigen pagina",
            description:
              "Technische gegevens om de tour op een geschikte vastgoed- of projectpagina te plaatsen, eventueel met ondersteuning.",
          },
          {
            title: "Controle van zichtbare zones",
            description:
              "Een finale controle van start, route en afgesproken uitsluitingen vóór de tour publiek wordt gedeeld.",
          },
        ],
      },
      pricing: {
        title: "Prijsfactoren van een vastgoed 3D-tour",
        paragraphs: [
          "De offerte wordt onder meer bepaald door oppervlakte, verdiepingen, aantal kamers en complexiteit van doorgangen. Ook voorbereiding en reistijd spelen mee. Wanneer fotografie, dronebeelden en scanning op één geschikt moment worden gecombineerd, stemmen we de planning efficiënt af zonder elk onderdeel als identieke productie te behandelen.",
          "Publicatie en hosting worden apart benoemd. Bij projectverkoop of een wisselende modelwoning bespreken we versiebeheer. Een tour weerspiegelt niet vanzelf elke verbouwing, styling- of platformwijziging.",
        ],
        factors: [
          "Oppervlakte en aantal kamers",
          "Aantal verdiepingen en verbindingen",
          "Leeg, ingericht of bewoond pand",
          "Voorbereiding van privacygevoelige zones",
          "Combinatie met vastgoedfotografie of dronebeelden",
        ],
      },
      whyVisualVibe: {
        title: "Waarom VisualVibe voor vastgoedscanning",
        intro:
          "We verbinden ruimtebeleving, verzorgde vastgoedmedia en praktische publicatie tot één duidelijk georganiseerd presentatietraject.",
        items: [
          {
            title: "Indeling boven gimmick",
            description:
              "De route wordt opgebouwd om het pand begrijpelijk te maken, niet enkel om een opvallende interactieve functie toe te voegen.",
          },
          {
            title: "Media op elkaar afgestemd",
            description:
              "Tour, fotografie, video en luchtbeelden kunnen samen één logische online bezichtiging vormen.",
          },
          {
            title: "Privacy als voorbereidingstaak",
            description:
              "We bespreken zichtbare gegevens en uitgesloten zones vooraf, wanneer aanpassingen nog gecontroleerd kunnen gebeuren.",
          },
        ],
      },
      regional: {
        title: "Vastgoed 3D-tour in Limburg en omliggende regio's",
        description:
          "VisualVibe maakt vastgoedtours in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. We stemmen scan, voorbereiding, privacy, publicatie, hosting, embed en depublicatie af op makelaar, eigenaar en pand.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Maak de indeling online begrijpelijk",
        description:
          "Stuur ons het type pand, de oppervlakte, plattegrond en gewenste publicatie. We stellen een passend scanmoment en helder beheerde vastgoedtour voor.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
  "horeca-virtuele-tour": {
    intro:
      "Met een horeca virtuele tour laat je gasten online de sfeer, indeling en mogelijkheden van je restaurant, feestzaal, hotel of eventlocatie verkennen. We bouwen de rondgang rond ontvangst, zitruimtes en relevante voorzieningen, zonder storende gasten of tijdelijke rommel in beeld. Vooraf bereiden we de zaak voor en kiezen we een representatieve opstelling. Na scanning volgen publicatie, hosting en website-embed, met duidelijke afspraken voor seizoensdecoratie of latere verbouwingen.",
    excerpt:
      "Een sfeervolle horeca virtuele tour die gasten door zaal, restaurant of verblijf leidt, met verzorgde scan en heldere online publicatie.",
    process: [
      {
        title: "Gastvragen en ruimtes kiezen",
        description:
          "We bepalen of de focus ligt op tafelschikking, zaalcapaciteit, kamers, terras, ontvangst of eventmogelijkheden. Alleen relevante publiekszones komen in de route.",
      },
      {
        title: "Zaak representatief klaarzetten",
        description:
          "Tafels, textiel, verlichting en decor worden afgewerkt; menu's, schermen en tijdelijke communicatie worden gecontroleerd. We kiezen een rustige periode zonder gasten.",
      },
      {
        title: "Sfeer en route scannen",
        description:
          "We leggen verbonden standpunten vast met aandacht voor entree, zichtlijnen en overgangen. Personeel blijft buiten de actieve zone en de opstelling verandert niet tijdens de opname.",
      },
      {
        title: "Tour publiceren en koppelen",
        description:
          "Na routecontrole stellen we het openingsbeeld en afgesproken labels in. We leveren of plaatsen de link of embed en leggen hosting, verlenging en actualisatie vast.",
      },
    ],
    faqs: [
      {
        question: "Moeten er gasten in de virtuele tour te zien zijn?",
        answer:
          "Liever niet tijdens de scan. Personen kunnen tussen standpunten bewegen en daardoor storend of onvolledig verschijnen. Voor sfeer met echte bediening en gasten is een afzonderlijke foto- of videosessie beter controleerbaar. Die beelden kunnen naast de tour worden gebruikt.",
      },
      {
        question: "Kunnen we verschillende zaalopstellingen tonen?",
        answer:
          "Eén scan toont één fysieke opstelling per zone. Voor belangrijke varianten kunnen aparte tours, aanvullende fotografie of een duidelijke informatiepagina geschikter zijn. We adviseren een representatieve basisopstelling die de ruimte goed leesbaar maakt.",
      },
      {
        question: "Kan een gast vanuit de tour meteen reserveren?",
        answer:
          "We kunnen op een passende plek linken naar je bestaande reserverings- of contactpagina, afhankelijk van de gekozen publicatieomgeving. De tour beheert zelf niet automatisch beschikbaarheid of boekingen en de werking van externe reservatiesoftware wordt niet gegarandeerd.",
      },
      {
        question: "Kunnen keuken en personeelsruimtes worden uitgesloten?",
        answer:
          "Ja. We bepalen vooraf welke publiekszones deel uitmaken van de route en houden niet-publieke ruimtes gesloten en buiten zichtlijnen. Als een open keuken bewust moet worden getoond, plannen we dat apart met aandacht voor netheid, activiteit en herkenbare gegevens.",
      },
      {
        question: "Hoe gaan we om met terras en wisselend weer?",
        answer:
          "Een terras wordt gepland wanneer opstelling en omstandigheden representatief zijn. Buitenbeelden kunnen door seizoen, licht en weer sneller gedateerd raken. We bespreken of het terras in dezelfde tour, een aparte visuele reeks of een latere update past.",
      },
    ],
    relatedServices: ["virtuele-rondleiding", "3d-tour", "bedrijfsfotografie", "promovideo", "google-business-profiel-optimalisatie"],
    seo: {
      title: "Horeca Virtuele Tour voor Meer Online Sfeer | VisualVibe",
      description:
        "Horeca virtuele tour laten maken in Limburg? Toon zaal, sfeer en indeling met professionele scanning, reserveringslink en website-embed voor je zaak.",
      keywords: ["horeca virtuele tour", "virtuele tour restaurant", "3D-tour feestzaal", "horeca rondleiding"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "horeca virtuele tour",
        supportingKeywords: ["virtuele tour restaurant", "3D-tour feestzaal", "hotel virtuele rondleiding", "horeca rondleiding"],
        type: "commercial",
      },
      overview: {
        title: "Horeca virtuele tour voor sfeer en zaalindeling",
        paragraphs: [
          "Naast menu en ligging bepalen stijl, ruimte en zaalindeling mee de keuze. Een interactieve rondleiding laat gasten zelf van entree naar restaurant, bar of andere publiekszone bewegen.",
          "We scannen een representatieve opstelling buiten openingsuren en controleren aankleding, verlichting, tijdelijke informatie en privacy. Daarna volgen routecontrole, actuele links, embed en hostingafspraken. Bij een grote wijziging beoordelen we aanvulling of een nieuwe tour.",
        ],
        highlights: [
          "Digitale gastreis van entree naar relevante zones",
          "Representatieve tafel- en zaalopstelling",
          "Gerichte link naar reservering of eventaanvraag",
        ],
      },
      outcomes: {
        title: "Een locatiekeuze met meer visuele context",
        intro:
          "De tour helpt toekomstige gasten of organisatoren de ruimte vooraf begrijpen, zonder de persoonlijke ontvangst te vervangen.",
        items: [
          {
            title: "Sfeer vóór de reservatie",
            description:
              "Bezoekers krijgen een realistische indruk van inrichting en ruimtelijke stijl op het moment van de scan.",
          },
          {
            title: "Zaalmogelijkheden verduidelijkt",
            description:
              "Organisatoren zien hoe ontvangst, hoofdzaal en nevenzones verbonden zijn en kunnen gerichtere praktische vragen stellen.",
          },
          {
            title: "Website met meer beleving",
            description:
              "Een goed geplaatste embed vult foto's, menu, arrangementen en contactinformatie aan met zelfstandige navigatie.",
          },
        ],
      },
      idealFor: {
        title: "Horecalocaties waar ruimte mee de keuze bepaalt",
        intro:
          "De interactieve vorm is vooral waardevol wanneer gasten vooraf sfeer, routing of de opbouw van verschillende zones willen beoordelen.",
        items: [
          {
            title: "Restaurants en brasserieën",
            description:
              "Toon entree, tafelzones, bar en eventueel terras als aanvulling op culinaire en sfeerfotografie.",
          },
          {
            title: "Feest- en eventzalen",
            description:
              "Maak ontvangst, zaal, podiumzone en relevante voorzieningen inzichtelijk voor organisatoren en gezelschappen.",
          },
          {
            title: "Hotels en verblijven",
            description:
              "Verbind lobby, gemeenschappelijke zones en geselecteerde kamertypes zonder te suggereren dat elke kamer identiek is.",
          },
        ],
      },
      deliverables: {
        title: "Wat je horeca virtuele tour kan bevatten",
        intro:
          "We stellen de rondgang en online levering samen rond je eigen website, reservatieproces en eventuele eventcommunicatie.",
        items: [
          {
            title: "Navigeerbare horecarondgang",
            description:
              "Een verbonden route door de gekozen publieksruimtes met een gastvrij startbeeld en heldere oriëntatie.",
          },
          {
            title: "Informatie- en reservatielinks",
            description:
              "Afgesproken labels die naar actuele menu-, arrangement-, contact- of reservatiepagina's kunnen verwijzen.",
          },
          {
            title: "Publicatielink en embed",
            description:
              "Gegevens voor delen en integratie op je website binnen de afgesproken zichtbaarheid en hostingperiode.",
          },
          {
            title: "Controle van niet-publieke zones",
            description:
              "Een laatste controle dat uitgesloten keuken-, opslag- of personeelsruimtes niet onbedoeld in de route terechtkomen.",
          },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een horeca virtuele tour?",
        paragraphs: [
          "Publieksruimtes, verdiepingen, doorgangen en buitenzones bepalen het scanplan. Ook opname buiten openingsuren en voorbereiding van de gekozen opstelling tellen mee.",
          "Informatielinks, websiteplaatsing en hosting worden apart besproken. Bij seizoensdecoratie of verbouwingen kan een updateplan helpen, maar niet elke wijziging past zonder bredere herscan.",
        ],
        factors: [
          "Aantal zalen, kamers en publiekszones",
          "Verdiepingen, trappen en afzonderlijke entrees",
          "Binnenruimtes en eventuele terrasopname",
          "Opnamemoment buiten service-uren",
          "Voorbereiding van tafel- en zaalopstelling",
        ],
      },
      whyVisualVibe: {
        title: "Waarom VisualVibe voor je horecatour",
        intro:
          "We benaderen ruimte, sfeer en online klantreis als één geheel en maken vooraf duidelijke keuzes over wat actueel en zichtbaar hoort te zijn.",
        items: [
          {
            title: "Gastgerichte routing",
            description:
              "De rondgang start en beweegt zoals een nieuwe gast de locatie logisch zou ontdekken.",
          },
          {
            title: "Oog voor horecadetail",
            description:
              "Tafelaankleding, licht, tijdelijke communicatie en servicezones worden gecontroleerd voordat de scan begint.",
          },
          {
            title: "Combinatie met sfeercontent",
            description:
              "De lege ruimtetour kan worden aangevuld met fotografie of video waarin personeel, gerechten en echte activiteit wél centraal staan.",
          },
        ],
      },
      regional: {
        title: "Horeca virtuele tour in Limburg en omliggende regio's",
        description:
          "VisualVibe scant horecalocaties in Belgisch Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg. We stemmen opstelling, scanmoment, links, hosting, embed en latere actualisatie af rond je openingsuren en werking.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Laat gasten je locatie vooraf beleven",
        description:
          "Stuur ons je ruimtes, gewenste opstelling, website en reservatieroute. We werken een scanmoment en publicatievorm uit die bij je horecazaak past.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
} satisfies Record<XrEditorialSlug, SubserviceEditorial>;
