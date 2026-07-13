"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  FileText,
  Filter,
  Layers,
  Loader2,
  Menu,
  Pencil,
  RotateCw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  addThreadNoteAction,
  assignLabelAction,
  cancelOutboxAction,
  createContactFromMessageAction,
  createLabelAction,
  deleteDraftAction,
  deleteLabelAction,
  deleteMessagesPermanentlyAction,
  deleteOutboxAction,
  deleteThreadNoteAction,
  fetchEmailListAction,
  fetchMessageAction,
  fetchMessageSourceAction,
  fetchThreadDetailAction,
  getEmailClientBootstrapAction,
  getSidebarCountsAction,
  listDraftsAction,
  listOutboxAction,
  moveMessagesAction,
  outboxToDraftAction,
  retryOutboxAction,
  setMessagesReadAction,
  setMessagesStarredAction,
  setThreadProcessingStatusAction,
  syncMailboxesAction,
  updateLabelAction,
  type EmailClientBootstrap,
  type ThreadDetail,
} from "@/lib/admin/emailClientActions";
import type {
  EmailDraft,
  EmailListPage,
  EmailMessage,
  EmailMessageListItem,
  EmailOutboxItem,
  EmailProcessingStatus,
  EmailSystemFolder,
  EmailThreadNote,
} from "@/types/emailClient";
import {
  formatEmailAddress,
  forwardSubject,
  normalizeEmailAddress,
  replySubject,
} from "@/types/emailClient";
import {
  buildListFilter,
  EMPTY_EXTRA_FILTERS,
  formatFullDate,
  formatListDate,
  parseEmailPath,
  VIEW_TITLES,
  viewToPath,
  type EmailClientView,
  type ListExtraFilters,
} from "./emailClientUi";
import { EmailSidebar } from "./EmailSidebar";
import { EmailList, type BulkAction } from "./EmailList";
import { EmailViewer } from "./EmailViewer";
import { EmailComposer, type ComposerInit } from "./EmailComposer";

const OUTBOX_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  queued: { label: "Wacht op verzending", className: "bg-sky-500/15 text-sky-300" },
  sending: { label: "Wordt verzonden", className: "bg-amber-500/15 text-amber-300" },
  failed: { label: "Mislukt", className: "bg-red-500/15 text-red-300" },
  sent: { label: "Verzonden", className: "bg-emerald-500/15 text-emerald-300" },
  cancelled: { label: "Geannuleerd", className: "bg-white/10 text-white/60" },
};

