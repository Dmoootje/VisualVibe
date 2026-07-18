# Task 10, wave 08 core: independent English knowledge-base review

## Review method

The reviewer read each complete Dutch source, complete English translation, translation brief, English style guide and glossary. The review covered factual and structural parity, idiomatic international business English, technical caveats, SEO and GEO intent, metadata, image text, CTAs, components and locale-correct internal links. No automatic humanizer was used.

## Per-article evidence

### `webapp-of-mobiele-app`

- Status: approved.
- Confirmed parity for the complete platform comparison, web app, mobile app and PWA definitions, offline conflict example, hardware and distribution caveats, cost factors, ten decision questions and MVP guidance.
- Preserved the source's bounded advice: browser capabilities vary, cross-platform technology does not remove platform differences, and a later mobile client depends on architecture that anticipates multiple clients.
- Confirmed natural terminology, English metadata, CTA, author details and English knowledge-base, service and region links.

### `online-cursus-filmen`

- Status: approved after substantial editorial correction.
- Compared the complete long-form source and English guide, including learning design, scripts, pilot module, production, accessibility, image rights, copyright, LMS requirements, measurement, maintenance, eight FAQs and the closing CTA.
- Rewrote Dutch-shaped wording around prior knowledge, observable behaviour, module mapping, production roles, recording, editing, captions, LMS controls, enrolment and learning outcomes.
- Preserved the explicit limits: no guaranteed learning or commercial outcome, completion is not proof of mastery, automatic captions require human review, and the legal discussion does not replace case-specific advice.
- Corrected region and sector collections to locale-correct English routes.

### `waarom-een-snelle-website-beter-rankt`

- Status: approved after correction.
- Confirmed parity for Core Web Vitals thresholds, 75th-percentile rule, mobile and desktop separation, rolling 28-day CrUX period, field versus lab data, LCP/INP/CLS explanations, optimisation roadmap, common mistakes and eight FAQs.
- Preserved Google's caveat that good Core Web Vitals do not guarantee a top ranking and retained the distinction between performance, accessibility, relevance and conversion.
- Removed corrupted zero-width/mojibake sequences, corrected decimal notation and revised literal wording such as `realisation`, `turnover` and `targeted innovation` to idiomatic business English.
- Corrected service, region and sector routes to their English locale owners.

## Validation evidence

- `npm run typecheck`: passed.
- `npx vitest run src/lib/kennisbank/translations.test.ts src/i18n/glossary.test.ts scripts/audit-locales.test.mjs`: 31 tests passed.
- `npm run validate:subservices`: passed for 46 unique service pages.
- `npm run audit:locales`: completed with 0 blocking issues; remaining notices concern Task 10 articles whose English partner has not yet landed.
- `git diff --check`: passed, with line-ending notices only.
- Targeted scans found no U+2014/U+2015, mojibake, prohibited Dutch route collections or stale Dutch service slugs in these three English files.

All three wave 08 core articles are approved for integration. English remains unpublished until the complete knowledge base and final release checks are finished.
