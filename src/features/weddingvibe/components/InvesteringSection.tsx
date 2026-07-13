import { weddingVibeConfig } from "../config/weddingvibe.config";
import type { WeddingVibePricing } from "../config/imageSlots";

const PRICE_KEYS = ["fotografie", "film", "combo"] as const;

export function InvesteringSection({
  pricing,
  prijzenTonen,
}: {
  pricing: WeddingVibePricing;
  prijzenTonen: boolean;
}) {
  const { investering } = weddingVibeConfig;

  return (
    <section id="investering" className="wv-section bg-white">
      <div className="wv-container">
        <div data-reveal className="mb-[clamp(52px,6vw,76px)] text-center">
          <div className="wv-overline-row wv-overline-row--center !mb-0">
            <span className="wv-hairline wv-hairline--in" aria-hidden="true" />
            <span className="wv-overline">{investering.overline}</span>
            <span className="wv-hairline wv-hairline--out" aria-hidden="true" />
          </div>
        </div>

        <div data-reveal className="flex flex-wrap items-stretch justify-center gap-[clamp(20px,3vw,32px)]">
          {investering.cards.map((card, i) => (
            <div
              key={card.category}
              className={`flex max-w-[380px] flex-[1_1_300px] flex-col p-[clamp(32px,4vw,46px)] px-[clamp(26px,3vw,38px)] ${
                card.highlighted
                  ? "relative border border-[#C29A4B] bg-[#FAF6EE] shadow-[0_24px_56px_rgba(194,154,75,0.18)]"
                  : "border border-[rgba(194,154,75,0.35)]"
              }`}
            >
              {card.highlighted && (
                <div
                  className="absolute left-1/2 top-[-14px] -translate-x-1/2 whitespace-nowrap px-[18px] py-[7px] text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#2A2320]"
                  style={{ background: "linear-gradient(100deg,#D2AC47,#EDDC78 55%,#D2AC47)" }}
                >
                  Meest gekozen
                </div>
              )}
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A08B6E]">
                {card.category}
              </div>
              <h3 className="wv-serif m-0 mb-3 text-[30px] font-medium leading-[1.15]">{card.title}</h3>
              <p className="m-0 mb-[22px] text-[15px] leading-[1.65] text-[#6B5F55]">{card.intro}</p>
              {prijzenTonen ? (
                <div className="flex flex-wrap items-baseline gap-[9px]">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#A08B6E]">Vanaf</span>
                  <span className="wv-serif text-[44px] font-semibold leading-none">
                    {pricing[PRICE_KEYS[i]] ?? card.price}
                  </span>
                  <span className="text-xs text-[#A08B6E]">excl. btw</span>
                </div>
              ) : (
                <div className="wv-serif text-[26px] italic">Prijs op aanvraag</div>
              )}
              <div className="my-6 h-px w-full bg-[rgba(194,154,75,0.3)]" aria-hidden="true" />
              <div className="mb-8 flex flex-col gap-[11px] text-[15px] text-[#4A4038]">
                {card.features.map((feature) => (
                  <div key={feature} className="flex items-baseline gap-2.5">
                    <span className="text-[11px] text-[#C29A4B]" aria-hidden="true">◆</span>
                    {feature}
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                className={`wv-btn mt-auto block !px-5 !py-[15px] !text-[12px] ${card.highlighted ? "wv-btn--gold !py-4" : "wv-btn--outline"}`}
              >
                {card.ctaLabel} →
              </a>
            </div>
          ))}
        </div>

        <div data-reveal className="mx-auto mt-[clamp(44px,5vw,60px)] max-w-[720px] text-center">
          <p className="wv-body mb-3 !text-base">{investering.note1}</p>
          <p className="m-0 mb-[30px] text-[15px] leading-[1.8] text-[#8A7A62]">{investering.note2}</p>
          <a href="#contact" className="wv-btn wv-btn--outline">
            {investering.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
