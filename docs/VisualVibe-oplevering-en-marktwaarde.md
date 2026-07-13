# VisualVibe - Oplevering, functionaliteiten en marktwaarde

**Wat is dit document?**
Een overzicht van alles wat er voor het VisualVibe-platform gebouwd is, hoe het technisch en op vlak van SEO en GEO in elkaar zit, en een onderbouwde inschatting van de werkuren en de prijs die een externe firma of freelancer voor eenzelfde realisatie zou aanrekenen.

Datum: 13 juli 2026
Opgesteld voor: presentatie aan klant
Domein (live): visualvibe.media

---

## 1. Managementsamenvatting

VisualVibe is geen "website". Het is een op maat gebouwd **digitaal platform** dat drie dingen combineert die je normaal bij drie aparte leveranciers koopt:

1. Een snelle, SEO- en AI-geoptimaliseerde **marketingwebsite** met ongeveer **151 unieke inhoudspagina's**.
2. Een uitgebreide **kennisbank** met **50 diepgaande artikelen** (samen ± **183.500 woorden**), geschreven en gestructureerd voor Google én voor AI-zoekmachines (ChatGPT, Gemini, Perplexity).
3. Een volledig **beheer- en automatiseringsplatform** achter de schermen: een leads-CRM, een AI-mailassistent, een volwaardige e-mailclient met meerdere postvakken, een gratis website-analysetool voor leadgeneratie, een automatische realisatie-generator, en een compleet trouwalbum-productiesysteem (trouwstudio).

Het geheel telt ruim **67.000 regels code** verdeeld over **513 bestanden** en **193 componenten**, met **14 API-endpoints**, **19 beheerpagina's** en koppelingen naar Firebase, Anthropic Claude (AI), Firecrawl, YouTube, SmugMug en Google.

**Geschatte marktwaarde bij externe realisatie:** ongeveer **€160.000 tot €345.000**, afhankelijk van of het door een freelancer, een gemiddeld bureau of een gespecialiseerd bureau gebouwd wordt. Het realistische middenpunt ligt rond **€235.000** (± 2.400 tot 2.600 werkuren). De volledige onderbouwing staat in hoofdstuk 4.

---

## 2. Wat is er gebouwd (functionaliteiten)

### 2.1 Publieke website (wat de bezoeker ziet)

| Onderdeel | Aantal pagina's | Wat het doet |
|---|---|---|
| **Homepage** | 1 | 8 geanimeerde secties: animated hero, getabde dienstenshowcase, mini-kaart van Limburg, dubbele sector-marquee, proces-tijdlijn, **live Google Reviews**-carousel, laatste kennisbankartikelen en CTA. |
| **Diensten** | 1 hub + 8 diensten | Webdesign, SEO, fotografie, videografie, drone/FPV, 3D/VR/AR, podcasting en masterclasses. **6 van de 8** hebben een volledig eigen (bespoke) hero en interactieve module. |
| **Subdiensten** | 46 | Elke dienst is opgesplitst in subdiensten met eigen pagina (hero, voordelen, proces, FAQ, gerelateerde links). |
| **Regio's** | 1 hub + 4 regio's | Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg, elk met dienstengrid, gemeenteblok en sectorlinks. |
| **Sectoren** | 1 hub + 10 sectoren | KMO, bouw/renovatie, horeca, vastgoed, retail/webshops, events, sportclubs, opleidingen, wellness/beauty en industrie. Elke sectorpagina heeft ± 13 secties met op maat geselecteerde cases, foto's en video's. |
| **Realisaties** | 1 hub + 11 categorieën | Portfolio per discipline, met live fotogalerijen, YouTube-video's, drone-beelden en 3D/Matterport-tours. |
| **Kennisbank** | 1 hub + 8 categorieën + 50 artikelen | Kennisplatform met zoekfunctie, filters, pillar-structuur en interne verwijzingen (zie 2.2). |
| **Bedrijfspagina's** | Over ons, Contact, Offerte aanvragen, Privacy, Cookies, HTML-sitemap | Contactpagina met live kaart, openingsuren en formulier; offerte- en contactformulieren met anti-spam. |
| **WeddingVibe one-pager** | 1 | Aparte landingspagina voor het zusterlabel (trouwfotografie), met eigen huisstijl, eigen navigatie en footer, portfolio, video, prijzen en een **datum-beschikbaarheidscheck**. |
| **Website-analyse** | 2 | Publieke leadtool + persoonlijk rapport achter een beveiligde link (zie 2.4). |

