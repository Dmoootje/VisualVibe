import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * An article image with a glow border and optional caption. Uses next/image
 * fill within an aspect-ratio box (default 16/9) for stable layout / no CLS.
 */
export function BlogImage({
  src,
  alt,
  caption,
  aspect = "16/9",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  /** CSS aspect-ratio, e.g. "16/9", "4/3", "1/1". */
  aspect?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("my-8", className)}>
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_40px_-15px_rgba(245,158,11,0.35)]"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 768px"
          className="object-cover"
          priority={priority}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm italic text-white/50">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
