import type { LucideIcon } from "lucide-react";

/** A single compact contact detail card (address, phone, email, response time, ...). */
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
    <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-neutral-950/70 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_28px_-10px_rgba(255,122,24,0.45)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/25 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold leading-tight text-white">{title}</p>
        <div className="mt-1 text-sm leading-snug text-white/60 [&_a]:text-white/60 [&_a:hover]:text-amber-400">
          {children}
        </div>
      </div>
    </div>
  );
}
