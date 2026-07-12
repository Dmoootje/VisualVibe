# Handoff: VisualVibe Kennisbank (kennisbank landing, categoriepagina & blog hero)

## Overview
Redesign of the VisualVibe knowledge base ("Kennisbank"). Three connected views:
1. **Landing** - hero with search + animated target graphic, uitgelicht (featured) artikel, filterable "nieuwste artikels" grid (Grid / Lijst toggle), sticky sidebar (scroll-reveal search + categories + newsletter), and a full-width "Blader per onderwerp" section (currently a placeholder note - to be filled with cards in the homepage style).
2. **Categoriepagina** (example: SEO & GEO) - same hero style as the landing (search + orange category icon in an animated ring system), "Complete gidsen" + "Artikels per vraag" sections, sticky sidebar (scroll-reveal search, in-deze-categorie TOC, andere categorieën, CTA).
3. **Blog hero** - article hero: breadcrumb, category pill, two-tone title, meta (author/date/read), share buttons, image card, and an "in dit artikel" chip row.

A floating **PREVIEW switcher** (bottom center) toggles the three views; in production these are three separate routes/pages.

## About the Design Files
`Kennisbank.dc.html` is a **design reference created in HTML** (a "Design Component" prototype), showing the intended look and behavior. It is **not production code to copy directly**. The task is to **recreate these designs in the target codebase's existing environment** (React/Vue/Astro/CMS/etc.) using its established components, tokens, and patterns. If no environment exists yet, pick the most suitable framework and implement there. `support.js` is only the prototype runtime - do not ship it.

The three views are intended as **separate pages** in production, not a single component with a view-switcher (the switcher is a prototype convenience only).

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions. Recreate pixel-accurately using the codebase's libraries. Exact values below.

## Design Tokens

### Colors
- Page background: `#0a0a0a`
- Card surface: `#121110` (solid) / `#100e0d`; subtle surface `linear-gradient(160deg, rgba(255,255,255,.022), rgba(255,255,255,.006))`
- Image placeholder bg: `#161412`
- Primary gradient (buttons, pills, accents): `linear-gradient(90deg, #FF3B2E, #FF7A00)`
- Amber gradient (service card icon/arrow, clean look): `linear-gradient(145deg, #FFA23A, #FF7A00)`
- Accent solids: `#FF7A00`, `#FF9A45`, `#FF8A2E`
- Text: `#ffffff`; secondary `rgba(255,255,255,.64)`; muted `rgba(255,255,255,.4–.58)`; faint `rgba(255,255,255,.26)`
- Borders: neutral `rgba(255,255,255,.06–.12)`; accent `rgba(255,122,0,.2–.6)`
- Warm glow (radial): `rgba(255,90,0,.05–.18)`
- Link default `#FF9A45`, hover `#FF9A45` (a/a:hover)

### Typography
- **Sora** - headings (700/800). H1 hero 64px / line-height .98 / letter-spacing -.03em; category H1 64px; section H2 30px; card titles 18–27px.
- **Manrope** - body/UI (400–800). Body 14–19px, line-height 1.55–1.65.
- **JetBrains Mono** - eyebrows, labels, meta, numbers (500–700). Eyebrow 11–12px, UPPERCASE, letter-spacing .14–.2em, color `#FF9A45`. Meta labels 9–10px uppercase.
- Google Fonts import: `Sora:600,700,800` · `Manrope:400,500,600,700,800` · `JetBrains Mono:500,600,700`

### Spacing / Radius / Shadow
- Container max-width 1300–1440px, centered. Section padding ~52–64px vertical, 56px horizontal (22px on mobile).
- Radius: cards 18–22px; icon tiles 13–15px; inputs 11–15px; pills/chips `9999px`; arrow buttons circular.
- Card hover shadow: `0 44–48px 84–96px -36–40px rgba(255,90,0,.5–.55)` + `0 12–16px 30–40px -18–24px rgba(0,0,0,.85)`
- Two-column body: `grid-template-columns: 1fr 336px` (landing sidebar column ~336px), gap 44px, `align-items:start`.

