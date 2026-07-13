"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  History,
  Loader2,
  Mail,
  RefreshCw,
  Save,
  Send,
} from "lucide-react";
import {
  handleLeadEmailAction,
  type LeadEmailActionState,
} from "@/lib/admin/leadEmailActions";
import type { MailHistory as MailHistoryRecord, MailHistoryStatus, MailHistoryType } from "@/types/email";

const INITIAL_STATE: LeadEmailActionState = { status: "idle" };

const TYPE_LABELS: Record<MailHistoryType, string> = {
  customer_confirmation: "Klantbevestiging",
  admin_notification: "Interne melding",
  ai_draft: "AI-antwoordconcept",
  manual_reply: "Handmatig antwoord",
  automated_reply: "Automatisch antwoord",
  analysis_verification: "Analyse-verificatiecode",
  analysis_report: "Analyserapport",
  analysis_admin_notification: "Interne analysemelding",
};

const STATUS_LABELS: Record<MailHistoryStatus, string> = {
  draft: "Concept",
  queued: "In wachtrij",
  sent: "Verstuurd",
  failed: "Mislukt",
};

const STATUS_STYLES: Record<MailHistoryStatus, string> = {
  draft: "border-white/15 bg-white/[0.06] text-white/65",
  queued: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  sent: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  failed: "border-red-500/30 bg-red-500/10 text-red-300",
};

export function LeadCommunicationPanel({
  leadId,
  history,
}: {
  leadId: string;
  history: MailHistoryRecord[];
}) {
  const [state, formAction, isPending] = useActionState(handleLeadEmailAction, INITIAL_STATE);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const orderedHistory = useMemo(
    () => [...history].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [history],
  );
  const draft = orderedHistory.find(
    (item) => item.type === "ai_draft" && item.status === "draft",
  );

  async function copyText() {
    const text = textareaRef.current?.value.trim() ?? "";
    if (!text) {
      setCopyStatus("Er is nog geen tekst om te kopiëren.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Tekst gekopieerd.");
    } catch {
      setCopyStatus("Kopiëren is niet gelukt. Selecteer de tekst handmatig.");
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Mail className="h-5 w-5 text-amber-400" aria-hidden="true" />
            Communicatie
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/50">
            Controleer en bewerk ieder concept voor verzending. AI-antwoorden worden vanuit deze
            handmatige workflow nooit automatisch verstuurd.
          </p>
        </div>
        {draft && (
          <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/50">
            Concept van {formatDate(draft.createdAt)}
          </span>
        )}
      </div>

      <form action={formAction} className="mt-5 flex flex-col gap-4">
        <input type="hidden" name="leadId" value={leadId} />
        <input type="hidden" name="draftId" value={draft?.id ?? ""} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`lead-email-subject-${leadId}`} className="text-sm text-white/70">
            Onderwerp
          </label>
          <input
            key={`subject-${draft?.id ?? "empty"}`}
            id={`lead-email-subject-${leadId}`}
            name="subject"
            defaultValue={draft?.subject ?? ""}
            maxLength={200}
            placeholder="Onderwerp van het antwoord"
            className="w-full rounded-md border border-white/10 bg-black/25 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`lead-email-body-${leadId}`} className="text-sm text-white/70">
            Antwoordtekst
          </label>
          <textarea
            key={`body-${draft?.id ?? "empty"}`}
            ref={textareaRef}
            id={`lead-email-body-${leadId}`}
            name="body"
            defaultValue={draft?.textBody ?? ""}
            rows={14}
            maxLength={30_000}
            placeholder="Genereer een veilig concept of schrijf hier je antwoord."
            className="w-full resize-y rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
          />
          <p className="text-xs leading-5 text-white/40">
            De VisualVibe-opmaak, ondertekening en platte tekstvariant worden bij verzending veilig
            op de server opgebouwd.
          </p>
        </div>

        {state.status !== "idle" && <ActionMessage state={state} />}
        {copyStatus && <p className="text-xs text-white/55" role="status">{copyStatus}</p>}

        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <ActionButton
            name="intent"
            value="regenerate"
            disabled={isPending}
            icon={RefreshCw}
            label="Concept opnieuw genereren"
          />
          <ActionButton
            name="intent"
            value="save"
            disabled={isPending}
            icon={Save}
            label="Tekst en onderwerp opslaan"
          />
          <ActionButton
            name="intent"
            value="test"
            disabled={isPending}
            icon={Mail}
            label="Testmail naar mezelf"
            accent
          />
          <ActionButton
            name="intent"
            value="send"
            disabled={isPending}
            icon={Send}
            label="Verstuur naar klant"
            primary
            onClick={(event) => {
              if (!window.confirm("Wil je dit antwoord nu naar de klant versturen?")) {
                event.preventDefault();
              }
            }}
          />
          <button
            type="button"
            onClick={copyText}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3.5 py-2 text-sm font-medium text-white/70 hover:bg-white/5 disabled:opacity-50"
          >
            <Clipboard className="h-4 w-4" aria-hidden="true" />
            Kopieer tekst
          </button>
        </div>

        {isPending && (
          <p className="flex items-center gap-2 text-xs text-white/50" role="status">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Actie wordt verwerkt. Sluit deze pagina nog niet.
          </p>
        )}
      </form>

      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <History className="h-4 w-4 text-amber-400" aria-hidden="true" />
          E-mailhistorie
        </h3>

        {orderedHistory.length === 0 ? (
          <p className="mt-3 text-sm text-white/40">Nog geen communicatie opgeslagen.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {orderedHistory.map((item) => (
              <li key={item.id} className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">{TYPE_LABELS[item.type]}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[item.status]}`}>
                        {STATUS_LABELS[item.status]}
                      </span>
                    </div>
                    <p className="mt-1 break-words text-sm text-white/70">{item.subject || "Zonder onderwerp"}</p>
                    <p className="mt-1 text-xs text-white/40">
                      Aan: {item.to.join(", ") || "-"} · {formatDate(item.sentAt ?? item.createdAt)}
                    </p>
                  </div>
                  {item.sentAt && (
                    <span className="text-xs text-emerald-300/75">Verstuurd {formatDate(item.sentAt)}</span>
                  )}
                </div>

                {item.status === "failed" && (
                  <div className="mt-3 rounded-md border border-red-500/20 bg-red-500/[0.07] p-3 text-xs leading-5 text-red-200/80">
                    <p className="font-medium text-red-300">Verzending mislukt{item.errorCode ? ` (${item.errorCode})` : ""}</p>
                    {item.errorMessage && <p className="mt-1 break-words">{item.errorMessage}</p>}
                  </div>
                )}

                {item.textBody && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-medium text-white/50 hover:text-white/75">
                      Tekst bekijken
                    </summary>
                    <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md border border-white/10 bg-black/30 p-3 font-sans text-xs leading-5 text-white/60">
                      {item.textBody}
                    </pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ActionMessage({ state }: { state: LeadEmailActionState }) {
  const success = state.status === "success";
  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
        success
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span>{state.message}</span>
    </div>
  );
}

function ActionButton({
  name,
  value,
  label,
  icon: Icon,
  disabled,
  primary = false,
  accent = false,
  onClick,
}: {
  name: string;
  value: string;
  label: string;
  icon: typeof Send;
  disabled: boolean;
  primary?: boolean;
  accent?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const classes = primary
    ? "border-transparent bg-gradient-to-r from-red-500 to-amber-500 text-white hover:from-red-600 hover:to-amber-600"
    : accent
      ? "border-amber-500/35 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10";

  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium disabled:opacity-50 ${classes}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "onbekende datum";
  return new Intl.DateTimeFormat("nl-BE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
