// The quadcopter drawing (from the handoff `#quad` symbol), authored in a
// ~120x104 coordinate space. Rendered as raw SVG children so callers place it
// inside their own <svg>/<g> (avoids <defs>/<use> id collisions between the
// hero drone and the cursor drone). Rotors carry `dr-rotor` so they spin.
export function Quad() {
  return (
    <>
      <ellipse cx="60" cy="98" rx="46" ry="7" fill="rgba(0,0,0,.35)" />
      <line x1="60" y1="52" x2="22" y2="30" stroke="#3a3a40" strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="52" x2="98" y2="30" stroke="#3a3a40" strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="56" x2="24" y2="74" stroke="#2c2c30" strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="56" x2="96" y2="74" stroke="#2c2c30" strokeWidth="5" strokeLinecap="round" />
      <g className="dr-rotor"><circle cx="22" cy="30" r="17" fill="rgba(255,122,0,.08)" /><rect x="6" y="28" width="32" height="4" rx="2" fill="rgba(255,180,120,.55)" /></g>
      <g className="dr-rotor b"><circle cx="98" cy="30" r="17" fill="rgba(255,122,0,.08)" /><rect x="82" y="28" width="32" height="4" rx="2" fill="rgba(255,180,120,.55)" /></g>
      <g className="dr-rotor b"><circle cx="24" cy="74" r="17" fill="rgba(255,122,0,.08)" /><rect x="8" y="72" width="32" height="4" rx="2" fill="rgba(255,180,120,.55)" /></g>
      <g className="dr-rotor"><circle cx="96" cy="74" r="17" fill="rgba(255,122,0,.08)" /><rect x="80" y="72" width="32" height="4" rx="2" fill="rgba(255,180,120,.55)" /></g>
      <circle cx="22" cy="30" r="5" fill="#18181c" stroke="#4a4a50" strokeWidth="1.5" />
      <circle cx="98" cy="30" r="5" fill="#18181c" stroke="#4a4a50" strokeWidth="1.5" />
      <circle cx="24" cy="74" r="5" fill="#18181c" stroke="#4a4a50" strokeWidth="1.5" />
      <circle cx="96" cy="74" r="5" fill="#18181c" stroke="#4a4a50" strokeWidth="1.5" />
      <rect x="44" y="42" width="32" height="24" rx="8" fill="#232329" stroke="#4a4a52" strokeWidth="1.5" />
      <circle cx="26" cy="30" r="2" fill="#FF3B2E" />
      <circle cx="94" cy="30" r="2" fill="#FF3B2E" />
      <path d="M52 66 q8 8 16 0" fill="none" stroke="#3a3a42" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="70" r="7" fill="#0e0e12" stroke="#5a5a62" strokeWidth="2" />
      <circle cx="60" cy="70" r="3" fill="#FF7A00" />
    </>
  );
}
