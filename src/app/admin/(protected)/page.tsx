import Link from "next/link";
import { listLeads } from "@/lib/firestore/leads";
import { LEAD_STATUSES } from "@/types";
import { STATUS_LABELS } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

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

      <Link href="/admin/leads" className="text-amber-400 hover:underline">
        Bekijk alle leads &rarr;
      </Link>
    </div>
  );
}
