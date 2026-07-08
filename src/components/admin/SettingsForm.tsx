"use client";

import { useActionState } from "react";
import { saveSiteSettings, type SettingsFormState } from "@/lib/admin/settingsActions";
import type { SiteSettings } from "@/types";

const initialState: SettingsFormState = { status: "idle" };

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/70";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(saveSiteSettings, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Bedrijfsnaam *" name="companyName" defaultValue={settings.companyName} required />
        <Field label="Telefoon" name="phone" defaultValue={settings.phone} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="E-mail *" name="mainEmail" type="email" defaultValue={settings.mainEmail} required />
        <Field
          label="Notificatie-e-mail voor leads *"
          name="leadNotificationEmail"
          type="email"
          defaultValue={settings.leadNotificationEmail}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="WhatsApp" name="whatsapp" defaultValue={settings.whatsapp} />
        <Field label="Adres" name="address" defaultValue={settings.address} />
      </div>

      <Field label="Google Maps URL" name="googleMapsUrl" defaultValue={settings.googleMapsUrl} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Facebook URL" name="facebookUrl" defaultValue={settings.facebookUrl} />
        <Field label="Instagram URL" name="instagramUrl" defaultValue={settings.instagramUrl} />
        <Field label="LinkedIn URL" name="linkedinUrl" defaultValue={settings.linkedinUrl} />
      </div>

      {state.status !== "idle" && (
        <p className={`text-sm ${state.status === "success" ? "text-green-400" : "text-red-400"}`} role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-2.5 text-sm font-medium text-white hover:from-red-600 hover:to-amber-600 disabled:opacity-50"
      >
        {isPending ? "Bezig met opslaan..." : "Opslaan"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm text-white/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className={inputClasses}
      />
    </div>
  );
}
