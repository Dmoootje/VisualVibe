import { cn } from "@/lib/utils";
import { EYEBROW } from "./styles";

/**
 * A titled article section. The `id` is the anchor the TOC / scrollspy links to,
 * so give every major section a stable id. Renders an optional eyebrow + h2 with
 * the VisualVibe gradient underline, then its children.
 */
export function ContentSection({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-28", className)}
      aria-labelledby={id && title ? `${id}-title` : undefined}
    >
      {eyebrow && <span className={cn(EYEBROW, "mb-4")}>{eyebrow}</span>}
      {title && (
        <h2
          id={id ? `${id}-title` : undefined}
          className="relative mb-5 inline-block pb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          {title}
          <span className="absolute bottom-0 left-0 h-0.5 w-12 rounded-full bg-gradient-to-r from-amber-400 to-red-500" />
        </h2>
      )}
      <div className="text-white/75">{children}</div>
    </section>
  );
}
