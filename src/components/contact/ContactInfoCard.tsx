import type { LucideIcon } from "lucide-react";

/** A single contact detail card (address, phone, email, response time, ...). */
export function ContactInfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors hover:border-amber-500/30">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-white">{title}</p>
        <div className="mt-0.5 text-sm leading-relaxed text-white/70 [&_a]:text-white/70 [&_a:hover]:text-amber-400">
          {children}
        </div>
      </div>
    </div>
  );
}
