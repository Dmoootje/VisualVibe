import {
  weddingVibeConfig,
  type WvGalleryItem,
  type WvFeaturedWedding,
} from "../config/weddingvibe.config";
import { WvImage } from "./WvImage";
import { WvOrnament } from "./WvOrnament";

export function PortfolioSection({
  gallery,
  featured,
}: {
  gallery: WvGalleryItem[];
  featured: WvFeaturedWedding[];
}) {
  const { portfolio } = weddingVibeConfig;

  return (
    <section id="werk" className="wv-section bg-[#FAF6EE]">
      <div className="wv-container">
        <div data-reveal className="mx-auto mb-[clamp(48px,6vw,72px)] max-w-[680px] text-center">
          <WvOrnament />
          <h2 className="wv-h2 mb-5 !text-[clamp(34px,4.4vw,54px)] !leading-[1.1]">
            {portfolio.title} <em>{portfolio.accent}</em>
          </h2>
          <p className="wv-body">{portfolio.intro}</p>
        </div>

        {/* Masonry-galerij */}
        <div data-reveal className="gap-[18px] [column-gap:18px] [columns:3_260px]">
          {gallery.map((item) => (
            <div key={item.label} className="mb-[18px] [break-inside:avoid]">
              <div className="overflow-hidden" style={{ aspectRatio: item.ratio }}>
                <WvImage image={item} />
              </div>
              <div className="px-0.5 pb-1 pt-2.5 text-[10.5px] uppercase tracking-[0.22em] text-[#A08B6E]">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Uitgelichte huwelijken */}
        <div data-reveal className="mt-[clamp(48px,6vw,72px)] flex flex-wrap gap-[clamp(20px,3vw,36px)]">
          {featured.map((wedding) => (
            <div
              key={`${wedding.nameA}-${wedding.nameB}`}
              className="flex-[1_1_280px] bg-white p-3.5 pb-[26px] shadow-[0_16px_44px_rgba(42,35,32,0.09)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_56px_rgba(42,35,32,0.14)]"
            >
              <div className="mb-5 overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <WvImage image={wedding.image} />
              </div>
              <div className="text-center">
                <h3 className="wv-serif m-0 mb-2 text-[29px] font-medium">
                  {wedding.nameA} <span className="wv-script text-[26px] text-[#B08A3E]">&amp;</span> {wedding.nameB}
                </h3>
                <p className="m-0 mb-4 text-[15px] leading-relaxed text-[#6B5F55]">{wedding.blurb}</p>
                <a href="#contact" className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#B08A3E]">
                  Bekijk hun verhaal →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-[clamp(40px,5vw,56px)] text-center">
          <a href="#contact" className="wv-btn wv-btn--outline">
            {portfolio.moreCta}
          </a>
        </div>
      </div>
    </section>
  );
}
