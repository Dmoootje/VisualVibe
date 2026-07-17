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

## Review fixes

- Replaced the reviewed hard-coded navigation, mobile drawer, form, footer and quotation-modal strings with consumed message keys.
- Connected every previously unused quotation key, including introductory copy, field labels, placeholders, trust signals and stored confirmation.
- API error bodies are no longer read or displayed by the quotation modal. Visitors only receive the safe localized failure message.
- Restored the original Dutch footer description, form prompts, contact button and quotation picker wording.
- Corrected the English partner heading and named thank-you punctuation.
- Added source-level component wiring and hard-coded Dutch regression tests alongside recursive key parity.

Exact verification:

- `npm test -- src/i18n/sharedMessages.test.ts`: 5 passed.
- `npm run typecheck`: passed.
- `npm run audit:locales`: completed with the same 59 content findings, including the pre-existing blocking Dutch hero alt issue outside Task 5.
- `rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}'`: no matches.

## Final mobile navigation audit

Audited the full mobile drawer as one visitor screen. Root labels, item counts, panel headings, all-links, discovery labels, navigation links and CTAs now consume locale messages. Content-record names and VisualVibe/WeddingVibe brand names remain owned by their appropriate data sources.

Final evidence:

- `npm test -- src/i18n/sharedMessages.test.ts`: 6 passed, including a full mobile-chrome regression scan.
- `npm run typecheck`: passed.
- `npm run audit:locales`: 59 pre-existing content findings, with one unrelated blocking Dutch hero alt issue.
- `rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}'`: no matches.

Self-review confirmed the cited literals now consume locale messages, the message path schema remains identical across all four locale files, English remains disabled, and no API-provided error reaches the quotation interface.

## Second review fixes

- Localized the quotation description placeholder, desktop region menu labels, mobile wedding title, work-area count, service CTA and quotation CTA.
- Removed obsolete Dutch form placeholder constants.
- LeadForm now ignores API error bodies and always renders the safe localized error copy.
- Expanded the English footer description to retain videography, drone production, 3D, VR, AR and podcasting.
- Strengthened regression coverage for both forms, region navigation, mobile navigation and factual footer scope.

Verification on the final second-review state:

- `npm test -- src/i18n/sharedMessages.test.ts`: 5 passed.
- `npm run typecheck`: passed.
- `npm run audit:locales`: completed with 59 pre-existing content findings and one unrelated blocking Dutch hero alt issue.
- `rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}'`: no matches.
