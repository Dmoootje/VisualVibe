import { cn } from "@/lib/utils";

export type RoadmapStep = {
  title: string;
  description?: React.ReactNode;
  /** Optional label instead of the auto number, e.g. "Fase 1". */
  label?: string;
};

/**
 * A vertical numbered timeline - for step-by-step processes, roadmaps or
 * "hoe werkt het" sections. Uses a connecting gradient line down the nodes.
 */
export function RoadmapBlock({
  steps,
  className,
}: {
  steps: RoadmapStep[];
  className?: string;
}) {
  return (
    <ol className={cn("relative my-6 space-y-6", className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={i} className="relative flex gap-4">
            {!isLast && (
              <span
                className="absolute left-[1.15rem] top-10 bottom-[-1.5rem] w-px bg-gradient-to-b from-amber-500/50 to-white/5"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-red-500 text-sm font-bold text-black">
              {step.label ?? i + 1}
            </span>
            <div className="pt-1">
              <h3 className="font-semibold text-white">{step.title}</h3>
              {step.description && (
                <p className="mt-1 text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
