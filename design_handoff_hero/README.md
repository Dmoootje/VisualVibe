# Handoff: VisualVibe — Homepage Hero (animated)

## Overview
The homepage hero for **VisualVibe**, a creative media agency for KMOs in Limburg. It's a two-column hero: a fixed marketing message on the left and, on the right, a **living "stage"** inside a glowing orange frame that continuously cycles through the agency's six disciplines (Webdesign, Fotografie, Videografie, Drone, 3D/VR/AR, Podcasting), each rendered as its own bespoke, always-on animation. The site's top navigation bar is **not** part of this handoff — implement it separately.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look, motion, and behavior. They are **not production code to copy directly**. The task is to **recreate this design in your target codebase's existing environment** (React, Vue, Svelte, etc.) using its established components, tokens, and patterns. If no front-end environment exists yet, pick the most appropriate framework for the project and implement it there.

`Hero (zonder header).dc.html` uses a small in-house runtime (`support.js`) only so the prototype renders standalone — you do **not** need to reproduce that runtime. Everything visual is plain HTML + inline styles + CSS `@keyframes`; the only JavaScript that matters is a tiny helper that generates randomized inline styles for decorative particles and the audio-visualizer bars (see **State / Logic**). All of it is trivial to port.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, layout, and motion. Recreate pixel-perfectly using your codebase's libraries. Exact values are documented below.

## Canvas & Responsiveness
- The prototype is authored at a fixed design width of **1440 px**, hero min-height **860 px**, on background `#080808`.
- Layout is a CSS grid: **left column `1fr` + right column fixed `620px`, `gap: 40px`, `align-items: center`, padding `70px 56px`**.
- Recommended responsive behavior (not in the static mock): below ~1024px, stack to a single column (message on top, stage below), let the stage shrink to `max-width: 620px; width: 100%`. The stage's internal pieces are sized in px — wrap the card in a container that scales, or set a `min-width` and allow horizontal centering.

---

## Screens / Views

### View: Hero (single screen)

**Layout**
- Root: `position: relative; overflow: hidden; background: #080808`.
- Decorative background layer (z-1): full-bleed layer of slowly falling rounded squares ("blocks").
- Ambient glow: a large radial-gradient blob, bottom-left, behind the headline — `left:-120px; top:340px; 760×620px; radial-gradient(ellipse at center, rgba(255,80,0,.16), transparent 68%)`.
- Content grid (z-4): left = message column (`max-width:640px`), right = stage column (`620px`).

#### Left column — Message (STATIC, no animation)
Vertical stack, in order:
1. **Eyebrow pill** — inline-flex, `gap:9px`, padding `9px 16px`, `border-radius:9999px`, `background: rgba(255,255,255,.05)`, `border:1px solid rgba(255,255,255,.1)`, `font-weight:700; font-size:14px; color:#fff`. Leading 4-point spark icon filled `#FF7A00`. Text: **"Creatief mediabureau in Limburg"**. `margin-bottom:34px`.
2. **H1** — `font-family:'Sora'; font-weight:800; font-size:74px; line-height:1.03; letter-spacing:-.03em; color:#fff; text-wrap:balance`. Two lines:
   - Line 1 (white): **"Webdesign, foto & video"**
   - Line 2 (gradient text): **"voor bedrijven in Limburg"** — `background:linear-gradient(90deg,#FF3B2E,#FF7A00)` clipped to text (`background-clip:text; color:transparent`).
   - `margin:0 0 26px`.
3. **Paragraph** — `font-size:20px; line-height:1.55; color:rgba(255,255,255,.62); max-width:520px; margin:0 0 36px`. Text: **"VisualVibe is het creatief mediabureau voor KMO's in Limburg, Vlaanderen, Antwerpen en Nederlands-Limburg: websites, fotografie, videografie, drone, 3D/VR/AR en podcasting onder één dak."**
4. **Button row** — flex, `gap:16px`, `margin-bottom:44px`.
   - **Primary**: text "Offerte aanvragen" + right arrow icon. `padding:16px 30px; border-radius:12px; font-weight:700; font-size:17px; color:#fff; background:linear-gradient(90deg,#FF3B2E,#FF7A00); box-shadow:0 16px 40px -14px rgba(255,90,0,.85)`. Hover: `translateY(-2px)` and arrow `translateX(5px)` (transition `.25s`/`.3s ease`).
   - **Secondary**: text "Bekijk diensten". Same padding/radius/size, `background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.14); color:#fff`. Hover `translateY(-2px)`.
