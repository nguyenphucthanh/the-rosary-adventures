/**
 * Scenery toolkit for the storybook illustrations. Everything lands on an integer pixel grid:
 * we paint into a colour buffer (so shading can read neighbours) and flush it as 1px-tall integer rects.
 * "Gradients" are ordered-dither bands, shapes are shaded per pixel with a 3-4 colour ramp, no AA, no alpha blur.
 */

export type Inside = (x: number, y: number) => boolean;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bayer = (x: number, y: number) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;

export function hash(x: number, y: number, seed = 0) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 2147483647)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
/** Smooth 2D value noise 0..1. */
export function noise(x: number, y: number, seed = 0) {
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0, seed), b = hash(x0 + 1, y0, seed), c = hash(x0, y0 + 1, seed), d = hash(x0 + 1, y0 + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
export const fbm = (x: number, y: number, seed = 0, oct = 4) => {
  let v = 0, amp = 0.5, f = 1, tot = 0;
  for (let i = 0; i < oct; i++) { v += noise(x * f, y * f, seed + i * 17) * amp; tot += amp; amp /= 2; f *= 2; }
  return v / tot;
};
export const rng = (seed: number) => { let s = seed | 0; return () => ((s = (Math.imul(s ^ (s >>> 15), 2246822519) + 1013904223) | 0), ((s >>> 0) % 100000) / 100000); };

const toRgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
const toHex = (r: number, g: number, b: number) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
/** Mix two hex colours (build ramps once, at load - the result is still a flat palette colour). */
export const mix = (a: string, b: string, t: number) => { const p = toRgb(a), q = toRgb(b); return toHex(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t); };
/** n-step ramp from a (lightest) to b (darkest). */
export const ramp = (a: string, b: string, n: number) => Array.from({ length: n }, (_, i) => mix(a, b, n === 1 ? 0 : i / (n - 1)));

export class Buf {
  readonly px: (string | undefined)[];
  constructor(readonly w: number, readonly h: number) { this.px = new Array(w * h); }
  set(x: number, y: number, c: string) { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.px[y * this.w + x] = c; }
  get(x: number, y: number) { return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.px[y * this.w + x] : undefined; }
  rect(x: number, y: number, w: number, h: number, c: string) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c); }
  /** Paint a char-map (1 char = 1px, "." transparent) through a key->colour table. */
  map(rows: string[], x: number, y: number, key: Record<string, string>, mirror = false) {
    rows.forEach((row, j) => { const n = row.length; for (let i = 0; i < n; i++) { const ch = row[i]; if (ch !== "." && key[ch]) this.set(x + (mirror ? n - 1 - i : i), y + j, key[ch]); } });
  }
  /** Vertical sky: colour stops spread over [y0,y1), neighbours dithered together (stepped, never smooth). */
  sky(y0: number, y1: number, cols: string[], x0 = 0, x1 = this.w) {
    const n = cols.length, hgt = y1 - y0;
    for (let y = y0; y < y1; y++) {
      const t = ((y - y0) / hgt) * (n - 1), i = Math.min(n - 2, Math.floor(t)), f = t - i;
      for (let x = x0; x < x1; x++) this.set(x, y, f > bayer(x, y) * 0.999 ? cols[i + 1] : cols[i]);
    }
  }
  /** Dithered overlay of colour `c` at density 0..1 inside a mask. */
  veil(inside: Inside, bb: number[], c: string, density: number) {
    for (let y = bb[1]; y < bb[3]; y++) for (let x = bb[0]; x < bb[2]; x++) if (density > bayer(x, y) && inside(x, y)) this.set(x, y, c);
  }
  /**
   * Shade a shape with a ramp [highlight, mid, shade, deep?]. Light comes from (lx,ly); pixels near the lit edge get the
   * highlight, pixels near the far edge the shade. `tex` adds noise dither between neighbouring tones.
   */
  shade(inside: Inside, bb: number[], cols: string[], o: { lx?: number; ly?: number; r?: number; tex?: number; seed?: number; outline?: string } = {}) {
    const lx = o.lx ?? -1, ly = o.ly ?? -1, r = o.r ?? 2, tex = o.tex ?? 0.35, seed = o.seed ?? 1;
    const last = cols.length - 1;
    for (let y = bb[1]; y < bb[3]; y++) for (let x = bb[0]; x < bb[2]; x++) {
      if (!inside(x, y)) continue;
      let t = 1; // index into cols; 1 = mid
      if (!inside(x + lx * r, y + ly * r)) t = 0;
      else if (!inside(x - lx * r * 1.5, y - ly * r * 1.5)) t = 2;
      else if (last > 2 && !inside(x - lx * r * 3, y - ly * r * 3)) t = 2;
      if (t === 2 && last > 2 && !inside(x - lx * r * 2.5, y - ly * r * 2.5) && !inside(x - lx * r * 3 - ly, y - ly * r * 3 + lx)) t = 3;
      const n = noise(x * 0.9, y * 0.9, seed) - 0.5;
      if (n * tex * 2 > 0.15 && t < last && hash(x, y, seed) > 0.4) t++;
      else if (n * tex * 2 < -0.15 && t > 0 && hash(x, y, seed + 3) > 0.5) t--;
      this.set(x, y, cols[Math.min(last, t)]);
    }
    if (o.outline) for (let y = bb[1]; y < bb[3]; y++) for (let x = bb[0]; x < bb[2]; x++) if (!inside(x, y) && (inside(x + 1, y) || inside(x - 1, y) || inside(x, y + 1) || inside(x, y - 1))) this.set(x, y, o.outline);
  }
  flush(ctx: CanvasRenderingContext2D) {
    for (let y = 0; y < this.h; y++) {
      let x = 0;
      while (x < this.w) {
        const c = this.px[y * this.w + x];
        if (!c) { x++; continue; }
        let e = x + 1;
        while (e < this.w && this.px[y * this.w + e] === c) e++;
        ctx.fillStyle = c;
        ctx.fillRect(x, y, e - x, 1);
        x = e;
      }
    }
  }
}

