"use client";

import { useState, useTransition } from "react";
import {
  convertToCommercialAction,
  grantCreditAction,
  rerunAnalysisAction,
  resendReportAction,
  resetQuotaAction,
} from "@/lib/admin/analysisLeadActions";

type Props = {
  analysisLeadId: string;
  leadId: string;
  emailNormalized: string;
  /** Rapport opnieuw mailen kan alleen bij een afgeronde analyse. */
  canResendReport: boolean;
};

const BUTTON_CLASS =
  "rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50";

export function LeadAnalysisActions({ analysisLeadId, leadId, emailNormalized, canResendReport }: Props) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function run(confirmMessage: string, successMessage: string, action: () => Promise<void>) {
    if (!window.confirm(confirmMessage)) return;
    setFeedback(null);
    startTransition(async () => {
      try {
        await action();
        setFeedback(successMessage);
      } catch {
        setFeedback("Er ging iets mis. Probeer het opnieuw.");
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          className={BUTTON_CLASS}
          onClick={() =>
            run(
              "Analyse opnieuw starten? Dit forceert een nieuwe run zonder quotacheck.",
              "Nieuwe analyse gestart en afgerond. Herlaad de pagina voor het resultaat.",
              () => rerunAnalysisAction(analysisLeadId),
            )
          }
        >
          Analyse opnieuw starten
        </button>
        {canResendReport && (
          <button
            type="button"
            disabled={isPending}
            className={BUTTON_CLASS}
            onClick={() =>
              run(
                "Rapportmail opnieuw versturen naar de aanvrager?",
                "Rapportmail opnieuw verstuurd.",
                () => resendReportAction(analysisLeadId),
              )
            }
          >
            Rapport opnieuw mailen
          </button>
        )}
        <button
          type="button"
          disabled={isPending}
          className={BUTTON_CLASS}
          onClick={() =>
            run(
              "Quotum voor dit e-mailadres resetten? Eerdere analyses tellen dan niet meer mee.",
              "Quotum gereset.",
              () => resetQuotaAction(emailNormalized, leadId),
            )
          }
        >
          Quotum resetten
        </button>
        <button
          type="button"
          disabled={isPending}
          className={BUTTON_CLASS}
          onClick={() =>
            run(
              "1 extra analysetegoed toekennen aan dit e-mailadres?",
              "Extra tegoed toegekend.",
              () => grantCreditAction(emailNormalized, leadId, 1),
            )
          }
        >
          1 extra tegoed toekennen
        </button>
        <button
          type="button"
          disabled={isPending}
          className={BUTTON_CLASS}
          onClick={() =>
            run(
              "Deze lead converteren naar een commerciele lead (status Gecontacteerd)?",
              "Lead geconverteerd naar commerciele lead.",
              () => convertToCommercialAction(leadId),
            )
          }
        >
          Converteren naar commerciele lead
        </button>
      </div>
      {isPending && <p className="mt-2 text-xs text-white/50">Bezig...</p>}
      {feedback && !isPending && <p className="mt-2 text-xs text-amber-400">{feedback}</p>}
    </div>
  );
}
