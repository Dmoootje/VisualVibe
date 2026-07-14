# Trouwstudio (Wedding Studio)

Volledig geïntegreerde module in het bestaande VisualVibe-adminpaneel voor de
trouwfotografie-workflow: project aanmaken, foto's in bulk uploaden, AI-analyse
en optimalisatievoorstellen, niet-destructief bewerken, albumselectie,
trouwboek samenstellen (Ivory Editorial) en exporteren als PDF.

## Plaats in de app

- Adminmenu: **Trouwstudio** (icoon Camera) met submenu Projecten, Templates,
  Instellingen. Menu-item toegevoegd in `src/components/admin/AdminSidebar.tsx`.
- Routes (allemaal achter de bestaande admin-auth via
  `src/app/admin/(protected)/layout.tsx` + `getCurrentAdmin`):
  - `/admin/trouwstudio` - projectenoverzicht
  - `/admin/trouwstudio/projecten/[projectId]` - projectdetail met tabs
    (Overzicht, Foto's, AI-selectie, Bewerken, Trouwboek, Export)
  - `/admin/trouwstudio/templates` - templategalerij
  - `/admin/trouwstudio/instellingen` - module-instellingen
- API-route: `POST /api/admin/trouwstudio/upload` (admin-gated upload).

## Architectuur

```
src/features/trouwstudio/
  types.ts                    Domeinmodellen + statussen/scènes/labels (NL)
  templates/ivoryEditorial.ts Datagedreven albumtemplates + lay-outdefinities
  lib/autoLayout.ts           Automatische pagina-indeling (hoofdstukken/variatie)
  lib/cssPreview.ts           Client-side CSS-benadering van de bewerkingen
  services/analysis.ts        PhotoAnalysisProvider: Claude vision + mock
  services/imageProcessing.ts ImageProcessingProvider (sharp) + generatieve stub
  pdf/AlbumPdfDocument.tsx    @react-pdf/renderer document + generateAlbumPdf()
src/lib/firestore/trouwstudio.ts   Repositories (admin SDK, server-only)
src/lib/admin/trouwstudioActions.ts Server actions (admin-gated, revalidate)
src/app/api/admin/trouwstudio/upload/route.ts Uploadroute
src/components/admin/trouwstudio/  UI (client components)
```

### Provider-interfaces (verwisselbaar)

- `PhotoAnalysisProvider` (`services/analysis.ts`):
  `ConfiguredVisionAnalysisProvider` gebruikt de centraal gekozen Gemini-,
  Claude- of OpenAI-provider voor vision en structured output. Het model is
  per provider instelbaar in de backend. Zonder bruikbare sleutel valt
  `resolveAnalysisProvider()` terug op `MockAnalysisProvider`, en elk
  mockresultaat is in
  de UI expliciet gelabeld als **Demonstratiemodus** (`provider: "mock"`,
  `reviewRequired: true`). Er worden nooit nepresultaten als echte analyse
  gepresenteerd.
- `ImageProcessingProvider` (`services/imageProcessing.ts`):
  `SharpImageProcessingProvider` rendert de niet-destructieve instellingen
  deterministisch (belichting, contrast, witbalans-benadering, verzadiging,
  gamma, scherpte, ruis, vignet, rechtzetten, rotatie, crop, resize) naar een
  NIEUW bestand. Het origineel wordt nooit overschreven.
- `GenerativeImageProvider`: interface bestaat
  (`extendImage`/`removeObject`), maar er is nog geen model aangesloten. De
  UI toont die acties zichtbaar uitgeschakeld met uitleg
  (`GenerativeNotConfiguredProvider.unavailableReason`). Veiligheidsregels
  (gezichten/lichamen/ringen nooit wijzigen, origineel bewaren, expliciete
  goedkeuring) staan als contract in de opdrachttekst van de toekomstige
  provider-implementatie.
- `AlbumExportProvider`-rol: `generateAlbumPdf()` in
  `pdf/AlbumPdfDocument.tsx` (client-side @react-pdf/renderer, dynamisch
  geïmporteerd in de Export-tab). Vervangbaar door een server-side renderer
  zonder de UI te wijzigen.

### Datamodel en opslag

Firestore (alle toegang server-side via admin SDK; clients praten nooit
rechtstreeks met deze collecties, dus de bestaande deny-by-default rules
volstaan - er waren geen rule-wijzigingen nodig):

- `trouwstudio_projects/{projectId}` -> `WeddingProject`
- `trouwstudio_projects/{projectId}/photos/{photoId}` -> `WeddingPhoto`
  (metadata + analyse + niet-destructieve instellingen; GEEN base64)
- `trouwstudio_projects/{projectId}/albums/{albumId}` -> `WeddingAlbum`
- `site_content/trouwstudio_settings` -> `TrouwstudioSettings`

Storage (bucket `gen-lang-client-0235296023`, token-URL-patroon zoals de rest
van de app):

- `trouwstudio/{projectId}/original/{photoId}.{ext}` - origineel, byte-voor-byte
- `trouwstudio/{projectId}/preview/{photoId}.webp` - ~1600px werkbeeld
- `trouwstudio/{projectId}/thumb/{photoId}.webp` - ~480px rasterthumbnail
- `trouwstudio/{projectId}/processed/{uuid}.jpg` - "Afgewerkt"-renders

Er zijn geen nieuwe Firestore-indexen nodig (queries: orderBy op één veld en
een where op `contentHash` binnen een subcollectie).

## Upload

- Formaten: JPEG/PNG/WebP + HEIC/HEIF (sharp-decodering; faalt de decode dan
  volgt een eerlijke foutmelding). RAW (CR2/CR3/NEF/ARW/...) wordt bewust
  geweigerd met de melding dat RAW-ondersteuning later volgt.
- **Kwaliteit en type van de fotograaf blijven behouden.** JPEG blijft JPEG,
  PNG blijft PNG: het album en de PDF worden uit deze originelen opgebouwd (geen
  webp-conversie van het werkbeeld). De preview (~1600px) en thumbnail (~480px)
  zijn webp, uitsluitend voor de interface.
- Limieten: max **50 MB** per foto; bestanden <20 kB worden geweigerd.
- **4K-cap bij upload:** beelden tot 4K (langste zijde ≤ 4096px) worden
  byte-voor-byte bewaard; grotere beelden worden bij het uploaden naar 4K
  verkleind in hetzelfde formaat en hoge kwaliteit (JPEG q92 / WebP q92 /
  PNG). HEIC/HEIF wordt naar JPEG omgezet omdat browsers en de PDF-renderer
  HEIC niet kunnen tonen. `width`/`height`/`sizeBytes`/`mimeType` op het
  fotodocument weerspiegelen de bewaarde versie.
- Duplicaatdetectie: SHA-256 op de geüploade bytes, server-side (409 +
  verwijzing naar het bestaande bestand).
- De client uploadt met beperkte gelijktijdigheid (instelbaar), per bestand
  voortgang/fout/retry/annuleren.

## Niet-destructief bewerken

Instellingen (`PhotoAdjustments`, -100..100; rechtzetten in graden) worden als
data op het fotodocument bewaard (`appliedAdjustments`, `crop`). De
editorpreview is een CSS-benadering (`lib/cssPreview.ts`); de knop
**Afwerken** rendert dezelfde instellingen server-side met sharp naar
`processedUrl`. **Terug naar origineel** wist alle instellingen; het originele
bestand blijft altijd onaangeroerd. Voorstellen van de AI staan apart in
`adjustmentProposal` en worden pas bij accepteren naar `appliedAdjustments`
gekopieerd.

## AI-analyse

- Drie modi: alleen analyseren (resultaat bekijken), optimaliseren met
  voorstellen (accepteren/weigeren/aanpassen per foto of in bulk) en volledig
  automatisch (instelling `autoOptimize`: alleen boven de configureerbare
  confidence-drempel; twijfelgevallen blijven in "Controle nodig").
- Claude wordt aangeroepen met vision (preview-URL) + structured outputs
  (zod-schema) en een conservatieve retoucheer-systeemprompt per fotostijl.
- Kosten/gedrag instelbaar: provider, model, batchgrootte, drempel.

## Trouwboek

- Templates zijn datagedreven (`WeddingAlbumTemplate`): kleuren, fonts,
  paginamaat (mm) en lay-outdefinities in procentcoördinaten. Dezelfde data
  voedt de HTML-builderpreview én de PDF-renderer; er is geen hardgecodeerde
  PDF-layout.
- **Vijf print-klare A4-stijlen, elk in staand én liggend = tien
  templates** (`src/features/trouwstudio/templates/ivoryEditorial.ts`, uit de
  WeddingVibe-handoff): **Blanc** (puur wit, ingekaderde cover), **Ivoire**
  (gebroken wit, script-namen, full-bleed cover), **Editorial** (strak,
  terracotta, full-bleed), **Galerie** (zeer ruime marges, ingekaderd) en
  **Romance** (blush, gecentreerde full-bleed cover). Een parametrische builder
  genereert de tien templates uit vijf presets (kleuren/fonts/coverstijl) × twee
  oriëntatie-geometriesets. `getAlbumTemplate` mapt de oude id
  `ivory-editorial` naar `ivoire-portret` zodat bestaande albums blijven werken.
- **Accentkleur per album:** `album.accentColor` overschrijft
  `template.colors.accent`. Kiesbaar in de wizard (curated swatches uit
  `ALBUM_ACCENT_SWATCHES` + eigen kleur) met live cover-preview, en live
  aanpasbaar in de builder-topbalk. `resolveAlbumTemplate(id, accentColor)`
  levert de template met accent-override; die functie voedt zowel de preview
  als de PDF.
- **Full-bleed covers** gebruiken een donkere verloop-scrim (`AlbumFrame.scrim`)
  met witte covertekst (`AlbumTextBlock.color`); ingekaderde covers een dunne
  haarlijn (`AlbumFrame.framed`) met tekst eronder. Script-namen (Ivoire/Romance)
  gebruiken Great Vibes via `AlbumTextBlock.font: "accent"`. De PDF registreert
  Cormorant Garamond, Lora en Great Vibes elk apart (één mislukte registratie
  schakelt de andere niet uit).
- Automatische indeling (`lib/autoLayout.ts`): cover, quote, woord vooraf,
  hoofdstukken op scènevolgorde, afwisseling rustig/druk, oriëntatie-matching
  per kader, hero's voor de sterkste beelden, slotpagina.
- Wizard (gegevens, template, verhaalstructuur, fotoselectie, genereren) +
  builder (paginalijst, spread-preview met hulplijnen/middenvouw, kaders
  vullen/wisselen, teksten bewerken, lay-out wisselen, opslaan).

## PDF-export

Twee exporttypes in de Export-tab, met een zichtbare **PDF-bestandsgrootte** na
elke render:

1. **Digitale preview-PDF** - previewbeelden, snel, voor controle en delen.
2. **Hoge kwaliteit (drukvoorbereiding)** - afgewerkte/originele beelden in de
   kwaliteit en het type van de fotograaf. Met een **reductie-schuiver 50-100%**
   en een live grootteschatting (geschat uit de som van de bestandsgroottes van
   de gebruikte foto's × schaal²). Onder 100% worden de beelden server-side
   herschaald via `GET /api/admin/trouwstudio/reduce` (admin-gated, sharp) en
   levert `AlbumPdfInput.photoUrlOverride` die gereduceerde bronnen aan de
   renderer; op 100% worden de originelen rechtstreeks ingesloten. Dit is
   nadrukkelijk GEEN print-ready bestand. Nog nodig voor echt drukwerk: bleed
   doortrekken, CMYK-conversie + ICC-kleurprofielen, drukkersspecificaties en
   eventueel een server-side renderer.

Fonts in de PDF (Cormorant Garamond, Lora, Great Vibes) worden elk apart
geregistreerd vanaf een CORS-vriendelijke TTF-bron; een mislukte registratie
van één familie schakelt de andere niet uit en valt terug op een ingebouwd font
zodat de export nooit faalt op een ontbrekend lettertype.

## Instellingen

`/admin/trouwstudio/instellingen`: standaardtaal/-stijl/-template, bevestiging
bij bulkacties, AI-provider + model + confidence-drempel + batchgrootte +
max gelijktijdigheid + automatisch optimaliseren, JPEG-kwaliteit en
bestandsnaamtemplate voor export. Generatieve functies staan vast uit tot er
een beeldmodel is aangesloten. Providerkeys worden uitsluitend server-side en
versleuteld opgeslagen via `/admin/settings/ai`; de browser ontvangt alleen
status, model en de laatste vier tekens.

## Environmentvariabelen

Gebruikt bestaande serverinfrastructuur:

- `APP_ENCRYPTION_KEY` - hoofdsleutel voor AES-256-GCM-encryptie van de in
  Firestore opgeslagen providerkeys. Providerkeys zelf zijn geen env-variabelen.
- `FIREBASE_SERVICE_ACCOUNT_KEY` / ADC + `FIREBASE_STORAGE_BUCKET` - bestaande
  Firebase-admininfrastructuur.

## Tests en validatie

Deze codebase heeft geen testframework (geen jest/vitest/playwright-config);
de bestaande validatie is `npx tsc --noEmit`, `npm run lint` en
`npm run build`. De Trouwstudio is daarop gevalideerd. Zodra er een teststack
wordt toegevoegd zijn de pure modules (`autoLayout`, `cssPreview`,
providers-resolutie, actions-validatie) de eerste kandidaten voor unit tests.

## Nog niet aangesloten (voorbereid)

- Generatieve beeldbewerking (uitbreiden/objecten verwijderen): interface +
  UI-plaatsen bestaan; acties zichtbaar uitgeschakeld met uitleg.
- Galerijconsistentie-pass: datamodel ondersteunt het (analyse per foto +
  stijl per project); een aparte vergelijkings-service en UI-paneel volgen.
- AI-tekstsuggesties voor albumteksten: teksten zijn overal handmatig
  bewerkbaar; een suggestieservice kan op de bestaande Claude-integratie
  meeliften.
- RAW-verwerking en echt drukklare PDF (zie hierboven).