5. **Trust row** — flex, `gap:16px`, align center:
   - Overlapping avatar chips "1–4": each `30×30`, `border-radius:9999px; background:#1c1c1c; border:2px solid #080808`, overlapped by `margin-left:-9px`, centered white `12px/700` numerals.
   - Text: **"Vertrouwd door 50+ projecten in Limburg"** (`15px; rgba(255,255,255,.62)`, "50+" bold white).
   - Five star icons filled `#FF7A00`, `17×17`, `gap:2px`.

#### Right column — The living stage
A layered card:
- **Rotating dashed rings** (2), behind the card, `position:absolute`, centered right, slowly rotating: ring A `600×600`, `spin 60s linear infinite`; ring B `440×440`, counter-rotating `spinR 44s`. Stroke `rgba(255,122,0,.3–.35)`, `stroke-dasharray:"3 13"` / `"2 16"`, opacity ~.4–.5.
- **Breathing glow** behind card: `inset:-6px; border-radius:30px; radial-gradient(120% 120% at 60% 55%, rgba(255,100,0,.6), rgba(255,60,0,.15) 60%, transparent 78%); filter:blur(28px)`, animated `cardGlow` (opacity .5↔.92, `5s ease-in-out`).
- **Card frame ("gele kader")**: `border-radius:26px; padding:2px` with a gradient border `linear-gradient(150deg, rgba(255,150,60,.9), rgba(255,90,0,.5) 45%, rgba(255,80,0,.15))`, plus `box-shadow:0 40px 90px -30px rgba(255,80,0,.7)`.
- **Card inner**: `border-radius:24px; overflow:hidden; background: radial-gradient(130% 120% at 50% 0%, #1a1109, #0b0a09 62%); padding:22px 22px 20px`. Contains its own drifting particle layer (rising squares, `floaty` keyframe).

Card inner has three rows:

**1. Card header** (flex, space-between, `margin-bottom:16px`)
- Left: three traffic-light dots (`11px`, colors `#FF3B2E / #FF7A00 / #FFA23A`) + the **cycling discipline name** (`font-family:'Sora'; font-weight:700; font-size:15px; color:#fff`), inside a `position:relative; width:150px; height:20px` box.
- Right: the **cycling index** `"0X / 06"` (`font-family:'JetBrains Mono'; font-weight:700; font-size:12px; color:rgba(255,255,255,.4)`, in a `width:44px` box) + a **LIVE** badge: pulsing `8px` orange dot (`livePulse 2.2s`) + text "LIVE" (`#FF9A45`, letter-spacing `.06em`).

**2. Stage** — `position:relative; height:352px; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,.07)`, background `radial-gradient(120% 120% at 50% 0%, #120c07, #0a0908 70%)` + a dotted grid overlay (`radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px); background-size:20px 20px`). Holds the **6 scene layers** (see below), absolutely stacked (`inset:0`), cross-faded by CSS.

**3. Card footer** (flex, space-between, `margin-top:16px`)
- Left: **6 progress dots**; the active one animates to a wide gradient pill.
- Right: label **"6 disciplines · 1 partner"** (`JetBrains Mono; 12px/700; rgba(255,255,255,.5)`).

---

## The scene cycle (core interaction)

Six scenes share one **27s** master loop; each is "on screen" for one **4.5s** slot (27 ÷ 6). The active scene, the header discipline name, the header index, and the footer dot are all driven by the **same timing** so they stay in sync.

Implementation in the prototype is **pure CSS** (deliberately — JS timers throttle when the tab/section is backgrounded). Each cyclable element carries a `--s` index (0–5) and:
```
animation: sceneCycle 27s linear infinite;
animation-delay: calc(var(--s) * 4.5s);
```
Keyframes (percent of 27s):
- `sceneCycle` (scenes): `0%{opacity:0; transform:scale(.955) translateY(12px); z-index:1}` → `2%{opacity:1; transform:none; z-index:3}` → `15%{opacity:1}` → `17.5%{opacity:0; transform:scale(1.03) translateY(-6px); z-index:1}` → `100%{opacity:0}`.
- `labelCycle` (header name + index): same timing, opacity 0→1→0 with a ±7px `translateY`.
- `dotCycle` (footer dots): `width:8px→26px→8px`; `background` toggles `rgba(255,255,255,.18)` ↔ `linear-gradient(90deg,#FF3B2E,#FF7A00)`.

The scene order & labels:
| `--s` | Discipline | Index |
|---|---|---|
| 0 | Webdesign | 01 / 06 |
| 1 | Fotografie | 02 / 06 |
| 2 | Videografie | 03 / 06 |
| 3 | Drone | 04 / 06 |
| 4 | 3D / VR / AR | 05 / 06 |
| 5 | Podcasting | 06 / 06 |

