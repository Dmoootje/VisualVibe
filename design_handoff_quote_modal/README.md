# Handoff: Sitewide CTA-flow — "Offerte aanvragen" & "Laten we kennismaken"

## Overview
A **sitewide pop-up flow** for VisualVibe that every "Offerte aanvragen" and "Laten we kennismaken" button opens. It is a bottom **sheet** (slides up, dims + blurs the page) with two entry modes:
- **Offerte aanvragen** → a 2-step flow: (1) pick one or more services, (2) contact form pre-filled with the chosen services → confirmation.
- **Laten we kennismaken** → a single friendly contact step (no service picker) → confirmation.

This bundle also documents the **responsive top navigation** (hamburger menu) because it is part of the same sitewide shell.

The flow is demonstrated inside `Over ons.dc.html` (the About page prototype); the modal + nav are the reusable pieces to lift out and place site-wide.

## About the Design Files
The files here are a **design reference authored in HTML** (rendered through a small prototype runtime, `support.js`) — not production code. Recreate the flow in the target stack (React/Vue/WordPress/etc.) using its own components, state and form/submit plumbing. Reproduce the *output and behavior*, not the `<x-dc>` / `{{ }}` / `<sc-if>` scaffolding.

## Fidelity
**High-fidelity.** Colors, type, spacing, motion and copy are all specified. Design width 1440px; fully responsive with two breakpoints (≤960px tablet, ≤560px phone). App-first: on phones the sheet is full-width and everything stacks.

---

## Triggers (sitewide)
Wire these to `openOfferte()` and `openKennis()`:
- **Top nav** "Offerte aanvragen" → offerte.
- **Mobile menu** "Offerte aanvragen" → offerte.
- **Hero** "Laten we kennismaken" → kennismaken.
- **CTA band** (every page) "Offerte aanvragen" → offerte.
- Recommendation: every "Offerte aanvragen" across the site → offerte; every "Laten we kennismaken" / "Contact" primary → kennismaken.

## State model
```
open:   boolean      // sheet visible
mode:   'offerte' | 'kennis'
step:   1 | 2        // offerte only; kennis is single-step
selected: string[]   // service ids
done:   boolean      // confirmation shown
sent:   { naam, email, tel, adres, bericht, services[] }  // captured on submit
nav:    boolean      // mobile menu open (nav shell)
```
Derived view flags: `showServices = open && !done && mode==='offerte' && step===1`; `showForm = open && !done && (mode==='kennis' || step===2)`; `showDone = open && done`.

Handlers: `openOfferte`, `openKennis`, `close`, `toggle(id)` (add/remove a service), `toStep2` (guarded: needs ≥1 selected), `back` (→ step 1), `submit` (reads the form, sets `done`), `toggleNav`.

## Services (step 1)
Six selectable cards (id · label · sub):
`website` Webdesign — "Website of webshop" · `marketing` SEO & Marketing — "Gevonden worden" · `foto` Fotografie — "Bedrijfs- & productfoto's" · `video` Bedrijfsvideo — "Video & montage" · `drone` Drone & FPV — "Lucht- & FPV-beelden" · `podcast` Podcasting — "Opname tot afgewerkt". Multi-select; at least one required to advance.

## Screen-by-screen

### Sheet shell
- Backdrop: `radial-gradient(120% 90% at 50% 100%, rgba(255,90,0,.14), transparent 55%), rgba(4,4,4,.88)` + `backdrop-filter: blur(8px)`. Click backdrop = close.
- Card: bottom-anchored, `width:min(920px,100%)`, `max-height:94vh`, `overflow:auto`, `border-radius:28px 28px 0 0`, top border `2px rgba(255,122,0,.45)`, `background:linear-gradient(180deg,#17130f,#0b0a09)`, big upward shadow. Decorative radial-orange glow + faint 46px grid in the top area. **Grab handle** (46×5, `rgba(255,255,255,.16)`) centered at top. Enters with `sheetUp` (.55s, translateY 100%→0); backdrop `ovlFade`.
- Header: "Visual**Vibe**" + mono kicker ("OFFERTE AANVRAGEN" / "KENNISMAKEN"); round close button (rotates 90° + turns orange on hover).

### Stepper (offerte only)
Two nodes "1 Diensten" — connector bar — "2 Gegevens". Active/complete node = orange gradient fill; step-1 shows a check once on step 2; the connector bar fills orange (`scaleX`) on step 2; labels brighten when active.

