# Handoff: Realisaties-pagina "Videografie" (VisualVibe)

## Overview
The **videografie realisaties (portfolio) page** — the destination the Videografie service page links to. Same structure/style as the **Realisaties Webdesign** page (reusable header + featured block + card grid), adapted for video: the featured block highlights one video, a **category filter** sits above the grid, and every card opens a **YouTube popup player**.

Block order (top → bottom):
1. **Header / navigation** (mobile hamburger).
2. **Reusable realisatie-header** — breadcrumb (Home / Realisaties / Videografie), video-camera icon badge, "REALISATIES" eyebrow, H1 "Videografie", subtitle, stat rail (50+ producties · 4K).
3. **Featured — uitgelichte video** — big video preview left (thumbnail + play button with flying rings + signal glitch + duration), copy right (badge, client, title, description, tags, "Bekijk video"). Opens the player.
4. **Meer video's** — a **category filter** (Alle + 8 categories with live counts) above a card grid; each card opens the player; a "Meer op YouTube" tile closes the row; empty categories show a tasteful empty state.
5. **Footer** — *out of scope*; ship the existing `Footer` component below.

### Scope
- ✅ Header + responsive nav, featured video block, category filter, video card grid, YouTube popup player (prev/next, thumbnails, keyboard), empty state, responsive.
- ⛔ Footer shipped separately.
- ⚠️ Uses the **3 real YouTube videos**; more videos + real category assignment come from a CMS/YouTube API (see "Videos & backend").

## About the design files
`reference/Realisaties - Videografie.dc.html` is a **design reference built in HTML** — not production code to copy verbatim. `support.js` (do not ship) renders the prototype. Open it, click the featured video or a card, and try the category filter.

## Fidelity
**High-fidelity.** Colours, type, motion, filter and player are final. Thumbnails load live from YouTube (`img.youtube.com/vi/<id>/maxresdefault.jpg`); the player embeds `youtube.com/embed/<id>`.

## Global shell
- Background `#0a0a0a`, `#fff` text, root `max-width:1440px; overflow:hidden`. Fonts Sora / Manrope / JetBrains Mono. Accent `#FF7A00`/`#FF9A45`, gradient `#FF3B2E→#FF7A00`, YouTube red `#FF3B2E`.
- Reuses the exact nav + reusable realisatie-header + responsive scaffold shared across the realisatie-category pages (only icon/title/subtitle/stat-rail differ).

## Featured — uitgelichte video
`.frFeatGrid` grid `1.15fr .85fr`. **Left** (order:1): a 16:9 `.frBig` video preview — YouTube thumbnail, an "UITGELICHT" chip, a duration chip, a signal-glitch scanline (`vgGlitch`/`vgScan`), and a centered orange play button (`vgPlayBox`) with a gentle bounce + three rings flying outward (`vgRing` → `vgRingOut`). **Right** (order:2): "● UITGELICHTE VIDEO" badge, client (with YT glyph), H2 title, description, tag pills, "Bekijk video" button. Both open the player at the featured video.

## Category filter + grid
Head: eyebrow "MEER VIDEO'S" + H2 "Ons werk in beweging" + a **live category description** (`catDesc`) that changes with the active filter.
- **Filter chips** (`filters`): `Alle` + the 8 categories, each with a **live count**; active chip = orange gradient. State: `cat`. `Alle` shows all; a category filters the grid; the description line shows that category's copy.
- **Video cards** (`.vCard`, `repeat(3,1fr)`): 16:9 thumbnail (built via `React.createElement` — no literal-hole `src` during stream), category badge, duration chip, centered orange play button, decorative orange progress bar (grows on hover), title + client. Staggered `rowIn` entrance; hover lift + zoom. Click → player at that video's global index.
- **Empty state** (`showEmpty`): when a category has no videos yet, a dashed tile shows "Binnenkort video's in deze categorie" + the category description.
- **"Meer op YouTube" tile**: always present, links to `https://www.youtube.com/@visualvibe_be/videos`.

## Player (popup lightbox)
Fixed overlay + growing card (`lbPop`). Top: category badge + title + client; close (Esc). 16:9 container embeds `youtube.com/embed/<id>?autoplay=1&rel=0&modestbranding=1` (built only while open → mounts/plays on open and each prev/next). **Vorige / Volgende** cycle through **all** videos; "n / total" counter; centered **thumbnail rail** (each with a play glyph) to jump. Keyboard ←/→/Esc. Close unmounts the iframe (stops playback).

## The 8 categories (`CATS`)
Bedrijfsvideo, Promovideo, Social media video, Event-aftermovie, Wervingsvideo, Testimonial-video, Podcastvideo, Nieuwsreportage — each with a description (shown as `catDesc` when active and in the empty state).

## Videos & backend
Current `VIDEOS` (3): Zomerspot voor TV Limburg (`kfjoL_cUTPQ`, Promovideo, TV Limburg), Bouw Realisaties (`8zGBwfcbX9A`, Bedrijfsvideo), Baldewijns — techniekersvideo (`zj4hvA8tdTA`, Wervingsvideo). Each `{ yt, title, cat, client, dur, desc, tags }`.
- **To manage/extend**: the same admin gallery concept as the fotografie realisaties applies — a CMS to add videos with a `title`, `cat` (one of the 8), `client`, `dur`, `desc`, `tags`, and the YouTube id; optionally flag one as **featured**. Or pull the channel automatically via the **YouTube Data API v3** and map items into the `VIDEOS` shape. The filter, counts, grid and player all iterate `VIDEOS` — no layout change needed to scale up.
- `dur`/`desc`/`tags` are placeholders — set real values.

## Responsive
- ≤1080px: nav → hamburger; header stacks (stat rail row); featured → 1 column (video on top, copy below); grid → 2 columns.
- ≤760px: paddings 22px; H1 & featured H2 clamp; grid head + player top stack.
- ≤560px: grid → 1 column; header icon shrinks.
- Animation off under `prefers-reduced-motion`. No horizontal overflow.

## State / logic
`state`: `navOpen`, `lbOpen`, `idx` (player index into all videos), `cat` (active filter). Keyboard listener on mount/unmount. Exposed: featured set (`featThumbEl/featTitle/featClient/featDesc/featTags/featDur/featOpen`), `grid`, `filters`, `catDesc`, `showEmpty`, player set (`lbOpen`, `lbTitle/Cat/Client`, `lbCounter`, `iframeEl`, `lbMinis`, `next/prev/closeLb/stop`), nav.

## Assets & dependencies
- No local images — thumbnails YouTube-hosted, player embeds YouTube iframes.
- Google Fonts: Sora, Manrope, JetBrains Mono.
