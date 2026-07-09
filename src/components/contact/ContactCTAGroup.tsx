import { ArrowRight, CalendarClock, Zap, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { OpeningHoursCard } from "./OpeningHoursCard";
import type { OpeningHoursDay } from "@/types/siteSettings";

export type ContactCTAGroupProps = {
  openingHours: OpeningHoursDay[];
  appointment: { title: string; text: string; buttonLabel: string; buttonUrl: string };
  urgent: { title: string; text: string; buttonLabel: string; buttonUrl: string };
};

/** The three cards below the map: office hours, appointment, quick contact. */
export function ContactCTAGroup({ openingHours, appointment, urgent }: ContactCTAGroupProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <OpeningHoursCard openingHours={openingHours} />
      <CtaCard
        icon={CalendarClock}
        title={appointment.title}
        text={appointment.text}
        buttonLabel={appointment.buttonLabel}
        buttonUrl={appointment.buttonUrl}
      />
      <CtaCard
        icon={Zap}
        title={urgent.title}
        text={urgent.text}
        buttonLabel={urgent.buttonLabel}
        buttonUrl={urgent.buttonUrl}
      />
    </div>
  );
}

function CtaCard({
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
    <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-400 transition-colors group-hover:text-amber-300">
      {buttonLabel}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </span>
  );

  return (
    <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-amber-500/30">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-white/70">{text}</p>
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
