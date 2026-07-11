# Handoff: Dienstenpagina "Videografie" (VisualVibe)

## Overview
The **Videografie service page** — same structure/style as the SEO and Webdesign service pages, with a cinematic **video-player hero** and a **YouTube video gallery** whose cards open a popup lightbox player.

Block order (top → bottom):
1. **Header / navigation** (mobile hamburger).
2. **Hero** — copy left, an animated **video-player visual** right (16:9 player mock over a real YouTube thumbnail).
3. **Video gallery** — filter tabs + video cards (custom orange play button + progress bar) → each opens a **lightbox popup** with the embedded YouTube video (prev/next, thumbnails, keyboard).
4. **Videografie diensten overzicht** (8 items) · **Hoe we werken** (4 steps) · **FAQ** (accordion) · **Gerelateerde diensten** · **CTA band** · **Footer**.

### Scope
- ✅ All of the above, responsive (desktop / tablet / mobile).
- ⚠️ Videos are the **3 real YouTube videos** the client provided; a full auto-synced channel playlist needs the YouTube Data API at build time (see "Playlist / more videos").

## About the design files
`reference/Diensten - Videografie.dc.html` is a **design reference built in HTML** — not production code to copy verbatim. `support.js` (do not ship) renders the prototype. Open it, click the hero player or any card to see the lightbox.

## Fidelity
**High-fidelity.** Colours, type, motion and the lightbox are final. Video thumbnails come live from YouTube (`img.youtube.com/vi/<id>/maxresdefault.jpg`); the lightbox embeds `youtube.com/embed/<id>`.

---

## Global shell
- Background `#0a0a0a`, text `#fff`, root `width:100%; max-width:1440px; margin:0 auto; overflow:hidden`.
- Fonts: `Sora` (700/800), `Manrope` (body), `JetBrains Mono` (eyebrows/labels/timecodes).
- Accent `#FF7A00` / `#FF9A45`; primary gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)` (round buttons `135deg`); YouTube red `#FF3B2E` used on YT glyphs.
- Reuses the exact nav + hero-grid + responsive scaffold from the SEO service page (`vg*` class names here).

## Hero — video-player visual
Copy left (breadcrumb, "Bewegend beeld" badge, H1 "Videografie", intro, CTAs). Right = a 16:9 **player mock** (`.playRing`, gradient border) over the real thumbnail of "Zomerspot voor TV Limburg":
- A slowly rotating conic glow behind; top chips "● 4K · OPNAME" and a "00:30" timecode; a full **control bar** (play/volume icons, orange **scrubber** with a white knob at ~40% — **static**, no looping animation, timecode "00:12 / 00:30", fullscreen icon).
- **Play button** (`.vgPlayBox`): gentle bounce (`vgBob2`) + **three rings flying outward** (`vgRing r1/r2/r3` → `vgRingOut`, staggered) as a "click me" cue; the button scales on hover.
- **Signal-glitch effect** on the thumbnail: a scanline band (`.vgGlitch` → `vgScan`, runs bottom→top with irregular fast/slow pacing ~every 4.6s) + an occasional RGB-shift **tear** on the image (`.vgJit` → `vgJit`, ~every 5.5s). Purely decorative on the mock; the real video (lightbox) has no glitch.
- Floating chips "4K · 60fps" and "Concept tot montage".
- Clicking the hero player opens the lightbox on the first video.

## Video gallery
`#video-gallery`. Head: eyebrow "ONZE VIDEO'S" + H2, and an "Alle video's op YouTube" button → `https://www.youtube.com/@visualvibe_be/videos`.
- **Filter tabs** (`filters`): Alle · Commercial · Bedrijfsvideo · Wervingsvideo — active tab = orange gradient; filters the grid by `cat`.
- **Video cards** (`.vCard`, `repeat(3,1fr)`): 16:9 YouTube thumbnail (built via `React.createElement` so no literal-hole `src` during streaming), a **category badge**, a **duration** chip, a centered **custom orange play button**, and a decorative **orange progress bar** at the bottom (grows on hover). Title + client (with YT glyph). Staggered `rowIn` entrance; hover lifts + zooms. Click → opens the lightbox at that card's index.

## Lightbox (video popup)
Fixed overlay + a **growing** card (`lbPop`). Top: category badge + video **title** + client; close (Esc). A 16:9 container embeds `youtube.com/embed/<id>?autoplay=1&rel=0&modestbranding=1` (built in `renderVals` only while open, so it mounts/plays on open and on every prev/next). **Vorige / Volgende** buttons cycle through the **current filtered list** (so you scroll through exactly the filtered set); a "n / total" counter; a centered **thumbnail rail** (each with a small play glyph) to jump. Keyboard ←/→/Esc. Closing unmounts the iframe (stops playback).

## The 3 videos (`VIDEOS` in logic)
`{ yt, title, cat, client, dur }`:
1. **Zomerspot voor TV Limburg** — `kfjoL_cUTPQ` — Commercial · TV Limburg · 0:30
2. **Bouw Realisaties** — `8zGBwfcbX9A` — Bedrijfsvideo · Bouwsector · 2:10
3. **Baldewijns — techniekersvideo** — `zj4hvA8tdTA` — Wervingsvideo · Baldewijns · 1:45

Categories (`CATS`) drive the filter. Add videos by appending to `VIDEOS` with a `cat` that matches (or extend `CATS`). Durations/clients are placeholders — set the real values.

## Playlist / more videos
The "Alle video's" button links to the channel. To show the **full channel/playlist automatically**, the developer should pull it via the **YouTube Data API v3** (playlistItems / channel uploads) at build or runtime and map each item into the `VIDEOS` shape (`yt`, `title`, `cat`, `client`, `dur`). No layout change needed — the grid, filter and lightbox already iterate `VIDEOS`.

## Standard sections
- **Diensten overzicht** (8): Bedrijfsvideo, Promovideo, Social media video, Event-aftermovie, Wervingsvideo, Testimonial-video, Podcastvideo, Nieuwsreportage — 2-col rows with hover slide + arrow.
- **Hoe we werken** (4): 01 Script & concept · 02 Opname · 03 Montage · 04 Aflevering.
- **FAQ** (3, accordion), **Gerelateerde diensten** (Fotografie / Drone & FPV / Podcasting), **CTA band** "Interesse in videografie?", **Footer** (compact, YouTube social links to the channel).

## Responsive
- ≤1000px: nav → hamburger; hero → 1 column (player below, centered); video grid → 2 columns; overzicht → 1 column; steps → 2 columns; footer → 1 column.
- ≤760px: paddings 22px; H1 clamps; player scales 0.86 in a clipped column; gallery head + lightbox top stack.
- ≤560px: video grid → 1 column; steps → 1 column; player scales 0.64.
- All animation disabled under `prefers-reduced-motion`. No horizontal overflow at any width.

## State / logic
`state`: `navOpen`, `cat` (active filter), `lbOpen`, `idx` (index in filtered list), `faq`. Keyboard listener added/removed on mount/unmount. Exposed: `filters`, `videos` (filtered, with `thumbEl`), lightbox set (`lbOpen`, `lbTitle/Cat/Client`, `lbCounter`, `iframeEl`, `lbMinis`, `next/prev/closeLb/stop`), `heroOpen`, plus `overzicht`, `steps`, `faqs`, `related`, footer arrays, and nav (`navMobile`, `navPanelClass`, `onNavToggle`).

## Assets & dependencies
- No local images — thumbnails are YouTube-hosted; lightbox embeds YouTube iframes.
- Google Fonts: Sora, Manrope, JetBrains Mono.
