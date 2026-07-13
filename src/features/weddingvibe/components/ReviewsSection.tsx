import { weddingVibeConfig } from "../config/weddingvibe.config";
import { WvImage } from "./WvImage";
import { WvOrnament } from "./WvOrnament";

/**
 * Ervaringen van koppels. Uitsluitend echte reviews (handoff-eis: niets
 * verzinnen); zolang er geen zijn, wordt de hele sectie niet gerenderd.
 */
export function ReviewsSection() {
  const { reviews } = weddingVibeConfig;
  if (reviews.items.length === 0) return null;

  return (
    <section id="reviews" className="wv-section bg-white">
      <div className="wv-container">
        <div data-reveal className="mx-auto mb-[clamp(48px,6vw,68px)] max-w-[640px] text-center">
          <WvOrnament />
          <h2 className="wv-h2 !text-[clamp(32px,4.2vw,50px)]">
            {reviews.title} <em>{reviews.accent}</em>
          </h2>
        </div>
        <div data-reveal className="flex flex-wrap gap-[clamp(20px,3vw,32px)]">
          {reviews.items.map((review) => (
            <div
              key={`${review.nameA}-${review.nameB}`}
              className="flex flex-[1_1_300px] flex-col gap-[18px] border border-[rgba(194,154,75,0.28)] px-[34px] py-[38px]"
            >
              <div className="wv-serif text-[64px] leading-[0.5] text-[rgba(194,154,75,0.55)]" aria-hidden="true">
                &ldquo;
              </div>
              <p className="wv-serif m-0 text-[19px] italic leading-[1.6] text-[#8A7A62]">{review.quote}</p>
              <div className="mt-auto flex items-center gap-3.5">
                <div className="h-14 w-14 flex-none overflow-hidden rounded-full">
                  <WvImage image={review.image} />
                </div>
                <div>
                  <div className="wv-serif text-[19px] font-semibold">
                    {review.nameA} <span className="wv-script text-[17px] text-[#B08A3E]">&amp;</span> {review.nameB}
                  </div>
                  <div className="mt-[3px] text-xs uppercase tracking-[0.14em] text-[#A08B6E]">{review.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
