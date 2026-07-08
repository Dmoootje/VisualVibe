"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/auth/session";
import { updateLeadStatus, updateLeadPriority, getLeadById } from "@/lib/firestore/leads";
import { addLeadNote } from "@/lib/firestore/leadNotes";
import { addLeadEvent } from "@/lib/firestore/leadEvents";
import type { LeadStatus, LeadPriority } from "@/types";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

export async function changeLeadStatus(leadId: string, newStatus: LeadStatus) {
  const admin = await requireAdmin();
  const lead = await getLeadById(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  await updateLeadStatus(leadId, newStatus);
  await addLeadEvent({
    leadId,
    type: "status_change",
    oldValue: lead.status,
    newValue: newStatus,
    createdBy: admin.email,
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}

export async function changeLeadPriority(leadId: string, newPriority: LeadPriority) {
  const admin = await requireAdmin();
  const lead = await getLeadById(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  await updateLeadPriority(leadId, newPriority);
  await addLeadEvent({
    leadId,
    type: "priority_change",
    oldValue: lead.priority,
    newValue: newPriority,
    createdBy: admin.email,
  });

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function createLeadNote(leadId: string, note: string) {
  const admin = await requireAdmin();
  const trimmed = note.trim();
  if (!trimmed) {
    return;
  }

  await addLeadNote(leadId, trimmed, admin.email);
  await addLeadEvent({ leadId, type: "note_added", createdBy: admin.email });

  revalidatePath(`/admin/leads/${leadId}`);
}
