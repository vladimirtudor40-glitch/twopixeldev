// twopixeldev — "Coming Soon" intro engine.
// An 8-second seamless loop rendered to a single <canvas> at 60fps steps.
// Every frame is a pure function of time, so the loop is exact and scrubbing is deterministic.

export const LOOP_SECONDS = 8;
export const FPS = 60;
export const TOTAL_FRAMES = LOOP_SECONDS * FPS;

export type IntroOptions = {
  wordmark?: string;
  tagline?: string;
  displayFont?: string;
  monoFont?: string;
  autoplay?: boolean;
  /** Caps the internal render resolution (pixels) to keep post-processing cheap. */
  maxPixels?: number;
  onFrame?: (time: number) => void;
  /** Play the intro once and hold on the logo (time = holdAt) instead of looping. */
  once?: boolean;
  /** Where `once` stops, in seconds. Default 6.2: logo + tagline fully shown. */
  holdAt?: number;
  /** Called once when a `once` intro reaches its hold. */
  onComplete?: () => void;
};

export type IntroController = {
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  readonly time: number;
  readonly playing: boolean;
  /** The wordmark's box as fractions of the canvas size (center x/y, width, height). */
  wordmarkBox(): { cx: number; cy: number; w: number; h: number };
  destroy(): void;
};

type Spark = {
  vx: number; vy: number; size: number; color: number;
  twinkle: number; phase: number; rot: number; spin: number;
};

