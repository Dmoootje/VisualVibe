# Full Website Analysis Report Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use the authenticated SEO Supercharged partner API to store and render complete white-label website analysis reports in VisualVibe.

**Architecture:** A server-only HMAC client starts and polls extended partner analyses, then validates the response with Zod. Full normalized reports live in `analysis_reports`; compact lead fields remain for email, admin, and legacy fallback. The report route remains server-first and delegates only accordions to a focused client component.

**Tech Stack:** Next.js 15, React 19, TypeScript, Zod, Firebase Admin and Firestore, Tailwind CSS, Radix Accordion, Vitest.

## Global Constraints

- Follow NOVA structure, `@/` imports, and existing container alignment.
- Keep the page background transparent and continuous.
- Use VisualVibe orange accents while preserving green score and positive states.
- Errors and warnings start open; passed checks start collapsed.
- Never expose private keys, HMAC material, raw responses, raw HTML, prompts, or poll tokens.
- Keep widget mode unchanged.
- Never add U+2014 or U+2015 characters.
- Do not add content images to the repository.

---

### Task 1: Add test harness and partner report contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/types/analysis.ts`
- Create: `src/lib/analyse/partnerReportSchema.ts`
- Test: `src/lib/analyse/partnerReportSchema.test.ts`

**Interfaces:**
- Produces: `NormalizedPartnerAuditReport`
- Produces: `parsePartnerAuditReport(input: unknown): NormalizedPartnerAuditReport`

- [ ] **Step 1: Add Vitest script and development dependency**

Add `"test": "vitest run"` and a current compatible `vitest` development dependency through `npm install -D vitest` so `package-lock.json` remains authoritative.

- [ ] **Step 2: Write failing schema tests**

Create fixtures that prove unknown fields are stripped, scores and arrays are bounded, valid optional keyword density is normalized, and malformed completed reports are rejected.

```ts
import { describe, expect, it } from 'vitest';
import { parsePartnerAuditReport } from '@/lib/analyse/partnerReportSchema';

it('strips unknown partner fields', () => {
  const report = parsePartnerAuditReport({
    schemaVersion: 1,
    url: 'https://voorbeeld.be',
    overallScore: 100,
    summary: 'Goed rapport',
    categories: [], page: {}, topIssues: [], strengths: [], technical: {},
    secret: 'never-store',
  });
  expect(report).not.toHaveProperty('secret');
});
```

- [ ] **Step 3: Confirm the tests fail**

Run: `npx vitest run src/lib/analyse/partnerReportSchema.test.ts`

Expected: FAIL because the schema module does not exist.

- [ ] **Step 4: Define normalized types and Zod schemas**

Define partner checks, categories, issues, strengths, page, technical, stats, and density types in `src/types/analysis.ts`. Implement strict schemas with `.strip()`, trimmed bounded strings, score limits, stable status enums, and array limits matching the provider.

```ts
export function parsePartnerAuditReport(input: unknown): NormalizedPartnerAuditReport {
  return partnerAuditReportSchema.parse(input);
}
```

Update `AnalysisRunResult` completed state to contain `report` and `partnerAnalysisId` instead of `raw`.

- [ ] **Step 5: Run schema tests and typecheck**

Run:

```text
npx vitest run src/lib/analyse/partnerReportSchema.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```text
git add package.json package-lock.json src/types/analysis.ts src/lib/analyse/partnerReportSchema.ts src/lib/analyse/partnerReportSchema.test.ts
git commit -m "feat(analysis): validate partner reports"
```

### Task 2: Add partner site configuration and HMAC client

**Files:**
- Modify: `src/types/analysis.ts`
- Modify: `src/lib/analyse/integration.ts`
- Modify: `src/lib/admin/analysisSettingsActions.ts`
- Modify: `src/components/admin/AnalysisIntegrationForm.tsx`
- Create: `src/lib/analyse/partnerApi.ts`
- Test: `src/lib/analyse/partnerApi.test.ts`

**Interfaces:**
- Produces: `parsePartnerSecretKey(value: string): { environment: 'live' | 'test'; keyId: string; secret: string }`
- Produces: `createPartnerHmacHeaders(input): Record<string, string>`
- Produces: `runPartnerAnalysis(input): Promise<AnalysisRunResult>`
- Adds: `partnerSiteId: number | null` to admin and runtime integration types.

- [ ] **Step 1: Write failing key and signing tests**

Cover live and test keys, secrets containing underscores, malformed keys, exact POST bytes, empty GET body, and path with query string.

```ts
expect(parsePartnerSecretKey('sk_live_key123_secret_with_parts')).toEqual({
  environment: 'live', keyId: 'key123', secret: 'secret_with_parts',
});
```

- [ ] **Step 2: Confirm the tests fail**

Run: `npx vitest run src/lib/analyse/partnerApi.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement partner API signing and polling**

