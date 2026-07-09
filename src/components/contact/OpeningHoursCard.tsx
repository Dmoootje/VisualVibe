import { Clock } from "lucide-react";
import type { OpeningHoursDay } from "@/types/siteSettings";

/** Current weekday key in Brussels time, e.g. "monday". */
function todayKey(): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "Europe/Brussels",
    })
      .format(new Date())
      .toLowerCase();
  } catch {
    return "";
  }
}

function dayTimes(day: OpeningHoursDay): string {
  if (!day.isOpen) return day.note || "Gesloten";
  const base = `${day.openTime} - ${day.closeTime}`;
  if (day.pauseStart && day.pauseEnd) {
    return `${day.openTime} - ${day.pauseStart}, ${day.pauseEnd} - ${day.closeTime}`;
  }
  return base;
}

export function OpeningHoursCard({ openingHours }: { openingHours: OpeningHoursDay[] }) {
  const today = todayKey();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20">
          <Clock className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="font-semibold text-white">Kantooruren</h3>
      </div>

      <ul className="flex flex-col gap-1.5 text-sm">
        {openingHours.map((day) => {
          const isToday = day.day === today;
          return (
            <li
              key={day.day}
              className={`flex items-center justify-between gap-3 rounded-md px-2 py-1 ${
                isToday ? "bg-amber-500/10" : ""
              }`}
            >
              <span className={isToday ? "font-medium text-white" : "text-white/70"}>
                {day.label}
              </span>
              <span className={day.isOpen ? "text-white/80" : "text-white/40"}>
                {dayTimes(day)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
