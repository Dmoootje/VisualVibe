import { cn } from "@/lib/utils";
import "./blog-prose.css";

/**
 * Wraps standard article body markup (from MDX or react-markdown) in the
 * scoped `.blog-prose` styling - the h1…hr treatment defined in the
 * co-located blog-prose.css (imported above; kept out of globals.css so it
 * only ships on kennisbank article routes).
 * Use this instead of the raw Tailwind `prose` classes so every article body
 * shares one source of truth.
 */
export function BlogProse({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("blog-prose", className)}>{children}</div>;
}
