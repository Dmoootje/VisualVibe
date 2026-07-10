# Handoff: Responsive "Diensten" navigatie + mega-menu (VisualVibe)

## Overview
The site's primary navigation with a **responsive Diensten menu**. It is **one component** that adapts to every device:
- **Desktop (≥1000px):** a hover-driven **mega-menu** — a left rail of main services (pillars) and a right panel that expands sideways to reveal that pillar's sub-services + a featured CTA card. Switching pillars cross-fades the content.
- **Tablet & mobile (<1000px):** the same menu becomes a **hamburger → full-height drawer** that slides in from the right, with a **nested accordion** (tap Diensten → pillars → tap a pillar → its sub-services slide open).

## About the Design Files
`reference/Diensten megamenu.dc.html` is a **design reference created in HTML** (an interactive prototype showing look + motion + responsive behaviour) — **not production code to copy directly**. `support.js` is only the runtime so the prototype opens in a browser. Open it and **drag the window narrower/wider** to see it switch between mega-menu and drawer at the 1000px breakpoint. Do **not** ship the HTML or `support.js`.

Recreate it in the Next.js app with its own conventions (App Router, your styling solution). A ready-to-adapt React implementation is included below.

## Fidelity
**High-fidelity (hifi).** Colours, type, spacing, radii, motion timings, and the responsive breakpoint are final — recreate pixel-perfectly.

## Breakpoint & modes
- Single breakpoint at **1000px** (`@media (max-width:1000px)`). ≥1000px → mega-menu; <1000px → hamburger + drawer. Tablet-portrait therefore uses the touch-friendly drawer.
- The prototype uses viewport media queries. On the desktop mega, hover opens it; a **click also toggles** it (so large touch laptops work).

---

## DESKTOP — mega-menu

### Nav bar
`display:flex; align-items:center; justify-content:space-between; gap:20px; padding:20px clamp(20px,4vw,56px); border-bottom:1px solid rgba(255,255,255,.06);`
- Logo "Visual**Vibe**" — Sora 800, `clamp(20px,3vw,24px)`, the "Vibe" in `#FF7A00`.
- Center links (`.dtCenter`, hidden <1000px): home icon, **Diensten** (with chevron, opens mega), Regio (chevron), Realisaties, Sectoren, Kennisbank, Over ons, Contact — weight 600, 15px, `rgba(255,255,255,.85)`.
- Right (`.dtRight`, hidden <1000px): user icon + "Offerte aanvragen" button (gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)`, `padding:11px 20px; radius:10px; box-shadow:0 12px 30px -12px rgba(255,90,0,.8)`).

### Diensten trigger
`Diensten` label + chevron (12px, stroke `#FF7A00`). The wrapper (`.megaWrap`) is `position:relative` and owns `onMouseEnter`/`onMouseLeave`; the chevron rotates 180° while open (`.megaWrap.on .navChev`). An invisible `::after` bridge (`left:0; right:-40px; top:100%; height:18px`) keeps hover alive across the gap to the panel.

### Mega panel
Anchored `position:absolute; top:calc(100% + 14px); left:0`. Open/close animation:
```css
.mega { opacity:0; visibility:hidden; transform:translateY(-10px) scale(.98); transform-origin:top left;
        transition:opacity .26s ease, transform .36s cubic-bezier(.2,.8,.2,1), visibility .26s; }
.mega.open { opacity:1; visibility:visible; transform:none; }
```
Panel shell: `display:flex; border-radius:18px; border:1px solid rgba(255,255,255,.1); background:rgba(16,14,13,.96); backdrop-filter:blur(16px); box-shadow:0 40px 90px -30px rgba(0,0,0,.9), 0 0 0 1px rgba(255,122,0,.05); overflow:hidden;`