## Screens / Views

### 1. Shared chrome
- **Top nav** (sticky-feel, not sticky): logo "Visual" + orange "Vibe"; links Diensten/Regio/Realisaties/Sectoren/Kennisbank (active, orange chevron)/Over ons/Contact; user icon + "Offerte aanvragen" gradient button. Collapses to a burger below 1080px.
- **Footer**: brand blurb + email; 3 link columns (Diensten/Bedrijf/Regio); legal row; 2px top gradient line; warm radial glow.

### 2. Landing
- **Hero**: grid-pattern background (52–54px, radial-masked) + top-right radial orange glow. Breadcrumb (Home / Kennisbank). Eyebrow pill "KENNISBANK". H1 "Slim online / groeien als KMO" (2nd line gradient text). Subtitle. **Search bar** (icon + input + clear (when text) + "Zoeken" gradient button); focus ring `0 0 0 4px rgba(255,122,0,.1)`. Stats row (artikels / categorieën / wekelijks). Right column: **animated "doelgroep" target** - concentric bullseye, rotating conic radar sweep, expanding ping rings, 8 audience icons on spokes at varied radii with inward-flowing dashed arrows (marker heads). It is a dimmed background element (`opacity:.4`), shifted up/left; hidden below 1080px.
- **Two-column body** (main + sticky sidebar):
  - **Uitgelicht**: large featured card, image left / content right (COMPLETE GIDS eyebrow, title+accent, underline bar, excerpt, meta, CTA). Hidden when a filter/search is active.
  - **Nieuwste artikels**: eyebrow + H2 + result count + **layout toggle** (Grid = 2-col vertical cards / Lijst = 1-per-row horizontal image-left cards). Category **filter chips** row. Grid of article cards. Empty state with reset button.
  - **Sidebar** (sticky, `top:24px`): scroll-reveal search (appears after ~160px scroll, slides in); Categorieën list (icon rows, counts, active state, filters the grid); Newsletter box (email input + subscribe button → "Ingeschreven ✓").
- **Blader per onderwerp** (full width, sticky sidebar ends here): currently a dashed placeholder - *"Blader per onderwerp cards komen hier in dezelfde stijl als de homepage."* Implement with the homepage service-card style (see below).

### 3. Article card (the "box" - standard component)
Full-bleed image top (aspect 16/10) with: category pill top-left (gradient, icon + label), "VisualVibe" watermark top-right (toggleable), overlaid title (white) + accent line (orange) + short underline bar. Body: meta row (LEESTIJD/AUTEUR or GEPUBLICEERD with mono labels), excerpt, CTA "Lees het volledige artikel →". Hover: lift `translateY(-7px)`, orange border, image zoom `scale(1.06)`, CTA fills. **Compact/list variant**: horizontal, image left (320px) / content right. Clicking a card opens the Blog hero for that article.

### 4. Categoriepagina (SEO & GEO)
Same hero system as landing: grid bg + glow, breadcrumb, eyebrow pill "CATEGORIE", two-tone H1 "SEO & **GEO**", subtitle, search bar (Enter / "Zoeken" → jumps to filtered landing), stats. Right column: the **category icon** rendered in orange (`#FF8A2E`, no filled tile) with a soft `drop-shadow`, centered inside an animated ring system (3 concentric circles + rotating conic sweep + ping rings + glow), max-width ~580px, vertically centered, hidden below 1080px.
Body: "START HIER / Complete gidsen" (2 large article cards) + "VERDIEPING / Artikels per vraag" (compact horizontal cards). Sticky sidebar: scroll-reveal search, "IN DEZE CATEGORIE" TOC, "ANDERE CATEGORIEËN" icon rows, "Hulp nodig met SEO?" CTA.

