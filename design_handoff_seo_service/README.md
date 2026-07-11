# Handoff: Dienstenpagina "SEO" (VisualVibe)

## Overview
The **SEO service page** for the VisualVibe website — the sibling of the Webdesign service page, same quality and structure but with its own hero visual. It opens with an animated **SEO/GEO rankings dashboard**, then shows **three SEO/GEO-tagged realisatie cards**.

Block order (top → bottom):
1. **Header / navigation** (with a mobile hamburger menu).
2. **Hero** — breadcrumb, "SEO & GEO" badge, H1 "SEO", intro, two CTAs, and an **animated rankings-dashboard visual** on the right.
3. **SEO-realisaties** — a 3-card grid of webdesign projects that carry an SEO or GEO badge.
4. **Footer** — *out of scope here*; ship the existing `Footer` component below this page.

### Scope
- ✅ Header + responsive mobile nav, hero + animated SEO visual, 3-card SEO/GEO grid.
- ✅ **Responsive rules** across desktop / tablet / mobile.
- ⛔ **Footer**: shipped separately (`design_handoff_footer`). The full Webdesign service page also has "diensten overzicht / hoe we werken / FAQ / gerelateerde diensten / CTA" blocks — those are **not** part of this SEO handoff (this covers hero + SEO cases only, per the request).

## About the design files
`reference/Diensten - SEO.dc.html` is a **design reference built in HTML** (a prototype of the look, motion and responsive behaviour) — **not production code to copy directly**. `support.js` and `image-slot.js` are included only so the prototype renders. Open the HTML to see the live page; drag the browser narrow to watch it reflow. Do **not** ship `support.js`.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii, motion and breakpoints are final.

---

## Global shell
- Background `#0a0a0a`, text `#fff`. Root `width:100%; max-width:1440px; margin:0 auto; overflow:hidden`. Ambient orange radial glow top-right.
- Fonts: `Sora` (700/800 headings), `Manrope` (body), `JetBrains Mono` (breadcrumb, eyebrows, metrics, keyword rows).
- Accent `#FF7A00` / `#FF9A45`; primary gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)`; success green `#5ac47d` (used for rank/positie signals).
- Links hover `#FF7A00`.

## 1 · Navigation
Standard VisualVibe nav (`justify-content:space-between; flex-wrap:wrap; padding:22px 56px`, bottom hairline). Logo, Home icon + Diensten ▾ (active) · Regio ▾ · Realisaties ▾ · Sectoren ▾ · Kennisbank ▾ · Over ons · Contact, user icon + gradient CTA.
- **Mobile (≤1000px):** links + user cluster hide; a 44×44 hamburger toggles a full-width stacked panel (all nav items + CTA). State: `navOpen` → panel class `open`.

## 2 · Hero
`padding:64px 56px 52px`. Grid `1fr 540px`, `gap:56px`, `align-items:center`.
- **Left (copy):** breadcrumb "Diensten / SEO"; a "● SEO & GEO" pill (mono, live pulsing dot); **H1 "SEO"** (Sora 800, 66px); intro paragraph about ranking in Google + AI-zoekmachines (ChatGPT, Perplexity, Gemini); primary "Offerte aanvragen" + secondary "Bekijk realisaties" (anchors to `#seo-cases`).
- **Right — animated rankings-dashboard visual (`.seoVisual`, design box 540×452):**
  - A slowly rotating **conic glow** behind (`vvSpin` 20s).
  - **Dashboard card** (gradient border, `#0e0d0c`): header "● Organisch verkeer" (green live dot) + "↗ +240%" (green).
  - **Traffic chart** (inline SVG, `viewBox 0 0 416 172`): 3 faint gridlines, an orange **area** (`#seoFill` gradient) and a climbing **line** (`#seoStroke` gradient). The line **draws itself** on a 7s loop (`seoLine` = `stroke-dasharray:900` + `seoDraw` animating `stroke-dashoffset` 900→0→900); the area fades in with it (`seoArea`); a **pulsing endpoint dot** (`seoDot`, `dotPulse` 2s) sits at the top-right.
  - **Three keyword rows:** mono keyword label + a rank **bar** (gradient, grows via `seoBar` = `scaleX` `growW` 4.5s, staggered `animation-delay` .1/.3/.5s) + a green rank pill "#1 ↑ / #2 ↑".
  - **Floating "Positie #1 · in Google"** chip (trophy icon, `bob` 4.4s) top-right.
  - **Floating "Zichtbaar in AI"** chip (sparkle icon + ChatGPT / Perplexity / Gemini mono pills, `bob2` 5.4s) bottom-left — this is the GEO signal.
  - The visual is **static markup + CSS-keyframe animation** (no JS state), so it paints instantly.

