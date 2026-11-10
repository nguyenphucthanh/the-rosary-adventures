import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Textures for Stages 8-12 (Phase 5). Idempotent; integer rects only. */
export const MASK_R = [28, 40, 52, 64];

export function registerEdenTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("gen_lever")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };
  const sheet = (key: string, w: number, h: number, n: number, paint: (c: CanvasRenderingContext2D, ox: number, i: number) => void) => {
    const { canvas, ctx } = makeCanvas(w * n, h);
    for (let i = 0; i < n; i++) paint(ctx, i * w, i);
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };

  // ---- Stage 8: water gates, spring, beds, paw prints
  // sluice lever 20x24: wooden base, gold trim, big white arm with red (closed) / green (open) knob
  sheet("gen_lever", 20, 24, 2, (c, x, i) => {
    rect(c, x + 1, 21, 18, 3, PAL.z);
    rect(c, x + 2, 15, 16, 7, PAL.o); rect(c, x + 2, 15, 16, 2, PAL.y); rect(c, x + 2, 20, 16, 2, PAL.O);
    rect(c, x + 8, 18, 4, 2, i ? PAL.g : PAL.r);
    const d = i ? 1 : -1; // arm leans left (off) or right (on) in 2px steps
    for (const [k, y] of [[0, 13], [2, 11], [4, 9]]) rect(c, x + 8 + d * k + (i ? 2 : 0), y, 2, 3, PAL.w);
    rect(c, x + (i ? 12 : 2), 3, 6, 6, i ? PAL.g : PAL.r); rect(c, x + (i ? 12 : 2), 7, 6, 2, i ? PAL.G : PAL.R);
    rect(c, x + (i ? 13 : 3), 4, 2, 2, PAL.w);
  });
  still("gen_spring", 32, 24, (c) => {
    rect(c, 0, 4, 32, 20, PAL.a); rect(c, 2, 6, 28, 16, PAL.A); rect(c, 4, 8, 24, 12, PAL.x);
    rect(c, 6, 10, 8, 1, PAL.w); rect(c, 18, 14, 8, 1, PAL.w); rect(c, 14, 0, 4, 12, PAL.x); rect(c, 15, 0, 2, 8, PAL.w);
  });
  sheet("gen_flowerbed", 16, 16, 2, (c, x, i) => {
    rect(c, x + 1, 5, 14, 10, PAL.T); rect(c, x + 1, 5, 14, 2, PAL.t);
    if (!i) { rect(c, x + 4, 3, 1, 4, PAL.o); rect(c, x + 10, 4, 1, 3, PAL.o); return; }
    for (const [fx, fy] of [[3, 2], [8, 1], [12, 3], [5, 7], [10, 8]]) { rect(c, x + fx, fy + 3, 1, 4, PAL.G); rect(c, x + fx - 1, fy, 3, 3, PAL.q); rect(c, x + fx, fy + 1, 1, 1, PAL.y); }
  });
  still("gen_paw", 5, 5, (c) => { rect(c, 1, 2, 3, 3, PAL.O); rect(c, 0, 0, 1, 2, PAL.O); rect(c, 2, 0, 1, 2, PAL.O); rect(c, 4, 0, 1, 2, PAL.O); });
  still("gen_bush", 20, 16, (c) => {
    rect(c, 1, 14, 18, 2, PAL.z);
    rect(c, 1, 6, 18, 8, PAL.H); rect(c, 3, 3, 14, 9, PAL.g); rect(c, 5, 1, 10, 3, PAL.g);
    rect(c, 6, 2, 4, 1, PAL.N); rect(c, 4, 5, 3, 1, PAL.N); rect(c, 12, 4, 3, 1, PAL.N); rect(c, 9, 7, 3, 1, PAL.N);
    for (const [x, y] of [[5, 8], [10, 9], [14, 7], [8, 11]]) rect(c, x, y, 2, 2, PAL.r);
  });

  // ---- Stage 9: plates, jar, hedge, light pads
  for (const [key, col] of [["gen_plate_r", PAL.r], ["gen_plate_b", PAL.b]] as const)
    sheet(key, 16, 16, 2, (c, x, i) => { rect(c, x + 1, 5 + i * 2, 14, 9 - i * 2, PAL.A); rect(c, x + 2, 4 + i * 2, 12, 7 - i * 2, col); rect(c, x + 5, 5 + i * 2, 6, 1, PAL.w); });
  sheet("gen_pad_light", 16, 16, 2, (c, x, i) => {
    rect(c, x + 1, 1, 14, 14, i ? PAL.y : PAL.A); rect(c, x + 3, 3, 10, 10, i ? PAL.l : PAL.a); rect(c, x + 6, 6, 4, 4, i ? PAL.w : PAL.i);
  });
  still("gen_jar", 10, 12, (c) => { rect(c, 2, 0, 6, 2, PAL.T); rect(c, 1, 2, 8, 9, PAL.t); rect(c, 2, 4, 6, 6, PAL.x); rect(c, 3, 5, 2, 1, PAL.w); rect(c, 1, 11, 8, 1, PAL.T); });
  still("gen_hedge", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.G); rect(c, 0, 0, 16, 3, PAL.g);
    for (const [x, y] of [[2, 5], [9, 7], [4, 11], [12, 12], [6, 3]]) rect(c, x, y, 3, 2, PAL.g);
  });

  // ---- Stage 10: smoke, trap, shield
  sheet("gen_smoke", 12, 12, 2, (c, x, i) => {
    rect(c, x + 2, 3, 8, 7, PAL.Z); rect(c, x + 3, 1 + i, 6, 3, PAL.V); rect(c, x + 1, 5, 10, 3, PAL.V); rect(c, x + 4, 5, 2, 2, PAL.K); rect(c, x + 7, 5, 2, 2, PAL.K);
  });
  sheet("gen_trap", 16, 16, 2, (c, x, i) => {
    rect(c, x + 2, 2, 12, 12, i ? PAL.q : PAL.v); rect(c, x + 5, 5, 6, 6, i ? PAL.l : PAL.V); rect(c, x + 7, 0, 2, 16, i ? PAL.w : PAL.q); rect(c, x, 7, 16, 2, i ? PAL.w : PAL.q);
  });
  still("gen_shield", 24, 24, (c) => {
    for (const col of [PAL.y, PAL.l]) {
      const o = col === PAL.y ? 0 : 1;
      rect(c, 6 + o, o, 12 - 2 * o, 1, col); rect(c, 6 + o, 23 - o, 12 - 2 * o, 1, col);
      rect(c, o, 6 + o, 1, 12 - 2 * o, col); rect(c, 23 - o, 6 + o, 1, 12 - 2 * o, col);
      for (const [ax, ay] of [[3, 3], [3, 20], [20, 3], [20, 20]]) rect(c, ax + o, ay + o, 3 - o, 3 - o, col);
    }
  });

  // ---- Stage 11: phantoms, light locks
  sheet("gen_phantom", 20, 24, 2, (c, x, i) => {
    rect(c, x + 4, 2, 12, 20, PAL.K); rect(c, x + 2, 6, 16, 14, PAL.Z); rect(c, x + 6, 0, 8, 4, PAL.Z);
    rect(c, x + 6, 8, 3, 3, PAL.r); rect(c, x + 12, 8, 3, 3, PAL.r); rect(c, x + 8, 14, 5, 2, PAL.K);
    for (let k = 0; k < 4; k++) rect(c, x + 2 + k * 4, 20 + ((k + i) % 2) * 2, 4, 3, PAL.Z);
  });
  sheet("gen_lock", 16, 16, 2, (c, x, i) => {
    rect(c, x + 3, 10, 10, 6, PAL.A); rect(c, x + 5, 3, 6, 8, PAL.a); rect(c, x + 7, 5, 2, 6, i ? PAL.K : PAL.a);
    rect(c, x + 6, 12, 4, 3, i ? PAL.l : PAL.I); if (i) rect(c, x + 7, 13, 2, 1, PAL.w);
  });

  // ---- Stage 12: oil, pillars, light masks
  still("gen_oil", 8, 10, (c) => { rect(c, 2, 0, 4, 2, PAL.O); rect(c, 1, 2, 6, 8, PAL.y); rect(c, 2, 4, 4, 5, PAL.l); rect(c, 2, 4, 1, 3, PAL.w); });
  sheet("gen_pillar", 16, 32, 2, (c, x, i) => {
    rect(c, x + 3, 30, 10, 2, PAL.z); rect(c, x + 3, 12, 10, 18, i ? PAL.p : PAL.A); rect(c, x + 3, 12, 3, 18, i ? PAL.P : PAL.I);
    rect(c, x + 1, 26, 14, 4, PAL.a); rect(c, x + 1, 10, 14, 3, PAL.a);
    if (i) { rect(c, x + 5, 0, 6, 10, PAL.f); rect(c, x + 6, 2, 4, 8, PAL.y); rect(c, x + 7, 4, 2, 5, PAL.w); }
    else rect(c, x + 6, 6, 4, 4, PAL.I);
  });
  // stepped (banded) light holes: erased out of the night so only a ring around the torch shows
  MASK_R.forEach((r, k) => {
    const { canvas, ctx } = makeCanvas(r * 2, r * 2);
    for (let py = 0; py < r * 2; py++)
      for (let px = 0; px < r * 2; px++) {
        const d = Math.hypot(px + 0.5 - r, py + 0.5 - r) / r;
        if (d >= 1) continue;
        ctx.globalAlpha = d < 0.5 ? 1 : d < 0.72 ? 0.7 : d < 0.9 ? 0.4 : 0.18;
        rect(ctx, px, py, 1, 1, "#ffffff");
      }
    t.addCanvas(`gen_lightmask_${k}`, canvas);
  });
}
