import { cn } from "@/lib/utils";
import type { AnalysisLead, AnalysisLeadStatus, AnalysisQuotaDecision } from "@/types/analysis";
import { LeadAnalysisActions } from "@/components/admin/LeadAnalysisActions";

const ANALYSIS_STATUS_LABELS: Record<AnalysisLeadStatus, string> = {
  pending_verification: "Wacht op verificatie",
  verified: "Geverifieerd",
  quota_checked: "Quotum gecontroleerd",
  queued: "In wachtrij",
  analysing: "Analyse loopt",
  completed: "Afgerond",
  failed: "Mislukt",
  limit_reached: "Limiet bereikt",
  expired: "Verlopen",
};

const ANALYSIS_STATUS_STYLES: Record<AnalysisLeadStatus, string> = {
  pending_verification: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  verified: "bg-white/10 text-white border-white/20",
  quota_checked: "bg-white/10 text-white border-white/20",
  queued: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  analysing: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  completed: "bg-green-500/10 text-green-400 border-green-500/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
  limit_reached: "bg-red-500/10 text-red-400 border-red-500/30",
  expired: "bg-white/5 text-white/40 border-white/10",
};

const QUOTA_DECISION_LABELS: Record<AnalysisQuotaDecision, string> = {
  allowed: "Toegestaan",
  allowed_extra_credit: "Toegestaan (extra tegoed)",
  reused_recent: "Recent rapport hergebruikt",
  limit_email: "Limiet e-mailadres bereikt",
  limit_device: "Limiet apparaat bereikt",
  limit_domain_recent: "Domein recent geanalyseerd",
  limit_ip_daily: "Netwerklimiet (24 uur) bereikt",
  limit_ip_monthly: "Netwerklimiet (30 dagen) bereikt",
  duplicate_request: "Dubbele aanvraag",
};

function AnalysisStatusBadge({ status }: { status: AnalysisLeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        ANALYSIS_STATUS_STYLES[status]
      )}
    >
      {ANALYSIS_STATUS_LABELS[status]}
    </span>
  );
}

function AnalysisField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-white/50 uppercase tracking-wide">{label}</dt>
      <dd className="text-white/80 break-words">{value || "-"}</dd>
    </div>
  );
}

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return undefined;
  return new Date(parsed).toLocaleString("nl-BE");
}

function reportPath(reportToken: string): string {
  return `/website-analyse/rapport/${encodeURIComponent(reportToken)}`;
}

function AnalysisLeadCard({ analysisLead, leadId }: { analysisLead: AnalysisLead; leadId: string }) {
  const verificationLabel = analysisLead.emailVerifiedAt
    ? `Geverifieerd op ${formatDate(analysisLead.emailVerifiedAt)}`
    : "Niet geverifieerd";
  const quotaLabel = analysisLead.quotaDecision
    ? QUOTA_DECISION_LABELS[analysisLead.quotaDecision]
    : undefined;

  return (
    <div className="rounded-md border border-white/10 bg-black/40 p-4">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <AnalysisStatusBadge status={analysisLead.status} />
        {analysisLead.forceRequested && (
          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 whitespace-nowrap">
            Nieuwe analyse gevraagd
          </span>
        )}
        <span className="text-xs text-white/40 ml-auto">
          Aangevraagd op {formatDate(analysisLead.createdAt)}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
        <AnalysisField label="Domein" value={analysisLead.normalizedDomain} />
        <AnalysisField label="Opgegeven URL" value={analysisLead.submittedUrl} />
        <AnalysisField label="Verificatie" value={verificationLabel} />
        <AnalysisField
          label="Score"
          value={
            typeof analysisLead.analysisScore === "number"
              ? String(analysisLead.analysisScore)
              : undefined
          }
        />
        <AnalysisField
          label="Quotumbeslissing"
          value={quotaLabel && analysisLead.quotaReason ? `${quotaLabel} (${analysisLead.quotaReason})` : quotaLabel}
        />
        <AnalysisField label="Afgerond" value={formatDate(analysisLead.completedAt)} />
        <AnalysisField label="Mislukt" value={formatDate(analysisLead.failedAt)} />
        <div>
          <dt className="text-xs text-white/50 uppercase tracking-wide">Rapport</dt>
          <dd className="text-white/80">
            {analysisLead.reportToken ? (
              <a
                href={reportPath(analysisLead.reportToken)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline"
              >
                Rapport openen
              </a>
            ) : (
              "-"
            )}
          </dd>
        </div>
      </dl>

      {analysisLead.criticalIssues && analysisLead.criticalIssues.length > 0 && (
        <div className="mt-4">
          <span className="text-xs text-white/50 uppercase tracking-wide">Kritieke punten</span>
          <ul className="mt-1 list-disc pl-5 text-sm text-white/80">
            {analysisLead.criticalIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-4">
        <LeadAnalysisActions
          analysisLeadId={analysisLead.id}
          leadId={leadId}
          emailNormalized={analysisLead.emailNormalized}
          canResendReport={analysisLead.status === "completed" && Boolean(analysisLead.reportToken)}
        />
      </div>
    </div>
  );
}

type Props = {
  leadId: string;
  /** Analyses die aan deze lead hangen, nieuwste eerst. */
  analysisLeads: AnalysisLead[];
  /** Alle analyses van hetzelfde e-mailadres (kan overlappen met analysisLeads). */
  emailHistory: AnalysisLead[];
};

export function LeadAnalysisPanel({ leadId, analysisLeads, emailHistory }: Props) {
  const shownIds = new Set(analysisLeads.map((analysisLead) => analysisLead.id));
  const otherAnalyses = emailHistory.filter((analysisLead) => !shownIds.has(analysisLead.id));

  return (
    <section className="rounded-lg border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-semibold mb-4">Websiteanalyse</h2>

      {analysisLeads.length === 0 ? (
        <p className="text-sm text-white/40">Geen analyseaanvragen gevonden voor deze lead.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {analysisLeads.map((analysisLead) => (
            <AnalysisLeadCard key={analysisLead.id} analysisLead={analysisLead} leadId={leadId} />
          ))}
        </div>
      )}

      {otherAnalyses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-white/70 mb-2">
            Vorige analyses van dit e-mailadres
          </h3>
          <ul className="flex flex-col gap-2">
            {otherAnalyses.map((analysisLead) => (
              <li
                key={analysisLead.id}
                className="flex flex-wrap items-center gap-3 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                <AnalysisStatusBadge status={analysisLead.status} />
                <span className="text-white/80">{analysisLead.normalizedDomain}</span>
                {typeof analysisLead.analysisScore === "number" && (
                  <span className="text-white/60">Score {analysisLead.analysisScore}</span>
                )}
                {analysisLead.reportToken && (
                  <a
                    href={reportPath(analysisLead.reportToken)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline"
                  >
                    Rapport
                  </a>
                )}
                <span className="ml-auto text-xs text-white/40">
                  {formatDate(analysisLead.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
