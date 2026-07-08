"use client";

import { useRef, useTransition } from "react";
import { createLeadNote } from "@/lib/admin/leadActions";

export function LeadNoteForm({ leadId }: { leadId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    const note = String(formData.get("note") ?? "");
    startTransition(async () => {
      await createLeadNote(leadId, note);
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-2">
      <textarea
        name="note"
        required
        rows={3}
        placeholder="Notitie toevoegen..."
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
      />
      <button
        type="submit"
        disabled={isPending}
        className="self-end rounded-md bg-gradient-to-r from-red-500 to-amber-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Bezig..." : "Toevoegen"}
      </button>
    </form>
  );
}
