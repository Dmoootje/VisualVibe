"use client";

import { useState } from "react";
import {
  Archive,
  AlertOctagon,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Inbox,
  Layers,
  Pencil,
  PenSquare,
  Plus,
  Send,
  Settings2,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { EmailLabel, EmailSidebarCounts, MailboxSummary } from "@/types/emailClient";
import { LABEL_COLORS } from "@/types/emailClient";
import { CONNECTION_COLORS, CONNECTION_LABELS, type EmailClientView } from "./emailClientUi";

type SidebarProps = {
  view: EmailClientView;
  selectedMailboxId: string | null;
  mailboxes: MailboxSummary[];
  labels: EmailLabel[];
  counts: EmailSidebarCounts;
  onSelectView: (view: EmailClientView, mailboxId?: string | null) => void;
  onCompose: () => void;
  onCreateLabel: (name: string, color: string) => Promise<boolean>;
  onUpdateLabel: (id: string, fields: { name?: string; color?: string; hidden?: boolean }) => Promise<boolean>;
  onDeleteLabel: (id: string) => Promise<boolean>;
  className?: string;
};

const SYSTEM_ITEMS = [
  { key: "inbox", label: "Postvak IN", icon: Inbox },
  { key: "starred", label: "Met ster", icon: Star },
  { key: "sent", label: "Verzonden", icon: Send },
  { key: "drafts", label: "Concepten", icon: FileText },
  { key: "outbox", label: "Outbox", icon: Layers },
  { key: "all", label: "Alle e-mail", icon: Archive },
  { key: "spam", label: "Spam", icon: AlertOctagon },
  { key: "trash", label: "Prullenbak", icon: Trash2 },
] as const;

function CountBadge({ value, tone = "default" }: { value: number; tone?: "default" | "warn" }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "ml-auto rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none",
        tone === "warn" ? "bg-orange-500/20 text-orange-300" : "bg-white/10 text-white/80",
      )}
    >
      {value > 999 ? "999+" : value}
    </span>
  );
}

