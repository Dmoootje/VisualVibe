# Handoff: Realisaties-pagina "Fotografie" (VisualVibe)

## Overview
The **fotografie realisaties (portfolio) page** - the destination the Fotografie service page links to. Same structure and style as the **Realisaties Webdesign** page (reusable header + featured block + card grid), adapted for photography: the featured block shows the first gallery, and every card opens a browsable **lightbox** (the same viewer as the Fotografie service page).

Block order (top → bottom):
1. **Header / navigation** (mobile hamburger).
2. **Reusable realisatie-header** - breadcrumb (Home / Realisaties / Fotografie), camera icon badge, "REALISATIES" eyebrow, H1 "Fotografie", subtitle, stat rail.
3. **Featured - uitgelichte galerij** - the first gallery: **preview images left** (big cover + 3 thumbnails), **copy right** (badge, category label, title, description, tags, "Bekijk galerij"). Opens the lightbox.
4. **Alle galerijen** - a 3-column grid of the remaining 7 galleries as cards → each opens the lightbox.
5. **Footer** - *out of scope*; ship the existing `Footer` component below.

### Scope
- ✅ Header + responsive nav, featured gallery block, gallery card grid, full lightbox (autoplay, thumbnails, arrows, keyboard, swipe), responsive.
- ⛔ **Footer** shipped separately.
- ⚠️ **Requires an admin/CMS gallery system** - see "Backend requirement" below. (The client will discuss this with the developer.)

## About the design files
`reference/Realisaties - Fotografie.dc.html` is a **design reference built in HTML** - not production code to copy verbatim. `support.js` (do not ship) renders the prototype. Open it and click any gallery (featured or a card) to see the lightbox.

## Fidelity
**High-fidelity.** Colours, type, motion, the lightbox and the layout are final. Photography images are **demo placeholders** (existing VisualVibe portfolio webp's + the 8 category cover images) - real galleries come from the CMS.

---

## Global shell
- Background `#0a0a0a`, text `#fff`, root `width:100%; max-width:1440px; margin:0 auto; overflow:hidden`.
- Fonts: `Sora` (700/800), `Manrope` (body), `JetBrains Mono` (eyebrows/labels/captions).
- Accent `#FF7A00` / `#FF9A45`; primary gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)` (round buttons `135deg`).
- This page reuses the **exact nav + reusable realisatie-header** pattern from the Realisaties Webdesign handoff - only the icon (camera), title ("Fotografie"), subtitle and stat rail values differ. The header is meant to be shared across all realisatie-category pages.

## Header
Breadcrumb "Home / Realisaties / Fotografie"; a 66px camera icon badge + "REALISATIES" eyebrow + H1 "Fotografie"; subtitle. Stat rail (two pills): "8 fotografie-stijlen" and "100% in-house geschoten".

## Featured - uitgelichte galerij
`.frFeatGrid` grid `1.15fr .85fr`. **Images left** (order:1), **copy right** (order:2):
- **Left**: a big 16:10 cover (`.frBig`, click → lightbox) with a gradient aperture hover-cue and a "{n} beelden" count chip; below it a 3-up row of `.frThumb` thumbnails (also click → lightbox).
- **Right**: "● UITGELICHTE GALERIJ" pill, a mono category label (title in caps), H2 title, description, tag pills, and a "Bekijk galerij" button.
- Featured = gallery index 0 (Bedrijfsfotografie). Swap by reordering `GAL`.

## Alle galerijen grid
`.gGrid` `repeat(3,1fr)`, the remaining 7 galleries. Each `.gCard` (aspect 4/5): cover image + gradient scrim, a **type badge** (category icon), a photo-count chip, a filled gradient **aperture hover cue**, title + description + "BEKIJK GALERIJ". Staggered `rowIn` entrance; hover lifts + zooms the cover. Click anywhere → opens that gallery's lightbox.

## Lightbox (shared with the Fotografie service page)
Fixed overlay + centered card:
- **Top**: type badge (category icon) + gallery **title** + **description**; **Play/Pauze** autoplay toggle; close (Esc).
- **Progress bar** (5s loop, pauses with autoplay).
- **Stage**: horizontal `.lbTrack` of `<img>` slides (translateX by index), per-slide caption; prev/next arrows; "n / total" counter. **Autoplay** every 5s; **keyboard** ←/→/Esc; **touch swipe** (45px threshold); manual nav restarts the timer.
- **Thumbnail rail**: click to jump, active thumb highlighted.
- All slide/cover/thumbnail `<img>`s are built via `React.createElement` in `renderVals` (so no literal-hole `src` fires during streaming - keeps the console clean).

## The 8 galleries (`GAL` in logic)
Each: `{ id, icon, badge, title, desc, tags[], cover, slides[] }`. Categories: Bedrijfsfotografie (biz), Zakelijke portretten (user), Productfotografie (box), Eventfotografie (party), Vastgoedfotografie (home), Realisatiefotografie (layers), Brandingfotografie (spark), Huwelijksfotografie (heart - tie-in to WeddingVibe). Covers = the 8 `fotografieslide` webp's (468×589); slide sets = the demo portfolio pool - **all to be replaced by CMS data**.

## Responsive
- ≤1080px: nav → hamburger; header stacks (stat rail becomes a row); featured → 1 column (images on top, copy below); grid → 2 columns.
- ≤760px: paddings 22px; H1 & featured H2 clamp down; grid head stacks; lightbox top bar stacks.
- ≤560px: grid → 1 column; header icon shrinks; featured thumbs → 2 columns; lightbox arrows/thumbs shrink.
- All animation disabled under `prefers-reduced-motion`. No horizontal overflow at any width.

## State / logic
`state`: `navOpen`, `lbOpen`, `gal`, `idx`, `auto`. Timer `_iv` (autoplay) synced in `componentDidUpdate`, cleared on unmount; keyboard listener added/removed; covers preloaded in `componentDidMount`. Exposed: featured set (`featIcon/featBadge/featTitle/featDesc/featTags/featCount/featCoverEl/featThumbs/featOpen`), `galleries`, and the full lightbox set (`lbOpen`, `lbTitle/Desc/Badge/Icon`, `lbSlides`, `lbThumbs`, `trackT`, `lbCounter`, `auto/notAuto/progPaused`, `next/prev/go/toggleAuto`, `onTouchStart/End`), plus nav (`navMobile`, `navPanelClass`, `onNavToggle`).

## ⚙️ Backend requirement - admin/CMS gallery system
This page is **content-driven and needs a gallery management system in the admin** (to be built - discuss with the developer):
- **Galleries (categorieën)**: create/edit/reorder galleries, each with a `title`, `type/badge`, `icon`, `description`, `tags`, and a **cover image**. One gallery can be flagged as **featured** (drives the top block).
- **Photos per gallery**: upload/reorder/delete photos, each with an optional **caption** (used as the slide caption) and alt text; the count chip and thumbnails derive from this set.
- The front-end reads this as the `GAL` array shape (`id, icon, badge, title, desc, tags[], cover, slides[]`). Swapping the demo data for CMS output requires no layout changes.
- Recommended: image handling that outputs web-optimised sizes (thumbnail + full) and preserves order; the lightbox already preloads covers and lazy-shows slides.

## Assets & dependencies
- No `image-slot` here (images are CMS/URL-driven, rendered as `<img>`).
- Demo images: existing VisualVibe portfolio webp's + 8 `fotografieslide` category covers (Firebase-hosted, URLs inline in the logic class) - replace with CMS output.
- Google Fonts: Sora, Manrope, JetBrains Mono.
