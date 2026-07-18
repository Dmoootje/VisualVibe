# Task 6 report: visitor emails and legal pages

## Status

Implemented English visitor-facing lead acknowledgements, website-analysis verification and report emails, plus complete English privacy and cookie pages. Dutch output paths remain the default and English remains disabled in `LOCALE_CONFIG`.

## Source context reviewed

- Read the complete Dutch privacy policy, including controller details, legal bases, consent semantics, recipients, international transfers, retention periods, data-subject rights and Belgian supervisory authority.
- Read the complete Dutch cookie policy, including administrator-only functional cookies, Google Analytics consent behaviour, third-party embeds and preference withdrawal.
- Read the full email template module, analysis dispatch flow, service preparation blocks, email types, business configuration, English style guide and authoritative glossary.
- Preserved company settings as dynamic values, the Belgian jurisdiction, the 30-day response period, the three-year enquiry limit, the 15-minute verification-code lifetime, and the 24-hour, 30-day and 91-day quota periods.

## RED evidence

Before implementation, the focused test command failed in three expected places:

- English report subject remained Dutch: received `Alex, je websiteanalyse is klaar`.
- `getPrivacyCopy` did not exist.
- `cookieCopy` did not exist.

Command: `npm test -- src/lib/email/templates.test.ts src/app/[locale]/(site)/privacy/privacyCopy.test.ts src/app/[locale]/(site)/cookies/cookieCopy.test.ts`

## GREEN evidence

- Focused email and legal tests: 4 files, 7 tests passed.
- Full email tests: 2 files, 3 tests passed.
- TypeScript: `npm run typecheck` passed.
- Typography scan for U+2014 and U+2015 returned no matches.
- `git diff --check` passed.

## Locale audit

`npm run audit:locales` ran and reported 59 issues. There is one blocking, pre-existing Dutch knowledge-base issue: missing meaningful `heroImageAlt` in `content/kennisbank/wordpress-backup-maken.mdx`. The remaining 58 items are expected informational notices for English knowledge-base translation partners. None are in Task 6 files.

## Self-review

- English legal headings, metadata and body are distinct and idiomatic.
- No contact details, controller identity, provider identity, legal basis, consent condition or retention period was broadened or narrowed.
- Internal legal links use locale-aware navigation.
- English email subjects, preheaders, headings, CTA labels and text alternatives are locale-driven.
- Existing Dutch behavior remains the default and its assertions pass.

## Concern

Website-analysis findings and summaries are dynamic report data. The English email localises its framing and labels, but it deliberately does not machine-translate stored report findings. If the upstream analyser produces Dutch content for an English request, those dynamic passages will remain Dutch until the analyser itself supports locale-specific output.

Independent editorial review was requested from the coordinating agent before integration.

## Editorial-gate corrections

The independent editorial gate returned changes required. All listed findings were addressed:

- The analysis form now submits a validated visitor locale. The start route stores it on both the general lead and analysis lead, and the verification email receives the same locale.
- The external widget receives the actual route locale instead of a hard-coded Dutch locale.
- The signed partner analysis request now receives the validated analysis-lead locale. The returned report's language metadata remains intact.
- English report emails only include dynamic summaries and findings when report metadata explicitly identifies English. Unknown or non-English reports use the approved safe fallback and never machine-translate stored findings.
- Cookie consent, Google Consent Mode, analytics measurement, privacy no-consent language and Google Analytics processor/transfer wording were corrected exactly as directed.
- Verification and analysis-report email wording was replaced with the approved editorial copy.

### Additional RED evidence

The new focused suite initially failed for the intended reasons: locale helper absent, partner request still sent `language: nl`, the engine omitted locale, English email leaked Dutch findings, and consent and email strings did not match the approved wording.

### Additional GREEN evidence

- Analysis, email and legal focused suite: 15 files, 83 tests passed.
- Locale propagation route test confirms English reaches both lead records and the verification email.
- Partner tests confirm `language: en` and preserved `page.language` metadata.
- Email tests confirm safe fallback for unknown language and detailed findings for explicitly English reports.
- TypeScript passed.
- Prohibited-character scan and `git diff --check` passed.
- Locale audit remains at the same unrelated baseline: one Dutch knowledge-base alt-text blocker and 58 expected English knowledge-base partner notices.

## Final output-language correction

The report model now distinguishes the analysed page language from the generated report output language. `outputLanguage` is validated on the normalized partner report, persisted explicitly on the report document and retained inside the normalized report. It is never inferred from `page.language` or from the requested visitor locale when a legacy partner response omits it.

English visitor emails include dynamic summaries and findings only when `outputLanguage` is exactly `en`. A Dutch webpage with explicitly English report output includes those findings. An English webpage with Dutch, unknown or legacy output suppresses them and uses the approved neutral fallback, next-step and reply wording.

### Final RED/GREEN evidence

- RED: five focused failures demonstrated missing output-language parsing/persistence, page-language leakage and outdated fallback wording.
- GREEN: 16 focused files and 88 tests passed.
- TypeScript, prohibited-character scan and diff check passed.
- Locale audit remains unchanged at the unrelated baseline documented above.

## Formal review evidence

- Repository inventory confirms there is no Dutch public terms and conditions route. The sitemap document lists `/be/algemene-voorwaarden/` only as recommended future content. English terms are explicitly excluded and blocked until a lawyer-approved Dutch source exists. An automated inventory assertion protects this omission from being mistaken for completed translation.
- Privacy and cookie translation briefs were added under `docs/localization/briefs/legal/` and validated against `translation-brief.schema.json`. Both record the Dutch source intent, English search intent, metadata, internal links and legal facts that must remain unchanged.
- Malformed top-level report output-language metadata is now ignored. Only the enum-validated nested normalized report field can populate the document field.
- English privacy and cookie JSX was reformatted into reviewable page structure without changing rendered copy.

Validation evidence: both legal briefs passed JSON Schema validation; focused tests passed; TypeScript passed; prohibited-character and diff checks passed. The locale audit remains at the unrelated baseline already documented.
