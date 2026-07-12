import { MapPin, Navigation } from "lucide-react";
import { resolveMapEmbedUrl } from "@/lib/maps/embedUrl";

type ContactMapProps = {
  embedUrl?: string;
  latitude?: number;
  longitude?: number;
  markerTitle?: string;
  addressLines: string[];
  routeUrl?: string;
};

/**
 * Dark/neon map section, near full container width. Uses the Google Maps embed
 * iframe when configured, otherwise a designed neon road-network fallback (never
 * an empty grid or a visible load error). A glass route-card overlays the map.
 */
export function ContactMap({
  embedUrl,
  latitude,
  longitude,
  markerTitle,
  addressLines,
  routeUrl,
}: ContactMapProps) {
  // Only iframe a genuinely embeddable Google Maps URL; a bad/relative value
  // would otherwise render this app's own 404 inside the map.
  const safeEmbedUrl = resolveMapEmbedUrl(embedUrl);

  const fallbackRoute =
    routeUrl ||
    (latitude != null && longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLines.join(" "))}`);

  return (
    <div className="relative overflow-hidden rounded-[18px] border border-[rgba(255,117,0,0.22)] shadow-[0_0_60px_-18px_rgba(255,117,0,0.4)]">
      {/* Mobiel extra hoog: de route-kaart overlapt onderaan, zo blijft de kaart
          zelf zichtbaar boven de overlay. */}
      <div className="relative h-[440px] w-full sm:h-[320px] lg:h-[340px]">
        {safeEmbedUrl ? (
          <iframe
            src={safeEmbedUrl}
            title={markerTitle ?? "Kaart"}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <NeonMap markerTitle={markerTitle} />
        )}

        {/* Route overlay card */}
        <div className="absolute bottom-4 right-4 z-10 w-[min(18rem,calc(100%-2rem))] rounded-xl border border-[rgba(255,117,0,0.3)] bg-black/70 p-4 backdrop-blur-md sm:bottom-6 sm:right-6">
          {markerTitle && <p className="font-semibold text-white">{markerTitle}</p>}
          {addressLines.map((line, i) => (
            <p key={i} className="text-sm text-white/65">
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

/** Designed dark map fallback: perspective ground grid + glowing arterials + markers. */
function NeonMap({ markerTitle }: { markerTitle?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0705]" aria-hidden="true">
      {/* Perspective ground grid */}
      <div className="absolute inset-x-[-20%] bottom-[-10%] top-[28%] [perspective:520px]">
        <div
          className="absolute inset-0 origin-bottom [transform:rotateX(62deg)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,117,0,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,117,0,0.16) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            maskImage: "linear-gradient(to top, black 15%, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to top, black 15%, transparent 85%)",
          }}
        />
      </div>

      {/* Center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_56%,rgba(255,117,0,0.22),transparent_58%)]" />

      {/* Glowing arterials */}
      <svg
        viewBox="0 0 1200 380"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="vvRoad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff7a18" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#ffab54" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ff7a18" stopOpacity="0.1" />
          </linearGradient>
          <filter id="vvGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          stroke="url(#vvRoad)"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          filter="url(#vvGlow)"
        >
          <path d="M-20,296 C250,272 384,156 650,178 S1040,122 1230,96" />
          <path d="M-20,128 C205,152 430,250 700,254 S1050,300 1230,326" />
          <path d="M212,-20 C232,120 300,232 360,400" />
          <path d="M772,-20 C744,130 826,250 770,400" />
          <path d="M980,-20 C960,150 1032,270 1092,400" />
          <path d="M60,-20 C90,120 40,250 150,400" opacity="0.5" />
        </g>

        <g fill="#ffc487" filter="url(#vvGlow)">
          <circle cx="360" cy="196" r="3.5" />
          <circle cx="650" cy="178" r="3" />
          <circle cx="770" cy="250" r="3.5" />
          <circle cx="700" cy="254" r="3" />
          <circle cx="980" cy="210" r="2.5" />
          <circle cx="230" cy="150" r="2.5" />
          <circle cx="1050" cy="300" r="2.5" />
        </g>
      </svg>

      {/* Markers */}
      <Marker className="left-[22%] top-[38%]" size="sm" />
      <Marker className="left-[78%] top-[42%]" size="sm" />
      <Marker className="left-1/2 top-[55%] -translate-x-1/2" size="lg" label={markerTitle} />
    </div>
  );
}

function Marker({
  className,
  size,
  label,
}: {
  className: string;
  size: "sm" | "lg";
  label?: string;
}) {
  const big = size === "lg";
  return (
    <div className={`absolute flex flex-col items-center ${className}`}>
      <span
        className={`relative flex items-center justify-center rounded-full ${
          big
            ? "h-12 w-12 bg-amber-500/25 shadow-[0_0_45px_12px_rgba(255,117,0,0.4)]"
            : "h-8 w-8 bg-amber-500/15 shadow-[0_0_22px_6px_rgba(255,117,0,0.25)]"
        }`}
      >
        <MapPin
          className={big ? "h-7 w-7 text-amber-400" : "h-4 w-4 text-amber-400/80"}
          strokeWidth={2.2}
        />
      </span>
      {big && label && <span className="mt-1.5 text-sm font-medium text-white/85">{label}</span>}
    </div>
  );
}
