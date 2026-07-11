/**
 * Eén doorlopende, paginabrede achtergrond: een zachte warme wash plus enkele
 * grote, zeer subtiele oranje gloeden verspreid over de hele pagina. Bedoeld
 * als enige achtergrondlaag op een `relative overflow-hidden` root, met alle
 * secties eroverheen transparant, zodat de gloed niet per sectie afgekapt wordt.
 * Puur decoratief en pointer-events-none.
 */
export function PageAmbient() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,138,16,0.06)_0%,rgba(242,138,16,0.015)_22%,rgba(242,138,16,0.02)_55%,rgba(242,138,16,0.05)_100%)]" />
      <div className="absolute -top-40 right-[-6%] h-[680px] w-[820px] max-w-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.13),transparent_66%)]" />
      <div className="absolute left-[-14%] top-[36%] h-[560px] w-[680px] max-w-full bg-[radial-gradient(ellipse_at_center,rgba(242,138,16,0.05),transparent_68%)]" />
      <div className="absolute bottom-[-8%] right-[4%] h-[560px] w-[720px] max-w-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.06),transparent_68%)]" />
    </div>
  );
}
