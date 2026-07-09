# Handoff: VisualVibe CTA (Next.js) — 4 variants, random surprise

## Overview
An animated call-to-action block that renders **one of 4 variants at random on every load**, so each visitor gets a surprise. Dark VisualVibe style with amber/red accents.

Variants:
- **0 — Roterende gradient-rand**: conic gradient border spins around the panel; button pulses.
- **1 — Bruiswater**: orange bubbles rise behind the text.
- **2 — Orbiterend licht**: a blurred glow orbits behind the panel; glass button.
- **3 — Stromende gradient + glans**: button gradient flows, a shine sweeps the label, a soft glow breathes above.

## Files
- `components/CTABlock.tsx` — the component (client component; random pick).
- `styles/cta.css` — all variant styles, keyframes, reduced-motion.
- `reference/CTA-Alternatieven.dc.html` — the prototype (pixel truth for all 4).

## Install (App Router)
1. Copy `components/CTABlock.tsx` and `styles/cta.css` into your app.
2. Load fonts + CSS in `app/layout.tsx`:
```tsx
import { Sora, Manrope } from "next/font/google";
import "@/styles/cta.css";
const sora = Sora({ subsets:["latin"], weight:["600","700","800"], variable:"--font-sora" });
const manrope = Manrope({ subsets:["latin"], weight:["500","600","700"], variable:"--font-manrope" });
// add `${sora.variable} ${manrope.variable}` to <html className=...>
```
3. Use it anywhere:
```tsx
import { CTABlock } from "@/components/CTABlock";

// random on every load (the surprise):
<CTABlock heading="Actief in kmo? Laten we kennismaken." ctaLabel="Offerte aanvragen" href="/contact" />

// or pin one variant:
<CTABlock variant={1} />
```

## How the random works (SSR-safe)
`CTABlock` is a client component. It renders **variant 0 on the server / first paint**, then picks a random variant (0-3) in `useEffect` after hydration — so there is **no hydration mismatch**, just an instant swap on mount. If you would rather avoid the initial swap, render it only on the client (e.g. `next/dynamic` with `ssr:false`) or pass a fixed `variant`.

> Want the surprise to persist per session instead of per load? Store the rolled index in `sessionStorage` in the effect and read it back. Want it per-request server-side? Roll the index in a Server Component parent and pass it as `variant` (note: then it is fixed until the next full navigation).

## Tokens
- Background `#0a0a0a`; accent gradient `#FF3B2E → #FF7A00` (amber-red); light `#FFA23A`.
- Heading: Sora 800, `clamp(26px,3.4vw,34px)`. Button: Manrope 700, 16px, radius 12px, padding 15px 30px.
- Panel radius 22px, padding `clamp(36px,5vw,56px) clamp(24px,4vw,48px)`.
- All motion respects `prefers-reduced-motion: reduce`.
