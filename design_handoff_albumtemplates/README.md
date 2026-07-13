# Handoff - WeddingVibe Albumtemplates (fotoboek-generator)

Voor integratie in de bestaande **trouwstudio**, afdeling **Albumtemplates**. Dit pakket levert vijf print-klare A4-fotoboekstijlen, volledig gestuurd door design tokens, in landscape én portret.

## Wat dit is
Design-referenties in HTML (Design Component-prototype), **geen productiecode**. Bouw dit na in de stack van de studio (of gebruik de HTML rechtstreeks als render-laag als dat past). `support.js` en `doc-page.js` zijn alleen de prototype-runtime + print-shell; de eerste niet overnemen, de tweede optioneel (zie Print).

## Fidelity
High-fidelity. Kleuren, typografie, spacing, indelingen en print-geometrie zijn definitief bedoeld.

## Architectuur (belangrijk voor integratie)
Twee bestanden:
- **`WeddingVibe Fotoboek Templates.dc.html`** - de *shell*: kiest stijl-preset + formaat + accent, berekent de design-tokens en mount de pagina's in de juiste A4-oriëntatie.
- **`WeddingVibe Fotoboek Paginas.dc.html`** - de *paginabibliotheek*: alle pagina-indelingen. Krijgt `rootTokens` (CSS-variabelen als string), `coverFramed`/`coverBleed` (welk covertype) en `portret` (bool) binnen en herschikt de layouts navenant.

