# Handoff: App-first mobiel/tablet-menu (VisualVibe)

## Overview
The **navigation menu** for the VisualVibe website, in one component that serves all breakpoints. On **desktop** it is the hover mega-menu (Diensten rail → sub-services slide-out). At **≤1000px (tablet + mobile)** it switches to an **app-first push-navigation drawer** that keeps the site's rich cards — service cards and animated **region map cards** — instead of a flat list.

This handoff focuses on the **mobile/tablet drawer** (the desktop mega-menu was already delivered in `design_handoff_diensten_megamenu` and is unchanged here).

### Scope
- ✅ Responsive switch (desktop mega ↔ mobile drawer) at 1000px.
- ✅ App-first push-navigation drawer: main menu → Diensten (service cards) → sub-services (drill-down) → back; Regio (animated map cards).
- ✅ Backdrop, slide-in panel, iOS-style push transitions.
- ⛔ The faux page content behind the nav (hero copy) is only demo context — not part of the deliverable.

## About the design files
`reference/Diensten megamenu.dc.html` is a **design reference built in HTML** — not production code to copy directly. `support.js` renders the prototype (do not ship it); `mapdata.js` provides the region map geometry and IS a real runtime asset. Open the HTML, shrink the browser below 1000px, and tap the hamburger to explore the drawer.

## Fidelity
**High-fidelity.** Colours, type, spacing, radii, transitions and the navigation model are final.

---

## Behaviour model

### Responsive switch
- One `<nav>` with three regions: `.dtCenter` (desktop links + mega), `.dtRight` (user + CTA), and `.mbBtn` (hamburger).
- CSS: `.dtCenter,.dtRight` hidden and `.mbBtn` + `.drawerRoot` shown at `@media (max-width:1000px)`. Nothing JS-gated — the breakpoint owns the switch.

### Mobile drawer — app-first push navigation
Opened by the hamburger (`onDrawerOpen`). Structure: a fixed **backdrop** (`rgba(0,0,0,.62)`, tap = `onDrawerClose`) + a right-anchored **panel** (`.drawerPanel`, `width:min(420px,90%)`, slides in via `transform:translateX(102%) → none`, `.44s cubic-bezier(.2,.85,.2,1)`).

The panel has three fixed zones: **header** (logo + X close), a **push viewport** (`.mvView`, `overflow:hidden`), and a **footer** (Offerte aanvragen + Inloggen).

Inside `.mvView` sit four absolutely-positioned, independently-scrolling **panels** (`.mvPanel`, `inset:0`), each translated horizontally by a state-driven transform. A single `view` state string drives them:

| view | root | diensten | service | regio |
|---|---|---|---|---|
| `'root'` | 0 (op=1) | 100% | 100% | 100% |
| `'diensten'` | -26% (op=.35) | 0 | 100% | 100% |
| `'service'` | -26% (op=.35) | -26% | 0 | 100% |
| `'regio'` | -26% (op=.35) | 100% | 100% | 0 |

The active panel sits at `translateX(0)`; the parent slides 26% left and dims (iOS push feel); off-screen panels wait at `translateX(100%)`. Transforms/opacity are passed as live style holes (`{{ rootT }}`, `{{ dienstenT }}`, …) since they are runtime state values.

**Levels:**
1. **Root** — eyebrow "Menu", then app-style rows: Home; **Diensten** (orange icon chip + "8 disciplines" + chevron → `onDiensten` sets `view:'diensten'`); **Regio** (map-pin chip + "4 werkgebieden" + chevron → `onRegio`); Realisaties / Sectoren / Kennisbank (chevron rows); Over ons; Contact.
2. **Diensten** — back header (‹ `onBack`) + "Alle →"; a column of **service cards** (`.mSvcCard`: 44px orange icon chip, name Sora 700, tag, chevron). Tap → `goService(i)` sets `view:'service'`.
3. **Service (sub-services)** — back header showing the chosen pillar name; the pillar's **sub-service cards** (`.mSvcCard`, 36px chip) + a gradient **"Klaar voor {pillar}?"** offerte CTA card. Guarded by `sc-if curSvc`.
4. **Regio** — back header + "Alle →"; eyebrow "Onze regio's"; a **2-column grid of region map cards** (`.mRegCard`). Each card: a 112px map panel (dotted-grid pattern, faint base provinces, the region highlighted with an orange gradient + blur-glow, a **pulsing location marker** — `regioPulse` 2.6s ring + `regioCore` 2.6s core), a bottom fade, then a badge ("Thuisregio" amber / "Regio" neutral), title, and "Ontdek →". Four cards: Limburg (thuisregio), Vlaanderen, Antwerpen, Nederlands-Limburg.

**Back navigation:** `back()` → from `'service'` returns to `'diensten'`, otherwise to `'root'`. Opening the drawer resets to `view:'root'`.

## Region map data
`mapdata.js` (ES module, default export) provides `belgium` (`provinces[].d` SVG paths, `flanders` key list, `markers` coords) and `netherlands` (`provinces`, `limburgCode`, `markers`). Loaded in `componentDidMount` via dynamic `import()` (path from `window.__resources.mapdata`, fallback `./mapdata.js`); cards render once `state.data` resolves. Card highlights: Limburg = `byKey('be-3528')`, Vlaanderen = all `flanders` provinces, Antwerpen = `byKey('be-3535')`, NL-Limburg = province where `code === limburgCode`. Each card's map defs use per-card ids (`mrp-`, `mrf-`, `mrg-` + card id) to avoid collisions.

## Styling tokens (shared with the site)
- Panel bg `#0e0d0c`; drawer border-left `rgba(255,255,255,.08)`; shadow `-40px 0 90px -30px rgba(0,0,0,.95)`.
- Accent `#FF7A00` / `#FF9A45`; primary gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)`; amber badge `#fcd34d`.
- Fonts: Sora (700/800 labels & titles), Manrope (body), JetBrains Mono (eyebrows). Card radii 14–15px; row radii 13px; icon chips 36–44px.
- `:active` states give a soft orange wash / slight scale for touch feedback (no hover reliance on touch).
- `@media (prefers-reduced-motion: reduce)` disables all animation + transitions.

## State / handlers (logic class)
- Desktop: `open`, `active`, `fade` + `openMenu/closeMenu/toggleMenu/pick`.
- Mobile: `drawerOpen`, `view` (`'root'|'diensten'|'service'|'regio'`), `svc` (pillar index), `data` (map JSON).
- Exposed to template: `msvc` (service cards), `curSvc`/`curSubs` (drilled pillar + its subs), `cards` (region cards), `rootT/rootO/dienstenT/serviceT/regioT` (transforms), `drawerClass`, and handlers `onDrawerOpen/onDrawerClose/onDiensten/onRegio/onBack` (+ `goService` bound per card).
- `PILLARS` (8): Webdesign, SEO, Fotografie, Videografie, Drone & FPV, 3D/VR & AR, Podcasting, Masterclasses — each with `icon`, `tag`, `subs[]`. Sub-services inherit the pillar icon unless given their own.

## Icons & assets
- All glyphs are inline SVG `<symbol>` defs (`#svc-*` services, `#pd-*` disciplines) defined once at the top of the file.
- `mapdata.js` — required runtime asset for the region cards.
- Google Fonts: Sora, Manrope, JetBrains Mono.

## Extending
- More menu sections (Realisaties, Sectoren) can become push panels with cards using the same pattern: add a `view` value, a `.mvPanel` with its transform hole, and a `goView`/`onBack` handler.
- To reorder or relabel drill-down items, edit `PILLARS` in the logic class.
