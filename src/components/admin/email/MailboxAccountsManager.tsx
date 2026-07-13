"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  FlaskConical,
  Loader2,
  Mail,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  deleteMailboxAccountAction,
  fetchRemoteFoldersAction,
  listMailboxAccountsAction,
  saveFolderMappingAction,
  saveMailboxAccountAction,
  sendMailboxTestEmailAction,
  setDefaultMailboxAction,
  setMailboxActiveAction,
  setMailboxSyncPausedAction,
  testMailboxImapAction,
  testMailboxSmtpAction,
  type MailboxAccountInput,
  type MailboxAccountOverview,
} from "@/lib/admin/mailboxAccountActions";
import { syncMailboxesAction } from "@/lib/admin/emailClientActions";
import { MAILBOX_COLORS, type EmailMailboxAdminView, type MailboxFolderMapping } from "@/types/emailClient";
import { CONNECTION_COLORS, CONNECTION_LABELS, formatFullDate } from "./emailClientUi";

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70 disabled:opacity-50";

type FormState = {
  id?: string;
  input: MailboxAccountInput;
  imapPassword: string;
  smtpPassword: string;
  clearImapPassword: boolean;
  clearSmtpPassword: boolean;
  imapPasswordConfigured: boolean;
  smtpPasswordConfigured: boolean;
};

function emptyForm(): FormState {
  return {
    input: {
      name: "",
      emailAddress: "",
      displayName: "VisualVibe",
      description: "",
      color: MAILBOX_COLORS[0],
      isActive: true,
      isDefaultManualMailbox: false,
      showInUnifiedInbox: true,
      signatureHtml: "",
      templateModeNew: "full",
      templateModeReply: "none",
      imap: {
        enabled: true,
        host: "",
        port: 993,
        security: "ssl",
        username: "",
        initialSyncDays: 90,
        batchSize: 100,
      },
      smtp: {
        enabled: true,
        host: "",
        port: 587,
        security: "starttls",
        username: "",
        replyTo: "",
      },
    },
    imapPassword: "",
    smtpPassword: "",
    clearImapPassword: false,
    clearSmtpPassword: false,
    imapPasswordConfigured: false,
    smtpPasswordConfigured: false,
  };
}

function formFromMailbox(mailbox: EmailMailboxAdminView): FormState {
  return {
    id: mailbox.id,
    input: {
      name: mailbox.name,
      emailAddress: mailbox.emailAddress,
      displayName: mailbox.displayName,
      description: mailbox.description,
      color: mailbox.color,
      isActive: mailbox.isActive,
      isDefaultManualMailbox: mailbox.isDefaultManualMailbox,
      showInUnifiedInbox: mailbox.showInUnifiedInbox,
      signatureHtml: mailbox.signatureHtml,
      templateModeNew: mailbox.templateModeNew,
      templateModeReply: mailbox.templateModeReply,
      imap: {
        enabled: mailbox.imap.enabled,
        host: mailbox.imap.host,
        port: mailbox.imap.port,
        security: mailbox.imap.security,
        username: mailbox.imap.username,
        initialSyncDays: mailbox.imap.initialSyncDays,
        batchSize: mailbox.imap.batchSize,
      },
      smtp: {
        enabled: mailbox.smtp.enabled,
        host: mailbox.smtp.host,
        port: mailbox.smtp.port,
        security: mailbox.smtp.security,
        username: mailbox.smtp.username,
        replyTo: mailbox.smtp.replyTo,
      },
    },
    imapPassword: "",
    smtpPassword: "",
    clearImapPassword: false,
    clearSmtpPassword: false,
    imapPasswordConfigured: mailbox.imap.passwordConfigured,
    smtpPasswordConfigured: mailbox.smtp.passwordConfigured,
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs text-white/60">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-amber-500"
      />
      <span>
        <span className="block text-sm text-white/85">{label}</span>
        {description ? <span className="block text-xs text-white/40">{description}</span> : null}
      </span>
    </label>
  );
}

