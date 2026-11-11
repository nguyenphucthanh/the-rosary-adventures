import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Stage 1 (the Nile): water + grass tiles, papyrus, palm, lotus, whirlpool, crocodile, reed lever, reed screen. */
export function registerNileTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("nile_water")) return;
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

  still("nile_water", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.x);
    for (const [x, y] of [[2, 3], [10, 1], [6, 8], [13, 11], [1, 13]]) { rect(c, x, y, 3, 1, PAL.X); rect(c, x + 1, y - 1, 1, 1, PAL.w); }
  });
  still("nile_grass", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.g);
    for (const [x, y] of [[2, 2], [9, 5], [5, 10], [13, 12], [1, 14]]) { rect(c, x, y, 2, 2, PAL.G); rect(c, x, y - 1, 1, 1, PAL.G); }
  });

  // Papyrus (14x30), palm (32x44), lotus (12x8)
  still("nile_papyrus", 14, 30, (c) => {
    rect(c, 2, 28, 10, 2, PAL.z);
    rect(c, 6, 8, 2, 20, PAL.G); rect(c, 3, 14, 1, 14, PAL.G); rect(c, 10, 12, 1, 16, PAL.G);
    rect(c, 5, 2, 4, 6, PAL.g); rect(c, 4, 4, 6, 2, PAL.g); rect(c, 2, 8, 3, 4, PAL.g); rect(c, 9, 8, 3, 4, PAL.g); rect(c, 6, 0, 2, 2, PAL.N);
  });
  still("nile_palm", 32, 44, (c) => {
    rect(c, 8, 40, 16, 4, PAL.z);
    rect(c, 14, 14, 4, 26, PAL.o); for (const y of [18, 24, 30, 36]) rect(c, 14, y, 4, 1, PAL.O);
    rect(c, 12, 8, 8, 6, PAL.G); rect(c, 4, 6, 8, 4, PAL.g); rect(c, 20, 6, 8, 4, PAL.g); rect(c, 2, 10, 8, 3, PAL.G); rect(c, 22, 10, 8, 3, PAL.G);
    rect(c, 10, 2, 12, 5, PAL.g); rect(c, 13, 0, 6, 2, PAL.g); rect(c, 14, 14, 4, 2, PAL.Y); rect(c, 12, 14, 2, 2, PAL.u); rect(c, 18, 14, 2, 2, PAL.u);
  });
  still("nile_lotus", 12, 8, (c) => {
    rect(c, 0, 4, 12, 3, PAL.G); rect(c, 2, 3, 8, 1, PAL.G); rect(c, 4, 1, 4, 3, PAL.q); rect(c, 5, 0, 2, 1, PAL.w); rect(c, 3, 3, 1, 1, PAL.q); rect(c, 8, 3, 1, 1, PAL.q);
  });

  // Whirlpool 24x14 and crocodile 32x12, 2 frames each
  const ring = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox + 2, 3, 20, 8, PAL.X); rect(c, ox + 4, 2, 16, 10, PAL.X); rect(c, ox + 5, 4, 14, 6, PAL.x); rect(c, ox + 8, 5, 8, 4, PAL.X); rect(c, ox + 10, 6, 4, 2, PAL.K);
    rect(c, ox + (f ? 6 : 14), 3, 4, 1, PAL.w); rect(c, ox + (f ? 14 : 6), 10, 4, 1, PAL.w); rect(c, ox + (f ? 4 : 18), 7, 2, 1, PAL.w);
  };
  sheet("nile_whirl", 24, 14, [(c, ox) => ring(c, ox, 0), (c, ox) => ring(c, ox, 1)]);
  const croc = (c: CanvasRenderingContext2D, ox: number, open: boolean) => {
    rect(c, ox + 2, 4, 24, 6, PAL.G); rect(c, ox + 4, 3, 20, 1, PAL.H); for (const x of [6, 11, 16, 21]) rect(c, ox + x, 2, 2, 2, PAL.H);
    rect(c, ox + 0, 6, 3, 2, PAL.G); rect(c, ox + 26, 4, 6, 3, PAL.G);
    if (open) { rect(c, ox + 26, 8, 6, 2, PAL.G); rect(c, ox + 27, 7, 5, 1, PAL.r); for (const x of [27, 29, 31]) rect(c, ox + x, 6, 1, 1, PAL.w); }
    else rect(c, ox + 26, 7, 6, 1, PAL.H);
    rect(c, ox + 27, 2, 2, 2, PAL.l); rect(c, ox + 28, 3, 1, 1, PAL.e);
    rect(c, ox + 8, 10, 2, 2, PAL.H); rect(c, ox + 18, 10, 2, 2, PAL.H);
  };
  sheet("nile_croc", 32, 12, [(c, ox) => croc(c, ox, false), (c, ox) => croc(c, ox, true)]);

  // Reed-rope lever post (14x20) with a lotus-leaf handle, and a reed screen to hide the basket (24x20)
  still("nile_lever", 14, 20, (c) => {
    rect(c, 2, 18, 10, 2, PAL.z);
    rect(c, 6, 6, 2, 12, PAL.o); rect(c, 4, 16, 6, 2, PAL.O);
    rect(c, 2, 2, 10, 4, PAL.g); rect(c, 4, 1, 6, 1, PAL.g); rect(c, 3, 3, 3, 1, PAL.G); rect(c, 8, 4, 3, 1, PAL.G); rect(c, 6, 0, 2, 2, PAL.q);
  });
  still("nile_reed", 24, 20, (c) => {
    for (const [x, h] of [[1, 12], [5, 17], [9, 14], [13, 19], [17, 15], [21, 11]]) { rect(c, x, 20 - h, 2, h, PAL.G); rect(c, x, 20 - h - 2, 2, 2, PAL.o); rect(c, x + 1, 20 - h, 1, h, PAL.g); }
  });
  // Stone landing step (16x16) is the shared exodus_stone tile.
}
