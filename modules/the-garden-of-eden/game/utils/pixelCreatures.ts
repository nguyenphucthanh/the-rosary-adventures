import { Buf, lump, mix } from "@/modules/the-garden-of-eden/game/utils/pixelScenery";
import type { Circle } from "@/modules/the-garden-of-eden/game/utils/pixelScenery";

/** People and animals for the storybook art - built from shaded circle chains, still one pixel grid. */

/** Circles along a tapered limb from (x1,y1,r1) to (x2,y2,r2). */
export function limb(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): Circle[] {
  const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 1.5)), out: Circle[] = [];
  for (let i = 0; i <= n; i++) { const t = i / n, r = r1 + (r2 - r1) * t; out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r, r]); }
  return out;
}
const sh = (c: string) => [mix(c, "#ffffff", 0.28), c, mix(c, "#000000", 0.2), mix(c, "#000000", 0.38)];
export const SKIN = ["#fbe0bd", "#f1c496", "#d9a073", "#b97f58"];

export interface PersonOpts {
  hair: string; robe?: string; leaf?: string; long?: boolean; skin?: string[]; armL?: number[]; armR?: number[]; mirror?: boolean; scale?: number; face?: "front" | "down" | "hidden"; tunic?: boolean;
}
/**
 * ~42px storybook figure, feet at (cx, footY). Arms: [handDx, handDy] from the shoulder.
 * Adam/Eve wear a leaf wrap (`leaf`) or a robe (`robe`).
 */
export function person(b: Buf, cx: number, footY: number, o: PersonOpts) {
  const m = o.mirror ? -1 : 1, X = (dx: number) => cx + m * dx, skin = o.skin ?? SKIN, hip = footY - 15, sy = footY - 30;
  const hairC = sh(o.hair);
  const L = (cs: Circle[], cols: string[], opt = {}) => lump(b, cs, cols, { r: 2, tex: 0.05, lx: -m, ly: -1, ...opt });
  if (o.long) L([...limb(X(-6), sy - 2, 5, X(-8), footY - 14, 4), ...limb(X(6), sy - 2, 5, X(8), footY - 14, 4), [X(0), sy - 4, 9, 9]], hairC); // hair behind
  L(limb(X(-3), hip, 3.2, X(-4), footY - 2, 2.4), skin); L(limb(X(3), hip, 3.2, X(4), footY - 2, 2.4), skin); // legs
  b.rect(X(-6) - (m < 0 ? 3 : 0), footY - 1, 6, 2, skin[2]); b.rect(X(2) - (m < 0 ? 3 : 0), footY - 1, 6, 2, skin[2]); // feet
  const armL = o.armL ?? [-4, 14], armR = o.armR ?? [4, 14];
  L(limb(X(-7), sy + 1, 2.6, X(-7 + armL[0]), sy + 1 + armL[1], 2.2), skin); L(limb(X(7), sy + 1, 2.6, X(7 + armR[0]), sy + 1 + armR[1], 2.2), skin);
  if (o.robe) {
    L([...limb(X(0), sy + 2, 8, X(0), o.tunic ? hip + 6 : footY - 3, 9), [X(0), sy + 4, 9, 7]], sh(o.robe));
    L(limb(X(-7), sy + 1, 3.2, X(-7 + armL[0] * 0.7), sy + 1 + armL[1] * 0.7, 3), sh(o.robe)); L(limb(X(7), sy + 1, 3.2, X(7 + armR[0] * 0.7), sy + 1 + armR[1] * 0.7, 3), sh(o.robe));
    b.rect(X(-3), sy + 12, 7, 1, mix(o.robe, "#000000", 0.35));
  } else {
    L([[X(0), sy + 4, 7.2, 9]], skin);
    const lc = sh(o.leaf ?? "#3f9a3a");
    L([[X(0), hip - 1, 8, 4], [X(-3), hip + 3, 4, 4], [X(3), hip + 3, 4, 4]], lc);
    for (const dx of [-5, 0, 5]) b.rect(X(dx) - 1, hip + 4, 2, 2, lc[3]);
  }
  L([[X(0), sy - 6, 6.2, 6.8]], o.face === "hidden" ? hairC : skin); // head (back of head when walking away)
  L([[X(0), sy - 10, 7.2, 5.2], [X(-5), sy - 6, 2.8, 5], [X(5), sy - 6, 2.8, 5]], hairC, { r: 2 }); // hair cap
  if (o.face !== "hidden") {
    b.rect(X(-3), sy - 6, 1, 2, "#2a1d1a"); b.rect(X(2), sy - 6, 1, 2, "#2a1d1a");
    b.rect(X(-4), sy - 3, 2, 1, "#ec9a8e"); b.rect(X(3), sy - 3, 2, 1, "#ec9a8e"); b.rect(X(-1), sy - 2, 2, 1, "#c9655d");
  }
}

