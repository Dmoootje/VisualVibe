"use client";

import { useTransition } from "react";
import { changeLeadStatus } from "@/lib/admin/leadActions";
import { LEAD_STATUSES, type LeadStatus } from "@/types";
import { STATUS_LABELS } from "./StatusBadge";

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(event) => startTransition(() => changeLeadStatus(leadId, event.target.value as LeadStatus))}
      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/70 disabled:opacity-50"
    >
      {LEAD_STATUSES.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
