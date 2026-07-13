import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createHmac, randomBytes } from "crypto";

// SmugMug-galerijen voor de fotografie-realisaties. Publieke albums van het
// account verschijnen automatisch op de site; wijzigingen in SmugMug stromen
// binnen ~5 minuten door (unstable_cache). Zonder credentials of bij een
// API-fout rendert de site gewoon zonder SmugMug-sectie (lege lijst).
//
// Env (.env.local + App Hosting):
//   SMUGMUG_USER                 accountnaam (bv. "visualvibe" uit visualvibe.smugmug.com)
//   SMUGMUG_API_KEY              verplicht
//   SMUGMUG_API_SECRET           optioneel; samen met de tokens ->
//   SMUGMUG_ACCESS_TOKEN         volledige OAuth 1.0a-signing (ook nodig
//   SMUGMUG_ACCESS_TOKEN_SECRET  wanneer alleen-publiek niet volstaat)

export type SmugMugGallery = {
  key: string;
  name: string;
  /** Publieke galerij-URL op SmugMug. */
  webUri: string;
  imageCount: number;
  lastUpdated: string;
  coverUrl?: string;
};

const API_ORIGIN = "https://api.smugmug.com";

type SmugCreds = {
  user: string;
  apiKey: string;
  apiSecret?: string;
  accessToken?: string;
  tokenSecret?: string;
};

function getCreds(): SmugCreds | null {
  const apiKey = process.env.SMUGMUG_API_KEY?.trim();
  const user = process.env.SMUGMUG_USER?.trim();
  if (!apiKey || !user) return null;
  return {
    user,
    apiKey,
    apiSecret: process.env.SMUGMUG_API_SECRET?.trim() || undefined,
    accessToken: process.env.SMUGMUG_ACCESS_TOKEN?.trim() || undefined,
    tokenSecret: process.env.SMUGMUG_ACCESS_TOKEN_SECRET?.trim() || undefined,
  };
}

/** Percent-encoding volgens RFC 3986 (OAuth 1.0a-eis, strenger dan encodeURIComponent). */
function rfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** OAuth 1.0a Authorization-header (HMAC-SHA1) voor een GET op url?query. */
function oauthHeader(url: string, query: Record<string, string>, creds: Required<SmugCreds>): string {
  const oauth: Record<string, string> = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: creds.accessToken,
    oauth_version: "1.0",
  };
  const all: Record<string, string> = { ...query, ...oauth };
  const paramString = Object.keys(all)
    .sort()
    .map((k) => `${rfc3986(k)}=${rfc3986(all[k])}`)
    .join("&");
  const base = ["GET", rfc3986(url), rfc3986(paramString)].join("&");
  const signingKey = `${rfc3986(creds.apiSecret)}&${rfc3986(creds.tokenSecret)}`;
  oauth.oauth_signature = createHmac("sha1", signingKey).update(base).digest("base64");
  return (
    "OAuth " +
    Object.keys(oauth)
      .sort()
      .map((k) => `${rfc3986(k)}="${rfc3986(oauth[k])}"`)
      .join(", ")
  );
}

async function smFetch(path: string, query: Record<string, string>, creds: SmugCreds): Promise<unknown> {
  const url = `${API_ORIGIN}${path}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  const params = new URLSearchParams(query);

  if (creds.apiSecret && creds.accessToken && creds.tokenSecret) {
    headers.Authorization = oauthHeader(url, query, creds as Required<SmugCreds>);
  } else {
    // Zonder tokens: alleen publieke data, met de API-key als queryparam.
    params.set("APIKey", creds.apiKey);
  }

  // De OAuth-nonce verandert per call; caching gebeurt via unstable_cache
  // rond de hele leesfunctie, dus hier bewust no-store.
  const res = await fetch(`${url}?${params.toString()}`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`SmugMug ${res.status}`);
  return res.json();
}

/** "…/Th/foto-Th.jpg" (100px) -> "…/L/foto-L.jpg" (~800px) voor kaartcovers. */
function upscaleThumb(thumbnailUrl: string): string {
  return thumbnailUrl.replace(/\/Th\//, "/L/").replace(/-Th\.(\w+)(\?.*)?$/, "-L.$1$2");
}

type SmugAlbum = {
  AlbumKey?: string;
  NodeID?: string;
  Name?: string;
  WebUri?: string;
  ImageCount?: number;
  Privacy?: string;
  LastUpdated?: string;
  ImagesLastUpdated?: string;
  Uris?: { HighlightImage?: { Uri?: string } };
};

type SmugAlbumsResponse = {
  Response?: {
    Album?: SmugAlbum[];
    Pages?: { NextPage?: string };
  };
  Expansions?: Record<string, { AlbumImage?: { ThumbnailUrl?: string }; Image?: { ThumbnailUrl?: string } }>;
};

async function readGalleries(): Promise<SmugMugGallery[]> {
  const creds = getCreds();
  if (!creds) return [];

  try {
    const galleries: SmugMugGallery[] = [];
    let path: string | null = `/api/v2/user/${encodeURIComponent(creds.user)}!albums`;
    let extraQuery: Record<string, string> = { count: "100" };

    // Max 3 pagina's (300 albums) als runaway-rem.
    for (let page = 0; path && page < 3; page++) {
      const data = (await smFetch(path, { ...extraQuery, _expand: "HighlightImage" }, creds)) as SmugAlbumsResponse;
      const albums = data.Response?.Album ?? [];
      const expansions = data.Expansions ?? {};

      for (const album of albums) {
        // Met volledige OAuth komen ook unlisted/privé-albums mee: die overslaan.
        if (album.Privacy && album.Privacy !== "Public") continue;
        if (!album.WebUri) continue;

        const highlightUri = album.Uris?.HighlightImage?.Uri;
        const expansion = highlightUri ? expansions[highlightUri] : undefined;
        const thumb = expansion?.AlbumImage?.ThumbnailUrl ?? expansion?.Image?.ThumbnailUrl;

        galleries.push({
          key: album.AlbumKey ?? album.NodeID ?? album.WebUri,
          name: album.Name ?? "Galerij",
          webUri: album.WebUri,
          imageCount: typeof album.ImageCount === "number" ? album.ImageCount : 0,
          lastUpdated: album.ImagesLastUpdated ?? album.LastUpdated ?? "",
          ...(thumb ? { coverUrl: upscaleThumb(thumb) } : {}),
        });
      }

      const next = data.Response?.Pages?.NextPage;
      if (next) {
        const nextUrl = new URL(next, API_ORIGIN);
        path = nextUrl.pathname;
        extraQuery = Object.fromEntries(nextUrl.searchParams);
        delete extraQuery.APIKey;
        delete extraQuery._expand;
      } else {
        path = null;
      }
    }

    // Nieuwste (laatst gewijzigde) galerijen eerst.
    return galleries.sort((a, b) => (b.lastUpdated || "").localeCompare(a.lastUpdated || ""));
  } catch {
    return [];
  }
}

const readGalleriesCached = unstable_cache(readGalleries, ["smugmug-galleries"], { revalidate: 300 });

/** Publieke SmugMug-galerijen, nieuwste eerst; 5 min gecachet, [] bij fout. */
export const getSmugMugGalleries = cache(readGalleriesCached);
