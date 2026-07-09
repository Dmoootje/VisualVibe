import { HeroMessage, HeroStage, HeroFalling } from "./components";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#080808] pb-14 pt-24">
      {/* Ambient glow, bottom-left behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-120px] top-[340px] z-0 h-[620px] w-[760px] max-w-full"
        style={{ background: "radial-gradient(ellipse at center,rgba(255,80,0,.16),transparent 68%)" }}
      />
      <HeroFalling />

      <div className="container relative z-[4] mx-auto grid w-full items-center gap-10 px-4 lg:grid-cols-[1fr_540px] lg:gap-12">
        <HeroMessage />
        <HeroStage />
      </div>
    </section>
  );
}