// ------------------------------------------------------------------ shapes
export type Circle = [number, number, number] | [number, number, number, number]; // cx, cy, rx, ry?
export const blobs = (cs: Circle[]): Inside => (x, y) => cs.some(([cx, cy, rx, ry = rx]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);
export const bounds = (cs: Circle[], pad = 1) => [
  Math.floor(Math.min(...cs.map((c) => c[0] - c[2])) - pad), Math.floor(Math.min(...cs.map((c) => c[1] - (c[3] ?? c[2]))) - pad),
  Math.ceil(Math.max(...cs.map((c) => c[0] + c[2])) + pad), Math.ceil(Math.max(...cs.map((c) => c[1] + (c[3] ?? c[2]))) + pad),
];
export const box = (x: number, y: number, w: number, h: number): Inside => (px, py) => px >= x && py >= y && px < x + w && py < y + h;
export const both = (a: Inside, b: Inside): Inside => (x, y) => a(x, y) && b(x, y);

/** Shaded round-ish blob set (bushes, canopies, rocks, fur). */
export function lump(b: Buf, cs: Circle[], cols: string[], o: Parameters<Buf["shade"]>[3] = {}) {
  b.shade(blobs(cs), bounds(cs), cols, o);
}

/** Flat-bottomed cumulus: tall puffs on a hump profile, lit top-left, shaded underside. cols = [lit, mid, shade, deep]. */
export function cloud(b: Buf, x: number, y: number, w: number, h: number, seed: number, cols: string[]) {
  const r = rng(seed), cs: Circle[] = [], base = y + h - 1;
  const n = Math.max(3, Math.round(w / 11));
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, hump = Math.sin(t * Math.PI) ** 0.8;
    const rad = Math.max(4, h * (0.14 + 0.42 * hump) * (0.55 + r() * 0.95));
    cs.push([x + t * w + (r() - 0.5) * 6, base - rad * 0.85, rad, rad]);
  }
  for (let i = 0; i < 3; i++) cs.push([x + (0.25 + r() * 0.5) * w, base - h * 0.35, h * 0.3, h * 0.28]);
  const inside = both(blobs(cs), (_x, py) => py <= base);
  const bb = [x - 20, y - 4, x + w + 20, base + 1];
  b.shade(inside, bb, cols, { lx: -1, ly: -1.4, r: 3, tex: 0.12, seed });
  for (let py = base - 4; py <= base; py++) for (let px = bb[0]; px < bb[2]; px++) if (inside(px, py) && bayer(px, py) < (py - (base - 5)) / 5.5) b.set(px, py, cols[Math.min(cols.length - 1, 2 + (py === base ? 1 : 0))]);
}

