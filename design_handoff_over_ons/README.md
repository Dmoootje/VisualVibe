# Handoff: Over ons — VisualVibe

## Overview
A redesigned **"Over ons" (About) page** for VisualVibe, a creative media agency in Limburg (BE). It introduces the agency and its founder (Jens Hardy), showcases the drone/aerial photography work, lists the seven service disciplines, states the core values, and drives to an "Offerte aanvragen" (request a quote) CTA. Dark theme with orange accents; one white, gold-bordered accent card cross-promotes the sister brand WeddingVibe (wedding photography).

## About the Design Files
The files in this bundle are **design references authored in HTML** (a "Design Component" prototype that renders through a small runtime, `support.js`). They demonstrate the intended look, layout, copy and micro-interactions — they are **not** production code to ship as-is.

The task is to **recreate this design in the target codebase's existing environment** (React, Vue, Astro, WordPress/PHP theme, etc.) using its established components, tokens and patterns. If no front-end environment exists yet, pick the most appropriate framework for the project and implement there. Treat `support.js` and the `<x-dc>` / `{{ }}` / `<sc-for>` template syntax as prototype scaffolding — reproduce the *output*, not the runtime.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, imagery treatment and interactions are all specified below and in the HTML. Recreate the UI pixel-perfectly with the codebase's own libraries. The canvas is designed at **1440px** content width (inner content max **1300px**, side padding **56px**). Add responsive breakpoints per the target app's conventions (notes included per section).

---

## Design Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| Background | `#0a0a0a` | Page + footer background |
| Surface | `rgba(255,255,255,.02)` | Card/tile fills |
| Surface hover | `rgba(255,122,0,.05)` | Card hover fill |
| Hairline | `rgba(255,255,255,.08)` | Card/section borders, dividers |
| Text primary | `#ffffff` | Headings |
| Text 68 / 62 / 55 / 52 / 45 | `rgba(255,255,255,.68 / .62 / .55 / .52 / .45)` | Body copy tiers (descending emphasis) |
| Accent (primary) | `#FF7A00` | Orange accent, "Vibe", dots, icons |
| Accent gradient | `linear-gradient(90deg,#FF3B2E,#FF7A00)` | Primary buttons, icon chips |
| Accent light | `#FF9A45` | Icon strokes, mono eyebrow labels |
| Accent deep | `#FF5A00` | Glow/shadow color |
| Accent tint bg | `rgba(255,122,0,.10)` | Icon-chip fills |
| Accent tint border | `rgba(255,122,0,.24)` | Icon-chip borders |
| Gold gradient | `#d2ac47 → #eddc78 → #d2ac47` | WeddingVibe "Wedding" wordmark |
| Gold ring sweep | `#8A6D2B, #F4E3B0, #C9A24B, #FFF6DA, #B8860B` | Animated gold border (conic) |
| Gold solid | `#C9A24B` / `#B8860B` / `#EED89A` | Wedding accents, arrow chip |
| Wedding card bg | `#FFFFFF` | White interior of the WeddingVibe card |
| Secret card bg | `radial-gradient(120% 85% at 50% 24%,rgba(72,46,108,.6),transparent 62%), linear-gradient(180deg,#151019,#0b0a0e)` | "Secret" twilight card |

### Typography
- **Sora** — headings/wordmark. Weights 700, 800. Google Fonts.
- **Manrope** — body/UI. Weights 400–800. Google Fonts. (Default `font-family` on the page.)
- **JetBrains Mono** — eyebrow labels, tags, small meta. Weights 500, 700. Uppercase, letter-spacing `.06–.18em`.
- **Cormorant Garamond** — elegant serif, used **only** in the WeddingVibe card title. Weights 500–700 (+ italic 500).

Key sizes (px): H1 hero 64/1.0, section H2 38–40/1.06, card title (Sora 700) 17–25, body 15–19/1.6, quote 22/1.55, mono eyebrow 11.5 (letter-spacing .14em, uppercase), fact number (Sora 800) 30. Headings use `letter-spacing:-.02 to -.03em` and `text-wrap:balance`; body uses `text-wrap:pretty`.

### Radius
Pills `9999px` · discipline/value/nav cards `10–18px` · Jens card `28px` · secret card `18px` · gallery tiles `18–20px` · wedding card `16px` · CTA band `24px`.

### Shadows / glows
- Primary button: `0 16px 40px -14px rgba(255,90,0,.85)`
- Jens portrait card: `0 46px 100px -32px rgba(255,90,0,.5), inset 0 0 0 1px rgba(255,255,255,.04)`
- Discipline card hover: `0 28px 64px -22px rgba(255,90,0,.6), 0 8px 22px -14px rgba(0,0,0,.7)`
- Gallery tile hover: `0 30px 70px -30px rgba(255,90,0,.4)`
- Wedding card: `0 18px 42px -20px rgba(201,162,75,.6)`; hover `0 24px 52px -18px rgba(201,162,75,.8)`