**Left rail** (`width:322px; padding:16px; border-right:1px solid rgba(255,255,255,.07)`):
- Eyebrow "ONZE DIENSTEN" — JetBrains Mono, 10.5px/700, `letter-spacing:.16em`, uppercase, `rgba(255,255,255,.4)`.
- Rail items (one per pillar): `display:flex; align-items:center; gap:13px; padding:11px 12px; border-radius:12px; border:1px solid transparent;` — icon chip 38px (radius 10) + name (Sora 700, 15px) + tag (11.5px, `rgba(255,255,255,.42)`) + chevron.
  - **Active** state (hovered pillar): row `background:rgba(255,122,0,.08); border-color:rgba(255,122,0,.28)`; chip `background:rgba(255,122,0,.16); border-color:rgba(255,122,0,.3)`; icon + chevron `#FF7A00`; name `#fff`.
  - Rail items **stagger in** on open: `railIn` keyframe (`opacity 0→1; translateX(-10px)→0`), `nth-child` delays `.02s → .30s`.

**Right sub-panel** — expands sideways from width 0:
```css
.sub { width:0; opacity:0; overflow:hidden; transition:width .42s cubic-bezier(.2,.8,.2,1), opacity .3s ease; }
.sub.show { width:560px; opacity:1; }
.subInner { opacity:0; transform:translateX(10px); transition:opacity .32s ease, transform .38s cubic-bezier(.2,.8,.2,1); }
.subInner.on { opacity:1; transform:none; }   /* toggled off→on on every pillar switch → cross-fade */
```
Inside (`width:560px; padding:20px 22px`): header (pillar name Sora 800 19px + tag + "Overzicht →" link) · a **2-column grid** of sub-service rows (`.subItem`: `padding:10px 12px; radius:11px; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.02)`, 30px icon chip + name 13.5px/600 + chevron; hover → `background:rgba(255,122,0,.06); border-color:rgba(255,122,0,.35); translateX(3px)`) · a **featured CTA card** (`.featCard`: gradient-tinted, 48px pillar-icon chip + "Klaar voor {pillar}?" + gradient "Offerte" button).
- Sub-items **stagger in**: `itemIn` keyframe (`opacity 0→1; translateY(8px)→0`), `nth-child` delays `.04s → .28s`.

**Cross-fade on pillar switch:** on hover of a new pillar, set `active` immediately with `fade=false`, then flip `fade=true` after ~24ms → `.subInner` re-runs its opacity/transform transition. Panel width stays put; only content fades.

---

## MOBILE / TABLET — hamburger + drawer

### Hamburger (`.mbBtn`, shown <1000px)
`46×46; border-radius:12px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.03)`; 3-line icon. Opens the drawer.

### Drawer
```css
.backdrop { position:fixed; inset:0; background:rgba(0,0,0,.62); opacity:0; visibility:hidden; transition:opacity .3s, visibility .3s; z-index:70; }
.drawerRoot.open .backdrop { opacity:1; visibility:visible; }
.drawerPanel { position:fixed; top:0; right:0; height:100%; width:min(420px,90%); background:#0e0d0c;
  border-left:1px solid rgba(255,255,255,.08); transform:translateX(102%);
  transition:transform .44s cubic-bezier(.2,.85,.2,1); z-index:71;
  display:flex; flex-direction:column; box-shadow:-40px 0 90px -30px rgba(0,0,0,.95); }
.drawerRoot.open .drawerPanel { transform:none; }
```
Structure: header (logo + close ✕ button) · scrollable list (`flex:1; overflow-y:auto`) · footer (`border-top`) with "Offerte aanvragen" (gradient) + "Inloggen" (ghost).

### Accordion (the animated reveal) — uses the grid-rows trick
```css
.macc { display:grid; transition:grid-template-rows .42s cubic-bezier(.2,.8,.2,1); }
/* open → grid-template-rows:1fr ; closed → 0fr ; child wrapper has overflow:hidden */
.mchev { transition:transform .34s cubic-bezier(.2,.8,.2,1); } /* rotates 180° when open */
```
- Top row **Diensten** toggles `mNav` → the pillars list animates open (`grid-template-rows` 0fr↔1fr).
- Each **pillar row** toggles `mExp` (single-open accordion) → its sub-services list animates open the same way. Active pillar row tints `background:rgba(255,122,0,.06)`, chip + chevron go orange.
- Pillar rows: 34px icon chip + name (Sora 700 15px) + tag + chevron. Sub rows: 26px chip + name 13.5px/600 + chevron. Rows have `:active { background:rgba(255,122,0,.08) }` for tap feedback.
- Other items (Home, Regio, Realisaties, Sectoren, Kennisbank, Over ons, Contact) are plain rows, Sora 700 17px, `padding:15px 12px`.
- **Tap targets** are all ≥44px tall.