/** Tapered ridge/mountain band. `cols` = [lit, mid, shade, deep]. Peaks hash-seeded, snow optional. */
export function ridge(b: Buf, o: { base: number; amp: number; freq: number; seed: number; cols: string[]; x0?: number; x1?: number; bottom?: number; snow?: string[]; haze?: string; hazeAmt?: number; sharp?: number }) {
  const x0 = o.x0 ?? 0, x1 = o.x1 ?? b.w, bottom = o.bottom ?? b.h, sharp = o.sharp ?? 1;
  const hts: number[] = [];
  for (let x = x0 - 2; x < x1 + 2; x++) {
    const n = fbm(x * o.freq, o.seed, o.seed, 4);
    const peak = Math.abs(fbm(x * o.freq * 0.5 + 7, o.seed + 9, o.seed, 2) - 0.5) * 2;
    hts[x - x0 + 2] = Math.round(o.base - o.amp * Math.pow(n, sharp) * (0.6 + peak * 0.8));
  }
  const H = (x: number) => hts[x - x0 + 2];
  for (let x = x0; x < x1; x++) {
    const top = H(x), slope = H(x + 2) - H(x - 2); // >0 : ground falls to the right
    for (let y = top; y < bottom; y++) {
      const d = y - top;
      let t = slope < -1 ? 0 : slope > 1 ? 2 : 1; // left-lit
      if (d < 2) t = Math.max(0, t - 1);
      const nz = fbm(x * 0.12 + y * 0.02, y * 0.28, o.seed + 5, 3);
      if (nz > 0.64 && t < 3) t++; else if (nz < 0.36 && t > 0) t--;
      if (d > 14 && nz > 0.5 && o.cols.length > 3) t = Math.min(3, t + 1);
      let c = o.cols[Math.min(o.cols.length - 1, t)];
      if (o.snow && d < 7 + Math.floor(noise(x * 0.3, 0, o.seed) * 4) && top < o.base - o.amp * 0.45) c = o.snow[Math.min(o.snow.length - 1, t)];
      if (o.haze && o.hazeAmt && (y - top) * 0 + (y - top) < 40 && o.hazeAmt * (1 - d / 40) > bayer(x, y)) c = o.haze;
      b.set(x, y, c);
    }
  }
}

/** Stars: 1px with the odd 3px cross. */
export function stars(b: Buf, n: number, seed: number, area: number[], cols: string[]) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x = Math.floor(area[0] + r() * (area[2] - area[0])), y = Math.floor(area[1] + r() * (area[3] - area[1])), big = r() > 0.82;
    b.set(x, y, cols[0]);
    if (big) { b.set(x - 1, y, cols[1]); b.set(x + 1, y, cols[1]); b.set(x, y - 1, cols[1]); b.set(x, y + 1, cols[1]); }
  }
}
export function twinkle(b: Buf, x: number, y: number, len: number, c: string, c2: string) {
  for (let i = 1; i <= len; i++) { const col = i > len / 2 ? c2 : c; b.set(x - i, y, col); b.set(x + i, y, col); b.set(x, y - i, col); b.set(x, y + i, col); }
  b.set(x, y, c);
}

