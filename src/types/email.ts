export const EMAIL_LOCALES = ["nl", "fr", "en"] as const;
export type EmailLocale = (typeof EMAIL_LOCALES)[number];

export const EMAIL_FORM_TYPES = [
  "contact",
  "offerte",
  "quote_modal_offerte",
  "quote_modal_kennis",
  "website_analysis",
] as const;
export type EmailFormType = (typeof EMAIL_FORM_TYPES)[number];

export const SMTP_SECURITY_MODES = ["none", "ssl", "starttls"] as const;
export type SmtpSecurity = (typeof SMTP_SECURITY_MODES)[number];

/** Internal SMTP settings. `encryptedPassword` must never cross a client boundary. */
export type SmtpSettings = {
  enabled: boolean;
  host: string;
  port: number;
  security: SmtpSecurity;
  username: string;
  encryptedPassword?: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  adminRecipients: string[];
  testRecipient: string;
};

/** Redacted SMTP settings safe to pass to an authenticated admin client. */
export type SmtpSettingsAdminView = Omit<SmtpSettings, "encryptedPassword"> & {
  passwordConfigured: boolean;
};

export type EmailAutomationSettings = {
  sendCustomerConfirmation: boolean;
  sendAdminNotification: boolean;
  createAiReplyDraft: boolean;
  allowAiAutoSend: boolean;
  defaultLocale: EmailLocale;
  responseExpectationText: string;
  signatureName: string;
  signatureRole: string;
  signaturePhone: string;
  signatureEmail: string;
  signatureWebsite: string;
  appointmentUrl: string;
  enabledFormTypes: EmailFormType[];
};

export type EmailSettings = {
  id: "default";
  smtp: SmtpSettings;
  automation: EmailAutomationSettings;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
};

export type EmailSettingsAdminView = Omit<EmailSettings, "smtp"> & {
  smtp: SmtpSettingsAdminView;
};

export type EmailSettingsUpdate = {
  smtp?: Partial<Omit<SmtpSettings, "encryptedPassword">>;
  automation?: Partial<EmailAutomationSettings>;
};

export const MAIL_HISTORY_TYPES = [
  "customer_confirmation",
  "admin_notification",
  "ai_draft",
  "manual_reply",
  "automated_reply",
  "analysis_verification",
  "analysis_report",
  "analysis_admin_notification",
] as const;
export type MailHistoryType = (typeof MAIL_HISTORY_TYPES)[number];

export const MAIL_HISTORY_STATUSES = ["draft", "queued", "sent", "failed"] as const;
export type MailHistoryStatus = (typeof MAIL_HISTORY_STATUSES)[number];

export type MailHistory = {
  id: string;
  leadId: string;
  type: MailHistoryType;
  to: string[];
  cc: string[];
  bcc: string[];
  replyTo?: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  status: MailHistoryStatus;
  providerMessageId?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  sentAt?: string;
  createdBy: string;
  locale: EmailLocale;
  /** Stable per logical message, used to suppress duplicate sends. */
  idempotencyKey?: string;
};

export type AiReplyServiceSection = {
  serviceId: string;
  title: string;
  body: string;
};

export type AiReplyDraft = {
  subject: string;
  greeting: string;
  summary: string;
  serviceSections: AiReplyServiceSection[];
  questions: string[];
  nextStep: string;
  closing: string;
};

export type LeadEmailData = {
  id: string;
  leadNumber: string;
  formType: EmailFormType;
  locale: EmailLocale;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  selectedServices: string[];
  message: string;
  region?: string;
  sourcePage?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
  aiSummary?: string;
  missingInformation?: string[];
  suggestedNextAction?: string;
  adminDetailUrl?: string;
};

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type EmailTemplateInput = {
  lead: LeadEmailData;
  settings: EmailSettings | EmailSettingsAdminView;
};

export type SmtpMailMessage = {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  /** A stable RFC 5322 Message-ID helps future threading and retry diagnosis. */
  messageId?: string;
};

export type SmtpSendResult = {
  messageId: string;
  accepted: string[];
  rejected: string[];
  response?: string;
};
