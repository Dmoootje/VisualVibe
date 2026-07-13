# Handoff: WeddingVibe One-pager

## Overview
Volledige one-pager voor **WeddingVibe** — trouwfotografie & huwelijksvideo (zusterlabel van VisualVibe, door Jens). Doel: emotie tonen, portfolio laten verkopen en conversie via een "Controleer jullie datum"-popup en een uitgebreid contactformulier. De pagina is bewust het stilistische tegendeel van VisualVibe: wit/crème, klassiek, romantisch, met goud en sierlijke script-accenten.

## About the Design Files
De bestanden in deze bundel zijn **designreferenties gemaakt in HTML** (een Design Component-prototype), geen productiecode. De opdracht is deze designs **na te bouwen in de bestaande omgeving van de doelcodebase** (bv. WordPress/React/Vue/Next.js) met de daar geldende patronen en libraries — of, als er nog geen omgeving is, het meest geschikte framework te kiezen en het daar te implementeren. `support.js` is alleen de prototype-runtime; niet overnemen.

## Fidelity
**High-fidelity (hifi).** Kleuren, typografie, spacing, copy en interacties zijn definitief bedoeld. Pixel-perfect nabouwen met de eigen stack.

## Design Tokens

### Kleuren
- Wit (basis): `#FFFFFF`
- Crème (afwisselende secties): `#FAF6EE`
- Donkere secties (Waarom + footer): `#26201A` / footer `#221C16`
- Inkt (koppen, tekst op licht): `#2A2320`
- Bodytekst: `#6B5F55` — secundair `#8A7A62` / labels `#A08B6E`
- Goud solid: `#C29A4B` — tekstlinks/accents `#B08A3E`
- Goud-gradient (knoppen, badge, logo "Wedding"): `linear-gradient(100deg,#D2AC47,#EDDC78 55%,#D2AC47)`
- Licht goud op donker: `#EDDC78`
- Crème tekst op donker: `#F6EFE3` (muted: rgba(246,239,227,.6–.75))
- Hairlines/borders: `rgba(194,154,75,.28–.45)`
- Bloemblaadjes: `#EDDC78 #D2AC47 #F2D8D2 #E8D5BC #FBF3E4 #DFBE6F`

### Typografie (Google Fonts)
- Display/koppen: **Cormorant Garamond** 400–700 + italic. H1 hero `clamp(46px,7.4vw,86px)` w500; sectie-H2 `clamp(32px,4.4vw,54px)` w500, line-height ~1.1; accentwoorden in italic goud (`#B08A3E`).
- Script-accenten: **Great Vibes** — hero-regel "Voor altijd voelbaar." `clamp(40px,6vw,72px)` in goud-gradient (background-clip:text), handtekening "— Jens" 46px, "&" in koppelnamen, "Proficiat!" in popup 52px.
- Body/UI: **Lora** — paragrafen 16.5–17px / line-height 1.75–1.8; kleine caps-labels 11–12px, letter-spacing .2–.28em, uppercase.

### Overige tokens
- Border-radius: 0 overal (strak klassiek); uitzonderingen: cirkels (pillen, iconknoppen, playknop, avatar-slots) `9999px`.
- Knoppen: primair goud-gradient + inkttekst, `padding 17-18px 36px`, caps 12.5px ls .18em, hover translateY(-2px) + `box-shadow 0 14px 30px rgba(194,154,75,.45)`; secundair 1px goud-border, transparant, hover vult met gradient.
- Overlines: caps-label goud met 44px hairline-gradientlijnen ernaast.
- Sierornament: klein SVG-krulmotief (twee gebogen lijnen + ruit, 120×14, stroke `#C29A4B`).
- Schaduw kaarten: `0 16px 44px rgba(42,35,32,.09)`; popup `0 44px 110px rgba(20,15,10,.5)`.
- Sectiepadding: `clamp(80px,10vw,140px)` verticaal, `clamp(20px,5vw,64px)` horizontaal; container max-width 1180px.

## Assets
- `assets/weddingvibe-logo.svg` — wordmark, "Wedding" in goud-gradient (`#d2ac47→#eddc78→#d2ac47`), "vibe." in `#2A2320`. Voor lichte achtergronden.
- `assets/weddingvibe-logo-licht.svg` — zelfde, "vibe." in `#F6EFE3`. Voor de donkere footer.
- Herovideo: YouTube `g6-6KvNlbtM` (autoplay, muted, loop, geen controls, cover-fit).
- Foto's (Firebase Storage, reeds gekoppeld): intro groot = "trouwfotografie Limburg.webp", intro detail = "detailfoto trouwringen.webp", galerij 1 = "trouwfotos voorbereiding.webp".
- Alle overige beelden zijn `<image-slot>`-placeholders: de klant sleept daar echte foto's in. In productie: gewone `<img>`/achtergrondbeelden met de uiteindelijke fotografie.

## Screens / Views (secties, in volgorde)

