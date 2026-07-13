import { weddingVibeConfig, type WvImage as WvImageData } from "../config/weddingvibe.config";
import { WvImage } from "./WvImage";

/** `images` is index-gelijk aan weddingVibeConfig.services (admin-overrides). */
export function ServicesSection({ images }: { images: WvImageData[] }) {
  const { services } = weddingVibeConfig;

  return (
    <section id="diensten" className="wv-section bg-white !py-[clamp(80px,10vw,150px)]">
      <div className="wv-container flex flex-col gap-[clamp(70px,9vw,120px)]">
        {services.map((service, i) => (
          <div
            key={service.category}
            data-reveal
            className={`flex flex-wrap items-center gap-[clamp(36px,5vw,80px)] ${service.reverse ? "flex-row-reverse" : ""}`}
          >
            <div className="flex-[1_1_420px] overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <WvImage image={images[i] ?? service.image} />
            </div>
            <div className="flex-[1_1_400px]">
              <div className="wv-overline mb-3">{service.category}</div>
              <h3 className="wv-h3 mb-5">
                {service.title} <em>{service.accent}</em>
              </h3>
              <p className="wv-body mb-3.5 !text-[16.5px] !leading-[1.75]">{service.paragraphs[0]}</p>
              <p className="wv-body mb-[22px] !text-[16.5px] !leading-[1.75]">{service.paragraphs[1]}</p>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A08B6E]">
                {service.featuresLabel}
              </div>
              <div className="mb-7 grid gap-x-6 gap-y-[9px] text-[15px] text-[#4A4038] [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-baseline gap-2.5">
                    <span className="text-[11px] text-[#C29A4B]" aria-hidden="true">◆</span>
                    {feature}
                  </div>
                ))}
              </div>
              <a href={service.ctaHref} className="wv-textlink !text-[12px]">
                {service.ctaLabel} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
