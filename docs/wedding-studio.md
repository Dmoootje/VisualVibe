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
  `ClaudeVisionAnalysisProvider` (echte analyse, vision + structured outputs,
  model instelbaar; default `claude-opus-4-8`) en `MockAnalysisProvider`.
  Resolutie via `resolveAnalysisProvider(settings)`: zonder
  `ANTHROPIC_API_KEY` valt alles terug op de mock, en elk mockresultaat is in
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
- Limieten: max 25 MB per foto; bestanden <20 kB worden geweigerd
  (waarschijnlijk geen volwaardige foto).
- Duplicaatdetectie: SHA-256 op de originele bytes, server-side (409 +
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
  PDF-layout. Actief: **Ivory Editorial**; Romantic Botanical, Black Tie
  Luxury, Modern Minimal en Cinematic Dark staan aangekondigd
  (`available: false`, zichtbaar uitgeschakeld).
- Automatische indeling (`lib/autoLayout.ts`): cover, quote, woord vooraf,
  hoofdstukken op scènevolgorde, afwisseling rustig/druk, oriëntatie-matching
  per kader, hero's voor de sterkste beelden, slotpagina.
- Wizard (gegevens, template, verhaalstructuur, fotoselectie, genereren) +
  builder (paginalijst, spread-preview met hulplijnen/middenvouw, kaders
  vullen/wisselen, teksten bewerken, lay-out wisselen, opslaan).

## PDF-export

Twee exporttypes in de Export-tab:

1. **Digitale preview-PDF** - previewbeelden, snel, voor controle en delen.
2. **Hoge kwaliteit (drukvoorbereiding)** - afgewerkte/originele beelden.
   Dit is nadrukkelijk GEEN print-ready bestand. Nog nodig voor echt drukwerk:
   bleed doortrekken in de beeldkaders, CMYK-conversie + ICC-kleurprofielen,
   drukkersspecificaties (rugbreedte, hardcovermaten), minimale effectieve
   DPI-controle per kader en eventueel een server-side renderer.

Fonts in de PDF worden geregistreerd vanaf Google Fonts (TTF); bij een
mislukte registratie valt de renderer terug op ingebouwde fonts zodat de
export nooit faalt op een ontbrekend lettertype.

## Instellingen

`/admin/trouwstudio/instellingen`: standaardtaal/-stijl/-template, bevestiging
bij bulkacties, AI-provider + model + confidence-drempel + batchgrootte +
max gelijktijdigheid + automatisch optimaliseren, JPEG-kwaliteit en
bestandsnaamtemplate voor export. Generatieve functies staan vast uit tot er
een beeldmodel is aangesloten. API-keys staan uitsluitend server-side
(`ANTHROPIC_API_KEY` uit de bestaande env/Secret Manager-structuur).

## Environmentvariabelen

Geen nieuwe verplichte variabelen. Gebruikt bestaande:

- `ANTHROPIC_API_KEY` - zonder deze key draait de analyse in Demonstratiemodus.
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
