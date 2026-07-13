import "server-only";

import {
  resolveLeadEmailServiceBlocks,
  resolveLeadEmailServiceId,
} from "@/config/leadEmailServiceBlocks";
import type {
  AiReplyDraft,
  EmailLocale,
  EmailSettings,
  EmailSettingsAdminView,
  EmailTemplateInput,
  LeadEmailData,
  RenderedEmail,
} from "@/types/email";

import { renderBrandingHtml } from "@/lib/email/brandingDefaults";

const SITE_URL = "https://visualvibe.media";
const LOGO_URL = `${SITE_URL}/logo.svg`;

type CustomerCopy = {
  subject: string;
  greeting: (firstName: string) => string;
  thanks: string;
  received: string;
  reference: string;
  services: string;
  question: string;
  prepare: string;
  next: string;
  nextBody: string;
  appointment: string;
  contact: string;
};

const CUSTOMER_COPY: Record<EmailLocale, CustomerCopy> = {
  nl: {
    subject: "We hebben je aanvraag goed ontvangen",
    greeting: (firstName) => `Hallo${firstName ? ` ${firstName}` : ""},`,
    thanks: "Bedankt voor je aanvraag bij VisualVibe.",
    received: "We hebben je gegevens veilig ontvangen en bekijken wat je project nodig heeft.",
    reference: "Referentie",
    services: "Gekozen diensten",
    question: "Samenvatting van je vraag",
    prepare: "Handig om alvast klaar te leggen",
    next: "Volgende stap",
    nextBody: "Jens bekijkt je aanvraag en neemt persoonlijk contact met je op om de juiste aanpak af te stemmen.",
    appointment: "Plan een gesprek",
    contact: "Je kunt rechtstreeks op deze e-mail antwoorden als je nog iets wilt toevoegen.",
  },
  fr: {
    subject: "Nous avons bien reçu votre demande",
    greeting: (firstName) => `Bonjour${firstName ? ` ${firstName}` : ""},`,
    thanks: "Merci pour votre demande auprès de VisualVibe.",
    received: "Vos informations ont bien été reçues. Nous allons examiner les besoins de votre projet.",
    reference: "Référence",
    services: "Services sélectionnés",
    question: "Résumé de votre demande",
    prepare: "Informations utiles à préparer",
    next: "Prochaine étape",
    nextBody: "Jens examine votre demande et vous contacte personnellement afin de définir la bonne approche.",
    appointment: "Planifier un entretien",
    contact: "Vous pouvez répondre directement à cet e-mail si vous souhaitez ajouter une information.",
  },
  en: {
    subject: "We have received your request",
    greeting: (firstName) => `Hello${firstName ? ` ${firstName}` : ""},`,
    thanks: "Thank you for contacting VisualVibe.",
    received: "We received your details safely and will review what your project needs.",
    reference: "Reference",
    services: "Selected services",
    question: "Summary of your request",
    prepare: "Useful information to prepare",
    next: "Next step",
    nextBody: "Jens will review your request and contact you personally to discuss the right approach.",
    appointment: "Schedule a call",
    contact: "You can reply directly to this email if you would like to add anything.",
  },
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function cleanText(value: string | undefined): string {
  return (value ?? "").replace(/\0/g, "").trim();
}

function cleanSubject(value: string): string {
  return cleanText(value).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").slice(0, 180);
}

function firstName(name: string): string {
  return cleanText(name).split(/\s+/)[0] ?? "";
}

function safeLeadNumber(value: string): string {
  const safe = cleanText(value).toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 40);
  return safe || "LEAD-VV";
}

function subjectWithLeadNumber(leadNumber: string, subject: string): string {
  const reference = safeLeadNumber(leadNumber);
  const clean = cleanSubject(subject).replace(new RegExp(`^\\[${reference}\\]\\s*`, "i"), "");
  return `[${reference}] ${clean}`.slice(0, 250);
}

function localeFor(lead: LeadEmailData, settings: EmailSettings | EmailSettingsAdminView): EmailLocale {
  return lead.locale || settings.automation.defaultLocale;
}