const TAU = Math.PI * 2;
const ISO = Math.tan(Math.PI / 6); // isometric floor squash (≈0.577)
const C30 = Math.cos(Math.PI / 6);
const S30 = 0.5;
const CYAN: [number, number, number] = [0, 240, 255];
const MAGENTA: [number, number, number] = [255, 0, 85];
const WHITE: [number, number, number] = [244, 247, 250];
const PALETTE = [CYAN, MAGENTA, WHITE];

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x); // used for opacity fades only, never motion
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${clamp(a)})`;

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Closed-form step response of an underdamped spring (x'' = -ω²(x-1) - 2ζωx').
 * ω is solved so the response first crosses 1 exactly at `hitTime`: the pixels
 * accelerate inward and arrive at full velocity instead of easing to a stop.
 */
function springHitting(zeta: number, hitTime: number) {
  const s = Math.sqrt(1 - zeta * zeta);
  const wd = (Math.PI - Math.atan(s / zeta)) / hitTime;
  const w = wd / s;
  return (t: number) =>
    1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t));
}

/** Plain spring settling to 1 (with overshoot), for the wordmark scale-in. */
function springSettle(zeta: number, omega: number) {
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  return (t: number) =>
    t <= 0 ? 0 : 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
}

const approach = springHitting(0.32, 2.0);
const textSpring = springSettle(0.38, 15);
const boxSpring = springSettle(0.55, 20);

// Linear drag + gravity, solved analytically: v' = -k v + g
const DRAG = 2.6;
const GRAVITY = 0.2; // in units of S per second²
const REPEL = 1.9; // reverse-gravity toward the edges during the reset, S/s²

function makeSparks(count: number): Spark[] {
  const r = mulberry32(0x2f1d);
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * TAU + (r() - 0.5) * 0.5;
    const speed = 0.75 + r() * 1.7;
    return {
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed * 0.72 - (0.35 + r() * 0.5),
      size: 0.55 + r() * 0.9,
      color: i % 3,
      twinkle: 5 + r() * 9,
      phase: r() * TAU,
      rot: r() * TAU,
      spin: (r() - 0.5) * 16,
    };
  });
}

const CUBE_V = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];
const CUBE_F = [
  [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [0, 3, 7, 4],
];
const LIGHT = (() => {
  const v = [-0.45, -0.75, 0.6];
  const l = Math.hypot(v[0], v[1], v[2]);
  return v.map((x) => x / l);
})();

export function createTwoPixelIntro(canvas: HTMLCanvasElement, options: IntroOptions = {}): IntroController {
  const o = {
    wordmark: 'twopixeldev',
    tagline: '[ SYSTEM INITIALIZING // SITE IN DEVELOPMENT ]',
    displayFont: '"Unbounded", "Arial Black", "Helvetica Neue", sans-serif',
    monoFont: '"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
    autoplay: true,
    maxPixels: 1_200_000,
    once: false,
    holdAt: 6.2,
    ...options,
  };

  const ctx = canvas.getContext('2d')!;
  const layer = () => {
    const c = document.createElement('canvas');
    return [c, c.getContext('2d')!] as const;
  };
  const [buf, b] = layer(); // scene
  const [tmp, tc] = layer(); // chromatic aberration channel
  const [txt, xc] = layer(); // typography layer
  const [bl1, bc1] = layer(); // bloom threshold (¼ res)
  const [bl2, bc2] = layer(); // bloom blur (¼ res)
  const [scan, sc] = layer();

  const sparks = makeSparks(28);
  let W = 0, H = 0, S = 1, dpr = 1;
  let bg: CanvasGradient | null = null;
  let vignette: CanvasGradient | null = null;
  let scanPattern: CanvasPattern | null = null;
  let wordSize = 0, monoSize = 0, charW = 0;

  function layoutText() {
    xc.font = `800 100px ${o.displayFont}`;
    const m = xc.measureText(o.wordmark).width || 600;
    wordSize = Math.min(S * 0.17, (W * 0.84 * 100) / m);
    xc.font = `500 100px ${o.monoFont}`;
    const cw = xc.measureText('M').width / 100 || 0.6;
    const padChars = 4;
    monoSize = Math.min(S * 0.028, (W * 0.88) / ((o.tagline.length + padChars) * cw));
    charW = cw * monoSize;
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = Math.max(2, Math.round(r.width * dpr));
    let h = Math.max(2, Math.round(r.height * dpr));
    const k = Math.min(1, Math.sqrt(o.maxPixels / (w * h)));
    w = Math.round(w * k);
    h = Math.round(h * k);
    if (w === W && h === H) return false;
    W = w; H = h; S = Math.min(W, H);
    for (const c of [canvas, buf, tmp, txt]) { c.width = W; c.height = H; }
    for (const c of [bl1, bl2]) { c.width = Math.ceil(W / 4); c.height = Math.ceil(H / 4); }

    const cx = W / 2, cy = H / 2;
    bg = b.createRadialGradient(cx, cy * 0.92, 0, cx, cy, Math.hypot(cx, cy));
    bg.addColorStop(0, '#171a22');
    bg.addColorStop(0.5, '#0d0e13');
    bg.addColorStop(1, '#070709');

    vignette = ctx.createRadialGradient(cx, cy, S * 0.25, cx, cy, Math.hypot(cx, cy) * 1.02);
    vignette.addColorStop(0, 'rgba(7,7,9,0)');
    vignette.addColorStop(0.65, 'rgba(7,7,9,0.35)');
    vignette.addColorStop(1, 'rgba(7,7,9,0.88)');

    const line = Math.max(2, Math.round(S / 380));
    scan.width = 2; scan.height = line * 2;
    sc.clearRect(0, 0, 2, line * 2);
    sc.fillStyle = 'rgba(0,0,0,0.42)';
    sc.fillRect(0, line, 2, line);
    scanPattern = ctx.createPattern(scan, 'repeat');

    layoutText();
    return true;
  }

  // ───────────────────────── scene pieces ─────────────────────────

  function pixelAt(t: number, side: 0 | 1) {
    const p = approach(clamp(t, 0, 2));
    const R0 = W / 2 + S * 0.18;
    const r = R0 * (1 - p);
    const th = (side ? 0 : Math.PI) + 1.15 * TAU * p;
    const hover = S * 0.05 * (1 - p);
    return { x: W / 2 + Math.cos(th) * r, y: H / 2 + Math.sin(th) * r * ISO - hover, p };
  }

  function drawGrid(t: number) {
    const cx = W / 2, cy = H / 2;
    const g = S * 0.075;
    const N = Math.ceil(W / 2 / (g * C30) + H / 2 / (g * S30)) + 2;
    const M = 2 * N + 1;
    const xs = new Float32Array(M * M);
    const ys = new Float32Array(M * M);
    const br = new Float32Array(M * M);

    const ti = t - 2;
    const p = t < 2 ? approach(t) : 0;
    const well = Math.pow(p, 4) * S * 0.06; // gravity well pulling the floor inward before impact
    const ringR = ti >= 0 ? shockRadius(ti) : -1;
    const ringA = ti >= 0 ? Math.exp(-ti * 1.5) : 0;
    const pulseR = ((t % 2) / 2) * S * 1.5; // ambient pulse, period 2s → 4 per loop
    const pw = S * 0.09;

    for (let i = 0; i < M; i++) {
      const u = i - N;
      for (let j = 0; j < M; j++) {
        const v = j - N;
        let x = (u - v) * g * C30;
        let y = (u + v) * g * S30;
        const d = Math.hypot(x, y / ISO) || 1;
        const ux = x / d, uy = y / d;
        let bright = 0;
        if (well > 0) {
          const f = well * Math.exp(-d / (S * 0.32));
          x -= ux * f; y -= uy * f;
          bright += (well / (S * 0.06)) * 0.5 * Math.exp(-d / (S * 0.18));
        }
        if (ringA > 0.01) {
          const q = (d - ringR) / (S * 0.075);
          const wv = Math.exp(-q * q) * ringA;
          x += ux * wv * S * 0.028;
          y += uy * wv * S * 0.028 - wv * S * 0.04; // wave lifts the floor
          bright += wv * 1.1;
        }
        const q2 = (d - pulseR) / pw;
        bright += 0.32 * Math.exp(-q2 * q2) * clamp(1 - d / (S * 1.5));
        const k = i * M + j;
        xs[k] = cx + x; ys[k] = cy + y; br[k] = bright;
      }
    }

    const breathe = 0.5 + 0.5 * Math.cos((TAU * t) / 2);
    const energy = t > 2 ? 0.5 * Math.exp(-(t - 2) * 0.9) : 0;
    b.lineWidth = Math.max(1, S / 900);
    b.strokeStyle = `rgba(110,140,170,${0.1 + 0.05 * breathe + energy * 0.25})`;
    b.beginPath();
    for (let i = 0; i < M; i++) {
      for (let j = 0; j < M; j++) {
        const k = i * M + j;
        if (j === 0) b.moveTo(xs[k], ys[k]); else b.lineTo(xs[k], ys[k]);
      }
      for (let j = 0; j < M; j++) {
        const k = j * M + i;
        if (j === 0) b.moveTo(xs[k], ys[k]); else b.lineTo(xs[k], ys[k]);
      }
    }
    b.stroke();

    // node "pixels" light up where waves pass
    const ds = Math.max(2, S * 0.0045);
    b.globalCompositeOperation = 'lighter';
    for (let k = 0; k < M * M; k++) {
      const a = br[k];
      if (a < 0.03) continue;
      b.fillStyle = rgba(CYAN, a * 0.9);
      b.fillRect(xs[k] - ds / 2, ys[k] - ds / 2, ds, ds);
    }
    b.globalCompositeOperation = 'source-over';
  }

  const shockRadius = (ti: number) => S * 1.55 * (1 - Math.exp(-ti * 2.3));

  function drawShock(t: number) {
    const ti = t - 2;
    if (ti < 0 || ti > 3.5) return;
    const cx = W / 2, cy = H / 2;
    b.globalCompositeOperation = 'lighter';

    // impact bubble
    const bub = Math.exp(-ti * 7);
    if (bub > 0.01) {
      const r = S * (0.05 + ti * 1.2);
      const gr = b.createRadialGradient(cx, cy, 0, cx, cy, r);
      gr.addColorStop(0, rgba(WHITE, bub));
      gr.addColorStop(0.35, rgba(CYAN, bub * 0.6));
      gr.addColorStop(0.7, rgba(MAGENTA, bub * 0.25));
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      b.fillStyle = gr;
      b.beginPath(); b.arc(cx, cy, r, 0, TAU); b.fill();
    }

    for (const [delay, weight] of [[0, 1], [0.14, 0.45]] as const) {
      const tt = ti - delay;
      if (tt <= 0) continue;
      const r = shockRadius(tt);
      const a = Math.exp(-tt * 1.6) * weight;
      if (a < 0.01) continue;
      const lw = S * 0.007 * (1 + tt * 2) * weight;
      const off = S * 0.006 * Math.exp(-tt * 2);
      const rings: [number[], number, number][] = [[MAGENTA, -off, 0.8], [CYAN, off, 0.8], [WHITE, 0, 0.9]];
      for (const [col, dx, k] of rings) {
        b.strokeStyle = rgba(col, a * k);
        b.lineWidth = col === WHITE ? lw * 0.45 : lw;
        b.beginPath();
        b.ellipse(cx + dx, cy, r, r * ISO, 0, 0, TAU);
        b.stroke();
      }
    }
    b.globalCompositeOperation = 'source-over';
  }

  function drawCube(x: number, y: number, size: number, ax: number, ay: number, col: number[], heat: number) {
    const ca = Math.cos(ax), sa = Math.sin(ax), cb = Math.cos(ay), sb = Math.sin(ay);
    const P = CUBE_V.map(([vx, vy, vz]) => {
      const x1 = vx * cb + vz * sb;
      const z1 = -vx * sb + vz * cb;
      const y1 = vy * ca - z1 * sa;
      const z2 = vy * sa + z1 * ca;
      return [x1, y1, z2];
    });
    const faces = CUBE_F.map((f) => {
      const n = [0, 1, 2].map((ax_) => f.reduce((s, i) => s + P[i][ax_], 0) / 4); // face centre = outward normal
      return { f, n, z: n[2] };
    })
      .filter((f) => f.z > 0)
      .sort((a, c) => a.z - c.z);

    // glow halo
    b.globalCompositeOperation = 'lighter';
    const halo = size * (4.5 + heat * 4);
    const gr = b.createRadialGradient(x, y, 0, x, y, halo);
    gr.addColorStop(0, rgba(col, 0.55 + heat * 0.3));
    gr.addColorStop(0.25, rgba(col, 0.18 + heat * 0.15));
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    b.fillStyle = gr;
    b.beginPath(); b.arc(x, y, halo, 0, TAU); b.fill();
    b.globalCompositeOperation = 'source-over';

    for (const { f, n } of faces) {
      const lit = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      const shade = 0.35 + 0.65 * lit;
      b.beginPath();
      f.forEach((i, k) => {
        const px = x + P[i][0] * size, py = y + P[i][1] * size;
        if (k === 0) b.moveTo(px, py); else b.lineTo(px, py);
      });
      b.closePath();
      const mix = (c: number) => Math.round(c * shade + 255 * Math.max(0, lit - 0.55) * 0.9);
      b.fillStyle = `rgb(${mix(col[0])},${mix(col[1])},${mix(col[2])})`;
      b.fill();
      b.strokeStyle = rgba(WHITE, 0.55 + 0.4 * lit);
      b.lineWidth = Math.max(1, size * 0.08);
      b.stroke();
    }
  }

  function drawPixels(t: number) {
    if (t >= 2) return;
    const cx = W / 2, cy = H / 2;
    const p = approach(t);

    // tension: charged arc between the pixels
    const A = pixelAt(t, 0), B = pixelAt(t, 1);
    const e = seg(p, 0.55, 0.98);
    if (e > 0) {
      const r = mulberry32(Math.floor(t * FPS) * 7919);
      b.globalCompositeOperation = 'lighter';
      for (let pass = 0; pass < 2; pass++) {
        b.strokeStyle = pass ? rgba(WHITE, e * 0.75) : rgba(pass ? CYAN : MAGENTA, e * 0.5);
        b.lineWidth = Math.max(1, S * (pass ? 0.0015 : 0.004));
        b.beginPath();
        const steps = 12;
        const nx = -(B.y - A.y), ny = B.x - A.x;
        const nl = Math.hypot(nx, ny) || 1;
        for (let s = 0; s <= steps; s++) {
          const f = s / steps;
          const jit = s === 0 || s === steps ? 0 : (r() - 0.5) * S * 0.035 * e;
          const px = A.x + (B.x - A.x) * f + (nx / nl) * jit;
          const py = A.y + (B.y - A.y) * f + (ny / nl) * jit;
          if (s === 0) b.moveTo(px, py); else b.lineTo(px, py);
        }
        b.stroke();
      }
      b.globalCompositeOperation = 'source-over';
    }

    // gathering core
    const core = Math.pow(p, 3);
    if (core > 0.01) {
      b.globalCompositeOperation = 'lighter';
      const r = S * (0.06 + 0.22 * core);
      const gr = b.createRadialGradient(cx, cy, 0, cx, cy, r);
      gr.addColorStop(0, rgba(WHITE, core * 0.45));
      gr.addColorStop(0.4, rgba(CYAN, core * 0.12));
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      b.fillStyle = gr;
      b.beginPath(); b.arc(cx, cy, r, 0, TAU); b.fill();
      b.globalCompositeOperation = 'source-over';
    }

    for (const side of [0, 1] as const) {
      const col = side ? MAGENTA : CYAN;
      // motion trail: sampled from the same physics, so it bends along the spiral
      b.globalCompositeOperation = 'lighter';
      b.lineCap = 'round';
      const n = 26;
      let prev = pixelAt(t, side);
      for (let k = 1; k <= n; k++) {
        const tk = t - k * 0.014;
        if (tk < 0) break;
        const q = pixelAt(tk, side);
        const f = 1 - k / n;
        b.strokeStyle = rgba(col, f * 0.7);
        b.lineWidth = S * 0.02 * f * (0.6 + p);
        b.beginPath(); b.moveTo(prev.x, prev.y); b.lineTo(q.x, q.y); b.stroke();
        prev = q;
      }
      b.globalCompositeOperation = 'source-over';
      const P = pixelAt(t, side);
      const size = S * 0.02 * (1 + 0.45 * p);
      drawCube(P.x, P.y, size, t * 1.6 + p * 9 + side * 1.3, t * 2.2 + p * 12 - side, col, p * p);
    }
  }

  function sparkState(s: Spark, t: number) {
    const tau = t - 2;
    const decay = Math.exp(-DRAG * tau);
    const v0x = s.vx * S, v0y = s.vy * S, g = GRAVITY * S;
    let x = (v0x / DRAG) * (1 - decay);
    let y = (v0y / DRAG) * (1 - decay) + (g / DRAG) * (tau - (1 - decay) / DRAG);
    let vx = v0x * decay;
    let vy = v0y * decay + (g / DRAG) * (1 - decay);
    const tr = Math.max(0, t - 6.5);
    if (tr > 0) {
      const d = Math.hypot(x, y) || 1;
      const a = REPEL * S;
      x += (x / d) * 0.5 * a * tr * tr;
      y += (y / d) * 0.5 * a * tr * tr;
      vx += (x / d) * a * tr;
      vy += (y / d) * a * tr;
    }
    return { x: W / 2 + x, y: H / 2 + y, vx, vy };
  }

  function drawSparks(t: number) {
    if (t < 2) return;
    const tau = t - 2;
    const fade = 1 - smooth(seg(t, 7.25, 7.9));
    b.globalCompositeOperation = 'lighter';
    b.lineCap = 'butt';
    for (const s of sparks) {
      const st = sparkState(s, t);
      const col = PALETTE[s.color];
      const tw = 0.7 + 0.3 * Math.sin(tau * s.twinkle + s.phase);
      const a = fade * tw * (0.55 + 0.45 * Math.exp(-tau * 1.2));
      if (a < 0.01) continue;
      const size = S * 0.008 * s.size;
      // velocity streak
      b.strokeStyle = rgba(col, a * 0.55);
      b.lineWidth = size * 0.7;
      b.beginPath();
      b.moveTo(st.x, st.y);
      b.lineTo(st.x - st.vx * 0.035, st.y - st.vy * 0.035);
      b.stroke();
      // glow + micro-voxel
      b.fillStyle = rgba(col, a * 0.18);
      b.fillRect(st.x - size * 1.6, st.y - size * 1.6, size * 3.2, size * 3.2);
      b.save();
      b.translate(st.x, st.y);
      b.rotate(s.rot + s.spin * tau * Math.exp(-tau * 0.4));
      b.fillStyle = rgba(col, a);
      b.fillRect(-size / 2, -size / 2, size, size);
      b.restore();
    }
    b.globalCompositeOperation = 'source-over';
  }

  function drawAtmosphere(t: number) {
    const a = smooth(seg(t, 3.2, 4.2)) * (1 - smooth(seg(t, 6.5, 7.4)));
    if (a <= 0) return;
    const cx = W / 2, cy = H / 2;
    b.globalCompositeOperation = 'lighter';
    for (const [col, dx] of [[CYAN, -0.28], [MAGENTA, 0.28]] as const) {
      const x = cx + dx * Math.min(W, S * 1.6), r = S * 0.55;
      const gr = b.createRadialGradient(x, cy, 0, x, cy, r);
      gr.addColorStop(0, rgba(col, 0.1 * a));
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      b.fillStyle = gr;
      b.fillRect(x - r, cy - r, r * 2, r * 2);
    }
    b.globalCompositeOperation = 'source-over';
  }

  function paintTypeLayer(t: number) {
    const cx = W / 2, cy = H / 2;
    xc.setTransform(1, 0, 0, 1, 0, 0);
    xc.globalCompositeOperation = 'source-over';
    xc.globalAlpha = 1;
    xc.clearRect(0, 0, W, H);

    const wy = cy - wordSize * 0.18;
    const sc = 0.86 + 0.14 * textSpring(t - 3.5);
    xc.save();
    xc.translate(cx, wy);
    xc.scale(sc, sc);
    xc.font = `800 ${wordSize}px ${o.displayFont}`;
    xc.textAlign = 'center';
    xc.textBaseline = 'middle';
    const top = -wordSize * 0.55, bot = wordSize * 0.55;
    const metal = xc.createLinearGradient(0, top, 0, bot);
    metal.addColorStop(0, '#ffffff');
    metal.addColorStop(0.38, '#e4eaf1');
    metal.addColorStop(0.5, '#8a94a3');
    metal.addColorStop(0.56, '#b9c3cf');
    metal.addColorStop(0.8, '#f2f6fa');
    metal.addColorStop(1, '#9aa5b3');
    xc.fillStyle = metal;
    xc.fillText(o.wordmark, 0, 0);

    // sheen: a slanted highlight sweeping across the metal
    const sw = seg(t, 4.35, 5.35);
    if (sw > 0 && sw < 1) {
      const half = xc.measureText(o.wordmark).width / 2;
      const px = -half * 1.4 + sw * half * 2.8;
      const sh = xc.createLinearGradient(px - wordSize * 0.6, top, px + wordSize * 0.6, bot);
      sh.addColorStop(0, 'rgba(255,255,255,0)');
      sh.addColorStop(0.45, 'rgba(200,255,255,0.0)');
      sh.addColorStop(0.5, 'rgba(255,255,255,0.95)');
      sh.addColorStop(0.55, 'rgba(255,200,230,0.0)');
      sh.addColorStop(1, 'rgba(255,255,255,0)');
      xc.globalCompositeOperation = 'source-atop';
      xc.fillStyle = sh;
      xc.fillRect(-half * 1.5, top, half * 3, bot - top);
      xc.globalCompositeOperation = 'source-over';
    }
    xc.restore();

    // terminal badge
    const open = boxSpring(t - 4.05);
    if (open <= 0) return;
    const by = wy + wordSize * 0.62 + monoSize * 1.3;
    const padX = charW * 1.6;
    const fullW = o.tagline.length * charW + padX * 2 + charW * 1.2;
    const bw = fullW * Math.max(0, open);
    const bh = monoSize * 2.3;
    const bx = cx - bw / 2;
    xc.fillStyle = 'rgba(7,7,9,0.72)';
    xc.fillRect(bx, by - bh / 2, bw, bh);
    xc.strokeStyle = rgba(CYAN, 0.45);
    xc.lineWidth = Math.max(1, dpr);
    xc.strokeRect(bx + 0.5, by - bh / 2 + 0.5, bw - 1, bh - 1);
    // corner ticks
    const tk = monoSize * 0.6;
    xc.fillStyle = rgba(MAGENTA, 0.95);
    const tw = Math.max(2, dpr * 1.5);
    for (const [x0, y0, sx, sy] of [[bx, by - bh / 2, 1, 1], [bx + bw, by - bh / 2, -1, 1], [bx, by + bh / 2, 1, -1], [bx + bw, by + bh / 2, -1, -1]]) {
      xc.fillRect(x0, y0, tk * sx, tw * sy);
      xc.fillRect(x0, y0, tw * sx, tk * sy);
    }
    if (open < 0.6) return;

    const typed = Math.floor(seg(t, 4.35, 5.65) * o.tagline.length);
    xc.font = `500 ${monoSize}px ${o.monoFont}`;
    xc.textAlign = 'left';
    xc.textBaseline = 'middle';
    const x0 = cx - fullW / 2 + padX;
    for (let i = 0; i < typed; i++) {
      const ch = o.tagline[i];
      xc.fillStyle = '[]/'.includes(ch) ? rgba(MAGENTA, 1) : i > 22 ? rgba(WHITE, 0.92) : rgba(CYAN, 1);
      xc.fillText(ch, x0 + i * charW, by + monoSize * 0.04);
    }
    // `idle` keeps the cursor blinking while a `once` intro holds
    const typing = t < 5.65;
    const blinkOn = typing || Math.floor((t - 5.65 + idle) * 2.6) % 2 === 0;
    if (blinkOn) {
      xc.fillStyle = rgba(CYAN, 0.95);
      xc.fillRect(x0 + typed * charW + charW * 0.15, by - monoSize * 0.58, charW * 0.85, monoSize * 1.16);
    }
  }

  // glitch bursts: (1-focus)² while resolving, plus a short hiccup during the hold
  const glitchAt = (t: number) => {
    const focus = seg(t, 3.5, 4.45);
    let g = t >= 3.5 ? (1 - focus) * (1 - focus) : 0;
    if (t > 5.95 && t < 6.03) g += 0.35;
    return g;
  };

  function drawType(t: number) {
    if (t < 3.5 || t > 7.45) return;
    paintTypeLayer(t);
    const cx = W / 2, cy = H / 2;
    const gi = glitchAt(t);
    const e = seg(t, 6.5, 7.3);
    const fade = 1 - smooth(seg(t, 6.85, 7.35));
    const rng = mulberry32(Math.floor(t * 30) * 2654435761);
    let base = smooth(seg(t, 3.5, 3.72));
    if (gi > 0.05 && rng() < 0.3 * gi) base *= 0.35; // flicker

    const y0 = Math.max(0, Math.floor(cy - wordSize * 0.9));
    const y1 = Math.min(H, Math.ceil(cy + wordSize * 0.6 + monoSize * 4));

    b.save();
    b.shadowColor = rgba(CYAN, 0.55);
    b.shadowBlur = S * 0.035;
    if (gi < 0.01 && e <= 0) {
      b.globalAlpha = base;
      b.drawImage(txt, 0, y0, W, y1 - y0, 0, y0, W, y1 - y0);
    } else {
      b.shadowBlur = S * 0.02;
      const hs = Math.max(2, Math.round(e > 0 ? S * 0.0045 : S * 0.014));
      const collapse = smooth(e);
      const xs = 1 + collapse * 0.45;
      for (let y = y0, i = 0; y < y1; y += hs, i++) {
        let dx = 0;
        let a = base * fade;
        if (gi > 0.01 && rng() < 0.5) dx = (rng() - 0.5) * gi * S * 0.2;
        let dy = y, dh = hs;
        if (e > 0) {
          if (i % 2) a *= Math.max(0, 1 - e * 2.4);
          dx += Math.sin(i * 0.8 + t * 42) * e * e * S * 0.07;
          dy = cy + (y - cy) * (1 - 0.92 * collapse);
          dh = Math.max(1, hs * (1 - 0.92 * collapse));
        }
        if (a <= 0.005) continue;
        b.globalAlpha = a;
        b.drawImage(txt, 0, y, W, hs, cx - (W * xs) / 2 + dx, dy, W * xs, dh);
      }
    }
    b.restore();

    // CRT power-off line
    const line = seg(t, 7.0, 7.45);
    if (line > 0 && line < 1) {
      const lw = W * 0.55 * (1 - smooth(seg(t, 7.2, 7.45)));
      b.globalCompositeOperation = 'lighter';
      b.fillStyle = rgba(WHITE, 0.7 * (1 - line));
      b.fillRect(cx - lw / 2, cy - Math.max(1, dpr), lw, Math.max(2, dpr * 2));
      b.globalCompositeOperation = 'source-over';
    }
  }

  // ───────────────────────── frame ─────────────────────────

  function render(t: number) {
    const ti = t - 2;
    let sx = 0, sy = 0;
    if (ti >= 0 && ti < 1.8) {
      const amp = S * 0.026 * Math.exp(-ti * 4.2); // damped oscillation camera shake
      sx = amp * Math.sin(ti * 71);
      sy = amp * Math.cos(ti * 57 + 1.3);
    } else if (t < 2) {
      const pre = Math.pow(approach(t), 8) * S * 0.003;
      sx = pre * Math.sin(t * 190);
      sy = pre * Math.cos(t * 170);
    }

    b.setTransform(1, 0, 0, 1, 0, 0);
    b.globalAlpha = 1;
    b.globalCompositeOperation = 'source-over';
    b.fillStyle = bg!;
    b.fillRect(0, 0, W, H);
    b.translate(sx, sy);
    drawGrid(t);
    drawAtmosphere(t);
    drawShock(t);
    drawPixels(t);
    drawSparks(t);
    drawType(t);
    b.setTransform(1, 0, 0, 1, 0, 0);

    // post: chromatic aberration
    let ca = 0;
    if (ti >= 0) ca += S * 0.014 * Math.exp(-ti * 4.5);
    if (t < 2) ca += S * 0.004 * Math.pow(approach(t), 6);
    ca += glitchAt(t) * S * 0.008 + seg(t, 6.5, 7.3) * (1 - seg(t, 7.2, 7.5)) * S * 0.006;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    if (ca > 0.5) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      const channels: [string, number][] = [['#ff0000', -ca], ['#00ff00', 0], ['#0000ff', ca]];
      for (const [col, dx] of channels) {
        tc.globalCompositeOperation = 'copy';
        tc.drawImage(buf, 0, 0);
        tc.globalCompositeOperation = 'multiply';
        tc.fillStyle = col;
        tc.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(tmp, dx, 0);
      }
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.drawImage(buf, 0, 0);
    }

    // post: bloom (¼ res, squared to keep only the bright parts, then blurred)
    const bw = bl1.width, bh = bl1.height;
    bc1.globalCompositeOperation = 'copy';
    bc1.drawImage(canvas, 0, 0, bw, bh);
    bc1.globalCompositeOperation = 'multiply';
    bc1.drawImage(bl1, 0, 0);
    bc1.drawImage(bl1, 0, 0);
    bc2.globalCompositeOperation = 'copy';
    bc2.filter = `blur(${Math.max(1.5, S / 4 / 70)}px)`;
    bc2.drawImage(bl1, 0, 0);
    bc2.filter = 'none';
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.9;
    ctx.drawImage(bl2, 0, 0, W, H);
    ctx.globalAlpha = 1;

    // impact flash
    let flash = 0;
    if (t > 1.94 && t < 2) flash = seg(t, 1.94, 2) * 0.35;
    if (ti >= 0) flash = 0.9 * Math.exp(-ti * 11);
    if (flash > 0.005) {
      ctx.fillStyle = rgba(WHITE, flash);
      ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'source-over';

    // CRT: rolling band, scanlines, vignette
    const bandY = ((((t + idle) % 4)) / 4) * (H + S * 0.4) - S * 0.2;
    const band = ctx.createLinearGradient(0, bandY - S * 0.12, 0, bandY + S * 0.12);
    band.addColorStop(0, 'rgba(255,255,255,0)');
    band.addColorStop(0.5, 'rgba(180,240,255,0.035)');
    band.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = band;
    ctx.fillRect(0, bandY - S * 0.12, W, S * 0.24);
    if (scanPattern) {
      ctx.fillStyle = scanPattern;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.fillStyle = vignette!;
    ctx.fillRect(0, 0, W, H);
  }

  // ───────────────────────── playback ─────────────────────────

  let playing = false;
  let time = 0;
  let origin = 0;
  let raf = 0;
  let idle = 0; // seconds spent holding (once mode); drives the ambient CRT band + cursor
  let completed = false;
  const quantize = (t: number) => Math.floor(t * FPS) / FPS;

  function draw() {
    render(quantize(time));
    o.onFrame?.(time);
  }
  // Once the logo holds, only a slow CRT band and the cursor move: redraw at ~15 fps instead of 60.
  const IDLE_FRAME_MS = 1000 / 15;
  let lastDraw = 0;
  let visible = true;
  // While the page scrolls, the held logo is not redrawn at all, so scrolling gets the whole frame budget.
  let lastScroll = -1e9;
  const onScroll = () => { lastScroll = performance.now(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  function tick(now: number) {
    const elapsed = (now - origin) / 1000;
    let holding = false;
    if (o.once && elapsed >= o.holdAt) {
      time = o.holdAt;
      idle = elapsed - o.holdAt;
      holding = true;
      if (!completed) { completed = true; o.onComplete?.(); }
    } else {
      time = ((elapsed % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS;
    }
    const scrolling = now - lastScroll < 300;
    if (!holding || (!scrolling && now - lastDraw >= IDLE_FRAME_MS)) { lastDraw = now; draw(); }
    raf = requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(() => { if (resize()) draw(); });
  ro.observe(canvas);

  // Stop rendering while the canvas is scrolled out of view or the tab is hidden.
  let wanted = false;
  const sync = () => {
    const run = wanted && visible && !document.hidden;
    if (run && !playing) start();
    else if (!run && playing) stop();
  };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
  io.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  function start() {
    playing = true;
    origin = performance.now() - (o.once && completed ? o.holdAt + idle : time) * 1000;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    playing = false;
    cancelAnimationFrame(raf);
  }
  resize();
  document.fonts?.ready.then(() => { layoutText(); if (!playing) draw(); });

  const api: IntroController = {
    play() {
      wanted = true;
      sync();
    },
    pause() {
      wanted = false;
      stop();
    },
    seek(seconds: number) {
      time = ((seconds % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS;
      if (playing) origin = performance.now() - time * 1000;
      else draw();
    },
    get time() { return time; },
    get playing() { return playing; },
    wordmarkBox() {
      xc.font = `800 ${wordSize}px ${o.displayFont}`;
      const w = xc.measureText(o.wordmark).width;
      return { cx: 0.5, cy: (H / 2 - wordSize * 0.18) / H, w: w / W, h: (wordSize * 1.1) / H };
    },
    destroy() {
      api.pause();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', sync);
    },
  };

  draw();
  if (o.autoplay) api.play();
  return api;
}
