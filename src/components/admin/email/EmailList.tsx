"use client";

import { useEffect, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  AlertOctagon,
  Archive,
  ArchiveRestore,
  CheckSquare,
  ChevronDown,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  MoreHorizontal,
  Paperclip,
  RefreshCw,
  Square,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmailLabel, EmailMessageListItem, EmailSystemFolder, MailboxSummary } from "@/types/emailClient";
import { formatListDate, listSenderLabel, type EmailClientView } from "./emailClientUi";

export type BulkAction =
  | "archive"
  | "spam"
  | "not-spam"
  | "trash"
  | "restore"
  | "delete-permanent"
  | "read"
  | "unread"
  | "star"
  | "unstar";

type EmailListProps = {
  view: EmailClientView;
  items: EmailMessageListItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  searchWindowLimited: boolean;
  error: string | null;
  selection: Set<string>;
  activeThreadId: string | null;
  mailboxes: MailboxSummary[];
  labels: EmailLabel[];
  showMailboxBadge: boolean;
  syncing: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenItem: (item: EmailMessageListItem) => void;
  onToggleStar: (item: EmailMessageListItem) => void;
  onBulk: (action: BulkAction, ids: string[]) => void;
  onAssignLabel: (ids: string[], labelId: string, add: boolean) => void;
  onMoveTo: (ids: string[], folder: EmailSystemFolder) => void;
  onLoadMore: () => void;
  onSync: () => void;
};

