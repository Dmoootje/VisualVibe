# Handoff: Regio-pagina "Vlaanderen" (VisualVibe)

## Overview
A **regional landing page** for the VisualVibe website — the page a visitor lands on for the werkgebied "Vlaanderen". It introduces the region, the services offered there, and the sectors served. This handoff covers the full page and its **responsive behaviour across desktop, tablet and mobile**.

Block order (top → bottom):
1. **Header / navigation** (sticky) — with a mobile hamburger menu.
2. **Hero** — breadcrumb, eyebrow, H1, intro, two CTAs, an animated **België-kaart** with Flanders highlighted, and a scrolling **gemeente-marquee** ("Actief in o.a.").
3. **Diensten** — a 4-card bento ("Alles voor je merk, onder één dak").
4. **Sectoren** — two opposing marquee rows of sector chips.
5. **CTA band** — *out of scope here* (see `design_handoff_cta`).
6. **Footer** — imported component (see Footer note below).

### Scope — IMPORTANT
- ✅ Header + responsive mobile nav, Hero, Diensten bento, Sectoren marquees.
- ✅ **Responsive rules** (this was the focus of this pass — see "Responsive behaviour").
- ⛔ **CTA band**: intentionally left empty on this page; build from `design_handoff_cta`.
- ⛔ **Footer**: shipped as its own component. The reference imports `Footer.dc.html` for a complete preview, but recreate it from its own spec. It received the same responsive treatment (link grid: 4→2→1 columns).

## About the design files
`reference/Regio Vlaanderen.dc.html` is a **design reference built in HTML** (a prototype of the intended look, motion and responsive behaviour) — **not production code to copy directly**. `support.js`, `mapdata.js`, `sector-symbols.js`, `Footer.dc.html` and `assets/*` are included only so the prototype renders in a browser. Open the HTML to see the live page; drag the browser narrow to watch it reflow. Recreate it in the app with your own conventions (App Router, your styling solution). Do **not** ship `support.js`.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii, motion timings and the breakpoint logic are final.

---

## Responsive behaviour (breakpoints)
The page is fluid; three breakpoints change the layout. All layout is driven by CSS (grid + `order` + a hamburger toggle), never by fixed pixel canvases.

### ≥ 1000px — desktop
- **Nav:** logo · inline link row (pushed right, `margin-left:auto`) · "Offerte aanvragen" button. Hamburger hidden.
- **Hero:** two-column grid `minmax(0,0.92fr) minmax(0,1.08fr)`, `align-items:center`, `gap: clamp(20px,3vw,40px)`. **Text left** (`order:1`, `max-width:540px`), **map right** (`order:2`, `justify-self:end`, `max-width:560px`). City-marquee sits full-width **below** the grid (`margin-top:36px`).
- **Diensten:** 12-col grid, cards span 7 / 5 / 5 / 7 (see Diensten).
- **Footer:** link grid `1.5fr 1fr 1fr 1fr`.

### ≤ 1000px — tablet & small desktop
- **Nav → hamburger.** Inline links + the top-right CTA are hidden (`display:none`; the CTA needs `!important` because it carries an inline `display`). A 44×44 burger button (`M3 6h18 / M3 12h18 / M3 18h18`) appears on the right. Tapping it toggles a **full-width panel** (`flex-basis:100%`) that stacks all nav items as bordered rows plus a full-width "Offerte aanvragen" button. Toggle state: `navOpen` boolean → the panel gets class `open`.
- **Hero → single column** (`grid-template-columns:1fr; gap:16px`). Because text is `order:1` and map `order:2`, the **text stays on top**, the **map drops below** (`justify-self:center; max-width:440px; margin:0 auto`). Text `max-width:660px`.
- **Ambient background recentres:** the glow moves to top-centre (`left:50%; transform:translateX(-50%); top:-10px; width:min(680px,118%); height:540px`) and the masked grid re-aims to `ellipse 96% 44% at 50% 26%`.
- **Diensten:** between 860–1000px the bento stays 2-wide; see below.

### ≤ 860px — Diensten stack
- Each Diensten card becomes full width: `.dGrid > a { grid-column: 1 / -1 }`.

### ≤ 900px / ≤ 560px — Footer
- Footer link grid: **2 columns** at ≤900px, **1 column** at ≤560px.

### ≤ 560px — phone
- Hero map shrinks to `max-width:320px`. H1 stays at its clamp floor (44px). Everything is single-column; the two marquees and the hamburger panel are unchanged.

