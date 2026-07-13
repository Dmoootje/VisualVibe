"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  AlertOctagon,
  Archive,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  FileCode,
  Forward,
  ImageIcon,
  Loader2,
  Mail,
  MoreVertical,
  Paperclip,
  Printer,
  Reply,
  ReplyAll,
  Star,
  StickyNote,
  Tag,
  Trash2,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  EmailLabel,
  EmailMessage,
  EmailProcessingStatus,
  EmailSystemFolder,
  EmailThreadNote,
  MailboxSummary,
} from "@/types/emailClient";
import { EMAIL_PROCESSING_LABELS, formatEmailAddress } from "@/types/emailClient";
import type { ContactPanelData, ThreadDetail } from "@/lib/admin/emailClientActions";
import {
  blockRemoteImages,
  formatBytes,
  formatFullDate,
  PROCESSING_STATUS_COLORS,
} from "./emailClientUi";
import { LabelMenu } from "./EmailList";

// Veilige weergave: de HTML is server-side gesanitized en wordt hier in een
// sandboxed iframe zonder scriptrechten gerenderd; externe afbeeldingen zijn
// standaard geblokkeerd.
function EmailHtmlFrame({
  html,
  showImages,
  onBlockedImages,
  printRef,
}: {
  html: string;
  showImages: boolean;
  onBlockedImages: (count: number) => void;
  printRef?: (fn: (() => void) | null) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(120);

  const doc = useMemo(() => {
    const processed = showImages ? { html, blockedCount: 0 } : blockRemoteImages(html);
    return {
      blockedCount: processed.blockedCount,
      srcDoc: `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>
body{margin:0;padding:16px;background:#ffffff;color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;word-break:break-word;}
img{max-width:100%;height:auto;}
table{max-width:100%;}
a{color:#c95600;}
blockquote{margin:8px 0;padding-left:12px;border-left:3px solid #ddd;color:#555;}
</style></head><body>${processed.html}</body></html>`,
    };
  }, [html, showImages]);

  useEffect(() => {
    onBlockedImages(doc.blockedCount);
  }, [doc.blockedCount, onBlockedImages]);

  const measure = useCallback(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    try {
      const body = frame.contentDocument?.body;
      if (body) setHeight(Math.min(3000, Math.max(60, body.scrollHeight + 34)));
    } catch {
      // Hoogtemeting is best effort.
    }
  }, []);

  useEffect(() => {
    if (!printRef) return;
    printRef(() => {
      try {
        iframeRef.current?.contentWindow?.print();
      } catch {
        window.print();
      }
    });
    return () => printRef(null);
  }, [printRef]);

  return (
    <iframe
      ref={iframeRef}
      title="E-mailinhoud"
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      srcDoc={doc.srcDoc}
      onLoad={measure}
      className="w-full rounded-lg border border-white/10 bg-white"
      style={{ height }}
    />
  );
}

function AddressLine({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div className="text-xs text-white/50">
      <span className="text-white/35">{label}: </span>
      {values.join(", ")}
    </div>
  );
}

type MessageCardProps = {
  message: EmailMessage;
  expanded: boolean;
  labels: EmailLabel[];
  onToggleExpanded: () => void;
  onReply: (message: EmailMessage, kind: "reply" | "reply-all" | "forward") => void;
  onToggleStar: (message: EmailMessage) => void;
  onMarkUnread: (message: EmailMessage) => void;
  onAssignLabel: (message: EmailMessage, labelId: string) => void;
  onMove: (message: EmailMessage, folder: EmailSystemFolder) => void;
  onShowSource: (message: EmailMessage) => void;
};