> **Porting note:** In a component framework you may instead drive `activeIndex` with a single `requestAnimationFrame`/interval (advance every 4500ms) and toggle classes — but if you do, pause it when the hero scrolls out of view (IntersectionObserver) so it doesn't drift. The CSS-only approach avoids that entirely and is recommended.

### Scene 0 — Webdesign ("site builds itself")
A browser mock (`width:400px; border:1px solid rgba(255,255,255,.12); border-radius:12px; background:#0f0e0d`): title bar with 3 dots + a URL pill reading `visualvibe.be`. Body blocks scale in on a loop (`buildW`, `4.5s`, transform-origin left, staggered `animation-delay` 0 / .25 / .4 / .6 / .72 / .84s): a `34px` gradient hero bar (`linear-gradient(90deg,#FF3B2E,#FF7A00)`), two grey text lines (80% / 62% width), and a 3-card row (first card orange-tinted). A cursor arrow drifts on a 5-loop path (`cursorW`), and a diagonal light `shimmer` sweeps across (`3s`).

### Scene 1 — Fotografie ("viewfinder focusing")
A viewfinder frame `inset:26px` with orange corner ticks and a faint rule-of-thirds grid. A hexagonal **aperture** icon (SVG, `#FF7A00` stroke) opens/closes via `apert` (rotate 0↔55°, scale 1↔.6, `4.5s`). A white **focus box** with corner brackets moves & locks around the frame (`focusMove`, `5s`). Top-left `● AF-C` (`#FF9A45`); bottom EXIF row: `f/1.8 · 1/250 · ISO 200 · IMG_1284`. Occasional shutter **flash** overlay (`flash`, radial white, `4.5s`). Mono font `JetBrains Mono`, `11–12px`.

### Scene 2 — Videografie ("edit timeline")
Top: a filmstrip of orange-tinted frames scrolling left (`strip`, `7s`, duplicate the frame set and translateX -50% for a seamless loop) with a central pulsing play button (`pulseP`). Middle: an audio-style **waveform** of ~40 bars bouncing (`eq`, per-bar randomized `animation-delay` and `-duration`; `transform-origin:bottom; scaleY .16↔1`); gradient `linear-gradient(180deg,#FF7A00,#FF3B2E)`. Below: a progress track (38% filled) with a white **playhead** sweeping 0→100% (`playhead`, `4.5s`). Footer readout: `● REC 4K · 00:12:04 · 25 fps`.

### Scene 3 — Drone ("flight over radar")
A **radar** disc (`200px`) on the right: concentric rings + crosshair + a conic-gradient **sweep** rotating (`sweep`, `3.4s`, `conic-gradient(from 0deg, rgba(255,122,0,.5), transparent 70deg)`). A dashed **flight path** SVG spans the scene; a small drone icon follows it using CSS motion path: `offset-path: path('M 24 250 C 150 110, 250 300, 380 160 S 540 60, 556 200'); offset-rotate:auto; animation: fly 6.5s ease-in-out infinite` (`offset-distance` 0→100%), with a gentle `bob`. Left HUD (Sora, big numerals): `ALTITUDE 62.4 m`, `SPEED 12.8 m/s`; bottom: `51.23°N · 5.34°E  ● REC 4K`.

### Scene 4 — 3D / VR / AR ("real-time render")
A CSS 3D **wireframe cube** (`130px`, `perspective:640px` on the parent, `transform-style:preserve-3d`) spinning `cube 10s linear infinite` (`rotateX(-24deg) rotateY(0→360deg)`); six faces each `border:1.5px solid rgba(255,122,0,.4–.75); background:rgba(255,122,0,.03–.06)` positioned with `translateZ(65px)` + face rotations. Two nodes **orbit** it (`orbit 6s`, `orbit2 8s`). Labels: top-left `● RENDERING` (`#FF9A45`), top-right `60 FPS`, bottom-center `3D · VR · AR | REAL-TIME`.

### Scene 5 — Podcasting ("on air")
Header row: orange gradient mic tile (`46px`, `linear-gradient(140deg,#FF5A1F,#FF9500)`) + title **"De VisualVibe Cast"** / **"Aflevering 12 · Studio"**; right: pulsing red dot + **ON AIR** (`#FF5A1F`). Middle: a live **audio visualizer** of ~30 bars bouncing (`eq`, randomized delays/durations, gradient `linear-gradient(180deg,#FF9500,#FF3B2E)`). Footer: `REC ● 12:47` and `LVL ▮▮▮▯▯ -9dB`.