---

## Interactions & Behavior
- Desktop: hover opens mega (click also toggles); hovering a rail item sets the active pillar (cross-fade); leaving the wrapper closes and resets.
- Mobile: hamburger opens drawer; backdrop or ✕ closes; Diensten + each pillar are independent accordions (one pillar open at a time).
- All motion is CSS transitions/keyframes driven by state classes. **Respect `prefers-reduced-motion`** (prototype disables all animation/transition under that query — scope it to this component in your app).
- Recommended app behaviour: close the drawer on route change; trap focus while the drawer is open; `Escape` closes; lock body scroll while open.

## State Management
Local UI state only:
- Desktop: `open` (bool), `active` (pillar index | null), `fade` (bool, drives cross-fade).
- Mobile: `drawerOpen` (bool), `mNav` (bool, Diensten section open — default true), `mExp` (pillar index | null — default 0).
Data (pillars + subs) comes from your route/CMS.

## Design Tokens
- Bg `#0a0a0a` · panel `rgba(16,14,13,.96)` · drawer `#0e0d0c`
- Accent `#FF7A00` · light `#FF9A45` · gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)` · glow `rgba(255,90,0,*)`
- Surfaces `rgba(255,255,255,.02–.05)` · borders `rgba(255,255,255,.06–.14)` · accent surfaces `rgba(255,122,0,.08–.16)` / borders `rgba(255,122,0,.2–.3)`
- Text `#fff` · muted `rgba(255,255,255,.42–.55)`
- Radii: panel 18px · cards 12–14px · rows 10–12px · chips 8–10px · buttons 10–12px · pills 9999px
- Fonts (Google): **Sora** (700/800), **Manrope** (400–800), **JetBrains Mono** (600/700)
- Breakpoint: **1000px**. Motion easings: open `cubic-bezier(.2,.8,.2,1)`; durations 0.26–0.44s.

## Assets — icons
Main pillars use: `svc-website` (Webdesign), `svc-seo` (SEO), plus 6 new 24×24 line icons `pd-camera, pd-film, pd-drone, pd-cube, pd-mic, pd-cap`. Webdesign's sub-services reuse the `svc-*` set. All icons are `fill:none; stroke:currentColor; stroke-linecap/linejoin:round`. Copy the `<g>` symbol bodies verbatim from `reference/Diensten megamenu.dc.html` (the `<defs>` block near the top) into a single shared hidden `<svg><defs>…</defs></svg>` in your app layout, then reference with `<use href="#id">`. (The 7 `svc-*` paths are also documented in the Subdiensten handoff.)

New pillar icons (paths):
```html
<!-- pd-camera -->  <path d="M4 7.5h3l1.8-2h6.4L17 7.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/>
<!-- pd-film -->    <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9.5h18M8 5v14M16 5v14"/><path d="M10.5 11.2v3.6l3-1.8z"/>
<!-- pd-drone -->   <circle cx="5.5" cy="5.5" r="2.4"/><circle cx="18.5" cy="5.5" r="2.4"/><circle cx="5.5" cy="18.5" r="2.4"/><circle cx="18.5" cy="18.5" r="2.4"/><rect x="9" y="9" width="6" height="6" rx="1.5"/><path d="M7.4 7.4 9 9M16.6 7.4 15 9M7.4 16.6 9 15M16.6 16.6 15 15"/>
<!-- pd-cube -->    <path d="M12 2.5 21 7v10l-9 4.5L3 17V7z"/><path d="M12 12.5V21M12 12.5 21 7M12 12.5 3 7"/>
<!-- pd-mic -->     <rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v4M8.5 21h7"/>
<!-- pd-cap -->     <path d="M12 4 2.5 9 12 14l9.5-5z"/><path d="M6.5 11.3V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.7"/><path d="M21.5 9v5"/>
```

