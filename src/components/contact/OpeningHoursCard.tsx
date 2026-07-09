import { Clock } from "lucide-react";
import type { OpeningHoursDay } from "@/types/siteSettings";

/** Current weekday key in Brussels time, e.g. "monday". */
function todayKey(): string {
  try {
    return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Europe/Brussels" })
      .format(new Date())
      .toLowerCase();
  } catch {
    return "";
  }
}

type Group = {
  sig: string;
  startLabel: string;
  endLabel: string;
  isOpen: boolean;
  hours: string;
  containsToday: boolean;
};

function signature(day: OpeningHoursDay): string {
  return day.isOpen ? `${day.openTime}-${day.closeTime}-${day.pauseStart}-${day.pauseEnd}` : "closed";
}

function hoursLabel(day: OpeningHoursDay): string {
  if (!day.isOpen) return day.note || "Gesloten";
  if (day.pauseStart && day.pauseEnd) {
    return `${day.openTime} - ${day.pauseStart}, ${day.pauseEnd} - ${day.closeTime}`;
  }
  return `${day.openTime} - ${day.closeTime}`;
}

/** Groups consecutive days that share the same hours into ranges. */
function groupDays(days: OpeningHoursDay[], today: string): Group[] {
  const groups: Group[] = [];
  for (const day of days) {
    const sig = signature(day);
    const last = groups[groups.length - 1];
    if (last && last.sig === sig) {
      last.endLabel = day.label;
      if (day.day === today) last.containsToday = true;
    } else {
      groups.push({
        sig,
        startLabel: day.label,
        endLabel: day.label,
        isOpen: day.isOpen,
        hours: hoursLabel(day),
        containsToday: day.day === today,
      });
    }
  }
  return groups;
}

/** Compact office-hours summary (content only; the parent card supplies the frame). */
export function OpeningHoursCard({ openingHours }: { openingHours: OpeningHoursDay[] }) {
  const today = todayKey();
  const groups = groupDays(openingHours, today);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/25 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25">
          <Clock className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="font-semibold text-white">Kantooruren</h3>
      </div>

      <ul className="flex flex-col gap-1.5 text-sm">
        {groups.map((group, i) => {
          const label =
            group.startLabel === group.endLabel
              ? group.startLabel
              : `${group.startLabel} - ${group.endLabel}`;
          return (
            <li key={i} className="flex items-baseline justify-between gap-3">
              <span className={group.containsToday ? "font-medium text-white" : "text-white/60"}>
                {label}
              </span>
              <span className={group.isOpen ? "font-medium text-amber-400" : "text-white/35"}>
                {group.hours}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
