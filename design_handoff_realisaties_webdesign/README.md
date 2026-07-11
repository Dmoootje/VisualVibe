# Handoff: Realisaties-pagina "Webdesign" (VisualVibe)

## Overview
A **category realisaties (portfolio) page** for the VisualVibe website — the page a visitor lands on to see the webdesign work the agency has delivered. It is also the **template for every other realisatie-category page** (Fotografie, Videografie, Drone & FPV, 3D & VR, Podcasting, Bedrijven, Projecten, Events, Sport, Buitenland): the header pattern and layout stay identical; only icon, title, copy and project data change.

Block order (top → bottom):
1. **Header / navigation** (with a mobile hamburger menu).
2. **Realisatie-header** — reusable: breadcrumb, eyebrow, icon badge, H1, subtitle, and a stat rail.
3. **Featured — "Laatste creatie"** — one hero project shown large: copy on the left, a **device composition** (laptop big, tablet + phone small) on the right.
4. **Grid** — a **Websites / Webshops** segmented toggle above a card grid of the remaining realisaties. Webshops currently shows a tasteful empty state.
5. **Footer** — *out of scope here*; ship the existing `Footer` component below this page.

### Scope
- ✅ Header + responsive mobile nav, reusable realisatie-header, featured showcase, toggle, card grid, empty state.
- ✅ **Responsive rules** across desktop / tablet / mobile.
- ⛔ **Footer**: shipped as its own component (see `design_handoff_footer`).

## About the design files
`reference/Realisaties - Webdesign.dc.html` is a **design reference built in HTML** (a prototype of the look, motion and responsive behaviour) — **not production code to copy directly**. `support.js` and `image-slot.js` are included only so the prototype renders. Open the HTML to see the live page; drag the browser narrow to watch it reflow. Recreate it in the app with your own conventions. Do **not** ship `support.js`.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii, motion and breakpoints are final.

---

## Global shell
- Page background `#0a0a0a`, text `#fff`. Root is `width:100%; max-width:1440px; margin:0 auto; overflow:hidden`.
- Fonts: `Sora` (700/800 headings), `Manrope` (body), `JetBrains Mono` (eyebrows, breadcrumb, labels, metrics).
- Accent orange: `#FF7A00` / `#FF9A45`; primary gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)`; ambient glow `rgba(255,90,0,…)`.
- Links: default inherit, hover `#FF7A00`.

## 1 · Navigation
Same VisualVibe nav as the other pages. `display:flex; justify-content:space-between; flex-wrap:wrap; padding:22px 56px`, bottom hairline `rgba(255,255,255,.06)`.
- Logo "Visual**Vibe**" (Vibe in accent), Sora 800, 24px.
- Center: Home icon + Diensten ▾ · Regio ▾ · **Realisaties ▾** (active, chevron in accent) · Sectoren ▾ · Kennisbank ▾ · Over ons · Contact.
- Right: user icon + "Offerte aanvragen" gradient button.
- **Mobile:** links + user cluster hide; a 44×44 hamburger appears; tapping toggles a full-width stacked panel of all nav items + a full-width CTA. State: `navOpen` boolean → panel class `open`.

## 2 · Realisatie-header (REUSABLE)
`padding:52px 56px 40px`, bottom hairline. Two ambient layers (`z-index:0`, `pointer-events:none`): a warm radial glow top-right, and a 52px white grid **radially masked** (`mask-image: radial-gradient(ellipse 66% 120% at 18% 30%, #000, transparent 72%)`) so it dissolves into the black — the "ingewerkt" treatment shared across the site.
- Inner row (`max-width:1300px`, space-between):
  - **Left:** breadcrumb "Home / Realisaties / Webdesign" (JetBrains Mono 12px, last crumb accent); then a row of **icon badge** (66×66, radius 17, orange gradient fill + border + glow shadow) + a stacked eyebrow "REALISATIES" (mono, `.2em`, accent) and **H1** "Webdesign" (Sora 800, 58px). Subtitle 18px, `rgba(255,255,255,.62)`, max-width 520.
  - **Right — stat rail:** two pills (`rgba(255,255,255,.03)`, border, radius 15): "40+ websites & webshops live gezet" and "98 gem. PageSpeed op mobiel" (number Sora 800 30px, second in accent).
- **To reuse for another category:** swap the icon glyph, the H1, the subtitle, and the featured/grid data. Everything else is identical.

## 3 · Featured — "Laatste creatie"
`padding:56px 56px 60px`, warm radial glow behind. Grid `520px 1fr`, `gap:60px`, `align-items:center`.
- **Left (copy):** a "● LAATSTE CREATIE" pill (mono, live pulsing dot — `livePulse` 2.2s), a mono client label, **H2** project name (Sora 800, 44px), a description paragraph, a tag row (SEO / GEO chips with search glyph + neutral pills), a 2-col **checklist** (orange check chips), and a "Bekijk de live site" outline button (`rgba(255,122,0,.12)`, orange border; hover widens gap + warms bg).
- **Right — device composition (`.rwDevices`, design box 700×520):**
  - **Laptop (groot):** a gradient-bordered browser window — traffic-light dots + a lock + `gordijnenmyriam.be` URL bar, then the desktop screenshot (`image-slot#rw-feat-laptop`), with a metallic laptop base bar + notch below. `left:38px; top:12px; width:640px`.
  - **Tablet (klein):** rounded bezel (radius 20, `aspect-ratio:3/4`, top speaker line), screenshot `image-slot#rw-feat-tablet`; bottom-left, floats (`bob` 4.4s).
  - **Phone (klein):** rounded bezel (radius 24, `aspect-ratio:1/2`, top notch line), screenshot `image-slot#rw-feat-phone`; bottom-right, floats (`bob2` 5.2s).
  - **PageSpeed 98** chip (donut ring) floating top-right (`bob`).
  - "klein, klein, groot" = laptop is the large backdrop; tablet + phone sit small in front.
