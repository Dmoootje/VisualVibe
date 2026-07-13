import { Link } from "@/i18n/navigation";
import { weddingVibeConfig } from "../config/weddingvibe.config";

export function WeddingFooter() {
  const { footer, settings } = weddingVibeConfig;

  return (
    <footer className="bg-[#221C16] px-[clamp(20px,5vw,64px)] pb-9 pt-[clamp(60px,8vw,90px)]">
      <div className="wv-container">
        <div className="grid gap-x-[clamp(28px,4vw,56px)] gap-y-11 border-b border-[rgba(246,239,227,0.14)] pb-[clamp(44px,5vw,60px)] [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/weddingvibe-logo-licht.svg" alt="WeddingVibe" className="mb-5 block h-[26px] w-auto" />
            <p className="m-0 text-[14.5px] leading-[1.75] text-[rgba(246,239,227,0.6)]">{footer.tagline}</p>
          </div>
          <div>
            <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C29A4B]">Navigatie</div>
            <div className="flex flex-col gap-2.5 text-[14.5px]">
              {footer.nav.map((link) => (
                <a key={link.label} href={link.href} className="!text-[rgba(246,239,227,0.75)] transition-colors hover:!text-[#EDDC78]">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C29A4B]">Diensten</div>
            <div className="flex flex-col gap-2.5 text-[14.5px]">
              {footer.diensten.map((link) => (
                <a key={link.label} href={link.href} className="!text-[rgba(246,239,227,0.75)] transition-colors hover:!text-[#EDDC78]">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C29A4B]">Contact</div>
            <div className="flex flex-col gap-2.5 text-[14.5px] text-[rgba(246,239,227,0.75)]">
              {footer.regios.map((regio) => (
                <span key={regio}>{regio}</span>
              ))}
              <a href={settings.telefoonHref} className="!text-[rgba(246,239,227,0.75)] transition-colors hover:!text-[#EDDC78]">
                {settings.telefoon}
              </a>
              <a href={`mailto:${settings.contactEmail}`} className="!text-[rgba(246,239,227,0.75)] transition-colors hover:!text-[#EDDC78]">
                {settings.contactEmail}
              </a>
              <span className="wv-serif italic !text-[#C29A4B]">{footer.wereldwijd}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3.5 pt-[26px] text-[12.5px] text-[rgba(246,239,227,0.45)]">
          <span>{footer.copyright}</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="!text-[rgba(246,239,227,0.45)] transition-colors hover:!text-[#EDDC78]">
              Privacybeleid
            </Link>
            <Link href="/cookies" className="!text-[rgba(246,239,227,0.45)] transition-colors hover:!text-[#EDDC78]">
              Cookiebeleid
            </Link>
            <Link href="/" className="!text-[rgba(246,239,227,0.45)] transition-colors hover:!text-[#EDDC78]">
              VisualVibe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
