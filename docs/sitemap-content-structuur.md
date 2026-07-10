# VisualVibe - Sitemap & contentstructuur

Dit document is de **volledige, finale site- en URL-structuur** van VisualVibe, bedoeld om aan een externe partij te geven die de content mag aanmaken. Het combineert de oorspronkelijke [`content-blueprint.md`](content-blueprint.md) met de structuur zoals ze **effectief in de code/routes** staat, zodat de URL's kloppen met de live site.

## Definitieve beslissingen

Twee open punten uit de vorige versie zijn nu vastgelegd:

1. **Regio + dienst-pagina's -> geneste, propere URL.** Vorm: `/be/regio/[regio]/[dienst]/`, bv. `/be/regio/limburg/webdesign/`. De regio zit al in het pad, dus de laatste segmentslug blijft kort (`webdesign`, niet `webdesign-limburg`). De H1/title dragen wel de volledige term ("Webdesign in Limburg"). Dit geeft nette breadcrumbs en hiërarchie. ⚠️ Vereist nog een nieuwe route `app/[locale]/regio/[slug]/[sub]/page.tsx` + een klein datamodel voor die subpagina's.
2. **Realisaties -> zelfde patroon als de kennisbank.** `/be/realisaties/` (hub) -> `/be/realisaties/[categorie]/` (categorie) -> `/be/realisaties/[categorie]/[slug]/` (case). Geen `/categorie/`-tussensegment (dat botste met de case-slug). ⚠️ Vereist nog de routes `app/[locale]/realisaties/[category]/page.tsx` en `.../[category]/[slug]/page.tsx` + de `cases`-data invullen (nu leeg).
3. **Blog-categorieën geregistreerd.** De pillars `fotografie`, `videografie`, `drone`, `3d-vr`, `podcasting` en `masterclasses` zijn toegevoegd aan `kennisbankCategories.ts`. De categorie-hub verschijnt pas (in nav-grids én sitemap) zodra er minstens 1 post in zit - dus geen lege, dunne categoriepagina's. De post-URL's werken meteen zodra een `.mdx` met die `categorySlug` wordt aangemaakt.

## Belangrijk over de URL's (lees dit eerst)

- **Taal-prefix.** De site is meertalig via `next-intl`. De prefix zit **altijd** in de URL:
  - Nederlands (hoofdtaal): **`/be`** (bv. `https://visualvibe.be/be/diensten/webdesign/`)
  - Frans: `/fr`
  - Engels: `/en`
  - Alle paden hieronder staan met `/be` (de canonieke NL-versie). `/fr` en `/en` zijn dezelfde structuur, vertaald.
- **Trailing slash.** De site gebruikt `trailingSlash: true` -> elke URL eindigt op `/`.
- **Diensten zijn plat.** Zowel hoofddiensten als subdiensten leven onder `/be/diensten/[slug]/`. De subdienst zit dus **niet** genest onder de hoofddienst in de URL (wel inhoudelijk gekoppeld via `parentSlug`).
- **Blog is genest per categorie:** `/be/kennisbank/[categorie]/[slug]/`.

## Status-legende

- ✅ **Bestaat** - route + datamodel staan er; enkel content/teksten (en waar nodig beelden) invullen of verfijnen.
- 🕒 **Gepland** - voorzien in de blueprint, nog niet als pagina/route/data aangemaakt. Content mag alvast geschreven worden.
- ⚠️ **Route nog nodig** - de URL-structuur vereist nog technisch werk (nieuwe route) voor de content live kan.

---

## 1. Hoofdpagina's

| Pagina | URL | Status |
|---|---|---|
| Home | `/be/` | ✅ |
| Diensten (hub) | `/be/diensten/` | ✅ |
| Realisaties (hub) | `/be/realisaties/` | ✅ (leeg - cases nog toe te voegen) |
| Sectoren (hub) | `/be/sectoren/` | ✅ |
| Regio (hub) | `/be/regio/` | ✅ |
| Kennisbank (hub) | `/be/kennisbank/` | ✅ |
| Over ons | `/be/over-ons/` | ✅ |
| Contact | `/be/contact/` | ✅ |
| Offerte aanvragen | `/be/offerte-aanvragen/` | ✅ |

**Hoofdnavigatie:** Home - Diensten - Realisaties - Sectoren - Regio - Kennisbank - Over ons - Contact + CTA-knop "Offerte aanvragen".

**Aanbevolen nog toe te voegen (juridisch, 🕒):** `/be/privacybeleid/`, `/be/algemene-voorwaarden/`, `/be/cookiebeleid/`. Het contactformulier verwijst nu al naar een "privacybeleid".

