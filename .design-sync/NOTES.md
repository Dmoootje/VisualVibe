# design-sync notes - VisualVibe

Repo-specific gotchas for syncing this repo's component library to claude.ai/design.
Append a bullet whenever a sync teaches you something new.

## Repo shape

- This is the VisualVibe **marketing website** (NOVA Next.js template), not a
  published component library. There is **no `dist/` build and no Storybook**.
- The sync runs in **synth-entry-style but bounded** mode: a hand-written barrel
  at `.design-sync/entry.tsx` is passed as `--entry`, re-exporting only the ~44
  presentational components. Do NOT fall back to real synth-entry (globbing all
  of `src/`) - it would drag app pages, server actions and firebase-admin into
  the browser bundle.
- Component list is driven by `cfg.componentSrcMap` (44 explicit pins), because
  there is no `.d.ts` to discover exports from.

## Styling / theming

- Components are styled with **Tailwind v3 utility classes**, which only become
  CSS when Tailwind's build scans the source. So we pre-compile:
  `npx tailwindcss -c tailwind.config.ts -i src/app/globals.css -o .design-sync/compiled.css`
  then append a dark-root override block (bottom of that file). `cfg.cssEntry`
  points at the compiled file. **Re-sync must re-run this compile** if component
  classes changed.
- VisualVibe is **dark-first** (`next-themes` defaultTheme="dark",
  `darkMode:"class"`). Components use dark-first colors (no `dark:` variants).
  The compiled.css override promotes the `.dark` token values to `:root` so
  token-based components (Button, Badge) render dark without a `.dark` ancestor.
- Brand accent is **amber/orange** (`amber-*` utilities) + the `NeonButton`
  amber gradient. NOTE: the shadcn `Button` `default`/primary variant still uses
  the template's **purple** `--primary` (262 hue) token - that is the repo's
  real current state, shipped as-is. `NeonButton` is the brand CTA.

## Shims (via `.design-sync/tsconfig.sync.json` paths)

- `next/image` -> `.design-sync/shims/next-image.tsx` (plain `<img>`; strips
  next-only props, maps `fill` to absolute cover).
- `@/i18n/navigation` -> `.design-sync/shims/i18n-navigation.tsx` (next-intl
  navigation wrapper; `Link` -> plain `<a>`, router hooks inert). Used by 15
  components.
- No scoped component uses `useTranslations` / next-intl directly, so no other
  i18n shim is needed. `next/link` is only used by admin (excluded).
- `framer-motion` -> `.design-sync/shims/framer-motion.tsx`. Components use
  `motion.*` with `initial={{opacity:0}}` + `whileInView` entrance animations that
  never fire in a static design surface (or headless capture), leaving elements at
  opacity 0 = blank. The shim renders `motion.<tag>` as a plain `<tag>` (motion
  props stripped) so components show their FINAL visible state. This is the correct
  design-system behavior and also shrank the bundle ~577KB -> ~286KB. Only `motion`
  is imported by any component, but the shim covers the wider API as inert passthrough.

## Known cosmetic gaps

- The rich home `BlogCard` hardcodes `<Image src="/logo.svg">` (a public asset). The
  bundle can't resolve `/logo.svg`, so a tiny broken-image sliver shows top-right of
  each card. It is `aria-hidden` and decorative; the card is otherwise faithful.

## Excluded

- `src/components/admin/*` - internal CRM tooling, not a design system.
- `MdxContent` - MDX plumbing (next-mdx-remote), not a design block.

## Component authoring notes (from wave learnings)

- Import DS components from bare `"nova"`; icons from `lucide-react`. Inline styles only
  for preview layout glue (uncompiled Tailwind classes render unstyled in previews).
- `FeatureCard` must be composed inside a `FeatureGrid` to render truthfully (standalone
  is not a real render). `RelatedServices`/`FeatureCard` icons are lucide COMPONENTS
  (`icon={Search}`); `StickyBlogSidebar.service.icon` is a rendered ELEMENT.
- `BlogToc` / `StickyBlogSidebar` TOC `label` values are plain JS strings - use a real
  apostrophe (`KMO's`), never `&apos;` there (renders literally).
- `ComparisonTable` does NOT need `cardMode:"column"` - it wraps its table in
  `overflow-x-auto` and fits at the authored maxWidth. Revisit only for many-column tables.

## Known component limitations (repo-side, not sync config)

- `RoadmapBlock` `label` badge is a fixed 36px circle; multi-word labels ("Fase 1") clip.
  Short labels (digits / roman numerals) fit. Component would need a pill node for long labels.
- `QuoteBlock` source inserts a long-dash between author and role - a repo hard-rule
  (no long dash) violation in component CODE. Not a sync issue; flag to the component owner.

## Re-sync risks

- `compiled.css` is a **generated snapshot** of Tailwind output. If component
  utility classes change and the compile isn't re-run, previews/designs ship
  stale/missing styles. Always re-run the compile on re-sync.
- Dark theme is baked into `:root` in compiled.css by an appended block - if you
  regenerate compiled.css, that block is lost unless re-appended (the appender
  lives in this repo's sync history / this NOTES file).
- Shims are tied to the current `next/image` and `@/i18n/navigation` APIs - if
  those upstream APIs change materially, revisit the shims.
