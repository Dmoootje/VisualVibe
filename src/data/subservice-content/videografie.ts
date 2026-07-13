import type { SubserviceEditorial } from "@/types";

type VideografieSlug =
  | "bedrijfsvideo"
  | "promovideo"
  | "social-media-video"
  | "event-aftermovie"
  | "wervingsvideo"
  | "testimonial-video"
  | "podcast-video"
  | "nieuwsreportage";

export const videografieEditorial = {
  bedrijfsvideo: {
    intro:
      "Een bedrijfsvideo maakt in beeld en geluid duidelijk wie je bent, wat je oplost en hoe je werkt. We ontwikkelen een helder verhaal rond je doelgroep en belangrijkste boodschap, plannen interviews en situaties zorgvuldig en monteren één samenhangende film met passende versies voor website, presentatie en sociale media.",
    excerpt:
      "Een doordachte bedrijfsfilm van verhaallijn tot montage, met echte mensen, relevante werksituaties en kanaalgerichte versies.",
    process: [
      {
        title: "Doelgroep en kernverhaal bepalen",
        description:
          "We bespreken wat de kijker na de video moet begrijpen, voelen of doen. Daaruit kiezen we één centrale boodschap, relevante bewijsbeelden en een vertelvorm die bij je organisatie past.",
      },
      {
        title: "Script, vragen en shotlist uitwerken",
        description:
          "We zetten de verhaallijn om in gesproken tekst, interviewvragen of scènes. Een draaischema koppelt personen, locaties, handelingen, geluid en praktische voorbereiding aan elk onderdeel.",
      },
      {
        title: "Mensen en werking op locatie filmen",
        description:
          "Tijdens de opname begeleiden we sprekers rustig en bouwen we relevante werksituaties zorgvuldig op. We verzamelen overzicht, actie, detail en omgevingsgeluid voor een geloofwaardige montage.",
      },
      {
        title: "Verhaal, geluid en beeld monteren",
        description:
          "We selecteren uitspraken en scènes op inhoud, ritme en samenhang. Daarna verzorgen we kleur, geluidsbalans, titels en afgesproken ondertiteling en exporteren we de gekozen versies.",
      },
    ],
    faqs: [
      {
        question: "Hebben we zelf al een script nodig voor een bedrijfsvideo?",
        answer:
          "Nee. Een briefing over doelgroep, aanbod en gewenste actie volstaat. Wij structureren de boodschap als script, interviewopzet of visuele lijn en leggen die vóór de opname ter afstemming voor.",
      },
      {
        question: "Moet de zaakvoerder zelf voor de camera komen?",
        answer:
          "Niet noodzakelijk. Medewerkers, klanten, voice-over, schermtekst of handelingen kunnen het verhaal dragen. We kiezen een vorm die inhoudelijk klopt en haalbaar is voor je organisatie.",
      },
      {
        question: "Kunnen medewerkers natuurlijk overkomen zonder tekst uit het hoofd te leren?",
        answer:
          "Ja. Bij interviews werken we met gerichte vragen en korte antwoordblokken. Gescripte passages delen we op en begeleiden we in tempo en formulering, zodat niemand een lange tekst hoeft te onthouden.",
      },
      {
        question: "Welke versies van de bedrijfsvideo kunnen we laten maken?",
        answer:
          "Naast een hoofdversie kunnen we korte, verticale of geluidloze varianten plannen. Door die vooraf te kiezen, nemen we passende kaders en ruimte voor schermtekst meteen mee in de shotlist.",
      },
      {
        question: "Kunnen bestaande foto's of videobeelden in de montage?",
        answer:
          "Dat kan wanneer kwaliteit, bestandsformaat en gebruiksmogelijkheden passen. Bezorg materiaal vroeg, zodat we beoordelen of het technisch en inhoudelijk in de montage werkt.",
      },
    ],
    relatedServices: ["bedrijfsfotografie", "promovideo", "testimonial-video", "dronevideo", "webdesign"],
    seo: {
      title: "Bedrijfsvideo laten maken voor KMO's | VisualVibe Limburg",
      description:
        "Bedrijfsvideo laten maken met een sterk kernverhaal, echte werksituaties en verzorgde montage, voorbereid voor je website, presentaties en sociale media.",
      keywords: ["bedrijfsvideo", "bedrijfsvideo laten maken", "bedrijfsfilm Limburg", "professionele bedrijfsvideo"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "bedrijfsvideo",
        supportingKeywords: ["bedrijfsvideo laten maken", "bedrijfsfilm", "videoproductie voor KMO", "corporate video Limburg"],
        type: "commercial",
      },
      overview: {
        title: "Een bedrijfsvideo die snel tot de kern komt",
        paragraphs: [
          "Een bedrijfsvideo hoeft niet alles over je onderneming te vertellen. Ze moet vooral de juiste informatie in de juiste volgorde brengen. Wie help je, welk probleem pak je aan en wat maakt je manier van werken herkenbaar? Door één kernverhaal te kiezen, krijgen interviews, sfeerbeelden en details een duidelijke functie in plaats van een willekeurige opsomming te vormen.",
          "In de preproductie vertalen we dat verhaal naar een script of interviewstructuur en een concrete shotlist. We houden rekening met locaties, geluid, medewerkers, klanten en de formaten waarin de video later verschijnt. Tijdens de montage schrappen we herhaling en verbinden we woorden met beelden die de inhoud aantonen. Zo blijft de film begrijpelijk voor iemand die je bedrijf nog niet kent.",
        ],
        highlights: ["Kernverhaal vanuit je doelgroep", "Script of interviewopzet op maat", "Echte werksituaties als bewijsbeeld", "Montage en exports per kanaal"],
      },
      outcomes: {
        title: "Wat een gerichte bedrijfsfilm oplevert",
        intro: "De video geeft kijkers een compacte introductie die beeld, stem en werkwijze samenbrengt.",
        items: [
          { title: "Een helder bedrijfsverhaal", description: "De belangrijkste boodschap krijgt een logische opbouw zonder vakjargon of zijpaden." },
          { title: "Zichtbare expertise", description: "Mensen, processen en details ondersteunen wat in interview of voice-over wordt verteld." },
          { title: "Content voor meerdere contactmomenten", description: "Een geplande hoofdvideo en korte varianten kunnen website, sales en sociale kanalen voeden." },
        ],
      },
      idealFor: {
        title: "Voor organisaties die hun werking willen laten zien",
        intro: "Een bedrijfsvideo past wanneer klanten of kandidaten je aanbod beter begrijpen zodra ze mensen en praktijk zien.",
        items: [
          { title: "KMO's met een complex aanbod", description: "Maak een dienst, proces of technische oplossing toegankelijk met beeld en uitleg." },
          { title: "Familiebedrijven", description: "Verbind geschiedenis, betrokkenheid en hedendaagse werking in één persoonlijk verhaal." },
          { title: "Professionele dienstverleners", description: "Geef abstracte expertise een gezicht via interviews, overleg en concrete situaties." },
        ],
      },
      deliverables: {
        title: "Van hoofdvideo tot praktische kanaalversies",
        intro: "De oplevering wordt vooraf gekoppeld aan de plekken waar je het verhaal echt gaat publiceren.",
        items: [
          { title: "Gemonteerde hoofdvideo", description: "Een inhoudelijk afgeronde film met kleurcorrectie, geluidsmix en titels." },
          { title: "Ondertitelde versie", description: "Ingebrande of afzonderlijk aangeleverde ondertiteling wanneer die deel uitmaakt van de opdracht." },
          { title: "Korte fragmenten", description: "Vooraf bepaalde inhoudelijke uitsneden voor sociale media, sales of interne introductie." },
          { title: "Kanaalgerichte exports", description: "Bestanden in afgesproken verhouding, resolutie en compressie voor de gekozen publicatieplaatsen." },
        ],
      },
      pricing: {
        title: "Welke keuzes bepalen de prijs van een bedrijfsvideo?",
        paragraphs: [
          "Een bedrijfsvideo wordt begroot op de volledige productie, niet alleen op de opname. De gekozen vertelvorm bepaalt hoeveel concept, script, interviewvoorbereiding, locaties en draaisituaties nodig zijn. Een compacte film rond één spreker is anders dan een verhaal over verschillende teams en processen.",
          "Ook montage, grafiek, ondertiteling, geluidsbehandeling en het aantal versies spelen mee. We brengen eerst hoofdverhaal en noodzakelijke beelden in kaart en onderscheiden die van aanvullende wensen. De offerte beschrijft zo duidelijk welke voorbereiding, productie en oplevering zijn voorzien.",
        ],
        factors: ["Concept en vertelvorm", "Script- of interviewvoorbereiding", "Aantal sprekers en scènes", "Aantal locaties", "Opname van geluid en voice-over", "Licht en productionele logistiek", "Montagecomplexiteit", "Titels, grafiek en ondertiteling", "Aantal lengtes en beeldformaten"],
      },
      whyVisualVibe: {
        title: "Waarom een bedrijfsvideo maken met VisualVibe",
        intro: "We verbinden strategie, opname en montage, zodat elke scène het kernverhaal helpt vertellen.",
        items: [
          { title: "Inhoud vóór apparatuur", description: "Doelgroep en boodschap sturen het script, de vragen en de beelden die we plannen." },
          { title: "Begeleiding voor echte mensen", description: "Sprekers krijgen concrete voorbereiding en rustige aanwijzingen tijdens de opname." },
          { title: "Gemonteerd voor gebruik", description: "Ritme, ondertiteling en verhoudingen worden afgestemd op je werkelijke publicatiekanalen." },
        ],
      },
      regional: {
        title: "Bedrijfsvideo's voor Limburg en ruime omgeving",
        description: "We produceren bedrijfsvideo's voor zelfstandigen en KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met opnames in de omgeving waar je verhaal werkelijk plaatsvindt.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Breng je bedrijfsverhaal terug tot één sterke lijn",
        description: "Vertel ons wie je wil bereiken, wat zij moeten begrijpen en waar de video verschijnt. We vertalen dat naar een passend productievoorstel.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  promovideo: {
    intro:
      "Een promovideo zet één product, dienst, actie of lancering doelgericht in de kijker. We bouwen het concept rond aandacht, voordeel, bewijs en call-to-action, filmen alleen wat die boodschap versterkt en maken versies die passen bij campagnepagina, advertentie, verkooppresentatie en relevante sociale kanalen.",
    excerpt:
      "Een compacte campagnevideo met een duidelijke propositie, gerichte beelden en versies voor de kanalen waarop je promoot.",
    process: [
      {
        title: "Aanbod en campagnedoel aanscherpen",
        description:
          "We bepalen welk aanbod centraal staat, voor wie het relevant is en welke actie de video ondersteunt. De kernbelofte wordt concreet geformuleerd zonder de film met te veel argumenten te belasten.",
      },
      {
        title: "Creatief haakje en script ontwikkelen",
        description:
          "We werken een visueel concept, openingsmoment, tekststructuur en call-to-action uit. Storyboard of shotlist toont welke productdetails, situaties, personen en grafische elementen nodig zijn.",
      },
      {
        title: "Campagnebeelden efficiënt produceren",
        description:
          "Op de set bewaken we tempo, continuïteit, productpresentatie en ruimte voor tekst. We nemen varianten op wanneer verschillende openingsbeelden of beeldverhoudingen vooraf zijn gepland.",
      },
      {
        title: "Op impact en kanaal monteren",
        description:
          "We monteren met een heldere spanningsboog, verzorgen geluid, kleur en titels en maken de overeengekomen lengtes. Elk formaat behoudt een begrijpelijke boodschap en zichtbare call-to-action.",
      },
    ],
    faqs: [
      {
        question: "Hoe lang moet een promovideo zijn?",
        answer:
          "Dat volgt uit kanaal, boodschap en kijkcontext. Een korte advertentie vraagt een ander ritme dan een video op een campagnepagina. We bepalen eerst wat noodzakelijk is en maken eventueel meerdere doelgerichte montages vanuit dezelfde productie.",
      },
      {
        question: "Kan één promovideo zowel horizontaal als verticaal werken?",
        answer:
          "Ja, als beide verhoudingen in concept en opname zijn voorzien. We kadreren belangrijke handelingen veilig, maken waar nodig afzonderlijke takes en plaatsen grafiek per formaat opnieuw. Alleen achteraf bijsnijden beperkt vaak de compositie.",
      },
      {
        question: "Kunnen jullie ons product in gebruik filmen?",
        answer:
          "Zeker. We bespreken gebruiker, locatie, handelingen, props en volgorde vooraf. Voor technische of gereglementeerde producten geeft je team inhoudelijke instructies, zodat de demonstratie correct, veilig en passend bij je communicatie wordt opgenomen.",
      },
      {
        question: "Is muziek inbegrepen bij een promotievideo?",
        answer:
          "We stemmen de muzikale richting af op merk en montage en gebruiken een passende bron volgens de afgesproken productie. Platformen, advertenties en externe campagnes kunnen eigen voorwaarden stellen, dus het beoogde gebruik moet vóór de keuze bekend zijn.",
      },
      {
        question: "Kunnen we verschillende calls-to-action laten monteren?",
        answer:
          "Dat kan. Denk aan een variant voor een landingspagina en een andere voor sociale advertenties. Lever definitieve formuleringen, bestemmingen en eventuele campagnevoorwaarden tijdig aan, zodat beeld, timing en eindkaart correct aansluiten.",
      },
    ],
    relatedServices: ["social-media-video", "productfotografie", "bedrijfsvideo", "webdesign", "seo-copywriting"],
    seo: {
      title: "Promovideo laten maken voor campagnes | VisualVibe Limburg",
      description:
        "Promovideo laten maken met een scherp concept, overtuigende product- of dienstbeelden en passende versies voor advertenties, landingspagina's en social media.",
      keywords: ["promovideo", "promovideo laten maken", "promotievideo bedrijf", "campagnevideo Limburg"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "promovideo",
        supportingKeywords: ["promovideo laten maken", "promotievideo", "campagnevideo", "productvideo"],
        type: "commercial",
      },
      overview: {
        title: "Een promovideo met één scherpe campagneboodschap",
        paragraphs: [
          "Een promovideo werkt het best wanneer de kijker meteen begrijpt waarom het aanbod relevant is. Daarom beginnen we niet bij een lijst producteigenschappen, maar bij het probleem, verlangen of gebruiksmoment dat je doelgroep herkent. Daarna kiezen we welke beelden een voordeel tastbaar maken en welke tekst echt nodig is om naar de volgende stap te leiden.",
          "Het kanaal bepaalt de creatieve keuzes. Op sociale media moet het openingsbeeld ook zonder geluid betekenis hebben, terwijl een landingspagina meer ruimte kan bieden voor uitleg. We plannen verschillende verhoudingen, tekstzones en calls-to-action vóór de shoot. Zo ontstaat geen lange film die toevallig wordt ingekort, maar een set montages met elk een duidelijke functie.",
        ],
        highlights: ["Propositie en call-to-action centraal", "Visueel concept per campagne", "Opname voorbereid voor meerdere formaten"],
      },
      outcomes: {
        title: "Campagnecontent die gericht één aanbod ondersteunt",
        intro: "De productie brengt boodschap, product en vervolgstap samen zonder onnodige uitleg.",
        items: [
          { title: "Snelle herkenning", description: "Het openingsbeeld en de eerste tekst maken meteen duidelijk voor wie het aanbod bedoeld is." },
          { title: "Concreet productvoordeel", description: "Gebruik, detail en context laten zien wat een algemene claim anders alleen zou vertellen." },
          { title: "Samenhangende campagneversies", description: "Verschillende lengtes en kaders behouden dezelfde visuele lijn en kernboodschap." },
        ],
      },
      idealFor: {
        title: "Voor een aanbod dat tijdelijk extra aandacht krijgt",
        intro: "Een promovideo is geschikt wanneer onderwerp, doelgroep en gewenste vervolgstap duidelijk afgebakend zijn.",
        items: [
          { title: "Productlanceringen", description: "Introduceer vorm, toepassing en onderscheidende details binnen één campagneconcept." },
          { title: "Nieuwe diensten", description: "Maak een niet-tastbaar aanbod begrijpelijk via situaties, uitleg en een gerichte actie." },
          { title: "Seizoenscampagnes", description: "Bouw sfeer en urgentie rond een specifiek moment zonder je volledige merkverhaal te herhalen." },
        ],
      },
      deliverables: {
        title: "Promovideo's klaar voor je campagnekanalen",
        intro: "We spreken de montagevarianten vooraf af, zodat de shoot precies het juiste materiaal verzamelt.",
        items: [
          { title: "Hoofdmontage", description: "De volledige campagneboodschap met afgewerkt beeld, geluid, titels en call-to-action." },
          { title: "Korte advertentieversies", description: "Afgesproken uitsneden met een eigen opening en begrijpelijke kern voor korte plaatsingen." },
          { title: "Verticale en horizontale kaders", description: "Apart opgebouwde exports wanneer beide verhoudingen in het productieplan staan." },
          { title: "Ondertiteling en schermtekst", description: "Leesbare kerntekst voor situaties waarin de kijker geen geluid gebruikt." },
          { title: "Alternatieve eindkaarten", description: "Verschillende calls-to-action of bestemmingen indien vooraf voorzien." },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een promovideo?",
        paragraphs: [
          "Concept en uitvoering bepalen samen de omvang. Een productdemonstratie in één gecontroleerde setting verschilt van een campagne met acteurs, meerdere locaties, styling en verschillende scenario's. Ook de hoeveelheid varianten die tijdens de opname nodig is, heeft invloed.",
          "In postproductie tellen het montageritme, grafiek, geluidsontwerp, ondertiteling en aantal lengtes of formaten mee. We zetten eerst de noodzakelijke campagne-uitingen naast elkaar en bouwen daar een gerichte productie rond, zodat de offerte inhoudelijk controleerbaar blijft.",
        ],
        factors: ["Creatief concept en script", "Product- of locatiestyling", "Aantal scènes en locaties", "Personen voor de camera", "Props en productvarianten", "Opname van voice-over of geluid", "Grafiek en tekstanimatie", "Aantal montageversies", "Beeldverhoudingen en ondertiteling"],
      },
      whyVisualVibe: {
        title: "Waarom je promovideo ontwikkelen met VisualVibe",
        intro: "We denken vanuit de campagnebeslissing en vertalen die naar een film die visueel compact blijft.",
        items: [
          { title: "Een afgebakende propositie", description: "We helpen hoofdboodschap en ondersteunende argumenten van bijzaken scheiden." },
          { title: "Concept dat filmbaar is", description: "Shotlist en storyboard verbinden het creatieve idee met locatie, product en haalbare opname." },
          { title: "Versies vanaf het begin", description: "Korte montages en verticale kaders worden in productie voorzien, niet alleen achteraf uitgesneden." },
        ],
      },
      regional: {
        title: "Promovideo's voor campagnes in Limburg en verder",
        description: "We maken promovideo's voor ondernemingen in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, op een gekozen bedrijfs-, winkel- of campagnelocatie die het aanbod ondersteunt.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Geef je campagne één duidelijke visuele boodschap",
        description: "Deel je aanbod, doelgroep, kanalen en gewenste actie. We maken er een concreet videoconcept met passende montagevarianten van.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  "social-media-video": {
    intro:
      "Social media video vraagt om een helder idee in het juiste formaat, met een opening die zonder omweg context geeft. We ontwikkelen herhaalbare formats voor Instagram, LinkedIn, TikTok of andere gekozen kanalen en produceren beelden, interviews en korte uitleg efficiënt in één gerichte contentsessie.",
    excerpt:
      "Kanaalgerichte korte video's met een sterke opening, leesbare ondertiteling en een format dat je contentplanning ondersteunt.",
    process: [
      {
        title: "Kanalen en contentpijlers kiezen",
        description:
          "We bekijken doelgroep, publicatieritme en de rol van elk platform. Daarna kiezen we een beperkt aantal thema's en formats die passen bij je expertise, merkstem en beschikbare mensen.",
      },
      {
        title: "Hooks en draaiblokken voorbereiden",
        description:
          "Per video werken we opening, kern en afsluiting uit. We groeperen scripts, vragen, locaties, producten en extra beelden in logische blokken voor een haalbare batchopname.",
      },
      {
        title: "Verticaal en modulair opnemen",
        description:
          "Tijdens de contentsessie begeleiden we tempo en presentatie en filmen we aanvullende details of acties. Kaders houden rekening met interface-elementen, ondertitels en veilige tekstzones.",
      },
      {
        title: "Korte afleveringen herkenbaar monteren",
        description:
          "We verwijderen aanloop, scherpen ritme aan en voegen afgesproken titels en ondertiteling toe. Elke aflevering krijgt een zelfstandige boodschap binnen dezelfde visuele formatlijn.",
      },
    ],
    faqs: [
      {
        question: "Voor welk socialmediakanaal moeten we eerst video maken?",
        answer:
          "Kies het kanaal waar je doelgroep werkelijk actief is en waar je team consequent kan publiceren. LinkedIn, Instagram en TikTok hebben andere kijkcontexten. We stemmen format, onderwerp en toon af op één duidelijke kanaalrol.",
      },
      {
        question: "Kunnen we meerdere korte video's op één opnamedag maken?",
        answer:
          "Ja, een batch werkt goed wanneer scripts, kleding, locaties en props vooraf zijn gegroepeerd. We bewaken voldoende aandacht per onderwerp. Het doel is een bruikbare reeks, niet zoveel mogelijk takes zonder redactionele samenhang.",
      },
      {
        question: "Moeten alle sociale video's verticaal worden opgenomen?",
        answer:
          "Niet altijd. Verticale video past bij veel mobiele feeds, terwijl LinkedIn, YouTube of een website ook andere kaders gebruiken. We kiezen per distributieplan en kunnen meerdere composities opnemen wanneer dat vooraf in de shotlist staat.",
      },
      {
        question: "Schrijven jullie ook hooks en korte scripts?",
        answer:
          "We kunnen je inhoud structureren in een sterke opening, compacte kern en passende vervolgstap. Vakinhoudelijke juistheid blijft bij je organisatie. Je levert expertise en voorbeelden, wij helpen die begrijpelijk en filmbaar formuleren.",
      },
      {
        question: "Is ondertiteling belangrijk voor social media video?",
        answer:
          "Veel video's worden in situaties bekeken waarin geluid niet vanzelfsprekend is. Ondertiteling en tekst in beeld kunnen de boodschap zelfstandig leesbaar maken. We houden zinnen compact en bewaken contrast en plaatsing binnen het gekozen kader.",
      },
    ],
    relatedServices: ["promovideo", "brandingfotografie", "podcast-video", "seo-copywriting", "bedrijfsvideo"],
    seo: {
      title: "Social media video voor KMO's in Limburg | VisualVibe",
      description:
        "Social media video voor Instagram, LinkedIn en TikTok: herhaalbare formats, sterke hooks, batchopnames en ondertitelde montages in het juiste kader.",
      keywords: ["social media video", "social video laten maken", "verticale video", "contentvideo KMO"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "social media video",
        supportingKeywords: ["social video laten maken", "verticale video", "Reels voor bedrijven", "videocontent LinkedIn"],
        type: "commercial",
      },
      overview: {
        title: "Social media video met een herkenbaar contentformat",
        paragraphs: [
          "Social media video wordt sterker wanneer niet elke publicatie opnieuw van nul begint. Een herkenbaar format geeft houvast: een expert beantwoordt telkens één vraag, een maker toont één stap of een teamlid licht één praktijkvoorbeeld toe. De kijker begrijpt snel wat te verwachten en je organisatie kan onderwerpen gerichter voorbereiden.",
          "We koppelen formats aan contentpijlers en kanalen en schrijven per aflevering een beknopte structuur. De opname wordt ingericht als een batch met voldoende visuele afwisseling. In de montage krijgt elke video een directe opening, leesbare ondertiteling en een passend einde. We vermijden lange logo-intro's of algemene bedrijfsuitleg wanneer die de concrete inhoud vertraagt.",
        ],
        highlights: ["Formats per kanaal en doelgroep", "Batchgewijze contentproductie", "Directe hooks en compacte scripts", "Ondertitels binnen veilige zones"],
      },
      outcomes: {
        title: "Een videoreeks die publicatie eenvoudiger maakt",
        intro: "Je ontvangt afzonderlijke afleveringen die inhoudelijk samenhangen maar elk zelfstandig te bekijken zijn.",
        items: [
          { title: "Meer inhoudelijke focus", description: "Elke video behandelt één vraag, inzicht, toepassing of vervolgstap." },
          { title: "Een herkenbare reeks", description: "Vaste visuele elementen en presentatievorm verbinden afleveringen over verschillende thema's." },
          { title: "Efficiënter hergebruik", description: "Een voorbereide opname kan hoofdvideo's, korte fragmenten en ondersteunende beelden combineren." },
        ],
      },
      idealFor: {
        title: "Voor teams met expertise en verhalen om te delen",
        intro: "Korte video werkt vooral wanneer je regelmatig relevante onderwerpen kan koppelen aan echte mensen of situaties.",
        items: [
          { title: "Zelfstandige experts", description: "Leg veelgestelde vragen en heldere standpunten uit in een persoonlijk format." },
          { title: "KMO-marketingteams", description: "Bouw een geplande voorraad rond diensten, cultuur, cases en praktische tips." },
          { title: "Productmerken", description: "Toon gebruik, vergelijking, onderhoud en details in korte visuele afleveringen." },
        ],
      },
      deliverables: {
        title: "Een publiceerbare reeks korte videomodules",
        intro: "Aantal, lengte en platformversies worden vóór de opnamedag als concrete afleveringen vastgelegd.",
        items: [
          { title: "Afzonderlijke socialvideo's", description: "Gemonteerde afleveringen met elk een eigen onderwerp, hook en afsluiting." },
          { title: "Ingebrande ondertiteling", description: "Leesbare tekst afgestemd op spreektempo en veilige ruimte in het beeld." },
          { title: "Herkenbare titels", description: "Afgesproken naamkaart, rubriektitel of grafisch element binnen je merkstijl." },
          { title: "Verticale exports", description: "Bestanden voor mobiele feeds en korte-videoformaten volgens het distributieplan." },
          { title: "Aanvullende kanaalversies", description: "Vierkante of horizontale varianten wanneer die in opname en montage zijn voorzien." },
          { title: "Geordende afleveringsset", description: "Duidelijke bestandsnamen per thema, volgorde of beoogde publicatie." },
        ],
      },
      pricing: {
        title: "Hoe wordt een social media videoreeks begroot?",
        paragraphs: [
          "De prijs volgt uit het aantal unieke formats en afleveringen, niet alleen uit de totale opnameduur. Tien antwoorden in één vaste setting vragen een andere voorbereiding en montage dan productscènes, interviews en meerdere locaties door elkaar.",
          "Scripts, presentatiesupport, styling, grafiek, ondertiteling en platformvarianten tellen eveneens mee. We maken vooraf een afleveringsoverzicht en groeperen productieblokken. Daardoor is zichtbaar welke inhoud wordt opgenomen en hoeveel afzonderlijke montages worden afgewerkt.",
        ],
        factors: ["Aantal contentpijlers en formats", "Aantal afleveringen", "Script- en hookontwikkeling", "Aantal sprekers of producten", "Locaties en setwissels", "Grafische formatonderdelen", "Ondertiteling", "Montage per aflevering", "Aantal beeldverhoudingen"],
      },
      whyVisualVibe: {
        title: "Waarom social video maken met VisualVibe",
        intro: "We combineren redactionele structuur met een productieopzet die herhaling en variatie in balans houdt.",
        items: [
          { title: "Formatdenken", description: "We bouwen een terugkerende vorm die nieuwe onderwerpen niet telkens opnieuw laat beginnen." },
          { title: "Voorbereid in batches", description: "Scripts, looks en scènes worden gegroepeerd zonder de inhoud per aflevering te verwaarlozen." },
          { title: "Gemaakt voor de feed", description: "Hook, tekstplaatsing, tempo en verhouding volgen de gekozen kijkcontext." },
        ],
      },
      regional: {
        title: "Social media video in Limburg en omliggende regio's",
        description: "We organiseren contentsessies voor zelfstandigen en KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, op kantoor of een locatie die bij het gekozen format past.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Bouw je losse ideeën om tot een videoreeks",
        description: "Deel je kanalen, doelgroep en terugkerende onderwerpen. We helpen je kiezen, structureren en plannen voor een gerichte contentproductie.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  "event-aftermovie": {
    intro:
      "Een event-aftermovie vat de inhoud, sfeer en energie van je evenement samen in een korte film. We werken vanuit het draaiboek, plannen onmisbare momenten en interviews, volgen gasten en programma alert en bouwen de montage op als een terugblik die deelnemers betrekt en een volgende editie context geeft.",
    excerpt:
      "Een ritmische terugblik met programmahoogtepunten, publieksreacties, sfeer en merkdetails uit je zakelijke evenement.",
    process: [
      {
        title: "Het eventverhaal in het draaiboek vinden",
        description:
          "We bespreken doel, publiek, programma en gewenste vervolgcommunicatie. Daaruit selecteren we de momenten, personen en sfeerwissels die samen het verhaal van deze editie vormen.",
      },
      {
        title: "Dekking, interviews en posities plannen",
        description:
          "We stemmen podiumtoegang, licht, geluid, locatiezones en eventuele interviews af. Een opnameplan voorkomt conflicten tussen parallelle onderdelen en duidt prioriteiten duidelijk aan.",
      },
      {
        title: "Hoogtepunten en tussenmomenten verzamelen",
        description:
          "Tijdens het event filmen we ontvangst, optredens, sprekers, reacties, gesprekken, branding en details. We bewegen discreet en geven alleen gerichte regie bij geplande interviews of groepsmomenten.",
      },
      {
        title: "De sfeer als compacte film opbouwen",
        description:
          "We selecteren een duidelijke boog, monteren beeld en geluid op ritme en verwerken titels of uitspraken. Daarna maken we afgesproken hoofd- en sociale versies.",
      },
    ],
    faqs: [
      {
        question: "Wat maakt een aftermovie meer dan een montage van hoogtepunten?",
        answer:
          "Een sterke terugblik heeft een begin, ontwikkeling en afronding. Contextbeelden, reacties en korte uitspraken verbinden de grote momenten. Daardoor ziet een kijker niet alleen wat er op het podium gebeurde, maar begrijpt die ook de sfeer en bedoeling.",
      },
      {
        question: "Kunnen bezoekers tijdens het event kort geïnterviewd worden?",
        answer:
          "Ja. We plannen een rustige plek en compacte vragen die aansluiten bij het verhaal. De organisator helpt geschikte deelnemers vinden en regelt de nodige communicatie of toestemming. Spontane interviews zonder voorbereiding zijn niet voor elk event passend.",
      },
      {
        question: "Hoe wordt het geluid van speeches in een aftermovie gebruikt?",
        answer:
          "We bespreken vooraf of een technische audiobron van zaal of podium beschikbaar is en nemen waar passend aanvullend geluid op. In montage selecteren we korte inhoudelijke fragmenten. De kwaliteit hangt mee af van locatie en evenementtechniek.",
      },
      {
        question: "Kunnen eventfotografie en aftermovie samen worden gepland?",
        answer:
          "Ja. Beide teams kunnen met één prioriteitenlijst en draaiboek werken. We stemmen posities, groepsmomenten en interviews af, zodat fotografie en video elkaar niet hinderen en samen een consistente visuele terugblik vormen.",
      },
      {
        question: "Welke informatie moet definitief zijn vóór de eventopname?",
        answer:
          "We hebben minstens locatieafspraken, actueel programma, belangrijke namen, podiumregels en contactpersonen nodig. Ook huisstijl, gewenste titels, calls-to-action en afspraken over gasten helpen om montage en publicatie van tevoren goed te organiseren.",
      },
    ],
    relatedServices: ["eventfotografie", "event-dronebeelden", "social-media-video", "podcast-video", "brandingfotografie"],
    seo: {
      title: "Event-aftermovie laten maken in Limburg | VisualVibe",
      description:
        "Event-aftermovie laten maken met sterke programmafragmenten, gasten, sfeer en merkdetails, gemonteerd als terugblik voor deelnemers en volgende edities.",
      keywords: ["event-aftermovie", "aftermovie laten maken", "eventvideo Limburg", "bedrijfsevent filmen"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "event-aftermovie",
        supportingKeywords: ["aftermovie laten maken", "eventvideo", "bedrijfsevent filmen", "aftermovie Limburg"],
        type: "commercial",
      },
      overview: {
        title: "Een event-aftermovie die de dag opnieuw laat voelen",
        paragraphs: [
          "Een event-aftermovie is een samenvatting met emotie en context. De film moet tonen wie er samenkwam, wat er inhoudelijk gebeurde en hoe het programma zich ontwikkelde. Alleen snelle sfeerbeelden missen vaak betekenis, terwijl een volledige registratie de compacte kracht van een aftermovie verliest. We zoeken de juiste verhouding tussen programma, mensen, omgeving en merk.",
          "Daarom lezen we vooraf het draaiboek als een verhaal. We markeren openingsbeelden, sleutelmomenten, reacties, mogelijke uitspraken en een passend einde. Op de dag zelf verzamelen we ook overgangen en details die de montage adem geven. Muziek, omgevingsgeluid en korte interview- of podiumfragmenten worden vervolgens in één ritmische lijn samengebracht.",
        ],
        highlights: ["Verhaallijn vanuit het eventprogramma", "Sfeer, inhoud en reacties in balans", "Voorbereide interview- en audiomomenten", "Hoofdversie en korte vervolgcontent"],
      },
      outcomes: {
        title: "Een terugblik die meer doet dan archiveren",
        intro: "De film geeft deelnemers herkenning en nieuwe kijkers voldoende context voor je eventcommunicatie.",
        items: [
          { title: "Herbeleefbare sfeer", description: "Reacties, beweging, licht en geluid brengen de energie van het moment opnieuw dichtbij." },
          { title: "Zichtbare eventwaarde", description: "Sprekers, ontmoetingen en programmaonderdelen maken concreet wat bezoekers kregen." },
          { title: "Materiaal voor een volgende editie", description: "Korte versies en sterke scènes ondersteunen aankondiging, partnerwerving en sociale terugblik." },
        ],
      },
      idealFor: {
        title: "Voor zakelijke events met een eigen identiteit",
        intro: "We passen toon en ritme aan de inhoud aan, van ingetogen kennisdag tot energieke lancering.",
        items: [
          { title: "Congressen en studiedagen", description: "Combineer inhoudelijke fragmenten met publiek, netwerking en locatiedetails." },
          { title: "Openingen en productlanceringen", description: "Bouw naar onthulling en reacties toe met het merk zichtbaar in context." },
          { title: "Bedrijfsfeesten en jubilea", description: "Leg waardering, ontmoetingen en feestelijke momenten levendig maar verzorgd vast." },
        ],
      },
      deliverables: {
        title: "Een complete eventfilm voor terugblik en vervolg",
        intro: "We spreken vooraf de benodigde lengtes, kaders en inhoudelijke accenten af.",
        items: [
          { title: "Gemonteerde aftermovie", description: "De hoofdterugblik met afgewerkt beeld, geluidsmix, muziek en titels." },
          { title: "Korte sociale versie", description: "Een compacte montage met een zelfstandige opening en duidelijke eventcontext." },
          { title: "Verticale uitsnede", description: "Een apart opgebouwd mobiel kader wanneer dit in het opnameplan is voorzien." },
          { title: "Naam- en merktitels", description: "Afgesproken eventnaam, datum, partners of call-to-action in passende vormgeving." },
          { title: "Ondertitelde variant", description: "Leesbare weergave van interviews of podiumuitspraken wanneer afgesproken." },
        ],
      },
      pricing: {
        title: "Welke factoren bepalen de prijs van een aftermovie?",
        paragraphs: [
          "Duur en complexiteit van het programma bepalen hoeveel dekking nodig is. Eén zaal met een vaste volgorde verschilt van een festivalopzet met parallelle podia, backstagezones en meerdere belangrijke gasten. Het opnameplan maakt duidelijk welke momenten voorrang krijgen.",
          "Interviews, technische audio, meerdere camera- of teamposities, grafiek en verschillende montageversies beïnvloeden eveneens de productie. We bekijken draaiboek en locatie samen en beschrijven zowel eventdekking als postproductie concreet in de offerte.",
        ],
        factors: ["Omvang en duur van het programma", "Aantal zalen of zones", "Parallelle activiteiten", "Aantal geplande interviews", "Podium- en audiotechniek", "Lichtomstandigheden", "Toegang en verplaatsingen", "Montageritme en grafiek", "Aantal lengtes en beeldformaten"],
      },
      whyVisualVibe: {
        title: "Waarom je aftermovie maken met VisualVibe",
        intro: "We behandelen het draaiboek als verhaallijn en blijven tegelijk alert voor onverwachte menselijke momenten.",
        items: [
          { title: "Prioriteiten vóór de deuren openen", description: "Programma, personen, partners en publicatiedoelen sturen onze opnamekeuzes." },
          { title: "Inhoud én energie", description: "Sfeerbeelden krijgen context via uitspraken, reacties en herkenbare programmaonderdelen." },
          { title: "Montage met vervolgdoel", description: "De film wordt opgebouwd voor terugblik én de afgesproken communicatie rond volgende stappen." },
        ],
      },
      regional: {
        title: "Event-aftermovies in Limburg en omliggende regio's",
        description: "We filmen zakelijke events in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, met een productieplan dat past bij de locatie, het programma en de gewenste terugblik.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Geef je event een filmisch vervolg",
        description: "Stuur datum, locatie, draaiboek en communicatiedoel. We bepalen samen welke momenten, geluiden en versies je aftermovie nodig heeft.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  wervingsvideo: {
    intro:
      "Een wervingsvideo laat kandidaten zien wat een functie, team en werkplek in de praktijk betekenen. We vertrekken van de vragen van de juiste kandidaat, kiezen geloofwaardige medewerkers en situaties en bouwen een eerlijk werkgeversverhaal dat vacatures, werken-bijpagina's en sociale wervingscampagnes ondersteunt.",
    excerpt:
      "Een menselijk werkgeversverhaal met echte collega's, concrete werksituaties en gerichte versies voor je vacaturekanalen.",
    process: [
      {
        title: "Kandidaatvragen en functiecontext onderzoeken",
        description:
          "We bespreken doelgroep, rol, werkomgeving en verwachtingen die kandidaten vaak hebben. Samen kiezen we welke cultuurkenmerken en dagelijkse situaties aantoonbaar relevant zijn voor het verhaal.",
      },
      {
        title: "Medewerkers en verhaallijn voorbereiden",
        description:
          "We selecteren passende gesprekspartners, maken interviewvragen en bouwen een shotlist rond echte taken en samenwerking. Deelnemers weten vooraf wat er praktisch van hen wordt verwacht.",
      },
      {
        title: "Werk en collega's authentiek filmen",
        description:
          "Op locatie begeleiden we interviews en leggen we herkenbare handelingen, overleg en omgeving vast. We regisseren het beeld waar nodig zonder een fictieve werkdag te creëren.",
      },
      {
        title: "Het werkgeversverhaal per vacature monteren",
        description:
          "We selecteren concrete uitspraken, verbinden ze met relevant bewijsbeeld en verzorgen titels en ondertiteling. Afgesproken korte varianten krijgen elk een duidelijke functie of kandidaatvraag.",
      },
    ],
    faqs: [
      {
        question: "Wie komt het best aan het woord in een wervingsvideo?",
        answer:
          "Kies medewerkers die de functie, samenwerking of ontwikkeling uit eigen ervaring kunnen toelichten. Een leidinggevende kan context geven, maar collega's uit het dagelijkse team maken verwachtingen vaak concreter. Niet iedereen hoeft in dezelfde video te spreken.",
      },
      {
        question: "Moeten we alleen de positieve kanten van de job tonen?",
        answer:
          "Een geloofwaardig verhaal benoemt wat het werk aantrekkelijk maakt én geeft realistische context over omgeving, taken of samenwerking. We formuleren zorgvuldig en vermijden beloften die de praktijk niet ondersteunt. Je HR-team controleert de inhoudelijke juistheid.",
      },
      {
        question: "Kan één werkgeversvideo voor meerdere vacatures dienen?",
        answer:
          "Een overkoepelende cultuurvideo kan breed bruikbaar zijn. Voor functies met verschillende taken of doelgroepen zijn aanvullende modules vaak helderder. We kunnen een hoofdverhaal en functiegerichte korte versies binnen één productie voorbereiden.",
      },
      {
        question: "Hoe helpen jullie medewerkers die geen camera-ervaring hebben?",
        answer:
          "We delen vooraf thema's en praktische tips, maar vragen geen ingestudeerde getuigenis. Tijdens het interview stellen we één vraag tegelijk, geven we tijd om opnieuw te formuleren en zoeken we naar concrete voorbeelden in gewone taal.",
      },
      {
        question: "Waar kan een recruitmentvideo worden gepubliceerd?",
        answer:
          "Veelgebruikte plaatsen zijn een werken-bijpagina, vacaturedetail, LinkedIn, andere sociale kanalen, jobbeurs of interne doorverwijzing. We stemmen lengte, verhouding, ondertiteling en call-to-action af op de gekozen kandidatenroute.",
      },
    ],
    relatedServices: ["bedrijfsvideo", "zakelijke-portretten", "social-media-video", "bedrijfsfotografie", "webdesign"],
    seo: {
      title: "Wervingsvideo laten maken voor KMO's | VisualVibe Limburg",
      description:
        "Wervingsvideo laten maken met echte medewerkers, concrete functies en een geloofwaardig werkgeversverhaal voor vacatures, werken-bijpagina en social media.",
      keywords: ["wervingsvideo", "wervingsvideo laten maken", "recruitmentvideo", "employer branding video"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "wervingsvideo",
        supportingKeywords: ["wervingsvideo laten maken", "recruitmentvideo", "employer branding video", "vacaturevideo"],
        type: "commercial",
      },
      overview: {
        title: "Een wervingsvideo die kandidaten echte context geeft",
        paragraphs: [
          "Een wervingsvideo is geen algemene bedrijfspresentatie met een vacaturetitel eronder. Kandidaten willen weten met wie ze samenwerken, wat ze werkelijk doen en welke omgeving of verwachtingen bij de rol horen. We vertrekken daarom van hun vragen en onzekerheden en kiezen medewerkers en scènes die daarop een concreet antwoord kunnen geven.",
          "De voorbereiding gebeurt samen met HR en mensen uit het team. We scherpen taal aan, maar schrijven geen enthousiaste getuigenissen voor die niet als eigen woorden voelen. Tijdens de opname combineren we interviews met echte werkhandelingen en relevante ruimtes. In de montage blijft het verhaal specifiek genoeg om zichzelf te herkennen of juist bewust niet te solliciteren.",
        ],
        highlights: ["Kandidaatperspectief als vertrekpunt", "Echte medewerkers en werksituaties", "Interviewvragen zonder ingestudeerde slogans", "Versies voor vacature en sociale werving"],
      },
      outcomes: {
        title: "Een realistischer eerste beeld van de werkgever",
        intro: "De video helpt kandidaten functie en cultuur beoordelen vóór ze een gesprek aangaan.",
        items: [
          { title: "Menselijke kennismaking", description: "Toekomstige collega's en leidinggevenden geven het team een herkenbaar gezicht." },
          { title: "Concretere functiecontext", description: "Taken, gereedschap, ruimtes en samenwerking maken algemene vacaturetaal zichtbaar." },
          { title: "Herbruikbaar werkgeversmateriaal", description: "Hoofdverhaal en korte modules ondersteunen meerdere stappen in de kandidatenroute." },
        ],
      },
      idealFor: {
        title: "Voor werkgevers die meer dan een functielijst willen tonen",
        intro: "Video is waardevol wanneer mensen, werkcontext of cultuur moeilijk volledig in tekst te vatten zijn.",
        items: [
          { title: "Technische en praktische functies", description: "Laat werkplek, materialen, veiligheid en samenwerking concreet zien." },
          { title: "KMO's met een hecht team", description: "Geef kandidaten een eerlijke indruk van directe lijnen en dagelijkse omgang." },
          { title: "Groeiende organisaties", description: "Bouw een werkgeversverhaal dat verschillende vacatures inhoudelijk kan ondersteunen." },
          { title: "Moeilijk uit te leggen rollen", description: "Combineer medewerkerstaal met relevante beelden van taken en impact." },
        ],
      },
      deliverables: {
        title: "Wervingscontent voor de volledige kandidatenroute",
        intro: "De precieze video's worden gekoppeld aan functies, kanalen en vragen die je wil beantwoorden.",
        items: [
          { title: "Hoofdwervingsvideo", description: "Een afgerond werkgevers- of functieverhaal met interviews en werkbeelden." },
          { title: "Functiegerichte fragmenten", description: "Korte montages rond een rol, collega, taak of veelgestelde kandidaatvraag." },
          { title: "Ondertitelde versie", description: "Leesbare interviews voor mobiele en geluidloze kijkcontexten." },
          { title: "Vacaturegerichte eindkaart", description: "Afgesproken functie, vervolgstap of verwijzing naar de sollicitatiepagina." },
          { title: "Kanaalexports", description: "Passende horizontale, vierkante of verticale bestanden wanneer vooraf gepland." },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een wervingsvideo?",
        paragraphs: [
          "De omvang hangt af van het aantal functies, medewerkers, locaties en verhalen. Eén video rond een specifieke ploeg verschilt van een brede employer-brandingproductie met meerdere vestigingen en functieprofielen. Ook interne voorbereiding en beschikbaarheid spelen mee.",
          "Daarnaast vragen interviewvoorbereiding, werkbeelden, ondertiteling, grafiek en korte vacatureversies afzonderlijke aandacht. We bespreken eerst welke kandidaatvragen de video moet beantwoorden en bouwen daar een doelgerichte productie en transparante oplevering rond.",
        ],
        factors: ["Aantal functies of doelgroepen", "Aantal medewerkers in beeld", "Interviewvoorbereiding", "Aantal werkplekken of locaties", "Complexiteit van werksituaties", "Veiligheids- en planningsafspraken", "Montage van functievarianten", "Titels en ondertiteling", "Aantal kanaalformaten"],
      },
      whyVisualVibe: {
        title: "Waarom je wervingsvideo maken met VisualVibe",
        intro: "We brengen HR-doelen, kandidaatvragen en echte teamverhalen samen zonder de werkpraktijk mooier te schrijven dan ze is.",
        items: [
          { title: "Kandidaatgerichte redactie", description: "Interview en shotlist beantwoorden concrete vragen over rol, team en omgeving." },
          { title: "Rustige medewerkerbegeleiding", description: "Collega's spreken vanuit eigen ervaring en krijgen heldere steun voor de camera." },
          { title: "Modulair inzetbaar", description: "We plannen een hoofdverhaal en relevante uitsneden rond functies of kanalen." },
        ],
      },
      regional: {
        title: "Wervingsvideo's voor werkgevers in Limburg en verder",
        description: "We filmen werkgevers en teams in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, op de werkplek waar kandidaten de functie en cultuur het meest concreet kunnen ervaren.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Laat kandidaten kennismaken vóór het eerste gesprek",
        description: "Deel je vacatures, kandidaatvragen en werkplekken. We werken een eerlijk videoconcept uit rond de mensen die de job werkelijk kennen.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  "testimonial-video": {
    intro:
      "Een testimonial-video laat een klant in eigen woorden vertellen over aanleiding, samenwerking en ervaring. We bereiden het gesprek inhoudelijk voor zonder antwoorden voor te schrijven, filmen de getuigenis in een passende omgeving en ondersteunen uitspraken met relevante beelden van persoon, product, project of werkwijze.",
    excerpt:
      "Een geloofwaardig klantverhaal met zorgvuldig interview, concrete context en ondersteunende beelden voor website en sales.",
    process: [
      {
        title: "Een relevante klantcase afbakenen",
        description:
          "We bespreken waarom deze klant en ervaring passen bij de vragen van je doelgroep. Onderwerp, deelnemers, context en gebruik worden duidelijk vastgelegd, inclusief toestemming en inhoudelijke gevoeligheden.",
      },
      {
        title: "Voorgesprek en vragenlijn voorbereiden",
        description:
          "Een kort inhoudelijk gesprek brengt aanleiding, keuzeproces, samenwerking en concrete ervaring in kaart. We maken open vragen en bepalen welke locaties of aanvullende beelden het verhaal kunnen ondersteunen.",
      },
      {
        title: "Getuigenis en context rustig opnemen",
        description:
          "We creëren een comfortabele interviewsituatie, stellen vragen buiten beeld en laten ruimte voor eigen formuleringen. Daarna filmen we relevante handelingen, omgeving en details zonder de case na te spelen.",
      },
      {
        title: "Een eerlijk en compact verhaal monteren",
        description:
          "We ordenen uitspraken met behoud van betekenis, verwijderen herhaling en voegen ondersteunend beeld, titels en ondertiteling toe. De afgesproken inhoudelijke controle volgt vóór definitieve export.",
      },
    ],
    faqs: [
      {
        question: "Krijgt de klant vooraf de interviewvragen?",
        answer:
          "We delen doorgaans thema's en praktische verwachtingen, zodat de klant weet waarover het gesprek gaat. Volledig uitgeschreven antwoorden zijn niet nodig. Een voorgesprek helpt concrete voorbeelden ophalen terwijl de formulering tijdens de opname natuurlijk blijft.",
      },
      {
        question: "Wat als de klant zenuwachtig is voor de camera?",
        answer:
          "We bouwen rustig op met eenvoudige vragen en laten een antwoord opnieuw formuleren wanneer nodig. De spreker kijkt meestal naar de interviewer in plaats van rechtstreeks in de lens. Een vertrouwde locatie kan extra comfort geven.",
      },
      {
        question: "Mogen we de uitspraak van een klant inhoudelijk aanpassen?",
        answer:
          "Montage kan herhaling inkorten en antwoorden logisch ordenen, maar mag de bedoelde betekenis niet veranderen. We signaleren onduidelijkheden en volgen de afgesproken review. De klant moet zich in de uiteindelijke getuigenis kunnen herkennen.",
      },
      {
        question: "Welke extra beelden passen bij een testimonial?",
        answer:
          "Dat kunnen productgebruik, een gerealiseerd project, relevante ruimtes, overleg of details zijn die de uitspraak verduidelijken. We kiezen alleen beelden die werkelijk bij de case horen en vermijden generieke scènes die meer suggereren dan de klant vertelt.",
      },
      {
        question: "Kan één klantinterview meerdere korte video's opleveren?",
        answer:
          "Ja, wanneer het gesprek meerdere zelfstandige thema's bevat en die uitsneden vooraf zijn gepland. We kunnen bijvoorbeeld een hoofdverhaal en korte antwoorden rond keuze, aanpak of ervaring maken, elk met voldoende context.",
      },
    ],
    relatedServices: ["bedrijfsvideo", "realisatiefotografie", "social-media-video", "promovideo", "webdesign"],
    seo: {
      title: "Testimonial-video laten maken in Limburg | VisualVibe",
      description:
        "Testimonial-video laten maken met een natuurlijk klantinterview, relevante context en zorgvuldige montage voor je website, sales en social media.",
      keywords: ["testimonial-video", "testimonial video laten maken", "klantvideo", "klantgetuigenis video"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "testimonial-video",
        supportingKeywords: ["testimonial video laten maken", "klantvideo", "klantgetuigenis filmen", "casevideo"],
        type: "commercial",
      },
      overview: {
        title: "Een testimonial-video in de woorden van je klant",
        paragraphs: [
          "Een testimonial-video is geloofwaardig wanneer het verhaal specifiek blijft. Waarom zocht de klant hulp, welke afweging speelde mee en hoe werd de samenwerking ervaren? Algemene superlatieven zeggen weinig zonder context. Daarom gebruiken we open vragen en zoeken we naar concrete momenten of voorbeelden die de klant zelf relevant vindt.",
          "We schrijven geen lofrede voor. Het voorgesprek helpt de inhoud ordenen en zorgt dat locatie en aanvullend beeld werkelijk bij de case passen. Tijdens de montage brengen we een duidelijke lijn aan zonder uitspraken uit hun verband te halen. Titels kunnen noodzakelijke context geven, terwijl beelden van gebruik, project of omgeving laten zien waarover de spreker praat.",
        ],
        highlights: ["Open vragen zonder voorgeschreven antwoorden", "Ondersteunend beeld uit de echte case", "Inhoudelijke review met behoud van betekenis"],
      },
      outcomes: {
        title: "Een klantverhaal dat vragen herkenbaar maakt",
        intro: "De getuigenis geeft prospects context vanuit het perspectief van iemand die de samenwerking heeft meegemaakt.",
        items: [
          { title: "Een menselijk referentiepunt", description: "Een echte spreker brengt twijfels, keuze en ervaring in gewone taal samen." },
          { title: "Concretere casecontext", description: "Projectbeelden en details maken zichtbaar waarop de getuigenis betrekking heeft." },
          { title: "Inzetbare bewijscontent", description: "Hoofdvideo en thematische fragmenten ondersteunen casepagina's, presentaties en sociale posts." },
        ],
      },
      idealFor: {
        title: "Voor organisaties met relevante klantverhalen",
        intro: "Een testimonial past wanneer de ervaring inhoudelijk aansluit bij vragen van toekomstige klanten.",
        items: [
          { title: "Dienstverlenende KMO's", description: "Laat een klant proces en samenwerking toelichten wanneer het aanbod niet tastbaar is." },
          { title: "Bouw- en projectbedrijven", description: "Verbind ervaring van de opdrachtgever met beelden van de gerealiseerde context." },
          { title: "B2B-oplossingen", description: "Maak afweging, implementatie en dagelijks gebruik begrijpelijk via de betrokken persoon." },
        ],
      },
      deliverables: {
        title: "Een volledig klantverhaal en gerichte fragmenten",
        intro: "De montage-opzet volgt uit onderwerp, beschikbare contextbeelden en afgesproken kanalen.",
        items: [
          { title: "Gemonteerde testimonial", description: "Een afgerond interviewverhaal met kleur, geluid, titels en ondersteunende beelden." },
          { title: "Ondertitelde versie", description: "Leesbare weergave van de gesproken getuigenis voor web en mobiele kanalen." },
          { title: "Thematische fragmenten", description: "Korte antwoorden rond vooraf gekozen vragen wanneer voldoende zelfstandige context aanwezig is." },
          { title: "Kanaalgerichte exports", description: "Bestanden in de verhoudingen en resoluties die in de productie zijn voorzien." },
        ],
      },
      pricing: {
        title: "Welke keuzes bepalen de prijs van een testimonial-video?",
        paragraphs: [
          "De productie hangt af van het aantal klantverhalen, locaties en inhoudelijke onderdelen. Eén gesprek met beschikbare projectbeelden verschilt van een case waarvoor we interview, productgebruik, werkomgeving en meerdere betrokkenen apart opnemen.",
          "Voorgesprek, reis en planning met de klant, geluids- en lichtopstelling, montage, ondertiteling en fragmenten tellen mee. We leggen verantwoordelijkheden voor contact, toestemming en inhoudelijke review vooraf vast, zodat de offerte ook organisatorisch helder is.",
        ],
        factors: ["Aantal klanten of sprekers", "Voorgesprek en inhoudelijke voorbereiding", "Aantal locaties", "Beschikbare of nieuwe contextbeelden", "Opname van product of project", "Interview- en geluidsopstelling", "Montage en inhoudelijke review", "Ondertiteling", "Aantal korte fragmenten en formaten"],
      },
      whyVisualVibe: {
        title: "Waarom testimonial-video met VisualVibe",
        intro: "We bewaken zowel de rust van het gesprek als de inhoudelijke eerlijkheid van de uiteindelijke montage.",
        items: [
          { title: "Voorbereid zonder voor te zeggen", description: "Thema's en vragen geven richting terwijl antwoorden van de klant zelf blijven." },
          { title: "Context die klopt", description: "Aanvullende beelden komen uit de echte case en verduidelijken wat wordt verteld." },
          { title: "Zorgvuldige betekenis", description: "We monteren compact maar veranderen geen uitspraak om een sterkere claim te suggereren." },
        ],
      },
      regional: {
        title: "Klantvideo's in Limburg en omliggende regio's",
        description: "We nemen testimonials op bij klanten en bedrijven in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, op een rustige locatie die inhoudelijk bij de ervaring past.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Geef een relevant klantverhaal de juiste ruimte",
        description: "Vertel ons welke case en klantvragen centraal staan. We helpen interview, contextbeelden en review zorgvuldig en geloofwaardig voorbereiden.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  "podcast-video": {
    intro:
      "Podcastvideo maakt een gesprek zichtbaar voor YouTube, je website en korte sociale fragmenten. We stemmen set, licht, camerastandpunten, microfoons en afleveringsstructuur op elkaar af, registreren het gesprek met meerdere kaders en monteren een rustige hoofdaflevering plus vooraf gekozen clips.",
    excerpt:
      "Een verzorgde multicamera-registratie van je podcast, met synchrone audio, volledige aflevering en deelbare videofragmenten.",
    process: [
      {
        title: "Format en visuele set bepalen",
        description:
          "We bespreken gasten, gespreksvorm, publicatiekanalen en gewenste uitstraling. Daarna kiezen we achtergrond, zitposities, merkdetails en camerakaders die over afleveringen herkenbaar kunnen terugkeren.",
      },
      {
        title: "Rundown en techniek voorbereiden",
        description:
          "Een praktische rundown ordent intro, onderwerpen, eventuele rubrieken en afsluiting. We plannen camera's, microfoons, licht, monitoring en ruimte voor host, gast en productie.",
      },
      {
        title: "Het gesprek synchroon registreren",
        description:
          "Tijdens de opname bewaken we beeld, audio en continuïteit zonder het gesprek voortdurend te onderbreken. We noteren sterke momenten en nemen afgesproken intro's of aanvullingen apart op.",
      },
      {
        title: "Aflevering en clips zorgvuldig monteren",
        description:
          "We synchroniseren camera's en audiobronnen, kiezen passende camerawissels en verzorgen kleur, geluid en titels. Daarna maken we de overeengekomen korte fragmenten en exports.",
      },
    ],
    faqs: [
      {
        question: "Hoeveel camera's zijn nodig voor een podcast video?",
        answer:
          "Dat hangt af van het aantal deelnemers, de ruimte en gewenste montagestijl. Een overzicht en afzonderlijke kaders geven flexibiliteit, maar elke extra positie vraagt plaats, licht, monitoring en montage. We adviseren op basis van format.",
      },
      {
        question: "Kunnen we podcastaudio en video tegelijk opnemen?",
        answer:
          "Ja. We bouwen één afgestemde registratie op waarbij de audio ook zelfstandig bruikbaar kan zijn. De precieze audiomix, bestandsvorm en eventuele afzonderlijke audioversie worden vooraf bepaald op basis van je publicatieflow.",
      },
      {
        question: "Moet een videopodcast in een studio worden opgenomen?",
        answer:
          "Niet noodzakelijk. Een kantoor, showroom of andere locatie kan inhoudelijk sterker passen, zolang geluid, ruimte, stroom, achtergrond en onderbrekingen beheersbaar zijn. We beoordelen die factoren vóór de opstelling wordt vastgelegd.",
      },
      {
        question: "Hoe worden korte podcastclips gekozen?",
        answer:
          "We kunnen vooraf rubrieken of kandidaatmomenten bepalen en tijdens de opname tijdcodes noteren. In montage zoeken we fragmenten met een zelfstandige vraag, duidelijke kern en voldoende context, niet alleen een losse opvallende zin.",
      },
      {
        question: "Kunnen titels, intro en sponsorvermelding worden toegevoegd?",
        answer:
          "Ja, wanneer inhoud, vormgeving en plaatsing vooraf zijn afgesproken. Bezorg definitieve namen, logo's en teksten tijdig. We houden de intro functioneel en zorgen dat vermeldingen passen binnen hoofdaflevering en eventuele korte versies.",
      },
    ],
    relatedServices: ["videopodcast", "podcast-opname", "bedrijfspodcast", "social-media-video", "brandingfotografie"],
    seo: {
      title: "Podcastvideo laten opnemen in Limburg | VisualVibe",
      description:
        "Podcastvideo laten opnemen met meerdere camera's, verzorgde audio en herkenbare set, inclusief een gemonteerde aflevering en vooraf gekozen social clips.",
      keywords: ["podcast video", "podcast video opnemen", "videopodcast laten maken", "multicamera podcast"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "podcastvideo",
        supportingKeywords: ["podcast video opnemen", "videopodcast", "multicamera podcast", "podcast clips laten maken"],
        type: "commercial",
      },
      overview: {
        title: "Podcastvideo die het gesprek visueel ondersteunt",
        paragraphs: [
          "Podcast video vraagt een andere benadering dan simpelweg een camera naast een microfoon zetten. De kijker wil reacties, beurtwissels en non-verbale momenten kunnen volgen, terwijl de deelnemers een natuurlijk gesprek voeren. Camerastandpunten, kijkrichtingen en licht moeten daarom samen worden ontworpen en mogen de ruimte niet onnodig oncomfortabel maken.",
          "We bouwen een herkenbare set rond je format en testen audio en beeld als één systeem. Tijdens de registratie bewaken we continuïteit en markeren we fragmenten met potentieel voor kortere content. In de montage blijven camerawissels functioneel en krijgt het gesprek voorrang op effect. Titels, ondertiteling en clips worden afgestemd op YouTube, website of sociale distributie.",
        ],
        highlights: ["Afgestemde multicamera- en audioregistratie", "Herkenbare set voor terugkerende afleveringen", "Rustige montage rond het gesprek", "Zelfstandige clips met voldoende context"],
      },
      outcomes: {
        title: "Eén gesprek met meerdere publicatiemogelijkheden",
        intro: "De videoregistratie maakt je lange aflevering zichtbaar en levert gerichte ingangen voor korte content.",
        items: [
          { title: "Meer menselijke nuance", description: "Blik, reactie en lichaamstaal voegen betekenis toe aan wat luisteraars alleen horen." },
          { title: "Een herkenbaar programma", description: "Vaste set, kadrering en titels bouwen visuele continuïteit tussen afleveringen." },
          { title: "Gerichte korte fragmenten", description: "Zelfstandige passages leiden kijkers vanuit sociale kanalen naar het volledige gesprek." },
        ],
      },
      idealFor: {
        title: "Voor gesprekken die ook bekeken mogen worden",
        intro: "Podcast video past bij formats waarin persoonlijkheid, demonstratie of interactie visueel waarde toevoegt.",
        items: [
          { title: "Expert- en kennisgesprekken", description: "Geef host en gast een gezicht en deel compacte inhoudelijke fragmenten." },
          { title: "Bedrijfspodcasts", description: "Bouw een herkenbare reeks rond sector, cultuur, klanten of interne expertise." },
          { title: "Panel- en rondetafelformats", description: "Maak reacties en beurtwissels overzichtelijk met geplande camerastandpunten." },
          { title: "Product- of demogesprekken", description: "Voeg relevante handelingen of objecten toe wanneer alleen audio niet volstaat." },
        ],
      },
      deliverables: {
        title: "Een volledige videoaflevering met afgeleide content",
        intro: "De oplevering wordt rond je publicatieplatform en terugkerende format ingericht.",
        items: [
          { title: "Gemonteerde hoofdaflevering", description: "Gesynchroniseerde camerawissels, afgewerkt geluid, kleur en afgesproken inhoudelijke correcties." },
          { title: "Programmatitels", description: "Intro, naamkaarten, onderwerp en eindkaart in een herkenbare grafische lijn." },
          { title: "Sociale videoclips", description: "Vooraf afgesproken fragmenten met een zelfstandige opening en context." },
          { title: "Ondertitelde clipversies", description: "Ingebrande ondertiteling voor korte mobiele publicaties waar voorzien." },
          { title: "Platformexports", description: "Bestanden in afgesproken resolutie en verhouding voor video- en sociale kanalen." },
          { title: "Audiobestand", description: "Een afgesproken audio-export wanneer die onderdeel is van de gecombineerde workflow." },
        ],
      },
      pricing: {
        title: "Welke factoren bepalen de prijs van podcast video?",
        paragraphs: [
          "Het aantal deelnemers en camera's bepaalt mee hoe groot set, licht- en audioplan worden. Een vaste tweepersoonsopstelling verschilt van wisselende panels, demonstraties of opnames op telkens een andere locatie. Ook de mate waarin een set wordt ontworpen speelt mee.",
          "In postproductie wegen lengte, aantal camerawissels, audiobewerking, grafiek, ondertiteling en aantal clips door. Voor een terugkerende reeks kunnen we een vaste technische en visuele werkwijze vastleggen, terwijl onderwerpen en gasten per aflevering blijven verschillen.",
        ],
        factors: ["Aantal deelnemers", "Aantal camera- en audiobronnen", "Locatie of setopbouw", "Licht- en geluidsomstandigheden", "Lengte van de opname", "Montage van camerawissels", "Audiomix en correcties", "Grafische vormgeving", "Aantal clips en ondertitels"],
      },
      whyVisualVibe: {
        title: "Waarom podcast video opnemen met VisualVibe",
        intro: "We ontwerpen beeld en geluid als één registratie en houden de natuurlijke gespreksdynamiek centraal.",
        items: [
          { title: "Techniek rond het format", description: "Camera's, microfoons, set en licht volgen deelnemers en publicatieplan." },
          { title: "Aandacht voor gesprek", description: "Functionele camerawissels ondersteunen reacties zonder de inhoud onrustig te maken." },
          { title: "Lange en korte content verbonden", description: "Clips worden gekozen als begrijpelijke ingangen naar de volledige aflevering." },
        ],
      },
      regional: {
        title: "Podcast video opnemen in Limburg en nabije regio's",
        description: "We bouwen podcastsets op voor organisaties in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, in een geschikte bedrijfsruimte of op een gekozen opnamelocatie.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Geef je podcast een herkenbaar visueel format",
        description: "Deel je gespreksvorm, aantal deelnemers, locatie en kanalen. We werken een passende set, registratie en oplevering voor afleveringen en clips uit.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },

  nieuwsreportage: {
    intro:
      "Een nieuwsreportage voor je bedrijf is bij VisualVibe een branded bedrijfsreportage: een herkenbaar communicatieproduct in opdracht van je organisatie, geen onafhankelijke journalistiek. We structureren je bedrijfsnieuws met feiten, interviews en relevante contextbeelden en maken de afzender en bedoeling duidelijk in de uiteindelijke video.",
    excerpt:
      "Een helder gemonteerde branded bedrijfsreportage over je eigen nieuws, met transparante afzender, interviews en feitelijke context.",
    process: [
      {
        title: "Nieuwswaarde en afzender expliciet maken",
        description:
          "We bepalen welk bedrijfsnieuws je wil toelichten, voor welke doelgroep en via welk eigen of betaald kanaal. Ook leggen we vast hoe de opdrachtgever en commerciële context herkenbaar worden vermeld.",
      },
      {
        title: "Feiten, bronnen en reportageopzet verzamelen",
        description:
          "Je organisatie levert controleerbare feiten, namen, woordvoerders en achtergrond. Wij bouwen een redactionele structuur met interviewvragen, scènevolgorde, tekstkaders en een concrete shotlist.",
      },
      {
        title: "Interviews en bedrijfscontext opnemen",
        description:
          "We filmen woordvoerders, betrokkenen, locatie, handelingen en relevante details. De opnamestijl kan reportagenaam ogen, maar we ensceneren geen gebeurtenissen alsof ze spontaan nieuws zijn.",
      },
      {
        title: "Branded en feitelijk transparant monteren",
        description:
          "We ordenen uitspraken en context, verzorgen titels, geluid, kleur en ondertiteling en bieden ruimte voor feitencontrole. Merkvermelding en opdrachtgeverschap blijven duidelijk in beeld of omliggende publicatie.",
      },
    ],
    faqs: [
      {
        question: "Is een bedrijfsnieuwsreportage hetzelfde als onafhankelijke journalistiek?",
        answer:
          "Nee. VisualVibe werkt in opdracht van je organisatie en de video dient bedrijfscommunicatie. We gebruiken wel heldere reportagevormen zoals interviews en contextbeelden, maar claimen geen onafhankelijke redactie of journalistieke neutraliteit.",
      },
      {
        question: "Hoe maken we duidelijk dat de reportage branded content is?",
        answer:
          "We kunnen afzender, merk, opdrachtgever of formuleringen zoals bedrijfsreportage zichtbaar opnemen in titel, intro, eindkaart en publicatiecontext. De precieze vermelding stemmen we af op kanaal en campagne, zonder de oorsprong te verbergen.",
      },
      {
        question: "Welke onderwerpen passen bij een branded nieuwsreportage?",
        answer:
          "Denk aan een opening, projectmijlpaal, innovatie, samenwerking, investering of initiatief waarover je organisatie feitelijke context kan geven. Het onderwerp moet relevant zijn voor je doelgroep en voldoende beelden en betrokken stemmen bieden.",
      },
      {
        question: "Controleren jullie alle feiten in de bedrijfsreportage?",
        answer:
          "Je organisatie blijft verantwoordelijk voor aangeleverde feiten, namen, cijfers en claims. Wij signaleren redactionele onduidelijkheden en organiseren een review, maar functioneren niet als onafhankelijke factcheckredactie. Onderbouw gevoelige beweringen vóór de opname.",
      },
      {
        question: "Kan de video naar nieuwsredacties worden gestuurd?",
        answer:
          "Je kan materiaal delen volgens je eigen persaanpak, maar een redactie beslist zelf of en hoe ze het gebruikt. We presenteren de video niet als redactionele berichtgeving van een extern medium en beloven geen publicatie of persaandacht.",
      },
    ],
    relatedServices: ["bedrijfsvideo", "eventfotografie", "testimonial-video", "social-media-video", "bedrijfsfotografie"],
    seo: {
      title: "Nieuwsreportage voor bedrijven in Limburg | VisualVibe",
      description:
        "Nieuwsreportage als transparante branded bedrijfsreportage, met interviews, feitelijke context en herkenbare afzender voor je eigen communicatiekanalen.",
      keywords: ["nieuwsreportage", "branded bedrijfsreportage", "bedrijfsnieuws video", "videoreportage bedrijf"],
    },
    content: {
      searchIntent: {
        primaryKeyword: "nieuwsreportage",
        supportingKeywords: ["branded bedrijfsreportage", "bedrijfsnieuws video", "videoreportage", "reportage laten maken"],
        type: "mixed",
      },
      overview: {
        title: "Een nieuwsreportage als transparante bedrijfscommunicatie",
        paragraphs: [
          "Een nieuwsreportage kan bedrijfsnieuws toegankelijk maken door een duidelijke aanleiding, betrokken stemmen en beelden van de context te combineren. Bij VisualVibe gaat het nadrukkelijk om een branded bedrijfsreportage. De opdrachtgever bepaalt het communicatiedoel en krijgt een reviewmoment. Daarom mag de video niet worden voorgesteld als onafhankelijke berichtgeving van een journalistieke redactie.",
          "Transparantie hoeft een sterke reportagevorm niet in de weg te staan. We bouwen het verhaal op rond controleerbare informatie, stellen open en gerichte interviewvragen en filmen de plek, het project of de handeling waarover wordt gesproken. Titels benoemen personen en functies correct. In montage scheiden we feiten, citaten en promotionele boodschap zo helder mogelijk en blijft de afzender herkenbaar.",
        ],
        highlights: ["Duidelijk als branded bedrijfsreportage", "Structuur rond feiten en betrokken stemmen", "Geen claim op journalistieke onafhankelijkheid", "Herkenbare afzender en reviewproces"],
      },
      outcomes: {
        title: "Bedrijfsnieuws met beeld, stem en duidelijke context",
        intro: "De video helpt je eigen doelgroep begrijpen wat er gebeurt en wie de informatie verstrekt.",
        items: [
          { title: "Een toegankelijke uitleg", description: "Aanleiding, gebeurtenis en betekenis worden in een compacte volgorde bij elkaar gebracht." },
          { title: "Betrokken personen in beeld", description: "Woordvoerders en projectbetrokkenen lichten hun rol en perspectief herkenbaar toe." },
          { title: "Transparante branded content", description: "Vormgeving en publicatiecontext maken duidelijk dat de reportage bedrijfscommunicatie is." },
        ],
      },
      idealFor: {
        title: "Voor bedrijfsnieuws dat meer context verdient",
        intro: "De vorm past bij concrete gebeurtenissen of ontwikkelingen die je organisatie zelf wil toelichten.",
        items: [
          { title: "Openingen en mijlpalen", description: "Breng aanleiding, betrokkenen en locatie samen in een helder bedrijfsbericht." },
          { title: "Projecten en samenwerkingen", description: "Laat verschillende partijen hun eigen rol toelichten binnen een gedeelde context." },
          { title: "Innovatie en investeringen", description: "Maak een technisch onderwerp begrijpelijk met uitleg, demonstratie en relevante beelden." },
          { title: "Initiatieven met lokale context", description: "Toon wat je organisatie organiseert en voor welke doelgroep, met duidelijke afzender." },
        ],
      },
      deliverables: {
        title: "Een herkenbaar branded reportagepakket",
        intro: "Inhoud, merkvermelding en publicatiekanalen worden vóór script en opname expliciet vastgelegd.",
        items: [
          { title: "Gemonteerde bedrijfsreportage", description: "Een volledige video met interviews, contextbeelden, kleur- en geluidsafwerking." },
          { title: "Transparante titelkaarten", description: "Onderwerp, personen, functies en afzender volgens gecontroleerde informatie." },
          { title: "Ondertitelde versie", description: "Een leesbare montage voor eigen web- en sociale kanalen wanneer voorzien." },
          { title: "Kort nieuwsfragment", description: "Een compacte versie met voldoende context en herkenbare opdrachtgever." },
          { title: "Kanaalgerichte exports", description: "Afgesproken beeldverhoudingen en resoluties zonder de branded herkomst te verhullen." },
        ],
      },
      pricing: {
        title: "Wat bepaalt de prijs van een nieuwsreportage?",
        paragraphs: [
          "De omvang volgt uit het aantal interviews, locaties, gebeurtenissen en benodigde achtergrondbeelden. Een gesprek bij een afgewerkt project vraagt een andere productie dan een opening met programma, verschillende partners en een technische demonstratie.",
          "Ook redactionele voorbereiding, script of voice-over, naam- en feitentitels, ondertiteling, reviewrondes en korte versies spelen mee. We leggen vooraf vast wie informatie aanlevert en goedkeurt en welke transparante merkvermelding in elke export terugkomt.",
        ],
        factors: ["Onderwerp en redactionele structuur", "Aantal woordvoerders", "Aantal locaties of gebeurtenismomenten", "Benodigde context- en detailbeelden", "Script of voice-over", "Titels en feitelijke informatie", "Ondertiteling", "Review en correcties", "Aantal lengtes en formaten"],
      },
      whyVisualVibe: {
        title: "Waarom een branded reportage met VisualVibe",
        intro: "We gebruiken een heldere reportagetaal terwijl opdrachtgeverschap, feitenbron en communicatiedoel transparant blijven.",
        items: [
          { title: "Duidelijke positionering", description: "We noemen het product een branded bedrijfsreportage en suggereren geen onafhankelijke nieuwsredactie." },
          { title: "Feitelijke structuur", description: "Interviewvragen, shotlist en titels worden opgebouwd rond informatie die je organisatie aanlevert en controleert." },
          { title: "Sterke contextbeelden", description: "Locatie, proces en betrokkenen maken de uitleg visueel concreet zonder gebeurtenissen te ensceneren als nieuws." },
        ],
      },
      regional: {
        title: "Branded bedrijfsreportages in Limburg en omgeving",
        description: "We produceren bedrijfsreportages in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, op de locatie waar het nieuws plaatsvindt en steeds met een herkenbare commerciële afzender.",
        regionSlugs: ["limburg", "vlaanderen", "antwerpen", "nederlands-limburg"],
      },
      cta: {
        title: "Geef je bedrijfsnieuws heldere, transparante context",
        description: "Deel onderwerp, feiten, betrokkenen en publicatiekanalen. We werken een branded reportageopzet uit waarin afzender en bedoeling herkenbaar blijven.",
        label: "Offerte aanvragen",
        href: "/offerte-aanvragen",
      },
    },
  },
} satisfies Record<VideografieSlug, SubserviceEditorial>;
