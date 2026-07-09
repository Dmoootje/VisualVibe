# VisualVibe Next.js Blueprint

## Doel van dit document

Dit document is de technische en SEO-inhoudelijke blueprint voor de VisualVibe-site. We vertrekken vanuit de bestaande Next.js template (NOVA) en bouwen daar een SEO-gerichte website rond voor **VisualVibe**, een creatief mediabureau actief in webdesign, SEO, fotografie, videografie, drone, 3D/VR/AR en podcasting.

De website moet niet worden opgebouwd als een gewone webdesignsite, maar als een **creatief mediabureau voor KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg**.

> **Openstaande vraag (zie CLAUDE.md):** dit document plaatst Limburg als thuisregio (uitgebreide stads-substructuur: Hasselt, Genk, Bilzen, Tongeren, ...) met Vlaanderen/Antwerpen/Nederlands-Limburg als uitbreidingsmarkten. Eerder in dit project werd Antwerpen als vestigingsplaats aangenomen (`business.config.ts` NAP-gegevens). Dit moet uitgeklaard worden voor het echte adres in de LocalBusiness schema en de regiohub-prioriteit vastligt.

---

## Projectdoel

Bouw een moderne, snelle, SEO-vriendelijke Next.js website met:

- Dienstenpagina's
- Subdiensten
- Regiopagina's
- Sectorpagina's
- Realisaties / cases
- Kennisbank / blog
- Offerte-CTA's
- Sterke interne linkstructuur
- Lokale SEO voor Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg
- Schaalbare contentstructuur op basis van data-bestanden of CMS-ready structuur

---

## Belangrijke positionering

Gebruik VisualVibe niet enkel als "webdesign firma".

Correcte positionering:

```
Creatief mediabureau in Limburg voor websites, foto, video en SEO.
```

Alternatieve H1 voor homepage:

```
Webdesign, fotografie en videografie voor bedrijven in Limburg
```

Of sterker:

```
Creatief mediabureau voor webdesign, foto, video en SEO in Limburg
```

---

## Technische uitgangspunten

Gebruik bij voorkeur:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Server Components waar mogelijk
- Statische generatie voor SEO-pagina's
- Dynamische routes op basis van data
- Metadata API voor SEO
- JSON-LD structured data
- Schaalbare componentstructuur
- Geen rommelige hardcoded pagina's per regio of dienst als dat vermeden kan worden

---

## Aanbevolen mappenstructuur

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    robots.ts
    sitemap.ts

    diensten/
      page.tsx
      [slug]/
        page.tsx

    regio/
      page.tsx
      [slug]/
        page.tsx

    sectoren/
      page.tsx
      [slug]/
        page.tsx

    realisaties/
      page.tsx
      categorie/
        [slug]/
          page.tsx
      [slug]/
        page.tsx

    kennisbank/
      page.tsx
      categorie/
        [slug]/
          page.tsx
      [slug]/
        page.tsx

    over-ons/
      page.tsx

    contact/
      page.tsx

    offerte-aanvragen/
      page.tsx

  components/
    layout/
      Header.tsx
      Footer.tsx
      MobileMenu.tsx
      Breadcrumbs.tsx

    sections/
      Hero.tsx
      ServiceGrid.tsx
      ServiceDetail.tsx
      RegionGrid.tsx
      SectorGrid.tsx
      CaseGrid.tsx
      BlogGrid.tsx
      CTASection.tsx
      FAQSection.tsx
      ProcessSection.tsx
      Testimonials.tsx
      InternalLinks.tsx

    cards/
      ServiceCard.tsx
      RegionCard.tsx
      SectorCard.tsx
      CaseCard.tsx
      BlogCard.tsx

    seo/
      JsonLd.tsx
      LocalBusinessSchema.tsx
      ServiceSchema.tsx
      ArticleSchema.tsx
      BreadcrumbSchema.tsx

    ui/
      Button.tsx
      Container.tsx
      Section.tsx
      Badge.tsx
      Heading.tsx

  data/
    site.ts
    navigation.ts
    services.ts
    serviceCategories.ts
    regions.ts
    sectors.ts
    cases.ts
    blog.ts
    faqs.ts
    internalLinks.ts

  lib/
    seo.ts
    slug.ts
    routes.ts
    schema.ts
    utils.ts

  types/
    service.ts
    region.ts
    sector.ts
    case.ts
    blog.ts
    seo.ts

  content/
    services/
    regions/
    sectors/
    cases/
    blog/
