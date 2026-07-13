export type LeadStatus = "new" | "contacted" | "proposal_sent" | "won" | "lost" | "archived";

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "proposal_sent", "won", "lost", "archived"];

export type LeadPriority = "low" | "normal" | "high";

export const LEAD_PRIORITIES: LeadPriority[] = ["low", "normal", "high"];

export const LEAD_FORM_TYPES = [
  "contact",
  "offerte",
  "quote_modal_offerte",
  "quote_modal_kennis",
  "website_analysis",
] as const;

export type LeadFormType = (typeof LEAD_FORM_TYPES)[number];

export const LEAD_SERVICE_IDS = [
  "webdesign",
  "seo",
  "fotografie",
  "videografie",
  "drone-fpv",
  "3d-vr-ar",
  "podcasting",
  "masterclasses",
] as const;

export type LeadServiceId = (typeof LEAD_SERVICE_IDS)[number];

export type LeadLocale = "nl" | "fr" | "en";

export type Lead = {
  id: string;
  leadNumber: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  selectedServices: LeadServiceId[];
  formType: LeadFormType;
  locale: LeadLocale;
  idempotencyKey?: string;
  region?: string;
  message: string;
  sourcePage?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  privacyAccepted: boolean;
  status: LeadStatus;
  priority: LeadPriority;
  createdAt: string;
  updatedAt: string;
};

export type LeadNote = {
  id: string;
  leadId: string;
  note: string;
  createdBy: string;
  createdAt: string;
};

export type LeadEventType =
  | "created"
  | "status_change"
  | "priority_change"
  | "note_added"
  | "draft_generated"
  | "draft_edited"
  | "email_sent"
  | "email_failed"
  // Websiteanalyse-flow (incl. admin-auditlog voor analyse-acties).
  | "analysis_requested"
  | "analysis_verified"
  | "analysis_started"
  | "analysis_completed"
  | "analysis_failed"
  | "analysis_limit_reached"
  | "analysis_reused"
  | "analysis_force_requested"
  | "analysis_report_resent"
  | "analysis_quota_reset"
  | "analysis_credit_granted";

export type LeadEvent = {
  id: string;
  leadId: string;
  type: LeadEventType;
  oldValue?: string;
  newValue?: string;
  createdBy: string;
  createdAt: string;
};
