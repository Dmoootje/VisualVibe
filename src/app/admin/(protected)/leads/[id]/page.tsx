import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/firestore/leads";
import { listNotesByLead } from "@/lib/firestore/leadNotes";
import { listEventsByLead } from "@/lib/firestore/leadEvents";
import type { LeadEvent } from "@/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { LeadPrioritySelect } from "@/components/admin/LeadPrioritySelect";
import { LeadNoteForm } from "@/components/admin/LeadNoteForm";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const [notes, events] = await Promise.all([listNotesByLead(id), listEventsByLead(id)]);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <p className="text-white/60">{lead.email}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-6">
          <section className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4">Gegevens</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Telefoon" value={lead.phone} />
              <Field label="Bedrijf" value={lead.company} />
              <Field label="Dienst" value={lead.serviceInterest} />
              <Field label="Regio" value={lead.region} />
              <Field label="Bron pagina" value={lead.sourcePage} />
              <Field label="UTM bron" value={lead.utmSource} />
            </dl>
            <div className="mt-4">
              <span className="text-xs text-white/50 uppercase tracking-wide">Bericht</span>
              <p className="mt-1 text-white/80 whitespace-pre-wrap">{lead.message}</p>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4">Notities</h2>
            <LeadNoteForm leadId={lead.id} />
            <ul className="mt-4 flex flex-col gap-3">
              {notes.map((note) => (
                <li key={note.id} className="rounded-md border border-white/10 bg-black/40 p-3 text-sm">
                  <p className="text-white/80 whitespace-pre-wrap">{note.note}</p>
                  <p className="mt-1 text-xs text-white/40">
                    {note.createdBy} - {new Date(note.createdAt).toLocaleString("nl-BE")}
                  </p>
                </li>
              ))}
              {notes.length === 0 && <p className="text-sm text-white/40">Nog geen notities.</p>}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wide">Status</label>
                <div className="mt-1">
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wide">Prioriteit</label>
                <div className="mt-1">
                  <LeadPrioritySelect leadId={lead.id} priority={lead.priority} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4">Historiek</h2>
            <ul className="flex flex-col gap-3">
              {events.map((event) => (
                <li key={event.id} className="text-sm">
                  <p className="text-white/80">{describeEvent(event)}</p>
                  <p className="text-xs text-white/40">{new Date(event.createdAt).toLocaleString("nl-BE")}</p>
                </li>
              ))}
              {events.length === 0 && <p className="text-sm text-white/40">Geen historiek.</p>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-white/50 uppercase tracking-wide">{label}</dt>
      <dd className="text-white/80">{value || "-"}</dd>
    </div>
  );
}

function describeEvent(event: LeadEvent): string {
  switch (event.type) {
    case "created":
      return "Lead aangemaakt";
    case "status_change":
      return `Status gewijzigd: ${event.oldValue} → ${event.newValue} (door ${event.createdBy})`;
    case "priority_change":
      return `Prioriteit gewijzigd: ${event.oldValue} → ${event.newValue} (door ${event.createdBy})`;
    case "note_added":
      return `Notitie toegevoegd (door ${event.createdBy})`;
    default:
      return event.type;
  }
}
