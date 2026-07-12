"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** LinkedIn / Facebook / copy-link share row for the article hero. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable - no-op */
    }
  }

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-[11px] border border-white/12 text-white/60 transition-all hover:-translate-y-0.5 hover:border-[#ff7500]/50 hover:bg-[#ff7500]/[0.06] hover:text-[#ff9a45]";

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/40"
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      >
        Delen
      </span>
      <div className="flex gap-2">
        <a
          href={linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Deel op LinkedIn: ${title}`}
          className={btn}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-9h4v1.5" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Deel op Facebook: ${title}`}
          className={btn}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
        <button type="button" onClick={copy} aria-label="Link kopiëren" className={btn}>
          {copied ? (
            <Check className="h-[17px] w-[17px] text-[#ff9a45]" aria-hidden="true" />
          ) : (
            <Link2 className="h-[17px] w-[17px]" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
