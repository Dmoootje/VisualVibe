"use client";

import { useActionState } from "react";
import { saveContactSettings, type SettingsFormState } from "@/lib/admin/settingsActions";
import type { SiteSettings } from "@/types";
import { OpeningHoursEditor } from "./OpeningHoursEditor";

const initialState: SettingsFormState = { status: "idle" };

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500/70";

export function SettingsContactForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(saveContactSettings, initialState);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-10">
      <Section title="1. Bedrijfsgegevens">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bedrijfsnaam *" name="companyName" defaultValue={settings.companyName} required />
          <Field label="Contactpersoon" name="contactPerson" defaultValue={settings.contactPerson} />
          <Field label="Contact-e-mail *" name="mainEmail" type="email" defaultValue={settings.mainEmail} required />
          <Field
            label="Notificatie-e-mail (leads) *"
            name="leadNotificationEmail"
            type="email"
            defaultValue={settings.leadNotificationEmail}
            required
          />
          <Field label="Telefoon" name="phone" defaultValue={settings.phone} />
          <Field label="Mobiel" name="mobilePhone" defaultValue={settings.mobilePhone} />
          <Field label="WhatsApp" name="whatsapp" defaultValue={settings.whatsapp} />
          <Field label="BTW-nummer" name="vatNumber" defaultValue={settings.vatNumber} />
          <Field label="Reactietijd (tekst)" name="responseTimeText" defaultValue={settings.responseTimeText} />
        </div>
      </Section>

      <Section title="2. Adresgegevens">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Straat" name="street" defaultValue={settings.street} />
          <Field label="Huisnummer" name="houseNumber" defaultValue={settings.houseNumber} />
          <Field label="Postcode" name="postalCode" defaultValue={settings.postalCode} />
          <Field label="Stad" name="city" defaultValue={settings.city} />
          <Field label="Provincie" name="province" defaultValue={settings.province} />
          <Field label="Land" name="country" defaultValue={settings.country} />
        </div>
        <Field label="Volledig adres (weergave)" name="fullAddress" defaultValue={settings.fullAddress} />
      </Section>

      <Section title="3. Kaart & locatie">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude" name="latitude" defaultValue={settings.latitude?.toString()} />
          <Field label="Longitude" name="longitude" defaultValue={settings.longitude?.toString()} />
          <Field label="Kaart-marker titel" name="mapMarkerTitle" defaultValue={settings.mapMarkerTitle} />
          <Field label="Route-URL (Bekijk route)" name="routeUrl" defaultValue={settings.routeUrl} />
        </div>
        <Field label="Google Maps URL" name="googleMapsUrl" defaultValue={settings.googleMapsUrl} />
        <Field
          label="Google Maps embed-URL (iframe src)"
          name="googleMapsEmbedUrl"
          defaultValue={settings.googleMapsEmbedUrl}
          hint="Optioneel. Plak de embed-link uit Google Maps (Delen > Kaart insluiten): een https://www.google.com/maps/embed?... URL of de volledige <iframe> code. Een gewone deel-link werkt niet. Leeg = donkere neon fallback-kaart."
        />
        <Field label="Kaartomschrijving" name="mapDescription" defaultValue={settings.mapDescription} />
      </Section>

      <Section title="4. Openingsuren">
        <OpeningHoursEditor value={settings.openingHours} />
      </Section>

      <Section title="5. Social links">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Facebook" name="facebookUrl" defaultValue={settings.facebookUrl} />
          <Field label="Instagram" name="instagramUrl" defaultValue={settings.instagramUrl} />
          <Field label="LinkedIn" name="linkedinUrl" defaultValue={settings.linkedinUrl} />
          <Field label="YouTube" name="youtubeUrl" defaultValue={settings.youtubeUrl} />
          <Field label="TikTok" name="tiktokUrl" defaultValue={settings.tiktokUrl} />
        </div>
      </Section>

      <Section title="6. Contact-CTA's">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Afspraak - titel" name="appointmentTitle" defaultValue={settings.appointmentTitle} />
          <Field label="Afspraak - knoptekst" name="appointmentButtonLabel" defaultValue={settings.appointmentButtonLabel} />
        </div>
        <Field label="Afspraak - tekst" name="appointmentText" defaultValue={settings.appointmentText} />
        <Field label="Afspraak - knop-URL" name="appointmentButtonUrl" defaultValue={settings.appointmentButtonUrl} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Snel contact - titel" name="urgentContactTitle" defaultValue={settings.urgentContactTitle} />
          <Field label="Snel contact - knoptekst" name="urgentContactButtonLabel" defaultValue={settings.urgentContactButtonLabel} />
        </div>
        <Field label="Snel contact - tekst" name="urgentContactText" defaultValue={settings.urgentContactText} />
        <Field label="Snel contact - knop-URL" name="urgentContactButtonUrl" defaultValue={settings.urgentContactButtonUrl} />
      </Section>

      {state.status !== "idle" && (
        <p
          className={`text-sm ${state.status === "success" ? "text-emerald-400" : "text-red-400"}`}
          role="alert"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="sticky bottom-4 self-start rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/20 hover:from-red-600 hover:to-amber-600 disabled:opacity-50"
      >
        {isPending ? "Bezig met opslaan..." : "Contactgegevens opslaan"}
      </button>
    </form>
  );

  function Field({
    label,
    name,
    type = "text",
    defaultValue,
    required,
    hint,
  }: {
    label: string;
    name: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
    hint?: string;
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
        {hint && <span className="text-xs text-white/40">{hint}</span>}
      </div>
    );
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-white/10 pb-2 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}
