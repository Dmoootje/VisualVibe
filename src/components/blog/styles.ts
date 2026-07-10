// Shared class tokens for the VisualVibe blog block library.
// Keeping the "look" in one place means every block reads as one system and a
// future restyle is a single-file change - no hardcoded surfaces per block.

/** Dark glassmorphism surface used by most content cards. */
export const CARD =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm";

/** Card surface with the amber glow-on-hover interaction. */
export const CARD_INTERACTIVE =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-[#ff7500]/40 hover:shadow-[0_0_35px_-12px_rgba(255,117,0,0.45)]";

/** Amber→red gradient text (matches the homepage accent). */
export const GRADIENT_TEXT =
  "bg-gradient-to-r from-[#ff7500] to-red-500 bg-clip-text text-transparent";

/** Small orange pill/eyebrow used above section titles and in badges. */
export const EYEBROW =
  "inline-flex items-center gap-1.5 rounded-full border border-[#ff7500]/30 bg-[#ff7500]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#ff9a45]";

/** Ambient amber glow shadow for hero/CTA-scale elements. */
export const GLOW_SHADOW = "shadow-[0_0_60px_-15px_rgba(255,117,0,0.4)]";
