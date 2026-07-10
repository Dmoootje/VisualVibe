# Handoff: Subdienst-hero (VisualVibe)

## Overview
The **hero of a sub-service detail page** for the VisualVibe website (e.g. "Website laten maken", which sits under the "Webdesign" pillar page). It is the pillar's small child pages' header block. This handoff covers the **hero only** — the animated, premium top section that mirrors the look of the Sectoren detail hero.

### Scope — IMPORTANT
This handoff intentionally covers **only the hero block**:
- ✅ Breadcrumb ("← Onderdeel van Webdesign")
- ✅ Tag pill (with pulsing live-dot)
- ✅ Title + intro paragraph
- ✅ Two CTA buttons
- ✅ The big **animated icon on the right** with the revolving rings + rotating conic glow + breathing/glow
- ✅ The "Andere diensten binnen Webdesign" **marquee** (two rows sliding in opposite directions)

**Out of scope / do NOT build from this handoff:** the site header/navigation bar, the "Wat we voor je doen" checklist, the "Gerelateerde diensten" pills, and the bottom CTA band. Those are separate blocks handled elsewhere.

## About the Design Files
`reference/Subdienst hero.dc.html` is a **design reference created in HTML** (a prototype showing the intended look + animations) — **not production code to copy directly**. `support.js` is only the runtime so the prototype opens in a browser. Open the HTML in a browser to see the live hero and its motion. Recreate it in the Next.js app with the app's own conventions (App Router, your styling solution). Do **not** ship the HTML or `support.js`.

The reference has a `dienst` switcher (enum) so you can preview the hero for each of the 7 sub-services; in production the sub-service comes from your route/CMS data.

## Fidelity
**High-fidelity (hifi).** Colours, typography, spacing, radii, motion timings are final — recreate pixel-perfectly.

## Layout
- Full-bleed section on `#0a0a0a`. Section padding `66px 56px 48px`. Inner content `max-width: 1300px; margin: 0 auto`.
- **Two-column grid:** `grid-template-columns: 1.1fr .9fr; gap: 44px; align-items: center;`
  - **Left:** breadcrumb → tag pill → H1 → paragraph → button row.
  - **Right:** the animated icon assembly, centered, `min-height: 440px`.
- Below the grid: a full-width **marquee** block, separated by a top hairline (`margin-top: 44px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,.08)`).
- **Ambient background (two layers, `pointer-events:none`):**
  - Radial glow, top-right: `position:absolute; top:-160px; right:-120px; width:760px; height:760px; background: radial-gradient(circle at center, rgba(255,90,0,.16), transparent 64%)`.
  - Faint grid texture, radially masked: `background-image: linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px); background-size: 54px 54px; mask-image: radial-gradient(ellipse at 72% 34%, #000, transparent 70%)`.

## Components (left column)

### Breadcrumb link
`display:flex; width:fit-content; align-items:center; gap:8px;` · `font-family: 'JetBrains Mono'; font-size:12.5px; font-weight:600; letter-spacing:.03em; color: rgba(255,255,255,.5);` · `margin-bottom:20px`. Left arrow icon 15×15 (`M19 12H5` + `m12 19-7-7 7-7`), `stroke-width:2.2`. Text: `Onderdeel van {pillar}`.

### Tag pill
`display:inline-flex; align-items:center; gap:9px; padding:8px 15px; border-radius:9999px; white-space:nowrap;` · `background: rgba(255,122,0,.1); border:1px solid rgba(255,122,0,.25);` · `font-family:'JetBrains Mono'; font-weight:700; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#FF9A45;` · `margin-bottom:22px`.
- **Live dot:** `width:7px; height:7px; border-radius:9999px; background:#FF7A00;` with a pulsing ring animation:
```css
@keyframes livePulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,122,0,.6); } 70% { box-shadow: 0 0 0 7px rgba(255,122,0,0); } }
.liveDot { animation: livePulse 2.2s ease-out infinite; }
```

### Title (H1)
`font-family:'Sora'; font-weight:800; font-size:60px; line-height:1.02; letter-spacing:-.03em; color:#fff; margin:0 0 22px; text-wrap:balance;`

### Intro paragraph
`font-size:18.5px; line-height:1.6; color:rgba(255,255,255,.64); max-width:500px; margin:0 0 34px; text-wrap:pretty;`

