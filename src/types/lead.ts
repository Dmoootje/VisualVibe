export type LeadStatus = "new" | "contacted" | "proposal_sent" | "won" | "lost" | "archived";

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "proposal_sent", "won", "lost", "archived"];

export type LeadPriority = "low" | "normal" | "high";

export const LEAD_PRIORITIES: LeadPriority[] = ["low", "normal", "high"];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
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

export type LeadEventType = "created" | "status_change" | "priority_change" | "note_added";

export type LeadEvent = {
  id: string;
  leadId: string;
  type: LeadEventType;
  oldValue?: string;
  newValue?: string;
  createdBy: string;
  createdAt: string;
};
