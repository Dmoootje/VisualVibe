"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Maximize2,
  Minimize2,
  Paperclip,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  deleteDraftAction,
  saveDraftAction,
  searchContactsAction,
  sendEmailAction,
} from "@/lib/admin/emailClientActions";
import type {
  EmailAddressValue,
  EmailAttachmentMeta,
  EmailDraftKind,
  EmailMessage,
  EmailTemplateMode,
  MailboxSummary,
} from "@/types/emailClient";
import { formatBytes } from "./emailClientUi";
import { RichTextEditor } from "./RichTextEditor";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_TOTAL_BYTES = 25 * 1024 * 1024;

export type ComposerInit = {
  draftId?: string;
  mailboxId: string;
  kind: EmailDraftKind;
  relatedMessage?: EmailMessage;
  to: EmailAddressValue[];
  cc: EmailAddressValue[];
  bcc: EmailAddressValue[];
  subject: string;
  htmlBody: string;
  templateMode: EmailTemplateMode;
  includeQuote: boolean;
  attachments: EmailAttachmentMeta[];
};

type Chip = EmailAddressValue & { valid: boolean };

function toChips(values: EmailAddressValue[]): Chip[] {
  return values.map((value) => ({ ...value, valid: EMAIL_PATTERN.test(value.address) }));
}

function chipsToValues(chips: Chip[]): EmailAddressValue[] {
  return chips.filter((chip) => chip.valid).map(({ valid: _v, ...rest }) => rest);
}

