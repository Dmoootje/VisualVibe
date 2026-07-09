import { ArrowRight, CalendarClock, Zap, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { OpeningHoursCard } from "./OpeningHoursCard";
import type { OpeningHoursDay } from "@/types/siteSettings";

export type ContactCTAGroupProps = {
  openingHours: OpeningHoursDay[];
  appointment: { title: string; text: string; buttonLabel: string; buttonUrl: string };
  urgent: { title: string; text: string; buttonLabel: string; buttonUrl: string };
};

/** One wide glass card with three divided columns: office hours, appointment, quick contact. */
export function ContactCTAGroup({ openingHours, appointment, urgent }: ContactCTAGroupProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(255,117,0,0.18)] bg-neutral-950/80 shadow-[0_0_45px_-18px_rgba(255,117,0,0.35)] backdrop-blur-sm">
      <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="p-6">
          <OpeningHoursCard openingHours={openingHours} />
        </div>
        <CtaColumn
          icon={CalendarClock}
          title={appointment.title}
          text={appointment.text}
          buttonLabel={appointment.buttonLabel}
          buttonUrl={appointment.buttonUrl}
        />
        <CtaColumn
          icon={Zap}
          title={urgent.title}
          text={urgent.text}
          buttonLabel={urgent.buttonLabel}
          buttonUrl={urgent.buttonUrl}
        />
      </div>
    </div>
  );
}

function CtaColumn({
  icon: Icon,
  title,
  text,
  buttonLabel,
  buttonUrl,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  buttonLabel: string;
  buttonUrl: string;
}) {
  const isExternal = /^(https?:|tel:|mailto:)/.test(buttonUrl);

  const label = (
    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-400 transition-colors group-hover:text-amber-300">
      {buttonLabel}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </span>
  );

  return (
    <div className="group flex flex-col p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/25 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-white/60">{text}</p>
      {buttonUrl &&
        (isExternal ? (
          <a href={buttonUrl} target={buttonUrl.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          <Link href={buttonUrl}>{label}</Link>
        ))}
    </div>
  );
}
