export type WindowQuotaEntryKind = "attempt" | "reserved" | "success";

export type WindowQuotaEntry = {
  t: string;
  kind: WindowQuotaEntryKind;
  reservationId?: string;
};

export function entriesInWindow(
  entries: WindowQuotaEntry[],
  kinds: readonly WindowQuotaEntryKind[],
  sinceMs: number,
): WindowQuotaEntry[] {
  return entries.filter((entry) => {
    const time = Date.parse(entry.t);
    return Number.isFinite(time) && time > sinceMs && kinds.includes(entry.kind);
  });
}

export function activeAnalysisEntries(
  entries: WindowQuotaEntry[],
  sinceMs: number,
  now: number,
  reservationLeaseMs: number,
): WindowQuotaEntry[] {
  const leaseFloor = now - reservationLeaseMs;
  return entries.filter((entry) => {
    const time = Date.parse(entry.t);
    if (!Number.isFinite(time)) return false;
    if (entry.kind === "success") return time > sinceMs;
    if (entry.kind === "reserved") return time > leaseFloor;
    return false;
  });
}

export function resetAtForWindow(
  entries: WindowQuotaEntry[],
  windowMs: number,
  limit: number,
  reservedCompletionAllowanceMs = 0,
): string {
  if (!Number.isInteger(limit) || limit < 1 || entries.length < limit) {
    throw new Error("Resetmoment vereist een bereikt positief quotum.");
  }
  const sortedResetTimes = entries
    .map((entry) =>
      Date.parse(entry.t) +
      windowMs +
      (entry.kind === "reserved" ? reservedCompletionAllowanceMs : 0),
    )
    .sort((a, b) => a - b);
  return new Date(sortedResetTimes[sortedResetTimes.length - limit]).toISOString();
}

export function latestBlockingLimit<T extends { resetsAt: string }>(limits: T[]): T {
  if (limits.length === 0) {
    throw new Error("Minstens een blokkering is vereist.");
  }
  return [...limits].sort((a, b) => Date.parse(b.resetsAt) - Date.parse(a.resetsAt))[0];
}