Use `node:crypto` for SHA-256, HMAC-SHA256, base64url, and `randomUUID()`. Sign the exact serialized POST string and an empty GET body. Each request gets a new timestamp and nonce. POST sends `siteId`, URL, `language: 'nl'`, `resultMode: 'extended'`, external reference, and idempotency key. Completed GET results pass through `parsePartnerAuditReport`.

- [ ] **Step 4: Switch the engine facade to the secret client**

Replace widget polling in `src/lib/analyse/engine.ts` with a small facade that loads integration, checks API mode configuration, and calls `runPartnerAnalysis`. Widget rendering remains owned by the existing public page and is not modified.

- [ ] **Step 5: Persist and validate `partnerSiteId` configuration**

Store a positive integer or null in `analysis_settings/default.integration`. Add it to admin view, runtime, update action, and API-mode form. Update private-key help text from Bearer to HMAC and endpoint help text from `/widget/analyses` to `/analyses`.

- [ ] **Step 6: Run focused tests and typecheck**

Run:

```text
npx vitest run src/lib/analyse/partnerApi.test.ts src/lib/analyse/partnerReportSchema.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```text
git add src/types/analysis.ts src/lib/analyse/integration.ts src/lib/admin/analysisSettingsActions.ts src/components/admin/AnalysisIntegrationForm.tsx src/lib/analyse/partnerApi.ts src/lib/analyse/partnerApi.test.ts src/lib/analyse/engine.ts
git commit -m "feat(analysis): use signed partner api"
```

### Task 3: Store full reports and reuse references

**Files:**
- Create: `src/lib/firestore/analysisReports.ts`
- Modify: `src/lib/firestore/analysisLeads.ts`
- Modify: `src/app/api/analyse/verify/route.ts`
- Modify: `src/lib/admin/analysisLeadActions.ts`
- Modify: `src/types/analysis.ts`
- Modify: `firestore.rules`
- Test: `src/lib/firestore/analysisReports.test.ts`

**Interfaces:**
- Produces: `createAnalysisReport(input): Promise<AnalysisReportDocument>`
- Produces: `getAnalysisReport(id: string): Promise<AnalysisReportDocument | null>`
- Adds: `AnalysisLead.reportId?` and `AnalysisLead.reportSchemaVersion?`

- [ ] **Step 1: Write failing report store tests**

Mock the Firebase Admin collection reference and assert document shape, undefined stripping, and typed read conversion. Verify no raw field is accepted by the input type or written document.

- [ ] **Step 2: Confirm failure**

Run: `npx vitest run src/lib/firestore/analysisReports.test.ts`

Expected: FAIL because the report store does not exist.

- [ ] **Step 3: Implement the report store**

Create a focused server-only Firestore module for `analysis_reports`. Generate a Firestore document ID, write normalized report data plus source URL, domain, partner analysis ID, schema version, and ISO timestamps, then return the typed document.

- [ ] **Step 4: Link completed analyses**

In both public verification and admin rerun flows, create the report after a completed partner response and before marking the lead completed. Persist `reportId` and `reportSchemaVersion` alongside existing compact fields. If report persistence fails, use the existing failure path and do not mark the lead completed.

- [ ] **Step 5: Reuse report references**

When `reused_recent` selects a source lead, copy its `reportId` and schema version to the new lead while always generating a new report token. Do not duplicate the report document and do not call the partner API.

- [ ] **Step 6: Add defense-in-depth rules**

Add explicit deny rules for `analysis_leads`, `analysis_reports`, `analysis_settings`, `analysis_quota`, and `analysis_reservations` because all access uses the Admin SDK.

- [ ] **Step 7: Run tests and typecheck**

Run:

```text
npx vitest run src/lib/firestore/analysisReports.test.ts src/lib/analyse/partnerApi.test.ts src/lib/analyse/partnerReportSchema.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit**

