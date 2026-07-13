import { weddingVibeConfig, type WvImage as WvImageData } from "../config/weddingvibe.config";
import { WvImage } from "./WvImage";

export function WhySection({ image }: { image: WvImageData }) {
  const { why } = weddingVibeConfig;

  return (
    <section id="waarom" className="wv-section bg-[#26201A]">
      <div className="wv-container flex flex-wrap items-center gap-[clamp(40px,6vw,90px)]">
        <div data-reveal className="max-w-[520px] flex-[1_1_380px] overflow-hidden" style={{ aspectRatio: "3/4" }}>
          <WvImage image={image} />
        </div>
        <div data-reveal className="flex-[1_1_460px]">
          <div className="wv-overline-row">
            <span className="wv-overline wv-overline--light">{why.overline}</span>
            <span className="wv-hairline wv-hairline--out !flex-[0_1_60px]" aria-hidden="true" />
          </div>
          <h2 className="wv-h2 mb-5 !text-[clamp(32px,3.8vw,48px)] !leading-[1.14] text-[#F6EFE3]">
            {why.title} <em className="!text-[#EDDC78]">{why.accent}</em>
          </h2>
          <p className="wv-body mb-[42px] !text-[rgba(246,239,227,0.72)]">{why.intro}</p>
          <div className="grid gap-x-10 gap-y-[34px] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {why.points.map((point) => (
              <div key={point.title}>
                <div className="mb-3.5 h-px w-[34px] bg-[#C29A4B]" aria-hidden="true" />
                <h4 className="wv-serif m-0 mb-2.5 text-[23px] font-semibold text-[#F6EFE3]">{point.title}</h4>
                <p className="m-0 text-[15px] leading-[1.7] text-[rgba(246,239,227,0.62)]">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
