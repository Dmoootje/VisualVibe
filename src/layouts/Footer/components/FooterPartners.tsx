import { PARTNER_LOGOS } from "./partnerLogos";
import type { FooterPartner } from "../config/footer.config";

/** Partner / certification row: label block + logo chips (inlined SVG, unified
 * to white by the .vv-partner filter). */
export function FooterPartners({
  title,
  subtitle,
  partners,
}: {
  title: string;
  subtitle: string;
  partners: FooterPartner[];
}) {
  if (partners.length === 0) return null;

  return (
    <div className="mt-14 flex flex-col items-start justify-between gap-6 border-y border-white/[0.08] py-7 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff7500]">{title}</span>
        <span className="text-[13px] text-white/45">{subtitle}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3.5">
        {partners.map((p) => {
          const html = PARTNER_LOGOS[p.logo];
          if (!html) return null;
          const chip = (
            <div className="vv-pchip flex h-16 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.02] px-6">
              <span className="vv-partner" aria-label={p.alt} dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          );
          return p.href ? (
            <a key={p.alt} href={p.href} target="_blank" rel="noopener noreferrer">
              {chip}
            </a>
          ) : (
            <div key={p.alt}>{chip}</div>
          );
        })}
      </div>
    </div>
  );
}
