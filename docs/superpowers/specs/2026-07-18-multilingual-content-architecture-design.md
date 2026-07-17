# Meertalige contentarchitectuur voor VisualVibe

Datum: 18 juli 2026

## Doel

VisualVibe wordt voorbereid op Nederlands, Engels, Frans en Duits. Engels wordt als eerste volledig vertaald, maar wordt pas publiek wanneer de volledige commerciële website, alle formulieren en e-mails, de juridische inhoud en de volledige kennisbank vertaald en gecontroleerd zijn.

De Engelse implementatie wordt als één geïntegreerde oplevering uitgevoerd. Werk mag intern parallel worden verdeeld over meerdere agents, maar er is geen gedeeltelijke publieke lancering.

## Beslissingen

- De website gebruikt één gedeelde component- en routestructuur voor alle talen.
- Vaste en redactionele inhoud blijft code-first en onder versiebeheer.
- Firestore wordt alleen uitgebreid met taalvelden voor inhoud die nu al dynamisch uit Firestore komt.
- Er wordt geen algemeen vertaal-CMS of nieuwe vertaaldatabase gebouwd.
- De architectuur ondersteunt vanaf het begin `nl`, `en`, `fr` en `de`.
- Iedere taal heeft een expliciete publicatiestatus.
- Ontbrekende vertalingen mogen niet stil terugvallen op Nederlands.
- Afbeeldingsbestanden en URL's worden hergebruikt. Alt-teksten, captions en linktitels zijn wel taalgebonden.

## Waarom geen volledige vertaaldatabase

De huidige kennisbank bestaat uit 58 MDX-bestanden en veel commerciële inhoud staat in TypeScript-contentbestanden. Een volledige migratie naar Firestore zou ook een CMS, importproces, concept- en publicatiestatus, preview, validatie, caching en beheerinterface vereisen. Dat vergroot de implementatie en de runtime-afhankelijkheid zonder dat er nu behoefte is aan vertalen via het adminpaneel.

Vier talen vormen op zichzelf geen reden om de inhoud in een database te plaatsen. Een gevalideerde locale-structuur in bestanden blijft overzichtelijk, snel te bouwen, goed testbaar en gemakkelijk terug te draaien. Bestaande dynamische Firestore-inhoud krijgt wel lokale varianten, zodat daar geen tweede bron van waarheid ontstaat.

## Contentmodel

### Korte interface- en systeemteksten

`next-intl` blijft de bron voor navigatie, knoppen, labels, formulieren, validatiemeldingen, cookieteksten en andere korte gedeelde tekst.

```text
messages/
  nl.json
  en.json
  fr.json
  de.json
```

Alle vier bestanden volgen hetzelfde gevalideerde sleutelschema. Een vereiste sleutel die in een actieve of controleerbare taal ontbreekt, laat de kwaliteitscontrole falen.

### Commerciële pagina-inhoud

Langere inhoud, metadata, FAQ's, alt-teksten en linktitels worden per locale gestructureerd. De precieze mapindeling sluit aan op de bestaande NOVA-feature- en `src/data`-conventies. Er wordt geen concurrerende tweede componentstructuur ingevoerd.

De inhoud krijgt waar nodig een locale-agnostische sleutel, bijvoorbeeld `webdesign`, `technical-seo` of `contact`. Pagina's selecteren content op basis van de route-locale en renderen dezelfde componenten.

### Kennisbank

MDX blijft de bron van waarheid. Artikelen krijgen minimaal:

- `translationKey`: vaste identiteit over alle talen;
- `locale`: `nl`, `en`, `fr` of `de`;
- een locale-specifieke slug;
- locale-specifieke titel, beschrijving, metadata en afbeeldingsteksten;
- gekoppelde interne links die naar dezelfde doeltaal wijzen.

De loader en validatie controleren dat vertaalrelaties uniek en volledig zijn voordat een taal publiceerbaar wordt.

### Bestaande Firestore-inhoud

Alleen bestaande beheerbare inhoud krijgt waar nodig meertalige velden. Het voorkeursmodel is een locale-map:

```ts
type LocalizedText = {
  nl: string;
  en?: string;
  fr?: string;
  de?: string;
};
```

De Nederlandse waarden blijven achterwaarts compatibel tijdens de migratie. Server-side normalisatie zet oude enkelvoudige velden veilig om naar Nederlandse waarden. Een niet-Nederlandse publieke pagina mag geen Nederlands tonen wanneer de bijbehorende vertaling ontbreekt.

## Locale-register en publicatieslot

Eén centrale configuratie beschrijft alle ondersteunde talen en hun status. Het conceptuele model is:

```ts
type LocaleStatus = "published" | "ready" | "disabled";

const localeStatus = {
  nl: "published",
  en: "disabled",
  fr: "disabled",
  de: "disabled",
} satisfies Record<"nl" | "en" | "fr" | "de", LocaleStatus>;
```

`disabled` betekent:

- geen publieke locale-route;
- geen taalkiezeroptie;
- geen sitemap-URL;
- geen hreflang;
- geen indexeerbare preview;
- geen automatische taalherkenning die bezoekers naar de taal stuurt.

`ready` is een controletoestand voor een volledig gevulde taal die nog niet publiek is. Alleen na expliciete goedkeuring wordt de status `published`.

De publicatie van Engels gebeurt als één afzonderlijke, kleine configuratiewijziging nadat alle kwaliteitscontroles slagen. Frans en Duits volgen later hetzelfde mechanisme zonder architectuurwijziging.

## Routes en SEO

- Nederlands blijft onder `/be` bereikbaar.
- Engels gebruikt na publicatie `/en`.
- Frans gebruikt later `/fr`.
- Duits gebruikt later `/de`.
- Slugs mogen per taal natuurlijk worden vertaald.
- `translationKey` koppelt equivalente pagina's en artikelen voor hreflang.
- Canonicals verwijzen altijd naar de huidige locale-URL.
- Hreflang bevat uitsluitend gepubliceerde, werkelijk bestaande vertalingen.
- Metadata, Open Graph, JSON-LD, breadcrumbs en sitemap-items gebruiken locale-specifieke inhoud.
- Een taal wordt niet gepubliceerd wanneer verplichte equivalenten ontbreken.

## Vertaalomvang voor Engels

De integrale Engelse oplevering omvat:

- navigatie, footer en taalkeuze;
- homepage en algemene marketingpagina's;
- diensten en subdiensten;
- sectoren, regio's en realisaties;
- over-ons- en contactpagina's;
- alle publieke formulieren;
- validatie-, fout-, laad- en succesmeldingen;
- bezoekergerichte e-mails en e-mailonderwerpen;
- cookie-, privacy- en voorwaardeninhoud;
- websiteanalyse en andere publieke tools;
- titels, descriptions, Open Graph en structured data;
- zichtbare en functionele linktitels;
- betekenisvolle alt-teksten en captions;
- kennisbankoverzicht, categoriepagina's en alle artikelen;
- interne links tussen kennisbank, diensten, regio's en contactroutes;
- publieke 404- en andere relevante foutpagina's.

Adminpagina's die uitsluitend intern door Nederlandstalige beheerders worden gebruikt, vallen buiten de eerste Engelse publieke scope tenzij hun tekst in een bezoekergerichte e-mail of publieke output terechtkomt.

## Parallelle uitvoering

De implementatie wordt in één sessie als parallel programma uitgevoerd. Agents krijgen exclusieve werkgebieden om conflicten te voorkomen:

1. Meertalige basis, locale-register, routing, schemas, validatie en publicatieslot.
2. Gedeelde interface, formulieren, e-mails, juridische en algemene pagina's.
3. Diensten, subdiensten, sectoren, regio's, realisaties en bijbehorende SEO-inhoud.
4. Kennisbank, vertaalrelaties, artikelen en interne links.

Wanneer meer paralleliteit nodig is, mag de kennisbank worden verdeeld in exclusieve artikelsets. Centrale loaders, types en configuratie blijven eigendom van de architectuurwerkstroom totdat de interfaces stabiel zijn.