---

## 2. Diensten

Hub: `/be/diensten/` ✅

### 2.1 Webdesign - `/be/diensten/webdesign/` ✅
Subdiensten (✅, allemaal aangemaakt):
- `/be/diensten/website-laten-maken/`
- `/be/diensten/webshop-laten-maken/`
- `/be/diensten/onepager-laten-maken/`
- `/be/diensten/website-vernieuwen/`
- `/be/diensten/website-onderhoud/`
- `/be/diensten/wordpress-website-laten-maken/`
- `/be/diensten/seo-website-laten-maken/`

### 2.2 SEO - `/be/diensten/seo/` ✅
- `/be/diensten/lokale-seo/`
- `/be/diensten/technische-seo/`
- `/be/diensten/seo-copywriting/`
- `/be/diensten/google-business-profiel-optimalisatie/`
- `/be/diensten/ai-seo-aeo-geo/`

### 2.3 Fotografie - `/be/diensten/fotografie/` ✅
- `/be/diensten/bedrijfsfotografie/`
- `/be/diensten/zakelijke-portretten/`
- `/be/diensten/productfotografie/`
- `/be/diensten/eventfotografie/`
- `/be/diensten/vastgoedfotografie/`
- `/be/diensten/realisatiefotografie/`
- `/be/diensten/brandingfotografie/`

### 2.4 Videografie - `/be/diensten/videografie/` ✅
- `/be/diensten/bedrijfsvideo/`
- `/be/diensten/promovideo/`
- `/be/diensten/social-media-video/`
- `/be/diensten/event-aftermovie/`
- `/be/diensten/wervingsvideo/`
- `/be/diensten/testimonial-video/`
- `/be/diensten/podcast-video/`
- `/be/diensten/nieuwsreportage/`

### 2.5 Drone & FPV - `/be/diensten/drone-fpv/` ✅
- `/be/diensten/dronefotografie/`
- `/be/diensten/dronevideo/`
- `/be/diensten/fpv-video/`
- `/be/diensten/vastgoed-dronebeelden/`
- `/be/diensten/realisatie-dronebeelden/`
- `/be/diensten/event-dronebeelden/`

### 2.6 3D, VR & AR - `/be/diensten/3d-vr-ar/` ✅
- `/be/diensten/3d-tour/`
- `/be/diensten/virtuele-rondleiding/`
- `/be/diensten/showroom-3d-tour/`
- `/be/diensten/vastgoed-3d-tour/`
- `/be/diensten/horeca-virtuele-tour/`

### 2.7 Podcasting - `/be/diensten/podcasting/` ✅
- `/be/diensten/bedrijfspodcast/`
- `/be/diensten/videopodcast/`
- `/be/diensten/podcast-opname/`
- `/be/diensten/podcast-traject/`
- `/be/diensten/podcast-voor-experts/`

### 2.8 Masterclasses - `/be/diensten/masterclasses/` ✅
- `/be/diensten/opleiding-opnemen/`
- `/be/diensten/online-cursus-video/`
- `/be/diensten/workshop-filmen/`

> **Totaal diensten:** 8 hoofddiensten + 46 subdiensten = 54 dienstpagina's (allemaal aangemaakt in de data).

---

## 3. Regio

Hub: `/be/regio/` ✅. Route is **plat**: `/be/regio/[slug]/`.

### 3.1 Bestaande regiohubs ✅
- `/be/regio/limburg/` (thuisregio)
- `/be/regio/vlaanderen/`
- `/be/regio/antwerpen/`
- `/be/regio/nederlands-limburg/`

### 3.2 Geplande lokale stadspagina's (Limburg) 🕒
Werken met de huidige platte route (`/be/regio/[stad]/`). Enkel aanmaken met **unieke** content/cases - geen dunne dubbele locatiepagina's (zie SEO-waarschuwing onderaan).
- `/be/regio/hasselt/`
- `/be/regio/genk/`
- `/be/regio/bilzen-hoeselt/`
- `/be/regio/tongeren-borgloon/`
- `/be/regio/sint-truiden/`
- `/be/regio/maasmechelen/`
- `/be/regio/lanaken/`
- `/be/regio/diepenbeek/`
- `/be/regio/beringen/`
- `/be/regio/houthalen-helchteren/`
- `/be/regio/lommel/`
- `/be/regio/pelt/`

### 3.3 Regio + dienst-combinaties 🕒 ⚠️ (definitief: geneste URL)
Vorm: **`/be/regio/[regio]/[dienst]/`** (propere slug, regio zit al in het pad). Vereist nog de route `regio/[slug]/[sub]/`.

