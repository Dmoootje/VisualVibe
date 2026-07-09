# Handoff: VisualVibe — Dienst "Webdesign" (hero + realisatie-showcase)

## Overview
A single service page for **Webdesign** on the VisualVibe site (creative media agency, Limburg BE). It has two parts: a **product-vibe hero** (headline + copy + a live browser mock-up preview with animated "scan" overlay and floating performance chips) and an **animated realisatie-showcase** — an accordion of real client web projects that stagger in on load; clicking a row expands it to reveal a screenshot gallery, the project story, the SEO focus terms, a "wat we leverden" checklist, and a "Bekijk site" link. The site's global top nav is included for context; there is **no footer** in this deliverable (by request).

## About the Design Files
The bundled file is a **design reference built in HTML** — a prototype of look, motion, and behavior — **not production code to ship as-is**. Recreate it in your target codebase (React/Vue/Svelte/WordPress theme/etc.) using that project's components, tokens, and image pipeline. The prototype uses a small in-house runtime (`support.js`) purely so it renders standalone; you do **not** port that. All visuals are plain HTML + inline styles + CSS `@keyframes`; the only real logic is a tiny accordion state (one open row) plus a data array of the projects.

## Fidelity
**High-fidelity.** Final colors, type, spacing, layout, motion, and real copy. Values documented below.

## Canvas & Responsiveness
- Authored at fixed design width **1440px**, dark background `#0a0a0a`, height flows with content (~1180px+ with one row open).
- Two content sections are centered at `max-width:1300px` with `padding: … 56px`.
- **Hero** grid: `grid-template-columns: 1fr 560px; gap:56px; align-items:center`.
- **Showcase** rows are full container width, stacked with `gap:14px`.
- Suggested responsive behavior (not in the static mock): under ~1024px stack the hero to one column (copy over preview); in an expanded case, collapse the info column under the gallery, and drop the 3 device screenshots from a 3-col row to a 1- or 2-col grid.

---

## View: Webdesign service page

### 1) Top nav (context)
Full-width bar, `padding:22px 56px`, bottom hairline `1px solid rgba(255,255,255,.06)`.
- Left: wordmark **Visual** (white) + **Vibe** (`#FF7A00`), Sora 800, 24px.
- Center links (Manrope 600, 15px, `rgba(255,255,255,.85)`): home icon, **Diensten ▾** (active, white, orange chevron), **Regio ▾**, Realisaties, Sectoren, Kennisbank, Over ons, Contact.
- Right: user icon + **Offerte aanvragen** button — gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)`, `padding:11px 20px; radius:10px; box-shadow:0 12px 30px -12px rgba(255,90,0,.8)`; hover `translateY(-2px)`.

### 2) Hero (product vibe)
Left column:
- **Breadcrumb** (JetBrains Mono, 12px): `Diensten / Webdesign` (last segment `#FF9A45`).
- **Eyebrow pill**: `background:rgba(255,122,0,.1); border:1px solid rgba(255,122,0,.25); radius:9999px; padding:8px 15px; color:#FF9A45; 13px/700`, with a pulsing 7px dot (`livePulse 2.2s`). Text **"Websites & webshops"**.
- **H1** "Webdesign" — Sora 800, 66px, line-height 1.02, letter-spacing −.03em, white.
- **Paragraph** (19px, `rgba(255,255,255,.62)`, max-width 500px): *"VisualVibe bouwt snelle, gebruiksvriendelijke websites en webshops voor KMO's in Limburg. Van een strakke onepager tot een volledige webshop: elke website wordt opgebouwd rond snelheid, vindbaarheid en een duidelijk pad naar contact."*
- **Buttons**: primary "Offerte aanvragen" (gradient, arrow slides on hover) + secondary "Bekijk realisaties" (anchor to `#showcase`, `background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.14)`, down-chevron). Both `padding:15px 28px; radius:12px; 16px/700`; hover lift `translateY(-2px)`.

