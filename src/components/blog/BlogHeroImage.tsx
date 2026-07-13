"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Clock, X, ZoomIn } from "lucide-react";

/**
 * Portrait (4/5) cover card for the article hero: category pill, logo watermark,
 * read-time badge and a zoom button that opens the full image in a modal.
 */
export function BlogHeroImage({
  src,
  alt,
  title,
  caption,
  category,
  readingTime,
}: {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  category: string;
  readingTime?: string;
}) {
  const dialogTitle = title ?? alt;
  return (
    <Dialog.Root>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] border border-white/10 bg-[#161412] shadow-[0_50px_100px_-40px_rgba(255,90,0,0.35),0_20px_50px_-30px_rgba(0,0,0,0.9)]">
        <Image
          src={src}
          alt={alt}
          title={title}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
          priority
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55"
          aria-hidden="true"
        />
        <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-[#ff7500] px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white">
          {category}
        </span>
        <Image
          src="/logo.svg"
          alt="VisualVibe"
          width={140}
          height={28}
          className="absolute right-4 top-4 z-10 h-[18px] w-auto opacity-90"
          aria-hidden="true"
        />
        <div className="absolute inset-x-5 bottom-5 z-10 flex items-center justify-between gap-3">
          {readingTime ? (
            <span
              className="inline-flex items-center gap-2 rounded-[11px] bg-black/60 px-3.5 py-2.5 text-xs font-bold text-white backdrop-blur-sm"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              <Clock className="h-3.5 w-3.5 text-[#ff9a45]" aria-hidden="true" />
              {readingTime}
            </span>
          ) : (
            <span />
          )}
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label={`Vergroot afbeelding: ${dialogTitle}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-black/60 text-white backdrop-blur-sm transition-colors hover:border-[#ff7500]/60 hover:text-[#ff9a45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500]"
            >
              <ZoomIn className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dialog.Trigger>
        </div>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-md" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[91] max-h-[94svh] w-[min(94vw,1400px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0808] p-3 shadow-2xl focus:outline-none sm:p-5">
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Afbeelding sluiten"
              className="absolute right-4 top-4 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white/80 shadow-lg backdrop-blur-sm transition-colors hover:border-[#ff7500]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dialog.Close>
          <div className="relative aspect-video max-h-[72svh] w-full overflow-hidden rounded-xl bg-black/40">
            <Image src={src} alt={alt} title={title} fill sizes="94vw" className="object-contain" priority />
          </div>
          <div className="px-1 pb-1 pt-4 sm:px-2">
            <Dialog.Title className="pr-12 text-lg font-semibold text-white sm:text-xl">
              {dialogTitle}
            </Dialog.Title>
            <Dialog.Description
              className={caption ? "mt-1.5 max-w-4xl text-sm leading-relaxed text-white/60 sm:text-base" : "sr-only"}
            >
              {caption ?? `Vergrote weergave van ${dialogTitle}.`}
            </Dialog.Description>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
