// Configuration for the Videografie service page video gallery.
//
// The gallery is fed from YouTube: each playlist listed here becomes a filter
// tab (its `category` label), and its videos fill the grid. Fetching uses the
// YouTube Data API v3, so set `YOUTUBE_API_KEY` in .env.local and fill in the
// real playlist ids below. Until a key + playlists are configured (or if the
// API call fails), the page falls back to FALLBACK_VIDEOS in "@/lib/youtube".

export type VideografiePlaylist = {
  /** YouTube playlist id (the `list=` value, starts with "PL..."). */
  id: string;
  /** Filter-tab label this playlist maps to, e.g. "Commercial". */
  category: string;
};

/** Public channel, linked from the "Alle video's op YouTube" button. */
export const youtubeChannelUrl = "https://www.youtube.com/@visualvibe_be/videos";

/**
 * Playlists that feed the gallery, in tab order. Create a playlist per category
 * on the channel and paste its id here. Leave empty to use the fallback videos.
 *
 * Example:
 *   { id: "PLxxxxxxxxxxxxxxxx", category: "Commercial" },
 *   { id: "PLyyyyyyyyyyyyyyyy", category: "Bedrijfsvideo" },
 *   { id: "PLzzzzzzzzzzzzzzzz", category: "Wervingsvideo" },
 */
export const videografiePlaylists: VideografiePlaylist[] = [];
