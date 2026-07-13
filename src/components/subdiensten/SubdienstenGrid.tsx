import { Link } from "@/i18n/navigation";
import { SvcIcon } from "./icons";
import "./subdiensten-grid.css";

export type Subdienst = { id: string; name: string; desc: string; href: string };

// Row-balancing rule from the handoff: max 3 per row, never a lonely card.
// 2->[2], 3->[3], 4->[2,2], 5->[3,2], 6->[3,3], 7->[2,3,2], larger falls back
// to rows of 3 ending on 2,2 when a single card would be left over.
function rowSizes(n: number): number[] {
  const map: Record<number, number[]> = { 1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3], 7: [2, 3, 2] };
  if (map[n]) return map[n];
  const rows: number[] = [];
  let r = n;
  while (r > 0) {
    if (r === 4) {
      rows.push(2, 2);
      r = 0;
    } else if (r <= 3) {
      rows.push(r);
      r = 0;
    } else {
      rows.push(3);
      r -= 3;
    }
  }
  return rows;
}

function toRows<T>(items: T[]): T[][] {
  const sizes = rowSizes(items.length);
  const rows: T[][] = [];
  let i = 0;
  for (const s of sizes) {
    rows.push(items.slice(i, i + s));
    i += s;
  }
  return rows;
}

/**
 * The "ghost-glyph watermark" Subdiensten card grid (design handoff). Each card
 * carries its line-icon twice (a crisp chip + a large faint watermark), lights
 * up on hover with a spinning 1px conic-gradient border, a warm halo and a lift.
 * Presentational + server-safe: all interaction is pure CSS (see globals.css).
 */
export function SubdienstenGrid({ services }: { services: Subdienst[] }) {
  if (services.length === 0) return null;

  return (
    <div className="vvsub-rows">
      {toRows(services).map((row, ri) => (
        <div className="vvsub-row" key={ri}>
          {row.map((s) => (
            <Link href={s.href} key={s.id} className="vvsub-card">
              <SvcIcon id={s.id} className="vvsub-wm" size={150} strokeWidth={1} aria-hidden="true" />
              <div className="vvsub-inner">
                <span className="vvsub-chip">
                  <SvcIcon id={s.id} />
                </span>
                <div className="vvsub-text">
                  <div className="vvsub-name">{s.name}</div>
                  <div className="vvsub-desc">{s.desc}</div>
                </div>
                <span className="vvsub-arr">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
