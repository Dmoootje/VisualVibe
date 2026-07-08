"use client";

import { useTransition } from "react";
import { changeLeadPriority } from "@/lib/admin/leadActions";
import { LEAD_PRIORITIES, type LeadPriority } from "@/types";

const PRIORITY_LABELS: Record<LeadPriority, string> = {
  low: "Laag",
  normal: "Normaal",
  high: "Hoog",
};

export function LeadPrioritySelect({ leadId, priority }: { leadId: string; priority: LeadPriority }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={priority}
      disabled={isPending}
      onChange={(event) => startTransition(() => changeLeadPriority(leadId, event.target.value as LeadPriority))}
      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70 disabled:opacity-50"
    >
      {LEAD_PRIORITIES.map((value) => (
        <option key={value} value={value} className="bg-neutral-900 text-white">
          {PRIORITY_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