```

Note: this repo already has a `src/components/seo/JsonLd.tsx` + `LocalBusinessJsonLd.tsx`/`OrganizationJsonLd.tsx`/`FaqPageJsonLd.tsx`/`BlogPostingJsonLd.tsx` from the earlier scaffolding phase, and uses the NOVA `src/features/<page>/<Feature>` convention rather than a flat `components/sections/`. Reconcile against the `nova-nextjs-template` skill conventions (two-hop barrel exports, config-driven content) when implementing rather than introducing a second, competing component architecture.

---

## Hoofdnavigatie

```
Home
Diensten
Realisaties
Sectoren
Regio
Kennisbank
Over ons
Contact
```

CTA-knop rechts in menu:

```
Offerte aanvragen
```

---

## Sitemapstructuur

```
/
  /diensten/
  /realisaties/
  /sectoren/
  /regio/
  /kennisbank/
  /over-ons/
  /contact/
  /offerte-aanvragen/
```

---

# Dienstenstructuur

## Dienstenhub

Route: `/diensten/`

SEO title:

```
Diensten van VisualVibe: webdesign, fotografie, video, drone, SEO en podcasting
```

H1:

```
Creatieve diensten voor bedrijven die beter zichtbaar willen zijn
```

De dienstenhub toont alle hoofddiensten als kaarten.

## Hoofddiensten

```
/diensten/webdesign/
/diensten/seo/
/diensten/fotografie/
/diensten/videografie/
/diensten/drone-fpv/
/diensten/3d-vr-ar/
/diensten/podcasting/
/diensten/masterclasses/
```

## Webdesign

Route: `/diensten/webdesign/`

Subdiensten:

```
/diensten/website-laten-maken/
/diensten/webshop-laten-maken/
/diensten/onepager-laten-maken/
/diensten/website-vernieuwen/
/diensten/website-onderhoud/
/diensten/wordpress-website-laten-maken/
/diensten/seo-website-laten-maken/
```

Aanbevolen H1: `Webdesign in Limburg voor websites die klanten opleveren`

Focus keywords: webdesign Limburg, website laten maken Limburg, webdesigner Limburg, professionele website laten maken, website laten maken voor KMO

Interne links:

```
/diensten/seo/
/diensten/fotografie/
/diensten/videografie/
/regio/limburg/webdesign-limburg/
/realisaties/categorie/webdesign/
/kennisbank/webdesign/
```

## SEO

Route: `/diensten/seo/`

Subdiensten:

```
/diensten/lokale-seo/
/diensten/technische-seo/
/diensten/seo-copywriting/
/diensten/google-business-profiel-optimalisatie/
/diensten/ai-seo-aeo-geo/
```

Aanbevolen H1: `SEO bureau in Limburg voor lokale vindbaarheid en AI-zoekresultaten`

Focus keywords: SEO Limburg, SEO bureau Limburg, lokale SEO, technische SEO, AI SEO, AEO, GEO, Google vindbaarheid verbeteren

## Fotografie

Route: `/diensten/fotografie/`

Subdiensten:

```
/diensten/bedrijfsfotografie/
/diensten/zakelijke-portretten/
/diensten/productfotografie/
/diensten/eventfotografie/
/diensten/vastgoedfotografie/
/diensten/realisatiefotografie/
/diensten/brandingfotografie/
```

Aanbevolen H1: `Bedrijfsfotografie in Limburg voor sterke merken en professionele beelden`

Focus keywords: fotograaf Limburg, bedrijfsfotograaf Limburg, bedrijfsfotografie, zakelijke fotografie, productfotografie, eventfotografie, brandingfotografie

## Videografie

Route: `/diensten/videografie/`

Subdiensten:

```
/diensten/bedrijfsvideo/
/diensten/promovideo/
/diensten/social-media-video/
/diensten/event-aftermovie/
/diensten/wervingsvideo/
/diensten/testimonial-video/
/diensten/podcast-video/
/diensten/nieuwsreportage/
```

Aanbevolen H1: `Videografie in Limburg voor bedrijven die willen opvallen`

Focus keywords: videograaf Limburg, bedrijfsvideo laten maken, promovideo laten maken, social media video, aftermovie laten maken, wervingsvideo

## Drone & FPV

Route: `/diensten/drone-fpv/`

Subdiensten:

```
/diensten/dronefotografie/
/diensten/dronevideo/
/diensten/fpv-video/
/diensten/vastgoed-dronebeelden/
/diensten/realisatie-dronebeelden/
/diensten/event-dronebeelden/
```

Aanbevolen H1: `Dronebeelden en FPV-video voor bedrijven, vastgoed en events`

## 3D, VR & AR

Route: `/diensten/3d-vr-ar/`

Subdiensten:

```
/diensten/3d-tour/
/diensten/virtuele-rondleiding/
/diensten/showroom-3d-tour/
/diensten/vastgoed-3d-tour/
/diensten/horeca-virtuele-tour/
```

Aanbevolen H1: `3D tours en virtuele rondleidingen voor showrooms, vastgoed en horeca`

## Podcasting

Route: `/diensten/podcasting/`

Subdiensten:

```
/diensten/bedrijfspodcast/
/diensten/videopodcast/
/diensten/podcast-opname/
/diensten/podcast-traject/
/diensten/podcast-voor-experts/
```

Aanbevolen H1: `Podcast en videopodcast laten opnemen voor jouw bedrijf`

## Masterclasses

Route: `/diensten/masterclasses/`

Subdiensten:

```
/diensten/opleiding-opnemen/
/diensten/online-cursus-video/
/diensten/workshop-filmen/
```

Aanbevolen H1: `Masterclasses, opleidingen en workshops professioneel laten opnemen`

---

# Regiostructuur

Maak geen honderden dunne locatiepagina's. Gebruik eerst sterke regiohubs en enkel stadspagina's waar unieke content, cases of lokale relevantie bestaat.

## Regiohub

`/regio/`

## Hoofdregio's

```
/regio/limburg/
/regio/vlaanderen/
/regio/antwerpen/
/regio/nederlands-limburg/
```

## Limburg

`/regio/limburg/` met subpagina's:

- `/regio/limburg/webdesign-limburg/`
- `/regio/limburg/seo-bureau-limburg/`
- `/regio/limburg/fotograaf-limburg/`
- `/regio/limburg/videograaf-limburg/`
- `/regio/limburg/dronefotografie-limburg/`
- `/regio/limburg/bedrijfsvideo-limburg/`
- `/regio/limburg/3d-tour-limburg/`

Prioritaire lokale pagina's:

```
/regio/bilzen-hoeselt/
/regio/tongeren-borgloon/
/regio/hasselt/
/regio/genk/
/regio/sint-truiden/
/regio/maasmechelen/
/regio/lanaken/
/regio/diepenbeek/
/regio/beringen/
/regio/houthalen-helchteren/
/regio/lommel/
/regio/pelt/
```

## Antwerpen

`/regio/antwerpen/` met subpagina's:

- `/regio/antwerpen/webdesign-antwerpen/`
- `/regio/antwerpen/fotograaf-antwerpen/`
- `/regio/antwerpen/videograaf-antwerpen/`
- `/regio/antwerpen/bedrijfsvideo-antwerpen/`
- `/regio/antwerpen/dronefotografie-antwerpen/`

Latere uitbreidingen: `/regio/mechelen/`, `/regio/turnhout/`, `/regio/geel/`, `/regio/herentals/`, `/regio/lier/`, `/regio/mol/`

## Nederlands-Limburg

`/regio/nederlands-limburg/` met subpagina's:

- `/regio/nederlands-limburg/webdesign-nederlands-limburg/`
- `/regio/nederlands-limburg/fotograaf-nederlands-limburg/`
- `/regio/nederlands-limburg/videograaf-nederlands-limburg/`
- `/regio/nederlands-limburg/dronefotografie-nederlands-limburg/`

Latere uitbreidingen: `/regio/maastricht/`, `/regio/valkenburg/`, `/regio/sittard-geleen/`, `/regio/heerlen/`, `/regio/roermond/`, `/regio/venlo/`, `/regio/weert/`

---

# Sectorstructuur

Sectorhub: `/sectoren/`

Sectorpagina's:

```
/sectoren/kmo/
/sectoren/bouw-renovatie/
/sectoren/horeca/
/sectoren/vastgoed-immo/
/sectoren/retail-webshops/
/sectoren/events/
/sectoren/sportclubs/
/sectoren/opleidingen-masterclasses/
/sectoren/wellness-beauty/
/sectoren/industrie/
```

Elke sectorpagina moet tonen:

1. Voor wie is deze pagina?
2. Welke problemen heeft deze sector?
3. Welke diensten passen daarbij?
4. Welke cases/realisaties tonen bewijs?
5. Welke blogs helpen deze doelgroep?
6. CTA naar offerte

Voorbeeld voor bouw-renovatie:

```
H1: Marketing, fotografie en webdesign voor bouw- en renovatiebedrijven

