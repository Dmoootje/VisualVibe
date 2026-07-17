// Deterministic background decoration. A seeded generator keeps the server
// output stable while all movement remains in external CSS.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20240607);
const between = (min: number, max: number) => min + random() * (max - min);

const blocks = Array.from({ length: 16 }, () => {
  const size = Math.round(between(10, 26));
  return `left:${between(2, 98).toFixed(1)}%;top:-60px;width:${size}px;height:${size}px;opacity:${between(0.12, 0.4).toFixed(2)};animation-duration:${between(14, 30).toFixed(1)}s;animation-delay:-${between(0, 30).toFixed(1)}s;`;
});

/** Background falling blocks behind the complete hero. */
export const FALLING_HTML = blocks
  .map((style) => `<span class="vvh-blk" style="${style}"></span>`)
  .join("");

/**
 * Compact living stage. The six original disciplines and their transitions
 * remain, while repeated frames, bars, rings and line art are drawn by CSS.
 */
export const STAGE_HTML = `
<div class="vvh-ring vvh-ringOuter"></div>
<div class="vvh-ringR vvh-ringInner"></div>
<div class="vvh-cardGlow"></div>
<div class="vvh-stagecard">
  <div class="vvh-stageShell">
    <div class="vvh-stageHeader">
      <div class="vvh-headStart">
        <div class="vvh-traffic"><i></i><i></i><i></i></div>
        <div class="vvh-labelStack">
          <span class="vvh-hlabel" style="--s:0">Webdesign</span>
          <span class="vvh-hlabel" style="--s:1">Fotografie</span>
          <span class="vvh-hlabel" style="--s:2">Videografie</span>
          <span class="vvh-hlabel" style="--s:3">Drone</span>
          <span class="vvh-hlabel" style="--s:4">3D / VR / AR</span>
          <span class="vvh-hlabel" style="--s:5">Podcasting</span>
        </div>
      </div>
      <div class="vvh-stageMeta">
        <div class="vvh-countStack">
          <span class="vvh-hlabel" style="--s:0">01 / 06</span>
          <span class="vvh-hlabel" style="--s:1">02 / 06</span>
          <span class="vvh-hlabel" style="--s:2">03 / 06</span>
          <span class="vvh-hlabel" style="--s:3">04 / 06</span>
          <span class="vvh-hlabel" style="--s:4">05 / 06</span>
          <span class="vvh-hlabel" style="--s:5">06 / 06</span>
        </div>
        <span class="vvh-live"><i class="vvh-liveDot"></i>LIVE</span>
      </div>
    </div>

    <div class="vvh-stageViewport">
      <div class="vvh-scene" style="--s:0">
        <div class="vvh-browser">
          <div class="vvh-browserBar"><div class="vvh-miniTraffic"><i></i><i></i><i></i></div><span>visualvibe.media</span></div>
          <div class="vvh-browserBody">
            <i class="vvh-bw vvh-browserHero"></i><i class="vvh-bw vvh-lineLong"></i><i class="vvh-bw vvh-lineShort"></i>
            <div class="vvh-browserCards"><i class="vvh-bw"></i><i class="vvh-bw"></i><i class="vvh-bw"></i></div>
            <i class="vvh-cursorW"></i><i class="vvh-shimmer"></i>
          </div>
        </div>
      </div>

      <div class="vvh-scene" style="--s:1">
        <div class="vvh-cameraGrid"><i class="vvh-focusBox"></i><i class="vvh-apert"></i></div>
        <span class="vvh-cameraStatus">AF-C</span>
        <div class="vvh-cameraMeta"><span>f/1.8</span><span>1/250</span><span>ISO 200</span><span>IMG_1284</span></div>
        <i class="vvh-flash"></i>
      </div>

      <div class="vvh-scene" style="--s:2">
        <div class="vvh-editor">
          <div class="vvh-editorStrip"><div class="vvh-strip vvh-stripFrames"></div><i class="vvh-pulseP"></i></div>
          <div class="vvh-eqField vvh-eqVideo"></div>
          <div class="vvh-timeline"><i></i><b class="vvh-playhead"></b></div>
          <div class="vvh-editorMeta"><span>REC 4K</span><span>00:12:04</span><span>25 fps</span></div>
        </div>
      </div>

      <div class="vvh-scene" style="--s:3">
        <div class="vvh-radar"><i></i><b class="vvh-sweep"></b></div>
        <div class="vvh-route"></div>
        <div class="vvh-fly"><div class="vvh-bob vvh-droneMini"><i></i><i></i><i></i><i></i><b></b></div></div>
        <div class="vvh-telemetry"><small>ALTITUDE</small><strong>62.4<em>m</em></strong><small>SPEED</small><strong>12.8<em>m/s</em></strong></div>
        <span class="vvh-coordinates">51.23 N / 5.34 E / REC 4K</span>
      </div>

      <div class="vvh-scene" style="--s:4">
        <div class="vvh-cubeStage">
          <div class="vvh-cube"><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <b class="vvh-orbit"></b><b class="vvh-orbit2"></b>
        </div>
        <span class="vvh-rendering">RENDERING</span><span class="vvh-fps">60 FPS</span><span class="vvh-renderMeta">3D / VR / AR | REAL-TIME</span>
      </div>

      <div class="vvh-scene" style="--s:5">
        <div class="vvh-podcast">
          <div class="vvh-podcastHead"><i class="vvh-mic"></i><div><strong>De VisualVibe Cast</strong><small>Aflevering 12 / Studio</small></div><span><i class="vvh-liveDot"></i>ON AIR</span></div>
          <div class="vvh-eqField vvh-eqPodcast"></div>
          <div class="vvh-podcastMeta"><span>REC / 12:47</span><span>LVL / -9dB</span></div>
        </div>
      </div>
    </div>

    <div class="vvh-stageFooter">
      <div class="vvh-stageDots"><i class="vvh-hdot" style="--s:0"></i><i class="vvh-hdot" style="--s:1"></i><i class="vvh-hdot" style="--s:2"></i><i class="vvh-hdot" style="--s:3"></i><i class="vvh-hdot" style="--s:4"></i><i class="vvh-hdot" style="--s:5"></i></div>
      <span>6 disciplines / 1 partner</span>
    </div>
  </div>
</div>`;