- Featured content is **static markup** (fixed = Gordijnen Myriam) so it paints instantly. The three device images are Firebase-hosted webp screenshots (URLs in the file). The `image-slot` lets the user drop a replacement that persists.

## 4 · Grid + Websites/Webshops toggle
`padding:24px 56px 110px`, `max-width:1300px`.
- **Head row** (space-between, wraps): left = eyebrow "MEER REALISATIES" + H2 "Websites die we voor KMO's bouwden"; right = **segmented toggle** (two buttons in a `rgba(255,255,255,.04)` pill, radius 13). Active button = orange gradient + shadow; idle = transparent, muted text. State: `soort` = `'website' | 'webshop'`.
- **Websites** (`showGrid`): a `repeat(3,1fr)` card grid, `gap:18px`, 11 projects. **Card** (`.rCard`): radius 17, border `rgba(255,255,255,.09)`, bg `rgba(255,255,255,.02)`; top = 16:10 screenshot area (`image-slot#rw-<id>-thumb`, empty by default for the user to fill) with a small open-in-new chip top-right; body = tag pills, name (Sora 700, 19px), teaser, and a mono "BEKIJK REALISATIE →" link. **Hover:** card lifts (`translateY(-7px)`), border warms, thumbnail image scales 1.05, chip + link warm to accent. **Entrance:** staggered `rowIn` fade-up (`--i` delay).
- **Webshops** (`showEmpty`): a centered empty-state card — cart icon badge, "Binnenkort webshops in de kijker", sub-copy, and an "Offerte aanvragen" gradient button. Replace with real webshop cards when available (same card component).

## Responsive behaviour (breakpoints)
Root is fluid; the only fixed-size element is the device stage, which is scaled + clipped on small screens.

### ≥ 1080px — desktop
Full nav; header row side-by-side (title + stat rail); featured grid `520px 1fr`; card grid 3 columns; device stage full size, right-aligned.

### ≤ 1080px — tablet
- Nav → **hamburger** (links + user cluster hidden, panel toggles).
- Header row **stacks** (`.rwHeadRow` column); stat rail becomes a wrapping **row** (`.rwStatRail`).
- Featured grid → **1 column** (`.rwFeatGrid`); device stage centers (`.rwDeviceCol`).
- Card grid → **2 columns** (`.rwGrid`).

### ≤ 760px
- Section paddings drop to `…22px…`. H1 → `clamp(38px,12vw,52px)`; featured H2 → `clamp(30px,9vw,42px)`.
- Device stage scales to **0.66** (`transform-origin:top center`) inside a clipped `.rwDeviceCol` (height 368, `overflow:hidden`).
- Checklist → 1 column; grid head stacks.

### ≤ 560px — phone
- Card grid → **1 column**; header icon → 54×54; device stage scales to **0.48** (col height 266).

No horizontal overflow at any width (root + device column both `overflow:hidden`).

## Motion (keyframes)
- `livePulse` 2.2s — "LAATSTE CREATIE" dot.
- `bob` 4.4s / `bob2` 5.2s — floating tablet, phone, PageSpeed chip.
- `rowIn` .55s — staggered card entrance (`--i * .07s`).
- Hover transitions on cards, buttons, visit link, open-chip.
- Guard: `prefers-reduced-motion` disables all animation and shows cards at full opacity.

## State / props (logic class)
- `state.soort` (`'website'|'webshop'`) — toggle; `state.navOpen` — mobile menu.
- Exposed: `cases` (11 grid projects: id, name, url, tags[], teaser, thumbId, thumbSrc), `showGrid`, `showEmpty`, `webBtnStyle`/`shopBtnStyle` (computed active/idle), `onWebsite`/`onWebshop`, `navMobile[]`, `navPanelClass`, `onNavToggle`.
- No tweakable props declared (`$preview` only: 1440×1560). If you want the header icon/title/subtitle to be editor-tweakable per category, promote them to props.

## Data (to be sourced from CMS in prod)
- **Featured:** Gordijnen Myriam — client label, description, tags (SEO, GEO/AI, Huisstijl, Fotografie), 4-item checklist, `https://gordijnenmyriam.be/`, 3 device screenshots (Firebase webp).
- **Grid (11):** Het Magazijn, Schrijnwerkerij Aussems, GPRenting, Eluk, Dr. Laurine Nelissen, Intramarket, Studentenkot Hasselt, Nozeco, HorseSpa, Renovaties Snellinx, WeddingVibe — each with tags, teaser, url. Thumbnails empty (user/CMS fills).

## Assets & dependencies
- `image-slot.js` — drag-and-drop image slot web component (used for featured devices + card thumbnails). Each slot has a stable `id` so drops persist.
- Featured device images: Firebase-hosted `.webp` (URLs inline in the file).
- Google Fonts: Sora, Manrope, JetBrains Mono.