---

## Interactions & Behavior
- **Auto-cycle** through 6 scenes, 4.5s each (27s full loop), infinite. Scenes cross-fade with a slight scale/translate (see keyframes). No user input required.
- **Within each scene**, sub-animations run continuously and independently (build bars, aperture, waveform, playhead, radar sweep, drone motion path, cube rotation, EQ bars).
- **Button hovers**: primary/secondary lift `translateY(-2px)`; primary's arrow slides `translateX(5px)`.
- **Ambient**: falling blocks (background + card), breathing card glow, rotating dashed rings, pulsing LIVE dots.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables all animations and shows only scene 0 statically. Preserve this — pause the cycle and render the first (or any single) discipline.

## State / Logic
The prototype has almost no runtime logic. A single helper builds **randomized inline styles** (once) for decorative elements so they look organic:
- `blocks` (16) — background falling squares: random `left`, size 10–26px, opacity .12–.4, `animation-duration` 14–30s, negative `animation-delay`.
- `cblocks` (10) — in-card rising squares: size 6–14px, opacity .14–.44, duration 7–16s.
- `vbars` (40) & `bars` (30) — waveform / visualizer bars: random `animation-delay` (−0…1.4s) and `animation-duration` (~0.5–1.25s) so each bar bounces out of phase.

In your implementation, generate these once on mount (or hardcode a seeded set) — they never change after first render. **No other state is needed** for the visual; the entire cycle is time-based CSS.

## Design Tokens

**Colors**
- Background base: `#080808`; deep panel `#0b0a09` / `#0a0908`; warm dark `#1a1109` / `#120c07`; mock surface `#0f0e0d`; avatar chip `#1c1c1c`.
- Brand red: `#FF3B2E` · Brand orange: `#FF7A00` · Light orange: `#FFA23A` · Accent text orange: `#FF9A45` · Deep orange stops: `#FF5A1F`, `#FF9500`.
- Signature gradient: `linear-gradient(90deg, #FF3B2E, #FF7A00)`.
- Text: primary `#fff`; secondary `rgba(255,255,255,.62)`; muted `rgba(255,255,255,.4–.55)`; hairlines `rgba(255,255,255,.07–.14)`.
- Orange tints for strokes/fills: `rgba(255,122,0,.10 / .16 / .18 / .3 / .5)`.

**Typography**
- Headings / numerals: **Sora** (700, 800).
- Body / UI: **Manrope** (500, 600, 700, 800).
- Mono readouts (HUD, EXIF, timecodes, index): **JetBrains Mono** (500, 700).
- Key sizes: H1 74/1.03/−.03em; paragraph 20/1.55; buttons 17/700; eyebrow & trust 14–15; card title 15–16; mono readouts 11–12.

**Radius**: pills `9999px`; buttons `12px`; cards `24–26px`; stage `16px`; tiles/blocks `4–12px`.

**Shadows**: primary button `0 16px 40px -14px rgba(255,90,0,.85)`; card `0 40px 90px -30px rgba(255,80,0,.7)`; browser mock `0 20px 50px -20px rgba(0,0,0,.8)`.

**Motion (durations/easings)**: scene loop 27s linear (4.5s/scene); buildW 4.5s cubic-bezier(.5,0,.1,1); focusMove 5s; apert 4.5s; strip 7s; playhead 4.5s; fly 6.5s ease-in-out; cube 10s linear; orbit 6s / orbit2 8s; sweep 3.4s; cardGlow 5s; rings 60s / 44s; livePulse 2.2s; eq bars ~0.5–1.25s (randomized).

## Assets
- **No raster/image assets.** All graphics are inline SVG icons (home/user/chevron not needed here; spark, arrow, star, camera/aperture, film/play, drone rotors, cube faces, mic) and CSS shapes/gradients. Recreate icons with your icon library (Lucide/Heroicons are close matches) or keep the inline SVGs.
- **Fonts** load from Google Fonts (Sora, Manrope, JetBrains Mono). Swap to your app's font pipeline.
- Uses the CSS `offset-path` motion-path API (scene 3) and CSS 3D transforms (scene 4) — both well-supported in modern evergreen browsers.

## Files
- `Hero (zonder header).dc.html` — the hero **without** the top navigation (this handoff's subject). Open in a browser to see it live.
- `Homepage Hero.dc.html` — the full hero **with** the nav bar, for reference/context.
- `support.js` — the prototype runtime required only to render the `.dc.html` files standalone. **Not** something to port.

Open either `.dc.html` directly in a browser to watch the animation and read exact inline values in source.
