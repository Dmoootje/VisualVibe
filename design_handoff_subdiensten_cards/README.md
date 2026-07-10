# Handoff: Subdiensten-kaarten (VisualVibe)

## Overview
A reusable **"Subdiensten" (sub-services) card grid** for the VisualVibe website. It appears on multiple pages (e.g. Diensten → Webdesign) and lists the sub-services offered, each as a card with an icon, title, short description and an arrow affordance. The block must be **recognisable and reusable** across pages, and its grid must **balance itself by item count** (never leave a lonely card on a row).

Design direction chosen: **"Ghost-glyph watermark"** — each card carries its own line-icon twice: a small crisp icon before the text (instant recognition) and a large, faint version of that same icon bleeding out of the bottom-right corner (per-card identity). On hover the card lights up: an animated 1px conic-gradient border spins around the edge, a warm halo glows behind it, and the card lifts/scales forward.

## About the Design Files
The files in `reference/` are a **design reference created in HTML** (a prototype showing the intended look and behaviour) — **not production code to copy directly**. `Subdiensten kaarten.dc.html` is a self-contained "Design Component" prototype; `support.js` is only the runtime that lets it open in a browser. Open the HTML file in a browser to see the live design and hover interactions.

Your task is to **recreate this design in the Next.js app** using its existing conventions (App Router / Pages Router, your styling solution — Tailwind, CSS Modules, styled-components, etc.). Do **not** ship the HTML or `support.js`. The section below includes a ready-to-adapt React implementation, exact tokens, the icon paths, and the row-balancing algorithm so you can rebuild it cleanly.

## Fidelity
**High-fidelity (hifi).** Colours, typography, spacing, radii, shadows and the hover animation are final. Recreate pixel-perfectly, then wire the arrow/card to the real service routes.

## Screens / Views

### Subdiensten grid (single reusable block)
- **Purpose:** Let a visitor scan the available sub-services and click through to each service's page.
- **Container:** centered, `max-width: 1180px`, on a `#0a0a0a` background.
- **Header:** section title "Subdiensten" — `font-family: Sora; font-weight: 800; font-size: 32px; letter-spacing: -0.02em; color: #fff;` with `24px` margin below.
- **Layout:** a vertical stack of **rows** (`display:flex; flex-direction:column; gap:16px`). Each row is a horizontal flex container (`display:flex; gap:16px`) whose cards each use `flex: 1 1 0; min-width: 0` so they share the row width equally. Rows-per-count follow the balancing rule below — so a row of 2 gives 50%-wide cards, a row of 3 gives 33%-wide cards.

#### Row-balancing rule (max 3 per row, never a lonely card)
| Items | Rows |
|------|------|
| 2 | `2` |
| 3 | `3` |
| 4 | `2 + 2` |
| 5 | `3 + 2` |
| 6 | `3 + 3` |
| 7 | `2 + 3 + 2` |

```js
// returns an array of row sizes, e.g. rowSizes(7) -> [2,3,2]
function rowSizes(n) {
  const map = { 1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3], 7: [2, 3, 2] };
  if (map[n]) return map[n];
  // fallback for larger counts: rows of 3, but end on 2,2 if 1 would be left over
  const rows = []; let r = n;
  while (r > 0) {
    if (r === 4) { rows.push(2, 2); r = 0; }
    else if (r <= 3) { rows.push(r); r = 0; }
    else { rows.push(3); r -= 3; }
  }
  return rows;
}

// split an items array into rows using the rule
function toRows(items) {
  const sizes = rowSizes(items.length);
  const rows = []; let i = 0;
  for (const s of sizes) { rows.push(items.slice(i, i + s)); i += s; }
  return rows;
}
```

#### Card component
- **Box:** `border-radius: 16px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.02); padding: 22px 22px 24px;` `position: relative; overflow: hidden;`
- **Inner row:** `display:flex; align-items:flex-start; gap:14px;` (`position:relative` so it sits above the watermark).
- **Icon chip (left):** `flex:none; width:46px; height:46px; border-radius:12px; background: rgba(255,122,0,.1); border:1px solid rgba(255,122,0,.2);` centered; contains the small icon (`24×24`, stroke `#FF9A45`, `stroke-width:1.7`, round caps/joins, `fill:none`).
- **Text block (center, flex:1, min-width:0):**
  - Title — `font-family: Sora; font-weight:700; font-size:17px; letter-spacing:-0.01em; color:#fff; margin-bottom:6px;`
  - Description — `font-family: Manrope; font-size:13.5px; line-height:1.5; color: rgba(255,255,255,.5);`
