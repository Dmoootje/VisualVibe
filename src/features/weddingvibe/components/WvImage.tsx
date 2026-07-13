import type { WvImage as WvImageData } from "../config/weddingvibe.config";

/**
 * Beeld uit Firebase Storage, of een stijlvolle crème-placeholder zolang er
 * nog geen echte foto gekoppeld is (er staan geen beelden in de repo).
 */
export function WvImage({ image, sizes }: { image: WvImageData; sizes?: string }) {
  if (!image.src) {
    return (
      <div className="wv-placeholder" role="img" aria-label={image.alt}>
        <svg width="120" height="14" viewBox="0 0 120 14" fill="none" aria-hidden="true">
          <path d="M2 7 C 20 7, 32 1.5, 46 7" stroke="#C29A4B" strokeWidth="1" />
          <path d="M118 7 C 100 7, 88 12.5, 74 7" stroke="#C29A4B" strokeWidth="1" />
          <path d="M60 1.5 L 65.5 7 L 60 12.5 L 54.5 7 Z" fill="#C29A4B" />
        </svg>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="wv-img" src={image.src} alt={image.alt} loading="lazy" sizes={sizes} />;
}
