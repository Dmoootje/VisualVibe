# Handoff: VisualVibe - Sector-iconen thema (Next.js)

## Overview
A dark, premium "amber-neon" visual system built around **10 custom sector icons** and the three places they appear on the VisualVibe marketing site:

1. **Homepage - sectorenblok** (compact tile grid)
2. **Sectoren - overzichtspagina** (editorial cards with description + CTA)
3. **Sector - detailpagina hero** (large decorative emblem + breadcrumb + CTAs + an infinite two-row marquee of the other sectors)

The whole system is themed by a **single accent colour** (`--vv-accent`, default `#F28A10`) that flows through every icon via `currentColor`.

## About the design files
The files under `reference/` are **design references authored in HTML** - a prototype showing the intended look and behaviour, **not** production code to ship as-is. Your job is to **recreate this design inside the target Next.js codebase** using its established conventions (App Router / Pages Router, your styling layer, your component patterns).

To make that fast, this bundle also ships **ready-to-use React/TypeScript components** (`components/`, `data/`, `styles/`) that already reproduce the design pixel-for-pixel. You can drop them in directly or use them as a precise reference. They are framework-plain (React + CSS + CSS variables) - **no external UI dependency**, Tailwind optional.

## Fidelity
**High-fidelity (hifi).** Colours, typography, spacing, radii, shadows and animation timings below are final. Recreate pixel-perfectly.

---

## Quick start (App Router)

1. **Copy folders** into your app:
   - `components/*` → `components/`
   - `data/sectors.ts` → `data/`
   - `styles/visualvibe.css` → `styles/`

2. **Load fonts** with `next/font` in `app/layout.tsx`:
   ```tsx
   import { Sora, Manrope } from "next/font/google";
   import "@/styles/visualvibe.css";
   import { SectorIconSprite } from "@/components/SectorIconSprite";

   const sora = Sora({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-sora" });
   const manrope = Manrope({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-manrope" });

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="nl" className={`${sora.variable} ${manrope.variable}`}>
         <body style={{ background: "var(--vv-bg)", color: "#fff", fontFamily: "var(--font-manrope), system-ui, sans-serif" }}>
           <SectorIconSprite />   {/* mount ONCE - defines all glyphs */}
           {children}
         </body>
       </html>
     );
   }
   ```

3. **Use the icons anywhere:**
   ```tsx
   import { SectorIcon, SectorHeroEmblem } from "@/components/SectorIcon";
   import { SectorMarquee } from "@/components/SectorMarquee";

   <SectorIcon id="horeca" size={40} />
   <SectorHeroEmblem id="vastgoed" />
   <SectorMarquee exclude="horeca" />
   ```

> **How the icons work:** `<SectorIconSprite/>` renders a hidden `<svg>` containing 10 `<symbol>` glyphs. Each `<SectorIcon>` is a small `<svg>` with `<use href="#sector-<id>">`. Fill/stroke are set **on the symbols themselves** (they inherit `currentColor` from `--vv-accent`) - do not move colour onto the `<use>`; cross-`<svg>` `<use>` does not inherit fill/stroke reliably. To retheme, set `--vv-accent` on any ancestor.

---

## Screens / Views

Shared shell: background `#0a0a0a`, text `#fff`, content column `max-width: 1180px; margin: 0 auto`, section padding `80px clamp(20px,5vw,64px)` (detail hero: `72px … 64px`). Body font **Manrope**, headings **Sora**. Section dividers are a 1px `linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)`.

### 1. Homepage - sectorenblok
- **Purpose:** tease the sectors from the homepage, link through to the overview.
- **Header row:** flex, space-between, align-flex-end, `gap:20px`, `margin-bottom:44px`.
  - Eyebrow: 20px accent rule + text `Sectoren`, 12px / 600 / `letter-spacing:0.14em` / uppercase / colour `--vv-accent`.
  - `<h2>` Sora 700, `clamp(30px,4vw,44px)`, `line-height:1.05`, `letter-spacing:-0.02em`. Copy: **“Elke sector zijn eigen aanpak”**.
  - Sub `<p>` 17px, `line-height:1.55`, `rgba(255,255,255,0.6)`, `max-width:520px`. Copy: **“Van lokale KMO tot industrie - we spreken de taal van jouw markt en vertalen die naar sterke visuals.”**
  - Right link **“Alle sectoren →”** 15px / 600 / accent; arrow gap animates `8px→14px` on hover (`transition: gap .25s`).
