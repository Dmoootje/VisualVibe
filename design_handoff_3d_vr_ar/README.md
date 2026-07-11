# Handoff: VisualVibe — Dienst & Realisaties "3D, VR & AR"

## Overview
Two connected pages for the VisualVibe site (creative media agency, Limburg BE):

1. **Diensten – 3D, VR & AR** — a service page with an immersive, "VR-like" 3D hero, a services overview, a prominent video showreel section (opens in a lightbox), and the **two most recent Matterport virtual tours embedded live** in-page (click to activate). Links out to the realisaties page.
2. **Realisaties – 3D, VR & AR** — a "basic" portfolio page showing **all five** Matterport tours as cards; clicking a card opens the live, navigable 360° tour in a lightbox with previous/next.

Both share the VisualVibe visual language (dark UI, orange accent, Sora / Manrope / JetBrains Mono).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the intended look and behavior, **not** production code to copy verbatim. They are authored as "Design Components" (a lightweight in-house HTML+JS runtime via `support.js`). The task is to **recreate these designs in the target codebase's existing environment** (the VisualVibe site — React/Next, Vue, etc.) using its established components, tokens, and patterns. If no environment exists yet, pick the most appropriate framework and implement there. Do not ship the HTML prototypes directly.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all specified. Recreate the UI pixel-perfectly using the codebase's existing libraries and patterns. The one deliberately "productiony" part is the Matterport `<iframe>` embed and the YouTube embed — those are real and can be reused as-is.

---

## Screens / Views

### 1) Diensten – 3D, VR & AR (`Diensten - 3D VR AR.dc.html`)

Page container: `max-width:1440px`, centered, `background:#0a0a0a`, `color:#fff`, `font-family:'Manrope'`. A soft radial orange glow sits top-right (`radial-gradient(circle, rgba(255,90,0,.14), transparent 66%)`, 760×760, `top:-140px; right:-160px`).

**Nav** (shared across both pages)
- Flex row, `padding:22px 56px`, bottom border `1px solid rgba(255,255,255,.06)`.
- Left: wordmark "Visual" (white) + "Vibe" (`#FF7A00`), Sora 800, 24px.
- Center links (Manrope 600, 15px, `rgba(255,255,255,.85)`): home icon, Diensten ▾ (active on diensten page — white + orange chevron), Regio ▾, Realisaties ▾ (active on realisaties page), Sectoren ▾, Kennisbank ▾, Over ons, Contact. Gap 28px.
- Right: user icon + "Offerte aanvragen" button — `padding:11px 20px; border-radius:10px; background:linear-gradient(90deg,#FF3B2E,#FF7A00); box-shadow:0 12px 30px -12px rgba(255,90,0,.8)`.
- Below ~1000px the center links + user cluster hide and a burger button (`44×44`, `border-radius:11px`, `1px solid rgba(255,255,255,.12)`) toggles a stacked mobile panel.

**Hero** (`grid-template-columns:1fr 600px; gap:48px; padding:52px 56px 46px; max-width:1300px`)
- Left column:
  - Breadcrumb (JetBrains Mono 12px): "Diensten / **3D, VR & AR**" (last segment `#FF9A45`).
  - Eyebrow pill: "Immersieve ervaringen" — `padding:8px 15px; border-radius:9999px; background:rgba(255,122,0,.1); border:1px solid rgba(255,122,0,.25); color:#FF9A45; JetBrains Mono 700 12px; letter-spacing:.08em; text-transform:uppercase`; leading 7px orange dot with pulsing box-shadow ring.
  - H1 "3D, VR & AR" — Sora 800, 62px, line-height 1.02, letter-spacing −.03em.
  - Paragraph — 19px, `line-height:1.6; color:rgba(255,255,255,.65); max-width:520px`: *"Stap letterlijk in je project. VisualVibe maakt 3D-visualisaties, navigeerbare virtual tours en AR-ervaringen die je klant laten rondlopen door een ruimte die er nog niet — of niet meer — is."*
  - Buttons: primary "Offerte aanvragen" (gradient `#FF3B2E→#FF7A00`, arrow slides right on hover) + secondary "Bekijk virtual tours" (anchors to `#xr-tours`, `background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.14)`). Both `padding:15px 28px; border-radius:12px; font-weight:700; font-size:16px`.
- Right column — **the immersive 3D stage** (see "3D hero stage" below).