export function LabelMenu({
  labels,
  onPick,
  children,
}: {
  labels: EmailLabel[];
  onPick: (labelId: string) => void;
  children: React.ReactNode;
}) {
  const visible = labels.filter((label) => !label.hidden);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[180px] rounded-lg border border-white/10 bg-[#141414] p-1 shadow-2xl"
          sideOffset={6}
        >
          {visible.length === 0 ? (
            <div className="px-3 py-2 text-xs text-white/50">
              Nog geen labels. Maak er een in de zijbalk.
            </div>
          ) : (
            visible.map((label) => (
              <DropdownMenu.Item
                key={label.id}
                onSelect={() => onPick(label.id)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10 data-[highlighted]:text-white"
              >
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: label.color }} aria-hidden="true" />
                {label.name}
              </DropdownMenu.Item>
            ))
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function ToolbarButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="rounded-md p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

export function EmailList({
  view,
  items,
  loading,
  loadingMore,
  hasMore,
  searchWindowLimited,
  error,
  selection,
  activeThreadId,
  mailboxes,
  labels,
  showMailboxBadge,
  syncing,
  onToggleSelect,
  onToggleSelectAll,
  onOpenItem,
  onToggleStar,
  onBulk,
  onAssignLabel,
  onMoveTo,
  onLoadMore,
  onSync,
}: EmailListProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const mailboxById = new Map(mailboxes.map((summary) => [summary.mailbox.id, summary.mailbox]));
  const labelById = new Map(labels.map((label) => [label.id, label]));
  const selectedIds = [...selection];
  const hasSelection = selectedIds.length > 0;
  const allSelected = items.length > 0 && items.every((item) => selection.has(item.id));
  const inTrashOrSpam = view.key === "trash" || view.key === "spam";

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { rootMargin: "300px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, onLoadMore, items.length]);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      {/* Werkbalk */}
      <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1.5">
        <ToolbarButton
          label={allSelected ? "Selectie op deze pagina opheffen" : "Alles op deze pagina selecteren"}
          onClick={onToggleSelectAll}
          disabled={items.length === 0}
        >
          {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
        </ToolbarButton>
        <ToolbarButton label="Vernieuwen en synchroniseren" onClick={onSync} disabled={syncing}>
          <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-white/10" aria-hidden="true" />

        {inTrashOrSpam ? (
          <>
            <ToolbarButton
              label={view.key === "spam" ? "Geen spam (terug naar Postvak IN)" : "Herstellen naar Postvak IN"}
              onClick={() => onBulk("restore", selectedIds)}
              disabled={!hasSelection}
            >
              <ArchiveRestore className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Definitief verwijderen"
              onClick={() => onBulk("delete-permanent", selectedIds)}
              disabled={!hasSelection}
            >
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        ) : (
          <>
            <ToolbarButton
              label="Archiveren"
              onClick={() => onBulk("archive", selectedIds)}
              disabled={!hasSelection}
            >
              <Archive className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Spam melden"
              onClick={() => onBulk("spam", selectedIds)}
              disabled={!hasSelection}
            >
              <AlertOctagon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Verwijderen (naar Prullenbak)"
              onClick={() => onBulk("trash", selectedIds)}
              disabled={!hasSelection}
            >
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}

        <ToolbarButton
          label="Markeren als gelezen"
          onClick={() => onBulk("read", selectedIds)}
          disabled={!hasSelection}
        >
          <MailOpen className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Markeren als ongelezen"
          onClick={() => onBulk("unread", selectedIds)}
          disabled={!hasSelection}
        >
          <Mail className="h-4 w-4" />
        </ToolbarButton>

        <LabelMenu labels={labels} onPick={(labelId) => onAssignLabel(selectedIds, labelId, true)}>
          <button
            type="button"
            disabled={!hasSelection}
            title="Label toewijzen"
            aria-label="Label toewijzen"
            className="rounded-md p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Tag className="h-4 w-4" />
          </button>
        </LabelMenu>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              disabled={!hasSelection}
              title="Meer acties"
              aria-label="Meer acties"
              className="rounded-md p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[210px] rounded-lg border border-white/10 bg-[#141414] p-1 shadow-2xl"
              sideOffset={6}
            >
              <DropdownMenu.Item
                onSelect={() => onBulk("star", selectedIds)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10"
              >
                <Star className="h-4 w-4" /> Ster toevoegen
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => onBulk("unstar", selectedIds)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10"
              >
                <Star className="h-4 w-4 opacity-40" /> Ster verwijderen
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
              <DropdownMenu.Label className="px-3 py-1 text-[11px] uppercase tracking-wider text-white/40">
                Verplaatsen naar
              </DropdownMenu.Label>
              {(["inbox", "archive", "spam", "trash"] as const).map((folder) => {
                const names: Record<string, string> = {
                  inbox: "Postvak IN",
                  archive: "Archief",
                  spam: "Spam",
                  trash: "Prullenbak",
                };
                return (
                  <DropdownMenu.Item
                    key={folder}
                    onSelect={() => onMoveTo(selectedIds, folder)}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-white/80 outline-none data-[highlighted]:bg-white/10"
                  >
                    <Inbox className="h-4 w-4 opacity-60" /> {names[folder]}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {hasSelection ? (
          <span className="ml-auto whitespace-nowrap text-xs text-white/50">
            {selectedIds.length} geselecteerd
          </span>
        ) : null}
      </div>

      {searchWindowLimited ? (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200">
          De zoekopdracht doorzocht de meest recente berichten. Verfijn de zoekterm of filters voor oudere resultaten.
        </div>
      ) : null}

      {/* Lijst */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-1 p-2" aria-label="Berichten laden">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-md bg-white/[0.04]" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-red-300">
            {error}
            <button
              type="button"
              onClick={onLoadMore}
              className="mx-auto mt-3 block rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
            >
              Opnieuw proberen
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <Inbox className="h-8 w-8 text-white/20" aria-hidden="true" />
            <p className="text-sm text-white/50">Geen berichten in deze weergave.</p>
          </div>
        ) : (
          <>
            {items.map((item) => {
              const mailbox = mailboxById.get(item.mailboxId);
              const isSelected = selection.has(item.id);
              const isActive = activeThreadId === item.threadId;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2 border-b border-white/[0.06] px-2 py-2 transition-colors",
                    isActive ? "bg-amber-500/10" : isSelected ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
                    !item.isRead && "bg-white/[0.02]",
                  )}
                  onClick={() => onOpenItem(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") onOpenItem(item);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Bericht van ${listSenderLabel(item)}: ${item.subject || "zonder onderwerp"}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(item.id)}
                    onClick={(event) => event.stopPropagation()}
                    className="h-4 w-4 shrink-0 accent-amber-500"
                    aria-label="Bericht selecteren"
                  />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleStar(item);
                    }}
                    className="shrink-0 rounded p-0.5"
                    title={item.isStarred ? "Ster verwijderen" : "Ster toevoegen"}
                    aria-label={item.isStarred ? "Ster verwijderen" : "Ster toevoegen"}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4 transition-colors",
                        item.isStarred ? "fill-amber-400 text-amber-400" : "text-white/25 hover:text-white/60",
                      )}
                    />
                  </button>

                  {showMailboxBadge && mailbox ? (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: mailbox.color }}
                      title={mailbox.emailAddress}
                      aria-label={`Mailbox ${mailbox.emailAddress}`}
                    />
                  ) : null}

                  <span
                    className={cn(
                      "w-40 shrink-0 truncate text-sm",
                      item.isRead ? "text-white/55" : "font-semibold text-white",
                    )}
                  >
                    {listSenderLabel(item)}
                    {item.threadMessageCount ? (
                      <span className="ml-1 text-xs font-normal text-white/40">({item.threadMessageCount})</span>
                    ) : null}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-sm">
                    <span className={cn(item.isRead ? "text-white/60" : "font-semibold text-white")}>
                      {item.subject || "(zonder onderwerp)"}
                    </span>
                    {item.snippet ? (
                      <span className="text-white/35"> - {item.snippet}</span>
                    ) : null}
                  </span>

                  <span className="hidden shrink-0 items-center gap-1 lg:flex">
                    {item.labelIds.slice(0, 3).map((labelId) => {
                      const label = labelById.get(labelId);
                      if (!label) return null;
                      return (
                        <span
                          key={labelId}
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: `${label.color}26`, color: label.color }}
                        >
                          {label.name}
                        </span>
                      );
                    })}
                  </span>

                  {item.hasAttachments ? (
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-white/35" aria-label="Met bijlage" />
                  ) : null}

                  {/* Datum, vervangen door hoveracties */}
                  <span className="relative flex w-24 shrink-0 items-center justify-end">
                    <span
                      className={cn(
                        "text-xs group-hover:invisible",
                        item.isRead ? "text-white/40" : "font-semibold text-white/80",
                      )}
                    >
                      {formatListDate(item.dateKey)}
                    </span>
                    <span className="absolute right-0 hidden items-center gap-0.5 group-hover:flex">
                      {!inTrashOrSpam ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onBulk("archive", [item.id]);
                          }}
                          className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                          title="Archiveren"
                          aria-label="Archiveren"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onBulk(inTrashOrSpam ? "delete-permanent" : "trash", [item.id]);
                        }}
                        className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                        title={inTrashOrSpam ? "Definitief verwijderen" : "Verwijderen"}
                        aria-label={inTrashOrSpam ? "Definitief verwijderen" : "Verwijderen"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onBulk(item.isRead ? "unread" : "read", [item.id]);
                        }}
                        className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                        title={item.isRead ? "Markeren als ongelezen" : "Markeren als gelezen"}
                        aria-label={item.isRead ? "Markeren als ongelezen" : "Markeren als gelezen"}
                      >
                        {item.isRead ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                      </button>
                    </span>
                  </span>
                </div>
              );
            })}

            <div ref={sentinelRef} aria-hidden="true" />
            {hasMore ? (
              <button
                type="button"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="flex w-full items-center justify-center gap-2 py-3 text-sm text-white/50 hover:bg-white/[0.04] hover:text-white"
              >
                {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
                {loadingMore ? "Laden..." : "Meer laden"}
              </button>
            ) : (
              <p className="py-3 text-center text-xs text-white/25">Einde van de lijst</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