/** Water: dithered body + rows of short ripples, longer and brighter toward the viewer. */
export function water(b: Buf, y0: number, y1: number, cols: string[], glint: string[], seed: number, x0 = 0, x1 = b.w) {
  b.sky(y0, y1, cols, x0, x1);
  const r = rng(seed);
  for (let y = y0 + 2; y < y1; y += 2) {
    const t = (y - y0) / (y1 - y0), n = Math.round(4 + t * 10);
    for (let i = 0; i < n; i++) {
      const x = Math.floor(x0 + r() * (x1 - x0)), len = Math.round(3 + t * 12 * (0.4 + r()));
      for (let k = 0; k < len; k++) b.set(x + k, y, glint[r() > 0.55 + t * 0.2 ? 1 : 0]);
      if (r() > 0.5) for (let k = 2; k < len - 2; k++) b.set(x + k, y + 1, glint[2] ?? glint[1]);
    }
  }
}

/** Stepped light beam / ray fan (dithered 'alpha'): polygon given as top width at y0 and bottom width at y1. */
export function beam(b: Buf, cx: number, y0: number, y1: number, topW: number, botW: number, cols: string[], falloff = 0.0) {
  for (let y = y0; y < y1; y++) {
    const t = (y - y0) / (y1 - y0), half = (topW + (botW - topW) * t) / 2;
    for (let x = Math.floor(cx - half); x <= Math.ceil(cx + half); x++) {
      const e = Math.abs(x - cx) / half; // 0 centre .. 1 edge
      const lvl = Math.floor((1 - e) * cols.length);
      if (lvl <= 0) continue;
      if (falloff > 0 && t * falloff > bayer(x, y)) continue;
      b.set(x, y, cols[Math.min(cols.length - 1, lvl - 1)]);
    }
  }
}

/** Soft light halo as stepped dithered discs around a point. */
export function glow(b: Buf, cx: number, cy: number, r: number, cols: string[], dens = 0.7) {
  for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
    const d = Math.hypot(x - cx, y - cy) / r;
    if (d > 1) continue;
    const i = Math.min(cols.length - 1, Math.floor(d * cols.length));
    if (dens * (1 - d * 0.6) > bayer(x, y)) b.set(x, y, cols[i]);
  }
}

/** Solid shaded disc (sun, moon). */
export function orb(b: Buf, cx: number, cy: number, r: number, cols: string[], o: { lx?: number; ly?: number; seed?: number } = {}) {
  lump(b, [[cx, cy, r]], cols, { r: Math.max(2, Math.round(r / 3)), tex: 0.4, ...o });
}

