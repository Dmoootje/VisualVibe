"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { AnalysisRequestNewRequest, AnalysisRequestNewResponse } from "@/types/analysis";

type ButtonState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "done" }
  | { status: "error"; message: string };

/**
 * Knop "Nieuwe analyse aanvragen": registreert via /api/analyse/request-new/
 * dat de bezoeker binnen de cooldown toch een verse analyse wil (admin kan
 * die daarna forceren) en toont een bevestiging.
 */
export function RequestNewAnalysisButton({ analysisLeadId }: { analysisLeadId: string }) {
  const [state, setState] = useState<ButtonState>({ status: "idle" });

  async function handleClick() {
    if (state.status === "pending" || state.status === "done") return;
    setState({ status: "pending" });

    const payload: AnalysisRequestNewRequest = { analysisLeadId };

    try {
      const response = await fetch("/api/analyse/request-new/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as AnalysisRequestNewResponse;

      if (response.ok && data.status === "requested") {
        setState({ status: "done" });
      } else {
        setState({
          status: "error",
          message:
            data.status === "error" ? data.error : "Er ging iets mis. Probeer het later opnieuw.",
        });
      }
    } catch {
      setState({ status: "error", message: "Er ging iets mis. Probeer het later opnieuw." });
    }
  }

  if (state.status === "done") {
    return (
      <p
        role="status"
        className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
      >
        Je aanvraag voor een nieuwe analyse is geregistreerd. We bekijken ze en je hoort snel van
        ons.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={state.status === "pending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.14] px-[22px] py-3 text-sm font-bold text-white/85 transition-colors hover:border-[rgba(255,122,0,0.5)] hover:bg-[rgba(255,122,0,0.06)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {state.status === "pending" ? "Bezig met aanvragen..." : "Nieuwe analyse aanvragen"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      )}
    </div>
  );
}