Alle werkstromen leveren samen één geïntegreerde Engelse implementatie op. Er zijn geen afzonderlijke publieke releases of handmatige tussenlanceringen.

## Taal- en terminologiekwaliteit

Een centrale woordenlijst legt merk- en vaktermen vast. Voorbeelden zijn KMO, SME, website analysis, quotation, case study, SEO, AEO, GEO, drone en FPV. De woordenlijst beschrijft ook termen die niet vertaald mogen worden.

Vertalingen moeten natuurlijk Engels zijn en niet woord voor woord Nederlands volgen. Claims, prijzen, bedrijfsgegevens en juridische betekenis mogen niet inhoudelijk veranderen. Lokale verwijzingen naar Limburg en België blijven correct en worden voor een internationaal publiek waar nodig verduidelijkt.

## Validatie en foutgedrag

De build- en contentcontroles melden minimaal:

- ontbrekende message keys;
- ontbrekende locale-content;
- dubbele of ontbrekende `translationKey`-waarden;
- kapotte interne links;
- links die onbedoeld naar een andere taal gaan;
- ontbrekende metadata;
- ontbrekende betekenisvolle alt-teksten;
- ongeldige locale-slugs;
- Nederlandse fallbacktekst in Engelse publieke inhoud;
- kennisbankartikelen zonder vertaalpartner;
- sitemap- of hreflangverwijzingen naar niet-gepubliceerde talen.

Een ontbrekende vereiste vertaling is een blokkerende fout. Optionele decoratieve afbeeldingen houden een lege alt-tekst wanneer dat toegankelijk correct is.

## Teststrategie

De implementatie bevat unit-, integratie- en buildcontroles voor:

- locale-selectie en ontbrekende vertalingen;
- vertaalrelaties en locale-specifieke slugs;
- routegeneratie en navigatie;
- metadata, canonicals en hreflang;
- sitemapuitsluiting van niet-gepubliceerde talen;
- formulieren en validatiemeldingen;
- bezoekergerichte e-mails;
- Firestore-normalisatie van oude en meertalige inhoud;
- kennisbanklinks en gerelateerde artikelen;
- Engelse pagina's zonder achtergebleven Nederlandse tekst;
- bestaande Nederlandse routes en inhoud zonder regressies.

Daarnaast worden representatieve pagina's visueel gecontroleerd op desktop en mobiel. De uiteindelijke publicatieschakelaar wordt pas gewijzigd nadat de volledige build, tests, contentaudit en linkcontrole slagen.

## Uitgesloten scope

- Een nieuw vertaal-CMS of volledige contentmigratie naar Firestore.
- Publieke Engelse deelopleveringen.
- Publicatie van Frans of Duits in de Engelse implementatie.
- Vertaling van uitsluitend interne adminschermen zonder publieke output.
- Nieuwe afbeeldingen uitsluitend voor vertaling, tenzij bestaande afbeeldingen ingebakken Nederlandse tekst bevatten en daardoor onbruikbaar zijn.

## Acceptatiecriteria

- De code ondersteunt Nederlands, Engels, Frans en Duits zonder taalspecifieke architectuuruitzonderingen.
- Alle afgesproken publieke Engelse inhoud is vertaald.
- Alle 58 huidige kennisbankartikelen hebben een geldige Engelse vertaling en vertaalrelatie.
- Formulieren, e-mails, metadata, alt-teksten, linktitels en structured data zijn meegenomen.
- Engels blijft voor bezoekers en zoekmachines uitgeschakeld tot expliciete publicatiegoedkeuring.
- Er is geen stille Nederlandse fallback op Engelse pagina's.
- Bestaande Nederlandse pagina's blijven werken.
- Firestore bevat alleen meertalige velden waar de broninhoud al uit Firestore komt.
- Alle relevante tests, buildcontroles, contentvalidaties en linkcontroles slagen.
- De Engelse website kan daarna met één gecontroleerde publicatiewijziging worden geactiveerd.

