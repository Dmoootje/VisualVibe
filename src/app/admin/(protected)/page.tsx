import Link from "next/link";
import { ArrowRight, Users, Settings, Palette, Globe, type LucideIcon } from "lucide-react";
import { listLeads } from "@/lib/firestore/leads";
import { LEAD_STATUSES } from "@/types";
import { STATUS_LABELS } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

const modules: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/admin/leads", label: "Leads", description: "Beheer en volg alle aanvragen op.", icon: Users },
  { href: "/admin/settings", label: "Instellingen", description: "Site- en accountinstellingen.", icon: Settings },
  { href: "/internal/blog-styleguide", label: "Branding", description: "Styleguide en herbruikbare blogblokken.", icon: Palette },
  { href: "/", label: "Naar de site", description: "Ga naar de publieke website.", icon: Globe },
];

export default async function AdminDashboardPage() {
  const leads = await listLeads();
  const counts = LEAD_STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = leads.filter((lead) => lead.status === status).length;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="text-2xl font-bold">{leads.length}</div>
          <div className="text-sm text-white/60">Totaal leads</div>
        </div>
        {LEAD_STATUSES.map((status) => (
          <div key={status} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="text-2xl font-bold">{counts[status]}</div>
            <div className="text-sm text-white/60">{STATUS_LABELS[status]}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Modules</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.href}
              href={module.href}
              className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-amber-500/40 hover:bg-white/[0.07]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold text-white">
                  {module.label}
                  <ArrowRight className="h-4 w-4 text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 block text-sm text-white/60">{module.description}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
