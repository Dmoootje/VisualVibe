"use client";

import { Download } from "lucide-react";
import type { Subscriber } from "@/types";

/** Escapes a value for CSV (wraps in quotes, doubles inner quotes). */
function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function ExportSubscribersButton({ subscribers }: { subscribers: Subscriber[] }) {
  function exportCsv() {
    const header = ["E-mail", "Bron", "Ingeschreven op"];
    const rows = subscribers.map((subscriber) =>
      [
        subscriber.email,
        subscriber.sourcePage ?? "",
        new Date(subscriber.createdAt).toLocaleString("nl-BE"),
      ]
        .map(csvCell)
        .join(",")
    );
    // Prepend a UTF-8 BOM so Excel opens accented characters correctly.
    const csv = "﻿" + [header.map(csvCell).join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nieuwsbrief-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={exportCsv}
      disabled={subscribers.length === 0}
      className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      Exporteer CSV
    </button>
  );
}
