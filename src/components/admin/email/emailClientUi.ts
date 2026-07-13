// Gedeelde client-side helpers voor de e-mailclient (geen server-imports).

import type { EmailListFilter, EmailMessageListItem } from "@/types/emailClient";

export type EmailViewKey =
  | "inbox"
  | "starred"
  | "sent"
  | "drafts"
  | "outbox"
  | "all"
  | "spam"
  | "trash"
  | "archive"
  | "label";

export type EmailClientView = {
  key: EmailViewKey;
  labelId?: string;
};

export const VIEW_TITLES: Record<EmailViewKey, string> = {
  inbox: "Postvak IN",
  starred: "Met ster",
  sent: "Verzonden",
  drafts: "Concepten",
  outbox: "Outbox",
  all: "Alle e-mail",
  spam: "Spam",
  trash: "Prullenbak",
  archive: "Archief",
  label: "Label",
};

export function viewToPath(view: EmailClientView): string {
  if (view.key === "label" && view.labelId) {
    return `/admin/email/label/${encodeURIComponent(view.labelId)}`;
  }
  return `/admin/email/${view.key}`;
}

export function parseEmailPath(slug: string[] | undefined): {
  view: EmailClientView;
  threadId?: string;
} {
  const [first, second] = slug ?? [];
  if (!first) return { view: { key: "inbox" } };
  if (first === "label" && second) return { view: { key: "label", labelId: second } };
  if (first === "thread" && second) return { view: { key: "inbox" }, threadId: second };
  if (
    ["inbox", "starred", "sent", "drafts", "outbox", "all", "spam", "trash", "archive"].includes(first)
  ) {
    return { view: { key: first as EmailViewKey } };
  }
  return { view: { key: "inbox" } };
}

export type ListExtraFilters = {
  unreadOnly: boolean;
  starredOnly: boolean;
  withAttachments: boolean;
  unansweredOnly: boolean;
  dateFrom: string;
  dateTo: string;
};

export const EMPTY_EXTRA_FILTERS: ListExtraFilters = {
  unreadOnly: false,
  starredOnly: false,
  withAttachments: false,
  unansweredOnly: false,
  dateFrom: "",
  dateTo: "",
};

export function buildListFilter(
  view: EmailClientView,
  mailboxId: string | null,
  query: string,
  extra: ListExtraFilters,
): EmailListFilter {
  const base: EmailListFilter = {
    view:
      view.key === "drafts" || view.key === "outbox"
        ? "inbox"
        : (view.key as EmailListFilter["view"]),
    ...(view.key === "label" && view.labelId ? { labelId: view.labelId } : {}),
    ...(mailboxId ? { mailboxId } : {}),
    ...(query.trim() ? { query: query.trim() } : {}),
    ...(extra.unreadOnly ? { unreadOnly: true } : {}),
    ...(extra.starredOnly ? { starredOnly: true } : {}),
    ...(extra.withAttachments ? { withAttachments: true } : {}),
    ...(extra.unansweredOnly ? { unansweredOnly: true } : {}),
    ...(extra.dateFrom ? { dateFrom: new Date(`${extra.dateFrom}T00:00:00`).toISOString() } : {}),
    ...(extra.dateTo ? { dateTo: new Date(`${extra.dateTo}T23:59:59`).toISOString() } : {}),
  };
  return base;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Gmail-achtige datumnotatie: tijd vandaag, "12 mei", of "12-05-2024". */
export function formatListDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (date.getTime() >= startOfToday) {
    return date.toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" });
  }
  if (now.getTime() - date.getTime() < 335 * DAY_MS) {
    return date.toLocaleDateString("nl-BE", { day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatFullDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("nl-BE", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size <= 0) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} kB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function listSenderLabel(item: EmailMessageListItem): string {
  if (item.folder === "sent" || item.direction === "outbound") {
    const to = item.to.map((entry) => entry.name || entry.address).join(", ");
    return to ? `Aan: ${to}` : "Aan: (onbekend)";
  }
  return item.from.name || item.fromAddress || "(onbekende afzender)";
}

/**
 * Externe afbeeldingen blokkeren in reeds gesanitizede HTML. De inhoud is
 * vooraf server-side ontsmet; hier worden alleen http(s)-srcs geneutraliseerd
 * tot de gebruiker op "Afbeeldingen tonen" klikt.
 */
export function blockRemoteImages(html: string): { html: string; blockedCount: number } {
  let blockedCount = 0;
  const result = html.replace(
    /(<img\b[^>]*?)\ssrc\s*=\s*("https?:[^"]*"|'https?:[^']*')/gi,
    (match, prefix: string, url: string) => {
      blockedCount += 1;
      return `${prefix} data-vv-blocked-src=${url} src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="`;
    },
  );
  return { html: result, blockedCount };
}

export const PROCESSING_STATUS_COLORS: Record<string, string> = {
  "new": "#38bdf8",
  "in-progress": "#facc15",
  "waiting-customer": "#a78bfa",
  "waiting-internal": "#fb923c",
  "completed": "#34d399",
};

export const CONNECTION_LABELS: Record<string, string> = {
  connected: "Volledig verbonden",
  "imap-only": "Alleen lezen (IMAP)",
  "smtp-only": "Alleen verzenden (SMTP)",
  "partial-error": "Verbinding gedeeltelijk mislukt",
  disconnected: "Niet verbonden",
  disabled: "Uitgeschakeld",
};

export const CONNECTION_COLORS: Record<string, string> = {
  connected: "#34d399",
  "imap-only": "#38bdf8",
  "smtp-only": "#facc15",
  "partial-error": "#fb923c",
  disconnected: "#f87171",
  disabled: "#94a3b8",
};
