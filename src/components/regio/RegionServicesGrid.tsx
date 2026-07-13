import { Link } from "@/i18n/navigation";
import type { Service } from "@/types";
import { serviceHref } from "@/data/services";
import { SvcIcon } from "@/components/subdiensten/icons";
import "./region-services-grid.css";

/**
 * Dienstenkaarten voor de regio-pagina als 12-koloms bento (design_handoff_
 * regio_vlaanderen). Kaarten wisselen af tussen 7/5-spans, de grote kaarten
 * krijgen een oranje accent. Elke kaart heeft een icoon-chip + nummer, titel,
 * omschrijving, tag-pills en een pijl, plus een grote vage ghost-glyph
 * watermark. Alle interactie is pure CSS (zie .rbento-* in globals.css), dus
 * server-safe. Onder 860px stapelen de kaarten full-width.
 */

// Spans wisselen per paar af (7/5 dan 5/7); een losse laatste kaart span 12.
function bentoSpans(n: number): number[] {
  const spans: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i === n - 1 && n % 2 === 1) {
      spans.push(12);
      continue;
    }
    const pair = Math.floor(i / 2);
    const firstInPair = i % 2 === 0;
    const big = pair % 2 === 0 ? firstInPair : !firstInPair;
    spans.push(big ? 7 : 5);
  }
  return spans;
}

export function RegionServicesGrid({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  const spans = bentoSpans(services.length);

  return (
    <div className="rbento-grid">
      {services.map((service, i) => {
        const span = spans[i];
        const accent = span >= 7;
        const tags = service.benefits.slice(0, accent ? 3 : 2);
        const num = String(i + 1).padStart(2, "0");

        return (
          <Link
            key={service.slug}
            href={serviceHref(service)}
            className={`rbento-card${accent ? " is-accent" : ""}`}
            style={{ gridColumn: `span ${span}` }}
          >
            <SvcIcon
              id={service.category}
              size={accent ? 156 : 144}
              strokeWidth={1}
              className="rbento-wm"
              aria-hidden="true"
            />

            <div className="rbento-top">
              <span className="rbento-chip">
                <SvcIcon id={service.category} size={27} />
              </span>
              <span className="rbento-num">{num}</span>
            </div>

            <h3 className="rbento-title">{service.title}</h3>
            <p className="rbento-desc">{service.excerpt}</p>

            <div className="rbento-foot">
              <div className="rbento-tags">
                {tags.map((tag) => (
                  <span key={tag} className="rbento-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="rbento-arr">
                <svg
                  width="17"
                  height="17"
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
        );
      })}
    </div>
  );
}