function MessageCard({
  message,
  expanded,
  labels,
  onToggleExpanded,
  onReply,
  onToggleStar,
  onMarkUnread,
  onAssignLabel,
  onMove,
  onShowSource,
}: MessageCardProps) {
  const [showImages, setShowImages] = useState(false);
  const [blockedImages, setBlockedImages] = useState(0);
  const printFn = useRef<(() => void) | null>(null);

  const hasHtml = Boolean(message.htmlBody?.trim());

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
      {/* Kop */}
      <div
        className={cn("flex cursor-pointer items-start gap-3 p-3", !expanded && "opacity-80")}
        onClick={onToggleExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") onToggleExpanded();
        }}
        aria-expanded={expanded}
        aria-label={`Bericht van ${formatEmailAddress(message.from)} ${expanded ? "inklappen" : "uitklappen"}`}
      >
        <span className="mt-0.5 text-white/30">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className={cn("truncate text-sm", message.isRead ? "text-white/80" : "font-semibold text-white")}>
              {message.from.name || message.fromAddress}
            </span>
            <span className="truncate text-xs text-white/40">&lt;{message.fromAddress}&gt;</span>
            {message.direction === "outbound" ? (
              <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-300">verzonden</span>
            ) : null}
            {message.syncStatus === "deleted-remotely" ? (
              <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-300">
                niet meer op server
              </span>
            ) : null}
          </div>
          {expanded ? (
            <div className="mt-0.5 flex flex-col gap-0.5">
              <AddressLine label="Aan" values={message.to.map(formatEmailAddress)} />
              <AddressLine label="Cc" values={message.cc.map(formatEmailAddress)} />
              <AddressLine label="Bcc" values={message.bcc.map(formatEmailAddress)} />
            </div>
          ) : (
            <p className="truncate text-xs text-white/40">{message.snippet}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1" onClick={(event) => event.stopPropagation()}>
          <span className="whitespace-nowrap text-xs text-white/40">{formatFullDate(message.dateKey)}</span>
          <button
            type="button"
            onClick={() => onToggleStar(message)}
            className="rounded p-1"
            title={message.isStarred ? "Ster verwijderen" : "Ster toevoegen"}
            aria-label={message.isStarred ? "Ster verwijderen" : "Ster toevoegen"}
          >
            <Star
              className={cn(
                "h-4 w-4",
                message.isStarred ? "fill-amber-400 text-amber-400" : "text-white/30 hover:text-white/70",
              )}
            />
          </button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                title="Meer acties"
                aria-label="Meer acties voor dit bericht"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[220px] rounded-lg border border-white/10 bg-[#141414] p-1 shadow-2xl"
                sideOffset={6}
                align="end"
              >
                <DropdownMenu.Item onSelect={() => onReply(message, "reply")} className="dd-item flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10">
                  <Reply className="h-4 w-4" /> Beantwoorden
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onReply(message, "reply-all")} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10">
                  <ReplyAll className="h-4 w-4" /> Allen beantwoorden
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onReply(message, "forward")} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10">
                  <Forward className="h-4 w-4" /> Doorsturen
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
                <DropdownMenu.Item onSelect={() => onMarkUnread(message)} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10">
                  <Mail className="h-4 w-4" /> Markeren als ongelezen
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onMove(message, "archive")} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10">
                  <Archive className="h-4 w-4" /> Archiveren
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onMove(message, "spam")} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10">
                  <AlertOctagon className="h-4 w-4" /> Spam melden
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onMove(message, "trash")} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10">
                  <Trash2 className="h-4 w-4" /> Verwijderen
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
                <DropdownMenu.Item
                  onSelect={() => {
                    if (printFn.current) printFn.current();
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10"
                >
                  <Printer className="h-4 w-4" /> Printen
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onShowSource(message)} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10">
                  <FileCode className="h-4 w-4" /> Berichtbron bekijken
                </DropdownMenu.Item>
                {message.remoteUid ? (
                  <DropdownMenu.Item asChild>
                    <a
                      href={`/api/admin/email/attachment?messageId=${encodeURIComponent(message.id)}&mode=eml`}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10"
                    >
                      <Download className="h-4 w-4" /> Downloaden als .eml
                    </a>
                  </DropdownMenu.Item>
                ) : null}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {expanded ? (
        <div className="border-t border-white/[0.06] p-3">
          {blockedImages > 0 && !showImages ? (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60">
              <ImageIcon className="h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
              Externe afbeeldingen zijn geblokkeerd ter bescherming van je privacy.
              <button
                type="button"
                onClick={() => setShowImages(true)}
                className="ml-auto rounded border border-amber-500/40 px-2 py-1 font-medium text-amber-300 hover:bg-amber-500/10"
              >
                Afbeeldingen tonen
              </button>
            </div>
          ) : null}

          {hasHtml ? (
            <EmailHtmlFrame
              html={message.htmlBody as string}
              showImages={showImages}
              onBlockedImages={setBlockedImages}
              printRef={(fn) => {
                printFn.current = fn;
              }}
            />
          ) : (
            <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80">
              {message.textBody || "(Dit bericht heeft geen leesbare inhoud.)"}
            </pre>
          )}
          {message.bodyTruncated ? (
            <p className="mt-2 text-xs text-white/40">
              Dit bericht is groot; de weergave kan ingekort zijn. Download het volledige bericht als .eml voor de complete inhoud.
            </p>
          ) : null}

          {message.attachments.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => {
                const previewable =
                  /^image\/(png|jpe?g|gif|webp)$/i.test(attachment.contentType) ||
                  attachment.contentType === "application/pdf";
                const base = `/api/admin/email/attachment?messageId=${encodeURIComponent(message.id)}&index=${attachment.index}`;
                return (
                  <span
                    key={attachment.index}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
                    <span className="max-w-[220px] truncate" title={attachment.filename}>
                      {attachment.filename}
                    </span>
                    {attachment.size ? <span className="text-white/35">{formatBytes(attachment.size)}</span> : null}
                    {previewable ? (
                      <a
                        href={`${base}&mode=inline`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-0.5 text-white/50 hover:text-white"
                        title="Voorbeeld openen"
                        aria-label={`Voorbeeld van ${attachment.filename} openen`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                    <a
                      href={base}
                      className="rounded p-0.5 text-white/50 hover:text-white"
                      title="Downloaden"
                      aria-label={`${attachment.filename} downloaden`}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </span>
                );
              })}
            </div>
          ) : null}

          {/* Snelle acties onder het bericht */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onReply(message, "reply")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
            >
              <Reply className="h-4 w-4" /> Beantwoorden
            </button>
            {message.to.length + message.cc.length > 1 ? (
              <button
                type="button"
                onClick={() => onReply(message, "reply-all")}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
              >
                <ReplyAll className="h-4 w-4" /> Allen beantwoorden
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onReply(message, "forward")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
            >
              <Forward className="h-4 w-4" /> Doorsturen
            </button>
            <LabelMenu labels={labels} onPick={(labelId) => onAssignLabel(message, labelId)}>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
              >
                <Tag className="h-4 w-4" /> Label
              </button>
            </LabelMenu>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ContactPanel({
  contact,
  onCreateContact,
  onOpenThread,
  creating,
  hasInbound,
}: {
  contact: ContactPanelData;
  onCreateContact: () => void;
  onOpenThread: (threadId: string) => void;
  creating: boolean;
  hasInbound: boolean;
}) {
  if (!contact) {
    if (!hasInbound) return null;
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
          <User className="h-4 w-4 text-white/40" aria-hidden="true" /> Contact
        </div>
        <p className="mb-3 text-xs text-white/50">Dit e-mailadres is nog niet gekoppeld aan een contact of lead.</p>
        <button
          type="button"
          onClick={onCreateContact}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-300 hover:bg-amber-500/20 disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Contact aanmaken
        </button>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
        <User className="h-4 w-4 text-white/40" aria-hidden="true" /> Contact
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-white">{contact.name}</span>
        {contact.company ? <span className="text-white/60">{contact.company}</span> : null}
        <span className="text-white/60">{contact.email}</span>
        {contact.phone ? <span className="text-white/60">{contact.phone}</span> : null}
        <span className="text-xs text-white/40">
          {contact.leadNumber} - status: {contact.status}
        </span>
        <a
          href={`/admin/leads/${encodeURIComponent(contact.leadId)}`}
          className="mt-1 inline-flex w-fit items-center gap-1 text-xs text-amber-300 hover:underline"
        >
          Leaddetail openen <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
      {contact.previousThreads.length > 0 ? (
        <div className="mt-3 border-t border-white/[0.06] pt-2">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/35">Eerdere gesprekken</p>
          {contact.previousThreads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => onOpenThread(thread.id)}
              className="block w-full truncate rounded px-1 py-0.5 text-left text-xs text-white/60 hover:bg-white/5 hover:text-white"
              title={thread.subject}
            >
              {thread.subject || "(zonder onderwerp)"}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type EmailViewerProps = {
  threadId: string;
  detail: ThreadDetail | null;
  loading: boolean;
  error: string | null;
  labels: EmailLabel[];
  mailboxes: MailboxSummary[];
  onClose: () => void;
  onOpenThread: (threadId: string) => void;
  onReply: (message: EmailMessage, kind: "reply" | "reply-all" | "forward") => void;
  onToggleStar: (message: EmailMessage) => void;
  onMarkUnread: (message: EmailMessage) => void;
  onAssignLabel: (message: EmailMessage, labelId: string) => void;
  onMove: (message: EmailMessage, folder: EmailSystemFolder) => void;
  onSetProcessingStatus: (status: EmailProcessingStatus) => void;
  onAddNote: (note: string) => Promise<boolean>;
  onDeleteNote: (note: EmailThreadNote) => void;
  onCreateContact: (message: EmailMessage) => Promise<boolean>;
  onShowSource: (message: EmailMessage) => void;
  onRetry: () => void;
};

export function EmailViewer({
  threadId,
  detail,
  loading,
  error,
  labels,
  mailboxes,
  onClose,
  onOpenThread,
  onReply,
  onToggleStar,
  onMarkUnread,
  onAssignLabel,
  onMove,
  onSetProcessingStatus,
  onAddNote,
  onDeleteNote,
  onCreateContact,
  onShowSource,
  onRetry,
}: EmailViewerProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [noteText, setNoteText] = useState("");
  const [noteBusy, setNoteBusy] = useState(false);
  const [contactBusy, setContactBusy] = useState(false);

  const messages = useMemo(() => detail?.messages ?? [], [detail?.messages]);

  // Laatste bericht standaard open, oudere ingeklapt.
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : "";
  useEffect(() => {
    if (lastMessageId) setExpandedIds(new Set([lastMessageId]));
  }, [threadId, lastMessageId]);

  const mailboxById = new Map(mailboxes.map((summary) => [summary.mailbox.id, summary.mailbox]));
  const thread = detail?.thread ?? null;
  const first = messages[0];
  const mailbox = first ? mailboxById.get(first.mailboxId) : undefined;
  const latestInbound = [...messages].reverse().find((message) => message.direction === "inbound");

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex items-start gap-2 border-b border-white/10 px-3 py-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white"
          title="Terug naar de lijst"
          aria-label="Terug naar de lijst"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-white">
            {thread?.subject || first?.subject || "(zonder onderwerp)"}
          </h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-white/40">
            {mailbox ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: mailbox.color }} aria-hidden="true" />
                {mailbox.emailAddress}
              </span>
            ) : null}
            {messages.length > 1 ? <span>{messages.length} berichten</span> : null}
          </div>
        </div>
        {thread ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10"
                title="Verwerkingsstatus"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: PROCESSING_STATUS_COLORS[thread.processingStatus ?? "new"] }}
                  aria-hidden="true"
                />
                {EMAIL_PROCESSING_LABELS[thread.processingStatus ?? "new"]}
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-50 min-w-[190px] rounded-lg border border-white/10 bg-[#141414] p-1 shadow-2xl" sideOffset={6} align="end">
                {(Object.keys(EMAIL_PROCESSING_LABELS) as EmailProcessingStatus[]).map((status) => (
                  <DropdownMenu.Item
                    key={status}
                    onSelect={() => onSetProcessingStatus(status)}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PROCESSING_STATUS_COLORS[status] }} aria-hidden="true" />
                    {EMAIL_PROCESSING_LABELS[status]}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex flex-col gap-3" aria-label="Gesprek laden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl bg-white/[0.04]" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-red-300">
            {error}
            <button
              type="button"
              onClick={onRetry}
              className="mx-auto mt-3 block rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
            >
              Opnieuw proberen
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-6 text-center text-sm text-white/50">
            Dit gesprek bestaat niet meer of bevat geen berichten.
            <button
              type="button"
              onClick={onClose}
              className="mx-auto mt-3 block rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
            >
              Terug naar de lijst
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  expanded={expandedIds.has(message.id)}
                  labels={labels}
                  onToggleExpanded={() =>
                    setExpandedIds((current) => {
                      const next = new Set(current);
                      if (next.has(message.id)) next.delete(message.id);
                      else next.add(message.id);
                      return next;
                    })
                  }
                  onReply={onReply}
                  onToggleStar={onToggleStar}
                  onMarkUnread={onMarkUnread}
                  onAssignLabel={(target, labelId) => onAssignLabel(target, labelId)}
                  onMove={onMove}
                  onShowSource={onShowSource}
                />
              ))}
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 xl:w-72">
              <ContactPanel
                contact={detail?.contact ?? null}
                hasInbound={Boolean(latestInbound)}
                creating={contactBusy}
                onOpenThread={onOpenThread}
                onCreateContact={async () => {
                  if (!latestInbound || contactBusy) return;
                  setContactBusy(true);
                  await onCreateContact(latestInbound);
                  setContactBusy(false);
                }}
              />

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                  <StickyNote className="h-4 w-4 text-white/40" aria-hidden="true" /> Interne notities
                </div>
                <p className="mb-2 text-[11px] text-white/35">Alleen zichtbaar voor het team, nooit voor de klant.</p>
                {(detail?.notes ?? []).map((note) => (
                  <div key={note.id} className="group mb-2 rounded-lg bg-amber-500/[0.07] p-2">
                    <p className="whitespace-pre-wrap text-xs text-white/75">{note.note}</p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-white/35">
                      <span>
                        {note.createdBy} - {formatFullDate(note.createdAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(note)}
                        className="rounded p-0.5 opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100"
                        title="Notitie verwijderen"
                        aria-label="Notitie verwijderen"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
                <textarea
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  rows={2}
                  maxLength={4000}
                  placeholder="Notitie voor opvolging..."
                  className="w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
                />
                <button
                  type="button"
                  disabled={noteBusy || !noteText.trim()}
                  onClick={async () => {
                    setNoteBusy(true);
                    const ok = await onAddNote(noteText);
                    setNoteBusy(false);
                    if (ok) setNoteText("");
                  }}
                  className="mt-1.5 w-full rounded-md border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {noteBusy ? "Opslaan..." : "Notitie toevoegen"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
