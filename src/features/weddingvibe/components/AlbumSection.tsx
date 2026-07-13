import { weddingVibeConfig, type WvImage as WvImageData } from "../config/weddingvibe.config";
import { WvImage } from "./WvImage";

export function AlbumSection({ image1, image2 }: { image1: WvImageData; image2: WvImageData }) {
  const { album } = weddingVibeConfig;

  return (
    <section className="wv-section bg-[#FAF6EE] !py-[clamp(80px,10vw,130px)]">
      <div className="wv-container flex flex-wrap items-center gap-[clamp(40px,6vw,90px)]">
        <div data-reveal className="flex-[1_1_400px]">
          <h2 className="wv-h2 mb-[22px] !text-[clamp(32px,3.8vw,46px)] !leading-[1.14]">
            {album.title} <em>{album.accent}</em>
          </h2>
          <p className="wv-body mb-4">{album.paragraphs[0]}</p>
          <p className="wv-body mb-[30px]">{album.paragraphs[1]}</p>
          <a href="#contact" className="wv-btn wv-btn--outline">
            {album.cta}
          </a>
        </div>
        <div data-reveal className="relative min-h-[420px] flex-[1_1_420px]">
          <div className="absolute left-0 top-0 w-[72%] overflow-hidden shadow-[0_22px_54px_rgba(42,35,32,0.16)]" style={{ aspectRatio: "4/3" }}>
            <WvImage image={image1} />
          </div>
          <div className="absolute bottom-0 right-0 w-[46%] bg-white p-2.5 shadow-[0_22px_54px_rgba(42,35,32,0.2)]" style={{ aspectRatio: "3/4" }}>
            <div className="h-full w-full overflow-hidden">
              <WvImage image={image2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