### Buttons (row: `display:flex; flex-wrap:wrap; gap:14px`)
- **Primary:** `padding:15px 28px; border-radius:12px; font-weight:700; font-size:16px; color:#fff; background: linear-gradient(90deg,#FF3B2E,#FF7A00); box-shadow: 0 16px 40px -14px rgba(255,90,0,.85); white-space:nowrap;` with a trailing arrow (17×17, `M5 12h14` + `m12 5 7 7-7 7`).
- **Secondary:** same size, `background: rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.14); color:#fff;`.
- **Hover (both):** `transform: translateY(-2px)` (`transition: transform .25s, box-shadow .25s`). On the primary, the arrow slides: `translateX(5px)`.

## The animated icon (right column) — the "revolving" centerpiece
A centered stack. Container: `position:relative; display:flex; justify-content:center; align-items:center;`.

1. **Rotating conic glow (behind, blurred):** a `500×500` round div,
   `background: conic-gradient(from 0deg, transparent 0deg, rgba(255,122,0,.30) 80deg, transparent 180deg, rgba(255,90,0,.20) 280deg, transparent 360deg); filter: blur(46px);`
   animated `spin 16s linear infinite`.
2. **SVG assembly** (`viewBox="0 0 200 200"`, `width: min(440px, 88%)`), layered from back to front:
   - Radial glow disc `r=99`, `fill=url(#vvHeroGlow)` where `vvHeroGlow` = radial gradient `rgba(255,122,0,.30) → .07 → 0`.
   - **Ring 1:** `circle r=94; fill:none; stroke: rgba(255,122,0,.32); stroke-width:1; stroke-dasharray:"2 9"; stroke-linecap:round;` → `spin 32s linear infinite`.
   - **Ring 2:** `circle r=79; stroke: rgba(255,122,0,.20); stroke-dasharray:"1 11";` → `spin 44s linear infinite reverse`.
   - Inner disc: `circle r=66; fill: rgba(255,255,255,.02); stroke: rgba(255,255,255,.08);`.
   - **The service line-icon**, bright orange (`color:#FF7A00`), placed via `<use href="#svc-{id}" transform="translate(52 52) scale(4)" stroke-width="1.5">` (icon authored at 24×24, scaled ×4 → ~96px, stroke reads ~6px). It **breathes** (subtle scale) and **glows** (pulsing drop-shadow).

### Motion CSS
```css
@keyframes spin { to { transform: rotate(360deg); } }
.ring1 { transform-box: fill-box; transform-origin: center; animation: spin 32s linear infinite; }
.ring2 { transform-box: fill-box; transform-origin: center; animation: spin 44s linear infinite reverse; }
.conic { animation: spin 16s linear infinite; }

.hicon { transform-box: fill-box; transform-origin: center; animation: breathe 6s ease-in-out infinite, hglow 4.2s ease-in-out infinite; }
@keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.045); } }
@keyframes hglow  { 0%,100% { filter: drop-shadow(0 0 5px rgba(255,122,0,.45)); } 50% { filter: drop-shadow(0 0 22px rgba(255,122,0,.85)); } }
```
`transform-box: fill-box; transform-origin: center;` is required so SVG elements rotate/scale around their own centre.

## The marquee ("Andere diensten binnen {pillar}")
Two horizontal rows of pills for the **other sub-services** (all sub-services except the current one), sliding in opposite directions and pausing on hover. Each row's list is **duplicated** (`items.concat(items)`) so the `translateX(-50%)` loop is seamless.

- **Label:** `font-family:'JetBrains Mono'; font-size:11.5px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.42);`
- **Pill:** `display:inline-flex; align-items:center; gap:13px; padding:13px 24px 13px 15px; border-radius:9999px; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.02);` — icon chip `36×36; radius:10px; bg:rgba(255,122,0,.1); border:rgba(255,122,0,.2);` (icon 19×19, `#FF9A45`) + name `15.5px/600, rgba(255,255,255,.85), white-space:nowrap`.
- **Hover pill:** `border-color:rgba(255,122,0,.45); background:rgba(255,122,0,.06); transform:translateY(-2px)`.

```css
.vv-mq { overflow:hidden; -webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent); mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent); }
.vv-mq-track { display:flex; gap:14px; width:max-content; will-change:transform; }
.vv-mq-l { animation: mqL 40s linear infinite; }
.vv-mq-r { animation: mqR 40s linear infinite; }
.vv-mq:hover .vv-mq-track { animation-play-state: paused; }
@keyframes mqL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes mqR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
```