```text
git add src/lib/firestore/analysisReports.ts src/lib/firestore/analysisReports.test.ts src/lib/firestore/analysisLeads.ts src/app/api/analyse/verify/route.ts src/lib/admin/analysisLeadActions.ts src/types/analysis.ts firestore.rules
git commit -m "feat(analysis): store full reports"
```

### Task 4: Build the VisualVibe report interface

**Files:**
- Create: `src/components/analyse/report/ReportScoreHero.tsx`
- Create: `src/components/analyse/report/ReportQuickWins.tsx`
- Create: `src/components/analyse/report/ReportAioGeo.tsx`
- Create: `src/components/analyse/report/ReportKeywordDensity.tsx`
- Create: `src/components/analyse/report/ReportCategoryAccordion.tsx`
- Create: `src/components/analyse/report/ReportIssues.tsx`
- Create: `src/components/analyse/report/ReportStrengths.tsx`
- Create: `src/components/analyse/report/index.ts`
- Modify: `src/app/[locale]/(site)/website-analyse/rapport/[token]/page.tsx`
- Test: `src/components/analyse/report/reportViewModel.test.ts`
- Create: `src/components/analyse/report/reportViewModel.ts`

**Interfaces:**
- Consumes: `NormalizedPartnerAuditReport`
- Produces: server-friendly report sections plus one accordion client boundary.

- [ ] **Step 1: Write failing view-model tests**

Test category lookup, Quick Wins values, status ordering, 100-score visibility, and missing keyword density fallback.

```ts
const model = createReportViewModel(reportFixture);
expect(model.categories).toHaveLength(reportFixture.categories.length);
expect(model.quickWins.totalChecks).toBe(reportFixture.stats?.totalChecks);
expect(model.aioGeo?.id).toBe('aio_geo');
```

- [ ] **Step 2: Confirm failure**

Run: `npx vitest run src/components/analyse/report/reportViewModel.test.ts`

Expected: FAIL because the view model does not exist.

- [ ] **Step 3: Implement the pure view model**

Normalize display ordering without changing the stored report. Return density groups, status totals, AIO/GEO category, and all categories even at score 100.

- [ ] **Step 4: Implement server report sections**

Build the score hero, Quick Wins, AIO/GEO, keyword tables, issues, and strengths as focused presentational components. Use the shared `container mx-auto px-2.5 sm:px-4`, transparent outer sections, dark card surfaces, orange accents, and green score or pass treatment.

- [ ] **Step 5: Implement accordion interaction**

Use Radix Accordion in a focused client component. Default open values include every error and warning check ID; passed checks remain collapsed. Expanded content shows description, advice, and safe optional details.

- [ ] **Step 6: Rebuild the route with legacy fallback**

Resolve token to lead, then `reportId` to report. Render the full report when found. If no `reportId` or the document is missing, render the current compact score, summary, and critical issues. Preserve `force-dynamic`, `revalidate = 0`, noindex metadata, token requirement, CTAs, and request-new button.

- [ ] **Step 7: Run view-model tests and typecheck**

Run:

```text
npx vitest run src/components/analyse/report/reportViewModel.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit**

```text
git add src/components/analyse/report src/app/[locale]/\(site\)/website-analyse/rapport/[token]/page.tsx
git commit -m "feat(analysis): render complete reports"
```

### Task 5: Final copy, security, and verification

**Files:**
- Modify: `src/lib/email/templates.ts` only if the existing CTA label needs the approved full-report wording.
- Modify: affected test fixtures as required by final integration.

**Interfaces:**
- Confirms the complete provider-consumer behavior and rollback path.

- [ ] **Step 1: Update report email CTA if needed**

Use `Bekijk je volledige websiteanalyse` while preserving the VisualVibe report URL. Never include a partner URL or secret.

- [ ] **Step 2: Run complete verification**

Run:

```text
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 3: Scan forbidden characters and secret exposure**

Run:

```text
rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}'
rg -n "privateKey|X-Partner-Signature|pollToken|raw:" src/components src/app
```

Expected: the forbidden character scan is empty. Secret-related names may appear only in server configuration and HMAC implementation, never in rendered props or stored report documents.

- [ ] **Step 4: Verify changed-file scope**

Run: `git status --short` and `git diff --check`

Expected: only intentional analysis, report, test, package, rule, and documentation files are changed. Existing untracked user files remain untouched.

- [ ] **Step 5: Commit**

```text
git add src/lib/email/templates.ts
git commit -m "chore(analysis): finalize full report flow"
```

