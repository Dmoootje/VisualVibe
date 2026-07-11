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

/**
 * The 8 videografie categories used by the Realisaties > Videografie filter
 * (fixed chips with live counts + an empty state per category). A video's
 * `category` should match one of these `name`s to be bucketed under its chip;
 * anything else only shows under "Alle". Descriptions drive the active-filter
 * copy and the empty-state text.
 */
export const videografieCategories: { name: string; description: string }[] = [
  { name: "Bedrijfsvideo", description: "Een video die vertelt wie je bent en wat je doet." },
  { name: "Promovideo", description: "Korte, krachtige video om een product, dienst of actie te promoten." },
  { name: "Social media video", description: "Video's op maat van Instagram, TikTok en LinkedIn." },
  { name: "Event-aftermovie", description: "Een sfeervolle terugblik op je bedrijfsevent." },
  { name: "Wervingsvideo", description: "Toon je bedrijfscultuur en trek nieuwe medewerkers aan." },
  { name: "Testimonial-video", description: "Laat tevreden klanten zelf aan het woord." },
  { name: "Podcastvideo", description: "Video-opname van je podcast voor YouTube en social media." },
  { name: "Nieuwsreportage", description: "Een journalistieke video-reportage over je bedrijf of project." },
];