Blokken:
- Website laten maken voor renovatiebedrijf
- Realisatiefotografie van projecten
- Dronebeelden van werven
- Video van afgeronde projecten
- SEO voor renovatiebedrijven in Limburg
- Cases van bouw, renovatie, tuinen, zwembaden of interieurprojecten
```

---

# Realisaties / cases

Gebruik liever `/realisaties/` dan `/portfolio/`.

Hoofdroute: `/realisaties/`

Categorieën:

```
/realisaties/categorie/webdesign/
/realisaties/categorie/fotografie/
/realisaties/categorie/videografie/
/realisaties/categorie/drone/
/realisaties/categorie/3d-vr/
/realisaties/categorie/podcasting/
/realisaties/categorie/bedrijven/
/realisaties/categorie/projecten/
/realisaties/categorie/events/
/realisaties/categorie/sport/
/realisaties/categorie/buitenland/
```

Voorbeelden van case-routes:

```
/realisaties/webdesign/renovatie-snellinx/
/realisaties/webdesign/weddingvibe/
/realisaties/fotografie/milano-bilzen/
/realisaties/fotografie/bib-bilzen/
/realisaties/fotografie/botenhuis-tongeren/
/realisaties/3d-vr/gervi-showrooms/
/realisaties/podcasting/motmans-partners/
```

## Case-template

Elke casepagina krijgt deze opbouw:

```
H1: [Dienst] voor [klant] in [regio]

