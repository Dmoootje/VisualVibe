"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square, Sparkles, X } from "lucide-react";
import { parseWeddingProjectAction } from "@/lib/admin/trouwstudioActions";
import type { ParsedWeddingProject } from "@/lib/ai/parseWeddingProject";
import { inputClasses } from "./shared";

// AI-invulhulp voor het nieuw-projectformulier: de fotograaf vertelt (spraak,
// nl-NL via de browser) of typt de gegevens; Claude vult de juiste velden in en
// meldt wat er nog mist. De spraakherkenning gebruikt de Web Speech API
// (Chrome/Edge); zonder ondersteuning blijft typen/plakken beschikbaar.

/* --- Minimale Web Speech API-typering (staat niet in de standaard DOM-lib) --- */
type SpeechAlt = { transcript: string };
type SpeechResult = { readonly isFinal: boolean; readonly length: number; readonly [index: number]: SpeechAlt };
type SpeechResultList = { readonly length: number; readonly [index: number]: SpeechResult };
type SpeechEvent = { readonly resultIndex: number; readonly results: SpeechResultList };
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

const FIELD_LABELS: Record<keyof ParsedWeddingProject, string> = {
  partnerOneName: "Partner 1",
  partnerTwoName: "Partner 2",
  weddingDate: "Trouwdatum",
  city: "Stad/regio",
  ceremonyLocation: "Locatie ceremonie",
  receptionLocation: "Locatie receptie",
  photographerName: "Fotograaf",
  editingStyle: "Fotostijl",
  notes: "Interne notitie",
};

const REQUIRED_FIELDS: (keyof ParsedWeddingProject)[] = ["partnerOneName", "partnerTwoName", "weddingDate"];

export function WeddingProjectAiFill({
  onFill,
  onClose,
}: {
  onFill: (fields: ParsedWeddingProject) => void;
  onClose: () => void;
}) {
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ filled: string[]; missing: string[] } | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef("");
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    setSpeechSupported(getRecognitionCtor() !== null);
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const startRecording = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    setError(null);
    const recognition = new Ctor();
    recognition.lang = "nl-NL";
    recognition.continuous = true;
    recognition.interimResults = true;
    baseTextRef.current = transcript.trim();

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interimText += res[0].transcript;
      }
      const base = baseTextRef.current;
      setTranscript((base ? `${base} ` : "") + finalText.trim());
      setInterim(interimText);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setError(
          event.error === "not-allowed"
            ? "Geef de browser toegang tot de microfoon om spraak te gebruiken."
            : "Spraakherkenning is onderbroken. Typ eventueel verder.",
        );
      }
      setRecording(false);
      setInterim("");
    };
    recognition.onend = () => {
      setRecording(false);
      setInterim("");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  };

  const runFill = async () => {
    const text = `${transcript} ${interim}`.trim();
    if (!text) {
      setError("Vertel of typ eerst wat gegevens.");
      return;
    }
    if (recording) stopRecording();
    setBusy(true);
    setError(null);
    setResult(null);
    const response = await parseWeddingProjectAction(text);
    setBusy(false);
    if (!response.ok || !response.data) {
      setError(response.error ?? "De AI kon de gegevens niet verwerken.");
      return;
    }
    const data = response.data;
    const filled = (Object.keys(FIELD_LABELS) as (keyof ParsedWeddingProject)[])
      .filter((key) => data[key])
      .map((key) => FIELD_LABELS[key]);
    const missing = REQUIRED_FIELDS.filter((key) => !data[key]).map((key) => FIELD_LABELS[key]);
    setResult({ filled, missing });
    onFill(data);
  };

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-200">
          <Sparkles className="h-4 w-4" />
          Vertel de AI wat hij moet invullen
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
          aria-label="AI-invulhulp sluiten"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mb-3 text-xs text-white/55">
        {speechSupported
          ? "Klik op de microfoon en vertel in het Nederlands de namen, trouwdatum, locaties en wensen. Je kunt de tekst ook typen of aanpassen. De AI vult daarna de velden in."
          : "Typ of plak in het Nederlands de namen, trouwdatum, locaties en wensen. De AI vult daarna de velden in. (Spraak werkt in Chrome of Edge.)"}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {speechSupported && (
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={busy}
            className={`inline-flex h-fit shrink-0 items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
              recording
                ? "bg-red-500/90 text-white hover:bg-red-500"
                : "bg-amber-500/90 text-black hover:bg-amber-400"
            }`}
          >
            {recording ? (
              <>
                <Square className="h-4 w-4 fill-current" /> Stop opname
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" /> Spreek in
              </>
            )}
          </button>
        )}
        <div className="flex-1">
          <textarea
            value={interim ? `${transcript} ${interim}`.trim() : transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              setInterim("");
            }}
            rows={4}
            placeholder="bv. Lien en Thomas trouwen op 14 juni volgend jaar in Hasselt, ceremonie in het stadhuis, feest op het Kasteel van Ordingen, warm-romantische stijl."
            className={inputClasses}
          />
          {recording && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-amber-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Aan het luisteren...
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={runFill}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {busy ? "AI verwerkt..." : "Velden invullen"}
        </button>
        {error && <span className="text-sm text-red-300">{error}</span>}
      </div>

      {result && (
        <div className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm">
          {result.filled.length > 0 ? (
            <p className="text-emerald-300">
              Ingevuld: <span className="text-white/80">{result.filled.join(", ")}</span>. Controleer de velden hieronder.
            </p>
          ) : (
            <p className="text-amber-300">De AI kon geen velden invullen. Vertel iets meer of vul handmatig aan.</p>
          )}
          {result.missing.length > 0 && (
            <p className="mt-1 text-amber-300">
              Nog nodig (verplicht): <span className="text-white/80">{result.missing.join(", ")}</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