- **Grid:** `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:16px`.
- **Tile (`.vv-card`):** `padding:22px; border-radius:18px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02)`. Column, `gap:16px`, align-flex-start.
  - Hover: `translateY(-4px)`, border `rgba(242,138,16,0.38)`, background `rgba(242,138,16,0.05)` (`transition .3s`).
  - Icon chip: `56×56`, `border-radius:14px`, `background:rgba(242,138,16,0.08)`, `border:1px solid rgba(242,138,16,0.16)`; icon `34px`.
  - Title: Sora 600 16px. Tag: 12.5px `rgba(255,255,255,0.45)`.
- Shows all 10 sectors (`SECTORS`).

### 2. Sectoren - overzichtspagina
- **Purpose:** full grid of sectors, each linking to its detail page.
- **Centered header:** `max-width:640px; margin:0 auto 52px; text-align:center`.
  - Eyebrow `Overzicht`. `<h1>` Sora 700 `clamp(32px,4.5vw,52px)`, copy **“Sectoren waarin wij uitblinken”**. Sub 18px, copy **“Tien werelden, één doel: jouw merk laten opvallen met werk dat past bij jouw publiek.”**
- **Grid:** `repeat(auto-fill, minmax(300px, 1fr)); gap:20px`.
- **Card (`.vv-card`):** `padding:26px; border-radius:20px; border:1px solid rgba(255,255,255,0.09)`.
  - Hover: `translateY(-4px)`, border `rgba(242,138,16,0.4)`, `box-shadow:0 20px 55px -22px rgba(242,138,16,0.5)`.
  - Top row (space-between, `margin-bottom:22px`): icon chip `64×64`, `border-radius:16px`, `background:radial-gradient(circle at 35% 30%, rgba(242,138,16,0.14), rgba(242,138,16,0.04))`, `border:1px solid rgba(242,138,16,0.18)`, icon `40px`. Right: tag chip 11px/600 uppercase `letter-spacing:0.1em`, `rgba(255,255,255,0.35)`, `border:1px solid rgba(255,255,255,0.1)`, `border-radius:9999px`, `padding:4px 10px`.
  - Title Sora 600 21px. Desc 14.5px `line-height:1.55` `rgba(255,255,255,0.6)`.
  - Footer link **“Ontdek sector →”** 14px/600 accent, `margin-top:auto`.

### 3. Sector - detailpagina hero
- **Purpose:** landing hero for a single sector.
- **Backgrounds:** amber radial glow top-right (`640×640`, `radial-gradient(circle at center, rgba(242,138,16,0.14), transparent 62%)`); faint 52px grid (`rgba(255,255,255,0.028)` lines) masked with `radial-gradient(ellipse at 70% 30%, #000, transparent 72%)`.
- **Two-column grid:** `grid-template-columns: 1.15fr 0.85fr; gap:40px; align-items:center`.
  - **Left:** breadcrumb 13px (`Sectoren / <name>`); eyebrow = sector `tag`; `<h1>` Sora 700 `clamp(40px,6vw,72px)` `line-height:0.98` `letter-spacing:-0.03em`; `<p>` 19px `rgba(255,255,255,0.65)` `max-width:480px`; buttons: **primary** (`Start je project →`) filled `--vv-accent`, text `#0a0a0a`, `padding:13px 24px`, `border-radius:9999px`, `box-shadow:0 10px 30px -8px rgba(242,138,16,0.6)`, hover `translateY(-2px)`; **secondary** (`Bekijk cases`) ghost, `border:1px solid rgba(255,255,255,0.16)`, hover border `rgba(242,138,16,0.5)`.
  - **Right:** `<SectorHeroEmblem>` - `viewBox 0 0 200 200`, rendered `min(340px,84vw)`. Layers: radial glow `r=99`; dashed ring `r=94` (`stroke rgba(242,138,16,0.30)`, `stroke-dasharray 2 9`, rotates 30s); dashed ring `r=79` (`rgba(242,138,16,0.18)`, `1 11`, rotates 40s reverse); solid ring `r=67` (`fill rgba(255,255,255,0.02)`, `stroke rgba(255,255,255,0.08)`); glyph `<use width=48 height=48 transform="translate(54.4 54.4) scale(1.9)">`.
