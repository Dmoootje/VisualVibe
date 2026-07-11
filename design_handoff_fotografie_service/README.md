# Handoff: Dienstenpagina "Fotografie" (VisualVibe)

## Overview
The **Fotografie service page** — the flagship, most visual of the service pages. It opens with a **cinematic camera-viewfinder hero** that turns the shutter button into an interactive toy (each click reveals another photography category), and presents the work through a curated gallery block with a full **lightbox**.

Block order (top → bottom):
1. **Header / navigation** (with mobile hamburger).
2. **Hero** — copy left, an animated **camera viewfinder** right. The shutter button is interactive (see "Shutter interaction").
3. **Galerijen** — a featured bento (1 big + 2 small gallery tiles) + a 2-card row (WeddingVibe + "Bekijk meer projecten"). Tiles open a **lightbox**.
4. **Hoe we werken** (4 steps) · **FAQ** (accordion) · **Gerelateerde diensten** · **CTA band** · **Footer**.

### Scope
- ✅ Everything above, responsive (desktop / tablet / mobile), plus the shutter interaction and the gallery lightbox.
- ⛔ The 7 photography galleries themselves don't exist yet — the shutter reveal and the "Bekijk meer projecten" card are **not linked** anywhere yet (`galleryUrl: null`, `href="#"`). Wire them when the galleries are built.

## About the design files
`reference/Diensten - Fotografie.dc.html` is a **design reference built in HTML** — not production code to copy verbatim. `support.js` (do not ship) and `image-slot.js` render the prototype; `assets/weddingvibe.svg` is a real asset used by the WeddingVibe card. Open the HTML and click the orange shutter button to feel the interaction.

## Fidelity
**High-fidelity.** Colours, type, motion timings, the shutter behaviour and the lightbox are final.

---

## Global shell
- Background `#0a0a0a`, text `#fff`, root `width:100%; max-width:1440px; margin:0 auto; overflow:hidden`.
- Fonts: `Sora` (700/800 headings), `Manrope` (body), `JetBrains Mono` (eyebrows/EXIF/labels), `Cormorant Garamond` (WeddingVibe card title only).
- Accent `#FF7A00` / `#FF9A45`; primary gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)` / `135deg` on round buttons; success green `#5ac47d`; WeddingVibe gold `#C9A24B` family.
- One tweak prop: `animate` (boolean, default true) → toggles the `vv-anim` class that gates all animation.

## Hero — camera viewfinder
`padding:70px 56px 54px`. Grid `1.02fr .98fr`. Right column = the viewfinder showpiece (`.vfWrap`, aspect 4/5, gradient border, `min(100%,472px)`):
- Base photo = `<image-slot id="fg-hero">` (the **default photo**, user-swappable, always kept).
- Camera overlays (all `pointer-events:none`): vignette, rule-of-thirds grid, corner frame ticks, an animated **focus box** (`focusScan`), top-left "● SCHERP" (`recBlink`), top-right spinning **aperture** (`iris`), bottom **EXIF** row (ISO 100 · f/1.8 · 1/250 · RAW).
- **Entrance sequence** (one-shot, gated by `vv-anim`): the card drops in from the top (`vfDrop`, .9s spring) → a light **sheen** sweeps across the photo (`vfSheen`, at 1s) → the shutter button starts its invite pulse at 1.9s.
- Floating chips ("7 stijlen", "Web + print klaar") with `floaty` bob.
- A soft **fade-to-black** strip at the section bottom blends the hero into the galerij section (no hard seam).

