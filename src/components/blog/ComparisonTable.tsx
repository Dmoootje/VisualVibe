import { cn } from "@/lib/utils";

/**
 * A styled comparison / data table. Kept as a component (rather than raw
 * markdown) so wide tables scroll cleanly on mobile inside their own container.
 */
export function ComparisonTable({
  headers,
  rows,
  caption,
  highlightFirstColumn = false,
  className,
}: {
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  caption?: React.ReactNode;
  /** Emphasise the first column (row labels). */
  highlightFirstColumn?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gradient-to-r from-[#ff7500]/[0.18] to-red-500/[0.12]">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="whitespace-nowrap px-4 py-3 font-semibold text-white">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className="transition-colors hover:bg-white/[0.02]">
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={cn(
                      "border-t border-white/[0.07] px-4 py-3 align-top",
                      highlightFirstColumn && c === 0
                        ? "font-medium text-white"
                        : "text-white/75"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm italic text-white/50">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
