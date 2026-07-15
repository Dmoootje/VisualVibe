# Fresh Analysis Only Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zorg dat iedere toegestane VisualVibe-aanvraag een nieuwe uitgebreide partneranalyse start en dat een klant na 2 minuten opnieuw kan testen.

**Architecture:** Verwijder rapporthergebruik uit de quotatransactie en uit de verificatieroute. Behoud historische statuswaarden alleen voor bestaande Firestore-documenten en beheerweergave. Verwijder de actieve domeincooldownconfiguratie en zet het configureerbare duplicaatvenster standaard en in productie op 2 minuten.

**Tech Stack:** Next.js 15, TypeScript, Firebase Admin/Firestore, Vitest, Zod.

## Global Constraints

- Gebruik nooit een ouder rapport voor een nieuwe aanvraag.
- Iedere toegestane aanvraag roept de geheime partner-API aan met `resultMode: "extended"`.
- Behoud e-mail-, apparaat- en IP-quota.
- Het duplicaatvenster is 2 minuten.
- Historische leads en rapportlinks blijven leesbaar.
- Wijzig SEO Supercharged niet.
- Gebruik geen em dash of horizontale bar.

---

### Task 1: Leg altijd-nieuw gedrag vast met een regressietest

**Files:**
- Create: `src/lib/analyse/quota.test.ts`
- Modify: `src/lib/analyse/quota.ts`

**Interfaces:**
- Consumes: `checkAndReserveQuota(input: QuotaCheckInput): Promise<QuotaOutcome>`
- Produces: Een quotabeslissing die bij een recente domeinsuccessentry een nieuwe reservering retourneert en nooit `reused_recent`.

- [ ] **Step 1: Schrijf de falende test**

Maak een kleine Firestore-transactiefake met lege e-mail- en comboscopes, een recente `success` in de domeinscope en een historische afgeronde lead. Roep `checkAndReserveQuota` aan met quota die een nieuwe analyse toelaten:

```ts
const result = await checkAndReserveQuota({
  emailNormalized: "klant@example.com",
  normalizedDomain: "voorbeeld.be",
  config: {
    enabled: true,
    maxPerEmail90d: 3,
    maxPerDevice90d: 3,
    maxPerIp24h: 10,
    maxPerIp30d: 25,
    maxCodesPerEmailPerHour: 5,
    duplicateWindowMinutes: 2,
    codeTtlMinutes: 15,
    maxCodeAttempts: 5,
  },
});

expect(result.decision).toBe("allowed");
expect(transaction.create).toHaveBeenCalledOnce();
```

- [ ] **Step 2: Draai de test en bevestig de juiste fout**

Run: `npx vitest run src/lib/analyse/quota.test.ts`

Expected: FAIL omdat de huidige code `reused_recent` teruggeeft en geen reservering maakt.

- [ ] **Step 3: Verwijder hergebruik uit de quotalaag**

In `src/lib/analyse/quota.ts`:

- verwijder `LEADS_COLLECTION`;
- verwijder de `reused_recent`-variant uit `QuotaOutcome`;
- verwijder de volledige recente-domeinquery en de return met `reuseFrom`;
- hernummer de opmerkingen voor duplicaat, e-mail, apparaat en reservering;
- behoud `domainScope` in de reserveringsscopes, zodat een voltooide scan nog steeds correct voor quota en audit wordt geregistreerd.

De toegestane uitkomst blijft:

```ts
return {
  decision: usesExtraCredit ? "allowed_extra_credit" : "allowed",
  reservationId: reservationRef.id,
};
```

- [ ] **Step 4: Draai de gerichte test opnieuw**

Run: `npx vitest run src/lib/analyse/quota.test.ts`

Expected: PASS, met een nieuwe reservering ondanks de recente historische domeinsuccessentry.

- [ ] **Step 5: Commit**

```text
git add src/lib/analyse/quota.ts src/lib/analyse/quota.test.ts
git commit -m "fix(analysis): always reserve a fresh scan"
```

### Task 2: Verwijder het hergebruikpad uit de verificatieroute

**Files:**
- Modify: `src/app/api/analyse/verify/route.ts`
- Delete: `src/lib/analyse/reportLinking.ts`
- Delete: `src/lib/analyse/reportLinking.test.ts`

**Interfaces:**
- Consumes: `QuotaOutcome` zonder `reused_recent`.
- Produces: Iedere toegestane verificatie gaat via `runWebsiteAnalysis`, `createAnalysisReport` en een nieuw `reportId`.

- [ ] **Step 1: Draai de compiler na de QuotaOutcome-wijziging**

Run: `npm run typecheck`

Expected: FAIL in `src/app/api/analyse/verify/route.ts` omdat de route nog vergelijkt met `reused_recent` en `reuseFrom` leest terwijl die variant niet meer in `QuotaOutcome` bestaat.

- [ ] **Step 2: Verwijder de oude routevertakking**

In `src/app/api/analyse/verify/route.ts`:

- verwijder de import van `buildReusedReportPatch`;
- verwijder de volledige `if (outcome.decision === "reused_recent")`-tak;
- laat limietafhandeling en de bestaande verse analyseflow verder ongewijzigd.