Deze scheiding is bewust: **de shell = template-keuze + tokens, de paginabibliotheek = de bouwstenen.** In de studio wordt de shell vervangen door jullie eigen render-lus (kies preset → zet tokens → stapel pagina's), de paginabibliotheek is de set layouts die je aanbiedt.

## De 5 presets (elk = een set design tokens)
Naam · papier · inkt · accent (default) · naamletter
1. **Blanc (puur wit)** - `#FFFFFF` · `#211C18` · `#C0983F` · Cormorant Garamond, kapitalen gespatieerd. Cover = ingekaderd (foto met dunne lijn, namen eronder).
2. **Ivoire (gebroken wit)** - `#F7F1E7` · `#2A2320` · `#C29A4B` · namen in Great Vibes-script. Cover = full-bleed, tekst links-onder.
3. **Editorial** - `#FBFAF7` · `#17140F` · `#A6603C` · Cormorant, kapitalen wijd gespatieerd, strak. Cover = full-bleed.
4. **Galerie (veel marge)** - `#FFFFFF` · `#2B2824` · `#9A8C6E` · zeer grote marges (1.15in), mini gespatieerde kapitalen. Cover = ingekaderd.
5. **Romance (blush)** - `#FBF3F1` · `#3A2C2A` · `#C79A6A` · script-namen, zacht. Cover = full-bleed, gecentreerd.

## Design tokens (de tuning-laag)
Per preset wordt één string van CSS-custom-properties op de root gezet; alle pagina's lezen die via `var(--…)`. Dit is de laag waarmee de app kleur/typografie stuurt. Tokens:
- `--paper` (papierkleur), `--ink` (koppen/tekst), `--soft` (bijschrift/secundair), `--line` (haarlijnen/kaders), `--cap-bg` (caption-achtergrond op full-bleed).
- `--accent` - **los instelbaar** (los van de preset). Bedoeld om af te stemmen op de *gemiddelde kleur van de reportage*. Curated swatches: `#C29A4B #A6603C #9A8C6E #C79A6A #8C9A7B #8DA3B0`.
- `--font-display`, `--font-body`, `--name-font`, `--name-weight`, `--name-size`, `--name-transform`, `--name-spacing`.
- Layout-tokens: `--pad` (paginamarge), `--frame-pad`/`--frame-inner`/`--frame-cap` (kaderstijl covers), `--cover-justify`/`--cover-align`/`--cover-text-align` (positie covertekst).
- `--page-h` - paginahoogte: `210mm` (landscape) of `297mm` (portret).
Fonts: Cormorant Garamond, Cormorant, Great Vibes, Lora (Google Fonts).

## Formaat & print (A4)
- Twee formaten via de shell: **Landscape A4** (297×210mm) en **Portret A4** (210×297mm). De print-shell (`doc-page`) zet `@page { size:a4 landscape|portrait; margin:0 }` zodat er geen browser-header/footer bijkomt.
- Elke pagina is een `.wv-page` met **hoogte exact `var(--page-h)`** en een echte pagina-onderbreking (`break-before:page`) ervoor → 1 sheet per pagina, niets afgesneden, geen lege tussenpagina's.
- **Landscape en portret hebben aparte layoutregels.** In portret stapelen de meerfoto-indelingen (kolom i.p.v. rij) en delen de beelden de paginahoogte gelijk via `flex:1; min-height:0` + `object-fit:cover` - **niet** via `aspect-ratio`-boxen (die rekten in flex ongelijk uit). Neem dit patroon over.

## Pagina-indelingen (de bouwstenen) + fotoslots
De app kan hiermee automatisch een boek samenstellen o.b.v. het aantal foto's: tel de foto's, stapel indelingen tot het net uitkomt. Beschikbare indelingen en hun slot-aantal:
- **Cover** - 1 foto (framed of full-bleed, afhankelijk van preset) + namen + datum.
- **Voorwoord** - 1 foto + invulbare tekst (kerk, locatie, ondertekening). Landscape: foto links, tekst rechts. Portret: tekst boven, foto onder.
- **Full-bleed** - 1 foto paginavullend + caption.
- **Duo** - 2 foto's (landscape naast elkaar, portret onder elkaar) + bijschriften.
- **Asymmetrisch** - 3 foto's (1 groot + 2 klein).
- **Foto + tekst** - 1 foto + tekstkolom.
- **Grid** - 3 foto's (landscape 3 kolommen, portret 3 rijen).
- **Afsluitblad/colofon** - 0 foto's; logo, `weddingvibe.be · visualvibe.media`, telefoon + e-mail, ondertekend "Jens".
> Advies voor de auto-layout: label elke indeling met een `slots`-waarde (1/1/1/2/3/1/3/0) en laat de generator die stapelen tot `Σ slots = aantal foto's`. Vraag om extra indelingen (4-op-een-rij, 6-grid, dubbele spread) als de rekenlogica meer keuze nodig heeft.

## Datamodel (per boek)
- `template` (enum: Blanc/Ivoire/Editorial/Galerie/Romance)
- `formaat` (Landscape A4 / Portret A4)
- `accent` (hex) - override op preset-accent
- `namen` (bruid & bruidegom), `datum`, `locatie`, `kerk`
- `voorwoord` (rijke tekst), `handtekening`
- `paginas[]`: per pagina een `layout` (zie bouwstenen) + `fotos[]` (bron-URL/asset) + optioneel `caption`/`subcaption`/`tekst`
- Colofon: studiogegevens (nu hardcoded: weddingvibe.be, visualvibe.media, +32 472 96 45 99, jens@weddingvibe.be, "Jens")
- In het prototype zijn namen/tekst/captions **statische, klik-bewerkbare** HTML en zijn de foto's demobeelden van Unsplash. In productie komen die uit het geüploade boek.

## Bestanden
- `WeddingVibe Fotoboek Templates.dc.html` - shell (preset/formaat/accent → tokens → mount)
- `WeddingVibe Fotoboek Paginas.dc.html` - paginabibliotheek (alle indelingen, portret/landscape-logica)
- `doc-page.js` - print-shell (A4-geometrie, margin 0, pagina-onderbrekingen). Optioneel; vervang door jullie eigen print-CSS als je wil.
- `assets/weddingvibe-logo.svg` - wordmark voor het colofon
- `support.js` - prototype-runtime (niet overnemen)

## Integratietips voor de afdeling Albumtemplates
1. Registreer de 5 presets als token-sets naast jullie bestaande albumtemplates (zelfde token-namen hergebruiken waar mogelijk).
2. Sluit de `accent`-tuning aan op jullie "gemiddelde kleur van reportage"-berekening.
3. Sluit de paginabibliotheek aan op jullie foto-upload → auto-layout (slot-telling hierboven).
4. Behoud de A4 print-regels exact (margin 0, `--page-h`, `break-before:page`, flex-fill in portret) - dat is wat de PDF snijvrij houdt.
