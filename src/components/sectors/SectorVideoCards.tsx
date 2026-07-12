"use client";

import { useState } from "react";
import type { VideoItem } from "@/lib/youtube";
// Direct file import (not the videografie barrel): the barrel pulls in server
// components whose import chain reaches fs, which breaks the client graph.
import { VideoCard, VideoLightbox } from "@/components/videografie/videoUi";

/**
 * Sector-page video's: the videografie card style, opening the shared
 * fullscreen VideoLightbox popup player (same as /realisaties/videografie).
 */
export function SectorVideoCards({ videos }: { videos: VideoItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>

      <VideoLightbox
        videos={videos}
        index={openIndex}
        onIndex={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
