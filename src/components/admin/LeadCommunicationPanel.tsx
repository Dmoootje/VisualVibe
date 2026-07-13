"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  History,
  Inbox,
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
  incoming_reply: "Ontvangen antwoord",
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
  received: "Ontvangen",
};

const STATUS_STYLES: Record<MailHistoryStatus, string> = {
  draft: "border-white/15 bg-white/[0.06] text-white/65",
  queued: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  sent: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  failed: "border-red-500/30 bg-red-500/10 text-red-300",
  received: "border-violet-400/30 bg-violet-400/10 text-violet-200",
};

export function LeadCommunicationPanel({
  leadId,
  history,
  imapEnabled,
  sendNonce,
}: {
  leadId: string;
  history: MailHistoryRecord[];
  imapEnabled: boolean;
  sendNonce: string;
}) {
  const [state, formAction, isPending] = useActionState(handleLeadEmailAction, INITIAL_STATE);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const orderedHistory = useMemo(
    () => [...history].sort(
      (a, b) => new Date(b.receivedAt ?? b.createdAt).getTime() - new Date(a.receivedAt ?? a.createdAt).getTime(),
    ),
    [history],
  );
  const latestSentReply = orderedHistory.find(
    (item) => item.type === "manual_reply" && item.status === "sent" && !item.subject.startsWith("[TEST]"),
  );
  const draft = orderedHistory.find(
    (item) =>
      item.type === "ai_draft" &&
      item.status === "draft" &&
      (!latestSentReply || new Date(item.createdAt) > new Date(latestSentReply.sentAt ?? latestSentReply.createdAt)),
  );
  const latestIncoming = orderedHistory.find(
    (item) => item.type === "incoming_reply" && item.status === "received",
  );
  const draftIncoming = draft?.inReplyTo
    ? orderedHistory.find(
        (item) => item.type === "incoming_reply" && item.providerMessageId === draft.inReplyTo,
      )
    : undefined;
  const draftId = draft?.id;
  const [selectedReplyId, setSelectedReplyId] = useState(
    draftIncoming?.id ?? latestIncoming?.id ?? "",
  );
  const [useDraftContent, setUseDraftContent] = useState(Boolean(draft));
  const selectedIncoming = orderedHistory.find(
    (item) => item.id === selectedReplyId && item.type === "incoming_reply",
  );
  const replySubject = selectedIncoming?.subject
    ? /^(?:re|aw|sv):/i.test(selectedIncoming.subject)
      ? selectedIncoming.subject
      : `Re: ${selectedIncoming.subject}`
    : "";

  useEffect(() => {
    setUseDraftContent(Boolean(draftId));
  }, [draftId]);

  function selectReplyTarget(historyId: string) {
    const currentBody = textareaRef.current?.value.trim() ?? "";
    if (
      currentBody &&
      !window.confirm("Je huidige antwoordtekst wordt leeggemaakt wanneer je een ander bericht kiest. Doorgaan?")
    ) {
      return;
    }
    if (textareaRef.current) textareaRef.current.value = "";
    setUseDraftContent(false);
    setSelectedReplyId(historyId);
  }

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
        <input type="hidden" name="replyToMailId" value={selectedReplyId} />
        <input type="hidden" name="sendNonce" value={sendNonce} />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-violet-400/20 bg-violet-400/[0.06] p-4">
          <div>
            <p className="text-sm font-medium text-violet-100">Inkomende antwoorden</p>
            <p className="mt-1 text-xs leading-5 text-white/45">
              {imapEnabled ? (
                "Haal recente berichten van dit leadadres op via de ingestelde IMAP-mailbox."
              ) : (
                <>
                  Schakel eerst IMAP in bij de{" "}
                  <Link href="/admin/settings/email" className="text-violet-200 underline hover:text-white">
                    e-mailinstellingen
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
          <ActionButton
            name="intent"
            value="sync"
            disabled={isPending || !imapEnabled}
            icon={Inbox}
            label="Inbox synchroniseren"
            accent
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
          <div>
            <p className="font-medium text-white/80">
              {selectedIncoming
                ? `Antwoord op: ${selectedIncoming.subject || "Zonder onderwerp"}`
                : "Nieuw bericht zonder e-mailthread"}
            </p>
            {selectedIncoming && (
              <p className="mt-1 text-xs text-white/40">
                Ontvangen {formatDate(selectedIncoming.receivedAt ?? selectedIncoming.createdAt)}
              </p>
            )}
          </div>
          {selectedIncoming && (
            <button
              type="button"
              onClick={() => selectReplyTarget("")}
              className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/5 hover:text-white"
            >
              Nieuw bericht starten
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`lead-email-subject-${leadId}`} className="text-sm text-white/70">
            Onderwerp
          </label>
          <input
            key={`subject-${useDraftContent ? draft?.id ?? "draft" : selectedReplyId || "new"}`}
            id={`lead-email-subject-${leadId}`}
            name="subject"
            defaultValue={useDraftContent ? draft?.subject ?? replySubject : replySubject}
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
              <li
                key={item.id}
                className={`rounded-lg border p-4 ${
                  item.direction === "inbound"
                    ? "border-violet-400/20 bg-violet-400/[0.05]"
                    : "border-white/10 bg-black/25"
                }`}
              >
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
                      {item.direction === "inbound"
                        ? `Van: ${item.from.join(", ") || "-"}`
                        : `Aan: ${item.to.join(", ") || "-"}`}
                      {" · "}
                      {formatDate(item.receivedAt ?? item.sentAt ?? item.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.sentAt && (
                      <span className="text-xs text-emerald-300/75">Verstuurd {formatDate(item.sentAt)}</span>
                    )}
                    {item.direction === "inbound" && (
                      <button
                        type="button"
                        onClick={() => selectReplyTarget(item.id)}
                        disabled={isPending || selectedReplyId === item.id}
                        className="rounded-md border border-violet-400/25 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-100 hover:bg-violet-400/20 disabled:cursor-default disabled:opacity-60"
                      >
                        {selectedReplyId === item.id ? "Geselecteerd" : "Beantwoorden"}
                      </button>
                    )}
                  </div>
                </div>

                {item.status === "failed" && (
                  <div className="mt-3 rounded-md border border-red-500/20 bg-red-500/[0.07] p-3 text-xs leading-5 text-red-200/80">
                    <p className="font-medium text-red-300">Verzending mislukt{item.errorCode ? ` (${item.errorCode})` : ""}</p>
                    {item.errorMessage && <p className="mt-1 break-words">{item.errorMessage}</p>}
                  </div>
                )}

                {item.direction === "inbound" &&
                  (item.attachmentNames.length > 0 || item.contentTruncated) && (
                    <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/[0.07] p-3 text-xs leading-5 text-amber-100/80">
                      {item.attachmentNames.length > 0 && (
                        <p>
                          Bijlage{item.attachmentNames.length === 1 ? "" : "n"}: {item.attachmentNames.join(", ")}
                        </p>
                      )}
                      <p className={item.attachmentNames.length > 0 ? "mt-1" : undefined}>
                        Bijlagen worden niet in de app opgeslagen. Open de originele mailbox om ze te bekijken
                        {item.contentTruncated ? " of om het volledige lange bericht te lezen" : ""}.
                      </p>
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