**No horizontal overflow at any width** (verified). The root is `overflow:hidden`; all decorative glows fade to transparent before any hard edge.

---

## Global shell
- Page background `#0a0a0a`, text `#fff`, font stack `'Manrope', system-ui`. Headings use `'Sora'` (800/700).
- Accent (tweakable, default `#F28A10`) is exposed as CSS var `--vv-accent`; the hero/CTA gradients use `#FFA23A → #FF5A00`.
- Fonts: Google Fonts `Sora` (400–800) + `Manrope` (400–700).

## Header / navigation
Sticky (`position:sticky; top:0; z-index:30`), `padding:16px clamp(20px,4vw,48px)`, `background:rgba(10,10,10,.85); backdrop-filter:blur(12px)`, bottom hairline `rgba(255,255,255,.06)`. `display:flex; align-items:center; gap:18px; flex-wrap:wrap`.
- **Logo:** "Visual" + "Vibe" (Vibe in accent), Sora 800, 21px.
- **Links** (`.navLinks`): 7 items, 14px/600, `rgba(255,255,255,.72)`, hover → white on `rgba(255,255,255,.05)`.
- **CTA** (`.navCtaTop`): gradient `135deg,#FFA23A,#FF5A00`, `#0a0a0a` text, 700, `padding:10px 20px`, radius 11, shadow `0 8px 24px -10px rgba(255,117,0,.7)`, hover `translateY(-2px)`.
- **Burger** (`.navBurger`) + **panel** (`.navPanel`): see Responsive.

## Hero
Section `padding:40px clamp(20px,4vw,48px) 30px`, `position:relative`. Inner `max-width:1240px; margin:0 auto`.

**Ambient background (2 layers, `pointer-events:none; z-index:0`) — "ingewerkt", not stuck on:**
- **Glow** (`.heroGlow`): `radial-gradient(ellipse 52% 52% at 52% 42%, rgba(255,90,0,.17), rgba(255,90,0,.055) 44%, transparent 70%)`, `top:-90px; right:-30px; 780×660`.
- **Masked grid** (`.heroGridTex`): `inset:0`; `background-image` = two 1px white (`.032`) line gradients, `background-size:52px 52px`; **radially masked** `mask-image: radial-gradient(ellipse 58% 64% at 75% 33%, #000, rgba(0,0,0,.35) 46%, transparent 70%)` so the grid dissolves into the black around the map. (The map SVG carries **no** internal grid — that was removed; the grid is a page layer.)

**Text column (`.heroText`, `z-index:6`):**
- Breadcrumb "Regio / Vlaanderen", 13px, `rgba(255,255,255,.45)`.
- Eyebrow: accent line (22×1.5px) + "Werkgebied · België", 12px/700, `letter-spacing:.16em`, uppercase, accent.
- H1 "Vlaanderen": Sora 800, `clamp(44px,5.4vw,68px)`, `line-height:1.0`, `letter-spacing:-.03em`.
- Intro: 17px/1.55, `rgba(255,255,255,.62)`, `max-width:440px`.
- Buttons (`flex-wrap:wrap; gap:12px`): primary gradient (`Start je project` + arrow), secondary outline (`Bekijk realisaties`).

**Map column (`.heroMap`, `z-index:5`, `pointer-events:none`):** fluid SVG `viewBox="0 0 120 100"`, `width:100%; height:auto`. Belgian provinces as base paths (`fill rgba(255,255,255,.035)`, stroke `rgba(255,255,255,.15)`); Flanders provinces filled with `linearGradient #ff8a2a→#ff5a00` + soft `feGaussianBlur` glow, stroke `rgba(255,175,95,.95)`. A pulsing location marker (`regioPulse` 2.6s ring + `regioCore` 2.6s) sits at the data-driven `markers.vlaanderen`. Path + marker data come from `mapdata.js` (`belgium.provinces`, `belgium.flanders`, `belgium.markers`).

**Gemeente-marquee (`.heroPills`):** label "Actief in o.a." (11.5px/700, `.15em`, uppercase, `rgba(255,255,255,.4)`), then a full-width masked marquee (`.vv-mq`, edge fade-mask) of city chips scrolling left (`vv-mq-l`, 46s). Chips: pill, `border rgba(255,255,255,.1)`, accent 5px dot, 14px/600. Pausable on hover; respects `prefers-reduced-motion`. When the `pillsAnimatie` tweak is off, chips render as a static wrapped row instead.

