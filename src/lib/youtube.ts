import { cache } from "react";
import { videografiePlaylists } from "@/config/videografie.config";

// YouTube-backed video list for the Videografie service page. Videos come from
// the playlists in videografie.config (each playlist -> a filter tab) via the
// YouTube Data API v3. Reads are resilient: without an API key / playlists, or
// on any API error, we fall back to the client-provided clips below so the page
// always has content. Cached per request via React.cache.

export type VideoItem = {
  /** YouTube video id (the `v=` value). */
  id: string;
  title: string;
  /** Filter label; matches a videografieCategories name where possible. */
  category: string;
  /** Optional client/brand shown under the title. */
  client?: string;
  /** Human duration like "0:30" / "2:10". */
  duration?: string;
  /** Optional longer description (featured block on the realisaties page). */
  description?: string;
  /** Optional tag pills (featured block). */
  tags?: string[];
};

// The 3 clips the client provided. Used until a key + playlists are configured.
// Categories map onto videografieCategories so the realisaties filter buckets them.
const FALLBACK_VIDEOS: VideoItem[] = [
  {
    id: "kfjoL_cUTPQ",
    title: "Zomerspot voor TV Limburg",
    category: "Promovideo",
    client: "TV Limburg",
    duration: "0:30",
    description: "Een pakkende zomerspot voor TV Limburg, van concept tot montage in huis geregisseerd.",
    tags: ["Commercial", "TV", "Montage"],
  },
  {
    id: "8zGBwfcbX9A",
    title: "Bouw Realisaties",
    category: "Bedrijfsvideo",
    client: "Bouwsector",
    duration: "2:10",
    description: "Een bedrijfsvideo die afgewerkte bouwprojecten in beeld brengt, van ruwbouw tot oplevering.",
    tags: ["Bouw", "Bedrijf", "Realisatie"],
  },
  {
    id: "zj4hvA8tdTA",
    title: "Baldewijns techniekersvideo",
    category: "Wervingsvideo",
    client: "Baldewijns",
    duration: "1:45",
    description: "Een wervingsvideo die de bedrijfscultuur toont en nieuwe techniekers aantrekt.",
    tags: ["Werving", "Team", "Techniek"],
  },
];

/** maxresdefault falls back to hqdefault client-side via onError in the card. */
export function ytThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

/** Convert an ISO 8601 duration (e.g. "PT2M10S") to a "m:ss" / "h:mm:ss" clock. */
function isoDurationToClock(iso: string): string | undefined {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!m) return undefined;
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const sec = Number(m[3] ?? 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(min)}:${pad(sec)}` : `${min}:${pad(sec)}`;
}

type PlaylistItemsResponse = {
  items?: { snippet?: { title?: string; description?: string; resourceId?: { videoId?: string } } }[];
};
type VideosResponse = {
  items?: { id?: string; contentDetails?: { duration?: string } }[];
};

async function fetchPlaylist(playlistId: string, category: string, key: string): Promise<VideoItem[]> {
  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50` +
    `&playlistId=${encodeURIComponent(playlistId)}&key=${key}`;
  // Cache for an hour so we don't burn API quota on every request.
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`playlistItems ${res.status}`);
  const data = (await res.json()) as PlaylistItemsResponse;
  return (data.items ?? [])
    .map((it) => {
      const id = it.snippet?.resourceId?.videoId;
      const title = it.snippet?.title ?? "";
      // Skip private/deleted placeholders that carry no usable title.
      if (!id || !title || title === "Private video" || title === "Deleted video") return null;
      // First paragraph of the YouTube description makes a decent teaser.
      const description = it.snippet?.description?.split("\n").find((l) => l.trim())?.trim();
      const item: VideoItem = { id, title, category };
      if (description) item.description = description;
      return item;
    })
    .filter((v): v is VideoItem => v !== null);
}

async function fetchDurations(ids: string[], key: string): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  // videos.list accepts up to 50 ids per call.
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const url =
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails` +
      `&id=${batch.join(",")}&key=${key}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) continue;
    const data = (await res.json()) as VideosResponse;
    for (const it of data.items ?? []) {
      const clock = it.contentDetails?.duration ? isoDurationToClock(it.contentDetails.duration) : undefined;
      if (it.id && clock) out.set(it.id, clock);
    }
  }
  return out;
}

async function readVideos(): Promise<VideoItem[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || videografiePlaylists.length === 0) return FALLBACK_VIDEOS;

  try {
    const perPlaylist = await Promise.all(
      videografiePlaylists.map((p) => fetchPlaylist(p.id, p.category, key)),
    );
    // Dedupe across playlists (first category wins), preserving tab order.
    const seen = new Set<string>();
    const videos: VideoItem[] = [];
    for (const list of perPlaylist) {
      for (const v of list) {
        if (seen.has(v.id)) continue;
        seen.add(v.id);
        videos.push(v);
      }
    }
    if (videos.length === 0) return FALLBACK_VIDEOS;

    const durations = await fetchDurations(videos.map((v) => v.id), key);
    return videos.map((v) => ({ ...v, duration: durations.get(v.id) ?? v.duration }));
  } catch {
    return FALLBACK_VIDEOS;
  }
}

/**
 * Videos for the gallery plus the derived filter tabs ("Alle" + each category
 * in first-seen order). Cached per request.
 */
export const getVideografieVideos = cache(async (): Promise<{ videos: VideoItem[]; filters: string[] }> => {
  const videos = await readVideos();
  const cats: string[] = [];
  for (const v of videos) if (!cats.includes(v.category)) cats.push(v.category);
  return { videos, filters: ["Alle", ...cats] };
});