### Step 1 — service picker
- H3 "Waarvoor wil je een offerte?" + sub "Kies één of meerdere diensten…".
- Grid `repeat(3,1fr)` (→ 2 col ≤960, 1 col ≤560). Each **card**: relative, `overflow:hidden`, radius 16; a large watermark of its icon bleeds off the bottom-right (`rgba(255,122,0,.05)`); orange-tint icon chip; name (Sora 700) + sub. Cards **stagger in** (`popIn`, nth-child delays .04–.34s).
- **Selected state**: orange border, `rgba(255,122,0,.1)` bg, a spinning gold conic border (`vvSpinBorder` 4s), watermark brightens, and a filled orange **check badge** appears top-right. Hover: lift + faint conic.
- Footer: "<n> geselecteerd" + **Volgende →** (only when ≥1 selected; otherwise a dashed "Kies minstens één dienst" hint).

### Step 2 / kennismaken — contact form
- Offerte: back-link "← Terug naar diensten", H3 "Bijna klaar — je gegevens", and an **"Aanvraag voor"** summary box listing the chosen services as check-pills.
- Kennismaken: a "Vrijblijvend gesprek" pill + H3 "Leuk — laten we kennismaken" + "…ik — Jens — neem snel persoonlijk contact op. Geen verplichtingen."
- Fields (grid 2-col → 1-col ≤560), each with a leading icon and orange focus glow:
  - **Naam** (full width, person icon)
  - **E-mailadres** (mail icon) · **Telefoonnummer** (phone icon)
  - **Adres** (full, pin icon)
  - **Korte beschrijving** (full, textarea, labelled optional — "de rest bespreken we samen")
- Reassurance row (3 checks): "Antwoord binnen 1 werkdag · Volledig vrijblijvend · Rechtstreeks van Jens".
- Full-width submit: **Offerte aanvragen** (offerte) / **Verstuur** (kennis).

### Confirmation
Animated check in an orange ring (`checkpop` + drawn check), "Bedankt <voornaam>!", the chosen services echoed as pills (offerte), a line "Een bevestiging is onderweg naar <e-mail>", and a **Sluiten** button.

## Responsive nav shell (sitewide)
- Desktop: logo · center links (Diensten ▾, Regio ▾, Realisaties, Sectoren, Kennisbank, Over ons, Contact) · user icon + Offerte button.
- ≤960px: center links + user icon hidden; a **hamburger** appears next to the Offerte button. Tapping it opens a full-width dropdown under the bar listing all links + an Offerte button (`toggleNav`). Opening the modal closes the menu.
- Breakpoints reduce section padding (56→24→16px) and scale headings (H1 64→46→35, H2 →30→25).

## Design tokens (shared with the site)
- Bg `#0a0a0a`; surfaces `rgba(255,255,255,.02)`; hairline `rgba(255,255,255,.08)`.
- Accent `#FF7A00`; gradient `linear-gradient(90deg,#FF3B2E,#FF7A00)`; light `#FF9A45`; glow `rgba(255,90,0,*)`.
- Fonts: **Sora** (headings 700/800), **Manrope** (body/UI), **JetBrains Mono** (labels/kickers, uppercase, letter-spacing .06–.18em).
- Inputs: `background rgba(255,255,255,.04)`, border `rgba(255,255,255,.12)`, radius 12, focus border `rgba(255,122,0,.6)`.
- Motion ease `cubic-bezier(.2,.7,.2,1)`; everything respects `prefers-reduced-motion`.

## Integration notes (important)
- **The form does not send anything** — it's a prototype that shows a confirmation. Wire `submit` to your mail/CRM endpoint (e.g. POST to a form handler, or email to jens@visualvibe.be) and add real validation (required: naam + e-mail or telefoon) + spam protection.
- Persist the chosen `services` and `mode` with the submission so the quote request arrives labelled ("Aanvraag voor: …").
- Keep it accessible: trap focus inside the open sheet, close on `Esc`, restore focus to the trigger, label inputs, and give the sheet `role="dialog" aria-modal="true"`.
- The sheet uses `position:fixed`; ensure no transformed ancestor breaks it in your layout.

## Files
- `Over ons.dc.html` — prototype containing the live modal + nav (open in a browser; read for exact inline values).
- `assets/weddingvibe.svg` — used elsewhere on the page (not by the modal).
- `image-slot.js`, `support.js` — prototype-only runtime/components; do not port.