### Motion
- Standard ease: `cubic-bezier(.2,.7,.2,1)`; transitions ~.3–.45s.
- Continuous: ring spin (`spin` 34s/46s), conic glow (20s), gold border sweep (`wedSpin` 6s), discipline conic border on hover (`vvSpinBorder` 3.4s), region marquee (`mqL` 46s), chip float (6s), glow breathe (7s), question-mark wobble (`qwob` 3.4s, only when not hovered).
- **All animation is disabled under `@media (prefers-reduced-motion: reduce)`** — preserve this.

---

## Screens / Sections
Single scrolling page, top → bottom.

### 1. Top navigation
- Full-width bar, `padding:22px 56px`, bottom hairline. Left: **Visual**Vibe wordmark (Sora 800, 24px; "Vibe" in `#FF7A00`). Center: home icon + links (Diensten ▾, Regio ▾, Realisaties, Sectoren, Kennisbank, **Over ons** [active — white with a 5px orange dot], Contact), Manrope 600 15px, `rgba(255,255,255,.85)`, hover → white. Right: user icon + **Offerte aanvragen** button (accent gradient, radius 10, `11px 20px`).

### 2. Hero
- Two columns `grid-template-columns:1.05fr .95fr; gap:56px`. Background: radial orange glow top-right + faint 54px grid masked to a radial.
- **Left:** pill badge (mono, uppercase, orange tint, pulsing dot) "Het gezicht achter VisualVibe" → **H1** "Over **VisualVibe**" (Sora 800, 64px; "VisualVibe" orange) → intro paragraph (19px, `.68`) → secondary line (16.5px, `.55`) → two buttons: **Laten we kennismaken** (accent gradient, arrow that slides on hover) and **Bekijk realisaties** (ghost, `rgba(255,255,255,.05)` + hairline).
- **Right visual:** centered cluster over a rotating conic glow + two dashed SVG rings.
  - **Jens card** — `368×492`, radius 28, hairline orange border. Fills with the founder portrait (see Assets). Bottom gradient scrim; top-left mono pill "IN BEELD" with pulsing dot; bottom label "Jens Hardy" (Sora 700, 25px) + "Fotograaf · Cameraman · Marketeer" (mono 12px, `#FF9A45`).
  - **Secret card** — small `134×178`, **absolutely positioned overlapping the bottom-right corner** (`right:-26px; bottom:-24px`), radius 18, **dashed** gold-orange border, twilight purple/dark gradient bg. Contains: a faint person **silhouette** SVG, a big orange **"?"** (Sora 800, 58px), a hidden **smiley** SVG, a small lock icon top-right, bottom label "???" (Sora 800, 14px, letter-spacing .16em) + "Secret webdesigner" (mono 8px, `#FF9A45`). Interaction below.
- **Fact strip:** 4-col row under a top hairline: `Sinds 2020 / Creatief mediabureau in Limburg` · `7 disciplines / Onder één dak` · `1 aanspreekpunt / Van idee tot oplevering` · `3 partners / Google · Meta · Leadinfo`. Big number Sora 800 30px, label 14px `.55`.

### 3. Founder story
- Two columns `.42fr .58fr; gap:56px`.
- **Left:** mono eyebrow "Ontmoet Jens Hardy" → **H2** "Eén gezicht, van eerste idee tot oplevering" (Sora 800, 40px) → **role badges** (flex-wrap, gap 9px) each a pill (orange tint border/bg, orange dot, Manrope 600 13.5px): **Fotograaf, Cameraman, Marketeer, Dronepiloot, Webdesigner, Adviseur** (hover: brighter border/bg, lift 2px) → **WeddingVibe CTA card** (see §4 note below).
- **Right:** oversized orange opening quote glyph, then the founder statement (22px, weight 600, white) + two supporting paragraphs (16.5px, `.62`) + signature "Jens Hardy" (Sora 700 italic 20px, `.85`).

#### WeddingVibe cross-promo card (inside the founder left column)
- Inline-flex, **white background** (`#FFFFFF`), radius 16, `overflow:hidden`, gold drop shadow. **Animated gold border** via a rotating conic `::before` (2px, `wedSpin` 6s linear infinite). `dofollow` link, opens `https://weddingvibe.be/` in a new tab.
- Contents (all `z-index:1` above the border): **WeddingVibe logo** (`assets/weddingvibe.svg`, height 34px — "Wedding" in the gold gradient, "Vibe" in near-black `#111`) → thin vertical gold divider → text block: mono eyebrow "OOK VOOR JE MOOISTE DAG" (`#B8860B`, letter-spacing .18em) + title "Huwelijks- & bruidsfotografie" (**Cormorant Garamond** 600, 23px, `#2A2320`) → circular gold arrow button (36px, `linear-gradient(135deg,#EED89A,#C9A24B)`, white arrow that slides on hover).

