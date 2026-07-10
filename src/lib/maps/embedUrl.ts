// Normalises whatever an admin pastes into the "Google Maps embed-URL" field
// into a safe, genuinely embeddable iframe src, or undefined. A bare/relative
// string (e.g. "www.google.com/maps/...") would resolve same-origin and render
// this app's own 404 inside the iframe, so we only ever return an absolute
// Google Maps *embed* URL.
export function resolveMapEmbedUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  let value = raw.trim();
  if (!value) return undefined;

  // A whole "<iframe ... src="...">" snippet is a common paste: pull out the src.
  const srcMatch = value.match(/src\s*=\s*["']([^"']+)["']/i);
  if (srcMatch) value = srcMatch[1].trim();

  // Must be an absolute http(s) URL; anything else resolves same-origin.
  if (!/^https?:\/\//i.test(value)) return undefined;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const isGoogle = host === "maps.google.com" || /(^|\.)google\.[a-z.]+$/.test(host);
    if (!isGoogle) return undefined;
    // Only truly embeddable forms: /maps/embed?... or ...?output=embed. A plain
    // share/place link would be refused by Google's frame policy.
    const embeddable =
      url.pathname.includes("/maps/embed") || url.searchParams.get("output") === "embed";
    if (!embeddable) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