export function lion(b: Buf, cx: number, footY: number, mirror = false) {
  const m = mirror ? -1 : 1, X = (d: number) => cx + m * d, fur = ["#ffd68a", "#f0b04e", "#cf8a2c", "#a86418"], mane = ["#e29a3a", "#b8701e", "#8a4a12", "#5e300a"];
  const L = (cs: Circle[], cols: string[], o = {}) => lump(b, cs, cols, { r: 2, tex: 0.2, lx: -m, ly: -1, ...o });
  L(limb(X(-14), footY - 12, 3, X(-26), footY - 8, 1.6), fur); lump(b, [[X(-27), footY - 7, 2.6, 2.6]], mane); // tail + tuft
  L(limb(X(-9), footY - 4, 3, X(-9), footY, 2.2), fur); L(limb(X(7), footY - 4, 3, X(7), footY, 2.2), fur);
  L([[X(-2), footY - 11, 15, 8]], fur);
  L(limb(X(-4), footY - 5, 3, X(-4), footY, 2.2), fur); L(limb(X(12), footY - 5, 3, X(12), footY, 2.2), fur);
  L([[X(14), footY - 15, 10, 10], [X(14), footY - 9, 8, 8]], mane, { r: 3 }); // mane
  L([[X(15), footY - 14, 6, 6]], fur); L([[X(18), footY - 11, 3.4, 2.4]], ["#fff0cf", "#f6d79c", "#d9b078"]); // face + muzzle
  b.set(X(14), footY - 16, "#2a1d1a"); b.set(X(18), footY - 15, "#2a1d1a"); b.rect(X(19), footY - 12, 2, 1, "#5e300a");
  L([[X(12), footY - 21, 2.2, 2.2]], fur); // ear
}

export function lamb(b: Buf, cx: number, footY: number, mirror = false) {
  const m = mirror ? -1 : 1, X = (d: number) => cx + m * d, wool = ["#ffffff", "#f6f6fb", "#d8dcea", "#b3b9d0"], dark = ["#6a5a56", "#4a3c3a", "#2e2422"];
  for (const dx of [-5, -1, 4, 7]) b.rect(X(dx), footY - 5, 2, 5, dark[1]);
  lump(b, [[X(0), footY - 9, 9, 6], [X(-5), footY - 9, 5, 5], [X(5), footY - 10, 5, 5], [X(0), footY - 13, 5, 4]], wool, { r: 2, tex: 0.35, lx: -m, ly: -1 });
  lump(b, [[X(9), footY - 11, 3.4, 3.8]], dark, { r: 1 }); lump(b, [[X(8), footY - 15, 4, 3]], wool, { r: 1 });
  b.set(X(10), footY - 12, "#ffffff"); b.rect(X(7), footY - 11, 1, 3, dark[2]);
}

export function deer(b: Buf, cx: number, footY: number, mirror = false) {
  const m = mirror ? -1 : 1, X = (d: number) => cx + m * d, fur = ["#e8b27a", "#c98a4e", "#9c6232", "#6e4220"];
  const L = (cs: Circle[], cols: string[], o = {}) => lump(b, cs, cols, { r: 2, tex: 0.15, lx: -m, ly: -1, ...o });
  for (const dx of [-8, -4, 5, 9]) L(limb(X(dx), footY - 12, 1.8, X(dx), footY, 1.1), fur, { r: 1 });
  L([[X(0), footY - 16, 11, 6]], fur); L([[X(-9), footY - 15, 4, 4]], fur);
  L(limb(X(8), footY - 18, 3.2, X(13), footY - 30, 2.4), fur); L([[X(14), footY - 31, 3.4, 3], [X(17), footY - 30, 2.4, 1.8]], fur, { r: 1 });
  b.set(X(15), footY - 32, "#2a1d1a"); b.set(X(19), footY - 30, "#2a1d1a");
  for (let i = 0; i < 6; i++) { b.set(X(13 + (i % 2) * 2), footY - 34 - i, "#7a5230"); } b.set(X(11), footY - 36, "#7a5230"); b.set(X(15), footY - 37, "#7a5230"); b.set(X(17), footY - 38, "#7a5230");
  for (const [dx, dy] of [[-3, -18], [1, -15], [-6, -14], [4, -19]]) b.set(X(dx), footY + dy, "#fff0cf"); // spots
  b.set(X(-12), footY - 18, "#fff0cf");
}

export function elephant(b: Buf, cx: number, footY: number, mirror = false) {
  const m = mirror ? -1 : 1, X = (d: number) => cx + m * d, sk = ["#b6bccb", "#8e95a8", "#69708a", "#454b66"];
  const L = (cs: Circle[], cols: string[], o = {}) => lump(b, cs, cols, { r: 3, tex: 0.25, lx: -m, ly: -1, ...o });
  for (const dx of [-14, -5, 6, 15]) L(limb(X(dx), footY - 12, 4.5, X(dx), footY, 4), sk, { r: 2 });
  L([[X(0), footY - 22, 22, 14]], sk); L([[X(22), footY - 25, 9, 10]], sk);
  L(limb(X(28), footY - 22, 3.4, X(33), footY - 6, 2.4), sk, { r: 2 });
  L([[X(15), footY - 22, 7, 9]], ["#9aa1b6", "#7e869c", "#5d6480"], { r: 3 }); // ear
  b.set(X(26), footY - 28, "#1d2233"); b.rect(X(29), footY - 21, 3, 2, "#f4efe0"); // eye, tusk
}