### 4. Photo showcase — "Achter de lens"
- Header row: mono eyebrow "Achter de lens" + **H2** "Beeld dat vanuit de lucht vertelt" (left) and a supporting line (right).
- **Bento grid:** `grid-template-columns:repeat(4,1fr); grid-auto-rows:230px; gap:16px`. Six tiles (each: image fill in a `.gimg` wrapper, bottom gradient scrim, label; some have a mono tag pill). **Hover:** image `scale(1.07)` over .8s, border → `rgba(255,122,0,.45)`, tile glow shadow.
  1. **Drone · Nacht** — `col 1/span 2, row 1/span 2` (large). Title "Nachtfotografie vanuit de lucht" + sub. Tag "DRONE · NACHT".
  2. **Drone & FPV** — `col 3/span 2, row 1`. "De Alpen vanuit de lucht". Tag "DRONE & FPV".
  3. `col 3, row 2` — "Bedrijfsfotografie".
  4. `col 4, row 2` — "Bedrijfsbeeld op locatie".
  5. `col 1/span 2, row 3` — "Luchtfoto van je woonplaats".
  6. `col 3/span 2, row 3` — "Inspectie van zonnepanelen".

### 5. Disciplines — "Alles onder één dak"
- Header: mono eyebrow + **H2** "Zeven disciplines, één aanspreekpunt" + supporting line.
- Grid `repeat(4,1fr); gap:16px`. **7 discipline cards** + **1 CTA tile** (8 total → 4×2).
- **Discipline card** (class `svcCard`): radius 16, hairline border, surface fill, `padding:22px 22px 24px`. A large **watermark icon** (150×150, `rgba(255,122,0,.055)`) bleeds off the **bottom-right**; top-left a 46px orange-tint icon chip; then title (Sora 700, 17px) + description (13.5px, `.52`).
  - **Hover:** lift `translateY(-7px) scale(1.014)`, border/bg → orange tint, glow shadow, watermark brightens to `rgba(255,122,0,.12)` and nudges, **and a gold/orange conic gradient border traces the card** (`::before`, `vvSpinBorder` 3.4s).
  - Items (id → name → desc): `website` Webdesign "Snelle websites & webshops die bezoekers omzetten in klanten." · `seo` SEO "Vindbaar in Google én de nieuwe AI-zoekmachines." · `foto` Fotografie "Professionele bedrijfs- en productfotografie." · `video` Videografie "Pakkende bedrijfsvideo die jouw verhaal vertelt." · `drone` Drone & FPV "Luchtbeelden en dynamische FPV-shots." · `cube` 3D, VR & AR "Immersieve 3D-, VR- en AR-ervaringen." · `mic` Podcasting "Van opname tot afgewerkte podcast."
- **CTA tile:** accent-tinted (`radial-gradient(...rgba(255,90,0,.16)...)`), gradient arrow chip, "Ontdek alle diensten" + "Bekijk wat we voor jouw KMO kunnen betekenen."

### 6. Values
- Grid `repeat(3,1fr); gap:16px`. Three cards (radius 18, `padding:30px 26px`), each icon chip + title (Sora 700, 20px) + body (15px, `.58`); hover lifts + brightens.
  1. `Alles onder één dak` — "Webdesign, SEO, fotografie, videografie, drone, 3D/VR/AR en podcasting bij één partner. Geen schakelen tussen losse bureaus."
  2. `Lokaal verankerd` — "Vanuit Limburg werken we voor KMO's in Vlaanderen, Antwerpen en Nederlands-Limburg — dichtbij en betrokken."
  3. `Van kennismaking tot oplevering` — "We denken mee vanaf de eerste kennismaking en blijven betrokken tot het project live staat."

### 7. Region marquee
- Centered mono line "Voor KMO's in Limburg, Vlaanderen, Antwerpen & Nederlands-Limburg" above a single left-scrolling **marquee** of pin-icon pills: Hasselt, Tongeren, Bilzen, Borgloon, Genk, Sint-Truiden, Antwerpen, Maastricht, Vlaanderen, Nederlands-Limburg (list duplicated for a seamless loop; masked edges; pauses on hover).

