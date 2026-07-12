# Handoff: VisualVibe Realisaties - Drone & FPV + Fotografie

## Overview
Two portfolio/showcase pages for the VisualVibe "Realisaties" (case work) section:
1. **Realisaties - Drone & FPV** - a filterable media grid of drone photos and videos, with a featured item and a lightbox (photos + embedded YouTube video).
2. **Realisaties - Fotografie** - a portfolio of photography galleries, with one featured gallery and a browsable, auto-playing lightbox slideshow per gallery.

Both pages share the same layout system, chrome, and design tokens; only the content model and the lightbox behavior differ.

## About the Design Files
`Realisaties - Drone en FPV.dc.html` and `Realisaties - Fotografie.dc.html` are **design references created in HTML** ("Design Component" prototypes) showing the intended look and behavior. They are **not production code to ship directly**. Recreate them in the target codebase's existing environment (React/Vue/Astro/CMS, etc.) using its established components, tokens, and patterns; if none exists, choose a suitable framework. `support.js` is only the prototype runtime - do not ship it.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions. Exact values below.

## Design Tokens (shared)

### Colors
- Page background `#0a0a0a`; media/card surface `#141210`; subtle surface `rgba(255,255,255,.03)`
- Primary gradient (buttons, play buttons, active filter): `linear-gradient(90deg, #FF3B2E, #FF7A00)` (135deg variant on round play buttons)
- Accent solids: `#FF7A00`, `#FF9A45`; REC/live dot `#FF3B2E`
- Text `#ffffff`; secondary `rgba(255,255,255,.62–.68)`; muted `rgba(255,255,255,.42–.55)`
- Borders neutral `rgba(255,255,255,.06–.16)`; accent `rgba(255,122,0,.22–.5)`
- Warm radial glow `rgba(255,90,0,.05–.16)`
- Link default inherit, hover `#FF7A00`

### Typography
- **Sora** 600/700/800 - H1 56–58px (line-height .98, letter-spacing -.03em), featured H2 42–44px, section H2 34px, card titles 17–20px, lightbox title 24–26px.
- **Manrope** 400–800 - body 15–18.5px (line-height 1.6–1.65), buttons 14–15px.
- **JetBrains Mono** 500/700 - eyebrows/labels/badges/counters, UPPERCASE, letter-spacing .05–.2em, 10–13px; accent color `#FF9A45`.
- Google Fonts: `Sora:600,700,800` · `Manrope:400,500,600,700,800` · `JetBrains Mono:500,700`

### Spacing / Radius / Shadow
- Container max-width 1440px (inner content 1300px), centered. Nav padding 22px 56px; header 52px 56px 40px; sections 56px 56px.
- Radius: cards/media 18–20px; icon tiles 15–17px; buttons/inputs 10–12px; pills/badges `9999px`.
- Card hover: `translateY(-7px)`, border `rgba(255,122,0,.34)`, shadow `0 34px 70px -30px rgba(255,90,0,.5)`, image `scale(1.06)` + `saturate(1.1)`.
- Featured card shadow `0 40px 90px -34px rgba(255,80,0,.5)`.

## Shared chrome (both pages)
- **Top nav**: logo "Visual"+orange "Vibe"; links Diensten/Regio/Realisaties (active, orange chevron)/Sectoren/Kennisbank/Over ons/Contact; user icon + "Offerte aanvragen" gradient button; burger below 1080px.
- **Header**: grid-pattern bg (52px, radial-masked) + top-right radial orange glow; breadcrumb (Home / Realisaties / <page>); rounded icon tile (66px) + eyebrow "REALISATIES" + H1; subtitle; a **stat rail** on the right (two stat chips). Stacks vertically below 1080px.

---

## Page 1 - Drone & FPV

### Screens / Views
- **Header**: icon = drone (quadcopter). H1 "Drone & FPV". Stats: "4K luchtbeelden · HDR" and "EASA gecertificeerd & verzekerd".
- **Featured** (2-col, `1.15fr .85fr`): left = large 16/9 media card with corner-bracket framing overlay, "REC/UITGELICHT" badge (blinking dot), centered round gradient play button; right = pill "UITGELICHTE REALISATIE" (pulsing dot), category label, H2 title, paragraph, "Bekijk realisatie ▶" button. Opens the lightbox at the featured item.
- **Grid + filter**: eyebrow "ALLE REALISATIES" + H2 "Foto én video, vanuit de lucht"; right-aligned dynamic category description. **Filter buttons** (segmented, "Alle" + 6 categories, each with a count; active = gradient fill). 3-col media grid (`16/11` cards): image, gradient scrim, category badge (icon+label) top-left, centered play button (gradient for video, outline for photo), title bottom. Empty-state card ("Binnenkort werk in deze categorie") when a filter has no items.
- **Lightbox**: fixed overlay, blurred dark bg; header (category pill + title + close ✕ that rotates on hover); 16/9 stage `max-height 64vh` showing either an embedded **YouTube iframe** (autoplay) for video items or a contained image for photos; Vorige / counter / Volgende controls; centered thumbnail strip (mini shows a small play badge for videos, active mini has orange border). Keyboard: ←/→ navigate, Esc closes.

