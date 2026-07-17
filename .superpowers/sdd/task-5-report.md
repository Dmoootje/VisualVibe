# Task 5 report

## Status

Implemented the shared locale message schema and connected the principal visitor-facing navigation, footer, lead form, quotation modal, cookie-consent and root 404 copy to `next-intl`. English copy was written from the complete Dutch interaction context in natural international business English. English remains disabled by the locale publication controls. French and German contain schema-parity fallback values only and are not presented as completed translations.

## RED evidence

Command: `npm test -- src/i18n/sharedMessages.test.ts`

Observed failure: Vitest could not import `messages/de.json`. This was the expected initial failure because German had no message file and the existing locale files only contained `common.locale`.

## GREEN evidence

- `npm test -- src/i18n/sharedMessages.test.ts`: 3 tests passed.
- `npm run typecheck`: passed with no TypeScript errors.
- `npm run audit:locales`: completed and reported 59 pre-existing content issues. The one blocking issue is a missing Dutch hero alt in `content/kennisbank/wordpress-backup-maken.mdx`, outside Task 5. The remaining notices are the expected untranslated knowledge-base partners owned by later tasks.
- Prohibited-character scan for U+2014 and U+2015: no matches.

## Translation context notes

- Read the full shared interaction components before translating, including form submission payloads, validation paths, consent behaviour and modal completion states.
- Applied the approved glossary choice `request a quotation` to shared calls to action.
- Used `case studies` for `realisaties` and clarified Limburg as Limburg, Belgium in the English footer description.
- Rephrased Dutch prompts as natural English interaction copy rather than preserving Dutch syntax.
- No automatic humanizer was used.

## Concerns and follow-up

- Service, region and card names supplied by the existing Dutch data modules remain Dutch until their structured content is localised by the relevant content tasks.
- Several deeply nested legacy navigation and quotation-card labels remain source-data literals. The primary interface labels and state messages are localised, but a final repository-wide literal audit should be run after the structured service and navigation data are translated to avoid duplicating work or introducing a second source of truth.
- The root `not-found.tsx` cannot use request locale context because it handles paths outside `[locale]`; it now reads the Dutch fallback text from the shared message file instead of duplicating literals.
