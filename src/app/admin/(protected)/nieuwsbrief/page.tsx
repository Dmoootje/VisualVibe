import { listSubscribers } from "@/lib/firestore/newsletter";
import { ExportSubscribersButton } from "@/components/admin/ExportSubscribersButton";

export const dynamic = "force-dynamic";

export default async function AdminNieuwsbriefPage() {
  const subscribers = await listSubscribers();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nieuwsbrief</h1>
          <p className="mt-1 text-sm text-white/50">
            {subscribers.length} {subscribers.length === 1 ? "inschrijving" : "inschrijvingen"}
          </p>
        </div>
        <ExportSubscribersButton subscribers={subscribers} />
      </div>

      {subscribers.length === 0 ? (
        <p className="text-white/60">Nog geen inschrijvingen.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">E-mail</th>
                <th className="hidden px-4 py-3 sm:table-cell">Bron</th>
                <th className="px-4 py-3">Ingeschreven op</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{subscriber.email}</td>
                  <td className="hidden px-4 py-3 text-white/70 sm:table-cell">
                    {subscriber.sourcePage ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    {new Date(subscriber.createdAt).toLocaleString("nl-BE")}
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