## Content (pillars → sub-services)
```
Webdesign        · Websites & webshops      → Website laten maken, Webshop laten maken, Onepager laten maken, Website vernieuwen, Website-onderhoud, WordPress website, SEO-website
SEO              · Vindbaar in Google & AI  → Technische SEO, Lokale SEO, GEO / AI-zoekmachines, Linkbuilding, SEO-audit, Content & copywriting
Fotografie       · Beeld dat verkoopt       → Bedrijfsreportage, Productfotografie, Portret & team, Eventfotografie, Vastgoedfotografie
Videografie      · Bewegend beeld           → Bedrijfsvideo, Productvideo, Aftermovie, Reels & shorts, Animatievideo
Drone & FPV      · Vanuit de lucht          → Luchtfotografie, FPV-video, Vastgoed vanuit de lucht, Inspectievluchten
3D, VR & AR      · Immersieve ervaringen    → 3D-visualisatie, Virtual tours, AR-ervaringen, Productconfigurators
Podcasting       · Jouw stem, overal        → Podcast-opname, Videopodcast, Editing & montage, Distributie
Masterclasses    · Kennis die groeit        → SEO-masterclass, Social media, Contentcreatie, AI voor ondernemers
```
Note: only **Webdesign** and **SEO** are the real service list so far — the other pillars' sub-services are plausible placeholders; confirm/replace with the final list before shipping.

## Suggested Next.js implementation (adapt to your stack)

Data:
```ts
// nav-data.ts
export type Sub = { name: string; href: string; icon: string };
export type Pillar = { id: string; name: string; tag: string; icon: string; href: string; subs: Sub[] };
export const PILLARS: Pillar[] = [ /* …from the table above… */ ];
```

