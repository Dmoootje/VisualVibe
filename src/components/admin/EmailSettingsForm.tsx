"use client";

import { useActionState } from "react";
import { AlertTriangle, CheckCircle2, FlaskConical, Mail, Send, Server } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  saveEmailSettingsAction,
  sendSmtpTestEmailAction,
  testSmtpConnectionAction,
  type EmailSettingsActionState,
} from "@/lib/admin/emailSettingsActions";
import { EMAIL_FORM_TYPES, type EmailSettingsAdminView } from "@/types/email";

const INITIAL_EMAIL_SETTINGS_ACTION_STATE: EmailSettingsActionState = { status: "idle" };

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/35 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70 disabled:cursor-not-allowed disabled:opacity-50";

const FORM_TYPE_LABELS: Record<(typeof EMAIL_FORM_TYPES)[number], string> = {
  contact: "Contactformulier",
  offerte: "Offertepagina",
  quote_modal_offerte: "Offertemodal",
  quote_modal_kennis: "Kennismakingsmodal",
  website_analysis: "Websiteanalyse",
};

export function EmailSettingsForm({ settings }: { settings: EmailSettingsAdminView }) {
  const [saveState, saveAction, savePending] = useActionState(
    saveEmailSettingsAction,
    INITIAL_EMAIL_SETTINGS_ACTION_STATE,
  );
  const [connectionState, connectionAction, connectionPending] = useActionState(
    testSmtpConnectionAction,
    INITIAL_EMAIL_SETTINGS_ACTION_STATE,
  );
  const [testMailState, testMailAction, testMailPending] = useActionState(
    sendSmtpTestEmailAction,
    INITIAL_EMAIL_SETTINGS_ACTION_STATE,
  );

  const busy = savePending || connectionPending || testMailPending;
  return (
    <form action={saveAction} className="flex flex-col gap-6">
      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-3 border border-white/10 bg-white/5 p-1 text-white/60 sm:w-fit sm:min-w-[440px]">
          <TabsTrigger
            value="smtp"
            className="gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Server className="h-4 w-4" aria-hidden="true" />
            SMTP
          </TabsTrigger>
          <TabsTrigger
            value="automation"
            className="gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            Automatisering
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Voorbeeld
          </TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" forceMount className="mt-5 focus-visible:ring-amber-500/70 data-[state=inactive]:hidden">
          <Panel title="SMTP-verbinding" description="Alle verzending gebeurt uitsluitend op de server.">
            <CheckboxField
              name="enabled"
              label="SMTP inschakelen"
              description="Schakel uit om leadmails tijdelijk niet te versturen. Leads blijven altijd opgeslagen."
              defaultChecked={settings.smtp.enabled}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Host *" name="host" defaultValue={settings.smtp.host} placeholder="smtp.provider.be" />
              <Field
                label="Poort *"
                name="port"
                type="number"
                min={1}
                max={65535}
                defaultValue={String(settings.smtp.port)}
              />
              <SelectField
                label="Beveiliging *"
                name="security"
                defaultValue={settings.smtp.security}
                options={[
                  { value: "none", label: "Geen" },
                  { value: "ssl", label: "SSL/TLS" },
                  { value: "starttls", label: "STARTTLS" },
                ]}
              />
              <Field label="Gebruikersnaam" name="username" defaultValue={settings.smtp.username} autoComplete="username" />
              <Field
                label="Wachtwoord"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder={
                  settings.smtp.passwordConfigured
                    ? "Opgeslagen - laat leeg om te behouden"
                    : "SMTP-wachtwoord"
                }
                hint={
                  settings.smtp.passwordConfigured
                    ? "Er is een versleuteld wachtwoord opgeslagen. Het wordt nooit teruggestuurd of weergegeven."
                    : "Nog geen wachtwoord opgeslagen."
                }
              />
              <Field label="Naam afzender *" name="fromName" defaultValue={settings.smtp.fromName} />
              <Field label="E-mail afzender *" name="fromEmail" type="email" defaultValue={settings.smtp.fromEmail} />
              <Field label="Reply-To" name="replyTo" type="email" defaultValue={settings.smtp.replyTo} />
              <Field
                label="Interne ontvangers *"
                name="adminRecipients"
                defaultValue={settings.smtp.adminRecipients.join(", ")}
                hint="Scheid meerdere adressen met een komma. Standaard: jens@visualvibe.be."
              />
              <Field
                label="Ontvanger testmail *"
                name="testRecipient"
                type="email"
                defaultValue={settings.smtp.testRecipient}
              />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
              <button
                type="submit"
                formAction={connectionAction}
                disabled={busy}
                className="rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 disabled:opacity-50"
              >
                {connectionPending ? "Verbinding testen..." : "Verbinding testen"}
              </button>
              <button
                type="submit"
                formAction={testMailAction}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-500/20 disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {testMailPending ? "Testmail versturen..." : "Testmail versturen"}
              </button>
            </div>
            {connectionState.status !== "idle" && <ActionStatus state={connectionState} />}
            {testMailState.status !== "idle" && <ActionStatus state={testMailState} />}
          </Panel>
        </TabsContent>

        <TabsContent value="automation" forceMount className="mt-5 focus-visible:ring-amber-500/70 data-[state=inactive]:hidden">
          <Panel
            title="Automatisering"
            description="Bepaal welke acties na een veilig opgeslagen formulierinzending mogen starten."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <CheckboxField
                name="sendCustomerConfirmation"
                label="Klantbevestiging versturen"
                description="Stuurt een bevestiging met alleen de gekozen diensten."
                defaultChecked={settings.automation.sendCustomerConfirmation}
              />
              <CheckboxField
                name="sendAdminNotification"
                label="Interne melding versturen"
                description="Meldt een nieuwe lead aan de interne ontvangers."
                defaultChecked={settings.automation.sendAdminNotification}
              />
              <CheckboxField
                name="createAiReplyDraft"
                label="AI-antwoordconcept maken"
                description="Bewaart een controleerbaar concept bij de lead."
                defaultChecked={settings.automation.createAiReplyDraft}
              />
              <CheckboxField
                name="allowAiAutoSend"
                label="AI-antwoorden automatisch versturen"
                description="Experimenteel: laat AI-concepten zonder handmatige controle verzenden."
                defaultChecked={settings.automation.allowAiAutoSend}
                badge="Experimenteel"
                warning
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Standaardtaal"
                name="defaultLocale"
                defaultValue={settings.automation.defaultLocale}
                options={[
                  { value: "nl", label: "Nederlands" },
                  { value: "fr", label: "Frans" },
                  { value: "en", label: "Engels" },
                ]}
              />
              <Field
                label="Verwachting over antwoordtermijn"
                name="responseExpectationText"
                defaultValue={settings.automation.responseExpectationText}
                placeholder="Bijvoorbeeld: We antwoorden doorgaans binnen 2 werkdagen."
                hint="Laat leeg als je geen concrete reactietermijn wilt beloven."
              />
              <Field label="Naam ondertekening" name="signatureName" defaultValue={settings.automation.signatureName} />
              <Field label="Functie ondertekening" name="signatureRole" defaultValue={settings.automation.signatureRole} />
              <Field label="Telefoon ondertekening" name="signaturePhone" type="tel" defaultValue={settings.automation.signaturePhone} />
              <Field label="E-mail ondertekening" name="signatureEmail" type="email" defaultValue={settings.automation.signatureEmail} />
              <Field label="Website ondertekening" name="signatureWebsite" type="url" defaultValue={settings.automation.signatureWebsite} />
              <Field label="Afsprakenlink" name="appointmentUrl" type="url" defaultValue={settings.automation.appointmentUrl} />
            </div>

            <fieldset className="rounded-lg border border-white/10 bg-black/20 p-4">
              <legend className="px-1 text-sm font-semibold text-white">Actieve formuliertypes</legend>
              <p className="mb-3 text-xs leading-5 text-white/45">
                Automatiseringen starten uitsluitend voor de aangevinkte formulieren.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {EMAIL_FORM_TYPES.map((formType) => (
                  <label key={formType} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white/75">
                    <input
                      type="checkbox"
                      name="enabledFormTypes"
                      value={formType}
                      defaultChecked={settings.automation.enabledFormTypes.includes(formType)}
                      className="h-4 w-4 accent-amber-500"
                    />
                    {FORM_TYPE_LABELS[formType]}
                  </label>
                ))}
              </div>
            </fieldset>
          </Panel>
        </TabsContent>

        <TabsContent value="preview" forceMount className="mt-5 focus-visible:ring-amber-500/70 data-[state=inactive]:hidden">
          <Panel
            title="Voorbeeld klantbevestiging"
            description="Veilige tekstweergave van de vaste mailopbouw. Dienstblokken worden per lead toegevoegd."
          >
            <div className="mx-auto w-full max-w-[600px] rounded-2xl bg-[#f3f4f6] p-4 text-[#171717] sm:p-7">
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                <div className="h-1.5 bg-gradient-to-r from-[#ef4444] to-[#f97316]" />
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f97316]">VisualVibe</p>
                  <h3 className="mt-4 text-xl font-bold">We hebben je aanvraag goed ontvangen</h3>
                  <p className="mt-4 text-sm leading-6 text-neutral-700">Hallo Alex,</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">
                    Bedankt voor je aanvraag. We ontvingen je vraag over <strong>webdesign</strong> en
                    nemen de aangeleverde informatie zorgvuldig door.
                  </p>
                  <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-semibold text-neutral-900">Voorbereiding voor webdesign</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-700">
                      Houd je bestaande website, doelgroep, gewenste pagina&apos;s en timing bij de hand.
                    </p>
                  </div>
                  {settings.automation.responseExpectationText && (
                    <p className="mt-5 text-sm leading-6 text-neutral-700">
                      {settings.automation.responseExpectationText}
                    </p>
                  )}
                  <div className="mt-6 border-t border-neutral-200 pt-5 text-sm leading-6 text-neutral-700">
                    <p>Met vriendelijke groet,</p>
                    <p className="font-semibold text-neutral-950">{settings.automation.signatureName || "Jens Hardy"}</p>
                    {settings.automation.signatureRole && <p>{settings.automation.signatureRole}</p>}
                    {settings.automation.signatureEmail && <p>{settings.automation.signatureEmail}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-sky-400/20 bg-sky-400/[0.07] p-4 text-sm leading-6 text-sky-100/80">
              Antwoorden komen voorlopig binnen in de ingestelde mailbox. Automatische synchronisatie
              van inkomende antwoorden kan later via IMAP of een mailbox-API worden toegevoegd.
            </div>
          </Panel>
        </TabsContent>
      </Tabs>

      {saveState.status !== "idle" && <ActionStatus state={saveState} />}

      <button
        type="submit"
        disabled={busy}
        className="sticky bottom-4 self-start rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600 disabled:opacity-50"
      >
        {savePending ? "Bezig met opslaan..." : "Opslaan"}
      </button>
    </form>
  );
}

function ActionStatus({ state }: { state: EmailSettingsActionState }) {
  const success = state.status === "success";
  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex max-w-3xl items-start gap-2.5 rounded-lg border p-4 text-sm ${
        success
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span>{state.message}</span>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-white/50">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  hint,
  autoComplete,
  min,
  max,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm text-white/70">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        className={inputClasses}
      />
      {hint && <span className="text-xs leading-5 text-white/40">{hint}</span>}
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm text-white/70">{label}</label>
      <select id={name} name={name} defaultValue={defaultValue} className={inputClasses}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-neutral-900 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({
  name,
  label,
  description,
  defaultChecked,
  badge,
  warning = false,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
  badge?: string;
  warning?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
        warning ? "border-amber-500/25 bg-amber-500/[0.06]" : "border-white/10 bg-black/20"
      }`}
    >
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 h-4 w-4 shrink-0 accent-amber-500" />
      <span>
        <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-white">
          {label}
          {badge && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
              {badge}
            </span>
          )}
        </span>
        <span className="mt-1 block text-xs leading-5 text-white/45">{description}</span>
      </span>
    </label>
  );
}
