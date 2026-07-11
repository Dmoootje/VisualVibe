/**
 * Doorlopende, paginabrede achtergrond voor de regio-detailpagina. Eén laag
 * die de HELE pagina bedekt (root is relative + overflow-hidden), zodat de
 * zachte oranje gloed een aaneengesloten vlak vormt in plaats van per sectie
 * afgekapt te worden. Alle secties erboven zijn transparant, dus deze wash
 * schijnt overal gelijk door. Puur decoratief en pointer-events-none.
 */
export function RegionAmbient() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Warme, doorlopende wash van boven naar onder over de hele pagina. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,138,16,0.06)_0%,rgba(242,138,16,0.015)_22%,rgba(242,138,16,0.02)_55%,rgba(242,138,16,0.05)_100%)]" />
      {/* Grote zachte gloed bovenaan, achter de hero-kaart. */}
      <div className="absolute -top-40 right-[-6%] h-[680px] w-[820px] max-w-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.13),transparent_66%)]" />
      {/* Subtiele gloed halverwege, links. */}
      <div className="absolute left-[-14%] top-[38%] h-[560px] w-[680px] max-w-full bg-[radial-gradient(ellipse_at_center,rgba(242,138,16,0.05),transparent_68%)]" />
      {/* Zachte gloed onderaan, rechts, zodat ook de voet van de pagina warm blijft. */}
      <div className="absolute bottom-[-8%] right-[4%] h-[560px] w-[720px] max-w-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.06),transparent_68%)]" />
    </div>
  );
}