## 3 · SEO-realisaties (3 graphics)
`padding:24px 56px 110px`, `max-width:1300px`. Head row: eyebrow "SEO-REALISATIES" + H2 "Websites die we lieten ranken" (left), a short sub-paragraph (right).
- Grid `repeat(3,1fr)`, `gap:18px`, **3 cards** — webdesign projects with an SEO/GEO badge:
  1. **Gordijnen Myriam** — badge "SEO · GEO", tags Lokale SEO / GEO / AI, real screenshot thumbnail (Firebase).
  2. **Nozeco** — badge "SEO", tags SEO / Offerte, empty thumbnail.
  3. **HorseSpa** — badge "SEO", tags SEO / Galerij, empty thumbnail.
- **Card** (`.rCard`, same component as the Realisaties page): radius 17, border `rgba(255,255,255,.09)`, bg `rgba(255,255,255,.02)`; 16:10 screenshot area (`image-slot#seo-<id>-thumb`, user fills empty ones) with a **gradient SEO/GEO badge** top-left and an open-in-new chip top-right; body = tag pills, name (Sora 700, 19px), teaser, mono "BEKIJK REALISATIE →". **Hover:** lift `translateY(-7px)`, border warms, thumbnail scales 1.05, chip + link warm to accent. **Entrance:** staggered `rowIn` fade-up.
- To add more SEO cases: append to the `cases` array in the logic class (same shape). The section title says "three graphics" by design intent but the grid takes any count.

## Responsive behaviour (breakpoints)
Root fluid; the SEO visual is the only fixed-size element (scaled + clipped on small screens).

### ≥ 1000px — desktop
Full nav; hero grid `1fr 540px` (copy left, visual right); cards 3 columns.

### ≤ 1000px — tablet
- Nav → **hamburger** (links + user hidden, panel toggles).
- Hero → **1 column** (`.seoHero`); the visual moves **below** the copy (`.seoVisualCol` `order:2`, centered).
- Cards → **2 columns** (`.seoCards`).

### ≤ 760px
- Section paddings drop to `…22px…`; H1 → `clamp(48px,15vw,66px)`.
- SEO visual scales to **0.82** (`transform-origin:top center`) inside a clipped `.seoVisualCol` (height 452, `overflow:hidden`).
- Cards head stacks.

### ≤ 560px — phone
- Cards → **1 column**; SEO visual scales to **0.62** (col height 352).

Verified: no horizontal overflow (root + visual column both `overflow:hidden`).

## Motion (keyframes)
- `seoDraw` 7s — traffic line self-draws (loop); `seoArea` fades the fill with it; `seoDot`/`dotPulse` 2s — endpoint pulse.
- `seoBar`/`growW` 4.5s — keyword rank bars grow (staggered).
- `vvSpin` 20s — conic glow rotation.
- `livePulse` 2.2s — the two live dots; `bob` 4.4s / `bob2` 5.4s — floating chips.
- `rowIn` .55s — staggered card entrance.
- Guard: `prefers-reduced-motion` freezes the line drawn, bars full, cards visible, and disables all animation.

## State / props (logic class)
- `state.navOpen` — mobile menu.
- Exposed: `cases` (3 SEO/GEO projects: id, name, url, badge, tags[], teaser, thumbId, thumbSrc), `navMobile[]`, `navPanelClass`, `onNavToggle`.
- `$preview` 1440×1080; no tweakable props declared. If per-page editing is wanted, promote the hero H1/intro or the case list to props.

## Assets & dependencies
- `image-slot.js` — drag-and-drop image slot (card thumbnails; each has a stable `id` so drops persist).
- Gordijnen Myriam thumbnail: Firebase-hosted `.webp` (URL inline in the file).
- The SEO visual is pure inline SVG + CSS — no image assets.
- Google Fonts: Sora, Manrope, JetBrains Mono.