**3D hero stage** (`600×472` wrapper)
- A blurred conic-gradient halo rotates slowly behind (`animation:vvSpin 26s linear`).
- A `.xrStage` with CSS `perspective` and a `.xrWorld` (`transform-style:preserve-3d`) that rotates on mouse move. Depth and intensity are driven by a **mode** (see State/Tweaks). Elements inside, each on its own Z plane:
  - **Floor grid**: two crossed linear-gradients (`rgba(255,122,0,.5) 1px lines`, `background-size:52px 52px`), `rotateX(74deg)`, radial mask, `animation:gridFlow 3.4s linear` (scrolls toward viewer). Opacity varies by mode.
  - **Center — virtual-tour viewport** (`400px`, `translateZ(40px)`): gradient-border card, `aspect-ratio:4/3`, containing a drop-in image slot, a spinning reticle (`retSpin 9s`), corner brackets, top-left "VIRTUAL TOUR" pill w/ pulsing dot, top-right "360°" (green `#5ac47d`), bottom "DOLLHOUSE · FLOORPLAN" / "WebGL 60 FPS", and a vertical scanline (`scanY 4.4s`).
  - **Left — 3D wireframe cube panel** (`132×150`, `translateZ(120px)`, `floatB 6s`): a real CSS 3D cube (six bordered faces, `cubeSpin 11s`), labels "3D · RENDER" and "POLY 128k".
  - **Right — AR phone panel** (`118×186`, `translateZ(150px)`, `floatA 5.2s`): phone mock with a floating gradient cube + soft shadow, AR reticle brackets, "AR PLACEMENT" label, capture ring.
  - **VR-ready chip** (bottom-left, `translateZ(190px)`) — only visible in "vol" mode.
  - **Matterport chip** (top-right, outside the rotating world so it stays readable): tour icon + "Matterport / gecertificeerd".

**Diensten overzicht** (`max-width:1300px; padding:20px 56px`)
- H2 "3D, VR & AR diensten overzicht" (Sora 800, 34px).
- 2-column grid (`gap:14px`) of rows. Each row: `padding:20px 22px; border-radius:14px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.02)`. Icon tile (38×38, orange-tinted) + title (Sora 700, 16px) + description (13.5px, `rgba(255,255,255,.55)`) + right arrow. Hover: border → `rgba(255,122,0,.32)`, bg → `rgba(255,122,0,.04)`, `translateX(4px)`, arrow slides + turns `#FF9A45`.
- The four items (icon · title · description):
  - cube · **3D-visualisatie** · "Fotorealistische 3D-renders van een ruimte, product of ontwerp — nog voor het bestaat."
  - tour · **Virtual tours (Matterport)** · "Navigeerbare 360°-tours waarin je klant zelf door de ruimte wandelt."
  - ar · **AR-ervaringen** · "Plaats een 3D-object via augmented reality live in de echte omgeving."
  - config · **Productconfigurators** · "Interactieve 3D-configurator waarin klanten materialen en opties kiezen."

**Video section** (`padding:44px 56px 30px`)
- Head row: eyebrow "In beeld" (JetBrains Mono, `.16em`, `#FF9A45`) + H2 "Zie hoe immersief werkt" (Sora 800, 38px); helper line right: *"Van scan tot navigeerbare tour — bekijk het proces en resultaat in bewegend beeld."*
- Big clickable card, `aspect-ratio:21/9; border-radius:22px; border:1px solid rgba(255,122,0,.2)`. YouTube thumbnail (`https://img.youtube.com/vi/wGjOGVpZunI/maxresdefault.jpg`) with radial vignette, corner brackets, top-left "3D · VR · AR SHOWREEL" pill, a 78px gradient play button (scales on hover), bottom title "VisualVibe — 3D, VR & AR in de praktijk". Click → **video lightbox** (see Interactions).

**Matterport tours — last 2, live** (`id="xr-tours"`, `padding:36px 56px 40px`)
- Head row: eyebrow "Recente realisaties" + H2 "Navigeerbare virtual tours"; right: "Bekijk alle realisaties" button → links to the realisaties page.
- 2-column grid (`gap:18px`) of two tour cards. Each card `border-radius:20px; border:1px solid rgba(255,255,255,.09); background:#0e0d0c`:
  - Poster area (`aspect-ratio:16/10`, radial orange gradient) shown until activated: corner brackets, top-left "MATTERPORT · 360°" pill, centered 66px gradient circle (tour icon, scales on hover) + "START 3D-TOUR" label.
  - On click, the poster is replaced by a live Matterport `<iframe>` (see Assets).
  - Footer strip: title (Sora 700, 18px) + location (13px) + "LIVE" pill with pulsing dot.
- The two shown here are the **last two** of the five projects: *Vastgoed showcase* (Tongeren) and *Bedrijfspand rondleiding* (Bilzen).