De navigatie bestaat uit **mega-menu's** op desktop (diensten met subdiensten, sectoren en kennisbank-kaarten) en een **app-achtige schuiflade** op mobiel, met een prominente "Offerte aanvragen"-knop en een cross-promotie naar WeddingVibe. De footer bevat dienstenkolommen, bedrijfslinks, partnerlogo's (Google, Meta, Leadinfo) en regiokaarten.

### 2.2 Content en kennisbank

- **50 artikelen**, allemaal in het Nederlands, samen ongeveer **183.500 woorden** (gemiddeld ± 3.670 woorden per artikel: diepgaande, onderzochte content).
- **8 pillar-categorieën** met **9 hoofdartikelen** en bijhorende verdiepingsartikelen.
- Elk artikel bevat een **direct-antwoordparagraaf** bovenaan, een **FAQ met schema**, bronvermeldingen, en automatisch berekende **gerelateerde diensten, regio's en artikelen** (een gewogen relevantie-algoritme, geen willekeurige "laatste 3").
- Een bibliotheek van ± 15 herbruikbare inhoudsblokken (vergelijkingstabellen, checklists, stappenplannen, do/don't-grids, statistiekblokken, citaten, enz.).

### 2.3 Beheerplatform (CMS / admin)

Achter een beveiligde login (Firebase Auth + sessiecookie + autorisatiemodel) zit een volwaardig beheerplatform met **19 pagina's**:

- **Dashboard** met live leadtellers per status.
- **Leads-CRM**: lijst met filters, detailpagina met statussen (nieuw, gecontacteerd, offerte verstuurd, gewonnen, verloren, gearchiveerd), prioriteiten, notities en een volledige **gebeurtenistijdlijn**.
- **AI-mailassistent per lead**: genereert een concept-antwoord met Claude, dat de beheerder nakijkt, aanpast en verstuurt via SMTP, met correcte e-mailthreading en synchronisatie van klantantwoorden via IMAP.
- **E-mailclient (meerdere postvakken)**: een volwaardige webmail in het beheerplatform, met gecombineerd postvak, mappen, labels, sterren, opstellen/beantwoorden/doorsturen, concepten, een outbox met wachtrij en herpogingen, bijlagen en koppeling van gesprekken aan leads.
- **Nieuwsbrief**: abonneelijst met CSV-export.
- **Realisatie-autogenerator**: geef een klant-URL in, en het systeem maakt automatisch desktop- en mobiele screenshots (Firecrawl) en laat Claude de portfoliotekst schrijven, klaar om te reviewen.
- **Trouwstudio**: een compleet productiesysteem voor trouwalbums (zie 2.4).
- **Instellingen**: contactgegevens en NAP, transactionele e-mail (SMTP/IMAP + automatisering + branding), webdesign-portfolio, fotogalerijen, auteursprofiel, quota van de analysetool, en WeddingVibe-beelden en -prijzen.

### 2.4 Slimme en AI-gedreven modules

- **Website-analyse als leadmagneet**: bezoeker geeft URL en e-mail, krijgt een 6-cijferige verificatiecode per mail, en ontvangt daarna een persoonlijk analyserapport achter een beveiligde link. Met **atomische quota** (misbruikbescherming), **SSRF-beveiliging**, versleuteling en koppeling naar de nieuwsbrief. De verificatie zorgt dat elke lead een geldig e-mailadres achterlaat.
- **Trouwstudio**: upload van trouwfoto's (met automatische previews, duplicaatdetectie en HEIC-conversie), **AI-fotoanalyse via Claude Vision** (kwaliteitsscore, bijsnijadvies, bewerkingsvoorstel), een niet-destructieve editor, automatische **albumopmaak met 10 print-klare sjablonen** en **PDF-export** van het volledige trouwboek.
- **AI-tekstgeneratie** op vier plaatsen: lead-antwoorden, realisatie-copy, trouwproject-intake en trouwfoto-analyse. Alle AI-output is steeds een **concept dat een mens nakijkt** voor het verzonden of gepubliceerd wordt.

### 2.5 Integraties

Firebase (login, database, opslag, hosting), Anthropic Claude (AI), Firecrawl (scraping/screenshots), YouTube (videogalerij), SmugMug (live fotogalerijen), Google Places (reviews en NAP), plus SMTP/IMAP voor e-mail. Elke externe koppeling is zo gebouwd dat ze **stil terugvalt** als de dienst even niet beschikbaar is, zodat de website nooit breekt.

---

## 3. Hoe is het gebouwd: techniek, SEO en GEO

### 3.1 Techniek en architectuur

- **Next.js 15** (App Router) met **React 19**, **server-first** gerenderd (zo goed als alles is een server-component, wat zorgt voor snelheid en goede vindbaarheid).
- **TypeScript** over de hele lijn, met een strak componentensysteem (Radix UI + Tailwind, eigen design system, gedeelde UI-primitieven).
- **Firebase** als datalaag: Firestore-database met beveiligingsregels, object-storage voor beelden, en Firebase App Hosting voor de deployment.
- Een deel van de content is **admin-beheerd en live** (portfolio, galerijen, sectoren, weddingvibe, contactgegevens) via ISR (pagina's verversen automatisch zonder herbouw), de rest is statisch voorgerenderd voor maximale snelheid.

### 3.2 SEO (vindbaarheid in klassieke zoekmachines)

- **Unieke metadata per pagina**: elke titel, beschrijving, canonical-URL, OpenGraph- en Twitter-kaart wordt centraal en per pagina gegenereerd, met bewust gehanteerde lengterichtlijnen (± 50-60 tekens voor titels, ± 150-160 voor beschrijvingen).
- **Volledig dynamische sitemap en robots**, automatisch opgebouwd uit de data. De build **faalt bewust** als een artikel naar een onbestaande pagina of bron verwijst: kapotte interne links zijn zo goed als onmogelijk.
- **Gestructureerde data (JSON-LD)** via 10 componenten en 8 actieve schema-types: Organization, LocalBusiness/ProfessionalService (met adres, openingsuren en geo-coördinaten uit één centrale bron), WebSite, BreadcrumbList, Service, FAQPage en BlogPosting.
- **Lokale SEO** (Limburg-eerst): LocalBusiness-schema met echte NAP-gegevens, regio- en sectorhubs, breadcrumbs en ± 90 op maat gemaakte OpenGraph-beelden.
- **Sterk intern linkweb**: elke dienst, regio, sector en elk artikel verwijst onderling naar elkaar volgens een gewogen relevantie-algoritme.

### 3.3 GEO (Generative Engine Optimization - vindbaarheid in AI-zoekmachines)

Dit is een uitgesproken sterk en actueel onderdeel, en een echte differentiator:

- **50 van de 50 artikelen** starten met een direct-antwoordparagraaf (het patroon dat AI-antwoordmachines het makkelijkst citeren).
- **49 van de 50 artikelen** sturen **FAQPage-schema** uit.
- **Vraag-geformuleerde tussenkoppen** met stabiele ankers, ideaal om als bron te worden opgepikt.
- **Bronvermeldingen (citations)** in de gestructureerde data van elk artikel, plus auteursgegevens met foto en functie (E-E-A-T-signalen).
- De kennisbank bevat zelf **artikelen over AEO en GEO** (onder meer "Wat is GEO", "Wat is AEO", "Gevonden worden in AI-zoekresultaten"), wat het bureau als expert positioneert.

### 3.4 Snelheid (Core Web Vitals)

Server-first rendering, `next/image` overal met correcte afmetingen (geen "verspringen" tijdens het laden), één gedeelde vaste achtergrondlaag in plaats van zware per-sectie-effecten, self-hosted lettertypes en een doordachte ISR-strategie. Weinig client-side JavaScript, wat de laadtijd en interactiesnelheid ten goede komt.

### 3.5 Beveiliging

Versleuteling van alle e-mailwachtwoorden (AES-256-GCM), niet-omkeerbaar hashen van gevoelige gegevens (nooit ruwe IP's of codes opgeslagen), SSRF-bescherming op alle plaatsen waar externe URL's worden opgehaald, honeypot-velden en rate-limiting op formulieren, timing-safe vergelijkingen bij verificatie, en een autorisatiemodel dat losstaat van de login. Alle schrijfacties zijn idempotent (geen dubbele leads of dubbele mails).

---

## 4. Werkuren en marktwaarde (de "offerte")

### 4.1 Methode en tarieven

De inschatting hieronder is opgebouwd per werkpakket, op basis van de werkelijk aanwezige functionaliteit in de codebase (67.000+ regels, 513 bestanden, 50 artikelen). De uren zijn **richtinggevende schattingen** voor een externe realisatie van nul, inclusief overleg, revisies en testen.

Gehanteerde markttarieven (België, 2026):

- **Freelancer / klein collectief:** € 65 - 80 per uur
- **Gemiddeld digitaal bureau:** € 95 - 110 per uur
- **Gespecialiseerd bureau:** € 120 - 140 per uur

De euro-kolom in de tabel gebruikt een **gemengd extern projecttarief van € 95 per uur** als middenscenario. De scenario's freelance versus bureau staan in 4.3.

### 4.2 Werkpakketten

| # | Werkpakket | Uren | Richtprijs (€ 95/u) |
|---|---|---:|---:|
| **Front-end en pagina's** | | | |
| 1 | Fundering, design system, UI-componenten, meertalige routing | 80 | € 7.600 |
| 2 | Navigatie (desktop mega-menu + mobiele drawer) en footer | 36 | € 3.420 |
| 3 | Homepage (8 geanimeerde secties + live reviews) | 90 | € 8.550 |
| 4 | Diensten: hub + 8 dienstpagina's (6 met bespoke module) | 140 | € 13.300 |
| 5 | 46 subdienstpagina's | 50 | € 4.750 |
| 6 | Regio: hub + 4 regiopagina's | 40 | € 3.800 |
| 7 | Sectoren: hub + 10 sectorpagina's | 70 | € 6.650 |
| 8 | Realisaties: hub + 11 categoriepagina's (galerijen, video, 3D) | 90 | € 8.550 |
| 9 | Kennisbank: hub + 8 categorieën + artikel-engine + inhoudsblokken | 110 | € 10.450 |
| 10 | Overige pagina's (over-ons, contact, offerte, legal, sitemap, analyse) | 50 | € 4.750 |
| 11 | WeddingVibe one-pager (apart label, eigen huisstijl) | 70 | € 6.650 |
| **Content** | | | |
| 12 | 50 kennisbankartikelen (± 183.500 woorden, research + SEO + schema) | 320 | € 30.400 |
| 13 | Dienst-, regio-, sector- en interface-copy (NL) | 80 | € 7.600 |
| **SEO en GEO** | | | |
| 14 | SEO/GEO-engineering (schema-suite, metadata, sitemap, OG, interne links) | 90 | € 8.550 |
| 15 | Core Web Vitals en performance-optimalisatie | 30 | € 2.850 |
| **Beheerplatform (CMS/admin)** | | | |
| 16 | Authenticatie en beveiligingsmodel | 30 | € 2.850 |
| 17 | Leads-CRM (lijst, detail, statussen, notities, tijdlijn) | 60 | € 5.700 |
| 18 | Lead-e-mail: AI-antwoord + SMTP/IMAP + automatisering | 90 | € 8.550 |
| 19 | Instellingenmodules (contact, e-mail, portfolio, galerijen, profiel, quota, weddingvibe) | 90 | € 8.550 |
| 20 | Nieuwsbrief + CSV-export | 10 | € 950 |
| 21 | Upload-pijplijn + WebP-conversie en -migratie | 25 | € 2.375 |
| **Slimme / AI-modules** | | | |
| 22 | Realisatie-autogeneratie (Firecrawl + Claude) | 40 | € 3.800 |
| 23 | Trouwstudio (upload, AI-vision-analyse, editor, album, PDF) | 220 | € 20.900 |
| 24 | Website-analyse-leadtool (verificatie, quota, SSRF, encryptie, engine) | 100 | € 9.500 |
| 25 | E-mailclient (webmail met meerdere postvakken) | 200 | € 19.000 |
| **Infrastructuur en integraties** | | | |
| 26 | Firebase (datamodel, regels, indexen, storage, hosting) | 40 | € 3.800 |
| 27 | Externe integraties (SmugMug, YouTube, Google Reviews) | 45 | € 4.275 |
| 28 | Security-hardening (encryptie, rate limiting, SSRF, honeypots) | 25 | € 2.375 |
| **Kwaliteit en coördinatie** | | | |
| 29 | QA, responsive/toegankelijkheid, deployment, bugfixing | 80 | € 7.600 |
| 30 | Projectcoördinatie en -beheer | 90 | € 8.550 |
| | **Totaal** | **± 2.481** | **± € 235.695** |

### 4.3 Totaalprijs per scenario

Afhankelijk van wie het bouwt, verschilt de prijs voor exact dezelfde functionaliteit:

| Scenario | Tarief | Geschatte totaalprijs |
|---|---|---|
| **Ervaren freelancer / klein collectief** | € 65 - 80/u | **€ 160.000 – € 200.000** |
| **Gemiddeld digitaal bureau** | € 95 - 110/u | **€ 235.000 – € 275.000** |
| **Gespecialiseerd bureau** | € 120 - 140/u | **€ 300.000 – € 345.000** |

> **Realistische marktwaarde: ± € 235.000** (middenscenario), met een bandbreedte van **€ 160.000 tot € 345.000** afhankelijk van de leverancier. Prijzen zijn exclusief btw.

Ter kadering: een klassieke bedrijfswebsite van 10 tot 15 pagina's kost bij een Belgisch bureau doorgaans € 8.000 tot € 25.000. VisualVibe is qua omvang en functionaliteit een **veelvoud** daarvan: het bevat naast de website ook drie modules (leadtool, trouwstudio, e-mailclient) die elk apart al de omvang van een middelgroot softwareproject hebben.

### 4.4 Terugkerende kosten (niet in bovenstaand bedrag)

De prijs hierboven is de **eenmalige bouwkost**. Voor een correcte totaalkost hoort een externe klant ook rekening te houden met maandelijkse of jaarlijkse kosten:

- **Hosting en database** (Firebase App Hosting + Firestore + Storage): schommelt met verkeer, doorgaans € 20 - 150/maand.
- **AI (Anthropic Claude)**: verbruik per gebruik, afhankelijk van hoeveel realisaties, lead-antwoorden en fotoanalyses.
- **Externe API's**: Firecrawl, YouTube Data API, SmugMug, Google Places (deels gratis quota, deels betalend bij volume).
- **Domein + e-mail**.
- **Onderhoud en doorontwikkeling**: bij een bureau typisch een support-/retainercontract van € 400 - 1.500/maand.

---

## 5. Belangrijke kanttekeningen (eerlijk kader)

Zodat het cijfer eerlijk blijft en geen verrassingen geeft:

- **Taal:** de site is functioneel **Nederlandstalig**. De meertalige routing (/be, /fr, /en) is technisch aanwezig, maar de FR- en EN-versies tonen momenteel dezelfde Nederlandse inhoud. Echte vertaling van pagina's en artikelen is nog niet gebeurd en zit **niet** in bovenstaande uren; dat zou een aparte post zijn.
- **Realisaties/cases:** het cases-systeem is voorzien maar de databank is bewust nog leeg ("binnenkort"); realisaties worden nu getoond via de portfolio-, foto- en videomodules.
- **Website-analyse-engine:** de leadflow (verificatie, quota, beveiliging, mails) is volledig live; de koppeling naar de externe scoringsmotor werkt maar de datamapping staat als voorlopig gemarkeerd tot het definitieve contract vastligt.
- De uren zijn **schattingen voor een realisatie van nul** door een externe partij, geen exacte tijdregistratie van de effectieve bouw.

---

*Dit document beschrijft de stand van het platform op 13 juli 2026. Alle aantallen zijn afgeleid uit de effectieve code en content van het project.*
