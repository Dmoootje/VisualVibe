/** Renders a stored image (object-cover) or an empty placeholder when unset. */
export function ShowcaseImage({
  src,
  alt,
  placeholder = "Geen afbeelding",
  className,
  eager = false,
}: {
  src?: string;
  alt: string;
  placeholder?: string;
  className?: string;
  eager?: boolean;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className={className ?? "h-full w-full object-cover"}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#141210] text-center text-[11px] text-white/35">
      {placeholder}
    </div>
  );
}
