// Deterministic markup for the animated hero stage. The decorative particles
// and EQ bars need randomised inline styles to look organic, but they must be
// stable between server render and hydration - so we use a seeded PRNG (not
// Math.random) and build the markup once at module load. All animation is CSS
// (see the .vvh-* rules in globals.css); the stage renders as static HTML.

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(20240607);
const r = (a: number, b: number) => a + rnd() * (b - a);

const blocks = Array.from({ length: 16 }, () => {
  const s = Math.round(r(10, 26));
  return `left:${r(2, 98).toFixed(1)}%;top:-60px;width:${s}px;height:${s}px;opacity:${r(0.12, 0.4).toFixed(2)};animation-duration:${r(14, 30).toFixed(1)}s;animation-delay:-${r(0, 30).toFixed(1)}s;`;
});

const cblocks = Array.from({ length: 10 }, () => {
  const s = Math.round(r(6, 14));
  return `left:${r(2, 98).toFixed(1)}%;width:${s}px;height:${s}px;opacity:${r(0.14, 0.44).toFixed(2)};animation-duration:${r(7, 16).toFixed(1)}s;animation-delay:-${r(0, 16).toFixed(1)}s;`;
});

const barStyle = (durMax: number) =>
  `animation-delay:-${r(0, 1.4).toFixed(2)}s;animation-duration:${r(0.5, durMax).toFixed(2)}s;`;

const vbars = Array.from({ length: 40 }, () => barStyle(1.15));
const bars = Array.from({ length: 30 }, () => barStyle(1.25));

const MONO = "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;";

// The real VisualVibe quadcopter (same drawing as <Quad> on the drone page),
// as an HTML string for the drone hero scene. `.dr-rotor` spins the props
// (globals.css); `.vvh-bob` handles the hover and `.vvh-fly` the flight path.
const droneQuad = `<svg width="46" height="40" viewBox="0 0 120 104" fill="none" style="overflow:visible;filter:drop-shadow(0 5px 9px rgba(0,0,0,.55));">
  <ellipse cx="60" cy="98" rx="46" ry="7" fill="rgba(0,0,0,.35)"></ellipse>
  <line x1="60" y1="52" x2="22" y2="30" stroke="#3a3a40" stroke-width="5" stroke-linecap="round"></line>
  <line x1="60" y1="52" x2="98" y2="30" stroke="#3a3a40" stroke-width="5" stroke-linecap="round"></line>
  <line x1="60" y1="56" x2="24" y2="74" stroke="#2c2c30" stroke-width="5" stroke-linecap="round"></line>
  <line x1="60" y1="56" x2="96" y2="74" stroke="#2c2c30" stroke-width="5" stroke-linecap="round"></line>
  <g class="dr-rotor"><circle cx="22" cy="30" r="17" fill="rgba(255,122,0,.08)"></circle><rect x="6" y="28" width="32" height="4" rx="2" fill="rgba(255,180,120,.55)"></rect></g>
  <g class="dr-rotor b"><circle cx="98" cy="30" r="17" fill="rgba(255,122,0,.08)"></circle><rect x="82" y="28" width="32" height="4" rx="2" fill="rgba(255,180,120,.55)"></rect></g>
  <g class="dr-rotor b"><circle cx="24" cy="74" r="17" fill="rgba(255,122,0,.08)"></circle><rect x="8" y="72" width="32" height="4" rx="2" fill="rgba(255,180,120,.55)"></rect></g>
  <g class="dr-rotor"><circle cx="96" cy="74" r="17" fill="rgba(255,122,0,.08)"></circle><rect x="80" y="72" width="32" height="4" rx="2" fill="rgba(255,180,120,.55)"></rect></g>
  <circle cx="22" cy="30" r="5" fill="#18181c" stroke="#4a4a50" stroke-width="1.5"></circle>
  <circle cx="98" cy="30" r="5" fill="#18181c" stroke="#4a4a50" stroke-width="1.5"></circle>
  <circle cx="24" cy="74" r="5" fill="#18181c" stroke="#4a4a50" stroke-width="1.5"></circle>
  <circle cx="96" cy="74" r="5" fill="#18181c" stroke="#4a4a50" stroke-width="1.5"></circle>
  <rect x="44" y="42" width="32" height="24" rx="8" fill="#232329" stroke="#4a4a52" stroke-width="1.5"></rect>
  <circle cx="26" cy="30" r="2" fill="#FF3B2E"></circle>
  <circle cx="94" cy="30" r="2" fill="#FF3B2E"></circle>
  <path d="M52 66 q8 8 16 0" fill="none" stroke="#3a3a42" stroke-width="4" stroke-linecap="round"></path>
  <circle cx="60" cy="70" r="7" fill="#0e0e12" stroke="#5a5a62" stroke-width="2"></circle>
  <circle cx="60" cy="70" r="3" fill="#FF7A00"></circle>
</svg>`;