Verwijder daarna `reportLinking.ts` en de bijbehorende test, omdat er geen nieuw rapporthergebruik meer bestaat.

- [ ] **Step 3: Draai compiler en gerichte test opnieuw**

Run: `npm run typecheck`

Expected: PASS.

Run: `npx vitest run src/lib/analyse/quota.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit**

```text
git add src/app/api/analyse/verify/route.ts
git rm src/lib/analyse/reportLinking.ts src/lib/analyse/reportLinking.test.ts
git commit -m "fix(analysis): remove recent report reuse"
```

### Task 3: Verwijder domeincooldown en stel 2 minuten in

**Files:**
- Modify: `src/types/analysis.ts`
- Modify: `src/lib/analyse/config.ts`
- Modify: `src/lib/admin/analysisSettingsActions.ts`
- Modify: `src/components/admin/AnalysisSettingsForm.tsx`
- Modify: `src/lib/analyse/quota.test.ts`

**Interfaces:**
- Consumes: `AnalysisQuotaConfig`.
- Produces: Actieve quota zonder `domainCooldownDays` en met `duplicateWindowMinutes: 2` als standaard.

- [ ] **Step 1: Schrijf falende configuratieasserties**

Voeg toe aan `src/lib/analyse/quota.test.ts`:

```ts
expect(DEFAULT_ANALYSIS_QUOTA_CONFIG.duplicateWindowMinutes).toBe(2);
expect(DEFAULT_ANALYSIS_QUOTA_CONFIG).not.toHaveProperty("domainCooldownDays");
```

- [ ] **Step 2: Draai de test en bevestig de juiste fout**

Run: `npx vitest run src/lib/analyse/quota.test.ts`

Expected: FAIL omdat de standaard nog 10 minuten is en `domainCooldownDays` nog bestaat.

- [ ] **Step 3: Pas actief type, opslag en beheerformulier aan**

In `src/types/analysis.ts`:

- verwijder `domainCooldownDays` uit `AnalysisQuotaConfig` en de standaardconfig;
- zet `duplicateWindowMinutes` op `2`;
- behoud `reused_recent` en `limit_domain_recent` uitsluitend in `AnalysisQuotaDecision` voor historische beheerdata.

In `src/lib/analyse/config.ts`, `src/lib/admin/analysisSettingsActions.ts` en `src/components/admin/AnalysisSettingsForm.tsx`:

- verwijder `domainCooldownDays` uit de actieve veldlijsten;
- laat bestaande Firestore-data ongemoeid;
- pas de duplicaattekst aan naar bescherming tegen dubbelklikken, zonder rapporthergebruik te suggereren.

- [ ] **Step 4: Draai gerichte en volledige tests**

Run: `npx vitest run src/lib/analyse/quota.test.ts`

Expected: PASS.

Run: `npm test`

Expected: Alle testbestanden slagen.

- [ ] **Step 5: Commit**

```text
git add src/types/analysis.ts src/lib/analyse/config.ts src/lib/admin/analysisSettingsActions.ts src/components/admin/AnalysisSettingsForm.tsx src/lib/analyse/quota.test.ts
git commit -m "fix(analysis): allow retesting after two minutes"
```

### Task 4: Verifieer, publiceer en bereid productie-uitrol voor

**Files:**
- Modify only if verification finds an in-scope defect.

**Interfaces:**
- Consumes: De voltooide verse-analyseflow.
- Produces: Een schone concept-PR en een veilige productie-instructie.

- [ ] **Step 1: Voer alle lokale controles uit**

```text
npm test
npm run typecheck
npm run lint
npm run build
git diff origin/main...HEAD --check
rg --hidden -g '!.git/**' -g '!node_modules/**' -e '\x{2014}' -e '\x{2015}'
```

Expected: tests, typecheck en build slagen; lint heeft geen nieuwe errors; diffcheck en verboden-tekencontrole geven geen uitvoer.

- [ ] **Step 2: Controleer het uiteindelijke bereik**

```text
git status -sb
git diff --stat origin/main...HEAD
git diff origin/main...HEAD -- src/lib/analyse/quota.ts src/app/api/analyse/verify/route.ts src/types/analysis.ts src/lib/analyse/config.ts src/lib/admin/analysisSettingsActions.ts src/components/admin/AnalysisSettingsForm.tsx
```

Expected: alleen de goedgekeurde analyse-, quota-, test- en documentatiebestanden zijn gewijzigd.

- [ ] **Step 3: Push en open een concept-PR**

```text
git push -u origin fix/full-report-legacy-reuse
gh pr create --draft --base main --head fix/full-report-legacy-reuse --title "fix: always run a fresh website analysis"
```

- [ ] **Step 4: Controleer GitHub**

Wacht tot de VisualVibe Validate-workflow groen is en controleer dat de PR mergeable blijft.

- [ ] **Step 5: Pas na merge/deploy de productie-instelling aan**

Werk `analysis_settings/default.duplicateWindowMinutes` bij naar `2`. Start daarna een nieuwe analyse en controleer dat de lead een nieuw `reportId` heeft en dat `analysis_reports` een nieuw document bevat.