**Hoe we werken** (`padding:24px 56px`)
- H2 "Hoe we werken". 4-column grid (`gap:16px`) of step cards (`min-height:190px; border-radius:16px`). Giant ghost number top-right (`rgba(255,255,255,.04)`), a 42px gradient number badge, title (Sora 700, 17px), description. Hover lifts + orange tint.
- Steps: 01 **Scan & briefing** · 02 **Modelleren** · 03 **Afwerking** · 04 **Publicatie** (copy in the file).

**Gerelateerde diensten** — H2 + chip row: Fotografie, Videografie, Drone & FPV. Chip: `padding:13px 20px; border-radius:12px; border:1px solid rgba(255,255,255,.1)`, icon tile + label; hover orange.

**CTA** — rounded panel `border-radius:24px; border:1px solid rgba(255,122,0,.25)`, radial orange bg, `padding:52px 56px`. H3 "Klaar voor een immersieve ervaring?" + paragraph + gradient "Offerte aanvragen" button.

**Footer** (shared) — 2px orange center-fade top rule; 3-column grid `1.6fr 1fr 1fr; gap:48px`: brand + description + social icons (Instagram/LinkedIn/YouTube, 40px tiles, hover orange lift); "Diensten" list (Webdesign, SEO, Fotografie, Videografie, Drone & FPV, 3D VR & AR, Podcasting); "Bedrijf" list (Over ons, Realisaties, Kennisbank, Sectoren, Contact). Bottom bar: "© 2026 VisualVibe…" + Privacybeleid / Algemene voorwaarden / Cookiebeleid.

### 2) Realisaties – 3D, VR & AR (`Realisaties - 3D VR AR.dc.html`)

Same nav + footer. Then:

**Header** (`padding:52px 56px 30px`)
- Breadcrumb "Realisaties / **3D, VR & AR**", eyebrow pill "Navigeerbare virtual tours", H1 "Virtual tours & 3D-realisaties" (Sora 800, 58px), paragraph *"Wandel zelf door onze projecten. Elke tour is een live, navigeerbare 3D-scan — klik en verken de ruimte in 360°."*
- Right: two stat tiles — "**5** TOURS" and "**360°** MATTERPORT".

**Grid** (`padding:16px 56px 70px`)
- 3-column grid (`gap:18px`) of five tour cards (`tCard`). Each has a **CSS-built poster** (`aspect-ratio:4/3`): fine orange grid (`background-size:34px`, radial-masked), corner brackets, "MATTERPORT" pill + "360°", centered 60px gradient play circle (tour icon), scanline. Footer: title (Sora 700, 16.5px) + pin-icon location (12.5px) + "LIVE" pill.
- Cards animate in on load (`rowIn`, staggered `--i * .09s`). Hover lifts `−7px` + orange border/shadow, poster scales.
- Click any card → **Matterport lightbox** (see Interactions).

**CTA** — H3 "Ook jouw ruimte in 3D?" + "Naar de dienst" button linking back to `Diensten - 3D VR AR.dc.html`.

---

## Interactions & Behavior

- **Mouse-driven 3D hero (diensten):** on `mousemove`, the normalized cursor offset sets `--rx`/`--ry` on `.xrWorld` (`rotateX`/`rotateY`), multiplied by the current mode factor. `transition:transform .18s ease-out` for smoothing. Respect `prefers-reduced-motion` (all animations disabled).
- **Video lightbox (diensten):** clicking the showreel card sets `lbOpen`. Fixed overlay `z-index:90`, blurred dark backdrop (click to close), centered card `width:min(1080px,100%)`; YouTube iframe (`autoplay=1&rel=0&modestbranding=1`), `aspect-ratio:16/9`, `max-height:70vh`. Close button rotates 90° on hover. `Esc` closes. Backdrop click closes; inner click stops propagation.
- **Live tour activation (diensten):** each of the two tour cards starts as a poster; click sets that tour's id `true` in `activeTours` and swaps in the Matterport iframe inline. (Deliberate click-to-load so the page doesn't boot two heavy embeds at once.)
- **Matterport lightbox (realisaties):** clicking a card sets `lbOpen` + `idx`. Overlay shows the live tour iframe (`key=id` so it remounts per project), title, location, a counter "n / 5", and Prev/Next buttons. Keyboard: `←`/`→` navigate, `Esc` closes.
- **Hover states:** documented per component above (rows, chips, step cards, social, arrows, play buttons).
- **Responsive:** hero collapses to one column < 1000px (visual below copy); grids collapse (overzicht/steps → 1 col; tours → 1 col; realisaties grid → 2 then 1 col); nav → burger; footer → 1 col.

