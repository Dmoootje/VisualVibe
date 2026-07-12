/**
 * The landing hero's "doelgroep" target: a concentric bullseye with a rotating
 * radar sweep, expanding ping rings and eight audience nodes on spokes with
 * inward-flowing dashed arrows. Pure SVG + CSS (see the kb-* classes in
 * globals.css); a dimmed, decorative background element hidden below lg.
 */

const SPOKES = [
  { d: "0s", x1: 375, y1: 200, x2: 270, y2: 200 },
  { d: ".13s", x1: 288.4, y1: 288.4, x2: 249.5, y2: 249.5 },
  { d: ".26s", x1: 200, y1: 365, x2: 200, y2: 270 },
  { d: ".39s", x1: 125.8, y1: 274.2, x2: 150.5, y2: 249.5 },
  { d: ".52s", x1: 20, y1: 200, x2: 130, y2: 200 },
  { d: ".65s", x1: 97.5, y1: 97.5, x2: 150.5, y2: 150.5 },
  { d: ".78s", x1: 200, y1: 45, x2: 200, y2: 130 },
  { d: ".91s", x1: 281.3, y1: 118.7, x2: 249.5, y2: 150.5 },
];

const NODES = [
  { d: "0s", x: 395, y: 200 },
  { d: ".35s", x: 302.5, y: 302.5 },
  { d: ".7s", x: 200, y: 385 },
  { d: "1.05s", x: 111.6, y: 288.4 },
  { d: "1.4s", x: 2, y: 200 },
  { d: "1.75s", x: 83.3, y: 83.3 },
  { d: "2.1s", x: 200, y: 25 },
  { d: "2.45s", x: 295.5, y: 104.5 },
];

export function TargetGraphic() {
  return (
    <div className="pointer-events-none relative mx-auto hidden aspect-square w-full max-w-[520px] opacity-40 lg:block">
      <div className="kb-sweep" />
      <div className="kb-glow-orb" />
      <div className="kb-ping" />
      <div className="kb-ping kb-ping-2" />
      <svg viewBox="0 0 400 400" className="relative z-[2] h-full w-full overflow-visible">
        <defs>
          <radialGradient id="kbTgtCore" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#FFC48A" />
            <stop offset="52%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FF3B2E" />
          </radialGradient>
          <marker id="kbTgtHead" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto">
            <path d="M1 1 L8 4.5 L1 8 Z" fill="#FF9A45" />
          </marker>
        </defs>
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,122,0,.14)" strokeWidth="1" strokeDasharray="2 9" />
        <g fill="none" stroke="#FF7A00" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 10">
          {SPOKES.map((s, i) => (
            <line
              key={i}
              className="kb-spoke"
              style={{ ["--d" as string]: s.d }}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              markerEnd="url(#kbTgtHead)"
            />
          ))}
        </g>
        <g>
          {NODES.map((n, i) => (
            <g key={i} className="kb-node" style={{ ["--d" as string]: n.d }} transform={`translate(${n.x} ${n.y})`}>
              <circle r="15" fill="rgba(18,17,16,.92)" stroke="rgba(255,122,0,.55)" strokeWidth="1.5" />
              <g stroke="#FF9A45" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="0" cy="-3.6" r="3.3" />
                <path d="M-6 8c0-4 3.1-6 6-6s6 2 6 6" />
              </g>
            </g>
          ))}
        </g>
        <g>
          <circle cx="200" cy="200" r="58" fill="none" stroke="rgba(255,122,0,.3)" strokeWidth="2" />
          <circle cx="200" cy="200" r="42" fill="none" stroke="rgba(255,122,0,.5)" strokeWidth="3" />
          <circle cx="200" cy="200" r="26" fill="url(#kbTgtCore)" opacity=".18" />
          <circle cx="200" cy="200" r="26" fill="none" stroke="#FF7A00" strokeWidth="3" />
          <circle className="kb-dot" cx="200" cy="200" r="12" fill="url(#kbTgtCore)" />
        </g>
      </svg>
    </div>
  );
}