## Interactions & Behavior
- All motion is CSS-only (rings, conic glow, breathing icon, live dot, marquee). No JS needed for the visuals.
- Marquee pauses on hover; pills lift on hover; buttons lift on hover.
- **Respect `prefers-reduced-motion`:** disable all the above animations (`@media (prefers-reduced-motion: reduce){ * { animation:none !important; } }` in the prototype — in your app scope it to this component).
- Breadcrumb → pillar page; CTAs → quote / cases; marquee pills → sibling sub-service pages.

## State Management
None. Presentational; render as a Server Component. The current sub-service and the sibling list come from route/CMS data (`hero` + `others = all.filter(s => s.id !== hero.id)`).

## Responsive behavior
Prototype is a fixed 1440px desktop. Suggestion: below ~900px stack to one column (icon assembly above or below the text, scaled down ~320px); keep the marquee full-bleed. Reduce H1 to ~`clamp(36px, 8vw, 60px)`.

## Design Tokens
- Page bg `#0a0a0a` · Accent `#FF7A00` · Accent light `#FF9A45` · Accent red (gradient start) `#FF3B2E` · Glow red `rgba(255,90,0,*)`
- Surfaces: `rgba(255,255,255,.02)` · Borders: `rgba(255,255,255,.08–.14)` · Accent surfaces `rgba(255,122,0,.1)` / borders `rgba(255,122,0,.2–.25)`
- Text: `#fff` · muted `rgba(255,255,255,.5–.64)`
- Radii: buttons `12px` · icon chip `10px` · pills/dot `9999px`
- Fonts (Google): **Sora** (700/800 display), **Manrope** (400–800 body), **JetBrains Mono** (600/700 labels)

## Assets — the 7 service icons
24×24 line icons (`fill:none; stroke:currentColor; stroke-linecap:round; stroke-linejoin:round`). `id` maps to the sub-service.

```html
<!-- website -->    <rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 9h18"/><path d="M6 6.75h.01M8.5 6.75h.01"/><path d="M7 13h5M7 16h9"/>
<!-- webshop -->    <circle cx="9.5" cy="20" r="1.1"/><circle cx="18" cy="20" r="1.1"/><path d="M2.5 3.5H5l2.3 11.2a1.4 1.4 0 0 0 1.4 1.1h8.6a1.4 1.4 0 0 0 1.4-1.1L21.5 7.5H6"/>
<!-- onepager -->   <rect x="5.5" y="2.5" width="13" height="19" rx="2"/><path d="M8.5 7h7M8.5 11h7M8.5 15h4.5"/>
<!-- vernieuwen --> <path d="M20.5 8A8.5 8.5 0 0 0 6 5L3.5 7.2"/><path d="M3.5 3v4.2h4.2"/><path d="M3.5 16A8.5 8.5 0 0 0 18 19l2.5-2.2"/><path d="M20.5 21v-4.2h-4.2"/>
<!-- onderhoud -->  <path d="M14.7 6.3a4.2 4.2 0 0 0-5.4 5.4L3.2 17.8l3 3 6.1-6.1a4.2 4.2 0 0 0 5.4-5.4l-2.6 2.6-2.6-.7-.7-2.6z"/>
<!-- wordpress -->  <path d="M11.5 20H21"/><path d="M16.6 3.4a2 2 0 0 1 2.9 2.9L7 18.8l-4 1 1-4z"/><path d="M4 4.5h5M4 8h3.5"/>
<!-- seo -->        <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M8.6 12.5v-1.5M11 12.5V9M13.4 12.5V8"/>
```

## Content (per sub-service: id · name · tag · intro)
```
website     Website laten maken           · Websites op maat      · Of je nu start met je eerste website of een verouderde site vervangt: we bouwen een snelle, duidelijke website die bezoekers omzet in klanten.
webshop     Webshop laten maken           · Verkopen online       · Een webshop die makkelijk te beheren is en klaar is om te verkopen — met een soepel bestelproces en veilige betaalintegraties.
onepager    Onepager laten maken          · Snel online           · Een strakke onepager voor wie snel online wil staan met een beperkt budget, zonder in te boeten op uitstraling.
vernieuwen  Website vernieuwen            · Redesign & migratie   · Een verouderde website omgezet naar een snelle, actuele versie — met behoud van je posities in Google.
onderhoud   Website-onderhoud             · Zorgeloos online      · Doorlopend onderhoud zodat je website veilig, snel en up-to-date blijft — zonder dat jij ernaar om hoeft te kijken.
wordpress   WordPress website laten maken · Zelf beheerbaar       · Een WordPress-website die je zelf makkelijk kan bijwerken, met een flexibel CMS dat met je meegroeit.
seo         SEO-website laten maken       · Gebouwd om te ranken  · Een website die vanaf de eerste lijn code gebouwd is om te ranken — technisch, snel en vindbaar in Google én AI-zoekmachines.
```
Pillar for all of the above: **Webdesign**.