1. Intro
2. Vraag van de klant
3. Aanpak van VisualVibe
4. Resultaat
5. Gebruikte diensten
6. Beelden / video / website embed
7. Interne links naar diensten
8. Interne links naar sector
9. Interne links naar regio
10. CTA: Ook zo'n project laten maken?
```

Case metadata:

```ts
type CaseItem = {
  title: string
  slug: string
  client: string
  location?: string
  sector?: string
  services: string[]
  category: string
  excerpt: string
  challenge?: string
  approach?: string
  result?: string
  images?: string[]
  videoUrl?: string
  websiteUrl?: string
  seoTitle: string
  seoDescription: string
}
```

---

# Kennisbank / blog

Gebruik liever `/kennisbank/` dan `/blog/`.

Hoofdroute: `/kennisbank/`

Categorieën:

```
/kennisbank/categorie/webdesign/
/kennisbank/categorie/seo/
/kennisbank/categorie/fotografie/
/kennisbank/categorie/videografie/
/kennisbank/categorie/drone/
/kennisbank/categorie/3d-vr/
/kennisbank/categorie/podcasting/
/kennisbank/categorie/lokale-marketing/
/kennisbank/categorie/cases/
```

## Blog pillars en clusters

### Pillar 1: Webdesign - `/kennisbank/webdesign/`

- website-laten-maken-kosten/
- onepager-of-volledige-website/
- webshop-laten-maken-voor-kmo/
- website-vernieuwen-wanneer/
- waarom-een-snelle-website-beter-rankt/
- checklist-nieuwe-website/

Linkt naar: `/diensten/webdesign/`, `/diensten/website-laten-maken/`, `/diensten/webshop-laten-maken/`, `/regio/limburg/webdesign-limburg/`

### Pillar 2: SEO / AEO / GEO - `/kennisbank/seo/`

- lokale-seo-voor-kmo/
- seo-voor-websites-in-limburg/
- google-business-profiel-optimaliseren/
- technische-seo-checklist/
- wat-is-aeo/
- wat-is-geo-generative-engine-optimization/
- hoe-word-je-gevonden-in-ai-zoekresultaten/
- seo-content-voor-dienstverleners/

Linkt naar: `/diensten/seo/`, `/diensten/lokale-seo/`, `/diensten/ai-seo-aeo-geo/`, `/regio/limburg/seo-bureau-limburg/`

### Pillar 3: Fotografie - `/kennisbank/fotografie/`

- wat-is-bedrijfsfotografie/
- hoe-bereid-je-een-bedrijfsshoot-voor/
- zakelijke-portretten-tips/
- productfotografie-voor-webshops/
- vastgoedfotografie-tips/
- realisatiefotografie-voor-aannemers/
- eventfotografie-checklist/

Linkt naar: `/diensten/fotografie/`, `/diensten/bedrijfsfotografie/`, `/diensten/productfotografie/`, `/diensten/realisatiefotografie/`, `/regio/limburg/fotograaf-limburg/`

### Pillar 4: Videografie - `/kennisbank/videografie/`

- waarom-een-bedrijfsvideo-laten-maken/
- bedrijfsvideo-script-opbouwen/
- social-media-video-voor-kmo/
- aftermovie-van-bedrijfsevent/
- wervingsvideo-voor-personeel/
- testimonial-video-laten-maken/
- korte-video-vs-lange-video/

Linkt naar: `/diensten/videografie/`, `/diensten/bedrijfsvideo/`, `/diensten/wervingsvideo/`, `/regio/limburg/videograaf-limburg/`

### Pillar 5: Drone, 3D en VR

`/kennisbank/drone/`:
- dronebeelden-voor-bedrijven/
- dronefotografie-voor-vastgoed/
- dronevideo-voor-bouwprojecten/
- fpv-video-voor-bedrijven/
- dronebeelden-combineren-met-bedrijfsvideo/

`/kennisbank/3d-vr/`:
- wat-is-een-3d-tour/
- virtuele-rondleiding-voor-showroom/
- 3d-tour-voor-horeca/
- 3d-tour-voor-vastgoed/
- hoe-verhoogt-een-virtuele-tour-vertrouwen/

Linkt naar: `/diensten/drone-fpv/`, `/diensten/3d-vr-ar/`

### Pillar 6: Podcasting en masterclasses

`/kennisbank/podcasting/`:
- bedrijfspodcast-starten/
- podcast-opnemen-met-video/
- podcast-voor-experts-en-consultants/
- videocast-vs-podcast/
- hoe-maak-je-van-een-podcast-social-content/

`/kennisbank/masterclasses/`:
- online-cursus-filmen/
- masterclass-opnemen-voor-bedrijven/
- workshop-professioneel-vastleggen/
- opleiding-omzetten-naar-video-content/

Linkt naar: `/diensten/podcasting/`, `/diensten/masterclasses/`

---

# Interne linkregels

**Dienstpagina's linken naar:** relevante subdiensten, relevante regio's, relevante cases, relevante blogartikels, contact/offerte.

**Blogartikels linken naar:** hoofddienst, subdienst, regiohub, case, contact/offerte.

**Cases linken naar:** gebruikte dienst, sectorpagina, regiopagina, vergelijkbare cases, contact/offerte.

**Regiopagina's linken naar:** diensten die relevant zijn in die regio, cases uit of nabij de regio, sectoren die lokaal belangrijk zijn, contact/offerte.

---

# Data-modellen

```ts
export type Service = {
  title: string
  slug: string
  parentSlug?: string
  category: "webdesign" | "seo" | "fotografie" | "videografie" | "drone" | "3d-vr" | "podcasting" | "masterclasses"
  excerpt: string
  intro: string
  benefits: string[]
  process: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
  relatedServices: string[]
  relatedRegions: string[]
  relatedCases: string[]
  relatedPosts: string[]
  seo: { title: string; description: string; keywords: string[] }
}

