import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-6 w-1 rounded-full bg-orange-500" aria-hidden="true" />
      <h2 className="text-xl font-bold text-white sm:text-2xl">{children}</h2>
    </div>
  );
}