function absoluteUrl(value: string | undefined): string | null {
  const clean = cleanText(value);
  if (!clean) return null;
  try {
    const url = new URL(clean, SITE_URL);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function paragraphHtml(value: string): string {
  return escapeHtml(cleanText(value)).replace(/\r?\n/g, "<br>");
}

function listHtml(items: readonly string[]): string {
  if (!items.length) return "";
  return `<ul style="margin:8px 0 0;padding:0 0 0 20px;color:#242424;">${items
    .map((item) => `<li style="margin:0 0 7px;line-height:1.55;">${escapeHtml(cleanText(item))}</li>`)
    .join("")}</ul>`;
}

function sectionHtml(title: string, content: string): string {
  return `<div style="margin:24px 0 0;"><h2 style="margin:0 0 9px;font-family:Arial,sans-serif;font-size:17px;line-height:1.3;color:#111111;">${escapeHtml(title)}</h2>${content}</div>`;
}

function detailTable(rows: Array<[string, string | undefined]>): string {
  const visible = rows.filter(([, value]) => cleanText(value));
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #ece7e1;border-radius:10px;overflow:hidden;">${visible
    .map(
      ([label, value], index) =>
        `<tr><td style="width:34%;padding:10px 12px;border-bottom:${index === visible.length - 1 ? "0" : "1px solid #ece7e1"};background:#faf8f5;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#645d55;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:${index === visible.length - 1 ? "0" : "1px solid #ece7e1"};font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#242424;vertical-align:top;">${paragraphHtml(value ?? "")}</td></tr>`,
    )
    .join("")}</table>`;
}

type LayoutInput = {
  preheader: string;
  title: string;
  bodyHtml: string;
  settings: EmailSettings | EmailSettingsAdminView;
  locale?: EmailLocale;
  cta?: { label: string; url: string } | null;
};

/**
 * Signatuurblok (naam/rol/telefoon/e-mail/site) dat in beide lay-outvarianten
 * onder de inhoud staat.
 */
function signatureHtml(settings: EmailSettings | EmailSettingsAdminView): string {
  const signature = settings.automation;
  const website = absoluteUrl(signature.signatureWebsite);
  return `<tr><td style="padding:22px 30px;background:#faf8f5;border-top:1px solid #ece7e1;font-family:Arial,sans-serif;color:#4a4641;font-size:12px;line-height:1.6;"><strong style="color:#171717;">${escapeHtml(cleanText(signature.signatureName) || "VisualVibe")}</strong>${signature.signatureRole ? `<br>${escapeHtml(cleanText(signature.signatureRole))}` : ""}${signature.signaturePhone ? `<br>${escapeHtml(cleanText(signature.signaturePhone))}` : ""}${signature.signatureEmail ? `<br><a href="mailto:${escapeHtml(cleanText(signature.signatureEmail))}" style="color:#c95600;text-decoration:none;">${escapeHtml(cleanText(signature.signatureEmail))}</a>` : ""}${website ? `<br><a href="${escapeHtml(website)}" style="color:#c95600;text-decoration:none;">${escapeHtml(website.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>` : ""}</td></tr>`;
}

/**
 * Gebrande lay-out: de admin-beheerde header- en footer-HTML (Opmaak-tab)
 * sluiten als donkere, afgeronde boven- en onderkant aan op een donkere
 * connector; de inhoud zelf blijft een witte kaart zodat alle bestaande
 * bodyHtml (tabellen, teksten) leesbaar blijft.
 */
function renderBrandedHtmlLayout(
  { preheader, title, bodyHtml, settings, locale = "nl", cta }: LayoutInput,
  headerHtml: string,
  footerHtml: string,
): string {
  return `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;color:#171717;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
${headerHtml}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;"><tr><td align="center" style="padding:0 12px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;border-collapse:separate;background:#050505;border-left:1px solid #242424;border-right:1px solid #242424;">
<tr><td style="padding:22px 24px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate;background:#ffffff;border-radius:14px;overflow:hidden;">
<tr><td style="padding:26px 28px 28px;"><h1 style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:24px;line-height:1.22;color:#111111;">${escapeHtml(title)}</h1>${bodyHtml}${cta ? `<div style="margin:26px 0 2px;"><a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:13px 20px;border-radius:9px;background:#ff7500;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;">${escapeHtml(cta.label)}</a></div>` : ""}</td></tr>
${signatureHtml(settings)}
</table>
</td></tr></table></td></tr></table>
${footerHtml}
</body></html>`;
}

/** The single VisualVibe HTML layout used by every outgoing email. */
function renderHtmlLayout(input: LayoutInput): string {
  const { preheader, title, bodyHtml, settings, locale = "nl", cta } = input;
  const branding = settings.branding;
  const headerHtml = renderBrandingHtml(branding?.headerHtml?.trim() ?? "");
  const footerHtml = renderBrandingHtml(branding?.footerHtml?.trim() ?? "");
  if (headerHtml || footerHtml) {
    return renderBrandedHtmlLayout(input, headerHtml, footerHtml);
  }
  const signature = settings.automation;
  const website = absoluteUrl(signature.signatureWebsite);
  return `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f3f3f3;color:#171717;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:#f3f3f3;"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;border-collapse:separate;background:#ffffff;border:1px solid #e8e5e1;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.06);">
<tr><td style="height:5px;background:#ff7500;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:25px 30px 15px;"><img src="${LOGO_URL}" width="180" alt="VisualVibe" style="display:block;width:180px;max-width:100%;height:auto;border:0;"></td></tr>
<tr><td style="padding:10px 30px 30px;"><h1 style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:25px;line-height:1.22;color:#111111;">${escapeHtml(title)}</h1>${bodyHtml}${cta ? `<div style="margin:26px 0 2px;"><a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:13px 20px;border-radius:9px;background:#ff7500;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;">${escapeHtml(cta.label)}</a></div>` : ""}</td></tr>
<tr><td style="padding:22px 30px;background:#faf8f5;border-top:1px solid #ece7e1;font-family:Arial,sans-serif;color:#4a4641;font-size:12px;line-height:1.6;"><strong style="color:#171717;">${escapeHtml(cleanText(signature.signatureName) || "VisualVibe")}</strong>${signature.signatureRole ? `<br>${escapeHtml(cleanText(signature.signatureRole))}` : ""}${signature.signaturePhone ? `<br>${escapeHtml(cleanText(signature.signaturePhone))}` : ""}${signature.signatureEmail ? `<br><a href="mailto:${escapeHtml(cleanText(signature.signatureEmail))}" style="color:#c95600;text-decoration:none;">${escapeHtml(cleanText(signature.signatureEmail))}</a>` : ""}${website ? `<br><a href="${escapeHtml(website)}" style="color:#c95600;text-decoration:none;">${escapeHtml(website.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>` : ""}</td></tr>
</table></td></tr></table></body></html>`;
}

function renderTextLayout(
  title: string,
  sections: Array<string | undefined>,
  settings: EmailSettings | EmailSettingsAdminView,
  cta?: { label: string; url: string } | null,
): string {
  const signature = settings.automation;
  return [
    title,
    "",
    ...sections.filter((section): section is string => Boolean(cleanText(section))),
    ...(cta ? [`${cta.label}: ${cta.url}`] : []),
    "",
    cleanText(signature.signatureName) || "VisualVibe",
    cleanText(signature.signatureRole),
    cleanText(signature.signaturePhone),
    cleanText(signature.signatureEmail),
    cleanText(signature.signatureWebsite),
  ]
    .filter((line, index, all) => line !== "" || (index > 0 && all[index - 1] !== ""))
    .join("\n")
    .trim();
}

function selectedServiceLabels(lead: LeadEmailData, locale: EmailLocale): string[] {
  const blocks = resolveLeadEmailServiceBlocks(lead.selectedServices, locale);
  const known = new Map(blocks.map((block) => [block.id, block.label]));
  const labels: string[] = [];
  const seen = new Set<string>();
  for (const selected of lead.selectedServices) {
    const id = resolveLeadEmailServiceId(selected);
    const label = id ? known.get(id) ?? selected : cleanText(selected);
    const key = label.toLowerCase();
    if (label && !seen.has(key)) {
      seen.add(key);
      labels.push(label);
    }
  }
  return labels;
}

export function renderCustomerConfirmation(input: EmailTemplateInput): RenderedEmail {
  const { lead, settings } = input;
  const locale = localeFor(lead, settings);
  const copy = CUSTOMER_COPY[locale];
  const name = firstName(lead.name);
  const reference = safeLeadNumber(lead.leadNumber);
  const blocks = resolveLeadEmailServiceBlocks(lead.selectedServices, locale);
  const labels = selectedServiceLabels(lead, locale);
  const responseExpectation = cleanText(settings.automation.responseExpectationText);
  const appointment = absoluteUrl(settings.automation.appointmentUrl);
  const subject = subjectWithLeadNumber(
    reference,
    `${copy.subject}${name ? `, ${name}` : ""}`,
  );

  const serviceSummary = labels.length
    ? sectionHtml(copy.services, `<p style="margin:0;line-height:1.6;color:#242424;">${escapeHtml(labels.join(", "))}</p>`)
    : "";
  const preparation = blocks
    .map((block) => sectionHtml(`${copy.prepare}: ${block.label}`, listHtml(block.preparationPoints)))
    .join("");
  const nextText = `${copy.nextBody}${responseExpectation ? ` ${responseExpectation}` : ""}`;
  const bodyHtml = [
    `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#242424;">${escapeHtml(copy.greeting(name))}</p>`,
    `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#242424;">${escapeHtml(copy.thanks)} ${escapeHtml(copy.received)}</p>`,
    `<p style="margin:0;font-size:13px;color:#645d55;"><strong>${escapeHtml(copy.reference)}:</strong> ${escapeHtml(reference)}</p>`,
    serviceSummary,
    cleanText(lead.message)
      ? sectionHtml(copy.question, `<p style="margin:0;line-height:1.65;color:#242424;">${paragraphHtml(lead.message)}</p>`)
      : "",
    preparation,
    sectionHtml(copy.next, `<p style="margin:0;line-height:1.65;color:#242424;">${escapeHtml(nextText)}</p>`),
    `<p style="margin:24px 0 0;line-height:1.65;color:#645d55;">${escapeHtml(copy.contact)}</p>`,
  ].join("");

  const textSections = [
    copy.greeting(name),
    `${copy.thanks} ${copy.received}`,
    `${copy.reference}: ${reference}`,
    labels.length ? `${copy.services}: ${labels.join(", ")}` : undefined,
    cleanText(lead.message) ? `${copy.question}:\n${cleanText(lead.message)}` : undefined,
    ...blocks.map(
      (block) => `${copy.prepare}: ${block.label}\n${block.preparationPoints.map((point) => `- ${point}`).join("\n")}`,
    ),
    `${copy.next}:\n${nextText}`,
    copy.contact,
  ];
  const cta = appointment ? { label: copy.appointment, url: appointment } : null;

  return {
    subject,
    html: renderHtmlLayout({ preheader: subject, title: copy.subject, bodyHtml, settings, locale, cta }),
    text: renderTextLayout(copy.subject, textSections, settings, cta),
    replyTo: settings.smtp.replyTo || undefined,
  };
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return cleanText(value);
  return new Intl.DateTimeFormat("nl-BE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Brussels" }).format(date);
}