export function EmailSidebar({
  view,
  selectedMailboxId,
  mailboxes,
  labels,
  counts,
  onSelectView,
  onCompose,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
  className,
}: SidebarProps) {
  const [expandedMailboxes, setExpandedMailboxes] = useState<Record<string, boolean>>({});
  const [labelEditor, setLabelEditor] = useState<
    | { mode: "create"; name: string; color: string }
    | { mode: "edit"; id: string; name: string; color: string }
    | null
  >(null);
  const [labelBusy, setLabelBusy] = useState(false);
  const [deleteLabelId, setDeleteLabelId] = useState<string | null>(null);
  const multipleMailboxes = mailboxes.length > 1;

  const countFor = (key: string): { value: number; tone?: "warn" } | null => {
    if (key === "inbox") return { value: counts.inboxUnread };
    if (key === "drafts") return { value: counts.drafts };
    if (key === "outbox") return counts.outboxPending > 0 ? { value: counts.outboxPending, tone: "warn" } : { value: 0 };
    if (key === "spam") return { value: counts.spam };
    return null;
  };

  const submitLabel = async () => {
    if (!labelEditor || labelBusy) return;
    setLabelBusy(true);
    const ok =
      labelEditor.mode === "create"
        ? await onCreateLabel(labelEditor.name, labelEditor.color)
        : await onUpdateLabel(labelEditor.id, { name: labelEditor.name, color: labelEditor.color });
    setLabelBusy(false);
    if (ok) setLabelEditor(null);
  };

  return (
    <aside className={cn("flex h-full w-60 shrink-0 flex-col gap-1 overflow-y-auto pr-2", className)}>
      <button
        type="button"
        onClick={onCompose}
        className="mb-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
      >
        <PenSquare className="h-4 w-4" aria-hidden="true" />
        Nieuw bericht
      </button>

      {SYSTEM_ITEMS.map((item) => {
        const isActive = view.key === item.key && !selectedMailboxId;
        const count = countFor(item.key);
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelectView({ key: item.key }, null)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors",
              isActive ? "bg-white/10 font-medium text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{multipleMailboxes && item.key === "inbox" ? "Alle postvakken" : item.label}</span>
            {count ? <CountBadge value={count.value} tone={count.tone} /> : null}
          </button>
        );
      })}

      {multipleMailboxes ? (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Mailboxen</span>
            <Link
              href="/admin/email/accounts"
              className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              title="Mailboxaccounts beheren"
              aria-label="Mailboxaccounts beheren"
            >
              <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {mailboxes.map((summary) => {
            const mailbox = summary.mailbox;
            const expanded = expandedMailboxes[mailbox.id] ?? false;
            const unread = counts.perMailboxInboxUnread[mailbox.id] ?? 0;
            return (
              <div key={mailbox.id} className="mb-0.5">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMailboxes((current) => ({ ...current, [mailbox.id]: !expanded }))
                    }
                    className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                    aria-label={expanded ? "Mailbox inklappen" : "Mailbox uitklappen"}
                  >
                    {expanded ? (
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectView({ key: "inbox" }, mailbox.id)}
                    className={cn(
                      "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                      selectedMailboxId === mailbox.id
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white",
                    )}
                    title={`${mailbox.emailAddress} (${CONNECTION_LABELS[summary.connection]})`}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: mailbox.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{mailbox.emailAddress}</span>
                    <span
                      className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: CONNECTION_COLORS[summary.connection] }}
                      aria-hidden="true"
                    />
                    <CountBadge value={unread} />
                  </button>
                </div>
                {expanded ? (
                  <div className="ml-6 flex flex-col border-l border-white/10 pl-2">
                    {(["inbox", "sent", "spam", "trash", "archive"] as const).map((folderKey) => {
                      const labelText: Record<string, string> = {
                        inbox: "Postvak IN",
                        sent: "Verzonden",
                        spam: "Spam",
                        trash: "Prullenbak",
                        archive: "Archief",
                      };
                      const isActive = view.key === folderKey && selectedMailboxId === mailbox.id;
                      return (
                        <button
                          key={folderKey}
                          type="button"
                          onClick={() => onSelectView({ key: folderKey }, mailbox.id)}
                          className={cn(
                            "rounded-md px-2 py-1 text-left text-[13px] transition-colors",
                            isActive ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          {labelText[folderKey]}
                          {folderKey === "inbox" && unread > 0 ? (
                            <span className="ml-1.5 text-[11px] text-white/50">({unread})</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between px-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Labels</span>
          <button
            type="button"
            onClick={() => setLabelEditor({ mode: "create", name: "", color: LABEL_COLORS[0] })}
            className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            title="Label aanmaken"
            aria-label="Label aanmaken"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        {labels.length === 0 ? (
          <p className="px-3 py-1 text-xs text-white/35">Nog geen labels. Maak er een met +.</p>
        ) : (
          labels.map((label) => {
            const isActive = view.key === "label" && view.labelId === label.id;
            if (label.hidden && !isActive) {
              return (
                <div key={label.id} className="group flex items-center gap-2 rounded-md px-3 py-1 text-sm text-white/25">
                  <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate line-through">{label.name}</span>
                  <button
                    type="button"
                    onClick={() => void onUpdateLabel(label.id, { hidden: false })}
                    className="ml-auto rounded p-1 opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100"
                    title="Label tonen"
                    aria-label={`Label ${label.name} tonen`}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              );
            }
            return (
              <div
                key={label.id}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectView({ key: "label", labelId: label.id }, selectedMailboxId)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: label.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{label.name}</span>
                </button>
                <span className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                  <button
                    type="button"
                    onClick={() => setLabelEditor({ mode: "edit", id: label.id, name: label.name, color: label.color })}
                    className="rounded p-1 hover:bg-white/10"
                    title="Label bewerken"
                    aria-label={`Label ${label.name} bewerken`}
                  >
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void onUpdateLabel(label.id, { hidden: true })}
                    className="rounded p-1 hover:bg-white/10"
                    title="Label verbergen"
                    aria-label={`Label ${label.name} verbergen`}
                  >
                    <EyeOff className="h-3 w-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteLabelId(label.id)}
                    className="rounded p-1 text-red-300/80 hover:bg-red-500/20"
                    title="Label verwijderen"
                    aria-label={`Label ${label.name} verwijderen`}
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              </div>
            );
          })
        )}
      </div>

      {labelEditor ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={labelEditor.mode === "create" ? "Label aanmaken" : "Label bewerken"}
          onKeyDown={(event) => {
            if (event.key === "Escape") setLabelEditor(null);
          }}
        >
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#101010] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {labelEditor.mode === "create" ? "Nieuw label" : "Label bewerken"}
              </h3>
              <button
                type="button"
                onClick={() => setLabelEditor(null)}
                className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Sluiten"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <label className="mb-1 block text-xs text-white/60" htmlFor="email-label-name">
              Naam
            </label>
            <input
              id="email-label-name"
              autoFocus
              value={labelEditor.name}
              maxLength={40}
              onChange={(event) => setLabelEditor({ ...labelEditor, name: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Enter") void submitLabel();
              }}
              className="mb-3 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/70"
              placeholder="bv. Offertes"
            />
            <span className="mb-1 block text-xs text-white/60">Kleur</span>
            <div className="mb-4 flex flex-wrap gap-2">
              {LABEL_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setLabelEditor({ ...labelEditor, color })}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                    labelEditor.color === color ? "border-white" : "border-transparent",
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Kleur ${color}`}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLabelEditor(null)}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={() => void submitLabel()}
                disabled={labelBusy || !labelEditor.name.trim()}
                className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {labelBusy ? "Bezig..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteLabelId ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Label verwijderen"
        >
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#101010] p-5 shadow-2xl">
            <h3 className="mb-2 text-sm font-semibold text-white">Label verwijderen?</h3>
            <p className="mb-4 text-sm text-white/60">
              Het label wordt van alle berichten verwijderd. De berichten zelf blijven bestaan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteLabelId(null)}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await onDeleteLabel(deleteLabelId);
                  if (ok) setDeleteLabelId(null);
                }}
                className="rounded-md bg-red-500/90 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