export function MailboxAccountsManager() {
  const [overviews, setOverviews] = useState<MailboxAccountOverview[] | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmailMailboxAdminView | null>(null);
  const [deleteWithData, setDeleteWithData] = useState(false);
  const [folderPanel, setFolderPanel] = useState<{
    mailbox: EmailMailboxAdminView;
    loading: boolean;
    folders?: Array<{ path: string; name: string; specialUse?: string }>;
    mapping: MailboxFolderMapping;
    error?: string;
  } | null>(null);

  const reload = useCallback(async () => {
    const result = await listMailboxAccountsAction();
    if (result.ok) setOverviews(result.data);
    else toast.error(result.message);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const updateForm = (updater: (current: FormState) => FormState) =>
    setForm((current) => (current ? updater(current) : current));

  const passwordsPayload = (state: FormState) => ({
    imap: state.clearImapPassword ? null : state.imapPassword || "",
    smtp: state.clearSmtpPassword ? null : state.smtpPassword || "",
  });

  const handleSave = async () => {
    if (!form) return;
    setBusy("save");
    const result = await saveMailboxAccountAction(form.input, passwordsPayload(form), form.id);
    setBusy(null);
    if (result.ok) {
      toast.success("Mailbox opgeslagen.");
      setForm(null);
      void reload();
    } else {
      toast.error(result.message);
    }
  };

  const handleTest = async (kind: "imap" | "smtp") => {
    if (!form) return;
    setBusy(`test-${kind}`);
    const result =
      kind === "imap"
        ? await testMailboxImapAction(form.input, form.id, form.imapPassword || undefined)
        : await testMailboxSmtpAction(form.input, form.id, form.smtpPassword || undefined);
    setBusy(null);
    if (result.ok) toast.success(kind === "imap" ? "IMAP-verbinding werkt." : "SMTP-verbinding werkt.");
    else toast.error(result.message);
  };

  const rowAction = async (
    key: string,
    action: () => Promise<{ ok: boolean; message?: string } | { ok: true; data: unknown }>,
    successMessage?: string,
  ) => {
    setBusy(key);
    const result = await action();
    setBusy(null);
    if (result.ok) {
      if (successMessage) toast.success(successMessage);
      void reload();
    } else {
      toast.error("message" in result && result.message ? result.message : "Actie mislukt.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Toaster theme="dark" position="bottom-left" richColors closeButton />

      <div>
        <button
          type="button"
          onClick={() => setForm(emptyForm())}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Mailbox toevoegen
        </button>
      </div>

      {overviews === null ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-white/[0.04]" />
          ))}
        </div>
      ) : overviews.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/50">
          Nog geen mailboxaccounts. Voeg de eerste mailbox toe om de e-mailclient te gebruiken.
        </div>
      ) : (
        overviews.map(({ mailbox, connection, inboxUnread }) => (
          <div key={mailbox.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: mailbox.color }} aria-hidden="true" />
              <span className="text-sm font-semibold text-white">{mailbox.name}</span>
              <span className="text-sm text-white/50">{mailbox.emailAddress}</span>
              {mailbox.isDefaultManualMailbox ? (
                <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  <Star className="h-3 w-3" /> Standaard
                </span>
              ) : null}
              {!mailbox.isActive ? (
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/60">Inactief</span>
              ) : null}
              <span
                className="ml-auto inline-flex items-center gap-1.5 text-xs"
                style={{ color: CONNECTION_COLORS[connection] }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CONNECTION_COLORS[connection] }} aria-hidden="true" />
                {CONNECTION_LABELS[connection]}
              </span>
            </div>

            <div className="mt-2 grid gap-x-6 gap-y-1 text-xs text-white/45 sm:grid-cols-2 lg:grid-cols-4">
              <span>IMAP: {mailbox.imap.enabled ? (mailbox.imap.passwordConfigured ? "ingeschakeld" : "wachtwoord ontbreekt") : "uit"}</span>
              <span>SMTP: {mailbox.smtp.enabled ? (mailbox.smtp.passwordConfigured || !mailbox.smtp.username ? "ingeschakeld" : "wachtwoord ontbreekt") : "uit"}</span>
              <span>
                Laatste sync: {mailbox.lastSyncAt ? formatFullDate(mailbox.lastSyncAt) : "nog niet"}
                {mailbox.syncStatus === "paused" ? " (gepauzeerd)" : ""}
              </span>
              <span>
                {mailbox.messageCount} berichten, {inboxUnread} ongelezen
              </span>
            </div>
            {mailbox.lastSyncError ? (
              <p className="mt-2 rounded bg-red-500/10 px-2 py-1 text-xs text-red-300">{mailbox.lastSyncError}</p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setForm(formFromMailbox(mailbox))}
                className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/10"
              >
                <Pencil className="h-3.5 w-3.5" /> Bewerken
              </button>
              <button
                type="button"
                disabled={busy === `sync-${mailbox.id}` || !mailbox.imap.enabled}
                onClick={() =>
                  void rowAction(`sync-${mailbox.id}`, () => syncMailboxesAction(mailbox.id), "Synchronisatie uitgevoerd.")
                }
                className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/10 disabled:opacity-40"
              >
                {busy === `sync-${mailbox.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Nu synchroniseren
              </button>
              <button
                type="button"
                disabled={busy === `pause-${mailbox.id}` || !mailbox.imap.enabled}
                onClick={() =>
                  void rowAction(
                    `pause-${mailbox.id}`,
                    () => setMailboxSyncPausedAction(mailbox.id, mailbox.syncStatus !== "paused"),
                    mailbox.syncStatus === "paused" ? "Synchronisatie hervat." : "Synchronisatie gepauzeerd.",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/10 disabled:opacity-40"
              >
                {mailbox.syncStatus === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                {mailbox.syncStatus === "paused" ? "Sync hervatten" : "Sync pauzeren"}
              </button>
              <button
                type="button"
                disabled={busy === `testmail-${mailbox.id}` || !mailbox.smtp.enabled}
                onClick={() =>
                  void rowAction(`testmail-${mailbox.id}`, () => sendMailboxTestEmailAction(mailbox.id), "Testmail verzonden.")
                }
                className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/10 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" /> Testmail
              </button>
              <button
                type="button"
                onClick={() => {
                  setFolderPanel({ mailbox, loading: true, mapping: mailbox.folderMapping });
                  void fetchRemoteFoldersAction(mailbox.id).then((result) => {
                    if (result.ok) {
                      setFolderPanel({
                        mailbox,
                        loading: false,
                        folders: result.data.folders,
                        mapping: { ...result.data.detectedMapping, ...result.data.currentMapping },
                      });
                    } else {
                      setFolderPanel({ mailbox, loading: false, mapping: mailbox.folderMapping, error: result.message });
                    }
                  });
                }}
                disabled={!mailbox.imap.enabled}
                className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/10 disabled:opacity-40"
              >
                <Mail className="h-3.5 w-3.5" /> Mappen
              </button>
              {!mailbox.isDefaultManualMailbox ? (
                <button
                  type="button"
                  onClick={() =>
                    void rowAction(`default-${mailbox.id}`, () => setDefaultMailboxAction(mailbox.id), "Standaardmailbox ingesteld.")
                  }
                  className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/10"
                >
                  <Star className="h-3.5 w-3.5" /> Als standaard
                </button>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  void rowAction(
                    `active-${mailbox.id}`,
                    () => setMailboxActiveAction(mailbox.id, !mailbox.isActive),
                    mailbox.isActive ? "Mailbox uitgeschakeld." : "Mailbox ingeschakeld.",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1.5 text-xs text-white/75 hover:bg-white/10"
              >
                {mailbox.isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {mailbox.isActive ? "Uitschakelen" : "Inschakelen"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(mailbox);
                  setDeleteWithData(false);
                }}
                className="inline-flex items-center gap-1.5 rounded border border-red-500/30 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Verwijderen
              </button>
            </div>
          </div>
        ))
      )}

      {/* Formulier */}
      {form ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Mailboxaccount">
          <div className="my-4 w-full max-w-3xl rounded-xl border border-white/10 bg-[#101010] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <h2 className="text-base font-semibold text-white">
                {form.id ? `Mailbox bewerken: ${form.input.emailAddress || form.input.name}` : "Mailbox toevoegen"}
              </h2>
              <button type="button" onClick={() => setForm(null)} className="rounded p-1.5 text-white/50 hover:bg-white/10" aria-label="Sluiten">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-6 px-5 py-4">
              {/* Algemeen */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Algemeen</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Interne naam *">
                    <input
                      className={inputClasses}
                      value={form.input.name}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, name: event.target.value } }))}
                      placeholder="bv. Fotografie"
                    />
                  </Field>
                  <Field label="E-mailadres *">
                    <input
                      className={inputClasses}
                      value={form.input.emailAddress}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, emailAddress: event.target.value } }))}
                      placeholder="fotografie@visualvibe.be"
                    />
                  </Field>
                  <Field label="Weergavenaam afzender">
                    <input
                      className={inputClasses}
                      value={form.input.displayName}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, displayName: event.target.value } }))}
                      placeholder="VisualVibe Fotografie"
                    />
                  </Field>
                  <Field label="Korte omschrijving">
                    <input
                      className={inputClasses}
                      value={form.input.description}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, description: event.target.value } }))}
                    />
                  </Field>
                </div>
                <div className="mt-3">
                  <span className="mb-1 block text-xs text-white/60">Herkenningskleur</span>
                  <div className="flex flex-wrap gap-2">
                    {MAILBOX_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateForm((c) => ({ ...c, input: { ...c.input, color } }))}
                        className={cn(
                          "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                          form.input.color === color ? "border-white" : "border-transparent",
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Kleur ${color}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Toggle
                    label="Mailbox actief"
                    checked={form.input.isActive}
                    onChange={(value) => updateForm((c) => ({ ...c, input: { ...c.input, isActive: value } }))}
                  />
                  <Toggle
                    label="Standaard voor handmatige e-mails"
                    checked={form.input.isDefaultManualMailbox}
                    onChange={(value) => updateForm((c) => ({ ...c, input: { ...c.input, isDefaultManualMailbox: value } }))}
                  />
                  <Toggle
                    label="Zichtbaar in gecombineerde inbox"
                    checked={form.input.showInUnifiedInbox}
                    onChange={(value) => updateForm((c) => ({ ...c, input: { ...c.input, showInUnifiedInbox: value } }))}
                  />
                </div>
              </section>

              {/* IMAP */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">IMAP (inkomend)</h3>
                  <Toggle
                    label="IMAP inschakelen"
                    checked={form.input.imap.enabled}
                    onChange={(value) => updateForm((c) => ({ ...c, input: { ...c.input, imap: { ...c.input.imap, enabled: value } } }))}
                  />
                </div>
                <div className={cn("grid gap-3 sm:grid-cols-2", !form.input.imap.enabled && "opacity-40")}>
                  <Field label="IMAP-host *">
                    <input
                      className={inputClasses}
                      disabled={!form.input.imap.enabled}
                      value={form.input.imap.host}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, imap: { ...c.input.imap, host: event.target.value } } }))}
                      placeholder="imap.provider.be"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Poort *">
                      <input
                        type="number"
                        min={1}
                        max={65535}
                        className={inputClasses}
                        disabled={!form.input.imap.enabled}
                        value={form.input.imap.port}
                        onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, imap: { ...c.input.imap, port: Number(event.target.value) } } }))}
                      />
                    </Field>
                    <Field label="Beveiliging *">
                      <select
                        className={inputClasses}
                        disabled={!form.input.imap.enabled}
                        value={form.input.imap.security}
                        onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, imap: { ...c.input.imap, security: event.target.value as "ssl" | "starttls" } } }))}
                      >
                        <option value="ssl">SSL/TLS</option>
                        <option value="starttls">STARTTLS</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Gebruikersnaam *">
                    <input
                      className={inputClasses}
                      disabled={!form.input.imap.enabled}
                      value={form.input.imap.username}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, imap: { ...c.input.imap, username: event.target.value } } }))}
                      autoComplete="off"
                    />
                  </Field>
                  <Field
                    label={
                      form.imapPasswordConfigured && !form.clearImapPassword
                        ? "Wachtwoord (opgeslagen; laat leeg om te behouden)"
                        : "Wachtwoord of app-wachtwoord"
                    }
                  >
                    <input
                      type="password"
                      className={inputClasses}
                      disabled={!form.input.imap.enabled}
                      value={form.imapPassword}
                      onChange={(event) => updateForm((c) => ({ ...c, imapPassword: event.target.value }))}
                      autoComplete="new-password"
                      placeholder={form.imapPasswordConfigured ? "********" : ""}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Historiek eerste sync (dagen)">
                      <input
                        type="number"
                        min={1}
                        max={365}
                        className={inputClasses}
                        disabled={!form.input.imap.enabled}
                        value={form.input.imap.initialSyncDays}
                        onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, imap: { ...c.input.imap, initialSyncDays: Number(event.target.value) } } }))}
                      />
                    </Field>
                    <Field label="Batchgrootte per sync">
                      <input
                        type="number"
                        min={10}
                        max={200}
                        className={inputClasses}
                        disabled={!form.input.imap.enabled}
                        value={form.input.imap.batchSize}
                        onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, imap: { ...c.input.imap, batchSize: Number(event.target.value) } } }))}
                      />
                    </Field>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={busy === "test-imap" || !form.input.imap.enabled}
                      onClick={() => void handleTest("imap")}
                      className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-40"
                    >
                      {busy === "test-imap" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
                      Test IMAP-verbinding
                    </button>
                  </div>
                </div>
              </section>

              {/* SMTP */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">SMTP (uitgaand)</h3>
                  <Toggle
                    label="SMTP inschakelen"
                    checked={form.input.smtp.enabled}
                    onChange={(value) => updateForm((c) => ({ ...c, input: { ...c.input, smtp: { ...c.input.smtp, enabled: value } } }))}
                  />
                </div>
                <div className={cn("grid gap-3 sm:grid-cols-2", !form.input.smtp.enabled && "opacity-40")}>
                  <Field label="SMTP-host *">
                    <input
                      className={inputClasses}
                      disabled={!form.input.smtp.enabled}
                      value={form.input.smtp.host}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, smtp: { ...c.input.smtp, host: event.target.value } } }))}
                      placeholder="smtp.provider.be"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Poort *">
                      <input
                        type="number"
                        min={1}
                        max={65535}
                        className={inputClasses}
                        disabled={!form.input.smtp.enabled}
                        value={form.input.smtp.port}
                        onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, smtp: { ...c.input.smtp, port: Number(event.target.value) } } }))}
                      />
                    </Field>
                    <Field label="Beveiliging *">
                      <select
                        className={inputClasses}
                        disabled={!form.input.smtp.enabled}
                        value={form.input.smtp.security}
                        onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, smtp: { ...c.input.smtp, security: event.target.value as "ssl" | "starttls" | "none" } } }))}
                      >
                        <option value="starttls">STARTTLS</option>
                        <option value="ssl">SSL/TLS</option>
                        <option value="none">Geen (afgeraden)</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Gebruikersnaam">
                    <input
                      className={inputClasses}
                      disabled={!form.input.smtp.enabled}
                      value={form.input.smtp.username}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, smtp: { ...c.input.smtp, username: event.target.value } } }))}
                      autoComplete="off"
                    />
                  </Field>
                  <Field
                    label={
                      form.smtpPasswordConfigured && !form.clearSmtpPassword
                        ? "Wachtwoord (opgeslagen; laat leeg om te behouden)"
                        : "Wachtwoord of app-wachtwoord"
                    }
                  >
                    <input
                      type="password"
                      className={inputClasses}
                      disabled={!form.input.smtp.enabled}
                      value={form.smtpPassword}
                      onChange={(event) => updateForm((c) => ({ ...c, smtpPassword: event.target.value }))}
                      autoComplete="new-password"
                      placeholder={form.smtpPasswordConfigured ? "********" : ""}
                    />
                  </Field>
                  <Field label="Reply-To (optioneel)">
                    <input
                      className={inputClasses}
                      disabled={!form.input.smtp.enabled}
                      value={form.input.smtp.replyTo}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, smtp: { ...c.input.smtp, replyTo: event.target.value } } }))}
                      placeholder="info@visualvibe.be"
                    />
                  </Field>
                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={busy === "test-smtp" || !form.input.smtp.enabled}
                      onClick={() => void handleTest("smtp")}
                      className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-40"
                    >
                      {busy === "test-smtp" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
                      Test SMTP-verbinding
                    </button>
                  </div>
                </div>
              </section>

              {/* Handtekening en template */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Handtekening en template
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Template voor nieuwe berichten">
                    <select
                      className={inputClasses}
                      value={form.input.templateModeNew}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, templateModeNew: event.target.value as FormState["input"]["templateModeNew"] } }))}
                    >
                      <option value="full">VisualVibe header + footer</option>
                      <option value="footer">Alleen footer</option>
                      <option value="none">Geen template</option>
                    </select>
                  </Field>
                  <Field label="Template voor antwoorden en doorsturen">
                    <select
                      className={inputClasses}
                      value={form.input.templateModeReply}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, templateModeReply: event.target.value as FormState["input"]["templateModeReply"] } }))}
                    >
                      <option value="none">Alleen handtekening (aanbevolen)</option>
                      <option value="footer">Alleen footer</option>
                      <option value="full">VisualVibe header + footer</option>
                    </select>
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Eigen handtekening-HTML (leeg = algemene VisualVibe-handtekening)">
                    <textarea
                      rows={4}
                      className={inputClasses}
                      value={form.input.signatureHtml}
                      onChange={(event) => updateForm((c) => ({ ...c, input: { ...c.input, signatureHtml: event.target.value } }))}
                      placeholder="<p>Met vriendelijke groeten,<br>Team Fotografie</p>"
                    />
                  </Field>
                </div>
              </section>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={busy === "save"}
                onClick={() => void handleSave()}
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
              >
                {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Opslaan
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Mappenpaneel */}
      {folderPanel ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="IMAP-mappen">
          <div className="w-full max-w-xl rounded-xl border border-white/10 bg-[#101010] p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Mapmapping: {folderPanel.mailbox.emailAddress}
              </h3>
              <button type="button" onClick={() => setFolderPanel(null)} className="rounded p-1 text-white/50 hover:bg-white/10" aria-label="Sluiten">
                <X className="h-4 w-4" />
              </button>
            </div>
            {folderPanel.loading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-white/50">
                <Loader2 className="h-4 w-4 animate-spin" /> Mappen ophalen van de server...
              </div>
            ) : folderPanel.error ? (
              <p className="py-4 text-sm text-red-300">{folderPanel.error}</p>
            ) : (
              <>
                <p className="mb-3 text-xs text-white/45">
                  Automatische detectie via SPECIAL-USE en mapnamen; pas hieronder aan wanneer je server
                  andere namen gebruikt (bv. INBOX.Sent, Deleted Items).
                </p>
                <div className="flex flex-col gap-2">
                  {(
                    [
                      ["inbox", "Postvak IN"],
                      ["sent", "Verzonden"],
                      ["spam", "Spam"],
                      ["trash", "Prullenbak"],
                      ["archive", "Archief"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 text-sm text-white/70">
                      <span className="w-28 shrink-0">{label}</span>
                      <select
                        className={inputClasses}
                        value={folderPanel.mapping[key] ?? ""}
                        onChange={(event) =>
                          setFolderPanel((current) =>
                            current
                              ? { ...current, mapping: { ...current.mapping, [key]: event.target.value || undefined } }
                              : current,
                          )
                        }
                      >
                        <option value="">(niet synchroniseren)</option>
                        {(folderPanel.folders ?? []).map((folder) => (
                          <option key={folder.path} value={folder.path}>
                            {folder.path}
                            {folder.specialUse ? ` (${folder.specialUse})` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFolderPanel(null)}
                    className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
                  >
                    Annuleren
                  </button>
                  <button
                    type="button"
                    disabled={busy === "folders"}
                    onClick={async () => {
                      setBusy("folders");
                      const result = await saveFolderMappingAction(folderPanel.mailbox.id, folderPanel.mapping);
                      setBusy(null);
                      if (result.ok) {
                        toast.success("Mapmapping opgeslagen.");
                        setFolderPanel(null);
                        void reload();
                      } else {
                        toast.error(result.message);
                      }
                    }}
                    className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
                  >
                    {busy === "folders" ? "Opslaan..." : "Opslaan"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Verwijderdialoog */}
      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Mailbox verwijderen">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#101010] p-5 shadow-2xl">
            <h3 className="mb-2 text-sm font-semibold text-white">
              Mailbox {deleteTarget.emailAddress} verwijderen?
            </h3>
            <p className="mb-3 text-sm text-white/60">
              Berichten op de externe mailserver worden nooit verwijderd; dit gaat alleen over de
              verbinding en de lokaal gesynchroniseerde kopie in deze app.
            </p>
            <label className="mb-2 flex cursor-pointer items-start gap-2 text-sm text-white/75">
              <input
                type="radio"
                name="delete-mode"
                checked={!deleteWithData}
                onChange={() => setDeleteWithData(false)}
                className="mt-1 accent-amber-500"
              />
              Alleen de verbinding verwijderen en lokale e-mails behouden
            </label>
            <label className="mb-4 flex cursor-pointer items-start gap-2 text-sm text-white/75">
              <input
                type="radio"
                name="delete-mode"
                checked={deleteWithData}
                onChange={() => setDeleteWithData(true)}
                className="mt-1 accent-amber-500"
              />
              Verbinding én alle lokaal gesynchroniseerde e-mails, concepten en outbox-items verwijderen
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={busy === "delete"}
                onClick={async () => {
                  setBusy("delete");
                  const result = await deleteMailboxAccountAction(deleteTarget.id, deleteWithData);
                  setBusy(null);
                  if (result.ok) {
                    toast.success("Mailbox verwijderd.");
                    setDeleteTarget(null);
                    void reload();
                  } else {
                    toast.error(result.message);
                  }
                }}
                className="rounded-md bg-red-500/90 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {busy === "delete" ? "Verwijderen..." : "Definitief verwijderen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