export function renderAdminNotification(input: EmailTemplateInput): RenderedEmail {
  const { lead, settings } = input;
  const labels = selectedServiceLabels(lead, "nl");
  const reference = safeLeadNumber(lead.leadNumber);
  const nameOrCompany = cleanText(lead.company) || cleanText(lead.name) || "Onbekende aanvrager";
  const subject = subjectWithLeadNumber(
    reference,
    `Nieuwe lead: ${nameOrCompany}${labels.length ? ` - ${labels.join(", ")}` : ""}`,
  );
  const campaign = [
    lead.utmSource ? `bron: ${lead.utmSource}` : "",
    lead.utmMedium ? `medium: ${lead.utmMedium}` : "",
    lead.utmCampaign ? `campagne: ${lead.utmCampaign}` : "",
  ].filter(Boolean).join(" | ");
  const rows: Array<[string, string | undefined]> = [
    ["Leadnummer", reference],
    ["Naam", lead.name],
    ["Bedrijf", lead.company],
    ["E-mail", lead.email],
    ["Telefoon", lead.phone],
    ["Diensten", labels.join(", ")],
    ["Formulier", lead.formType],
    ["Taal", lead.locale],
    ["Regio", lead.region],
    ["Bronpagina", lead.sourcePage],
    ["Bron-URL", lead.sourceUrl],
    ["Campagne", campaign],
    ["Datum", formatDate(lead.createdAt)],
  ];
  const adminUrl = absoluteUrl(lead.adminDetailUrl);
  const bodyHtml = [
    `<p style="margin:0 0 18px;line-height:1.6;color:#242424;">Er is een nieuwe aanvraag veilig opgeslagen.</p>`,
    detailTable(rows),
    sectionHtml("Bericht", `<p style="margin:0;line-height:1.65;color:#242424;">${paragraphHtml(lead.message)}</p>`),
    lead.aiSummary
      ? sectionHtml("AI-samenvatting", `<p style="margin:0;line-height:1.65;color:#242424;">${paragraphHtml(lead.aiSummary)}</p>`)
      : "",
    lead.missingInformation?.length
      ? sectionHtml("Ontbrekende informatie", listHtml(lead.missingInformation))
      : "",
    lead.suggestedNextAction
      ? sectionHtml("Voorgestelde vervolgactie", `<p style="margin:0;line-height:1.65;color:#242424;">${paragraphHtml(lead.suggestedNextAction)}</p>`)
      : "",
  ].join("");
  const textRows = rows.filter(([, value]) => cleanText(value)).map(([label, value]) => `${label}: ${cleanText(value)}`);
  const textSections = [
    ...textRows,
    `Bericht:\n${cleanText(lead.message)}`,
    lead.aiSummary ? `AI-samenvatting:\n${cleanText(lead.aiSummary)}` : undefined,
    lead.missingInformation?.length
      ? `Ontbrekende informatie:\n${lead.missingInformation.map((item) => `- ${cleanText(item)}`).join("\n")}`
      : undefined,
    lead.suggestedNextAction ? `Voorgestelde vervolgactie:\n${cleanText(lead.suggestedNextAction)}` : undefined,
  ];
  const cta = adminUrl ? { label: "Open lead in de backend", url: adminUrl } : null;

  return {
    subject,
    html: renderHtmlLayout({ preheader: subject, title: "Nieuwe lead", bodyHtml, settings, locale: "nl", cta }),
    text: renderTextLayout("Nieuwe lead", textSections, settings, cta),
    replyTo: cleanText(lead.email) || undefined,
  };
}