export function EmailClientApp({ initialSlug }: { initialSlug: string[] }) {
  const initial = useMemo(() => parseEmailPath(initialSlug), [initialSlug]);

  const [bootstrap, setBootstrap] = useState<EmailClientBootstrap | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);

  const [view, setView] = useState<EmailClientView>(initial.view);
  const [selectedMailboxId, setSelectedMailboxId] = useState<string | null>(null);
  const [queryInput, setQueryInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [extraFilters, setExtraFilters] = useState<ListExtraFilters>(EMPTY_EXTRA_FILTERS);

  const [items, setItems] = useState<EmailMessageListItem[]>([]);
  const [cursor, setCursor] = useState<{ dateKey: string; id: string } | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [searchWindowLimited, setSearchWindowLimited] = useState(false);
  const [selection, setSelection] = useState<Set<string>>(new Set());

  const [activeThreadId, setActiveThreadId] = useState<string | null>(initial.threadId ?? null);
  const [threadDetail, setThreadDetail] = useState<ThreadDetail | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [outboxItems, setOutboxItems] = useState<EmailOutboxItem[]>([]);
  const [auxLoading, setAuxLoading] = useState(false);

  const [composer, setComposer] = useState<ComposerInit | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ ids: string[] } | null>(null);
  const [sourceDialog, setSourceDialog] = useState<{ loading: boolean; source?: string; error?: string } | null>(null);

  const listSeq = useRef(0);

  // ------------------------------------------------------------------ helpers

  const refreshCounts = useCallback(async () => {
    const result = await getSidebarCountsAction();
    if (result.ok) {
      setBootstrap((current) => (current ? { ...current, counts: result.data } : current));
    }
  }, []);

  const pushUrl = useCallback((nextView: EmailClientView, threadId?: string | null) => {
    const path = threadId ? `/admin/email/thread/${encodeURIComponent(threadId)}` : viewToPath(nextView);
    window.history.replaceState(null, "", path);
  }, []);

  const loadList = useCallback(
    async (reset: boolean) => {
      const seq = ++listSeq.current;
      if (reset) {
        setListLoading(true);
        setListError(null);
      } else {
        setLoadingMore(true);
      }
      const filter = buildListFilter(view, selectedMailboxId, activeQuery, extraFilters);
      const result = await fetchEmailListAction(filter, reset ? null : cursor);
      if (seq !== listSeq.current) return;
      if (result.ok) {
        const page: EmailListPage = result.data;
        setItems((current) => (reset ? page.items : [...current, ...page.items]));
        setCursor(page.nextCursor);
        setSearchWindowLimited(Boolean(page.searchWindowLimited));
        if (reset) setSelection(new Set());
      } else {
        setListError(result.message);
      }
      setListLoading(false);
      setLoadingMore(false);
    },
    [view, selectedMailboxId, activeQuery, extraFilters, cursor],
  );

  const loadAux = useCallback(async (kind: "drafts" | "outbox") => {
    setAuxLoading(true);
    if (kind === "drafts") {
      const result = await listDraftsAction();
      if (result.ok) setDrafts(result.data);
      else toast.error(result.message);
    } else {
      const result = await listOutboxAction();
      if (result.ok) setOutboxItems(result.data);
      else toast.error(result.message);
    }
    setAuxLoading(false);
  }, []);

  const loadThread = useCallback(async (threadId: string) => {
    setThreadLoading(true);
    setThreadError(null);
    const result = await fetchThreadDetailAction(threadId);
    if (result.ok) {
      setThreadDetail(result.data);
      // Ongelezen berichten in dit gesprek als gelezen markeren.
      const unreadIds = result.data.messages.filter((message) => !message.isRead).map((message) => message.id);
      if (unreadIds.length > 0) {
        setItems((current) =>
          current.map((item) => (item.threadId === threadId ? { ...item, isRead: true } : item)),
        );
        void setMessagesReadAction(unreadIds, true).then(() => refreshCounts());
      }
    } else {
      setThreadError(result.message);
    }
    setThreadLoading(false);
  }, [refreshCounts]);

  // ------------------------------------------------------------------ effects

  useEffect(() => {
    void (async () => {
      const result = await getEmailClientBootstrapAction();
      if (result.ok) {
        setBootstrap(result.data);
      } else {
        setBootError(result.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!bootstrap) return;
    if (view.key === "drafts" || view.key === "outbox") {
      void loadAux(view.key);
      return;
    }
    void loadList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootstrap ? 1 : 0, view.key, view.labelId, selectedMailboxId, activeQuery, extraFilters]);

  useEffect(() => {
    if (activeThreadId) void loadThread(activeThreadId);
    else setThreadDetail(null);
  }, [activeThreadId, loadThread]);

  // ------------------------------------------------------------------ handlers

  const selectView = useCallback(
    (nextView: EmailClientView, mailboxId?: string | null) => {
      setView(nextView);
      if (mailboxId !== undefined) setSelectedMailboxId(mailboxId);
      setActiveThreadId(null);
      setMobileSidebarOpen(false);
      setQueryInput("");
      setActiveQuery("");
      setExtraFilters(EMPTY_EXTRA_FILTERS);
      pushUrl(nextView, null);
    },
    [pushUrl],
  );

  const openThread = useCallback(
    (threadId: string) => {
      setActiveThreadId(threadId);
      pushUrl(view, threadId);
    },
    [pushUrl, view],
  );

  const closeThread = useCallback(() => {
    setActiveThreadId(null);
    pushUrl(view, null);
  }, [pushUrl, view]);

  const handleToggleStarItem = useCallback((item: EmailMessageListItem) => {
    const next = !item.isStarred;
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, isStarred: next } : entry)));
    void setMessagesStarredAction([item.id], next).then((result) => {
      if (!result.ok) {
        toast.error(result.message);
        setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, isStarred: !next } : entry)));
      }
    });
  }, []);

  const runBulk = useCallback(
    async (action: BulkAction, ids: string[]) => {
      if (ids.length === 0) return;
      if (action === "delete-permanent") {
        setConfirmDelete({ ids });
        return;
      }
      const removeFromList = ["archive", "spam", "trash", "restore"].includes(action) && view.key !== "all";
      const previous = items;
      if (removeFromList) {
        setItems((current) => current.filter((item) => !ids.includes(item.id)));
      } else if (action === "read" || action === "unread") {
        setItems((current) =>
          current.map((item) => (ids.includes(item.id) ? { ...item, isRead: action === "read" } : item)),
        );
      } else if (action === "star" || action === "unstar") {
        setItems((current) =>
          current.map((item) => (ids.includes(item.id) ? { ...item, isStarred: action === "star" } : item)),
        );
      }
      setSelection(new Set());

      let result: { ok: boolean; message?: string };
      if (action === "read" || action === "unread") {
        result = await setMessagesReadAction(ids, action === "read");
      } else if (action === "star" || action === "unstar") {
        result = await setMessagesStarredAction(ids, action === "star");
      } else {
        const target: EmailSystemFolder =
          action === "archive" ? "archive" : action === "spam" ? "spam" : action === "trash" ? "trash" : "inbox";
        result = await moveMessagesAction(ids, target);
      }
      if (!result.ok) {
        toast.error(result.message ?? "De actie is mislukt.");
        setItems(previous);
      } else {
        void refreshCounts();
      }
    },
    [items, refreshCounts, view.key],
  );

  const handleMoveTo = useCallback(
    async (ids: string[], folder: EmailSystemFolder) => {
      const previous = items;
      setItems((current) => current.filter((item) => !ids.includes(item.id)));
      setSelection(new Set());
      const result = await moveMessagesAction(ids, folder);
      if (!result.ok) {
        toast.error(result.message);
        setItems(previous);
      } else {
        void refreshCounts();
      }
    },
    [items, refreshCounts],
  );

  const handleAssignLabel = useCallback(
    async (ids: string[], labelId: string, add: boolean) => {
      setItems((current) =>
        current.map((item) =>
          ids.includes(item.id)
            ? {
                ...item,
                labelIds: add
                  ? [...new Set([...item.labelIds, labelId])]
                  : item.labelIds.filter((id) => id !== labelId),
              }
            : item,
        ),
      );
      const result = await assignLabelAction(ids, labelId, add);
      if (!result.ok) toast.error(result.message);
    },
    [],
  );

  const handleSync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    const result = await syncMailboxesAction(selectedMailboxId ?? undefined);
    setSyncing(false);
    if (result.ok) {
      const imported = result.data.reduce((sum, summary) => sum + summary.imported, 0);
      const errors = result.data.filter((summary) => summary.error);
      if (errors.length > 0) {
        toast.warning(
          `Synchronisatie afgerond met fouten: ${errors.map((entry) => entry.error).join(" / ")}`,
        );
      } else {
        toast.success(
          imported > 0
            ? `Synchronisatie klaar: ${imported} nieuw${imported === 1 ? "" : "e"} bericht${imported === 1 ? "" : "en"}.`
            : "Synchronisatie klaar. Geen nieuwe berichten.",
        );
      }
      const boot = await getEmailClientBootstrapAction();
      if (boot.ok) setBootstrap(boot.data);
      if (view.key !== "drafts" && view.key !== "outbox") void loadList(true);
    } else {
      toast.error(result.message);
    }
  }, [syncing, selectedMailboxId, view.key, loadList]);

  // ------------------------------------------------------------------ composer

  const buildSignatureSpacer = "<p></p><p></p>";

  const openCompose = useCallback(
    (kind: "new" | "reply" | "reply-all" | "forward", related?: EmailMessage) => {
      if (!bootstrap) return;
      const sendable = bootstrap.mailboxes.filter(
        (summary) => summary.mailbox.smtp.enabled && summary.mailbox.isActive,
      );
      const defaultMailbox =
        (related && sendable.find((summary) => summary.mailbox.id === related.mailboxId)) ||
        (selectedMailboxId && sendable.find((summary) => summary.mailbox.id === selectedMailboxId)) ||
        sendable.find((summary) => summary.mailbox.isDefaultManualMailbox) ||
        sendable[0];

      const mailboxId = defaultMailbox?.mailbox.id ?? bootstrap.mailboxes[0]?.mailbox.id ?? "";
      const own = normalizeEmailAddress(defaultMailbox?.mailbox.emailAddress ?? "");

      let to: EmailMessage["to"] = [];
      let cc: EmailMessage["cc"] = [];
      let subject = "";
      if (related && kind !== "new") {
        if (kind === "forward") {
          subject = forwardSubject(related.subject);
        } else {
          subject = replySubject(related.subject);
          const replyTarget = related.replyToAddress
            ? [{ address: related.replyToAddress }]
            : [related.from];
          if (kind === "reply") {
            to = replyTarget.filter((entry) => entry.address !== own);
            if (to.length === 0) to = related.to.filter((entry) => entry.address !== own);
          } else {
            const combined = [...replyTarget, ...related.to];
            const seen = new Set<string>();
            to = combined.filter((entry) => {
              if (entry.address === own || seen.has(entry.address)) return false;
              seen.add(entry.address);
              return true;
            });
            cc = related.cc.filter((entry) => entry.address !== own && !seen.has(entry.address));
          }
        }
      }

      setComposer({
        mailboxId,
        kind,
        ...(related && kind !== "new" ? { relatedMessage: related } : {}),
        to,
        cc,
        bcc: [],
        subject,
        htmlBody: buildSignatureSpacer,
        templateMode:
          kind === "new"
            ? defaultMailbox?.mailbox.templateModeNew ?? "full"
            : defaultMailbox?.mailbox.templateModeReply ?? "none",
        includeQuote: kind !== "new",
        attachments:
          kind === "forward" && related
            ? related.attachments.map(({ storagePath: _omit, ...meta }) => meta)
            : [],
      });
    },
    [bootstrap, selectedMailboxId],
  );

  const openDraft = useCallback(async (draft: EmailDraft) => {
    let related: EmailMessage | undefined;
    if (draft.relatedMessageId) {
      const result = await fetchMessageAction(draft.relatedMessageId);
      if (result.ok && result.data) related = result.data;
    }
    setComposer({
      draftId: draft.id,
      mailboxId: draft.mailboxId,
      kind: draft.kind,
      ...(related ? { relatedMessage: related } : {}),
      to: draft.to,
      cc: draft.cc,
      bcc: draft.bcc,
      subject: draft.subject,
      htmlBody: draft.htmlBody || "<p></p>",
      templateMode: draft.templateMode,
      includeQuote: draft.includeQuote,
      attachments: draft.attachments,
    });
  }, []);

  // ------------------------------------------------------------------ render

  if (bootError) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
        {bootError}
      </div>
    );
  }

  if (!bootstrap) {
    return (
      <div className="flex flex-col gap-3" aria-label="E-mailclient laden">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-white/[0.05]" />
        <div className="h-[70vh] animate-pulse rounded-xl bg-white/[0.04]" />
      </div>
    );
  }

  const showMailboxBadge = !selectedMailboxId && bootstrap.mailboxes.length > 1;
  const viewTitle =
    view.key === "label"
      ? bootstrap.labels.find((label) => label.id === view.labelId)?.name ?? "Label"
      : VIEW_TITLES[view.key];

  const activeFilterCount = [
    extraFilters.unreadOnly,
    extraFilters.starredOnly,
    extraFilters.withAttachments,
    extraFilters.unansweredOnly,
    Boolean(extraFilters.dateFrom),
    Boolean(extraFilters.dateTo),
  ].filter(Boolean).length;

  return (
    <div className="flex h-[calc(100dvh-6.5rem)] min-h-[520px] flex-col sm:h-[calc(100dvh-4.5rem)]">
      <Toaster theme="dark" position="bottom-left" richColors closeButton />

      {/* Kopbalk */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-md border border-white/10 p-2 text-white/70 hover:bg-white/10 md:hidden"
          aria-label="Mappen openen"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1 className="text-xl font-bold text-white">E-mail</h1>
        <span className="hidden text-sm text-white/40 sm:inline">/ {viewTitle}</span>

        {/* Zoeken */}
        <form
          className="relative ml-auto flex min-w-0 flex-1 items-center sm:max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            setActiveQuery(queryInput);
            setActiveThreadId(null);
          }}
          role="search"
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-white/35" aria-hidden="true" />
          <input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Zoek op afzender, onderwerp, inhoud of bijlage..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-16 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
            aria-label="Zoeken in e-mail"
          />
          {activeQuery ? (
            <button
              type="button"
              onClick={() => {
                setQueryInput("");
                setActiveQuery("");
              }}
              className="absolute right-9 rounded p-1 text-white/40 hover:text-white"
              aria-label="Zoekopdracht wissen"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className={cn(
                  "absolute right-2 rounded p-1 text-white/40 hover:text-white",
                  activeFilterCount > 0 && "text-amber-300",
                )}
                title="Filters"
                aria-label={`Filters${activeFilterCount ? ` (${activeFilterCount} actief)` : ""}`}
              >
                <Filter className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 w-64 rounded-lg border border-white/10 bg-[#141414] p-3 shadow-2xl"
                sideOffset={8}
                align="end"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">Filters</p>
                {(
                  [
                    ["unreadOnly", "Alleen ongelezen"],
                    ["starredOnly", "Met ster"],
                    ["withAttachments", "Met bijlage"],
                    ["unansweredOnly", "Alleen onbeantwoord"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="mb-1.5 flex cursor-pointer items-center gap-2 text-sm text-white/75">
                    <input
                      type="checkbox"
                      checked={extraFilters[key]}
                      onChange={(event) =>
                        setExtraFilters((current) => ({ ...current, [key]: event.target.checked }))
                      }
                      className="h-3.5 w-3.5 accent-amber-500"
                    />
                    {label}
                  </label>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="text-xs text-white/50">
                    Van
                    <input
                      type="date"
                      value={extraFilters.dateFrom}
                      onChange={(event) =>
                        setExtraFilters((current) => ({ ...current, dateFrom: event.target.value }))
                      }
                      className="mt-0.5 w-full rounded border border-white/10 bg-white/5 px-1.5 py-1 text-xs text-white [color-scheme:dark]"
                    />
                  </label>
                  <label className="text-xs text-white/50">
                    Tot
                    <input
                      type="date"
                      value={extraFilters.dateTo}
                      onChange={(event) =>
                        setExtraFilters((current) => ({ ...current, dateTo: event.target.value }))
                      }
                      className="mt-0.5 w-full rounded border border-white/10 bg-white/5 px-1.5 py-1 text-xs text-white [color-scheme:dark]"
                    />
                  </label>
                </div>
                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => setExtraFilters(EMPTY_EXTRA_FILTERS)}
                    className="mt-3 w-full rounded-md border border-white/10 px-2 py-1.5 text-xs text-white/60 hover:bg-white/10"
                  >
                    Filters wissen
                  </button>
                ) : null}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </form>

        {/* Mailboxfilter */}
        {bootstrap.mailboxes.length > 1 ? (
          <select
            value={selectedMailboxId ?? ""}
            onChange={(event) => {
              setSelectedMailboxId(event.target.value || null);
              setActiveThreadId(null);
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
            aria-label="Mailboxfilter"
          >
            <option value="">Alle postvakken</option>
            {bootstrap.mailboxes.map((summary) => (
              <option key={summary.mailbox.id} value={summary.mailbox.id}>
                {summary.mailbox.emailAddress}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {/* Hoofdvlak */}
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-white/[0.015]">
        {/* Sidebar desktop */}
        <div className="hidden border-r border-white/10 p-3 md:block">
          <EmailSidebar
            view={view}
            selectedMailboxId={selectedMailboxId}
            mailboxes={bootstrap.mailboxes}
            labels={bootstrap.labels}
            counts={bootstrap.counts}
            onSelectView={selectView}
            onCompose={() => openCompose("new")}
            onCreateLabel={async (name, color) => {
              const result = await createLabelAction(name, color);
              if (result.ok) {
                setBootstrap((current) =>
                  current ? { ...current, labels: [...current.labels, result.data] } : current,
                );
                toast.success(`Label "${result.data.name}" aangemaakt.`);
                return true;
              }
              toast.error(result.message);
              return false;
            }}
            onUpdateLabel={async (id, fields) => {
              const result = await updateLabelAction(id, fields);
              if (result.ok) {
                setBootstrap((current) =>
                  current
                    ? {
                        ...current,
                        labels: current.labels.map((label) =>
                          label.id === id ? { ...label, ...fields, name: fields.name ?? label.name, color: fields.color ?? label.color, hidden: fields.hidden ?? label.hidden } : label,
                        ),
                      }
                    : current,
                );
                return true;
              }
              toast.error(result.message);
              return false;
            }}
            onDeleteLabel={async (id) => {
              const result = await deleteLabelAction(id);
              if (result.ok) {
                setBootstrap((current) =>
                  current ? { ...current, labels: current.labels.filter((label) => label.id !== id) } : current,
                );
                if (view.key === "label" && view.labelId === id) selectView({ key: "inbox" }, selectedMailboxId);
                toast.success("Label verwijderd.");
                return true;
              }
              toast.error(result.message);
              return false;
            }}
          />
        </div>

        {/* Sidebar mobiel */}
        {mobileSidebarOpen ? (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="h-full w-72 overflow-y-auto border-r border-white/10 bg-[#0c0c0c] p-3">
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="rounded p-1.5 text-white/60 hover:bg-white/10"
                  aria-label="Mappen sluiten"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <EmailSidebar
                view={view}
                selectedMailboxId={selectedMailboxId}
                mailboxes={bootstrap.mailboxes}
                labels={bootstrap.labels}
                counts={bootstrap.counts}
                onSelectView={selectView}
                onCompose={() => {
                  setMobileSidebarOpen(false);
                  openCompose("new");
                }}
                onCreateLabel={async (name, color) => {
                  const result = await createLabelAction(name, color);
                  if (result.ok) {
                    setBootstrap((current) =>
                      current ? { ...current, labels: [...current.labels, result.data] } : current,
                    );
                    return true;
                  }
                  toast.error(result.message);
                  return false;
                }}
                onUpdateLabel={async (id, fields) => {
                  const result = await updateLabelAction(id, fields);
                  if (!result.ok) toast.error(result.message);
                  return result.ok;
                }}
                onDeleteLabel={async (id) => {
                  const result = await deleteLabelAction(id);
                  if (!result.ok) toast.error(result.message);
                  return result.ok;
                }}
              />
            </div>
            <button
              type="button"
              className="flex-1 bg-black/60"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Mappen sluiten"
            />
          </div>
        ) : null}

        {/* Inhoud: viewer of lijst of concepten/outbox */}
        {activeThreadId ? (
          <EmailViewer
            threadId={activeThreadId}
            detail={threadDetail}
            loading={threadLoading}
            error={threadError}
            labels={bootstrap.labels}
            mailboxes={bootstrap.mailboxes}
            onClose={closeThread}
            onOpenThread={openThread}
            onReply={(message, kind) => openCompose(kind, message)}
            onToggleStar={(message) => {
              const next = !message.isStarred;
              setThreadDetail((current) =>
                current
                  ? {
                      ...current,
                      messages: current.messages.map((entry) =>
                        entry.id === message.id ? { ...entry, isStarred: next } : entry,
                      ),
                    }
                  : current,
              );
              void setMessagesStarredAction([message.id], next).then((result) => {
                if (!result.ok) toast.error(result.message);
              });
            }}
            onMarkUnread={(message) => {
              void setMessagesReadAction([message.id], false).then((result) => {
                if (result.ok) {
                  toast.success("Gemarkeerd als ongelezen.");
                  void refreshCounts();
                  closeThread();
                  void loadList(true);
                } else {
                  toast.error(result.message);
                }
              });
            }}
            onAssignLabel={(message, labelId) => {
              void assignLabelAction([message.id], labelId, true).then((result) => {
                if (result.ok) {
                  toast.success("Label toegevoegd.");
                  if (activeThreadId) void loadThread(activeThreadId);
                } else {
                  toast.error(result.message);
                }
              });
            }}
            onMove={(message, folder) => {
              void moveMessagesAction([message.id], folder).then((result) => {
                if (result.ok) {
                  toast.success(
                    folder === "archive" ? "Gearchiveerd." : folder === "spam" ? "Gemeld als spam." : folder === "trash" ? "Naar Prullenbak verplaatst." : "Verplaatst.",
                  );
                  closeThread();
                  void loadList(true);
                  void refreshCounts();
                } else {
                  toast.error(result.message);
                }
              });
            }}
            onSetProcessingStatus={(status: EmailProcessingStatus) => {
              if (!activeThreadId) return;
              setThreadDetail((current) =>
                current && current.thread
                  ? { ...current, thread: { ...current.thread, processingStatus: status } }
                  : current,
              );
              void setThreadProcessingStatusAction(activeThreadId, status).then((result) => {
                if (!result.ok) toast.error(result.message);
              });
            }}
            onAddNote={async (note) => {
              if (!activeThreadId) return false;
              const result = await addThreadNoteAction(activeThreadId, note);
              if (result.ok) {
                setThreadDetail((current) =>
                  current ? { ...current, notes: [...current.notes, result.data] } : current,
                );
                return true;
              }
              toast.error(result.message);
              return false;
            }}
            onDeleteNote={(note: EmailThreadNote) => {
              setThreadDetail((current) =>
                current ? { ...current, notes: current.notes.filter((entry) => entry.id !== note.id) } : current,
              );
              void deleteThreadNoteAction(note.id).then((result) => {
                if (!result.ok) toast.error(result.message);
              });
            }}
            onCreateContact={async (message) => {
              const result = await createContactFromMessageAction(message.id);
              if (result.ok) {
                toast.success(result.data.created ? "Contact aangemaakt." : "Bestaand contact gekoppeld.");
                if (activeThreadId) void loadThread(activeThreadId);
                return true;
              }
              toast.error(result.message);
              return false;
            }}
            onShowSource={(message) => {
              setSourceDialog({ loading: true });
              void fetchMessageSourceAction(message.id).then((result) => {
                if (result.ok) setSourceDialog({ loading: false, source: result.data.source });
                else setSourceDialog({ loading: false, error: result.message });
              });
            }}
            onRetry={() => {
              if (activeThreadId) void loadThread(activeThreadId);
            }}
          />
        ) : view.key === "drafts" ? (
          <DraftsPane
            drafts={drafts}
            loading={auxLoading}
            onOpen={(draft) => void openDraft(draft)}
            onDelete={async (draft) => {
              const result = await deleteDraftAction(draft.id);
              if (result.ok) {
                setDrafts((current) => current.filter((entry) => entry.id !== draft.id));
                void refreshCounts();
                toast.success("Concept verwijderd.");
              } else {
                toast.error(result.message);
              }
            }}
          />
        ) : view.key === "outbox" ? (
          <OutboxPane
            items={outboxItems}
            loading={auxLoading}
            mailboxes={bootstrap.mailboxes.map((summary) => summary.mailbox)}
            onRetry={async (item) => {
              const result = await retryOutboxAction(item.id);
              if (result.ok) toast.success("Bericht alsnog verzonden.");
              else toast.error(result.message);
              void loadAux("outbox");
              void refreshCounts();
            }}
            onEdit={async (item) => {
              const result = await outboxToDraftAction(item.id);
              if (result.ok) {
                void loadAux("outbox");
                await openDraft(result.data);
              } else {
                toast.error(result.message);
              }
            }}
            onCancel={async (item) => {
              const result = await cancelOutboxAction(item.id);
              if (result.ok) toast.success("Verzending geannuleerd.");
              else toast.error(result.message);
              void loadAux("outbox");
              void refreshCounts();
            }}
            onDelete={async (item) => {
              const result = await deleteOutboxAction(item.id);
              if (result.ok) {
                setOutboxItems((current) => current.filter((entry) => entry.id !== item.id));
                void refreshCounts();
              } else {
                toast.error(result.message);
              }
            }}
          />
        ) : (
          <EmailList
            view={view}
            items={items}
            loading={listLoading}
            loadingMore={loadingMore}
            hasMore={Boolean(cursor)}
            searchWindowLimited={searchWindowLimited}
            error={listError}
            selection={selection}
            activeThreadId={activeThreadId}
            mailboxes={bootstrap.mailboxes}
            labels={bootstrap.labels}
            showMailboxBadge={showMailboxBadge}
            syncing={syncing}
            onToggleSelect={(id) =>
              setSelection((current) => {
                const next = new Set(current);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
            onToggleSelectAll={() =>
              setSelection((current) => {
                const allSelected = items.length > 0 && items.every((item) => current.has(item.id));
                return allSelected ? new Set() : new Set(items.map((item) => item.id));
              })
            }
            onOpenItem={(item) => openThread(item.threadId)}
            onToggleStar={handleToggleStarItem}
            onBulk={(action, ids) => void runBulk(action, ids)}
            onAssignLabel={(ids, labelId, add) => void handleAssignLabel(ids, labelId, add)}
            onMoveTo={(ids, folder) => void handleMoveTo(ids, folder)}
            onLoadMore={() => {
              if (cursor && !loadingMore) void loadList(false);
              else if (listError) void loadList(true);
            }}
            onSync={() => void handleSync()}
          />
        )}
      </div>

      {/* Statusregel synchronisatie */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/35">
        {bootstrap.mailboxes.map((summary) => (
          <span key={summary.mailbox.id} className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: summary.mailbox.color }} aria-hidden="true" />
            {summary.mailbox.emailAddress}:{" "}
            {summary.mailbox.syncStatus === "syncing"
              ? "synchroniseren..."
              : summary.mailbox.syncStatus === "paused"
                ? "sync gepauzeerd"
                : summary.mailbox.lastSyncError
                  ? `fout: ${summary.mailbox.lastSyncError.slice(0, 80)}`
                  : summary.mailbox.lastSyncAt
                    ? `laatst gesynchroniseerd ${formatListDate(summary.mailbox.lastSyncAt)}`
                    : "nog niet gesynchroniseerd"}
          </span>
        ))}
      </div>

      {/* Composer */}
      {composer ? (
        <EmailComposer
          init={composer}
          mailboxes={bootstrap.mailboxes}
          onClose={() => {
            setComposer(null);
            if (view.key === "drafts") void loadAux("drafts");
            void refreshCounts();
          }}
          onSent={() => {
            void refreshCounts();
            if (view.key === "sent" || view.key === "all") void loadList(true);
            if (activeThreadId) void loadThread(activeThreadId);
          }}
        />
      ) : null}

      {/* Bevestiging definitief verwijderen */}
      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Definitief verwijderen">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#101010] p-5 shadow-2xl">
            <h3 className="mb-2 text-sm font-semibold text-white">Definitief verwijderen?</h3>
            <p className="mb-4 text-sm text-white/60">
              {confirmDelete.ids.length === 1 ? "Dit bericht wordt" : `${confirmDelete.ids.length} berichten worden`} ook
              op de mailserver definitief verwijderd. Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ids = confirmDelete.ids;
                  setConfirmDelete(null);
                  const result = await deleteMessagesPermanentlyAction(ids);
                  if (result.ok) {
                    setItems((current) => current.filter((item) => !ids.includes(item.id)));
                    setSelection(new Set());
                    toast.success("Definitief verwijderd.");
                    void refreshCounts();
                  } else {
                    toast.error(result.message);
                  }
                }}
                className="rounded-md bg-red-500/90 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500"
              >
                Definitief verwijderen
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Berichtbron */}
      {sourceDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Berichtbron">
          <div className="flex h-[80vh] w-full max-w-3xl flex-col rounded-xl border border-white/10 bg-[#101010] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <h3 className="text-sm font-semibold text-white">Berichtbron</h3>
              <button
                type="button"
                onClick={() => setSourceDialog(null)}
                className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Sluiten"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4">
              {sourceDialog.loading ? (
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Loader2 className="h-4 w-4 animate-spin" /> Bron laden van de mailserver...
                </div>
              ) : sourceDialog.error ? (
                <p className="text-sm text-red-300">{sourceDialog.error}</p>
              ) : (
                <pre className="whitespace-pre-wrap break-all text-xs text-white/70">{sourceDialog.source}</pre>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Concepten

function DraftsPane({
  drafts,
  loading,
  onOpen,
  onDelete,
}: {
  drafts: EmailDraft[];
  loading: boolean;
  onOpen: (draft: EmailDraft) => void;
  onDelete: (draft: EmailDraft) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {loading ? (
        <div className="flex flex-col gap-1 p-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-md bg-white/[0.04]" />
          ))}
        </div>
      ) : drafts.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
          <FileText className="h-8 w-8 text-white/20" aria-hidden="true" />
          <p className="text-sm text-white/50">Geen concepten.</p>
        </div>
      ) : (
        drafts.map((draft) => (
          <div
            key={draft.id}
            className="group flex cursor-pointer items-center gap-3 border-b border-white/[0.06] px-3 py-2.5 hover:bg-white/[0.04]"
            onClick={() => onOpen(draft)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter") onOpen(draft);
            }}
          >
            <Pencil className="h-4 w-4 shrink-0 text-amber-300/70" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white/85">
                {draft.subject || "(zonder onderwerp)"}
                <span className="ml-2 text-xs text-white/40">
                  {draft.to.length > 0 ? `Aan: ${draft.to.map(formatEmailAddress).join(", ")}` : "Nog geen ontvanger"}
                </span>
              </p>
              <p className="text-xs text-white/35">Laatst opgeslagen {formatFullDate(draft.lastSavedAt)}</p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(draft);
              }}
              className="rounded p-1.5 text-white/40 opacity-0 transition-opacity hover:bg-white/10 hover:text-red-300 group-hover:opacity-100"
              title="Concept verwijderen"
              aria-label="Concept verwijderen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Outbox

function OutboxPane({
  items,
  loading,
  mailboxes,
  onRetry,
  onEdit,
  onCancel,
  onDelete,
}: {
  items: EmailOutboxItem[];
  loading: boolean;
  mailboxes: Array<{ id: string; emailAddress: string; color: string }>;
  onRetry: (item: EmailOutboxItem) => void;
  onEdit: (item: EmailOutboxItem) => void;
  onCancel: (item: EmailOutboxItem) => void;
  onDelete: (item: EmailOutboxItem) => void;
}) {
  const mailboxById = new Map(mailboxes.map((mailbox) => [mailbox.id, mailbox]));
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {loading ? (
        <div className="flex flex-col gap-1 p-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-md bg-white/[0.04]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
          <Layers className="h-8 w-8 text-white/20" aria-hidden="true" />
          <p className="text-sm text-white/50">De Outbox is leeg. Verzonden berichten staan in Verzonden.</p>
        </div>
      ) : (
        items.map((item) => {
          const status = OUTBOX_STATUS_LABELS[item.status] ?? OUTBOX_STATUS_LABELS.queued;
          const mailbox = mailboxById.get(item.mailboxId);
          return (
            <div key={item.id} className="border-b border-white/[0.06] px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {mailbox ? (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: mailbox.color }}
                    title={mailbox.emailAddress}
                  />
                ) : null}
                <span className="truncate text-sm font-medium text-white/85">
                  {item.subject || "(zonder onderwerp)"}
                </span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", status.className)}>
                  {status.label}
                </span>
                <span className="ml-auto text-xs text-white/35">
                  {item.lastAttemptAt
                    ? `Laatste poging ${formatFullDate(item.lastAttemptAt)} (${item.attemptCount}x)`
                    : `Aangemaakt ${formatFullDate(item.createdAt)}`}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-white/45">
                Aan: {item.to.map(formatEmailAddress).join(", ")}
                {mailbox ? ` - via ${mailbox.emailAddress}` : ""}
              </p>
              {item.lastError ? (
                <p className="mt-1 rounded bg-red-500/10 px-2 py-1 text-xs text-red-300">{item.lastError}</p>
              ) : null}
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.status === "failed" ? (
                  <button
                    type="button"
                    onClick={() => onRetry(item)}
                    className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2 py-1 text-xs text-white/75 hover:bg-white/10"
                  >
                    <RotateCw className="h-3 w-3" /> Opnieuw proberen
                  </button>
                ) : null}
                {item.status === "failed" || item.status === "cancelled" ? (
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2 py-1 text-xs text-white/75 hover:bg-white/10"
                  >
                    <Pencil className="h-3 w-3" /> Bewerken
                  </button>
                ) : null}
                {item.status === "queued" || item.status === "failed" ? (
                  <button
                    type="button"
                    onClick={() => onCancel(item)}
                    className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2 py-1 text-xs text-white/75 hover:bg-white/10"
                  >
                    <XCircle className="h-3 w-3" /> Annuleren
                  </button>
                ) : null}
                {item.status !== "sending" ? (
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" /> Verwijderen
                  </button>
                ) : null}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