## Diensten ("Alles voor je merk, onder één dak")
Section `padding:60px clamp(20px,4vw,48px) 28px`, inner `max-width:1240px`.
- **Header row** (`flex-wrap:wrap`, space-between): left = eyebrow "Onze diensten" + H2 (Sora 700, `clamp(26px,3vw,38px)`) + sub-paragraph; right = outline link "Bekijk alle diensten".
- **Bento** (`.dGrid`, `grid-template-columns:repeat(12,1fr); gap:16px`), 4 cards:
  - **01 Webdesign** (span 7, accent card), **02 SEO** (span 5, neutral), **03 Fotografie** (span 5, neutral), **04 Videografie** (span 7, accent). Accent cards: `border rgba(255,122,0,.22)` + `radial-gradient(140% 150% at 100% 0%, rgba(255,90,0,.09), transparent 58%)`. Neutral: `border rgba(255,255,255,.09)`, `background rgba(255,255,255,.02)`. `min-height:248px`, radius 20, `padding:28px 30px 26px`.
  - Each card: icon chip (54×54, radius 14) top-left + mono number top-right; H3 (Sora 700, 24/22px); description; footer row (`margin-top:auto`) of outline tag-pills (left) + a 40px circular arrow button (right).
  - **Ghost-glyph watermark** (`.dWm`): a big faint line-icon (`currentColor` at `rgba(255,122,0,.06)` / `rgba(255,255,255,.035)`) in the **centre-right band** (`bottom:92px; right:-20/-22px`), i.e. **above the footer**, so it never sits under the arrow. Keep ≥~24px clearance between glyph bottom and the arrow.
  - **Hover:** card lifts (`translateY(-8px)`) with an orange spinning **conic-gradient border** (`@property --vvA` + `vvSpin` 3.4s), the watermark drifts up-left & brightens (`rgba(255,122,0,.12)`), the chip and arrow warm to accent. All hover motion disabled under `prefers-reduced-motion`.
- **≤860px:** cards stack full-width.

## Sectoren
Section `padding:64px 0 0`. Header (eyebrow "Sectoren" + H2 + paragraph) in a `max-width:1240px` inner. Below it, **two full-bleed marquee rows**: row A scrolls left (`vv-mq-l`), row B right (`vv-mq-r`). Chips carry a 38px round icon (from `sector-symbols.js`, `#sector-{id}`) + label. Duplicated content per row for seamless looping; pause on hover; reduced-motion safe.

## Motion reference (keyframes)
- `regioPulse` (map ping) / `regioCore` (marker breathe): 2.6s.
- `vvMqL` / `vvMqR`: marquee translate 0 ↔ -50%; durations 46–58s.
- `vvSpin` (`--vvA` 0→360deg): 3.4s, drives the card conic border.
- Guard: `@media (prefers-reduced-motion: reduce)` disables marquees, card spin, and hover transitions.

## Tweakable props (data-props on the DC)
| Prop | Editor | Default | Effect |
|---|---|---|---|
| `achtergrond` | enum: Egaal donker · Subtiele gloed · Warm verloop | Subtiele gloed | Toggles the page ambient glow / warm top-bottom wash. |
| `accent` | color (swatches #F28A10 · #FF7500 · #FFA23A · #FF5A00) | #F28A10 | Sets `--vv-accent` across eyebrows, dots, marker, links. |
| `pillsAnimatie` | boolean | true | City chips scroll (marquee) vs. static wrapped row. |

Footer exposes its own `accent` + `animate` props.

## Data (in the logic class / to be sourced from CMS in prod)
- `navItems`: Diensten, Regio, Realisaties, Sectoren, Kennisbank, Over ons, Contact.
- `gemeentes`: Antwerpen, Gent, Brugge, Leuven, Hasselt, Mechelen, Aalst, Kortrijk, Roeselare, Sint-Niklaas, Genk, Oostende, Turnhout, Dendermonde.
- Diensten: 4 items (id, title, description, tags) — icons `d-website / d-seo / d-camera / d-film` (inline defs in the file).
- Sectoren: two rows of 7 chips — icons via `sector-symbols.js`.
- Map: `mapdata.js` → `belgium.provinces[].d`, `belgium.flanders[]`, `belgium.markers.vlaanderen`.

## Assets & dependencies
- `mapdata.js` — Belgium province path data + Flanders keys + marker coords.
- `sector-symbols.js` — sector icon `<symbol>` defs.
- `assets/logo-google.svg`, `logo-meta.svg`, `logo-leadinfo.svg` — footer partner logos.
- Google Fonts: Sora, Manrope.