/** Background falling blocks (behind the whole hero). */
export const FALLING_HTML = blocks.map((s) => `<span class="vvh-blk" style="${s}"></span>`).join("");

const cblocksHtml = cblocks.map((s) => `<span class="vvh-fl" style="${s}"></span>`).join("");

const framesHtml = Array.from({ length: 28 })
  .map(
    () =>
      `<span style="width:96px;height:74px;border-radius:6px;background:linear-gradient(135deg,rgba(255,122,0,.28),rgba(255,60,0,.1));border:1px solid rgba(255,122,0,.25);flex:none;"></span>`
  )
  .join("");

const vbarsHtml = vbars
  .map(
    (s) =>
      `<span class="vvh-eq" style="flex:1;height:100%;border-radius:2px;background:linear-gradient(180deg,#FF7A00,#FF3B2E);${s}"></span>`
  )
  .join("");

const barsHtml = bars
  .map(
    (s) =>
      `<span class="vvh-eq" style="flex:1;height:100%;border-radius:3px;background:linear-gradient(180deg,#FF9500,#FF3B2E);${s}"></span>`
  )
  .join("");

/** The full right-column living stage (rings, glow, framed card, 6 scenes). */
export const STAGE_HTML = `
<svg class="vvh-ring" width="600" height="600" viewBox="0 0 600 600" style="position:absolute;top:50%;right:-110px;translate:0 -50%;opacity:.5;z-index:0;pointer-events:none;"><circle cx="300" cy="300" r="275" fill="none" stroke="rgba(255,122,0,.35)" stroke-width="1.4" stroke-dasharray="3 13"></circle></svg>
<svg class="vvh-ringR" width="440" height="440" viewBox="0 0 440 440" style="position:absolute;top:50%;right:-30px;translate:0 -50%;opacity:.4;z-index:0;pointer-events:none;"><circle cx="220" cy="220" r="206" fill="none" stroke="rgba(255,122,0,.3)" stroke-width="1.2" stroke-dasharray="2 16"></circle></svg>
<div class="vvh-cardGlow" style="position:absolute;inset:-6px;border-radius:30px;background:radial-gradient(120% 120% at 60% 55%,rgba(255,100,0,.6),rgba(255,60,0,.15) 60%,transparent 78%);filter:blur(28px);z-index:0;pointer-events:none;"></div>

<div class="vvh-stagecard" style="position:relative;z-index:1;border-radius:26px;padding:2px;background:linear-gradient(150deg,rgba(255,150,60,.9),rgba(255,90,0,.5) 45%,rgba(255,80,0,.15) 100%);box-shadow:0 40px 90px -30px rgba(255,80,0,.7);">
  <div style="position:relative;border-radius:24px;overflow:hidden;background:radial-gradient(130% 120% at 50% 0%,#1a1109,#0b0a09 62%);padding:22px 22px 20px;">
    <div style="position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;">${cblocksHtml}</div>

    <div style="position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="display:flex;gap:6px;"><span style="width:11px;height:11px;border-radius:9999px;background:#FF3B2E;"></span><span style="width:11px;height:11px;border-radius:9999px;background:#FF7A00;"></span><span style="width:11px;height:11px;border-radius:9999px;background:#FFA23A;"></span></div>
        <div style="position:relative;width:150px;height:20px;font-weight:700;font-size:15px;color:#fff;">
          <span class="vvh-hlabel" style="--s:0;">Webdesign</span>
          <span class="vvh-hlabel" style="--s:1;">Fotografie</span>
          <span class="vvh-hlabel" style="--s:2;">Videografie</span>
          <span class="vvh-hlabel" style="--s:3;">Drone</span>
          <span class="vvh-hlabel" style="--s:4;">3D / VR / AR</span>
          <span class="vvh-hlabel" style="--s:5;">Podcasting</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;${MONO}font-weight:700;font-size:12px;color:#FF9A45;">
        <div style="position:relative;width:44px;height:16px;color:rgba(255,255,255,.4);">
          <span class="vvh-hlabel" style="--s:0;">01 / 06</span>
          <span class="vvh-hlabel" style="--s:1;">02 / 06</span>
          <span class="vvh-hlabel" style="--s:2;">03 / 06</span>
          <span class="vvh-hlabel" style="--s:3;">04 / 06</span>
          <span class="vvh-hlabel" style="--s:4;">05 / 06</span>
          <span class="vvh-hlabel" style="--s:5;">06 / 06</span>
        </div>
        <span style="display:inline-flex;align-items:center;gap:6px;letter-spacing:.06em;"><span class="vvh-liveDot" style="width:8px;height:8px;border-radius:9999px;background:#FF7A00;"></span>LIVE</span>
      </div>
    </div>

    <div style="position:relative;z-index:2;height:352px;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.07);background:radial-gradient(120% 120% at 50% 0%,#120c07,#0a0908 70%);background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:20px 20px;">

      <div class="vvh-scene" style="--s:0;">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
          <div style="position:relative;width:min(400px,100%);border:1px solid rgba(255,255,255,.12);border-radius:12px;background:#0f0e0d;overflow:hidden;box-shadow:0 20px 50px -20px rgba(0,0,0,.8);">
            <div style="display:flex;align-items:center;gap:8px;padding:9px 12px;border-bottom:1px solid rgba(255,255,255,.08);">
              <span style="width:8px;height:8px;border-radius:9999px;background:#FF3B2E;"></span><span style="width:8px;height:8px;border-radius:9999px;background:#FF7A00;"></span><span style="width:8px;height:8px;border-radius:9999px;background:#FFA23A;"></span>
              <span style="margin-left:8px;flex:1;height:16px;border-radius:6px;background:rgba(255,255,255,.06);${MONO}font-size:10px;color:rgba(255,255,255,.5);display:flex;align-items:center;padding:0 8px;">visualvibe.media</span>
            </div>
            <div style="position:relative;padding:16px;display:flex;flex-direction:column;gap:11px;height:222px;">
              <div class="vvh-bw" style="height:34px;border-radius:8px;background:linear-gradient(90deg,#FF3B2E,#FF7A00);animation-delay:0s;"></div>
              <div class="vvh-bw" style="height:9px;width:80%;border-radius:5px;background:rgba(255,255,255,.16);animation-delay:.25s;"></div>
              <div class="vvh-bw" style="height:9px;width:62%;border-radius:5px;background:rgba(255,255,255,.12);animation-delay:.4s;"></div>
              <div style="display:flex;gap:11px;margin-top:4px;">
                <div class="vvh-bw" style="flex:1;height:64px;border-radius:8px;background:rgba(255,122,0,.18);border:1px solid rgba(255,122,0,.3);animation-delay:.6s;"></div>
                <div class="vvh-bw" style="flex:1;height:64px;border-radius:8px;background:rgba(255,255,255,.06);animation-delay:.72s;"></div>
                <div class="vvh-bw" style="flex:1;height:64px;border-radius:8px;background:rgba(255,255,255,.06);animation-delay:.84s;"></div>
              </div>
              <div class="vvh-cursorW" style="position:absolute;top:0;left:0;width:16px;height:16px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="#000" stroke-width="1"><path d="M4 2l16 9-7 2-3 7z"></path></svg></div>
              <div class="vvh-shimmer" style="position:absolute;top:0;left:0;width:60px;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.12),transparent);"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="vvh-scene" style="--s:1;">
        <div style="position:relative;width:100%;height:100%;">
          <div style="position:absolute;inset:26px;border:1px solid rgba(255,255,255,.1);">
            <span style="position:absolute;top:-1px;left:-1px;width:22px;height:22px;border-top:2px solid #FF7A00;border-left:2px solid #FF7A00;"></span>
            <span style="position:absolute;top:-1px;right:-1px;width:22px;height:22px;border-top:2px solid #FF7A00;border-right:2px solid #FF7A00;"></span>
            <span style="position:absolute;bottom:-1px;left:-1px;width:22px;height:22px;border-bottom:2px solid #FF7A00;border-left:2px solid #FF7A00;"></span>
            <span style="position:absolute;bottom:-1px;right:-1px;width:22px;height:22px;border-bottom:2px solid #FF7A00;border-right:2px solid #FF7A00;"></span>
            <div style="position:absolute;left:33.3%;top:0;bottom:0;width:1px;background:rgba(255,255,255,.09);"></div>
            <div style="position:absolute;left:66.6%;top:0;bottom:0;width:1px;background:rgba(255,255,255,.09);"></div>
            <div style="position:absolute;top:33.3%;left:0;right:0;height:1px;background:rgba(255,255,255,.09);"></div>
            <div style="position:absolute;top:66.6%;left:0;right:0;height:1px;background:rgba(255,255,255,.09);"></div>
          </div>
          <svg class="vvh-apert" width="120" height="120" viewBox="0 0 100 100" style="position:absolute;top:50%;left:50%;margin:-60px 0 0 -60px;opacity:.5;"><g fill="none" stroke="#FF7A00" stroke-width="2"><polygon points="50,12 74,26 74,54 50,68 26,54 26,26"></polygon><polygon points="50,26 62,33 62,47 50,54 38,47 38,33"></polygon></g></svg>
          <div class="vvh-focusBox" style="position:absolute;top:50%;left:50%;width:70px;height:70px;margin:-35px 0 0 -35px;">
            <span style="position:absolute;top:0;left:0;width:14px;height:14px;border-top:2px solid #fff;border-left:2px solid #fff;"></span>
            <span style="position:absolute;top:0;right:0;width:14px;height:14px;border-top:2px solid #fff;border-right:2px solid #fff;"></span>
            <span style="position:absolute;bottom:0;left:0;width:14px;height:14px;border-bottom:2px solid #fff;border-left:2px solid #fff;"></span>
            <span style="position:absolute;bottom:0;right:0;width:14px;height:14px;border-bottom:2px solid #fff;border-right:2px solid #fff;"></span>
          </div>
          <div style="position:absolute;top:34px;left:34px;${MONO}font-size:11px;font-weight:700;color:#FF9A45;">● AF-C</div>
          <div style="position:absolute;bottom:34px;left:34px;right:34px;display:flex;justify-content:space-between;${MONO}font-size:12px;font-weight:700;color:rgba(255,255,255,.85);"><span>f/1.8</span><span>1/250</span><span>ISO 200</span><span style="color:#FF9A45;">IMG_1284</span></div>
          <div class="vvh-flash" style="position:absolute;inset:0;background:radial-gradient(circle,rgba(255,255,255,.9),transparent 60%);pointer-events:none;"></div>
        </div>
      </div>

      <div class="vvh-scene" style="--s:2;">
        <div style="width:100%;height:100%;padding:18px;display:flex;flex-direction:column;gap:14px;">
          <div style="position:relative;height:74px;border-radius:8px;overflow:hidden;">
            <div class="vvh-strip" style="display:flex;gap:6px;width:max-content;height:100%;">${framesHtml}</div>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div class="vvh-pulseP" style="width:42px;height:42px;border-radius:9999px;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"></path></svg></div></div>
          </div>
          <div style="flex:1;display:flex;align-items:flex-end;gap:3px;padding:0 2px;">${vbarsHtml}</div>
          <div style="position:relative;height:8px;border-radius:9999px;background:rgba(255,255,255,.1);">
            <div style="position:absolute;left:0;top:0;bottom:0;width:38%;border-radius:9999px;background:linear-gradient(90deg,#FF3B2E,#FF7A00);"></div>
            <div class="vvh-playhead" style="position:absolute;top:-5px;width:2px;height:18px;background:#fff;box-shadow:0 0 8px #fff;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;${MONO}font-size:12px;font-weight:700;color:rgba(255,255,255,.8);"><span style="color:#FF9A45;">● REC 4K</span><span>00:12:04</span><span>25 fps</span></div>
        </div>
      </div>

      <div class="vvh-scene" style="--s:3;">
        <div style="position:relative;width:100%;height:100%;overflow:hidden;">
          <div style="position:absolute;top:50%;right:24px;transform:translateY(-50%);width:200px;height:200px;border-radius:9999px;overflow:hidden;border:1px solid rgba(255,122,0,.3);">
            <div style="position:absolute;inset:24px;border:1px solid rgba(255,122,0,.2);border-radius:9999px;"></div>
            <div style="position:absolute;inset:64px;border:1px solid rgba(255,122,0,.16);border-radius:9999px;"></div>
            <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,122,0,.14);"></div>
            <div style="position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(255,122,0,.14);"></div>
            <div class="vvh-sweep" style="position:absolute;inset:0;background:conic-gradient(from 0deg,rgba(255,122,0,.5),transparent 70deg);"></div>
          </div>
          <svg width="100%" height="100%" viewBox="0 0 564 300" preserveAspectRatio="none" style="position:absolute;inset:0;"><path d="M 24 250 C 150 110, 250 300, 380 160 S 540 60, 556 200" fill="none" stroke="rgba(255,122,0,.5)" stroke-width="1.5" stroke-dasharray="4 6"></path></svg>
          <div class="vvh-fly" style="position:absolute;top:0;left:0;offset-rotate:0deg;"><div class="vvh-bob">${droneQuad}</div></div>
          <div style="position:absolute;top:26px;left:26px;${MONO}color:#fff;">
            <div style="font-size:11px;color:rgba(255,255,255,.5);letter-spacing:.08em;">ALTITUDE</div>
            <div style="font-weight:800;font-size:34px;color:#fff;line-height:1;">62.4<span style="font-size:14px;color:#FF9A45;">m</span></div>
            <div style="font-size:11px;color:rgba(255,255,255,.5);letter-spacing:.08em;margin-top:14px;">SPEED</div>
            <div style="font-weight:800;font-size:28px;color:#fff;line-height:1;">12.8<span style="font-size:13px;color:#FF9A45;">m/s</span></div>
          </div>
          <div style="position:absolute;bottom:24px;left:26px;${MONO}font-size:11px;font-weight:700;color:rgba(255,255,255,.7);">51.23°N · 5.34°E &nbsp; ● REC 4K</div>
        </div>
      </div>

      <div class="vvh-scene" style="--s:4;">
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;perspective:640px;">
          <div style="position:relative;width:130px;height:130px;">
            <div class="vvh-cube" style="position:absolute;inset:0;">
              <div style="position:absolute;width:130px;height:130px;border:1.5px solid rgba(255,122,0,.75);background:rgba(255,122,0,.06);transform:translateZ(65px);"></div>
              <div style="position:absolute;width:130px;height:130px;border:1.5px solid rgba(255,122,0,.4);background:rgba(255,122,0,.03);transform:rotateY(180deg) translateZ(65px);"></div>
              <div style="position:absolute;width:130px;height:130px;border:1.5px solid rgba(255,122,0,.6);background:rgba(255,122,0,.05);transform:rotateY(90deg) translateZ(65px);"></div>
              <div style="position:absolute;width:130px;height:130px;border:1.5px solid rgba(255,122,0,.6);background:rgba(255,122,0,.05);transform:rotateY(-90deg) translateZ(65px);"></div>
              <div style="position:absolute;width:130px;height:130px;border:1.5px solid rgba(255,122,0,.6);background:rgba(255,122,0,.05);transform:rotateX(90deg) translateZ(65px);"></div>
              <div style="position:absolute;width:130px;height:130px;border:1.5px solid rgba(255,122,0,.6);background:rgba(255,122,0,.05);transform:rotateX(-90deg) translateZ(65px);"></div>
            </div>
            <div class="vvh-orbit" style="position:absolute;top:50%;left:50%;width:9px;height:9px;margin:-4px;border-radius:9999px;background:#fff;box-shadow:0 0 10px #FF7A00;"></div>
            <div class="vvh-orbit2" style="position:absolute;top:50%;left:50%;width:7px;height:7px;margin:-3px;border-radius:9999px;background:#FF9A45;box-shadow:0 0 8px #FF7A00;"></div>
          </div>
          <div style="position:absolute;top:26px;left:26px;${MONO}font-size:11px;font-weight:700;color:#FF9A45;">● RENDERING</div>
          <div style="position:absolute;top:26px;right:26px;${MONO}font-size:11px;font-weight:700;color:rgba(255,255,255,.75);">60 FPS</div>
          <div style="position:absolute;bottom:24px;left:0;right:0;text-align:center;${MONO}font-size:11px;font-weight:700;color:rgba(255,255,255,.55);letter-spacing:.1em;">3D · VR · AR &nbsp;|&nbsp; REAL-TIME</div>
        </div>
      </div>

      <div class="vvh-scene" style="--s:5;">
        <div style="width:100%;height:100%;padding:20px;display:flex;flex-direction:column;justify-content:center;gap:20px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:46px;height:46px;border-radius:12px;background:linear-gradient(140deg,#FF5A1F,#FF9500);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px -8px rgba(255,90,0,.8);"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8.5 21h7"></path></svg></div>
              <div><div style="font-weight:800;font-size:16px;color:#fff;">De VisualVibe Cast</div><div style="${MONO}font-size:11px;color:rgba(255,255,255,.5);">Aflevering 12 · Studio</div></div>
            </div>
            <div style="display:flex;align-items:center;gap:7px;${MONO}font-size:12px;font-weight:700;color:#FF5A1F;"><span class="vvh-liveDot" style="width:9px;height:9px;border-radius:9999px;background:#FF3B2E;"></span>ON AIR</div>
          </div>
          <div style="height:96px;display:flex;align-items:center;gap:3px;">${barsHtml}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;${MONO}font-size:12px;font-weight:700;color:rgba(255,255,255,.8);">
            <span>REC ● 12:47</span>
            <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.55);">LVL <span style="display:inline-flex;gap:2px;letter-spacing:1px;">▮▮▮▯▯</span> -9dB</div>
          </div>
        </div>
      </div>

    </div>

    <div style="position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;margin-top:16px;">
      <div style="display:flex;gap:7px;align-items:center;"><span class="vvh-hdot" style="--s:0;"></span><span class="vvh-hdot" style="--s:1;"></span><span class="vvh-hdot" style="--s:2;"></span><span class="vvh-hdot" style="--s:3;"></span><span class="vvh-hdot" style="--s:4;"></span><span class="vvh-hdot" style="--s:5;"></span></div>
      <span style="${MONO}font-weight:700;font-size:12px;color:rgba(255,255,255,.5);">6 disciplines · 1 partner</span>
    </div>

  </div>
</div>`;