Limburg:
- `/be/regio/limburg/webdesign/`
- `/be/regio/limburg/seo-bureau/`
- `/be/regio/limburg/fotograaf/`
- `/be/regio/limburg/videograaf/`
- `/be/regio/limburg/dronefotografie/`
- `/be/regio/limburg/bedrijfsvideo/`
- `/be/regio/limburg/3d-tour/`

Antwerpen:
- `/be/regio/antwerpen/webdesign/`
- `/be/regio/antwerpen/fotograaf/`
- `/be/regio/antwerpen/videograaf/`
- `/be/regio/antwerpen/bedrijfsvideo/`
- `/be/regio/antwerpen/dronefotografie/`

Nederlands-Limburg:
- `/be/regio/nederlands-limburg/webdesign/`
- `/be/regio/nederlands-limburg/fotograaf/`
- `/be/regio/nederlands-limburg/videograaf/`
- `/be/regio/nederlands-limburg/dronefotografie/`

> H1/title dragen de volledige term ("Webdesign in Limburg", "Fotograaf in Antwerpen"), de URL blijft kort. Enkel aanmaken met unieke, lokaal-relevante content.

---

## 4. Sectoren

Hub: `/be/sectoren/` ✅. Detail: `/be/sectoren/[slug]/` ✅ (alle 10 aangemaakt).

- `/be/sectoren/kmo/`
- `/be/sectoren/bouw-renovatie/`
- `/be/sectoren/horeca/`
- `/be/sectoren/vastgoed-immo/`
- `/be/sectoren/retail-webshops/`
- `/be/sectoren/events/`
- `/be/sectoren/sportclubs/`
- `/be/sectoren/opleidingen-masterclasses/`
- `/be/sectoren/wellness-beauty/`
- `/be/sectoren/industrie/`

Elke sectorpagina bevat: voor wie, pijnpunten van de sector, passende diensten, cases/bewijs, relevante blogs, CTA naar offerte.

---

## 5. Realisaties / cases

Hub: `/be/realisaties/` ✅ (toont nu een "binnenkort"-staat; de cases-data is nog leeg).

**Definitieve structuur (zelfde patroon als kennisbank):** `/be/realisaties/` -> `/be/realisaties/[categorie]/` -> `/be/realisaties/[categorie]/[slug]/`. ⚠️ Routes + `cases`-data nog te bouwen.

### 5.1 Categorieën 🕒 ⚠️
- `/be/realisaties/webdesign/`
- `/be/realisaties/fotografie/`
- `/be/realisaties/videografie/`
- `/be/realisaties/drone/`
- `/be/realisaties/3d-vr/`
- `/be/realisaties/podcasting/`
- `/be/realisaties/bedrijven/`
- `/be/realisaties/projecten/`
- `/be/realisaties/events/`
- `/be/realisaties/sport/`
- `/be/realisaties/buitenland/`

### 5.2 Case-detailpagina's 🕒 ⚠️
URL-vorm: `/be/realisaties/[categorie]/[slug]/`. Voorbeelden uit de blueprint:
- `/be/realisaties/webdesign/renovatie-snellinx/`
- `/be/realisaties/webdesign/weddingvibe/`
- `/be/realisaties/fotografie/milano-bilzen/`
- `/be/realisaties/fotografie/bib-bilzen/`
- `/be/realisaties/fotografie/botenhuis-tongeren/`
- `/be/realisaties/3d-vr/gervi-showrooms/`
- `/be/realisaties/podcasting/motmans-partners/`

**Case-template (content per case):** intro -> vraag van de klant -> aanpak -> resultaat -> gebruikte diensten -> beelden/video/website-embed -> interne links naar dienst, sector en regio -> CTA "Ook zo'n project laten maken?".

> **Let op:** de webdesign-realisaties op de dienstpagina `/be/diensten/webdesign/` (Gordijnen Myriam, Het Magazijn, ...) zijn een aparte showcase-module en staan los van deze `/realisaties/`-structuur.

---

## 6. Kennisbank / blog

Hub: `/be/kennisbank/` ✅. Structuur: `/be/kennisbank/[categorie]/[slug]/` ✅.

