import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nieuw",
  contacted: "Gecontacteerd",
  proposal_sent: "Offerte verstuurd",
  won: "Gewonnen",
  lost: "Verloren",
  archived: "Gearchiveerd",
};

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  contacted: "bg-white/10 text-white border-white/20",
  proposal_sent: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  won: "bg-green-500/10 text-green-400 border-green-500/30",
  lost: "bg-red-500/10 text-red-400 border-red-500/30",
  archived: "bg-white/5 text-white/40 border-white/10",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