function RecipientInput({
  id,
  label,
  chips,
  onChange,
  autoFocus,
}: {
  id: string;
  label: string;
  chips: Chip[];
  onChange: (chips: Chip[]) => void;
  autoFocus?: boolean;
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ name: string; email: string; company?: string }>>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestSeq = useRef(0);

  const addFromText = useCallback(
    (raw: string) => {
      const parts = raw.split(/[,;\s]+/).map((part) => part.trim()).filter(Boolean);
      if (parts.length === 0) return;
      const next = [...chips];
      for (const part of parts) {
        const address = part.toLowerCase();
        if (next.some((chip) => chip.address === address)) continue;
        next.push({ address, valid: EMAIL_PATTERN.test(address) });
      }
      onChange(next);
      setInput("");
      setOpen(false);
    },
    [chips, onChange],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = input.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const seq = ++requestSeq.current;
      const result = await searchContactsAction(query);
      // Verouderde antwoorden negeren zodat snel typen geen oude lijst toont.
      if (seq !== requestSeq.current) return;
      if (result.ok) {
        const filtered = result.data.filter(
          (entry) => !chips.some((chip) => chip.address === entry.email),
        );
        setSuggestions(filtered);
        setOpen(filtered.length > 0);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, chips]);

  return (
    <div className="relative flex flex-wrap items-center gap-1 border-b border-white/10 py-1.5">
      <label htmlFor={id} className="w-10 shrink-0 text-xs text-white/40">
        {label}
      </label>
      {chips.map((chip) => (
        <span
          key={chip.address}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
            chip.valid
              ? "border-white/15 bg-white/[0.06] text-white/80"
              : "border-red-500/50 bg-red-500/10 text-red-300",
          )}
          title={chip.valid ? chip.address : `${chip.address} (ongeldig adres, wordt niet verzonden)`}
        >
          {chip.name ? `${chip.name} <${chip.address}>` : chip.address}
          <button
            type="button"
            onClick={() => onChange(chips.filter((entry) => entry.address !== chip.address))}
            className="rounded-full p-0.5 hover:bg-white/15"
            aria-label={`${chip.address} verwijderen`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={input}
        autoFocus={autoFocus}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === "," || event.key === ";") {
            event.preventDefault();
            addFromText(input);
          } else if (event.key === "Backspace" && !input && chips.length > 0) {
            onChange(chips.slice(0, -1));
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        onBlur={() => {
          if (input.trim()) addFromText(input);
          setTimeout(() => setOpen(false), 150);
        }}
        className="min-w-[140px] flex-1 bg-transparent py-0.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
        placeholder={chips.length === 0 ? "naam@bedrijf.be" : ""}
        autoComplete="off"
        aria-label={`${label}-ontvangers`}
      />
      {open ? (
        <div className="absolute left-10 top-full z-30 mt-1 w-[min(360px,90%)] rounded-lg border border-white/10 bg-[#161616] py-1 shadow-2xl">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.email}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange([
                  ...chips,
                  {
                    ...(suggestion.name ? { name: suggestion.name } : {}),
                    address: suggestion.email,
                    valid: true,
                  },
                ]);
                setInput("");
                setOpen(false);
              }}
              className="flex w-full flex-col px-3 py-1.5 text-left hover:bg-white/10"
            >
              <span className="text-sm text-white/85">
                {suggestion.name || suggestion.email}
                {suggestion.company ? <span className="text-white/40"> - {suggestion.company}</span> : null}
              </span>
              {suggestion.name ? <span className="text-xs text-white/40">{suggestion.email}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type UploadingFile = { key: string; filename: string; progress: number };

function uploadAttachment(
  file: File,
  onProgress: (fraction: number) => void,
): Promise<EmailAttachmentMeta> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/email/upload");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText) as {
          attachment?: Omit<EmailAttachmentMeta, "index">;
          error?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && body.attachment) {
          resolve({ ...body.attachment, index: 0 });
        } else {
          reject(new Error(body.error ?? "Upload mislukt."));
        }
      } catch {
        reject(new Error("Upload mislukt."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload mislukt. Controleer je verbinding."));
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}

export function EmailComposer({
  init,
  mailboxes,
  onClose,
  onSent,
}: {
  init: ComposerInit;
  mailboxes: MailboxSummary[];
  onClose: () => void;
  onSent: () => void;
}) {
  const sendable = useMemo(
    () => mailboxes.filter((summary) => summary.mailbox.smtp.enabled && summary.mailbox.isActive),
    [mailboxes],
  );

  const [mailboxId, setMailboxId] = useState(init.mailboxId);
  const [to, setTo] = useState<Chip[]>(toChips(init.to));
  const [cc, setCc] = useState<Chip[]>(toChips(init.cc));
  const [bcc, setBcc] = useState<Chip[]>(toChips(init.bcc));
  const [showCcBcc, setShowCcBcc] = useState(init.cc.length > 0 || init.bcc.length > 0);
  const [subject, setSubject] = useState(init.subject);
  const [htmlBody, setHtmlBody] = useState(init.htmlBody);
  const [templateMode, setTemplateMode] = useState<EmailTemplateMode>(init.templateMode);
  const [includeQuote, setIncludeQuote] = useState(init.includeQuote);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  const [attachments, setAttachments] = useState<EmailAttachmentMeta[]>(init.attachments);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [draftId, setDraftId] = useState<string | undefined>(init.draftId);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dirtyRef = useRef(false);
  const stateRef = useRef({ mailboxId, to, cc, bcc, subject, htmlBody, templateMode, includeQuote, attachments, draftId });
  stateRef.current = { mailboxId, to, cc, bcc, subject, htmlBody, templateMode, includeQuote, attachments, draftId };

  const selectedSummary = sendable.find((summary) => summary.mailbox.id === mailboxId) ?? sendable[0];
  const selectedMailbox = selectedSummary?.mailbox;
  const receivingMailboxId = init.relatedMessage?.mailboxId;
  const mailboxMismatch = Boolean(
    receivingMailboxId && selectedMailbox && selectedMailbox.id !== receivingMailboxId,
  );
  const receivingMailbox = mailboxes.find((summary) => summary.mailbox.id === receivingMailboxId)?.mailbox;

  const hasContent = useCallback(() => {
    const state = stateRef.current;
    return (
      state.to.length > 0 ||
      state.subject.trim().length > 0 ||
      state.htmlBody.replace(/<[^>]+>/g, "").trim().length > 0 ||
      state.attachments.length > 0
    );
  }, []);

  const persistDraft = useCallback(async (): Promise<string | undefined> => {
    const state = stateRef.current;
    if (!hasContent()) return state.draftId;
    setSaving(true);
    const result = await saveDraftAction({
      ...(state.draftId ? { id: state.draftId } : {}),
      mailboxId: state.mailboxId,
      kind: init.kind,
      ...(init.relatedMessage ? { relatedMessageId: init.relatedMessage.id } : {}),
      to: chipsToValues(state.to),
      cc: chipsToValues(state.cc),
      bcc: chipsToValues(state.bcc),
      subject: state.subject,
      htmlBody: state.htmlBody,
      templateMode: state.templateMode,
      includeQuote: state.includeQuote,
      attachments: state.attachments,
    });
    setSaving(false);
    if (result.ok) {
      setDraftId(result.data.id);
      setLastSavedAt(result.data.lastSavedAt);
      dirtyRef.current = false;
      return result.data.id;
    }
    toast.error(result.message);
    return state.draftId;
  }, [hasContent, init.kind, init.relatedMessage]);

  // Automatisch opslaan met debounce; geen write per toetsaanslag.
  useEffect(() => {
    dirtyRef.current = true;
    const timer = setTimeout(() => {
      if (dirtyRef.current && hasContent() && !sending) void persistDraft();
    }, 3000);
    return () => clearTimeout(timer);
  }, [mailboxId, to, cc, bcc, subject, htmlBody, templateMode, includeQuote, attachments, hasContent, persistDraft, sending]);

  const handleClose = useCallback(async () => {
    if (dirtyRef.current && hasContent() && !sending) {
      await persistDraft();
      toast.info("Concept opgeslagen.");
    }
    onClose();
  }, [hasContent, onClose, persistDraft, sending]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const currentTotal = attachments.reduce((sum, attachment) => sum + attachment.size, 0);
    let runningTotal = currentTotal;
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`"${file.name}" is groter dan 15 MB en werd overgeslagen.`);
        continue;
      }
      if (runningTotal + file.size > MAX_TOTAL_BYTES) {
        toast.error("De bijlagen zouden samen groter zijn dan 25 MB.");
        break;
      }
      runningTotal += file.size;
      const key = `${file.name}-${Date.now()}-${Math.random()}`;
      setUploading((current) => [...current, { key, filename: file.name, progress: 0 }]);
      try {
        const meta = await uploadAttachment(file, (fraction) =>
          setUploading((current) =>
            current.map((entry) => (entry.key === key ? { ...entry, progress: fraction } : entry)),
          ),
        );
        setAttachments((current) => [...current, { ...meta, index: current.length }]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload mislukt.");
      } finally {
        setUploading((current) => current.filter((entry) => entry.key !== key));
      }
    }
  };

  const handleSend = async () => {
    if (sending) return;
    const validTo = chipsToValues(to);
    if (validTo.length === 0) {
      toast.error("Vul minstens één geldige ontvanger in.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Vul een onderwerp in.");
      return;
    }
    if (uploading.length > 0) {
      toast.error("Wacht tot alle bijlagen zijn geüpload.");
      return;
    }
    setSending(true);
    const currentDraftId = await persistDraft();
    const result = await sendEmailAction({
      ...(currentDraftId ? { draftId: currentDraftId, id: currentDraftId } : {}),
      mailboxId,
      kind: init.kind,
      ...(init.relatedMessage ? { relatedMessageId: init.relatedMessage.id } : {}),
      to: validTo,
      cc: chipsToValues(cc),
      bcc: chipsToValues(bcc),
      subject,
      htmlBody,
      templateMode,
      includeQuote,
      attachments,
    });
    setSending(false);
    if (result.ok) {
      toast.success("Bericht verzonden.");
      dirtyRef.current = false;
      onSent();
      onClose();
    } else {
      toast.error(result.message);
    }
  };

  const handleDiscard = async () => {
    if (draftId) {
      await deleteDraftAction(draftId);
    }
    dirtyRef.current = false;
    toast.info("Concept verwijderd.");
    onClose();
  };

  if (sendable.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-40 w-[min(430px,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#101010] p-5 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Nieuw bericht</h3>
          <button type="button" onClick={onClose} className="rounded p-1 text-white/50 hover:bg-white/10" aria-label="Sluiten">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-white/60">
          Er is geen mailbox met een werkende SMTP-verbinding. Voeg eerst een mailboxaccount toe of
          schakel SMTP in via <a href="/admin/email/accounts" className="text-amber-300 hover:underline">Mailboxaccounts</a>.
        </p>
      </div>
    );
  }

  const kindTitle =
    init.kind === "reply" ? "Beantwoorden"
    : init.kind === "reply-all" ? "Allen beantwoorden"
    : init.kind === "forward" ? "Doorsturen"
    : "Nieuw bericht";

  return (
    <div
      className={cn(
        "fixed z-40 flex flex-col overflow-hidden rounded-xl border border-white/15 bg-[#101010] shadow-2xl",
        maximized
          ? "inset-4 sm:inset-x-[8%] sm:inset-y-6"
          : "inset-x-2 bottom-2 top-16 sm:inset-auto sm:bottom-4 sm:right-4 sm:h-[640px] sm:max-h-[calc(100vh-3rem)] sm:w-[620px]",
      )}
      role="dialog"
      aria-modal="false"
      aria-label={kindTitle}
      onKeyDown={(event) => {
        if (event.key === "Escape") void handleClose();
      }}
    >
      {/* Titelbalk */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-3 py-2">
        <span className="truncate text-sm font-semibold text-white">{subject.trim() || kindTitle}</span>
        <span className="ml-auto flex items-center gap-1 text-xs text-white/40">
          {saving ? "Opslaan..." : lastSavedAt ? `Opgeslagen ${new Date(lastSavedAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}` : ""}
        </span>
        <button
          type="button"
          onClick={() => setMaximized((value) => !value)}
          className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
          title={maximized ? "Verkleinen" : "Volledig scherm"}
          aria-label={maximized ? "Composer verkleinen" : "Composer maximaliseren"}
        >
          {maximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => void handleClose()}
          className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
          title="Sluiten (concept wordt bewaard)"
          aria-label="Composer sluiten"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3">
        {/* Van */}
        {sendable.length > 1 ? (
          <div className="flex items-center gap-2 border-b border-white/10 py-1.5">
            <label htmlFor="composer-from" className="w-10 shrink-0 text-xs text-white/40">
              Van
            </label>
            <select
              id="composer-from"
              value={selectedMailbox?.id ?? mailboxId}
              onChange={(event) => setMailboxId(event.target.value)}
              className="flex-1 rounded-md border border-white/10 bg-[#141414] px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/70"
            >
              {sendable.map((summary) => (
                <option key={summary.mailbox.id} value={summary.mailbox.id}>
                  {summary.mailbox.displayName} &lt;{summary.mailbox.emailAddress}&gt;
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {mailboxMismatch ? (
          <div className="mt-1.5 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Dit bericht kwam binnen op {receivingMailbox?.emailAddress ?? "een andere mailbox"}. Je
            antwoordt nu vanuit {selectedMailbox?.emailAddress}.
          </div>
        ) : null}

        <RecipientInput id="composer-to" label="Aan" chips={to} onChange={setTo} autoFocus={init.kind === "new"} />
        {showCcBcc ? (
          <>
            <RecipientInput id="composer-cc" label="Cc" chips={cc} onChange={setCc} />
            <RecipientInput id="composer-bcc" label="Bcc" chips={bcc} onChange={setBcc} />
          </>
        ) : (
          <button
            type="button"
            onClick={() => setShowCcBcc(true)}
            className="self-start py-1 text-xs text-white/40 hover:text-white"
          >
            Cc/Bcc toevoegen
          </button>
        )}

        {/* Onderwerp */}
        <div className="flex items-center gap-2 border-b border-white/10 py-1.5">
          <label htmlFor="composer-subject" className="w-10 shrink-0 text-xs text-white/40">
            Onderw.
          </label>
          <input
            id="composer-subject"
            value={subject}
            maxLength={250}
            onChange={(event) => setSubject(event.target.value)}
            className="flex-1 bg-transparent py-0.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
            placeholder="Onderwerp"
          />
          <select
            value={templateMode}
            onChange={(event) => setTemplateMode(event.target.value as EmailTemplateMode)}
            className="shrink-0 rounded-md border border-white/10 bg-[#141414] px-2 py-1 text-xs text-white/70 focus:outline-none focus:ring-1 focus:ring-amber-500/70"
            aria-label="Header en footer"
            title="VisualVibe header/footer"
          >
            <option value="full">Header + footer</option>
            <option value="footer">Alleen footer</option>
            <option value="none">Geen template</option>
          </select>
        </div>

        {/* Editor */}
        <div className="flex min-h-0 flex-1 flex-col py-2">
          <RichTextEditor
            value={htmlBody}
            onChange={setHtmlBody}
            signatureHtml={selectedMailbox?.signatureHtml || undefined}
            placeholder="Schrijf je bericht..."
          />
        </div>

        {/* Citaat origineel bericht */}
        {init.relatedMessage ? (
          <div className="mb-2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5">
            <div className="flex items-center gap-2">
              <input
                id="composer-quote"
                type="checkbox"
                checked={includeQuote}
                onChange={(event) => setIncludeQuote(event.target.checked)}
                className="h-3.5 w-3.5 accent-amber-500"
              />
              <label htmlFor="composer-quote" className="text-xs text-white/60">
                Origineel bericht mee verzenden
              </label>
              <button
                type="button"
                onClick={() => setShowQuotePreview((value) => !value)}
                className="ml-auto inline-flex items-center gap-1 text-xs text-white/40 hover:text-white"
                aria-expanded={showQuotePreview}
              >
                {showQuotePreview ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Voorbeeld
              </button>
            </div>
            {showQuotePreview ? (
              <div className="mt-2 max-h-32 overflow-y-auto rounded border-l-2 border-white/20 bg-white/[0.03] p-2 text-xs text-white/50">
                <p className="mb-1 text-white/35">
                  Op {new Date(init.relatedMessage.dateKey).toLocaleString("nl-BE")} schreef{" "}
                  {init.relatedMessage.from.name || init.relatedMessage.fromAddress}:
                </p>
                <p className="whitespace-pre-wrap">
                  {(init.relatedMessage.textBody || init.relatedMessage.snippet).slice(0, 1200)}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Bijlagen */}
        {(attachments.length > 0 || uploading.length > 0) && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {attachments.map((attachment, position) => (
              <span
                key={`${attachment.storagePath ?? "orig"}-${attachment.index}-${position}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-white/75"
              >
                <Paperclip className="h-3 w-3 text-white/40" aria-hidden="true" />
                <span className="max-w-[180px] truncate" title={attachment.filename}>
                  {attachment.filename}
                </span>
                {!attachment.storagePath ? (
                  <span className="rounded bg-sky-500/15 px-1 text-[10px] text-sky-300">origineel</span>
                ) : null}
                <span className="text-white/35">{formatBytes(attachment.size)}</span>
                <button
                  type="button"
                  onClick={() => setAttachments((current) => current.filter((_, i) => i !== position))}
                  className="rounded p-0.5 hover:bg-white/15"
                  aria-label={`Bijlage ${attachment.filename} verwijderen`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {uploading.map((entry) => (
              <span
                key={entry.key}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-white/50"
              >
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                <span className="max-w-[160px] truncate">{entry.filename}</span>
                {Math.round(entry.progress * 100)}%
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actiebalk */}
      <div
        className="flex items-center gap-2 border-t border-white/10 bg-white/[0.03] px-3 py-2"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? "Verzenden..." : "Verzenden"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white"
          title="Bijlage toevoegen (of sleep bestanden hierheen)"
          aria-label="Bijlage toevoegen"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void persistDraft().then(() => toast.success("Concept opgeslagen."))}
          disabled={saving || !hasContent()}
          className="rounded-md px-2.5 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          Concept opslaan
        </button>
        <span className="ml-auto" />
        {confirmDiscard ? (
          <span className="flex items-center gap-1.5 text-xs text-white/60">
            Verwijderen?
            <button type="button" onClick={() => void handleDiscard()} className="rounded bg-red-500/90 px-2 py-1 font-medium text-white hover:bg-red-500">
              Ja
            </button>
            <button type="button" onClick={() => setConfirmDiscard(false)} className="rounded border border-white/15 px-2 py-1 hover:bg-white/10">
              Nee
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDiscard(true)}
            className="rounded-md p-2 text-white/50 hover:bg-white/10 hover:text-red-300"
            title="Concept verwijderen"
            aria-label="Concept verwijderen"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
