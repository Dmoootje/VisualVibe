import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/types";
import type { SupportedLocale } from "@/i18n/locales";
import { serviceHref } from "@/data/services";

export function ServiceGrid({ services, locale = "nl" }: { services: Service[]; locale?: SupportedLocale }) {
  if (services.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => (
        <Link
          key={service.slug}
          href={serviceHref(service, locale)}
          className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
        >
          <span className="flex items-center justify-between font-semibold group-hover:text-amber-400 transition-colors">
            {service.title}
            <ArrowRight className="h-4 w-4 text-white/50" />
          </span>
          {service.excerpt && <span className="text-sm text-white/70">{service.excerpt}</span>}
        </Link>
      ))}
    </div>
  );
}
