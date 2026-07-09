/**
 * Glowing map marker with a soft pulsing ring, rendered inside the mini-map SVG
 * so it stays pixel-aligned with the highlighted region. Pure-CSS animation
 * (see .region-marker-pulse in globals.css); it also intensifies on card hover.
 */
export function RegionMarker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="region-marker">
      {/* Pulsing ring */}
      <circle
        r={6}
        className="region-marker-pulse"
        fill="none"
        stroke="#ff7500"
        strokeWidth={1.2}
      />
      {/* Soft halo (grows a touch on hover) */}
      <circle
        r={5}
        fill="#ff7500"
        className="opacity-20 transition-all duration-300 group-hover:opacity-35"
      />
      {/* Core dot */}
      <circle r={2.6} fill="#ff7500" className="region-marker-core" />
      <circle r={1} fill="#fff6ee" />
    </g>
  );
}
