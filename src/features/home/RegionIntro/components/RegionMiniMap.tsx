import { MAP_VIEWBOX, countryProvinces, regionMaps } from "../config/regionMaps";
import { RegionMarker } from "./RegionMarker";

/**
 * Mini-map visual for a region card: a faint graticule grid, the country's
 * province silhouettes, the active region's province(s) highlighted in orange
 * with a glow, and a pulsing marker. Reproduces the provided real-map SVGs.
 */
export function RegionMiniMap({ slug }: { slug: string }) {
  const geo = regionMaps[slug];
  if (!geo) return null;

  const provinces = countryProvinces[geo.country];
  const gridId = `region-grid-${slug}`;
  const glowId = `region-glow-${slug}`;
  const fillId = `region-fill-${slug}`;

  return (
    <svg
      viewBox={MAP_VIEWBOX}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <pattern id={gridId} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10,0 L0,0 L0,10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        </pattern>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8a2a" />
          <stop offset="100%" stopColor="#ff5a00" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Graticule grid */}
      <rect x="0" y="0" width="120" height="100" fill={`url(#${gridId})`} />

      {/* Province silhouettes */}
      {provinces.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      ))}

      {/* Active region highlight(s) (glow a touch stronger on hover) */}
      {geo.highlightIndices.map((i) => (
        <path
          key={`h-${i}`}
          d={provinces[i]}
          fill={`url(#${fillId})`}
          filter={`url(#${glowId})`}
          stroke="rgba(255,175,95,0.95)"
          strokeWidth="0.7"
          strokeLinejoin="round"
          className="opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />
      ))}

      <RegionMarker x={geo.marker.x} y={geo.marker.y} />
    </svg>
  );
}
