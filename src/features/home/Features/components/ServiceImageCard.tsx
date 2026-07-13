"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Big image card with the signature orange glow frame, an overlay badge
 * (top-left) and a floating key-benefit info card (bottom, overlapping).
 * `mobile` renders a lighter version shown above the copy on small screens.
 */
export function ServiceImageCard({
  image,
  title,
  badge,
  highlight,
  mobile = false,
}: {
  image: string;
  title: string;
  badge: string;
  highlight: string;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <div className="relative md:hidden">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 opacity-60 blur-md" />
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/80 p-1 backdrop-blur-sm">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {badge}
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative hidden md:block"
    >
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500 to-amber-500 opacity-70 blur-lg" />
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/80 p-1 backdrop-blur-sm">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        </div>

        {/* Overlay badge */}
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {badge}
        </span>
      </div>

      {/* Floating key-benefit info card */}
      <div className="absolute -bottom-4 left-6 right-6 flex items-center gap-3 rounded-xl border border-amber-500/25 bg-neutral-950/90 px-4 py-3 shadow-[0_10px_40px_-12px_rgba(255,117,0,0.5)] backdrop-blur-md">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-[rgba(255,122,0,0.3)] bg-[rgba(255,122,0,0.12)] text-[#FF9A45]">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-amber-300/90">Kernvoordeel</p>
          <p className="truncate text-sm font-semibold text-white">{highlight}</p>
        </div>
      </div>
    </motion.div>
  );
}