### Content model
- `MEDIA[]`: `{ kind:'video'|'foto', cat, icon:'video'|'foto', title, yt?(YouTube id), src?(image url) }`. Video thumbnails come from `https://img.youtube.com/vi/<id>/maxresdefault.jpg`.
- `CATS[]`: 6 categories (Dronefotografie, Dronevideo, FPV-video, Vastgoed-dronebeelden, Realisatie-dronebeelden, Event-dronebeelden), each with a description used above the grid and in the empty state.

### State
`navOpen`, `lbOpen`, `idx` (current media), `cat` (active filter, default 'Alle').

---

## Page 2 - Fotografie

### Screens / Views
- **Header**: icon = camera. H1 "Fotografie". Stats: "8 fotografie-stijlen" and "100% in-house geschoten".
- **Featured gallery** (2-col, `1.15fr .85fr`): left = large 16/10 cover with hover "aperture" iris button, "N beelden" badge, plus a 3-up thumbnail row beneath; right = pill "UITGELICHTE GALERIJ" (pulsing dot), badge, H2 gallery title, description, tag chips, "Bekijk galerij →" button. Opens the gallery in the lightbox.
- **All galleries grid**: eyebrow "ALLE GALERIJEN" + H2 "Kies een stijl, open de galerij" + note about autoplay. 3-col grid of `4/5` portrait cards: cover image, gradient scrim, category badge top-left, photo-count top-right, centered aperture button, title + description + "BEKIJK GALERIJ →" at bottom. Entrance stagger animation.
- **Lightbox slideshow**: fixed overlay; header (badge + gallery title + description) with a **Play/Pauze** autoplay toggle and close ✕; a thin **progress bar** that animates over 5s per slide; a sliding track (`translateX`) of full slides with captions; prev/next round arrows; slide counter; thumbnail strip (active = orange border). **Autoplay** advances every 5s (toggle to pause); touch swipe supported; keyboard ←/→/Esc.

### Content model
- `GAL[]`: 8 galleries (Bedrijfsfotografie, Zakelijke portretten, Productfotografie, Eventfotografie, Vastgoedfotografie, Realisatiefotografie, Brandingfotografie, Huwelijksfotografie), each `{ id, icon, badge, title, desc, tags[], cover, slides[] }`. `cover`/`slides` reference an image map (`COVER`/`IMG`).
- Icons per gallery: camera, user, box, party, home, layers, spark, heart, aperture (inline SVG set).

### State
`navOpen`, `lbOpen`, `gal` (active gallery), `idx` (slide), `auto` (autoplay on/off). Autoplay uses a 5s interval; pauses when `auto` is false; timer resets on manual navigation.

---

## Interactions & Behavior (both)
- **Filtering** (Drone): category buttons set active filter; grid + description update; empty state when none.
- **Lightbox open**: clicking any grid/featured item opens the lightbox at that index.
- **Navigation**: prev/next buttons, thumbnail click, keyboard ←/→, Esc to close; (Fotografie) touch swipe + 5s autoplay with progress bar + play/pause.
- **Hovers**: cards lift + orange border + image zoom/saturate; play/iris buttons scale up with stronger glow; buttons translate; close ✕ rotates 90°.
- **Animations** (respect `prefers-reduced-motion`): grid entrance fade-up staggered via `--i`; `livePulse` ring on pill dot; `recB` blink on REC dot; lightbox `lbFade`/`lbPop`; progress bar keyframe (Fotografie).
- **Responsive**: featured grid → 1 col below 1080px; stat rail → horizontal; grid 3→2 cols below 1080px, →1 col below 560px; nav → burger; paddings reduce below 760px.

## Assets
- Icons: inline SVG symbol set (24×24, single-color stroke) - home, user, drone, camera(foto), video, aperture, box, party, layers, spark, heart. Replace with the codebase's icon library.
- Images: external Firebase Storage URLs (VisualVibe portfolio photos) and YouTube video IDs (Drone videos). Replace with real case-work media from the CMS. YouTube embeds: `https://www.youtube.com/embed/<id>?autoplay=1&rel=0&modestbranding=1`.
- No local image files required by the prototypes.

## Files
- `Realisaties - Drone en FPV.dc.html` - Drone & FPV page design reference.
- `Realisaties - Fotografie.dc.html` - Fotografie page design reference.
- `support.js` - prototype runtime only (do not ship).
