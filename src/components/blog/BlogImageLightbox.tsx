"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { GLOW_SHADOW } from "./styles";

export type BlogImageLightboxProps = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  className?: string;
};

/**
 * Compact article image for a sidebar or mobile lead-in. The full image opens
 * in an accessible modal with focus trapping, Escape handling and focus return.
 */
export function BlogImageLightbox({
  src,
  alt,
  title,
  caption,
  className,
}: BlogImageLightboxProps) {
  const dialogTitle = title ?? alt;

  return (
    <Dialog.Root>
      <figure className={cn("m-0", className)}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={`Vergroot afbeelding: ${dialogTitle}`}
            className={cn(
              "group relative block aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070505]",
              GLOW_SHADOW
            )}
          >
            <Image
              src={src}
              alt={alt}
              title={title}
              fill
              sizes="(max-width: 1279px) min(100vw - 2rem, 42rem), 20rem"
              className="object-cover transition duration-300 group-hover:scale-[1.025] group-hover:brightness-110 motion-reduce:transition-none"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" />
            <span className="absolute bottom-3 right-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-sm transition-colors group-hover:border-[#ff7500]/60 group-hover:text-[#ff9a45]">
              <ZoomIn className="h-5 w-5" aria-hidden="true" />
            </span>
          </button>
        </Dialog.Trigger>

        {(title || caption) && (
          <figcaption className="mt-3 px-1">
            {title && <span className="block text-sm font-semibold text-white/80">{title}</span>}
            {caption && (
              <span className="mt-1 block text-sm leading-relaxed text-white/50">{caption}</span>
            )}
          </figcaption>
        )}
      </figure>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-md" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[91] max-h-[94svh] w-[min(94vw,1500px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0808] p-3 shadow-2xl focus:outline-none sm:p-5"
        >
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
            <Image
              src={src}
              alt={alt}
              title={title}
              fill
              sizes="94vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="px-1 pb-1 pt-4 sm:px-2">
            <Dialog.Title className="pr-12 text-lg font-semibold text-white sm:text-xl">
              {dialogTitle}
            </Dialog.Title>
            <Dialog.Description
              className={cn(
                caption
                  ? "mt-1.5 max-w-4xl text-sm leading-relaxed text-white/60 sm:text-base"
                  : "sr-only"
              )}
            >
              {caption ?? `Vergrote weergave van ${dialogTitle}.`}
            </Dialog.Description>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