Client component (`"use client"`, since it holds hover/drawer state):
```tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PILLARS } from "./nav-data";
import styles from "./Nav.module.css";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [fade, setFade] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [mNav, setMNav] = useState(true);
  const [mExp, setMExp] = useState<number | null>(0);

  function pick(i: number) { setActive(i); setFade(false); requestAnimationFrame(() => setFade(true)); }
  function closeMega() { setOpen(false); setActive(null); setFade(false); }
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);

  const ap = active != null ? PILLARS[active] : null;

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>Visual<span>Vibe</span></div>

      {/* desktop */}
      <div className={styles.dtCenter}>
        <div className={`${styles.megaWrap} ${open ? styles.on : ""}`}
             onMouseEnter={() => setOpen(true)} onMouseLeave={closeMega}>
          <button className={styles.trigger} onClick={() => setOpen(o => !o)}>
            Diensten <svg className={styles.navChev} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF7A00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div className={`${styles.mega} ${open ? styles.open : ""}`}>
            <div className={styles.panel}>
              <div className={styles.rail}>
                <p className={styles.eyebrow}>Onze diensten</p>
                {PILLARS.map((p, i) => (
                  <div key={p.id} className={`${styles.railItem} ${i === active ? styles.act : ""}`}
                       onMouseEnter={() => pick(i)} onClick={() => pick(i)}>
                    <span className={styles.chip}><Ico id={p.icon} s={20} /></span>
                    <span className={styles.grow}><b>{p.name}</b><small>{p.tag}</small></span>
                    <Chev className={styles.rchev} />
                  </div>
                ))}
              </div>
              <div className={`${styles.sub} ${ap ? styles.show : ""}`}>
                <div className={`${styles.subInner} ${fade ? styles.on : ""}`}>
                  {ap && (<>
                    <div className={styles.subHead}><div><b>{ap.name}</b><small>{ap.tag}</small></div>
                      <Link href={ap.href} className={styles.ovl}>Overzicht →</Link></div>
                    <div className={styles.subGrid}>
                      {ap.subs.map(s => (
                        <Link key={s.name} href={s.href} className={styles.subItem}>
                          <span className={styles.chipSm}><Ico id={s.icon} s={16} /></span>
                          <span className={styles.grow}>{s.name}</span><Chev className={styles.schev} dim />
                        </Link>
                      ))}
                    </div>
                    <Link href={ap.href} className={styles.feat}>
                      <span className={styles.featIco}><Ico id={ap.icon} s={26} /></span>
                      <span className={styles.grow}><b>Klaar voor {ap.name}?</b><small>Vraag vrijblijvend een voorstel en vaste prijs aan.</small></span>
                      <span className={styles.featBtn}>Offerte →</span>
                    </Link>
                  </>)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <span>Regio ▾</span><span>Realisaties</span><span>Sectoren</span><span>Kennisbank</span><span>Over ons</span><span>Contact</span>
      </div>
      <div className={styles.dtRight}>{/* user icon + Offerte button */}</div>

      {/* mobile trigger */}
      <button className={styles.mbBtn} onClick={() => setDrawer(true)} aria-label="Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>

      {/* drawer */}
      <div className={`${styles.drawerRoot} ${drawer ? styles.open : ""}`}>
        <div className={styles.backdrop} onClick={() => setDrawer(false)} />
        <aside className={styles.drawerPanel}>
          <header className={styles.dHead}><div className={styles.logo}>Visual<span>Vibe</span></div>
            <button onClick={() => setDrawer(false)} aria-label="Sluiten">✕</button></header>
          <div className={styles.dList}>
            <div className={styles.mrow}>Home</div>
            <div className={styles.mrow} onClick={() => setMNav(v => !v)}>Diensten <Chev className={styles.mchev} rot={mNav} /></div>
            <div className={styles.macc} style={{ gridTemplateRows: mNav ? "1fr" : "0fr" }}>
              <div className={styles.accInner}>
                {PILLARS.map((p, i) => (
                  <div key={p.id} className={styles.mPill}>
                    <div className={`${styles.mrow} ${i === mExp ? styles.act : ""}`} onClick={() => setMExp(x => x === i ? null : i)}>
                      <span className={styles.chip}><Ico id={p.icon} s={18} /></span>
                      <span className={styles.grow}><b>{p.name}</b><small>{p.tag}</small></span>
                      <Chev className={styles.mchev} rot={i === mExp} />
                    </div>
                    <div className={styles.macc} style={{ gridTemplateRows: i === mExp ? "1fr" : "0fr" }}>
                      <div className={styles.accInner}>
                        {p.subs.map(s => (
                          <Link key={s.name} href={s.href} className={styles.mSub}>
                            <span className={styles.chipSm}><Ico id={s.icon} s={14} /></span>{s.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {["Regio","Realisaties","Sectoren","Kennisbank","Over ons","Contact"].map(t => <div key={t} className={styles.mrow}>{t}</div>)}
          </div>
          <footer className={styles.dFoot}>{/* Offerte + Inloggen buttons */}</footer>
        </aside>
      </div>
    </nav>
  );
}

// small helpers using the shared <use> symbols
function Ico({ id, s = 20 }: { id: string; s?: number }) {
  return <svg viewBox="0 0 24 24" width={s} height={s} fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><use href={`#${id}`} /></svg>;
}
function Chev({ className = "", dim = false, rot = false }: { className?: string; dim?: boolean; rot?: boolean }) {
  return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dim ? "rgba(255,255,255,.3)" : "currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={rot ? { transform: "rotate(180deg)" } : undefined}><path d="m9 6 6 6-6 6"/></svg>;
}
```

`Nav.module.css` — port every rule from the `<style>` block in `reference/Diensten megamenu.dc.html` (all the classes referenced above already exist there verbatim: `.mega/.mega.open`, `.railItem` + stagger, `.sub/.sub.show`, `.subInner/.on`, `.subItem`, `.featCard`, `.backdrop`, `.drawerPanel`, `.macc`, `.mchev`, the `@media (max-width:1000px)` switch, and the `@keyframes`). Keep the `@media (prefers-reduced-motion: reduce)` block. Load fonts via `next/font/google` (Sora, Manrope, JetBrains Mono).

## Files
- `reference/Diensten megamenu.dc.html` — the interactive responsive prototype (resize the window to cross the 1000px breakpoint). Contains the full icon `<defs>`, all animation CSS, and both modes.
- `reference/support.js` — runtime to open the prototype locally. **Not for production.**
