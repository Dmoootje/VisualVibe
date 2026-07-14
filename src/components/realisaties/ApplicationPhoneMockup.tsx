import Image from "next/image";

/**
 * Floating iPhone-style mockup that shows the mobile version of an application
 * case on top of its desktop cover. The frame is pure CSS (no image asset in
 * the repo): dark bezel, a dynamic-island pill and a soft drop shadow so it
 * reads as hovering above the card. Decorative and click-through, so it never
 * intercepts the surrounding card link. Sizing and placement come from
 * `className` (the caller scales it against the cover it overlaps).
 */
export function ApplicationPhoneMockup({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden rounded-[1.45rem] border border-white/25 bg-[#0a0a0c] p-[3px] shadow-[0_24px_50px_-14px_rgba(0,0,0,0.9)] ring-1 ring-black/50 ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] bg-black">
        <Image src={src} alt={alt} fill sizes="220px" className="object-cover object-top" />
        {/* Dynamic island */}
        <span className="absolute left-1/2 top-2 h-[6px] w-9 -translate-x-1/2 rounded-full bg-black/85" />
      </div>
    </div>
  );
}
