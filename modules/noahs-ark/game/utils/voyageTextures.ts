import * as Phaser from "phaser";
import { PAL, drawMap, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
import { paintRainbow } from "@/modules/noahs-ark/game/utils/noahTextures";

type Paint = (c: CanvasRenderingContext2D, x: number) => void;

/** The seven rainbow colours in spectrum order (Đỏ → Tím), shared by the prism puzzle and its HUD. */
export const SPECTRUM = ["#dc2626", "#f97316", "#fbbf24", "#22c55e", "#38bdf8", "#4338ca", "#7c3aed"];

/** Props and tiles for Stages 5-8 (sea, birds, hilltop, prisms). Integer rects only. Idempotent. */
export function registerVoyageTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("noah_crate")) return;
  const still = (key: string, w: number, h: number, paint: Paint) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx, 0);
    t.addCanvas(key, canvas);
  };
  const sheet = (key: string, w: number, h: number, frames: Paint[]) => {
    const { canvas, ctx } = makeCanvas(w * frames.length, h);
    frames.forEach((p, i) => p(ctx, i * w));
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };

  // ---- tiles
  still("noah_water", 16, 16, (c) => { rect(c, 0, 0, 16, 16, "#38bdf8"); rect(c, 2, 4, 5, 1, "#7dd3fc"); rect(c, 9, 10, 5, 1, "#7dd3fc"); rect(c, 5, 14, 3, 1, "#0ea5e9"); });
  still("noah_sea", 16, 16, (c) => { rect(c, 0, 0, 16, 16, "#0b6aa6"); rect(c, 1, 3, 6, 1, "#38bdf8"); rect(c, 3, 4, 2, 1, "#7dd3fc"); rect(c, 9, 11, 6, 1, "#38bdf8"); rect(c, 11, 12, 2, 1, "#7dd3fc"); rect(c, 4, 8, 2, 1, "#075985"); });
  still("noah_sky", 16, 16, (c) => { rect(c, 0, 0, 16, 16, "#bae6fd"); rect(c, 3, 5, 6, 1, "#e0f2fe"); rect(c, 10, 12, 5, 1, "#e0f2fe"); });
  still("noah_bridge", 16, 16, (c) => { rect(c, 0, 0, 16, 16, PAL.u); for (const y of [0, 5, 10]) { rect(c, 0, y, 16, 4, PAL.o); rect(c, 0, y + 3, 16, 1, PAL.O); } rect(c, 0, 15, 16, 1, PAL.O); });

  // ---- stage 5: caretaking
  still("noah_crate", 16, 16, (c) => { rect(c, 1, 14, 14, 2, PAL.z); rect(c, 1, 2, 14, 12, PAL.o); rect(c, 1, 2, 14, 2, PAL.u); rect(c, 1, 12, 14, 2, PAL.O); rect(c, 7, 2, 2, 12, PAL.O); rect(c, 3, 6, 3, 3, PAL.y); rect(c, 10, 6, 3, 3, PAL.y); });
  still("noah_hay", 16, 16, (c) => { rect(c, 2, 14, 12, 2, PAL.z); rect(c, 2, 5, 12, 9, PAL.y); rect(c, 2, 11, 12, 3, PAL.Y); rect(c, 4, 3, 8, 2, PAL.l); for (const x of [4, 8, 11]) rect(c, x, 6, 1, 6, PAL.l); rect(c, 2, 8, 12, 1, PAL.o); });
  still("noah_blanket", 16, 16, (c) => { rect(c, 2, 14, 12, 2, PAL.z); rect(c, 2, 4, 12, 10, PAL.r); rect(c, 2, 4, 12, 2, PAL.q); rect(c, 2, 11, 12, 3, PAL.R); for (const x of [4, 8, 12]) rect(c, x, 7, 1, 3, PAL.w); });
  still("noah_lamp", 16, 16, (c) => { rect(c, 3, 14, 10, 2, PAL.z); rect(c, 4, 10, 8, 4, PAL.Y); rect(c, 5, 8, 6, 2, PAL.y); rect(c, 7, 2, 2, 6, PAL.f); rect(c, 6, 4, 4, 3, PAL.y); rect(c, 7, 5, 2, 2, PAL.l); rect(c, 11, 9, 3, 1, PAL.Y); });
  still("noah_stall", 40, 30, (c) => {
    rect(c, 0, 0, 40, 30, PAL.Y); rect(c, 2, 2, 36, 26, PAL.y); // straw bed
    for (const [x, y] of [[6, 6], [18, 14], [28, 8], [10, 20], [30, 22]]) rect(c, x, y, 4, 1, PAL.l);
    rect(c, 0, 0, 40, 2, PAL.O); rect(c, 0, 28, 40, 2, PAL.O); rect(c, 0, 0, 2, 30, PAL.O); rect(c, 38, 0, 2, 30, PAL.O);
  });
  // need bubbles: hay / lamp / blanket
  still("noah_need_hay", 12, 12, (c) => { rect(c, 0, 0, 12, 10, PAL.w); rect(c, 4, 10, 3, 2, PAL.w); rect(c, 2, 2, 8, 6, PAL.y); rect(c, 3, 3, 1, 4, PAL.l); rect(c, 6, 3, 1, 4, PAL.l); });
  still("noah_need_lamp", 12, 12, (c) => { rect(c, 0, 0, 12, 10, PAL.w); rect(c, 4, 10, 3, 2, PAL.w); rect(c, 5, 1, 2, 5, PAL.f); rect(c, 4, 3, 4, 3, PAL.y); rect(c, 3, 7, 6, 2, PAL.Y); });
  still("noah_need_blanket", 12, 12, (c) => { rect(c, 0, 0, 12, 10, PAL.w); rect(c, 4, 10, 3, 2, PAL.w); rect(c, 2, 2, 8, 6, PAL.r); rect(c, 2, 2, 8, 1, PAL.q); rect(c, 4, 5, 1, 2, PAL.w); rect(c, 7, 5, 1, 2, PAL.w); });

  // ---- stage 6: sailing (top-down ark, 2 frames: sail furled / sail open)
  sheet("noah_arktop", 24, 40, [0, 1].map((open): Paint => (c, x) => {
    for (let r = 0; r < 40; r++) { const half = r < 8 ? 3 + r : r > 30 ? 12 - (r - 30) : 11; rect(c, x + 12 - half, r, half * 2, 1, r % 8 < 4 ? PAL.o : PAL.u); }
    rect(c, x + 3, 10, 18, 22, PAL.Y); rect(c, x + 5, 12, 14, 18, PAL.u); // deck + cabin roof
    for (let i = 0; i < 4; i++) rect(c, x + 5, 14 + i * 4, 14, 1, PAL.O);
    rect(c, x + 3, 6, 2, 28, PAL.O); rect(c, x + 19, 6, 2, 28, PAL.O); // gunwales
    if (open) { rect(c, x + 1, 17, 22, 6, PAL.w); rect(c, x + 1, 22, 22, 1, PAL.W); rect(c, x + 10, 15, 4, 10, PAL.y); } // sail open
    else rect(c, x + 9, 17, 6, 6, PAL.W);
  }));
  still("noah_reef", 28, 22, (c) => { rect(c, 2, 18, 24, 4, PAL.z); rect(c, 3, 8, 22, 12, PAL.A); rect(c, 6, 3, 8, 6, PAL.A); rect(c, 15, 1, 7, 8, PAL.a); rect(c, 6, 10, 8, 3, PAL.a); rect(c, 3, 17, 22, 3, PAL.I); rect(c, 9, 4, 2, 2, PAL.w); });
  sheet("noah_swirl", 24, 24, [0, 1].map((f): Paint => (c, x) => {
    rect(c, x + 8, 0, 8, 2, PAL.w); rect(c, x + 16, 2, 4, 2, PAL.w); rect(c, x + 20, 4, 2, 8, PAL.w); rect(c, x + 16, 12, 4, 2, PAL.w);
    rect(c, x + 6, 6, 12, 2, PAL.W); rect(c, x + 4, 8, 2, 10, PAL.W); rect(c, x + 6, 18, 12, 2, PAL.W); rect(c, x + 12, 12, 4, 2, PAL.k);
    rect(c, x + 2 + f * 2, 20, 6, 2, PAL.w); rect(c, x + 14 - f * 2, 8, 2, 2, PAL.k);
  }));
  sheet("noah_beacon", 16, 32, [0, 1].map((lit): Paint => (c, x) => {
    rect(c, x + 1, 30, 14, 2, PAL.z); rect(c, x + 3, 12, 10, 18, lit ? PAL.p : PAL.a); rect(c, x + 9, 12, 4, 18, lit ? PAL.P : PAL.A);
    rect(c, x + 3, 18, 10, 3, PAL.r); rect(c, x + 2, 9, 12, 4, PAL.O); rect(c, x + 5, 3, 6, 6, lit ? PAL.l : PAL.I);
    rect(c, x + 7, 5, 2, 3, lit ? PAL.f : PAL.i); rect(c, x + 4, 1, 8, 2, PAL.O);
  }));
  still("noah_mount", 64, 48, (c) => {
    rect(c, 2, 44, 60, 4, PAL.z);
    for (let r = 0; r < 44; r++) rect(c, 32 - 3 - Math.floor(r * 0.65), 4 + r, 6 + Math.floor(r * 1.3), 1, r < 10 ? PAL.w : r < 16 ? PAL.W : r % 8 < 4 ? PAL.A : PAL.I);
    rect(c, 28, 4, 8, 6, PAL.w); rect(c, 12, 30, 12, 4, PAL.G); rect(c, 40, 34, 14, 4, PAL.G); rect(c, 22, 20, 10, 2, PAL.a);
  });

  // ---- stage 7: flight
  sheet("noah_gust", 20, 20, [0, 1].map((f): Paint => (c, x) => {
    rect(c, x + 4, 0, 12, 3, PAL.I); rect(c, x + 14 - f * 2, 3, 4, 3, PAL.K); rect(c, x + 2 + f * 2, 6, 14, 3, PAL.i); rect(c, x + 0, 9, 4, 3, PAL.K);
    rect(c, x + 4, 12, 12, 3, PAL.I); rect(c, x + 10 + f * 2, 15, 8, 3, PAL.K); rect(c, x + 6, 17, 6, 3, PAL.i);
  }));
  still("noah_ring", 28, 28, (c) => { // warm thermal ring: stepped octagon outline
    for (const [x, y, w, h] of [[8, 0, 12, 2], [4, 2, 4, 2], [20, 2, 4, 2], [2, 4, 2, 4], [24, 4, 2, 4], [0, 8, 2, 12], [26, 8, 2, 12], [2, 20, 2, 4], [24, 20, 2, 4], [4, 24, 4, 2], [20, 24, 4, 2], [8, 26, 12, 2]]) rect(c, x, y, w, h, PAL.y);
    rect(c, 10, 4, 8, 1, PAL.l); rect(c, 4, 12, 1, 4, PAL.l);
  });
  still("noah_fog", 44, 26, (c) => { rect(c, 4, 10, 36, 14, PAL.W); rect(c, 12, 2, 20, 12, PAL.W); rect(c, 0, 14, 44, 8, PAL.w); rect(c, 8, 6, 14, 8, PAL.w); rect(c, 6, 22, 32, 3, PAL.i); });
  still("noah_olivetree", 28, 34, (c) => { rect(c, 4, 31, 20, 3, PAL.z); rect(c, 12, 18, 4, 14, PAL.o); rect(c, 3, 4, 22, 16, PAL.G); rect(c, 7, 1, 14, 6, PAL.G); rect(c, 5, 6, 8, 5, PAL.g); rect(c, 16, 12, 7, 4, PAL.g); rect(c, 9, 14, 4, 2, PAL.H); });
  still("noah_field", 40, 28, (c) => { // farm plot: wood fence, tilled soil, green crop rows with olive saplings
    rect(c, 0, 0, 40, 28, PAL.o); rect(c, 2, 2, 36, 24, PAL.u);
    for (let i = 0; i < 4; i++) { rect(c, 3, 4 + i * 6, 34, 3, PAL.g); rect(c, 3, 6 + i * 6, 34, 1, PAL.G); }
    for (const [x, y] of [[6, 7], [20, 7], [30, 19], [12, 19]]) { rect(c, x, y, 5, 5, PAL.H); rect(c, x + 1, y - 1, 3, 1, PAL.G); rect(c, x + 1, y + 1, 1, 1, PAL.N); }
    for (let x = 0; x < 40; x += 8) rect(c, x, 0, 2, 3, PAL.O);
  });
  still("noah_mist", 30, 14, (c) => { rect(c, 4, 4, 22, 8, PAL.W); rect(c, 9, 0, 12, 6, PAL.W); rect(c, 0, 7, 30, 4, PAL.w); rect(c, 4, 11, 22, 2, PAL.i); });
  still("noah_window", 32, 28, (c) => { rect(c, 0, 0, 32, 28, PAL.O); rect(c, 3, 3, 26, 22, PAL.k); rect(c, 3, 17, 26, 8, "#e0f2fe"); rect(c, 15, 3, 2, 22, PAL.O); rect(c, 0, 24, 32, 4, PAL.u); });

  // ---- stage 8: altar, stones, prisms
  still("noah_stone", 12, 10, (c) => { rect(c, 1, 8, 10, 2, PAL.z); rect(c, 2, 3, 8, 6, PAL.w); rect(c, 4, 1, 5, 3, PAL.w); rect(c, 2, 7, 8, 2, PAL.W); rect(c, 4, 3, 2, 1, PAL.l); });
  sheet("noah_crystal", 14, 24, SPECTRUM.map((col): Paint => (c, x) => {
    rect(c, x + 1, 22, 12, 2, PAL.z); rect(c, x + 3, 18, 8, 4, PAL.A); rect(c, x + 4, 17, 6, 1, PAL.a);
    rect(c, x + 5, 2, 4, 2, col); rect(c, x + 3, 4, 8, 4, col); rect(c, x + 2, 8, 10, 6, col); rect(c, x + 3, 14, 8, 3, col); rect(c, x + 5, 17, 4, 1, col);
    rect(c, x + 4, 5, 2, 6, PAL.w); rect(c, x + 9, 9, 2, 4, PAL.W);
  }));
  const ARROWS = [
    ["...ww...", "..wwww..", ".wwwwww.", "...ww...", "...ww...", "...ww...", "...ww...", "........"], // up
    ["...w....", "...ww...", "wwwwww..", "wwwwwww.", "wwwwwww.", "wwwwww..", "...ww...", "...w...."], // right
    ["........", "...ww...", "...ww...", "...ww...", "...ww...", ".wwwwww.", "..wwww..", "...ww..."], // down
    ["....w...", "...ww...", "..wwwwww", ".wwwwwww", ".wwwwwww", "..wwwwww", "...ww...", "....w..."], // left
  ];
  sheet("noah_arrow", 8, 8, ARROWS.map((map): Paint => (c, x) => drawMap(c, map, x)));
  still("noah_rainbow_big", 192, 96, (c) => paintRainbow(c, 96, 96, 96, 8));
  still("noah_flower", 8, 8, (c) => { rect(c, 3, 4, 2, 4, PAL.G); rect(c, 2, 1, 4, 3, PAL.q); rect(c, 3, 2, 2, 1, PAL.l); });
  still("noah_rock", 20, 14, (c) => { rect(c, 1, 12, 18, 2, PAL.z); rect(c, 2, 5, 16, 8, PAL.a); rect(c, 5, 2, 9, 4, PAL.a); rect(c, 2, 10, 16, 3, PAL.A); rect(c, 6, 3, 3, 1, PAL.w); });
}