/** Gull seen from the front/side, wings up or down (~18px span). col = [light, mid, shade]. */
export function bird(b: Buf, x: number, y: number, col: string[], up = true, mirror = false) {
  const m = mirror ? -1 : 1, s = up ? -1 : 1;
  lump(b, [[x, y, 3, 2.4], [x + 3 * m, y - 1, 2.2, 2]], col, { r: 1, tex: 0, lx: -m, ly: -1 });
  for (const side of [-1, 1]) {
    lump(b, limb(x + side * 2, y - 1, 2, x + side * 7, y + s * 4, 1.6), col, { r: 1, tex: 0 });
    lump(b, limb(x + side * 7, y + s * 4, 1.6, x + side * 12, y + s * 3 + (up ? 1 : -1), 0.9), [col[1], col[2], col[2]], { r: 1, tex: 0 });
  }
  b.set(x + 5 * m, y - 1, "#f2a93b"); b.set(x + 4 * m, y - 2, "#1d2440");
}

export function fish(b: Buf, x: number, y: number, col: string[], mirror = false) {
  const m = mirror ? -1 : 1, X = (d: number) => x + m * d;
  lump(b, [[X(0), y, 6, 3.4]], col, { r: 1, tex: 0, lx: -m, ly: -1 });
  for (let i = 0; i < 4; i++) { b.set(X(-7 - i), y - 1 - (i > 1 ? 1 : 0), col[1]); b.set(X(-7 - i), y + 1 + (i > 1 ? 1 : 0), col[1]); b.set(X(-7 - i), y, col[2]); }
  b.set(X(3), y - 1, "#ffffff"); b.set(X(4), y - 1, "#1d2440");
  for (let i = -2; i < 3; i += 2) b.set(X(i), y, col[3] ?? col[2]);
}

export function whale(b: Buf, cx: number, cy: number) {
  const body = ["#7aa6e8", "#4f7fd2", "#3558a8", "#233a7a"], belly = ["#f4f9ff", "#d9e8fb", "#b2c9ee"];
  const inside = (x: number, y: number) => ((x - cx) / 62) ** 2 + ((y - cy) / 24) ** 2 <= 1;
  lump(b, [...limb(cx - 40, cy, 15, cx - 84, cy - 18, 5), ...limb(cx - 84, cy - 18, 5, cx - 94, cy - 34, 4), [cx - 100, cy - 38, 11, 3.4], [cx - 86, cy - 40, 10, 3.4], [cx - 94, cy - 36, 4, 4]], body, { r: 3, tex: 0.1, lx: -1, ly: -1 }); // tail + fluke
  lump(b, [[cx, cy, 62, 24], [cx + 44, cy + 2, 22, 20]], body, { r: 4, tex: 0.12, lx: -1, ly: -1.2 });
  for (let y = cy + 4; y <= cy + 26; y++) for (let x = cx - 40; x <= cx + 70; x++) if (inside(x, y) || ((x - (cx + 44)) / 22) ** 2 + ((y - cy - 2) / 20) ** 2 <= 1) { const d = y - (cy + 6 + Math.sin(x / 9) * 1.6); if (d > 0) b.set(x, y, d > 7 ? belly[2] : d > 3 ? belly[1] : belly[0]); }
  for (let i = 0; i < 9; i++) b.rect(cx + 20 + i * 4, cy + 8 + (i % 2) * 2, 2, 1, "#9db6dc"); // throat grooves
  lump(b, [...limb(cx + 8, cy + 12, 3, cx - 8, cy + 24, 1.6)], body, { r: 2, tex: 0 }); // flipper
  b.rect(cx + 56, cy - 3, 2, 2, "#10193a"); b.rect(cx + 50, cy + 7, 12, 1, "#233a7a");
}

export function serpentPath(t0: number, t1: number, cx: number, y0: number, y1: number, R: number, steps = 90) {
  const pts: { x: number; y: number; front: boolean; r: number }[] = [];
  for (let i = 0; i <= steps; i++) { const t = t0 + ((t1 - t0) * i) / steps, k = i / steps; pts.push({ x: cx + Math.sin(t) * R, y: y0 + (y1 - y0) * k, front: Math.cos(t) > 0, r: 3.4 - k * 1.2 }); }
  return pts;
}
export function drawSerpent(b: Buf, pts: { x: number; y: number; r: number }[], cols: string[]) {
  const cs: Circle[] = pts.map((p) => [p.x, p.y, p.r, p.r]);
  lump(b, cs, cols, { r: 2, tex: 0.1, lx: -1, ly: -1 });
  pts.forEach((p, i) => { if (i % 4 === 0) { b.set(p.x, p.y, cols[0]); b.set(p.x + 1, p.y + 1, cols[3]); } });
}
