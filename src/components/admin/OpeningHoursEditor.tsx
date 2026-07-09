"use client";

import { useState } from "react";
import type { OpeningHoursDay } from "@/types/siteSettings";

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70 disabled:opacity-40";

/**
 * Per-day opening-hours editor. Serialises to a hidden `openingHours` input
 * (JSON) so the parent server-action form can read it from FormData.
 */
export function OpeningHoursEditor({ value }: { value: OpeningHoursDay[] }) {
  const [days, setDays] = useState<OpeningHoursDay[]>(value);

  function update(index: number, patch: Partial<OpeningHoursDay>) {
    setDays((prev) => prev.map((day, i) => (i === index ? { ...day, ...patch } : day)));
  }

  /** Copy the first open weekday's times to Mon-Fri. */
  function applyToWeekdays() {
    const template = days.find((d) => ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(d.day) && d.isOpen);
    if (!template) return;
    const weekdays = new Set(["monday", "tuesday", "wednesday", "thursday", "friday"]);
    setDays((prev) =>
      prev.map((day) =>
        weekdays.has(day.day)
          ? {
              ...day,
              isOpen: true,
              openTime: template.openTime,
              closeTime: template.closeTime,
              pauseStart: template.pauseStart,
              pauseEnd: template.pauseEnd,
            }
          : day
      )
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="openingHours" value={JSON.stringify(days)} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={applyToWeekdays}
          className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          Alle weekdagen gelijkzetten
        </button>
      </div>

      {days.map((day, index) => (
        <div
          key={day.day}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="w-24 font-medium text-white">{day.label}</span>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={day.isOpen}
                onChange={(e) => update(index, { isOpen: e.target.checked })}
                className="h-4 w-4 accent-amber-500"
              />
              <span className={day.isOpen ? "text-emerald-300" : "text-white/50"}>
                {day.isOpen ? "Open" : "Gesloten"}
              </span>
            </label>
          </div>

          {day.isOpen && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 text-xs text-white/50">
                Open
                <input
                  type="time"
                  value={day.openTime}
                  onChange={(e) => update(index, { openTime: e.target.value })}
                  className={inputClasses}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-white/50">
                Sluit
                <input
                  type="time"
                  value={day.closeTime}
                  onChange={(e) => update(index, { closeTime: e.target.value })}
                  className={inputClasses}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-white/50">
                Pauze van (optioneel)
                <input
                  type="time"
                  value={day.pauseStart}
                  onChange={(e) => update(index, { pauseStart: e.target.value })}
                  className={inputClasses}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-white/50">
                Pauze tot (optioneel)
                <input
                  type="time"
                  value={day.pauseEnd}
                  onChange={(e) => update(index, { pauseEnd: e.target.value })}
                  className={inputClasses}
                />
              </label>
            </div>
          )}

          <label className="mt-3 flex flex-col gap-1 text-xs text-white/50">
            Notitie (optioneel, bv. "Enkel op afspraak")
            <input
              type="text"
              value={day.note}
              onChange={(e) => update(index, { note: e.target.value })}
              className={inputClasses.replace("py-2 text-sm", "py-2 text-sm")}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