// ------------------------------------------------------------------ creatures
/** White dove in flight, wings raised; (cx, cy) = middle of the body, ~34px wide. Shaded + outlined, facing right (mirror flips). */
export function dove(b: Buf, cx: number, cy: number, mirror = false, outline = "#7f90b8") {
  const m = mirror ? -1 : 1, X = (dx: number) => cx + m * dx;
  const chain = (pts: number[][]): Circle[] => pts.map(([dx, dy, r]) => [X(dx), cy + dy, r, r] as Circle);
  const all = (cs: Circle[], cols: string[], o = {}) => lump(b, cs, cols, { r: 2, tex: 0.1, lx: -m, ly: -1, outline, ...o });
  // far wing (behind), near wing, tail, body, head
  all(chain([[2, -3, 3], [4, -7, 3], [5, -11, 2.6], [5, -15, 2.2], [4, -18, 1.8]]), ["#eef2fa", "#d3ddf0", "#b4c3e0"]);
  all(chain([[-14, 1, 2.5], [-11, 2, 3], [-8, 1, 3.5], [-17, 4, 2], [-13, 5, 2.4]]), ["#ffffff", "#f3f6fc", "#d3ddf0"]);
  all(chain([[-8, 0, 6], [-3, 1, 6.5], [3, 1, 6], [8, -1, 5], [11, -5, 4.2]]), ["#ffffff", "#ffffff", "#e3eaf7", "#c2cfe8"]);
  all(chain([[-2, -3, 5], [-5, -6, 5.4], [-8, -9, 5], [-11, -12, 4.4], [-14, -14, 3.8], [-17, -16, 3], [-19, -17, 2.2], [-14, -9, 5], [-9, -5, 6]]), ["#ffffff", "#ffffff", "#e3eaf7", "#c2cfe8"], { r: 3 });
  for (const [dx, dy] of [[-17, -12], [-15, -9], [-12, -6], [-9, -2]]) { b.set(X(dx), cy + dy, "#c5d0e6"); b.set(X(dx - 1), cy + dy + 1, "#c5d0e6"); } // feather lines
  b.set(X(15), cy - 5, "#f2a93b"); b.set(X(16), cy - 4, "#f2a93b"); b.set(X(17), cy - 4, "#d9801f"); // beak
  b.set(X(12), cy - 6, "#1d2440"); // eye
  b.set(X(8), cy - 1, "#f6d9d0"); // blush
}

/** Fruit/leaf tree. cols = [lit, mid, shade, deep]. (cx, baseY) is the trunk foot. */
export function tree(b: Buf, cx: number, baseY: number, o: { h: number; w?: number; cols: string[]; trunk?: string[]; fruit?: string; seed?: number; bare?: boolean; shadow?: string }) {
  const seed = o.seed ?? 1, r = rng(seed), w = o.w ?? o.h * 0.8, trunk = o.trunk ?? ["#a8683a", "#7a4524", "#4d2a14"];
  const th = Math.round(o.h * 0.46), tw = Math.max(3, Math.round(o.h / 9));
  // contact shadow
  for (let y = baseY - 3; y <= baseY + 4; y++) for (let x = Math.floor(cx - Math.min(w, 70) * 0.6); x <= cx + Math.min(w, 70) * 0.6; x++) if (((x - cx) / (Math.min(w, 70) * 0.55)) ** 2 + ((y - baseY - 0.5) / 3.5) ** 2 <= 1) b.set(x, y, o.shadow ?? "#2a6a2e");
  for (let y = baseY - th; y <= baseY; y++) {
    const flare = y > baseY - 4 ? 1 : 0;
    for (let x = cx - Math.floor(tw / 2) - flare; x <= cx + Math.floor(tw / 2) + flare; x++) b.set(x, y, x <= cx - Math.floor(tw / 2) ? trunk[0] : x >= cx + Math.floor(tw / 2) ? trunk[2] : trunk[1]);
  }
  if (o.bare) return;
  const cy = baseY - th - o.h * 0.22, cs: Circle[] = [[cx, cy, w * 0.34, o.h * 0.3]];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + r();
    cs.push([cx + Math.cos(a) * w * 0.28, cy + Math.sin(a) * o.h * 0.2, w * (0.2 + r() * 0.08), o.h * (0.17 + r() * 0.06)]);
  }
  lump(b, cs, o.cols, { r: 3, tex: 0.45, seed, lx: -1, ly: -1 });
  if (o.fruit) for (let i = 0; i < 7; i++) {
    const fx = Math.round(cx + (r() - 0.5) * w * 0.7), fy = Math.round(cy + (r() - 0.35) * o.h * 0.4);
    b.set(fx, fy, o.fruit); b.set(fx + 1, fy, o.fruit); b.set(fx, fy + 1, mix(o.fruit, "#000000", 0.35)); b.set(fx + 1, fy + 1, mix(o.fruit, "#000000", 0.35)); b.set(fx, fy, mix(o.fruit, "#ffffff", 0.55));
  }
}

