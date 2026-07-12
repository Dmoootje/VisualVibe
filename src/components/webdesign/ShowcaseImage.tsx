import Image from "next/image";

/**
 * Renders a stored image via next/image (fill, object-cover by default) or an
 * empty placeholder when unset. The parent must be positioned (relative or
 * absolute) with a fixed aspect/height. Pass a per-call-site `sizes` hint so
 * the optimizer serves the right width; `eager` maps to next/image `priority`
 * for above-the-fold usage.
 */
export function ShowcaseImage({
  src,
  alt,
  placeholder = "Geen afbeelding",
  className,
  sizes = "100vw",
  eager = false,
}: {
  src?: string;
  alt: string;
  placeholder?: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={eager}
        className={className ?? "object-cover"}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#141210] text-center text-[11px] text-white/35">
      {placeholder}
    </div>
  );
}