1. **Sticky nav** — wit blur (`rgba(255,255,255,.92)` + backdrop-blur 14px), goud hairline onder. Logo 26px hoog. Links: Ons werk, Foto & film, Over Jens, Investering, Vragen (anchor-scroll, smooth) + gouden CTA "Controleer jullie datum" → opent de datum-popup.
2. **Hero** (92vh) — fullscreen YouTube-video achter donkere scrim (`linear-gradient(180deg,rgba(30,24,18,.42),.48,.7)`), fallback-foto eronder. Gecentreerd: overline "TROUWFOTOGRAFIE & HUWELIJKSVIDEO", H1 "Jullie dag. / Jullie verhaal.", script-regel "Voor altijd voelbaar." in gradient-goud, intro-alinea, 2 knoppen (primair "Bekijk onze huwelijken" → #werk; secundair outline "Controleer jullie datum" → popup), vertrouwensregel. **Bloemblaadjes-animatie**: ±32 blaadjes (9–19px, organische border-radius `62% 38% 58% 42%`), vallen 9–18s lineair oneindig (`translateY(-6vh→112vh)` + rotate 320°) met zijwaartse sway (2.2–4.6s alternate). Tekst komt binnen met gestaffelde fade-up (0.1s–0.85s delays).
3. **Introductie** (wit) — links groot 3/4-beeld met klein overlappend detailkader (wit passe-partout 10px + schaduw, rechtsonder −28/−42px); rechts overline + H2 + 3 alinea's + tekstlink "ONTDEK ONZE STIJL →".
4. **Portfolio `#werk`** (crème) — gecentreerde kop met sierornament; masonry-galerij (CSS `columns:3 260px`, gap 18px) met 8 beelden in wisselende verhoudingen (3/4, 1/1, 4/5, 4/3) elk met caps-bijschrift; daaronder 3 uitgelichte huwelijkskaarten (witte kaart, 4/5-beeld, namen in Cormorant met script-"&", hover lift) en outline-knop "Bekijk meer huwelijken".
5. **Huwelijksvideo `#video`** (wit) — gecentreerde kop (Cormorant + Great Vibes-regel); full-width posterblok 21/10 met radiale scrim, pulserende ronde playknop (94px, goudrand, `wvPulse` box-shadow-ring 2.6s) en onderstreepte link.
6. **Diensten `#diensten`** (wit) — 4 grote horizontale blokken, beeld 4/3 ⟷ tekst, alternerend links/rechts (`flex-direction:row-reverse` op even blokken): Trouwfotografie, Huwelijksfilm, Foto & video, Bruiloftwebsite. Elk: caps-categorie, H3 met italic-goud accent, 2 alinea's, caps-sublabel, 6–7 voordelen in 2-koloms grid met gouden ruitjes (◆), tekstlink.
7. **Waarom `#waarom`** (donker `#26201A`) — links 3/4-beeld, rechts overline `#EDDC78` + H2 crème + intro + 4 argumenten in 2×2-grid (goud hairline boven, Cormorant-kop 23px, muted bodytekst).
8. **Werkwijze `#werkwijze`** (wit) — gecentreerde kop; **carrousel** van 6 stappenkaarten op één lijn: horizontale scroll-snap (`flex`, `overflow-x:auto`, `scroll-snap-type:x mandatory`, kaarten `flex:0 0 min(290px,76vw)`, `scroll-snap-align:start`, scrollbar verborgen), met ronde vorige/volgende-pijlen (46px, goudrand, hover vult goud) die `scrollBy({left:±max(clientWidth*0.7,300), behavior:'smooth'})` doen. Kaart: goud hairline boven + ruit-dot, italic Cormorant-nummer 40px, kop, tekst. Werkt identiek op tablet/mobiel (swipe). Daaronder gouden CTA "Plan een vrijblijvende kennismaking".
9. **Over Jens `#jens`** (crème) — links foto in wit passe-partout (16px) met schaduw en −1.6° rotatie; rechts overline, H2, 4 alinea's, italic afsluiter, Great Vibes-handtekening "— Jens" 46px goud, outline-knop.
10. **Investering `#investering`** (wit) — 3 prijskaarten (border goud .35, padding ±46px): Fotografie €2.150 / Film €2.500 / Foto & video €3.800 ("Vanaf" caps + Cormorant 44px + "excl. btw"). Middelste kaart uitgelicht: crème bg, volle goudrand, schaduw, zwevende gradient-badge "MEEST GEKOZEN". Prijzen zijn via een instelling verwisselbaar met "Prijs op aanvraag". Onder: 2 alinea's + outline-knop "Vraag de volledige prijsbrochure aan".
11. **Videoboek/fotoalbum** (crème) — tekst links + knop; rechts 2 overlappende productbeelden (4/3 linksboven 72%, 3/4 met wit kader rechtsonder 46%).
12. **Ervaringen `#reviews`** (wit) — 3 kaarten met groot goudkleurig aanhalingsteken, italic quote, ronde 56px foto + namen + datum/locatie. **Let op: placeholders — uitsluitend echte reviews plaatsen, niets verzinnen.**
13. **FAQ `#faq`** (crème) — accordion (max-width 800px), 8 vragen, één tegelijk open: vraag in Cormorant 22px, ronde plus-knop die 45° draait bij openen, antwoord klapt uit via max-height/opacity-transitie (.55s/.45s).
14. **Contact `#contact`** — achtergrondfoto met donkere gradient-scrim; links overline + H2 wit + intro + directe contactgegevens (WhatsApp-link `wa.me/32472964599`, tel, mailto); rechts witte formulier-kaart (schaduw): Jullie namen, E-mail, Telefoon, Trouwdatum, Trouwlocatie (auto-fit grid), interesse-pillen (multi-select toggle: gekozen = goud-gradient-vulling + goudrand), textarea, gouden submit "CONTROLEER ONZE BESCHIKBAARHEID" → succestekst.
15. **Footer** (donker `#221C16`) — 4 kolommen (licht logo + missie / Navigatie / Diensten / Contact incl. regio's en "Wereldwijd beschikbaar" in italic goud), hairline, onderregel © + Algemene voorwaarden · Privacybeleid · Cookiebeleid.
16. **Datum-popup (modal)** — geopend door beide "Controleer jullie datum"-CTAs. Fixed overlay `rgba(24,19,14,.62)` + blur 7px; witte kaart max-width 540px, sluitkruis rechtsboven, klik buiten kaart sluit. Formulier: **Naam bruid** (required), **Naam bruidegom** (required), **E-mailadres** (required, type email), **Trouwdatum** (native date-picker, required), **Jullie vragen (optioneel)** textarea. Submit → verstuurt naar het ingestelde e-mailadres (default `jens@weddingvibe.be`; in het prototype via `mailto:` met subject "Datum-aanvraag: {bruid} & {bruidegom} — {datum}" en alle velden in de body — **in productie vervangen door een echte form-handler/e-mailservice**). Daarna bedankscherm: sierornament, "Proficiat!" in Great Vibes gradient-goud, felicitatie met de ingevulde namen ("Van harte gefeliciteerd met jullie aankomende huwelijk, {bruid} & {bruidegom}!"), regel dat **Jens zo snel mogelijk persoonlijk contact opneemt**, sluitknop.

## Interactions & Behavior
- Smooth anchor-scroll (`scroll-behavior:smooth` op html) vanuit nav/footer/CTA's.
- Scroll-reveal: alle blokken met `data-reveal` starten `opacity:0; translateY(28px)` en faden in via IntersectionObserver (threshold .08, rootMargin -40px onder, transitie .9s cubic-bezier(.22,.61,.36,1)), eenmalig. Uitschakelbaar via instelling.
- Hero-entrance: gestaffelde `wvRise`-keyframe (fade-up) per tekstregel.
- Bloemblaadjes: continue val + sway, alleen in de hero (overflow hidden), pointer-events none, uitschakelbaar.
- Hover: knoppen lift + schaduw; portfoliokaarten lift; navlinks → goud; FAQ-plus roteert; carrouselpijlen vullen goud.
- Carrousel: swipe/scroll native, pijlen scrollen ~70% van de zichtbare breedte.
- FAQ: één item open (state `openFaq`, -1 = alles dicht).
- Formulieren: native HTML5-validatie (required/email/date). Contactformulier-submit toont dankstatus in de knop; popup-submit → mailto + bedankscherm.
- Responsief: geen breakpoints maar fluid patterns — `clamp()` voor type/spacing, `flex-wrap` met `flex:1 1 <basis>` voor tweekoloms secties, `repeat(auto-fit,minmax(...))` grids, CSS-columns masonry, carrouselkaarten `min(290px,76vw)`. Werkt van ±360px t/m desktop.

## State Management
- `openFaq:number` (index open FAQ-item, -1 dicht)
- `interesses:{[label]:boolean}` (contactformulier-pillen)
- `verzonden:boolean` (contactformulier)
- `modalOpen`, `modalVerzonden:boolean` (datum-popup; sluiten reset beide)
- `mBruid, mBruidegom, mEmail, mDatum, mVragen:string` (popup-velden, controlled)
- Instellingen (props/tweaks): `bloemblaadjes:boolean=true`, `scrollAnimaties:boolean=true`, `prijzenTonen:boolean=true`, `contactEmail:string="jens@weddingvibe.be"`
- Data versturen: prototype gebruikt `mailto:`; productie heeft een POST naar een form-endpoint/e-mailservice (bv. eigen backend, SMTP of transactionele mail) nodig, met dubbele bevestiging naar het koppel als nice-to-have.

## Files
- `WeddingVibe One-pager.dc.html` — het volledige design (template + logica + instellingen)
- `assets/weddingvibe-logo.svg` / `assets/weddingvibe-logo-licht.svg` — wordmarks
- `support.js` — prototype-runtime (alleen nodig om het prototype lokaal te bekijken; niet overnemen)
- `image-slot.js` — placeholder-component voor foto's in het prototype (in productie vervangen door echte beelden)