### 5. Service / category cards ("Blader per onderwerp" homepage style)
Reference implementation (design was removed at request but the pattern is defined): asymmetric grid - 7-col grid where cards span 4 (wide/featured) or 3 (narrow), alternating per row so the wide card flips side each row. Each card: number 01–08 (top-right, mono, letter-spacing), faint category-icon watermark (~216px, top-right, neutral until hover), icon tile top-left, title (Sora 27px), description (max-width ~66%), sub-service chips, circular arrow bottom-right. **Featured (wide) cards** show the amber treatment by default (orange icon tile + filled arrow + warm border/glow). **Hover** (any card): lift, orange border, warm ambient bottom glow, icon tile + arrow fill with amber gradient `#FFA23A→#FF7A00` (clean, no red, no rotation), watermark + number brighten. Order: Webdesign, SEO, Fotografie, Videografie, Drone & FPV, 3D VR & AR, Podcasting, Masterclasses.

### 6. Blog hero
Grid bg + left glow. Breadcrumb. Left: category pill, two-tone title (white + orange 2nd line), subtitle, meta row (author avatar circle + name/role, date, read time), "Begin met lezen" button + share buttons (LinkedIn/Facebook/copy). Right: portrait image card (aspect 4/5) with category pill, watermark, read-time badge + zoom button, big soft shadow. Below: "IN DIT ARTIKEL" chip row.

## Interactions & Behavior
- **Search**: global query state; landing grid filters live (title/accent/excerpt/category). Category & sidebar searches update the same query; Enter / "Zoeken" navigates to the landing (filtered).
- **Category filter**: chips + sidebar rows set active category; featured hides when filtering; grid title/eyebrow switch to "RESULTATEN / <category>". Empty state offers "Filters wissen".
- **Layout toggle**: Grid (2 col) ↔ Lijst (1-per-row horizontal). Also exposed as a tweak/prop.
- **Scroll-reveal sidebar search**: appears when `window.scrollY > 160` (slide + fade + collapse height), on both landing and category sidebars.
- **Sticky sidebar**: `position:sticky; top:24px`; on the landing it stops where the full-width "Blader per onderwerp" section begins.
- **Card click** → opens the Blog hero of that article (in production: navigate to the article page).
- **Hovers**: cards lift + orange border + image zoom; CTAs/arrows fill; service icon tiles fill amber.
- **Animations** (respect `prefers-reduced-motion`): entrance fade-up (`kbRise`, staggered via `--i`); target radar sweep `spin 5.5s`, ping rings, dashed-arrow flow, center pulse; category icon float `catFloat`.
- **Responsive**: two-col → single col below 1080px; hero right graphics hidden below 1080px; grids collapse; nav → burger.

## State Management
- `query` (search string), `cat` (active category key or 'all'), `layout` ('grid' | 'list'), `view` ('landing'|'category'|'blog'), `blogId` (opened article), `email` + `subscribed`, `scrolled` (scroll-reveal), `navOpen` (mobile nav).
- Data: an `ARTICLES` array (id, category, title, accent, excerpt, read, date, image, flags: guide/featured/popular) and a `CATEGORIES` array (key, label, icon, count, description). Counts derive from articles. In production, fetch from CMS.

## Assets
- Icons: inline SVG symbol set (`<defs>`), single-color stroke, 24×24 viewBox - home, user, search, clock, calendar, arrow, mail, fire, book, check, zoom, grid, rows; category icons: `cat-web`, `cat-seo` (magnifier + bars), `cat-foto`, `cat-video`, `cat-drone`, `cat-cube` (3D), `cat-mic`, `cat-cap`, `cat-all`. Replace with the codebase's icon library, matching shapes.
- Photos: currently external Firebase Storage URLs (VisualVibe portfolio). Replace with real article cover images from the CMS.
- No local image files are required by this prototype.

## Files
- `Kennisbank.dc.html` - the full design reference (all three views, styles inline + a small `<style>` for keyframes/hover/responsive).
- `support.js` - prototype runtime only (do not ship).
