import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/firestore/leads";
import { listNotesByLead } from "@/lib/firestore/leadNotes";
import { listEventsByLead } from "@/lib/firestore/leadEvents";
import { listMailHistoryByLead } from "@/lib/firestore/mailHistory";
import { getEmailSettingsForAdmin } from "@/lib/firestore/emailSettings";
import {
  listAnalysisLeadsByEmail,
  listAnalysisLeadsByLeadId,
} from "@/lib/firestore/analysisLeads";
import type { LeadEvent } from "@/types";
import type { AnalysisLead } from "@/types/analysis";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { LeadPrioritySelect } from "@/components/admin/LeadPrioritySelect";
import { LeadNoteForm } from "@/components/admin/LeadNoteForm";
import { LeadCommunicationPanel } from "@/components/admin/LeadCommunicationPanel";
import { LeadAnalysisPanel } from "@/components/admin/LeadAnalysisPanel";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const [notes, events, mailHistory, analysisLeads, emailSettings] = await Promise.all([
    listNotesByLead(id),
    listEventsByLead(id),
    listMailHistoryByLead(id),
    listAnalysisLeadsByLeadId(id),
    getEmailSettingsForAdmin(),
  ]);

  // Analysepaneel tonen bij een analyselead of wanneer er analyses aan deze
  // lead hangen. De e-mailhistoriek gebruikt het genormaliseerde adres uit de
  // analyselead zelf; anders het (lowercase) leadadres.
  const showAnalysisPanel = lead.formType === "website_analysis" || analysisLeads.length > 0;
  let analysisEmailHistory: AnalysisLead[] = [];
  if (showAnalysisPanel) {
    const emailNormalized = analysisLeads[0]?.emailNormalized ?? lead.email.trim().toLowerCase();
    analysisEmailHistory = await listAnalysisLeadsByEmail(emailNormalized);
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <p className="text-white/60">{lead.leadNumber} · {lead.email}</p>
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
              <Field label="Gekozen diensten" value={lead.selectedServices.join(", ")} />
              <Field label="Regio" value={lead.region} />
              <Field label="Formulier" value={lead.formType} />
              <Field label="Taal" value={lead.locale.toUpperCase()} />
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

          {showAnalysisPanel && (
            <LeadAnalysisPanel
              leadId={lead.id}
              analysisLeads={analysisLeads}
              emailHistory={analysisEmailHistory}
            />
          )}

          <LeadCommunicationPanel
            leadId={lead.id}
            history={mailHistory}
            imapEnabled={emailSettings.imap.enabled}
            sendNonce={randomUUID()}
          />
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
    case "draft_generated":
      return `Antwoordconcept gegenereerd (door ${event.createdBy})`;
    case "draft_edited":
      return `Antwoordconcept bewerkt (door ${event.createdBy})`;
    case "email_sent":
      return `E-mail verstuurd (door ${event.createdBy})`;
    case "email_failed":
      return `E-mailverzending mislukt (door ${event.createdBy})`;
    case "email_received": {
      const count = Number(event.newValue ?? 1);
      return count === 1
        ? `1 nieuw inboxantwoord gesynchroniseerd (door ${event.createdBy})`
        : `${count} nieuwe inboxantwoorden gesynchroniseerd (door ${event.createdBy})`;
    }
    case "analysis_requested":
      return "Websiteanalyse aangevraagd";
    case "analysis_verified":
      return "E-mailadres geverifieerd voor websiteanalyse";
    case "analysis_started":
      return `Analyse gestart (door ${event.createdBy})`;
    case "analysis_completed":
      return event.newValue
        ? `Analyse afgerond met score ${event.newValue} (door ${event.createdBy})`
        : `Analyse afgerond (door ${event.createdBy})`;
    case "analysis_failed":
      return `Analyse mislukt (door ${event.createdBy})`;
    case "analysis_limit_reached":
      return "Analyselimiet bereikt";
    case "analysis_reused":
      return "Recent analyserapport hergebruikt";
    case "analysis_force_requested":
      return "Bezoeker vroeg een nieuwe analyse binnen de cooldown";
    case "analysis_report_resent":
      return `Analyserapport opnieuw gemaild (door ${event.createdBy})`;
    case "analysis_quota_reset":
      return `Analysequotum gereset (door ${event.createdBy})`;
    case "analysis_credit_granted":
      return `Extra analysetegoed toegekend: ${event.newValue ?? "1"} (door ${event.createdBy})`;
    default:
      return event.type;
  }
}
