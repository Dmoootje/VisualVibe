/**
 * Shared section header for the sector detail sections: orange mono eyebrow
 * (same pattern as the kennisbank/regio blocks), H2 and an optional intro.
 */
export function SectorSectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-8">
      <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#ff7500]">
        <span aria-hidden="true" className="h-[1.5px] w-[22px] bg-[#ff7500]" />
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {intro && <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed text-white/65">{intro}</p>}
    </div>
  );
}
