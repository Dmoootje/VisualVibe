"use client";

import { processTracks } from "../config/process.config";

interface ProcessTabsProps {
  activeId: string;
  onSelect: (id: string) => void;
}

/** Controlled tab selector for the process tracks; active tab gets the orange glow. */
export function ProcessTabs({ activeId, onSelect }: ProcessTabsProps) {
  return (
    <div className="mb-8 flex justify-center overflow-x-auto pb-2 scrollbar-hide sm:mb-10">
      <div
        role="tablist"
        aria-label="Kies een traject"
        className="inline-flex flex-nowrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm"
      >
        {processTracks.map((track) => {
          const isActive = track.id === activeId;
          return (
            <button
              key={track.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onSelect(track.id)}
              className={
                "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 sm:px-4 " +
                (isActive
                  ? "bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-amber-500/25"
                  : "text-white/70 hover:text-white")
              }
            >
              <span className="flex items-center justify-center">{track.icon}</span>
              <span>{track.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