### 8. CTA band
- Rounded panel (radius 24, orange-tint border, radial orange glow + faint grid). Left: **H3** "Laten we kennismaken" (Sora 800, 34px) + line "Vertel kort over je project — je krijgt snel een helder voorstel, rechtstreeks van Jens." Right: **Offerte aanvragen** button (accent gradient, sliding arrow).

### 9. Footer
- Top gold-less orange hairline gradient. 3 columns (`1.6fr 1fr 1fr`): brand block (wordmark, blurb, email `jens@visualvibe.be`, phone `+32 472 96 45 99`, location "Tongeren – Borgloon & Bilzen – Hoeselt, Limburg", social icons FB/IG/LI/YT) + **Diensten** list + **Bedrijf** list. Bottom bar: "© 2026 VisualVibe. Alle rechten voorbehouden. · BTW BE1014 755 897" + legal links (Privacybeleid, Algemene voorwaarden, Cookiebeleid).

---

## Interactions & Behavior
- **Secret card (hero):** idle — the "?" group gently wobbles (`qwob`, only while not hovered). **On hover:** the "?" rotates 360° and scales/fades out while a **smiley** SVG fades/scales in; the twilight glow brightens, the silhouette lifts, border → brighter gold-orange. (Playful "reveal" — the founder is the still-secret webdesigner.)
- **Discipline cards:** hover lift + glow + brightening watermark + tracing conic border (see §5).
- **Gallery tiles:** hover image zoom (scale 1.07) + border/glow.
- **WeddingVibe card:** continuously animated gold conic border; hover lift + stronger gold glow + arrow slide.
- **Buttons / pills / social / nav / role badges / marquee:** hover states as noted (lifts, arrow slides, color shifts; marquee pauses on hover).
- **Links:** default `a` color inherits; `a:hover` → `#FF7A00`. The WeddingVibe link is **dofollow**, `target="_blank"`.
- **Responsive:** at ≤ ~900px collapse the two-column hero and founder rows to single column; reduce the bento to 2 columns then 1; wrap the discipline/value grids; keep 44px min touch targets. (Prototype is fixed at 1440 — apply the app's breakpoints.)

## State Management
Minimal — this is a mostly static marketing page. The prototype exposes two tweakable props you can mirror as theme options or drop entirely:
- `accent` (color, default `#FF7A00` in code; the user set `#FF5A00`) — accent hue.
- `animate` (boolean, default true) — master switch for the continuous animations (maps to the `vv-anim` class gating every loop; respect `prefers-reduced-motion` regardless).
Interactive states are all CSS hover/animation; no data fetching beyond loading the images.

## Assets
- **`assets/weddingvibe.svg`** — WeddingVibe wordmark, **included in this bundle**. Recolored for a light background: `.cls-2` ("Wedding") = gold `linear-gradient` (`#d2ac47/#eddc78/#d2ac47`), `.cls-1` ("Vibe") = `#111111`. Keep both fills when porting.
- **Founder portrait & drone photos** — currently loaded from client-hosted URLs (Firebase) and shown through drop-in `<image-slot>` placeholders (ids `ov-portrait`, `ov-g1…ov-g6`) so they persist/replace in the prototype. In production, wire these to the CMS/media library. Source URLs used:
  - Portrait: `…/Fotografie - Jens Hardy fotograaf Limburg.webp`
  - `ov-g1` Drone nacht: `…/Drone Nacht fotografie.webp`
  - `ov-g2` Alpen: `…/Alpen-drone-fotos-scaled.webp`
  - `ov-g3` Bedrijfsfoto drone: `…/Bedrijfssfotos-drone.webp`
  - `ov-g4` Bedrijfsfoto met drone: `…/Bedrijfssfotos-met-drone.webp`
  - `ov-g5` Woonplaats luchtfoto: `…/Drone woonplaats luchtfoto.webp`
  - `ov-g6` Zonnepanelen: `…/Drone-zonnepanelen.webp`
  (All on `firebasestorage.googleapis.com/v0/b/gen-lang-client-0235296023/o/images%2Fportfolio%2F…`. Replace with the client's own hosted copies.)
- **Icons** — all inline SVG (nav, disciplines, checks, pin, lock, social, arrows). No icon font. Swap for the codebase's icon set, matching stroke weight (~1.7–2) and rounded caps/joins.
- **Fonts** — Google Fonts: Sora, Manrope, JetBrains Mono, Cormorant Garamond.

## Files
- `Over ons.dc.html` — the full page prototype (open in a browser to view; read for exact inline values).
- `assets/weddingvibe.svg` — the recolored WeddingVibe logo.
- `image-slot.js` — the prototype's drop-target image placeholder component (prototype-only; replace with real `<img>`/media fields).
- `support.js` — the prototype runtime (render-only; **not** for porting).
