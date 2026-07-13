import { weddingVibeConfig, type WvImage as WvImageData } from "../config/weddingvibe.config";
import { WvImage } from "./WvImage";

export function JensSection({ image }: { image: WvImageData }) {
  const { jens } = weddingVibeConfig;

  return (
    <section id="jens" className="wv-section bg-[#FAF6EE]">
      <div className="wv-container flex flex-wrap items-center gap-[clamp(40px,6vw,90px)]">
        <div data-reveal className="max-w-[500px] flex-[1_1_380px]">
          <div className="rotate-[-1.6deg] bg-white p-4 shadow-[0_24px_60px_rgba(42,35,32,0.15)]">
            <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <WvImage image={image} />
            </div>
          </div>
        </div>
        <div data-reveal className="flex-[1_1_440px]">
          <div className="wv-overline-row">
            <span className="wv-overline">{jens.overline}</span>
            <span className="wv-hairline wv-hairline--out !flex-[0_1_60px]" aria-hidden="true" />
          </div>
          <h2 className="wv-h2 mb-6 !text-[clamp(34px,4vw,50px)] !leading-[1.1]">
            {jens.title} <em>{jens.accent}</em>
          </h2>
          {jens.paragraphs.map((paragraph, i) => (
            <p key={i} className={`wv-body !text-[16.5px] ${i === jens.paragraphs.length - 1 ? "mb-[26px]" : "mb-4"}`}>
              {paragraph}
            </p>
          ))}
          <p className="wv-serif m-0 mb-1.5 text-[20px] italic text-[#4A4038]">{jens.closing}</p>
          <div className="wv-script mb-7 text-[46px] text-[#B08A3E]">{jens.signature}</div>
          <a href="#contact" className="wv-btn wv-btn--outline">
            {jens.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
