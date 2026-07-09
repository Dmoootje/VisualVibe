import { cn } from "@/lib/utils";
import { CARD } from "./styles";
import { GRADIENT_TEXT } from "./styles";

export type Stat = {
  value: string;
  label: string;
  description?: string;
};

const COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/**
 * A row of headline statistics with big amber-gradient numbers - social proof /
 * impact figures inside an article.
 */
export function StatGrid({
  stats,
  columns = 3,
  className,
}: {
  stats: Stat[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div className={cn("my-6 grid gap-4", COLS[columns], className)}>
      {stats.map((stat, i) => (
        <div key={i} className={cn("p-5 text-center", CARD)}>
          <div className={cn("text-3xl font-bold sm:text-4xl", GRADIENT_TEXT)}>
            {stat.value}
          </div>
          <div className="mt-1 font-medium text-white">{stat.label}</div>
          {stat.description && (
            <p className="mt-1 text-xs leading-relaxed text-white/60">{stat.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
