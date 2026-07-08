# VisualVibe Visual Style Guide

Source of truth for the "dark neon orange" visual language, extracted verbatim from the existing, already-working homepage template (`src/features/home/*`, `src/layouts/Header`). Any new page or component must match this — do not invent new colors, radii, or motion patterns.

## Rule zero

Don't touch the existing homepage feature components (`Hero`, `Features`, `RegionIntro`, `SectorIntro`, `HowItWorks`, `Testimonials`, `BlogPreview`, `Cta`). They already work and already match this guide. This document exists so *new* pages can reuse the same look via shared components instead of re-typing these class strings by hand.

## Known inconsistency (not fixed here, just documented)

`tailwind.config.ts`'s shadcn-style CSS variables (`--primary`, `--card`, etc. in `globals.css`) define a **purple** theme that nothing on the actual site uses — every real button/card overrides them with explicit red/amber classes. Don't reach for `bg-primary` or `variant="default"` on `Button` expecting brand colors; it renders purple. Use the components in this guide instead.

## Colors

| Token | Value | Use |
|---|---|---|
| Background | `bg-black` | Every section |
| Card surface | `bg-black/80` + `backdrop-blur-sm` | Elevated cards (glow cards) |
| Flat surface | `bg-white/5` + `backdrop-blur-sm` | Non-glow cards (testimonial box, tab list) |
| Border | `border border-white/10` | All card/surface borders |
| Outline button border | `border-white/20` | Secondary button |
| Primary text | `text-white` | Body copy |
| Secondary text | `text-white/70` | Descriptions, subtitles |
| Tertiary text | `text-white/50` | Fine print |
| Accent | `text-amber-400` | Icons, stars, small highlights |
| Brand gradient | `from-red-500 to-amber-500`, hover `from-red-600 to-amber-600` | Primary buttons, glows, gradient text, active states |

No other colors. No blue, green, or purple anywhere in the real UI.

## Gradients

**Primary CTA button:**
```
bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0
```

**Gradient heading text:**
```
bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent
```

**Radial ambient glow** (needs the custom `.bg-gradient-radial` utility in `globals.css`):
```
bg-gradient-radial from-red-500/20 via-transparent to-transparent opacity-30
```

## The glow-card pattern

The signature visual element. Two stacked divs — a blurred gradient glow behind a solid dark card:

```tsx
<div className="relative">
  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-2xl blur-lg opacity-70" />
  <div className="relative bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl p-5 sm:p-8 md:p-12">
    {/* content */}
  </div>
</div>
```

Radius steps down one size from glow to surface (`rounded-2xl` → `rounded-xl`, or `rounded-xl` → `rounded-lg` for smaller elements like step cards). Blur scales with element size: `blur-sm` (small/avatar), `blur-md` (medium), `blur-lg` (hero/CTA-scale). This is the `GlowCard` component — always use it instead of hand-rolling the two divs.

**Flat surface variant** (no glow, for less prominent cards — testimonial box, tab list, badges):
```
bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl
```

## Ambient section backgrounds

Every section has a decorative blurred-orb background layer, absolutely positioned behind the content:
```tsx
<div className="absolute inset-0 z-0">
  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-red-500/10 rounded-full blur-[100px]" />
  <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-amber-500/10 rounded-full blur-[100px]" />
</div>
```
Content then sits in a sibling `relative z-10` container. Corner placement (top-right/bottom-left vs top-left/bottom-right) is varied per section for visual rhythm — it doesn't need to be identical every time, but always one red-tinted and one amber-tinted blob.

## Borders & radii

- `rounded-full` — pills, badges, avatars, dots
- `rounded-2xl` — glow wrapper, prominent flat card surfaces
- `rounded-xl` — glow inner surface, tab containers
- `rounded-lg` — nested/smaller elements (chips, small badges)
- `rounded-md` — buttons, inputs (from `buttonVariants`)

## Spacing

- Section wrapper: `py-12 px-4 sm:py-16 md:py-24 bg-black relative overflow-hidden` (padding scale varies slightly per section, always mobile-first 3-step)
- Container: `container mx-auto px-4 relative z-10` (horizontal padding sometimes `px-4 sm:px-6` or `px-5 sm:px-6 md:px-8` — pick one consistently per new component, don't mix within it)
- Card internal padding: `p-5 sm:p-8 md:p-12` (large cards), `p-4 sm:p-6` (compact cards)

## Typography

- Font: Inter only (`next/font/google`, applied once at the locale layout). Never load another font family.
- H1 (hero-scale only): `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight`
- H1 (page-level, non-hero): `text-3xl sm:text-4xl md:text-5xl font-bold`
- H2 (section heading): `text-2xl sm:text-3xl md:text-4xl font-bold mb-3` or `mb-4`
- H3 (card heading): `text-lg sm:text-xl font-bold`
- Body: `text-white/70`, scaled `text-base sm:text-lg` (prominent) or `text-sm sm:text-base` (compact)
- Fine print: `text-white/50 text-xs sm:text-sm`
- Quotes: add `italic`

## Buttons

Two variants only, both as full `className` overrides on `@/components/ui/button` (never rely on `variant="default"`, it's purple):

**Primary** (`NeonButton`):
```
bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base
```

**Secondary/outline**:
```
variant="outline" className="border-white/20 text-white hover:bg-white/10 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base"
```

When a button navigates, wrap with `asChild` + `Link` from `@/i18n/navigation` (never a bare `<Button>` with no destination).

## Motion

- Above-the-fold (Hero children): `initial`/`animate` (mounts immediately), staggered by `delay: 0, 0.1, 0.2, 0.3...`
- Below-the-fold sections: `whileInView`/`viewport={{ once: true }}` scroll-triggered, same `{ opacity: 0, y: 20 } → { opacity: 1, y: 0 }`, `duration: 0.5`
- Hover interactions: CSS `transition-colors` / `transition-opacity` / `transition-transform`, not framer-motion
- Don't add motion to every new page indiscriminately — plain server components with CSS `:hover` are fine and better for performance (see CLAUDE.md priority #1); reserve framer-motion for genuinely above/below-the-fold entrance effects matching the homepage's existing rhythm.

## Component mapping (blueprint → this codebase)

The content blueprint (`docs/content-blueprint.md`) suggests generic names like `Section`, `Container`, `CTASection`, `ServiceGrid`. These now live in `src/components/ui/` (primitives: `Section`, `Container`, `GlowCard`, `NeonButton`, `Badge`) and `src/components/sections/` (composed patterns: `PageHero`, `CTASection`, `ServiceGrid`, `RegionGrid`, `CaseGrid`, `BlogGrid`) — see those folders for the actual implementations. New content-driven pages (`/diensten/[slug]`, `/regio/[slug]`, etc.) should compose from these instead of hand-writing Tailwind, so the whole site stays visually consistent by construction.
