import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Stage 6: Israelite house, feast table (4 stages), roasting lamb (2 frames), dough trough (2 frames), bitter herbs, blood bowl, hyssop. Integer rects only. */
export function registerPassoverTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("pv_house")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };
  const sheet = (key: string, w: number, h: number, paints: ((c: CanvasRenderingContext2D, ox: number) => void)[]) => {
    const { canvas, ctx } = makeCanvas(w * paints.length, h);
    paints.forEach((p, i) => p(ctx, i * w));
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };

  // House (44x42): mud-brick walls, flat roof, wooden door (posts x16/x26, lintel y24 are where the blood goes), two windows
  still("pv_house", 44, 42, (c) => {
    rect(c, 1, 41, 42, 1, PAL.z);
    rect(c, 2, 14, 40, 27, PAL.Q); rect(c, 36, 14, 6, 27, PAL.J); rect(c, 2, 38, 40, 3, PAL.J);
    rect(c, 0, 9, 44, 6, PAL.T); rect(c, 0, 9, 44, 1, PAL.t); rect(c, 0, 14, 44, 1, PAL.o);
    rect(c, 5, 5, 34, 4, PAL.t); rect(c, 5, 5, 34, 1, PAL.Q); rect(c, 5, 8, 34, 1, PAL.T);
    rect(c, 15, 23, 14, 18, PAL.O); rect(c, 17, 26, 10, 15, PAL.o); rect(c, 21, 26, 2, 15, PAL.O); rect(c, 24, 33, 1, 2, PAL.y);
    for (const x of [6, 32]) { rect(c, x, 20, 6, 6, PAL.e); rect(c, x - 1, 19, 8, 1, PAL.O); rect(c, x - 1, 26, 8, 1, PAL.J); }
  });

  // Feast table (48x24), frame n = n foods laid out: 1 lamb, 2 + bread, 3 + bitter herbs
  const table = (c: CanvasRenderingContext2D, ox: number, n: number) => {
    rect(c, ox + 1, 23, 46, 1, PAL.z);
    rect(c, ox + 2, 19, 4, 4, PAL.O); rect(c, ox + 42, 19, 4, 4, PAL.O);
    rect(c, ox, 5, 48, 15, PAL.o); rect(c, ox, 5, 48, 2, PAL.Y); rect(c, ox, 18, 48, 2, PAL.O);
    if (n >= 1) { rect(c, ox + 5, 8, 14, 9, PAL.w); rect(c, ox + 7, 9, 10, 7, PAL.u); rect(c, ox + 9, 10, 6, 3, PAL.t); }
    if (n >= 2) { rect(c, ox + 21, 9, 10, 7, PAL.j); rect(c, ox + 21, 14, 10, 2, PAL.Q); rect(c, ox + 23, 10, 2, 1, PAL.w); }
    if (n >= 3) { rect(c, ox + 33, 8, 11, 9, PAL.w); rect(c, ox + 35, 9, 7, 7, PAL.g); rect(c, ox + 37, 10, 3, 3, PAL.G); }
  };
  sheet("pv_table", 48, 24, [0, 1, 2, 3].map((n) => (c: CanvasRenderingContext2D, ox: number) => table(c, ox, n)));

  // Roasting lamb over a fire pit (28x22), 2 flame frames
  const roast = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox + 2, 21, 24, 1, PAL.z);
    rect(c, ox + 3, 15, 22, 6, PAL.A); rect(c, ox + 3, 15, 22, 2, PAL.a);
    rect(c, ox + 7, 9 - f, 14, 7 + f, PAL.f); rect(c, ox + 9, 10 - f, 10, 6 + f, PAL.y); rect(c, ox + 11, 12, 6, 3, PAL.l);
    rect(c, ox + 2, 2, 2, 14, PAL.O); rect(c, ox + 24, 2, 2, 14, PAL.O); rect(c, ox + 2, 7, 24, 1, PAL.o);
    rect(c, ox + 7, 3, 14, 8, PAL.t); rect(c, ox + 7, 8, 14, 3, PAL.u); rect(c, ox + 9, 4, 5, 2, PAL.Y);
  };
  sheet("pv_roast", 28, 22, [0, 1].map((f) => (c: CanvasRenderingContext2D, ox: number) => roast(c, ox, f)));

  // Dough trough (26x16): frame 1 = dough has puffed up
  const dough = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox + 1, 15, 24, 1, PAL.z);
    rect(c, ox + 1, 6, 24, 9, PAL.o); rect(c, ox + 1, 6, 24, 2, PAL.Y); rect(c, ox + 1, 13, 24, 2, PAL.O);
    rect(c, ox + 4, 5 - f * 2, 18, 6 + f * 2, PAL.w); rect(c, ox + 6, 6 - f * 2, 8, 2, PAL.W); rect(c, ox + 4, 9, 18, 2, PAL.W);
  };
  sheet("pv_dough", 26, 16, [0, 1].map((f) => (c: CanvasRenderingContext2D, ox: number) => dough(c, ox, f)));

  // Bitter herbs patch (18x14)
  still("pv_herbs", 18, 14, (c) => {
    rect(c, 1, 13, 16, 1, PAL.z);
    rect(c, 1, 9, 16, 4, PAL.J);
    for (const [x, h] of [[2, 7], [6, 10], [10, 8], [14, 6]]) { rect(c, x, 12 - h, 3, h, PAL.g); rect(c, x + 2, 12 - h, 1, h, PAL.G); }
    rect(c, 5, 1, 2, 2, PAL.q); rect(c, 12, 2, 2, 2, PAL.q);
  });

  // Bowl of the lamb's blood (18x12) with a hyssop sprig
  still("pv_bowl", 18, 12, (c) => {
    rect(c, 2, 11, 14, 1, PAL.z);
    rect(c, 2, 5, 14, 6, PAL.A); rect(c, 3, 10, 12, 1, PAL.A); rect(c, 2, 5, 14, 1, PAL.a);
    rect(c, 4, 4, 10, 3, PAL.R); rect(c, 5, 4, 3, 1, PAL.r);
    rect(c, 12, 0, 1, 5, PAL.G); rect(c, 11, 0, 3, 2, PAL.g);
  });

  // Hyssop sprig carried (8x12): green stem, red-dipped tip
  still("pv_hyssop", 8, 12, (c) => {
    rect(c, 3, 3, 2, 9, PAL.G); rect(c, 2, 1, 4, 4, PAL.g); rect(c, 3, 0, 2, 2, PAL.r); rect(c, 2, 3, 1, 1, PAL.R);
  });
}
