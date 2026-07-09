import Link from "next/link";
import { listLeads } from "@/lib/firestore/leads";
import { LEAD_STATUSES, type LeadStatus } from "@/types";
import { StatusBadge, STATUS_LABELS } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = LEAD_STATUSES.includes(status as LeadStatus) ? (status as LeadStatus) : undefined;
  const leads = await listLeads(activeStatus);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leads</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterLink status={undefined} active={!activeStatus} />
        {LEAD_STATUSES.map((value) => (
          <FilterLink key={value} status={value} active={activeStatus === value} />
        ))}
      </div>

      {leads.length === 0 ? (
        <p className="text-white/60">Geen leads gevonden.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">Naam</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3 hidden sm:table-cell">Dienst</th>
                <th className="px-4 py-3 hidden md:table-cell">Regio</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden sm:table-cell">Datum</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="font-medium hover:text-amber-400">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white/70">{lead.email}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-white/70">{lead.serviceInterest ?? "-"}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-white/70">{lead.region ?? "-"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-white/50">
                    {new Date(lead.createdAt).toLocaleDateString("nl-BE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilterLink({ status, active }: { status?: LeadStatus; active: boolean }) {
  const href = status ? `/admin/leads?status=${status}` : "/admin/leads";
  const label = status ? STATUS_LABELS[status] : "Alle";

  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-amber-500 bg-amber-500/10 text-amber-400"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );
}