### 6.1 Categorie-taxonomie (✅ allemaal geregistreerd)
Alle pillar-categorieën staan nu in `kennisbankCategories.ts`. Een categorie-hub verschijnt pas in de navigatie + sitemap zodra ze minstens 1 post bevat (geen lege pagina's).

| Slug | Naam | Hub-URL | Heeft posts |
|---|---|---|---|
| `webdesign` | Webdesign | `/be/kennisbank/webdesign/` | ✅ (1) |
| `seo-geo` | SEO & GEO | `/be/kennisbank/seo-geo/` | ✅ (2) |
| `fotografie` | Fotografie | `/be/kennisbank/fotografie/` | 🕒 leeg |
| `videografie` | Videografie | `/be/kennisbank/videografie/` | 🕒 leeg |
| `drone` | Drone & FPV | `/be/kennisbank/drone/` | 🕒 leeg |
| `3d-vr` | 3D & VR | `/be/kennisbank/3d-vr/` | 🕒 leeg |
| `podcasting` | Podcasting | `/be/kennisbank/podcasting/` | 🕒 leeg |
| `masterclasses` | Masterclasses | `/be/kennisbank/masterclasses/` | 🕒 leeg |

> **Voor de contentmaker:** zet in de frontmatter van elke `.mdx` de exacte `category` (de "Naam" hierboven) én `categorySlug` (de "Slug"). Dan komt de post op de juiste hub terecht en wordt de hub automatisch zichtbaar.

### 6.2 Bestaande blogposts ✅ (3)
| Titel | Categorie | URL |
|---|---|---|
| Website laten maken in Limburg: complete gids voor KMO's die online willen groeien *(pillar)* | Webdesign | `/be/kennisbank/webdesign/website-laten-maken-limburg-complete-gids/` |
| Lokale SEO voor KMO's in Limburg: zo word je gevonden door klanten in je regio | SEO & GEO | `/be/kennisbank/seo-geo/lokale-seo-voor-kmos-in-limburg/` |
| GEO en AEO voor KMO's: gevonden worden in Google, ChatGPT en AI-zoekresultaten | SEO & GEO | `/be/kennisbank/seo-geo/gevonden-worden-in-ai-zoekresultaten-geo-aeo/` |

### 6.3 Geplande pillars & clusters 🕒
URL-vorm: `/be/kennisbank/[categorie]/[slug]/`. Slugs hieronder zijn de voorstelslugs uit de blueprint; sommige overlappen met de 3 bestaande posts (dan niet dubbel aanmaken).

**Pillar Webdesign** (`webdesign`):
- `/be/kennisbank/webdesign/website-laten-maken-kosten/`
- `/be/kennisbank/webdesign/onepager-of-volledige-website/`
- `/be/kennisbank/webdesign/webshop-laten-maken-voor-kmo/`
- `/be/kennisbank/webdesign/website-vernieuwen-wanneer/`
- `/be/kennisbank/webdesign/waarom-een-snelle-website-beter-rankt/`
- `/be/kennisbank/webdesign/checklist-nieuwe-website/`

**Pillar SEO / AEO / GEO** (`seo-geo`):
- `/be/kennisbank/seo-geo/lokale-seo-voor-kmo/` *(reeds gedekt door bestaande post)*
- `/be/kennisbank/seo-geo/seo-voor-websites-in-limburg/`
- `/be/kennisbank/seo-geo/google-business-profiel-optimaliseren/`
- `/be/kennisbank/seo-geo/technische-seo-checklist/`
- `/be/kennisbank/seo-geo/wat-is-aeo/`
- `/be/kennisbank/seo-geo/wat-is-geo-generative-engine-optimization/`
- `/be/kennisbank/seo-geo/hoe-word-je-gevonden-in-ai-zoekresultaten/` *(reeds gedekt door bestaande post)*
- `/be/kennisbank/seo-geo/seo-content-voor-dienstverleners/`

**Pillar Fotografie** (`fotografie`):
- `/be/kennisbank/fotografie/wat-is-bedrijfsfotografie/`
- `/be/kennisbank/fotografie/hoe-bereid-je-een-bedrijfsshoot-voor/`
- `/be/kennisbank/fotografie/zakelijke-portretten-tips/`
- `/be/kennisbank/fotografie/productfotografie-voor-webshops/`
- `/be/kennisbank/fotografie/vastgoedfotografie-tips/`
- `/be/kennisbank/fotografie/realisatiefotografie-voor-aannemers/`
- `/be/kennisbank/fotografie/eventfotografie-checklist/`

**Pillar Videografie** (`videografie`):
- `/be/kennisbank/videografie/waarom-een-bedrijfsvideo-laten-maken/`
- `/be/kennisbank/videografie/bedrijfsvideo-script-opbouwen/`
- `/be/kennisbank/videografie/social-media-video-voor-kmo/`
- `/be/kennisbank/videografie/aftermovie-van-bedrijfsevent/`
- `/be/kennisbank/videografie/wervingsvideo-voor-personeel/`
- `/be/kennisbank/videografie/testimonial-video-laten-maken/`
- `/be/kennisbank/videografie/korte-video-vs-lange-video/`

**Pillar Drone** (`drone`):
- `/be/kennisbank/drone/dronebeelden-voor-bedrijven/`
- `/be/kennisbank/drone/dronefotografie-voor-vastgoed/`
- `/be/kennisbank/drone/dronevideo-voor-bouwprojecten/`
- `/be/kennisbank/drone/fpv-video-voor-bedrijven/`
- `/be/kennisbank/drone/dronebeelden-combineren-met-bedrijfsvideo/`

**Pillar 3D & VR** (`3d-vr`):
- `/be/kennisbank/3d-vr/wat-is-een-3d-tour/`
- `/be/kennisbank/3d-vr/virtuele-rondleiding-voor-showroom/`
- `/be/kennisbank/3d-vr/3d-tour-voor-horeca/`
- `/be/kennisbank/3d-vr/3d-tour-voor-vastgoed/`
- `/be/kennisbank/3d-vr/hoe-verhoogt-een-virtuele-tour-vertrouwen/`

**Pillar Podcasting** (`podcasting`):
- `/be/kennisbank/podcasting/bedrijfspodcast-starten/`
- `/be/kennisbank/podcasting/podcast-opnemen-met-video/`
- `/be/kennisbank/podcasting/podcast-voor-experts-en-consultants/`
- `/be/kennisbank/podcasting/videocast-vs-podcast/`
- `/be/kennisbank/podcasting/hoe-maak-je-van-een-podcast-social-content/`

**Pillar Masterclasses** (`masterclasses`):
- `/be/kennisbank/masterclasses/online-cursus-filmen/`
- `/be/kennisbank/masterclasses/masterclass-opnemen-voor-bedrijven/`
- `/be/kennisbank/masterclasses/workshop-professioneel-vastleggen/`
- `/be/kennisbank/masterclasses/opleiding-omzetten-naar-video-content/`

---

## 7. Interne linkregels (voor de contentmaker)

- **Dienstpagina** linkt naar: relevante subdiensten, relevante regio's, relevante cases, relevante blogs, contact/offerte.
- **Subdienstpagina** linkt naar: hoofddienst, sibling-subdiensten, cases, blog, offerte.
- **Blogartikel** linkt naar: hoofddienst, subdienst, regiohub, case, contact/offerte.
- **Case** linkt naar: gebruikte dienst, sectorpagina, regiopagina, vergelijkbare cases, contact/offerte.
- **Regiopagina** linkt naar: relevante diensten, cases uit/nabij de regio, lokaal belangrijke sectoren, contact/offerte.
- **Sectorpagina** linkt naar: passende diensten, cases als bewijs, relevante blogs, offerte.

---

## 8. SEO-regels per pagina

- Unieke `title` (55-60 tekens) en `description` (150-160 tekens), 1x `<h1>`, canonical, OpenGraph + Twitter card.
- Structured data waar relevant: `LocalBusiness`, `Organization`, `Service`, `Article`/`BlogPosting`, `BreadcrumbList`, `FAQPage`, `VideoObject`/`ImageObject`.
- GEO/AEO: direct-antwoord-paragraaf bovenaan, vraag-geformuleerde headings, feiten consistent herhalen, FAQ-schema.
- **SEO-waarschuwing:** geen massa dunne, bijna identieke locatiepagina's. Eerst sterke regiohubs, stadspagina's enkel bij unieke content/cases.

---

## 9. Samenvatting in cijfers

| Type | Bestaat ✅ | Gepland 🕒 |
|---|---|---|
| Hoofdpagina's | 9 | 3 (juridisch) |
| Diensten (hoofd + sub) | 54 | - |
| Regiohubs | 4 | 12 steden + ~16 regio×dienst |
| Sectoren | 10 | - |
| Realisaties (cases) | 0 (hub leeg) | ~11 categorieën + cases |
| Blogposts | 3 | ~45 (8 pillars + clusters) |

> **Route-werk dat nog nodig is voordat bepaalde content live kan (⚠️):**
> 1. Realisaties: routes `realisaties/[category]/` + `realisaties/[category]/[slug]/` en de `cases`-data invullen.
> 2. Regio + dienst: geneste route `regio/[slug]/[sub]/` + datamodel voor die subpagina's.
>
> De blog-categorieën vergen **geen** route-werk meer: registratie is gebeurd, post-URL's werken zodra de `.mdx` binnenkomt.
