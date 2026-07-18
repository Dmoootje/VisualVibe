import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Controlled kennisbank search input. Presentational (no state of its own) so it
 * can live inside either the landing view or a small navigate-on-submit island.
 */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Zoek een gids of artikel...",
  size = "hero",
  submitLabel = "Zoeken",
  clearLabel = "Zoekopdracht wissen",
  autoFocus,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
  size?: "hero" | "sidebar";
  submitLabel?: string;
  clearLabel?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  const hero = size === "hero";
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className={cn(
        "kb-search flex items-center gap-3 rounded-[15px] border border-white/12 bg-white/[0.03] transition-all",
        "focus-within:border-[#ff7500]/55 focus-within:bg-white/[0.05] focus-within:shadow-[0_0_0_4px_rgba(255,122,0,0.1)]",
        hero ? "max-w-[600px] gap-3.5 py-[5px] pl-5 pr-[6px]" : "gap-2.5 rounded-[13px] py-1 pl-3.5 pr-[5px]",
        className
      )}
    >
      <Search
        className={cn("shrink-0 text-white/55", hero ? "h-5 w-5" : "h-[17px] w-[17px]")}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className={cn(
          "min-w-0 flex-1 border-none bg-transparent text-white outline-none placeholder:text-white/40 [&::-webkit-search-cancel-button]:hidden",
          hero ? "py-3.5 text-base" : "py-[11px] text-sm"
        )}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[9px] bg-white/[0.06] text-white/70 transition-colors hover:bg-white/10 hover:text-white",
            hero ? "h-[34px] w-[34px]" : "h-[30px] w-[30px]"
          )}
        >
          <X className={hero ? "h-[15px] w-[15px]" : "h-[14px] w-[14px]"} aria-hidden="true" />
        </button>
      )}
      {hero && (
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-2 rounded-[11px] bg-gradient-to-r from-red-500 to-[#ff7500] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          {submitLabel}
        </button>
      )}
    </form>
  );
}
