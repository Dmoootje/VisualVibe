// Google reviews via the Places API (New). Server-only: it reads
// GOOGLE_PLACES_API_KEY (no NEXT_PUBLIC prefix, so it never reaches the client).
//
// Google's official API returns at most 5 reviews. Results are cached (ISR)
// so the homepage stays static/fast and we stay well inside the free tier and
// Google's "refresh at least monthly" terms.

export type GoogleReview = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
};

// Public Maps profile - used for the "Reviews via Google" attribution link.
export const GOOGLE_MAPS_PROFILE_URL =
  "https://www.google.com/maps/place/VisualVibe+-+Fotograaf+Limburg/@50.7926451,5.469349,17z/data=!4m6!3m5!1s0x47c0dd0f1b0799b7:0xe29d6668387bd875";

const PLACE_TEXT_QUERY = "VisualVibe - Fotograaf Limburg";
const DAY = 60 * 60 * 24;

// Zero-tolerance on the em dash (U+2014) and horizontal bar (U+2015) extends
// to external content: Google reviewers often use them, so normalise to a
// hyphen at the ingestion boundary before any review text is rendered. The
// en dash (U+2013) is allowed and must be left untouched. Escapes keep the
// forbidden characters themselves out of the source.
const stripDashes = (text: string) => text.replace(/[\u2014\u2015]/g, "-");

/** Resolve the Places API place id from the business name (cached ~30 days). */
async function resolvePlaceId(apiKey: string): Promise<string | null> {
  const fromEnv = process.env.GOOGLE_PLACE_ID;
  if (fromEnv) return fromEnv;

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({ textQuery: PLACE_TEXT_QUERY, languageCode: "nl", regionCode: "BE" }),
    next: { revalidate: DAY * 30 },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { places?: { id: string }[] };
  return data.places?.[0]?.id ?? null;
}

type PlaceDetailsResponse = {
  rating?: number;
  userRatingCount?: number;
  reviews?: {
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    authorAttribution?: { displayName?: string; photoUri?: string };
  }[];
};

/**
 * Fetches the Place Details payload (reviews + aggregate rating) once; both
 * getGoogleReviews and getGoogleRatingSummary read from this same request/URL,
 * so Next's Data Cache serves the second call without another network hit.
 * Returns null when no key is configured or on any error.
 */
async function fetchPlaceDetails(apiKey: string): Promise<PlaceDetailsResponse | null> {
  try {
    const placeId = await resolvePlaceId(apiKey);
    if (!placeId) return null;

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=nl&regionCode=BE`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "rating,userRatingCount,reviews.rating,reviews.text,reviews.originalText,reviews.authorAttribution,reviews.relativePublishTimeDescription",
        },
        next: { revalidate: DAY },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as PlaceDetailsResponse;
  } catch {
    return null;
  }
}

/**
 * Fetches up to 5 Google reviews mapped to the testimonial slider shape.
 * Returns [] when no key is configured or on any error, so callers can fall
 * back to curated quotes without the homepage ever breaking.
 */
export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  const data = await fetchPlaceDetails(apiKey);
  if (!data) return [];

  return (data.reviews ?? [])
    .map((review) => ({
      quote: stripDashes(review.text?.text ?? review.originalText?.text ?? ""),
      author: stripDashes(review.authorAttribution?.displayName ?? "Google-gebruiker"),
      role: stripDashes(review.relativePublishTimeDescription ?? "Google review"),
      avatar: review.authorAttribution?.photoUri ?? "",
      rating: Math.round(review.rating ?? 5),
    }))
    .filter((review) => review.quote.trim().length > 0);
}

export type GoogleRatingSummary = {
  rating: number;
  count: number;
};

/**
 * VisualVibe's live aggregate Google Business rating and review count.
 * Returns null when unconfigured or unavailable, so callers omit the badge or
 * schema field rather than ever show a fabricated number.
 */
export async function getGoogleRatingSummary(): Promise<GoogleRatingSummary | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  const data = await fetchPlaceDetails(apiKey);
  if (!data || typeof data.rating !== "number" || typeof data.userRatingCount !== "number") {
    return null;
  }

  return { rating: Math.round(data.rating * 10) / 10, count: data.userRatingCount };
}
