import "server-only";

import { renderBrandingHtml } from "@/lib/email/brandingDefaults";
import { emailHtmlToText, sanitizeEmailHtml } from "@/lib/email/sanitizeEmailHtml";
import { escapeHtml } from "@/lib/email/templates";
import type { EmailSettings } from "@/types/email";
import {
  formatEmailAddress,
  type EmailMailbox,
  type EmailMessage,
  type EmailTemplateMode,
} from "@/types/emailClient";

// Rendering van uitgaande e-mailclientberichten. Hergebruikt de bestaande
// VisualVibe-branding (email_settings.branding: header/footer met
// logo-email.png) en de bestaande handtekeninggegevens; de keuze
// header+footer / alleen footer / geen template ligt bij de opsteller.

function defaultSignatureHtml(settings: EmailSettings): string {
  const signature = settings.automation;
  const lines = [
    `<strong style="color:#171717;">${escapeHtml(signature.signatureName || "VisualVibe")}</strong>`,
    signature.signatureRole ? escapeHtml(signature.signatureRole) : "",
    signature.signaturePhone ? escapeHtml(signature.signaturePhone) : "",
    signature.signatureEmail
      ? `<a href="mailto:${escapeHtml(signature.signatureEmail)}" style="color:#c95600;text-decoration:none;">${escapeHtml(signature.signatureEmail)}</a>`
      : "",
    signature.signatureWebsite
      ? `<a href="${escapeHtml(signature.signatureWebsite)}" style="color:#c95600;text-decoration:none;">${escapeHtml(signature.signatureWebsite.replace(/^https?:\/\//, ""))}</a>`
      : "",
  ].filter(Boolean);
  return lines.join("<br>");
}

export function resolveSignatureHtml(mailbox: EmailMailbox, settings: EmailSettings): string {
  const custom = sanitizeEmailHtml(mailbox.signatureHtml);
  return custom.trim() ? custom : defaultSignatureHtml(settings);
}

function formatQuoteDate(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function messageBodyHtml(message: EmailMessage): string {
  if (message.htmlBody?.trim()) return message.htmlBody;
  const text = message.textBody ?? "";
  return `<p style="margin:0;line-height:1.6;">${escapeHtml(text).replace(/\r?\n/g, "<br>")}</p>`;
}

/** Geciteerd origineel bericht voor antwoorden ("Op ... schreef ...:"). */
export function buildReplyQuoteHtml(original: EmailMessage): string {
  const date = formatQuoteDate(original.dateKey);
  const author = escapeHtml(formatEmailAddress(original.from));
  return `<div style="margin-top:24px;">
<div style="color:#6b6b6b;font-size:13px;line-height:1.5;">Op ${escapeHtml(date)} schreef ${author}:</div>
<blockquote style="margin:8px 0 0;padding:2px 0 2px 14px;border-left:3px solid #d8d2ca;color:#555555;">${messageBodyHtml(original)}</blockquote>
</div>`;
}

/** Doorstuurblok met de originele kopregels, zoals Gmail dat doet. */
export function buildForwardQuoteHtml(original: EmailMessage): string {
  const rows: Array<[string, string]> = [
    ["Van", formatEmailAddress(original.from)],
    ["Datum", formatQuoteDate(original.dateKey)],
    ["Onderwerp", original.subject || "(zonder onderwerp)"],
    ["Aan", original.to.map(formatEmailAddress).join(", ")],
    ...(original.cc.length ? ([["Cc", original.cc.map(formatEmailAddress).join(", ")]] as Array<[string, string]>) : []),
  ];
  const header = rows
    .map(([label, value]) => `<div><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</div>`)
    .join("");
  return `<div style="margin-top:24px;">
<div style="color:#6b6b6b;font-size:13px;line-height:1.6;">---------- Doorgestuurd bericht ----------<br>${header}</div>
<div style="margin-top:12px;">${messageBodyHtml(original)}</div>
</div>`;
}

export type ComposeRenderInput = {
  mailbox: EmailMailbox;
  settings: EmailSettings;
  /** Reeds gesanitizede editor-HTML. */
  bodyHtml: string;
  templateMode: EmailTemplateMode;
  /** Optioneel geciteerd origineel (reply/forward). */
  quoteHtml?: string;
  includeSignature?: boolean;
};

export type ComposeRenderResult = {
  html: string;
  text: string;
};

function contentWithSignature(input: ComposeRenderInput): string {
  const signature =
    input.includeSignature === false
      ? ""
      : `<div style="margin-top:24px;color:#4a4641;font-size:13px;line-height:1.6;">${resolveSignatureHtml(input.mailbox, input.settings)}</div>`;
  return `${input.bodyHtml}${signature}${input.quoteHtml ?? ""}`;
}

/**
 * Wikkelt de opgestelde inhoud in de gekozen template:
 * - "full": bestaande VisualVibe-header + witte kaart + footer;
 * - "footer": witte kaart + footer (voor antwoorden zonder header);
 * - "none": kale, mailclientvriendelijke HTML met alleen de handtekening.
 */
export function renderComposedEmail(input: ComposeRenderInput): ComposeRenderResult {
  const content = contentWithSignature(input);
  const branding = input.settings.branding;
  const headerHtml = input.templateMode === "full" ? renderBrandingHtml(branding.headerHtml.trim()) : "";
  const footerHtml = input.templateMode !== "none" ? renderBrandingHtml(branding.footerHtml.trim()) : "";

  let html: string;
  if (input.templateMode === "none" || (!headerHtml && !footerHtml)) {
    html = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:16px;background:#ffffff;color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;">
${content}
</body></html>`;
  } else {
    // Zelfde donkere connector als de bestaande gebrande leadtemplates, zodat
    // header en footer naadloos op de witte inhoudskaart aansluiten.
    const connectorStyle = headerHtml
      ? "border-left:1px solid #242424;border-right:1px solid #242424;background:#050505;"
      : "";
    html = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;color:#171717;font-family:Arial,Helvetica,sans-serif;">
${headerHtml}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;"><tr><td align="center" style="padding:0 12px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;border-collapse:separate;${connectorStyle}">
<tr><td style="padding:${headerHtml ? "22px 24px" : "0 0 0"};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate;background:#ffffff;border-radius:14px;overflow:hidden;">
<tr><td style="padding:26px 28px 28px;font-size:14px;line-height:1.6;color:#1a1a1a;">${content}</td></tr>
</table>
</td></tr></table></td></tr></table>
${footerHtml}
</body></html>`;
  }

  const text = emailHtmlToText(content);
  return { html, text: text || "(leeg bericht)" };
}