export function renderAiReplyEmail(input: EmailTemplateInput, draft: AiReplyDraft): RenderedEmail {
  const { lead, settings } = input;
  const locale = localeFor(lead, settings);
  const selectedIds = new Set(
    lead.selectedServices.map(resolveLeadEmailServiceId).filter((id): id is NonNullable<typeof id> => Boolean(id)),
  );
  const serviceSections = draft.serviceSections.filter((section) => {
    const id = resolveLeadEmailServiceId(section.serviceId);
    return Boolean(id && selectedIds.has(id));
  });
  const subject = subjectWithLeadNumber(lead.leadNumber, cleanSubject(draft.subject) || CUSTOMER_COPY[locale].subject);
  const bodyHtml = [
    draft.greeting
      ? `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#242424;">${paragraphHtml(draft.greeting)}</p>`
      : "",
    draft.summary
      ? `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#242424;">${paragraphHtml(draft.summary)}</p>`
      : "",
    ...serviceSections.map((section) =>
      sectionHtml(cleanText(section.title), `<p style="margin:0;line-height:1.65;color:#242424;">${paragraphHtml(section.body)}</p>`),
    ),
    draft.questions.length ? sectionHtml(locale === "fr" ? "Questions" : locale === "en" ? "Questions" : "Vragen", listHtml(draft.questions)) : "",
    draft.nextStep
      ? sectionHtml(CUSTOMER_COPY[locale].next, `<p style="margin:0;line-height:1.65;color:#242424;">${paragraphHtml(draft.nextStep)}</p>`)
      : "",
    draft.closing
      ? `<p style="margin:24px 0 0;line-height:1.65;color:#242424;">${paragraphHtml(draft.closing)}</p>`
      : "",
  ].join("");
  const textSections = [
    cleanText(draft.greeting),
    cleanText(draft.summary),
    ...serviceSections.map((section) => `${cleanText(section.title)}\n${cleanText(section.body)}`),
    draft.questions.length ? draft.questions.map((question) => `- ${cleanText(question)}`).join("\n") : undefined,
    cleanText(draft.nextStep),
    cleanText(draft.closing),
  ];

  return {
    subject,
    html: renderHtmlLayout({ preheader: subject, title: cleanSubject(draft.subject) || CUSTOMER_COPY[locale].subject, bodyHtml, settings, locale }),
    text: renderTextLayout(cleanSubject(draft.subject) || CUSTOMER_COPY[locale].subject, textSections, settings),
    replyTo: settings.smtp.replyTo || undefined,
  };
}