## State Management
Diensten page:
- `navOpen: boolean` — mobile nav panel.
- `lbOpen: boolean` — video lightbox.
- `activeTours: { [matterportId]: true }` — which inline tours are live.
- `vrMode: 'subtle' | 'immersief' | 'vol'` — a **prop/tweak** controlling hero depth. Mapping: `subtle → perspective 1900px, grid opacity .24, rotation ×.4`; `immersief → 1200px, .5, ×1`; `vol → 820px, .8, ×1.7` (and shows the extra HUD: nav dots + VR-ready chip). **Default: `vol`.**

Realisaties page:
- `navOpen: boolean`.
- `lbOpen: boolean`, `idx: number` — current tour in the lightbox.

## Design Tokens
- **Colors:** background `#0a0a0a`; panel bg `rgba(255,255,255,.02)`; deep panel `#0e0d0c` / `#100e0d`; borders `rgba(255,255,255,.06–.14)`; primary orange `#FF7A00`; light orange (text/icons) `#FF9A45`; gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)` (buttons) and `135deg` (badges/play); accent glows `rgba(255,90,0,.1–.18)`; success green `#5ac47d`; danger red dot `#FF3B2E`; text `#fff` / `rgba(255,255,255,.65)` / `.55` / `.5` / `.45`.
- **Radii:** pills `9999px`; buttons/inputs `10–12px`; cards `14–24px`; icon tiles `8–12px`.
- **Type scale:** H1 58–62px, H2 34–38px, H3 32–34px, body 15–19px, meta/eyebrow 10–13px. Fonts: **Sora** 600/700/800 (headings/wordmark), **Manrope** 400–800 (body/UI), **JetBrains Mono** 500/700 (eyebrows, HUD, counters).
- **Shadows:** button `0 16px 40px -14px rgba(255,90,0,.85)`; card hover `0 30–34px 64–70px -30px rgba(255,90,0,.5)`.
- **Motion:** `livePulse 2.2s`, `vvSpin 26s`, `gridFlow 3.4s`, `retSpin 9s`, `scanY 4.4s`, `cubeSpin 11s`, `floatA/B 5.2/6s`, lightbox `lbPop .42s cubic-bezier(.2,.75,.2,1)`, world tilt `.18s ease-out`.

## Assets
- **YouTube showreel:** id `wGjOGVpZunI`. Thumbnail `https://img.youtube.com/vi/wGjOGVpZunI/maxresdefault.jpg`; embed `https://www.youtube.com/embed/wGjOGVpZunI`.
- **Matterport tours** (embed `https://my.matterport.com/show/?m=<ID>&play=1&brand=0&qs=1`), in order — the **last two** appear on the diensten page, all five on realisaties:
  1. `1QM1FPCWyXz` — Woningtour — interieur — Hasselt · Limburg
  2. `s8BLfFaL56w` — Kantoorruimte 3D-tour — Genk · Limburg
  3. `Xpj4W69LRoj` — Handelspand virtual tour — Sint-Truiden · Limburg
  4. `V9Y5e8g3oAW` — Vastgoed showcase — Tongeren · Limburg *(shown on diensten)*
  5. `mN2REF7dqjv` — Bedrijfspand rondleiding — Bilzen · Limburg *(shown on diensten)*
  > ⚠️ Project **titles and locations are placeholders** — replace with the real project names/locations. IDs are final. Matterport iframes need `allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen; autoplay"` and `allowfullscreen`.
- **Icons:** inline SVG (Lucide-style, 24×24, `stroke:currentColor`), defined once in an SVG `<defs>` block (`xr-home`, `xr-user`, `xr-cube`, `xr-vr`, `xr-ar`, `xr-tour`, `xr-layers`, `xr-scan`, `xr-cal`, `xr-video`, `xr-foto`, `xr-config`, `xr-pin`). No image icon assets.
- **Hero tour still:** a drop-in image placeholder (`image-slot.js`) — supply a real interior/tour still in production.

## Files
- `Diensten - 3D VR AR.dc.html` — the service page (template + logic).
- `Realisaties - 3D VR AR.dc.html` — the realisaties page (template + logic).
- `image-slot.js` — the drag-and-drop image placeholder web component used by the hero.
- `support.js` — the in-house Design-Component runtime (reference only; not needed in the target codebase).

The `.dc.html` files are self-contained: markup between `<x-dc>…</x-dc>`, a `class Component extends DCLogic { renderVals() { … } }` logic block, and a `data-props` JSON declaring the `vrMode` tweak.