- **Andere sectoren marquee** (below hero, `border-top:1px solid rgba(255,255,255,0.08)`, `padding-top:28px`): two rows of pills. Top row scrolls **left** (`vvMqL`), bottom scrolls **right** (`vvMqR`), each `42s linear infinite`. Rows are the "other" sectors **duplicated** so `translateX(-50%)` loops seamlessly. Edges fade via a horizontal mask. **Pauses on hover.** Pill: `.vv-pill` (16px label, 36px icon, `padding:14px 24px 14px 16px`, pill radius).

---

## Interactions & Behavior
- **Icon pulse-glow** (`vvPulse`, 3.6s ease-in-out): animates the glyph `drop-shadow` between `2px/0.22` and `6px/0.5` amber.
- **Icon shimmer** (`vvShim`, 5s linear): a faint light stroke (`#ffe3b8`) travels along the glyph outline; staggered per card via `:nth-child`.
- **Hero rings** (`vvSpin`): counter-rotating dashed rings (30s / 40s reverse).
- **Marquee** (`vvMqL` / `vvMqR`, 42s linear): opposite directions, seamless loop, hover-pause.
- **Card hover:** lift `-4px` + amber border/glow (`transition .3s`).
- **Link hover:** arrow gap widens.
- All animation is gated so **`prefers-reduced-motion: reduce` disables everything** (see `visualvibe.css`). The `animate` prop on components also lets you turn motion off per-instance.

## State Management
Effectively stateless / presentational. The only "state" is:
- Which sector a detail page shows → derive from the route param (`sectorById(slug)`).
- Optional `animate` boolean prop, if you want a global motion toggle (wire to a context or user setting).
No data fetching required; `SECTORS` is static content in `data/sectors.ts`.

## Design Tokens
**Colours**
- Background `#0a0a0a` · Surface `#111111` · Text `#ffffff`
- Text opacities: 60% `rgba(255,255,255,0.6)`, 45% `…0.45`, 35% `…0.35`
- Lines/fills: `rgba(255,255,255,0.10)`, `…0.08`, fill `rgba(255,255,255,0.02)`
- Accent: **`#F28A10`** (default) · `#FF7500` · `#FFA23A` · `#FF5A00`
- Accent tints: `rgba(242,138,16, 0.05 / 0.06 / 0.08 / 0.14 / 0.16 / 0.18 / 0.30)`

**Typography**
- Headings: **Sora** 400/500/600/700 · Body: **Manrope** 400/500/600/700
- Scale (px): 72/52/44 h1 hero/overview/home · 21/16 card titles · 19/18/17 lead · 16/14.5/14/13/12.5/12/11 body & labels
- Uppercase labels: `letter-spacing 0.10-0.14em`; headings `letter-spacing -0.02 to -0.03em`

**Radius:** pill `9999px` · `20 / 18 / 14px`
**Shadows:** accent card `0 20px 55px -22px rgba(242,138,16,0.5)` · CTA `0 10px 30px -8px rgba(242,138,16,0.6)`
**Spacing:** section `80px` (hero `72/64`), grid gaps `16 / 20px`, content column `1180px`

## Assets
- **10 sector glyphs**, embedded as an inline SVG sprite in `components/SectorIconSprite.tsx` - no image files, no network requests. They are single-colour (fill) icons that inherit `currentColor`.
- Source icons were supplied by the client (mixed open icon sets), normalised into the sprite. Original viewBoxes are preserved per symbol; the `<use>` scales them into a 48-unit box.
- Sector → glyph id map: `kmo, bouw, horeca, vastgoed, retail, events, sport, opleidingen, wellness, industrie` (see `data/sectors.ts`).
- Fonts: Google Fonts **Sora** + **Manrope** (load via `next/font`, no manual `<link>` needed).

## Files
- `components/SectorIconSprite.tsx` - the 10-glyph sprite (mount once).
- `components/SectorIcon.tsx` - `<SectorIcon>` + `<SectorHeroEmblem>`.
- `components/SectorMarquee.tsx` - the two-row infinite marquee.
- `data/sectors.ts` - sector content (`SECTORS`, `sectorById`).
- `styles/visualvibe.css` - tokens (CSS vars), icon/marquee/card/pill classes, keyframes, reduced-motion.
- `tailwind.tokens.cjs` - optional Tailwind theme tokens.
- `example/sector-detail-page.tsx` - worked example composing the components.
- `reference/Sector Iconen (standalone).html` - the pixel-truth prototype (open in a browser; works offline).
- `reference/Sector Iconen.dc.html` - annotated source of the prototype.
