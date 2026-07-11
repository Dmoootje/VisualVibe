# Handoff: Dienstenpagina "Drone & FPV" (VisualVibe)

## Overview
The **Drone & FPV service page** — same structure/style as the other service pages, with an animated **quadcopter + FPV-feed hero**, a **cursor-following drone**, and a stacked **Dronefotografie / Dronevideografie** realisaties section (photo filmstrip + FPV-monitor video band) that opens a combined photo/video lightbox.

Block order (top → bottom):
1. **Header / navigation** (mobile hamburger).
2. **Hero** — copy left; right = a quadcopter (spinning props) hovering over an **FPV "drone's-eye" screen** (live aerial feed + HUD).
3. **Realisaties split** — stacked: **Dronefotografie** (film contact-sheet) + **Dronevideografie** (FPV monitor). Cards open the lightbox.
4. **Diensten overzicht** (6) · **Hoe we werken** (3 steps) · **Gerelateerde diensten** · **CTA** · **Footer**.
5. A **cursor-following drone** floats over the whole page (desktop only).

### Scope
- ✅ All of the above, responsive; the combined photo+video lightbox (prev/next, thumbnails, keyboard).
- ⛔ Footer content is generic (reuse the real `Footer` component).
- ⚠️ Media = the client-provided 3 drone photos + 2 YouTube videos; more can come from a CMS (same data shape).

## About the design files
`reference/Diensten - Drone en FPV.dc.html` — a **design reference built in HTML**, not production code. `support.js` (do not ship) renders the prototype. Open it, move the mouse (watch the drone trail after the cursor), and click any photo/video.

## Fidelity
**High-fidelity.** Colours, type, the drone animations, the film/FPV treatments and the lightbox are final. Photos are Firebase-hosted webp; videos embed YouTube.

## Global shell
- Background `#0a0a0a`, `#fff`, root `max-width:1440px; overflow:hidden`. Fonts Sora / Manrope / JetBrains Mono. Accent `#FF7A00`/`#FF9A45`, gradient `#FF3B2E→#FF7A00`, success green `#5ac47d`, YouTube red `#FF3B2E`.

## Hero
Copy left ("Vanuit de lucht" badge, H1 "Drone & FPV", intro, CTAs). Right visual (`.drVisual`, 560×452):
- A rotating conic glow behind.
- **FPV screen card** — a 16:10 panel showing a real aerial photo as the "drone's-eye view", with a full HUD: corner brackets, center crosshair, "● REC", "GPS 14", "ALT 82m / SPD 34km/h", battery 96%, and a green **scanline** (`hudScan`). This realises the client's "hands-with-screen = what the drone sees" idea as an animation.
- A **quadcopter SVG** (reusable `#quad` symbol) hovering above it (`droneHover` bob), with **spinning propellers** (`.rotor` → `spin`, alternating speeds), motor hubs, a gimbal camera, front indicator LEDs, and **signal arcs** (`sig s1/s2/s3` → `sigWave`) broadcasting down to the screen.
- Floating chips "4K · HDR" and "Gecertificeerd piloot".

## Cursor-following drone
A small quadcopter (`.scrollDrone`, `position:fixed`, `pointer-events:none`, desktop only) **trails slowly after the mouse**. Implemented in `componentDidMount`: a `mousemove` handler sets a target; a `requestAnimationFrame` loop lerps the drone's position toward it at **0.0067 per frame** (very slow, gentle trailing) and banks (`rotate`) proportional to horizontal velocity (clamped ±14°). The inner rig keeps its hover bob + spinning props. Hidden ≤1000px and under `prefers-reduced-motion`. Tune speed via the `0.0067` lerp factor.

## Realisaties split (stacked)
Two full-width bands (`.drSplit`, flex column):
- **Dronefotografie — film contact-sheet**: header (camera icon, title, "RAW · 48MP · HOGE RESOLUTIE" badge) + a **film reel**: top & bottom **sprocket-perforation** bars (repeating-linear-gradient) framing a 3-up row of photo **frames** (each labelled "FRAME 01/02/03" + caption, expand-cue on hover). Click → photo lightbox.
- **Dronevideografie — FPV monitor**: header (video icon, title, "● FPV · 4K · LIVE FEED" badge) + a 2-up row of video cards, each with an **FPV HUD** (corner brackets + "● REC"), a big orange play button, title. Click → YouTube player.
- Hover on any card lifts it + zooms the image; the play/expand icon scales.

## Combined lightbox (photo + video)
One viewer handles both groups (`grp: 'foto' | 'video'`). Fixed overlay + growing card (`lbPop`). Top: tag/label + title; close (Esc). Stage shows either a **contained `<img>`** (photo) or an **autoplay YouTube `<iframe>`** (video), built in `renderVals` only while open (mounts/plays on open + each prev/next; unmounts on close = stops playback). **Vorige / Volgende** cycle within the active group; "n / total" counter; centered **thumbnail rail** (video thumbs get a play glyph). Keyboard ←/→/Esc.

## Data (logic class)
- `FOTOS` (3): the client's drone photos (Firebase webp) — `{ src, title, label }`.
- `VIDEOS` (2): `ZXJNLr5W8eA` (Dronevideo), `FdzjPybGWSo` (FPV) — `{ yt, title, tag }`. Thumbnails from `img.youtube.com/vi/<id>/maxresdefault.jpg`; player embeds `youtube.com/embed/<id>`.
- `overzicht` (6): Dronefotografie, Dronevideo, FPV-video, Vastgoed-dronebeelden, Realisatie-dronebeelden, Event-dronebeelden. `steps` (3): Vergunning & planning · Opname · Montage. `related`: Videografie, Fotografie, 3D VR & AR.
- To scale up: add to `FOTOS`/`VIDEOS` (a CMS or the YouTube Data API can feed the same shapes) — the split, lightbox and thumbnails all iterate these arrays.

## Motion (keyframes)
`spin` (props), `droneHover` (rig bob), `sigWave` (signal arcs), `hudScan` (feed scanline), `recB` (REC blink), `livePulse` (dots), `vvSpin` (glow), `lbPop`/`lbFade` (lightbox), plus hover transitions. The cursor-follow is JS-driven (rAF lerp). All disabled under `prefers-reduced-motion`.

## Responsive
- ≤1000px: nav → hamburger; hero → 1 column (visual below); split already stacked; overzicht → 1 col; steps → 1 col; footer → 1 col; **cursor-drone hidden**.
- ≤760px: paddings 22px; H1 clamps; hero visual scales 0.82 (clipped); grid heads + lightbox top stack.
- ≤560px: film frames → 2 cols; visual scales 0.62.
- No horizontal overflow at any width.

## State / logic
`state`: `navOpen`, `lbOpen`, `grp` ('foto'|'video'), `idx`. Refs: `droneRef` stores the cursor-drone node. Listeners: `keydown` (lightbox nav), `mousemove` (drone target) + rAF loop; all cleaned up on unmount. Exposed: `fotos`, `videos`, lightbox set (`lbOpen`, `lbTitle`, `lbTag`, `lbCounter`, `mediaEl`, `lbMinis`, `next/prev/closeLb/stop`), `droneRef`, `overzicht`, `steps`, `related`, footer arrays, nav.

## Assets & dependencies
- 3 Firebase-hosted drone photos + 2 YouTube videos (URLs/ids inline in the logic class).
- The quadcopter is a pure inline-SVG `#quad` symbol (no image asset).
- Google Fonts: Sora, Manrope, JetBrains Mono.