export type Region = {
  title: string
  slug: string
  type: "province" | "city" | "market"
  country: "BE" | "NL"
  parentRegion?: string
  intro: string
  localServices: string[]
  relatedCases: string[]
  relatedSectors: string[]
  seo: { title: string; description: string; keywords: string[] }
}

export type Sector = {
  title: string
  slug: string
  intro: string
  painPoints: string[]
  recommendedServices: string[]
  relatedCases: string[]
  relatedPosts: string[]
  seo: { title: string; description: string; keywords: string[] }
}

export type BlogPost = {
  title: string
  slug: string
  category: string
  pillar: string
  excerpt: string
  author: string
  publishedAt: string
  updatedAt?: string
  readingTime?: string
  content: string
  relatedServices: string[]
  relatedRegions: string[]
  relatedCases: string[]
  seo: { title: string; description: string; keywords: string[] }
}
```

---

# SEO metadata-regels

Elke pagina moet hebben: title, description, canonical, openGraph title, openGraph description, openGraph image, twitter card, robots index/follow, structured data waar relevant.

Titel-limieten: SEO title max. 55-60 tekens, meta description max. 150-160 tekens.

Voorbeeld:

```
Webdesign Limburg | Websites voor KMO's | VisualVibe

Website laten maken in Limburg? VisualVibe bouwt snelle, professionele websites met sterke beelden, SEO en conversiegerichte structuur.
```

---

# Structured data

Voorzie schema's voor: LocalBusiness, Organization, Service, Article, BlogPosting, BreadcrumbList, FAQPage, CreativeWork, VideoObject (indien video aanwezig is), ImageObject (waar relevant).

---

# Componenten per paginatype

- **Home**: Hero, ServiceGrid, FeaturedCases, RegionIntro, SectorIntro, ProcessSection, Testimonials, BlogPreview, CTASection. Home mag niet te smal op "fotograaf Limburg" zitten - positioneer breed.
- **Dienstenhub**: Hero, ServiceCategoryGrid, ServiceGrid, ProcessSection, FeaturedCases, FAQSection, CTASection
- **Dienst detailpagina**: Hero, ServiceIntro, BenefitsSection, ProcessSection, RelatedCases, RelatedBlogPosts, RelatedRegions, FAQSection, CTASection
- **Regiopagina**: Hero, RegionIntro, LocalServiceGrid, RelatedCases, SectorGrid, FAQSection, CTASection
- **Sectorpagina**: Hero, PainPointsSection, RecommendedServices, RelatedCases, RelatedBlogPosts, FAQSection, CTASection
- **Casepagina**: Hero, CaseIntro, ChallengeApproachResult, MediaGallery, UsedServices, RelatedCases, CTASection
- **Blogartikel**: ArticleHeader, TableOfContents, ArticleBody, RelatedServices, RelatedCases, RelatedPosts, CTASection, FAQSection (indien relevant)

---

# Belangrijke SEO-waarschuwing

Maak geen massa dunne regio-pagina's met dezelfde tekst.

Fout (als alle pagina's bijna hetzelfde zijn):

```
/fotograaf-hasselt/
/fotograaf-genk/
/fotograaf-bilzen/
/fotograaf-antwerpen/
/fotograaf-maastricht/
```

Goed:

```
/regio/limburg/fotograaf-limburg/
/regio/bilzen-hoeselt/
/regio/tongeren-borgloon/
```

En pas uitbreiden naar meer steden wanneer er unieke content, cases, beelden of lokale context beschikbaar is.

---

# Prioriteiten voor implementatie

**Fase 1: Basis** - Next.js template opschonen; layout, header, footer en navigatie bouwen; data-structuur aanmaken; home bouwen; dienstenhub bouwen; contact en offertepagina bouwen.

**Fase 2: Diensten** - dynamische dienstpagina's maken; hoofddiensten vullen; subdiensten vullen; interne links toevoegen; FAQ's per dienst toevoegen.

**Fase 3: Regio en sectoren** - regiohub bouwen; Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg bouwen; prioritaire stadspagina's bouwen; sectorhub bouwen; sectorpagina's vullen.

**Fase 4: Realisaties** - realisatie-overzicht bouwen; categoriepagina's bouwen; case detailpagina's bouwen; cases koppelen aan diensten, regio's en sectoren.

**Fase 5: Kennisbank** - kennisbankoverzicht bouwen; categoriepagina's bouwen; blogdetailpagina's bouwen; pillars en clusters structureren; interne links automatiseren.

**Fase 6: SEO-afwerking** - metadata API per pagina; sitemap.ts; robots.ts; canonicals; JSON-LD; OpenGraph images; performance check; mobile check; Core Web Vitals check.

---

# Eerste content die aangemaakt moet worden

```
/
/diensten/
/diensten/webdesign/
/diensten/seo/
/diensten/fotografie/
/diensten/videografie/
/diensten/drone-fpv/
/diensten/3d-vr-ar/
/diensten/podcasting/
/regio/limburg/
/regio/limburg/webdesign-limburg/
/regio/limburg/fotograaf-limburg/
/regio/limburg/videograaf-limburg/
/regio/bilzen-hoeselt/
/regio/tongeren-borgloon/
/realisaties/
/sectoren/
/sectoren/kmo/
/sectoren/bouw-renovatie/
/kennisbank/
/contact/
/offerte-aanvragen/
```

---

# Definition of Done

De eerste versie is klaar wanneer:

1. Alle hoofdpagina's bestaan
2. Alle hoofddiensten bestaan
3. Header en footer logisch zijn
4. CTA's overal zichtbaar zijn
5. Interne links werken
6. Metadata per pagina aanwezig is
7. Sitemap en robots werken
8. Site mobiel goed bruikbaar is
9. Er geen lege of dunne pagina's online staan
10. De website duidelijk aanvoelt als creatief mediabureau, niet enkel als fotograaf of webdesigner