export function renderEmailPreview(
  settings: EmailSettings | EmailSettingsAdminView,
  locale: EmailLocale = settings.automation.defaultLocale,
): RenderedEmail {
  return renderCustomerConfirmation({
    settings,
    lead: {
      id: "preview",
      leadNumber: "LEAD-VV-2026-0042",
      formType: "offerte",
      locale,
      name: locale === "fr" ? "Marie Dupont" : locale === "en" ? "Alex Johnson" : "Sofie Peeters",
      email: "klant@example.com",
      company: "Voorbeeld BV",
      selectedServices: ["webdesign", "fotografie"],
      message: locale === "fr"
        ? "Nous souhaitons renouveler notre site et créer de nouvelles photos d'entreprise."
        : locale === "en"
          ? "We would like to renew our website and create new company photography."
          : "We willen onze website vernieuwen en nieuwe bedrijfsfoto's laten maken.",
      sourcePage: "/offerte-aanvragen/",
      createdAt: new Date().toISOString(),
    },
  });
}

// ---------------------------------------------------------------------------
// Websiteanalyse: verificatiecode, rapportmail en interne melding
// ---------------------------------------------------------------------------

function analysisScoreText(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function renderAnalysisVerificationEmail(input: {
  firstName: string;
  code: string;
  ttlMinutes: number;
  settings: EmailSettings | EmailSettingsAdminView;
}): RenderedEmail {
  const { settings } = input;
  const name = firstName(input.firstName);
  const code = cleanText(input.code);
  const ttlMinutes = Math.max(1, Math.round(input.ttlMinutes));
  const subject = cleanSubject(`Je verificatiecode: ${code}`);
  const title = "Bevestig je e-mailadres";
  const intro =
    "Gebruik onderstaande code om je e-mailadres te bevestigen en je gratis websiteanalyse te starten.";
  const validity = `De code is ${ttlMinutes} ${ttlMinutes === 1 ? "minuut" : "minuten"} geldig.`;
  const ignore = "Heb je geen analyse aangevraagd? Dan kun je deze e-mail gewoon negeren.";

  const bodyHtml = [
    `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#242424;">${escapeHtml(CUSTOMER_COPY.nl.greeting(name))}</p>`,
    `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#242424;">${escapeHtml(intro)}</p>`,
    `<div style="margin:20px 0;padding:18px 20px;border:1px solid #ece7e1;border-radius:12px;background:#faf8f5;text-align:center;"><span style="font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:bold;letter-spacing:8px;color:#111111;">${escapeHtml(code)}</span></div>`,
    `<p style="margin:0;font-size:14px;line-height:1.65;color:#242424;">${escapeHtml(validity)}</p>`,
    `<p style="margin:20px 0 0;font-size:13px;line-height:1.65;color:#645d55;">${escapeHtml(ignore)}</p>`,
  ].join("");
  const textSections = [
    CUSTOMER_COPY.nl.greeting(name),
    intro,
    `Verificatiecode: ${code}`,
    validity,
    ignore,
  ];

  return {
    subject,
    html: renderHtmlLayout({
      preheader: "Bevestig je e-mailadres om je gratis websiteanalyse te starten.",
      title,
      bodyHtml,
      settings,
      locale: "nl",
    }),
    text: renderTextLayout(title, textSections, settings),
    replyTo: settings.smtp.replyTo || undefined,
  };
}

export function renderAnalysisReportEmail(input: {
  firstName: string;
  domain: string;
  score?: number;
  criticalIssues: string[];
  reportUrl: string;
  settings: EmailSettings | EmailSettingsAdminView;
}): RenderedEmail {
  const { settings } = input;
  const name = firstName(input.firstName);
  const domain = cleanText(input.domain) || "je website";
  const issues = input.criticalIssues
    .map((issue) => cleanText(issue))
    .filter(Boolean)
    .slice(0, 3);
  const score =
    typeof input.score === "number" && Number.isFinite(input.score) ? input.score : undefined;
  const reportUrl = absoluteUrl(input.reportUrl);
  const subject = cleanSubject(
    name ? `${name}, je websiteanalyse is klaar` : "Je websiteanalyse is klaar",
  );
  const title = "Je websiteanalyse is klaar";
  const intro = `We hebben ${domain} doorgelicht. Hieronder zie je de belangrijkste punten; het volledige rapport staat online voor je klaar.`;
  const nextStep =
    "Wil je weten hoe je deze punten het beste aanpakt? We bespreken het rapport graag met je en maken vrijblijvend een offerte op maat.";
  const contact = "Je kunt rechtstreeks op deze e-mail antwoorden, we denken graag met je mee.";

  const bodyHtml = [
    `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#242424;">${escapeHtml(CUSTOMER_COPY.nl.greeting(name))}</p>`,
    `<p style="margin:0 0 12px;font-size:15px;line-height:1.65;color:#242424;">${escapeHtml(intro)}</p>`,
    score !== undefined
      ? `<div style="margin:20px 0;padding:16px 20px;border:1px solid #ece7e1;border-radius:12px;background:#faf8f5;text-align:center;"><p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#645d55;">Totaalscore</p><p style="margin:0;font-family:Arial,sans-serif;font-size:34px;font-weight:bold;line-height:1.1;color:#c95600;">${escapeHtml(analysisScoreText(score))}</p></div>`
      : "",
    issues.length ? sectionHtml("Belangrijkste bevindingen", listHtml(issues)) : "",
    sectionHtml(
      "Volgende stap",
      `<p style="margin:0;line-height:1.65;color:#242424;">${escapeHtml(nextStep)}</p>`,
    ),
    `<p style="margin:24px 0 0;line-height:1.65;color:#645d55;">${escapeHtml(contact)}</p>`,
  ].join("");
  const textSections = [
    CUSTOMER_COPY.nl.greeting(name),
    intro,
    score !== undefined ? `Totaalscore: ${analysisScoreText(score)}` : undefined,
    issues.length
      ? `Belangrijkste bevindingen:\n${issues.map((issue) => `- ${issue}`).join("\n")}`
      : undefined,
    `Volgende stap:\n${nextStep}`,
    contact,
  ];
  const cta = reportUrl ? { label: "Bekijk het volledige rapport", url: reportUrl } : null;

  return {
    subject,
    html: renderHtmlLayout({ preheader: subject, title, bodyHtml, settings, locale: "nl", cta }),
    text: renderTextLayout(title, textSections, settings, cta),
    replyTo: settings.smtp.replyTo || undefined,
  };
}

const ANALYSIS_ADMIN_KIND_COPY = {
  completed: {
    label: "voltooid",
    title: "Websiteanalyse voltooid",
    intro: "De websiteanalyse is afgerond en het rapport is naar de aanvrager gemaild.",
  },
  limit_reached: {
    label: "limiet bereikt",
    title: "Analyselimiet bereikt",
    intro:
      "Deze aanvrager heeft de analyselimiet bereikt en kreeg geen nieuw rapport. Mogelijk een warme lead om persoonlijk op te volgen.",
  },
  failed: {
    label: "mislukt",
    title: "Websiteanalyse mislukt",
    intro: "De websiteanalyse is mislukt. Bekijk de lead en volg de aanvrager indien nodig handmatig op.",
  },
} as const;

export function renderAnalysisAdminNotification(input: {
  analysisLead: {
    firstName: string;
    email: string;
    companyName?: string;
    submittedUrl: string;
    normalizedDomain: string;
    analysisScore?: number;
    criticalIssues?: string[];
    quotaDecision?: string;
    status: string;
    leadNumber?: string;
  };
  kind: "completed" | "limit_reached" | "failed";
  adminDetailUrl?: string;
  settings: EmailSettings | EmailSettingsAdminView;
}): RenderedEmail {
  const { analysisLead, settings } = input;
  const copy = ANALYSIS_ADMIN_KIND_COPY[input.kind];
  const domain =
    cleanText(analysisLead.normalizedDomain) ||
    cleanText(analysisLead.submittedUrl) ||
    "onbekend domein";
  const score =
    typeof analysisLead.analysisScore === "number" && Number.isFinite(analysisLead.analysisScore)
      ? analysisLead.analysisScore
      : undefined;
  const issues = (analysisLead.criticalIssues ?? []).map((issue) => cleanText(issue)).filter(Boolean);
  const subject = subjectWithLeadNumber(
    analysisLead.leadNumber ?? "ANALYSE",
    `Websiteanalyse ${domain}: ${copy.label}`,
  );
  const rows: Array<[string, string | undefined]> = [
    ["Resultaat", copy.label],
    ["Voornaam", analysisLead.firstName],
    ["Bedrijf", analysisLead.companyName],
    ["E-mail", analysisLead.email],
    ["Ingediende URL", analysisLead.submittedUrl],
    ["Domein", analysisLead.normalizedDomain],
    ["Totaalscore", score !== undefined ? analysisScoreText(score) : undefined],
    ["Quotabeslissing", analysisLead.quotaDecision],
    ["Status", analysisLead.status],
    ["Leadnummer", analysisLead.leadNumber],
  ];
  const adminUrl = absoluteUrl(input.adminDetailUrl);
  const bodyHtml = [
    `<p style="margin:0 0 18px;line-height:1.6;color:#242424;">${escapeHtml(copy.intro)}</p>`,
    detailTable(rows),
    issues.length ? sectionHtml("Belangrijkste bevindingen", listHtml(issues)) : "",
  ].join("");
  const textRows = rows
    .filter(([, value]) => cleanText(value))
    .map(([label, value]) => `${label}: ${cleanText(value)}`);
  const textSections = [
    copy.intro,
    ...textRows,
    issues.length
      ? `Belangrijkste bevindingen:\n${issues.map((issue) => `- ${issue}`).join("\n")}`
      : undefined,
  ];
  const cta = adminUrl ? { label: "Open lead in de backend", url: adminUrl } : null;

  return {
    subject,
    html: renderHtmlLayout({ preheader: subject, title: copy.title, bodyHtml, settings, locale: "nl", cta }),
    text: renderTextLayout(copy.title, textSections, settings, cta),
    replyTo: cleanText(analysisLead.email) || undefined,
  };
}