Right column — **live browser mock-up**:
- Gradient hairline frame (`radius:18px; padding:1.5px; background:linear-gradient(150deg,rgba(255,150,60,.7),rgba(255,90,0,.25) 55%,rgba(255,255,255,.05))`), soft drop shadow, a breathing radial glow behind (`glowB` 6s).
- Chrome bar: 3 dots (`#FF3B2E/#FF7A00/#FFA23A`) + a URL pill with a lock icon reading `klant-website.be` (JetBrains Mono 11px).
- Body (height 340px): an **`<image-slot>`** (`id="wd-hero-preview"`, prefilled `src=` the site's `website-mockup.png`), an animated **scan line** (`scanY` 3.6s, orange gradient sweeping top→bottom), and a drifting **cursor** SVG (`cursorMove` 7s).
- **Floating chips** (absolute, gently bobbing): top-right a PageSpeed ring reading **"98 / PageSpeed"**; bottom-left **"SEO-ready"** with a green check. Cards: `background:rgba(20,17,14,.9); backdrop-filter:blur(8px); border:1px solid rgba(255,122,0,.22)`.

### 3) Showcase (`id="showcase"`)
Header row: eyebrow **"REALISATIES"** (JetBrains Mono, letter-spacing .18em, `#FF9A45`) + H2 **"Websites die we voor KMO's bouwden"** (Sora 800, 40px) + a muted helper line on the right: *"Klik een project open voor screenshots en wat we precies leverden."*

**Accordion rows** — one per project, `gap:14px`. Each row = a clickable header + a collapsible body.

**Collapsed header** (`.caseHead`, `radius:18px; border:1px solid rgba(255,255,255,.09); padding:22px 24px; display:flex; gap:24px; align-items:center; cursor:pointer`):
- Index `01`–`12` (JetBrains Mono 700, `#FF9A45`, min-width 34px).
- Name (Sora 700, 22px, white) + tag pills (11px, `rgba(255,255,255,.05)` bg, hairline border, radius 9999px).
- One-line teaser (14px, `rgba(255,255,255,.5)`).
- A **thumbnail** `<image-slot>` (132×82, radius 11px).
- A round chevron button (38px, hairline border) that rotates 180° when open (`transition:transform .4s`).
- Open state: header border → `rgba(255,122,0,.5)`, background → `rgba(255,122,0,.05)`.

**Expanded body** — animated open/close via the CSS grid-rows trick: wrapper `display:grid; grid-template-rows:0fr` (closed) → `1fr` (open), `transition:grid-template-rows .5s cubic-bezier(.2,.7,.2,1)`, inner child `overflow:hidden`. Body layout `grid-template-columns: 668px 1fr; gap:36px; padding:26px 24px 8px` (gallery column fixed to 668px so the big screenshot and device row align flush; info column takes the rest, ~436px):
- **Gallery** (left): one large screenshot (`aspect-ratio:16/9`, radius 13px) above a **left-aligned row of 3 device slots of equal height (210px) but device-proportional widths** — DESKTOP (`aspect-ratio:16/9`), TABLET (`aspect-ratio:3/4`), MOBIEL (`aspect-ratio:1/2`) — labelled with a small mono tag top-left (`rgba(10,10,10,.6)` chip). Each card aspect matches the typical device screenshot ratio so the image fills the card width and shows the full screenshot (top included). All are `<image-slot>`s. Note: image-slot cover-centers a mismatched drop; for a strict "fill width, top-anchored, crop bottom" behavior in production use `object-fit:cover; object-position:top` (or width:100%/height:auto in an overflow-hidden frame).
- **Info** (right): client label (mono, letter-spacing .12em, muted) → project story paragraph → **SEO-FOCUS** heading + term chips (mono 11px, `#FF9A45`, `rgba(255,122,0,.08)` bg, magnifier icon) → **WAT WE LEVERDEN** heading + checklist (each item: 22px rounded orange check tile + label) → **"Bekijk site"** link button (`background:rgba(255,122,0,.12); border:1px solid rgba(255,122,0,.35)`, external-arrow icon, hover widens the gap).

Only **one row open at a time**; the first (Gordijnen Myriam) is open by default so the interaction is self-evident.

## Interactions & Behavior
- **Entrance**: rows fade/slide up (`rowIn` .6s) staggered by `calc(var(--i)*.11s + .15s)` — one after another.
- **Accordion**: click a header → toggles that row open, closes any other. State = a single `open` index (−1 = all closed). Height animates via grid-rows; chevron rotates.
- **Hero ambient** (loops): scan line, cursor drift, chip bob, glow breathe, eyebrow dot pulse.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables all animations and shows rows at full opacity — preserve this.
- **Image slots**: users drop their own screenshots; drops persist. In production, replace `<image-slot>` with your own image component / CMS field. Slots accept an initial `src` (used here to prefill).

## ⚠ Required: admin image management
Every image placeholder on this page — the hero preview, each case's listing thumbnail, and per case the large screenshot + the three device screenshots (desktop / tablet / mobiel) — **must be editable by the site admin through the CMS**. Each placeholder needs an admin UI to **add a new image or replace/remove an existing one** (upload from disk or pick from the media library), per case. Treat every `<image-slot>` in the prototype as a managed image field in the back-end: it maps to one stored image with add/replace/delete controls. The prototype's drag-and-drop onto a placeholder demonstrates the intended admin behavior — recreate that as a real upload/replace control in your CMS, not a hard-coded asset.

## State / Data
- One piece of UI state: `open` (index of the expanded case; starts at `0`). `toggle(i)` sets `open = (open===i ? -1 : i)`.
- **Projects** are a data array (12 items) — real content pulled from `visualvibe.be/diensten/website/`. Each item:
  `{ id, name, client, url, tags[], teaser, text, features[] (the "wat we leverden" checklist), terms[] (SEO focus chips) }`.
  The 12: Gordijnen Myriam, Het Magazijn, Schrijnwerkerij Aussems, GPRenting, Intramarket, Eluk, Dr. Laurine Nelissen, Studentenkot Hasselt, Nozeco, HorseSpa, Renovaties Snellinx, WeddingVibe. Exact copy is in the source file's logic class — lift it verbatim.
- **Per-case image ids**: `wd-<id>-thumb`, `wd-<id>-1` (big), `wd-<id>-2` (desktop), `wd-<id>-3` (tablet), `wd-<id>-4` (mobiel). Gordijnen Myriam's four are prefilled from Firebase Storage URLs; the rest are empty slots the client fills.

## Design Tokens
**Colors** — bg `#0a0a0a`; surfaces `#0e0d0c`/`#100e0d`/`rgba(255,255,255,.02–.05)`; brand red `#FF3B2E`, orange `#FF7A00`, light `#FFA23A`, accent text `#FF9A45`; success green `#5ac47d`; text `#fff` / `rgba(255,255,255,.62)` / `.5` / `.4`; hairlines `rgba(255,255,255,.06–.14)`; orange tints `rgba(255,122,0,.08–.5)`. Signature gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)`.
**Type** — Sora (700/800) headings; Manrope (500/600/700) body; JetBrains Mono (500/700) labels, breadcrumbs, index, terms. Sizes: H1 66/1.02/−.03em; H2 40; body 19–15; labels/mono 11–12; case name 22.
**Radius** — pills 9999px; buttons 10–12px; cards/rows 18px; media 11–13px.
**Shadow** — primary button `0 16px 40px -14px rgba(255,90,0,.85)`; hero frame `0 40px 90px -34px rgba(255,80,0,.6)`; chips `0 16px 34px -16px rgba(0,0,0,.8)`.
**Motion** — rowIn .6s cubic-bezier(.2,.7,.2,1); accordion grid-rows .5s cubic-bezier(.2,.7,.2,1); scanY 3.6s; cursorMove 7s; bob 4s / bob2 5s; glowB 6s; livePulse 2.2s.

## Assets
- **Hero preview** image: `https://visualvibe.be/wp-content/uploads/2023/08/website-mockup.png`.
- **Gordijnen Myriam** case (prefilled): big `SEO-Webdesign-Gordijnen-Myriam.webp`, desktop `…-Myriam-3.webp`, tablet `SEO-Mobiel-tablet-…-Myriam.webp`, mobiel `SEO-Mobiel-…-Myriam.webp` (full Firebase Storage URLs in the source logic class).
- All other project screenshots: **empty slots** — the client will supply per case (1 big + desktop/tablet/mobiel).
- Icons are inline SVG (nav, chevron, checks, magnifier, external-arrow, cursor). Fonts via Google Fonts. `<image-slot>` is the prototype's drop-target component — swap for your own image/upload component in production.

## Files
- `Diensten — Webdesign.dc.html` — the page (open in a browser to view and read exact inline values).
- `image-slot.js` — the drop-target image component used by the prototype.
- `support.js` — the prototype runtime (render-only; not for porting).