/** Grassy ground band with stipple tufts and optional flowers. cols = [light, mid, dark]. */
export function meadow(b: Buf, y0: number, y1: number, cols: string[], seed: number, flowers: string[] = [], x0 = 0, x1 = b.w) {
  b.sky(y0, y1, [cols[0], cols[1], cols[2]], x0, x1);
  const r = rng(seed), n = Math.round(((x1 - x0) * (y1 - y0)) / 55);
  for (let i = 0; i < n; i++) {
    const x = Math.floor(x0 + r() * (x1 - x0)), y = Math.floor(y0 + 2 + r() * (y1 - y0 - 2)), t = (y - y0) / (y1 - y0), hgt = 2 + Math.floor(t * 3);
    const c = r() > 0.5 ? cols[0] : cols[2];
    for (let k = 0; k < hgt; k++) { b.set(x, y - k, c); if (k > 0 && hgt > 2) { b.set(x - 1 - (k > 2 ? 1 : 0), y - k - 0, k === hgt - 1 ? c : cols[1]); b.set(x + 1 + (k > 2 ? 1 : 0), y - k, k === hgt - 1 ? c : cols[1]); } }
  }
  if (flowers.length) for (let i = 0; i < n / 5; i++) {
    const x = Math.floor(x0 + r() * (x1 - x0)), y = Math.floor(y0 + 3 + r() * (y1 - y0 - 3)), f = flowers[Math.floor(r() * flowers.length)];
    b.set(x, y, f); b.set(x - 1, y, f); b.set(x + 1, y, f); b.set(x, y - 1, f); b.set(x, y + 1, f); b.set(x, y, "#fff7c2");
  }
}

/** A river seen from above-front: centre x and half-width are functions of y; banks lit, ripples + sparkle. cols = [light, mid, deep]. */
export function river(b: Buf, y0: number, y1: number, xAt: (y: number) => number, wAt: (y: number) => number, cols: string[], seed: number, bank = ["#e9f6c8", "#bfe38a"]) {
  const r = rng(seed);
  for (let y = y0; y < y1; y++) {
    const cx = Math.round(xAt(y)), w = Math.round(wAt(y));
    for (let x = cx - w - 2; x <= cx + w + 2; x++) {
      const d = Math.abs(x - cx);
      if (d > w + 1) b.set(x, y, bank[1]); else if (d > w) b.set(x, y, bank[0]);
      else { const e = d / w; b.set(x, y, e > 0.8 ? cols[2] : e > 0.5 && bayer(x, y) > 0.5 ? cols[2] : y % 5 === 0 && hash(x, y, seed) > 0.8 ? "#ffffff" : cols[e > 0.55 ? 1 : 0]); }
    }
    if (r() > 0.55) { const rx = cx - w + 2 + Math.floor(r() * Math.max(1, 2 * w - 8)); for (let k = 0; k < 4 + (y - y0) / 12; k++) b.set(rx + k, y, "#ffffff"); }
  }
}

/** Slanted light ray from (x0,y0) to (x1,y1), soft dithered edges. cols = [outer .. core]. */
export function ray(b: Buf, x0: number, y0: number, x1: number, y1: number, w0: number, w1: number, cols: string[], dens = 0.8) {
  for (let y = y0; y < y1; y++) {
    const t = (y - y0) / (y1 - y0), cx = x0 + (x1 - x0) * t, half = (w0 + (w1 - w0) * t) / 2;
    for (let x = Math.floor(cx - half); x <= Math.ceil(cx + half); x++) {
      const e = 1 - Math.abs(x - cx) / half;
      if (e <= 0 || dens * Math.sqrt(e) * (1 - t * 0.5) <= bayer(x, y)) continue;
      b.set(x, y, cols[Math.min(cols.length - 1, Math.floor(e * cols.length))]);
    }
  }
}
