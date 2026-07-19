"use client";

import { useState } from "react";
import { ProcessCard } from "./ProcessCard";
import { ProcessPathLine } from "./ProcessPathLine";
import { ProcessTabs } from "./ProcessTabs";
import { PROCESS_TRACK_EVENT } from "../process-events";
import { processTracks, processTracksEn } from "../config/process.config";

export function ProcessExplorer({ locale = "nl" }: { locale?: string }) {
  const tracks = locale === "en" ? processTracksEn : processTracks;
  const [activeId, setActiveId] = useState(tracks[0].id);
  const activeTrack = tracks.find((track) => track.id === activeId) ?? tracks[0];

  function selectTrack(id: string) {
    const track = tracks.find((item) => item.id === id) ?? tracks[0];
    setActiveId(track.id);
    window.dispatchEvent(
      new CustomEvent(PROCESS_TRACK_EVENT, { detail: { href: track.href } }),
    );
  }

  return (
    <>
      <ProcessTabs activeId={activeId} onSelect={selectTrack} locale={locale} />
      <div className="relative">
        <ProcessPathLine />
        <div
          key={activeId}
          className="home-content-swap relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {activeTrack.steps.map((step, index) => (
            <ProcessCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}