## Suggested Next.js implementation (adapt to your styling stack)

Reuse the `SvcIcon` component from the Subdiensten handoff (same 7 icons). Then:

`components/subdienst/SubdienstHero.tsx`
```tsx
import Link from "next/link";
import { SvcIcon } from "../subdiensten/icons";
import styles from "./SubdienstHero.module.css";

export type SubService = { id: string; name: string; tag: string; desc: string; href: string };

export function SubdienstHero({
  pillar, pillarHref, hero, siblings,
}: { pillar: string; pillarHref: string; hero: SubService; siblings: SubService[] }) {
  const top = [...siblings, ...siblings];
  const bottom = [...siblings].reverse().concat([...siblings].reverse());
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.grid} aria-hidden />

      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href={pillarHref} className={styles.crumb}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Onderdeel van {pillar}
          </Link>
          <span className={styles.tag}><span className={styles.dot} />{hero.tag}</span>
          <h1 className={styles.title}>{hero.name}</h1>
          <p className={styles.desc}>{hero.desc}</p>
          <div className={styles.btns}>
            <Link href="/offerte" className={`${styles.btn} ${styles.btnPrimary}`}>
              Offerte aanvragen
              <svg className={styles.ar} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link href="/realisaties" className={`${styles.btn} ${styles.btnGhost}`}>Bekijk realisaties</Link>
          </div>
        </div>

        <div className={styles.iconWrap}>
          <div className={`${styles.conic} conic`} aria-hidden />
          <svg viewBox="0 0 200 200" className={styles.iconSvg} aria-hidden>
            <defs>
              <radialGradient id="vvHeroGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,122,0,.30)" />
                <stop offset="55%" stopColor="rgba(255,122,0,.07)" />
                <stop offset="100%" stopColor="rgba(255,122,0,0)" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="99" fill="url(#vvHeroGlow)" />
            <circle className="ring1" cx="100" cy="100" r="94" fill="none" stroke="rgba(255,122,0,.32)" strokeWidth="1" strokeDasharray="2 9" strokeLinecap="round" />
            <circle className="ring2" cx="100" cy="100" r="79" fill="none" stroke="rgba(255,122,0,.20)" strokeWidth="1" strokeDasharray="1 11" strokeLinecap="round" />
            <circle cx="100" cy="100" r="66" fill="rgba(255,255,255,.02)" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
            <g className="hicon" style={{ color: "#FF7A00" }}>
              <use href={`#svc-${hero.id}`} transform="translate(52 52) scale(4)" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>

      <div className={styles.mq}>
        <p className={styles.mqLabel}>Andere diensten binnen {pillar}</p>
        {[["vv-mq-l", top], ["vv-mq-r", bottom]].map(([cls, list], i) => (
          <div className={styles.mqMask} key={i}>
            <div className={`${styles.mqTrack} ${cls}`}>
              {(list as SubService[]).map((s, j) => (
                <Link href={s.href} key={s.id + j} className={styles.pill}>
                  <span className={styles.pillIcon}><SvcIcon id={s.id} size={19} /></span>
                  <span className={styles.pillName}>{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

`components/subdienst/SubdienstHero.module.css` — put the icon SVG symbols (the 7 `<g>` from Assets) once in a shared hidden `<svg><defs>…</defs></svg>` in your layout so `<use href="#svc-…">` resolves. Then:
```css
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.045); } }
@keyframes hglow  { 0%,100% { filter: drop-shadow(0 0 5px rgba(255,122,0,.45)); } 50% { filter: drop-shadow(0 0 22px rgba(255,122,0,.85)); } }
@keyframes livePulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,122,0,.6); } 70% { box-shadow: 0 0 0 7px rgba(255,122,0,0); } }
@keyframes mqL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes mqR { from { transform: translateX(-50%); } to { transform: translateX(0); } }

.hero { position: relative; overflow: hidden; padding: 66px 56px 48px; background: #0a0a0a; color: #fff; }
.glow { position: absolute; top: -160px; right: -120px; width: 760px; height: 760px; pointer-events: none; background: radial-gradient(circle at center, rgba(255,90,0,.16), transparent 64%); }
.grid { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px); background-size: 54px 54px; -webkit-mask-image: radial-gradient(ellipse at 72% 34%, #000, transparent 70%); mask-image: radial-gradient(ellipse at 72% 34%, #000, transparent 70%); }
.inner { position: relative; z-index: 2; max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 1.1fr .9fr; gap: 44px; align-items: center; }

.crumb { display: flex; width: fit-content; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 600; letter-spacing: .03em; color: rgba(255,255,255,.5); margin-bottom: 20px; text-decoration: none; }
.tag { display: inline-flex; align-items: center; gap: 9px; padding: 8px 15px; border-radius: 9999px; white-space: nowrap; background: rgba(255,122,0,.1); border: 1px solid rgba(255,122,0,.25); font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: #FF9A45; margin-bottom: 22px; }
.dot { width: 7px; height: 7px; border-radius: 9999px; background: #FF7A00; animation: livePulse 2.2s ease-out infinite; }
.title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 60px; line-height: 1.02; letter-spacing: -.03em; margin: 0 0 22px; text-wrap: balance; }
.desc { font-size: 18.5px; line-height: 1.6; color: rgba(255,255,255,.64); max-width: 500px; margin: 0 0 34px; text-wrap: pretty; }
.btns { display: flex; flex-wrap: wrap; gap: 14px; }
.btn { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 16px; color: #fff; padding: 15px 28px; border-radius: 12px; white-space: nowrap; text-decoration: none; transition: transform .25s ease, box-shadow .25s ease; }
.btn:hover { transform: translateY(-2px); }
.btnPrimary { background: linear-gradient(90deg, #FF3B2E, #FF7A00); box-shadow: 0 16px 40px -14px rgba(255,90,0,.85); }
.btnGhost { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.14); }
.ar { transition: transform .3s ease; }
.btnPrimary:hover .ar { transform: translateX(5px); }

.iconWrap { position: relative; display: flex; justify-content: center; align-items: center; min-height: 440px; }
.conic { position: absolute; width: 500px; height: 500px; border-radius: 9999px; pointer-events: none; filter: blur(46px); background: conic-gradient(from 0deg, transparent 0deg, rgba(255,122,0,.30) 80deg, transparent 180deg, rgba(255,90,0,.20) 280deg, transparent 360deg); animation: spin 16s linear infinite; }
.iconSvg { position: relative; width: min(440px, 88%); height: auto; }
:global(.ring1) { transform-box: fill-box; transform-origin: center; animation: spin 32s linear infinite; }
:global(.ring2) { transform-box: fill-box; transform-origin: center; animation: spin 44s linear infinite reverse; }
:global(.hicon) { transform-box: fill-box; transform-origin: center; animation: breathe 6s ease-in-out infinite, hglow 4.2s ease-in-out infinite; }

.mq { position: relative; z-index: 2; max-width: 1300px; margin: 44px auto 0; padding-top: 30px; border-top: 1px solid rgba(255,255,255,.08); }
.mqLabel { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.42); margin: 0 0 18px; }
.mqMask { overflow: hidden; margin-bottom: 14px; -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); }
.mqTrack { display: flex; gap: 14px; width: max-content; will-change: transform; }
:global(.vv-mq-l) { animation: mqL 40s linear infinite; }
:global(.vv-mq-r) { animation: mqR 40s linear infinite; }
.mqMask:hover .mqTrack { animation-play-state: paused; }
.pill { flex: none; display: inline-flex; align-items: center; gap: 13px; padding: 13px 24px 13px 15px; border-radius: 9999px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.02); text-decoration: none; transition: border-color .25s ease, background .25s ease, transform .25s ease; }
.pill:hover { border-color: rgba(255,122,0,.45); background: rgba(255,122,0,.06); transform: translateY(-2px); }
.pillIcon { flex: none; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #FF9A45; background: rgba(255,122,0,.1); border: 1px solid rgba(255,122,0,.2); }
.pillName { font-size: 15.5px; font-weight: 600; color: rgba(255,255,255,.85); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .conic, :global(.ring1), :global(.ring2), :global(.hicon), .dot, :global(.vv-mq-l), :global(.vv-mq-r) { animation: none !important; }
}
@media (max-width: 900px) {
  .inner { grid-template-columns: 1fr; }
  .title { font-size: clamp(36px, 8vw, 60px); }
  .iconSvg { width: min(320px, 80%); }
}
```
Load fonts with `next/font/google` (Sora, Manrope, JetBrains Mono).

## Files
- `reference/Subdienst hero.dc.html` — hero-only HTML prototype (open in a browser to see the motion; has a `dienst` switcher for all 7 sub-services).
- `reference/support.js` — runtime to open the prototype locally. **Not for production.**