### Shutter interaction (the core toy)
The orange round **shutter button** (`.shutterBtn`, filled gradient, `shutIco` icon) sits centered at the frame's bottom edge, with an expanding **ping ring** (`shutPing`) and icon **breath** (`shutBreath`) that begin at 1.9s to invite a click.
- **On load** (no photo chosen yet, `cur < 0`): a prominent **hint** shows above the button — a pill "Foto's nodig? **Klik hier**" (camera icon) + a **down-arrow** that bobs toward the button (`hintBob` / `hintArrow`). Hint hides on first click.
- **On each click** (`onShutter`): if `busy` → ignore; otherwise set `busy`, hide the current badge, play the existing **shutter-flash** overlay (`shBladeT`/`shBladeB` blades + `shFlash`, ~560ms, full-screen fixed). At **240ms** (blades closed) the photo swaps to the next category slide and a **badge** appears; `busy` releases at **560ms** so the visitor can immediately click again.
- **Sequence**: a per-session **shuffled** order of the 8 categories (Fisher–Yates); never shows the same image twice in a row (including across the reshuffle boundary); after all 8, it reshuffles. Keyboard: the button is a native `<button>` (Enter/Space work).
- The revealed image is a layered `<img>` over the default image-slot (`width/height:100%; object-fit:cover; object-position:center`) — the 8 slides are **preloaded** in `componentDidMount` (no white flash / layout shift). All 8 source images are exactly 468×589.
- **Badge** (centered, above the button, `bottom:92px`, so it never sits behind the shutter/float chips): dark blur pill, thin orange border, a **category-icon chip** (matches the photo's category), white category **title**, light-grey playful **message**; fades in up (`fgBadgeIn`, ~260ms). The **shutter button's own icon** also switches to that category icon on each click; it shows the spinning **aperture** as the default before the first click.
- Category → icon map (badge + button): bedrijf→`biz` (briefcase), zakelijke portretten→`user`, product→`box`, event→`party`, vastgoed→`home`, realisatie→`layers`, branding→`spark`, huwelijk→`heart`. Default→`aperture`.

**8 slides data** (`SLIDES` in the logic class): each `{ id, title, message, image, galleryUrl:null }`. `galleryUrl` is intentionally null — extend it (and the card links) when the galleries exist. Files: `…/media/fotografieslide/01-bedrijfsfotografie.webp … 08-huwelijksfotografie.webp`.

## Galerijen block
Featured **bento** (`.gGrid`, `grid-template-columns:1.7fr 1fr`, `grid-auto-rows:200px`): one big tile (Bedrijfsfotografie, `grid-row:span 2`) + two small tiles (Zakelijke portretten, Productfotografie). Each `.gCard`: cover `<img>` (built via `React.createElement` so no literal-hole `src` fires during stream), gradient scrim, a **type badge** + photo-count chip, a filled gradient **aperture hover cue** that grows (`irisGrow`), title + description + "BEKIJK GALERIJ". Click → opens the lightbox for that gallery.

Below, a `.gBottom` 2-column row:
- **WeddingVibe card** (`.wedCard`): white card with an animated **gold conic border** (`wedSpin`), WeddingVibe logo (`assets/weddingvibe.svg`), a "Bruidsfotografie" badge, Cormorant "Huwelijks- & bruidsfotografie" title, gold arrow. Links to `https://weddingvibe.be/` (real external link, `target="_blank"`).
- **"Bekijk meer projecten"** (`.moreCard`): dark accent card, "Portfolio" badge, arrow. Placeholder `href="#"` → point to the fotografie portfolio when it exists.

## Lightbox
Opens from any gallery tile (`openLb`, fires the shutter-flash first for continuity). Fixed overlay + centered card:
- **Top bar**: type badge (category icon) + gallery **title** + **description**; a **Play/Pauze** autoplay toggle; a close button (Esc).
- **Progress bar** (`lbProg`, 5s loop, pauses with autoplay).
- **Stage**: a horizontal `.lbTrack` of `<img>` slides (translateX by index), per-slide caption; prev/next arrows; counter "n / total". **Autoplay** advances every 5s; **keyboard** ←/→/Esc; **touch swipe** (onTouchStart/End, 45px threshold). Manual nav restarts the timer.
- **Thumbnail rail**: horizontal, active thumbnail highlighted (orange border), click to jump.
- Gallery images are currently the existing VisualVibe portfolio webp's (demo), 3–5 per gallery — swap in the real sets per gallery in the `GAL`/`slidesFor` data.

## Responsive
- ≤960px: sections repad to 24px; hero → 1 column; nav → hamburger; `.gGrid` → 1 column (spans reset); `.gBottom` → 1 column; steps grid → 2 columns; footer → 1 column.
- ≤560px: repad to 16px; H1 44px; user icon hidden; steps → 1 column; lightbox arrows/thumbs shrink; lightbox top bar stacks.
- All animation disabled under `prefers-reduced-motion`.

## State / logic
`state`: `navOpen`, `lbOpen`, `gal`, `idx`, `auto`, `flash`, `faq`, and the shutter set `order[]`, `pos`, `cur`, `badge`, `busy`. Exposed to the template: `featured`, `steps`, `faqs`, `related`, `footDiensten/footBedrijf`, `flash`, `onShutter`, `showSlide`, `showHint`, `curImgEl`, `showBadge`, `badgeTitle`, `badgeMsg`, `badgeIcon`, `btnIcon`, and the full lightbox set (`lbOpen`, `lbTitle/Desc/Badge/Icon`, `lbSlides`, `lbThumbs`, `trackT`, `lbCounter`, `auto/notAuto/progPaused`, `next/prev/go/toggleAuto`, `onTouchStart/End`). Timers: `_sw` (swap 240ms), `_bz` (busy 560ms), `_ft` (flash), `_iv` (lightbox autoplay) — all cleared on unmount.

## Assets & dependencies
- `image-slot.js` — the hero default photo slot (`id="fg-hero"`).
- `assets/weddingvibe.svg` — WeddingVibe logo.
- 8 fotografieslide webp's (468×589) + the demo gallery portfolio webp's — all Firebase-hosted, URLs inline in the logic class.
- Google Fonts: Sora, Manrope, JetBrains Mono, Cormorant Garamond.

## To wire later
- Give each of the 8 `SLIDES` a real `galleryUrl` and make the revealed image / badge link to it (currently intentionally non-clickable).
- Point the "Bekijk meer projecten" card and the gallery-tile lightboxes at the real fotografie portfolio + per-gallery photo sets.
