import { weddingVibeConfig, type WvImage as WvImageData } from "../config/weddingvibe.config";
import { WvImage } from "./WvImage";

export function IntroSection({ imageLarge, imageDetail }: { imageLarge: WvImageData; imageDetail: WvImageData }) {
  const { intro } = weddingVibeConfig;

  return (
    <section className="wv-section bg-white">
      <div className="wv-container flex flex-wrap items-center gap-[clamp(40px,6vw,90px)]">
        <div data-reveal className="relative max-w-[520px] flex-[1_1_380px]">
          <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
            <WvImage image={imageLarge} />
          </div>
          <div className="absolute bottom-[-42px] right-[-28px] w-[42%] bg-white p-2.5 shadow-[0_22px_50px_rgba(42,35,32,0.18)]" style={{ aspectRatio: "4/5" }}>
            <div className="h-full w-full overflow-hidden">
              <WvImage image={imageDetail} />
            </div>
          </div>
        </div>
        <div data-reveal className="flex-[1_1_420px]">
          <div className="wv-overline-row">
            <span className="wv-overline">{intro.overline}</span>
            <span className="wv-hairline wv-hairline--out !flex-[0_1_60px]" aria-hidden="true" />
          </div>
          <h2 className="wv-h2 mb-6 !text-[clamp(32px,3.6vw,48px)] !leading-[1.14]">
            {intro.title} <em>{intro.accent}</em>
          </h2>
          {intro.paragraphs.map((paragraph, i) => (
            <p key={i} className={`wv-body ${i === intro.paragraphs.length - 1 ? "mb-[30px]" : "mb-[18px]"}`}>
              {paragraph}
            </p>
          ))}
          <a href="#werk" className="wv-textlink">
            {intro.ctaLabel} <span className="text-base" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
