# Full white-label website analysis report design

Date: 2026-07-15
Status: approved for implementation planning
Repository base: `c45139c7fe5f5b9e59b7eb1efa2e3336f8c7430b`
Feature branch: `feat/full-website-analysis-report`
Provider dependency: SEO Supercharged branch `feat/partner-full-analysis-report`

## Goal

Replace the current teaser-like report experience with a complete white-label website analysis report rendered by VisualVibe. The report should resemble the information hierarchy of the extended SEO Supercharged analyzer while using VisualVibe styling and retaining recognizable green score and positive-status elements.

The current verification, quota, lead, email, and widget flows remain compatible.

## Scope

API mode uses the authenticated SEO Supercharged partner API and requests `resultMode: "extended"`. VisualVibe validates, normalizes, stores, and renders the safe report.

The report includes:

- overall score and summary;
- Quick Wins;
- AIO/GEO health checks;
- keyword density for one, two, and three word phrases;
- metadata and page structure;
- content, links, media, business, and technical checks;
- strengths;
- prioritized issues and recommendations.

The following are out of scope:

- a pixel-perfect copy of SEO Supercharged;
- iframe or external report embedding;
- duplicated analyzer calculations;
- a mandatory backfill of legacy reports;
- changing production configuration values without explicit need.

## Integration configuration

API mode requires a numeric `partnerSiteId`. The admin configuration form validates it and reports whether API mode is ready.

The existing public key remains available for widget mode. The private key remains encrypted and server-only. Neither key nor its parsed components may appear in client code, report documents, email content, or logs.

## Partner API client

A focused server-only module owns:

- parsing live and test private keys;
- creating HMAC headers;
- starting an extended analysis;
- polling status with a fresh timestamp and nonce per request;
- timeout and retry policy;
- safe error mapping;
- runtime validation of the completed extended result.

Key parsing removes the `sk_live_` or `sk_test_` prefix, takes the first remaining segment as `keyId`, and treats all content after the next underscore as the secret. This preserves secrets that contain underscores.

API mode calls:

- `POST {apiBaseUrl}/analyses`
- `GET {apiBaseUrl}/analyses/{analysisId}`

It no longer calls `/widget/analyses`. Widget mode remains unchanged.

## Runtime validation and normalization

External JSON is never trusted directly. Runtime schemas:

- constrain scores to 0 through 100;
- trim and limit strings;
- limit arrays and locations;
- recognize supported check statuses;
- strip unknown fields;
- accept missing optional sections;
- reject structurally unsafe completed reports.

Only the normalized report is stored. Raw responses, raw HTML, prompts, poll tokens, provider information, and secret data are not stored.

## Storage model

Full reports are stored separately from leads in `analysis_reports`.

Conceptual document:

```ts
type AnalysisReportDocument = {
  id: string;
  partnerAnalysisId: string;
  schemaVersion: number;
  normalizedDomain: string;
  sourceUrl: string;
  report: NormalizedPartnerAuditReport;
  createdAt: string;
  updatedAt: string;
};
```

`AnalysisLead` gains optional `reportId` and `reportSchemaVersion`. It continues to store compact score, summary, critical issues, and report token fields for admin views, email, and rollback compatibility.

The report lookup chain is:

```text
unpredictable report token -> analysis lead -> reportId -> analysis report
```

## Recent report reuse

When quota logic returns `reused_recent`:

- no new partner analysis is started;
- the new lead receives a new unpredictable report token;
- the new lead references the existing `reportId`;
- compact summary fields are copied to the new lead;
- the source report document is not duplicated.

If a reusable legacy lead has no `reportId`, existing compact fallback behavior remains available. No backfill is required.

## Report page structure

The existing localized route remains unchanged:

```text
/[locale]/website-analyse/rapport/[token]
```

The page remains dynamic, noindex, non-cacheable, responsive, and protected by the unpredictable token.

Sections appear in this order:

1. report header with domain, checked URL, and analysis date;
2. score hero with a large green score circle, summary, and status counts;
3. Quick Wins cards for word count, top keyword, passed checks, warnings, and problems;
4. AIO/GEO Health Check with a dedicated score and checks;
5. keyword density for one, two, and three word phrases;
6. detailed categories for metadata, structure, content, links, media, business, technical, and AIO/GEO;
7. strengths when available;
8. prioritized improvement points with explanation and advice;
9. existing VisualVibe calls to discuss results, request a quote, or start a new analysis.

A 100 out of 100 report still displays all available categories, keyword data, technical details, and strengths.

## Visual and interaction design

The report uses the existing continuous VisualVibe background, transparent section wrappers, subtle dark cards, orange brand accents, and existing container alignment.

The following remain green:

- score circle;
- positive score text;
- passed check states;
- positive underline or progress treatment.

Detailed checks use reusable accordion components:

- errors and warnings are open by default;
- passed checks are collapsed by default;
- each check can be opened and closed independently;
- expanded content shows explanation, recommendation, and safe optional details;
- mobile layouts use compact cards or safely scrollable data layouts.

Client components are limited to genuine interaction such as accordions. Data loading and main composition remain server-first.

## Error handling

- Invalid partner configuration produces a safe actionable admin error.
- Transient partner failures use bounded retries and existing analysis failure handling.
- Invalid completed report data is not persisted.
- Missing optional keyword or category data renders a clear empty state.
- Legacy leads without `reportId` render the current compact report.
- Report email links always point to the VisualVibe route.
- No partner URL or secret detail appears in user-facing errors.

## Testing

Automated coverage must include:

1. live and test key parsing, including secrets with underscores;
2. HMAC POST signing;
3. HMAC GET signing with an empty body;
4. extended report runtime validation and limits;
5. `analysis_reports` persistence;
6. completed analysis linking a new `reportId`;
7. recent reuse retaining the same `reportId` with a new token;
8. legacy report fallback;
9. complete sections for a 100 out of 100 report;
10. safe behavior without keyword density;
11. required report token lookup;
12. absence of private key material in stored or rendered output;
13. unchanged widget mode.

Required verification includes relevant unit and integration tests plus:

```text
npm run typecheck
npm run build
```

## Rollout and rollback

SEO Supercharged extended API support is deployed first. VisualVibe is deployed after the provider contract is available and configured with a valid partner site ID.

Rollback is safe because compact lead fields remain populated, legacy rendering remains available, widget mode remains supported, and the new report collection is additive. No destructive lead migration is performed.

## Acceptance criteria

- API mode uses the authenticated partner endpoints and requests extended mode.
- POST and every GET poll are signed with fresh HMAC metadata.
- Completed reports are validated and stored in `analysis_reports`.
- Leads reference reports through `reportId`.
- Recent reuse does not start a paid analysis.
- Legacy report links still open.
- A score of 100 still produces a complete useful report.
- Problems and warnings start open; passed checks start collapsed.
- The report uses VisualVibe styling while retaining green positive elements.
- Widget mode remains unchanged.
- No secrets, raw HTML, prompts, or poll tokens are exposed or stored.
- Required tests and builds pass.
