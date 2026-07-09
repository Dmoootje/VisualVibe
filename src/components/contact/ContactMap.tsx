import { MapPin, Navigation } from "lucide-react";

type ContactMapProps = {
  embedUrl?: string;
  latitude?: number;
  longitude?: number;
  markerTitle?: string;
  addressLines: string[];
  routeUrl?: string;
};

/**
 * Dark/neon map section. Uses the Google Maps embed iframe when configured,
 * otherwise a styled CSS "neon grid" fallback with a glowing marker. Always
 * wrapped in the VisualVibe glow-border frame with an address overlay card.
 */
export function ContactMap({
  embedUrl,
  latitude,
  longitude,
  markerTitle,
  addressLines,
  routeUrl,
}: ContactMapProps) {
  const fallbackRoute =
    routeUrl ||
    (latitude != null && longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLines.join(" "))}`);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 shadow-[0_0_50px_-15px_rgba(245,158,11,0.4)]">
      <div className="relative h-[320px] w-full sm:h-[420px]">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={markerTitle ?? "Kaart"}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <NeonMapFallback markerTitle={markerTitle} />
        )}
      </div>

      {/* Address overlay card */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4 sm:p-6">
        <div className="pointer-events-auto max-w-xs rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur-md">
          {markerTitle && <p className="font-semibold text-white">{markerTitle}</p>}
          {addressLines.map((line, i) => (
            <p key={i} className="text-sm text-white/70">
              {line}
            </p>
          ))}
          <a
            href={fallbackRoute}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-500/40 px-3.5 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/10 hover:text-amber-300"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Bekijk route
          </a>
        </div>
      </div>
    </div>
  );
}

function NeonMapFallback({ markerTitle }: { markerTitle?: string }) {
  return (
    <div
      className="relative h-full w-full bg-neutral-950"
      style={{
        backgroundImage:
          "linear-gradient(rgba(245,158,11,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.12) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(245,158,11,0.22),transparent_60%)]" />
      {/* a couple of faint "roads" */}
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 shadow-[0_0_40px_10px_rgba(245,158,11,0.35)]">
          <MapPin className="h-8 w-8 text-amber-400" strokeWidth={2.2} />
        </span>
        {markerTitle && <span className="mt-2 text-sm font-medium text-white/80">{markerTitle}</span>}
      </div>
    </div>
  );
}