- **Arrow chip (right):** `flex:none; width:33px; height:33px; border-radius:9999px; border:1px solid rgba(255,255,255,.14);` centered; arrow icon `15×15`, stroke `#FF9A45`, `stroke-width:2.3` (paths: `M5 12h14` + `m12 5 7 7-7 7`).
- **Ghost-glyph watermark:** an absolutely-positioned SVG of the **same icon**, `width:150px; height:150px; right:-24px; bottom:-28px; color: rgba(255,122,0,.055); stroke-width:1; pointer-events:none;` (clipped by the card's `overflow:hidden`).

## Interactions & Behavior

### Hover (the "light up + come forward" effect)
Applied to the card (`.svcCard`). Base transition:
`transition: transform .35s cubic-bezier(.2,.7,.2,1), border-color .35s ease, background .35s ease, box-shadow .45s ease;`

On hover:
- **Lift + scale:** `transform: translateY(-7px) scale(1.014);`
- **Border/background warm-up:** `border-color: rgba(255,122,0,.16); background: rgba(255,122,0,.05);`
- **Glow behind:** `box-shadow: 0 28px 64px -22px rgba(255,90,0,.6), 0 8px 22px -14px rgba(0,0,0,.7);`
- **Watermark drift + brighten:** `.wm { transition: color .4s ease, transform .5s cubic-bezier(.2,.7,.2,1); }` → on hover `color: rgba(255,122,0,.11); transform: translate(-6px,-6px) rotate(-4deg);`
- **Arrow chip:** on hover `background: rgba(255,122,0,.12); border-color: rgba(255,122,0,.5);` and the arrow svg `transform: translateX(3px)` (`transition: transform .3s ease`).

### Animated 1px conic-gradient border (spins on hover)
Uses a masked `::before` pseudo-element and an animated CSS custom angle property. Drop this CSS in a global stylesheet (or a CSS module):

```css
@property --vvA { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes vvSpinBorder { to { --vvA: 360deg; } }

.svcCard::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;          /* matches the card radius */
  padding: 1px;                    /* ring thickness */
  background: conic-gradient(from var(--vvA),
    rgba(255,122,0,0) 0deg,
    #FF7A00 70deg,
    #FFC489 118deg,
    rgba(255,122,0,0) 205deg,
    rgba(255,122,0,0) 360deg);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;  /* punches out the interior → only a 1px ring shows */
  opacity: 0;
  transition: opacity .4s ease;
  pointer-events: none;
  z-index: 3;
}
.svcCard:hover::before { opacity: 1; animation: vvSpinBorder 3.4s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  .svcCard:hover::before { animation: none; }
}
```
Notes: `@property` is required for the angle to animate (supported in all Chromium/Safari 16.4+/Firefox 128+). The card that owns `::before` must be `position: relative` and it works fine with `overflow: hidden`.

### Navigation
Each card is a link to its service page (`<Link href={service.href}>`). Whole card is clickable; the arrow chip is a visual affordance, not a separate target.

### Responsive behavior
The prototype is a fixed 1180px desktop block. For Next.js, collapse to fewer columns on smaller screens (suggestion: 3/2-per-row → 1-per-row under ~640px, 2-per-row up to ~1024px). The row-balancing rule is a desktop concern; on mobile just stack all cards in a single column.

## State Management
None required — this is a presentational component driven by a `services` array (props or CMS data). No client state beyond CSS hover. Safe to render as a Server Component; only the styles are interactive.

## Design Tokens

**Colors**
- Page background: `#0a0a0a`
- Card background: `rgba(255,255,255,0.02)` · Card border: `rgba(255,255,255,0.08)`
- Accent primary: `#FF7A00` · Accent light (icons/arrow): `#FF9A45` · Accent ring highlight: `#FFC489`
- Accent gradient (badges/buttons elsewhere): `linear-gradient(135deg, #FF3B2E, #FF7A00)`
- Icon chip: bg `rgba(255,122,0,0.1)`, border `rgba(255,122,0,0.2)`
- Watermark: `rgba(255,122,0,0.055)` (hover `rgba(255,122,0,0.11)`)
- Hover border: `rgba(255,122,0,0.16)` · Hover bg: `rgba(255,122,0,0.05)`
- Glow shadow: `0 28px 64px -22px rgba(255,90,0,0.6)`
- Text primary: `#fff` · Text muted: `rgba(255,255,255,0.5)`

**Typography** (Google Fonts)
- Display / titles: **Sora** — 700 (titles), 800 (section header)
- Body / descriptions: **Manrope** — 400/500/700
- Labels / mono badges: **JetBrains Mono** — 500/700

**Spacing**
- Row gap & column gap: `16px`
- Card padding: `22px 22px 24px`
- Icon↔text gap: `14px`

**Radii**
- Card: `16px` (compact variant: `14px`) · Icon chip: `12px` · Arrow chip: `9999px`

**Shadows**
- Hover glow: `0 28px 64px -22px rgba(255,90,0,0.6)`, plus depth `0 8px 22px -14px rgba(0,0,0,0.7)`

## Assets — the 7 service icons
Custom 24×24 line icons (`fill:none; stroke:currentColor; stroke-linecap:round; stroke-linejoin:round`). Paste each `<g>`'s children into an icon component. `id` maps to the service.

```html
<!-- website -->
<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 9h18"/><path d="M6 6.75h.01M8.5 6.75h.01"/><path d="M7 13h5M7 16h9"/>

<!-- webshop -->
<circle cx="9.5" cy="20" r="1.1"/><circle cx="18" cy="20" r="1.1"/><path d="M2.5 3.5H5l2.3 11.2a1.4 1.4 0 0 0 1.4 1.1h8.6a1.4 1.4 0 0 0 1.4-1.1L21.5 7.5H6"/>

<!-- onepager -->
<rect x="5.5" y="2.5" width="13" height="19" rx="2"/><path d="M8.5 7h7M8.5 11h7M8.5 15h4.5"/>

<!-- vernieuwen (refresh) -->
<path d="M20.5 8A8.5 8.5 0 0 0 6 5L3.5 7.2"/><path d="M3.5 3v4.2h4.2"/><path d="M3.5 16A8.5 8.5 0 0 0 18 19l2.5-2.2"/><path d="M20.5 21v-4.2h-4.2"/>

<!-- onderhoud (wrench) -->
<path d="M14.7 6.3a4.2 4.2 0 0 0-5.4 5.4L3.2 17.8l3 3 6.1-6.1a4.2 4.2 0 0 0 5.4-5.4l-2.6 2.6-2.6-.7-.7-2.6z"/>

<!-- wordpress (pencil / easy-edit) -->
<path d="M11.5 20H21"/><path d="M16.6 3.4a2 2 0 0 1 2.9 2.9L7 18.8l-4 1 1-4z"/><path d="M4 4.5h5M4 8h3.5"/>

<!-- seo (magnifier + rising bars) -->
<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M8.6 12.5v-1.5M11 12.5V9M13.4 12.5V8"/>
```

## Content (exact copy)
```
website     Website laten maken           Een nieuwe website, snel en gebruiksvriendelijk opgebouwd rond je doelgroep.
webshop     Webshop laten maken           Een webshop die makkelijk te beheren is en klaar is om te verkopen.
onepager    Onepager laten maken          Een strakke onepager voor wie snel online wil staan met een beperkt budget.
vernieuwen  Website vernieuwen            Een verouderde website omgezet naar een snelle, actuele versie.
onderhoud   Website-onderhoud             Doorlopend onderhoud zodat je website veilig, snel en up-to-date blijft.
wordpress   WordPress website laten maken Een WordPress-website die je zelf makkelijk kan bijwerken.
seo         SEO-website laten maken       Een website die vanaf de eerste lijn code gebouwd is om te ranken.
```

## Suggested Next.js implementation (adapt to your styling stack)

`components/subdiensten/icons.tsx`
```tsx
const PATHS: Record<string, React.ReactNode> = {
  website: (<><rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 9h18"/><path d="M6 6.75h.01M8.5 6.75h.01"/><path d="M7 13h5M7 16h9"/></>),
  webshop: (<><circle cx="9.5" cy="20" r="1.1"/><circle cx="18" cy="20" r="1.1"/><path d="M2.5 3.5H5l2.3 11.2a1.4 1.4 0 0 0 1.4 1.1h8.6a1.4 1.4 0 0 0 1.4-1.1L21.5 7.5H6"/></>),
  onepager: (<><rect x="5.5" y="2.5" width="13" height="19" rx="2"/><path d="M8.5 7h7M8.5 11h7M8.5 15h4.5"/></>),
  vernieuwen: (<><path d="M20.5 8A8.5 8.5 0 0 0 6 5L3.5 7.2"/><path d="M3.5 3v4.2h4.2"/><path d="M3.5 16A8.5 8.5 0 0 0 18 19l2.5-2.2"/><path d="M20.5 21v-4.2h-4.2"/></>),
  onderhoud: (<path d="M14.7 6.3a4.2 4.2 0 0 0-5.4 5.4L3.2 17.8l3 3 6.1-6.1a4.2 4.2 0 0 0 5.4-5.4l-2.6 2.6-2.6-.7-.7-2.6z"/>),
  wordpress: (<><path d="M11.5 20H21"/><path d="M16.6 3.4a2 2 0 0 1 2.9 2.9L7 18.8l-4 1 1-4z"/><path d="M4 4.5h5M4 8h3.5"/></>),
  seo: (<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M8.6 12.5v-1.5M11 12.5V9M13.4 12.5V8"/></>),
};

export function SvcIcon({ id, size = 24, strokeWidth = 1.7, ...rest }:
  { id: string; size?: number; strokeWidth?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {PATHS[id]}
    </svg>
  );
}
```

`components/subdiensten/SubdienstenGrid.tsx`
```tsx
import Link from "next/link";
import { SvcIcon } from "./icons";
import styles from "./SubdienstenGrid.module.css";

export type Service = { id: string; name: string; desc: string; href: string };

function rowSizes(n: number): number[] {
  const map: Record<number, number[]> = { 1:[1],2:[2],3:[3],4:[2,2],5:[3,2],6:[3,3],7:[2,3,2] };
  if (map[n]) return map[n];
  const rows: number[] = []; let r = n;
  while (r > 0) { if (r === 4) { rows.push(2,2); r = 0; } else if (r <= 3) { rows.push(r); r = 0; } else { rows.push(3); r -= 3; } }
  return rows;
}
function toRows<T>(items: T[]): T[][] {
  const sizes = rowSizes(items.length); const rows: T[][] = []; let i = 0;
  for (const s of sizes) { rows.push(items.slice(i, i + s)); i += s; }
  return rows;
}

export function SubdienstenGrid({ title = "Subdiensten", services }: { title?: string; services: Service[] }) {
  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.rows}>
        {toRows(services).map((row, ri) => (
          <div className={styles.row} key={ri}>
            {row.map((s) => (
              <Link href={s.href} key={s.id} className={styles.card}>
                <SvcIcon id={s.id} className={styles.wm} size={150} strokeWidth={1} aria-hidden />
                <div className={styles.inner}>
                  <span className={styles.chip}><SvcIcon id={s.id} /></span>
                  <div className={styles.text}>
                    <div className={styles.name}>{s.name}</div>
                    <div className={styles.desc}>{s.desc}</div>
                  </div>
                  <span className={styles.arr}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
```

`components/subdiensten/SubdienstenGrid.module.css`
```css
@property --vvA { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes vvSpinBorder { to { --vvA: 360deg; } }

.wrap { max-width: 1180px; margin: 0 auto; color: #fff; font-family: 'Manrope', sans-serif; }
.title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 32px; letter-spacing: -0.02em; margin: 0 0 24px; }
.rows { display: flex; flex-direction: column; gap: 16px; }
.row { display: flex; gap: 16px; }

.card {
  position: relative; overflow: hidden; flex: 1 1 0; min-width: 0;
  border-radius: 16px; border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.02); padding: 22px 22px 24px; text-decoration: none;
  transition: transform .35s cubic-bezier(.2,.7,.2,1), border-color .35s ease, background .35s ease, box-shadow .45s ease;
}
.card::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: conic-gradient(from var(--vvA), rgba(255,122,0,0) 0deg, #FF7A00 70deg, #FFC489 118deg, rgba(255,122,0,0) 205deg, rgba(255,122,0,0) 360deg);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .4s ease; pointer-events: none; z-index: 3;
}
.card:hover {
  transform: translateY(-7px) scale(1.014);
  border-color: rgba(255,122,0,.16); background: rgba(255,122,0,.05);
  box-shadow: 0 28px 64px -22px rgba(255,90,0,.6), 0 8px 22px -14px rgba(0,0,0,.7);
}
.card:hover::before { opacity: 1; animation: vvSpinBorder 3.4s linear infinite; }

.wm { position: absolute; right: -24px; bottom: -28px; color: rgba(255,122,0,.055); pointer-events: none; transition: color .4s ease, transform .5s cubic-bezier(.2,.7,.2,1); }
.card:hover .wm { color: rgba(255,122,0,.11); transform: translate(-6px,-6px) rotate(-4deg); }

.inner { position: relative; display: flex; align-items: flex-start; gap: 14px; }
.chip { flex: none; width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #FF9A45; background: rgba(255,122,0,.1); border: 1px solid rgba(255,122,0,.2); }
.text { flex: 1; min-width: 0; }
.name { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 17px; letter-spacing: -0.01em; color: #fff; margin-bottom: 6px; }
.desc { font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,.5); }
.arr { flex: none; width: 33px; height: 33px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: #FF9A45; border: 1px solid rgba(255,255,255,.14); transition: background .3s ease, border-color .3s ease; }
.arr svg { transition: transform .3s ease; }
.card:hover .arr { background: rgba(255,122,0,.12); border-color: rgba(255,122,0,.5); }
.card:hover .arr svg { transform: translateX(3px); }

@media (prefers-reduced-motion: reduce) { .card, .card::before, .wm { transition: none; } .card:hover::before { animation: none; } }
@media (max-width: 1024px) { .row { flex-wrap: wrap; } .card { flex-basis: calc(50% - 8px); } }
@media (max-width: 640px)  { .card { flex-basis: 100%; } }
```

Usage:
```tsx
<SubdienstenGrid services={[
  { id: "website",    name: "Website laten maken",           desc: "Een nieuwe website, snel en gebruiksvriendelijk opgebouwd rond je doelgroep.", href: "/diensten/website-laten-maken" },
  { id: "webshop",    name: "Webshop laten maken",           desc: "Een webshop die makkelijk te beheren is en klaar is om te verkopen.",           href: "/diensten/webshop-laten-maken" },
  { id: "onepager",   name: "Onepager laten maken",          desc: "Een strakke onepager voor wie snel online wil staan met een beperkt budget.",   href: "/diensten/onepager-laten-maken" },
  { id: "vernieuwen", name: "Website vernieuwen",            desc: "Een verouderde website omgezet naar een snelle, actuele versie.",              href: "/diensten/website-vernieuwen" },
  { id: "onderhoud",  name: "Website-onderhoud",             desc: "Doorlopend onderhoud zodat je website veilig, snel en up-to-date blijft.",      href: "/diensten/website-onderhoud" },
  { id: "wordpress",  name: "WordPress website laten maken", desc: "Een WordPress-website die je zelf makkelijk kan bijwerken.",                    href: "/diensten/wordpress-website-laten-maken" },
  { id: "seo",        name: "SEO-website laten maken",       desc: "Een website die vanaf de eerste lijn code gebouwd is om te ranken.",            href: "/diensten/seo-website-laten-maken" },
]} />
```

Load the fonts with `next/font/google` (Sora, Manrope, JetBrains Mono) and expose them to the component.

## Files
- `reference/Subdiensten kaarten.dc.html` — the live HTML prototype (open in a browser to see the design + hover interactions). Also contains a "Zo schaalt het blok per aantal" section demonstrating the row-balancing rule at counts 2–6.
- `reference/support.js` — runtime needed only to open the prototype locally. **Not for production.**
