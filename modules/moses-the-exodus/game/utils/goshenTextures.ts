import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Stage 5: Goshen oil lamp (3 frames), bronze mirror (4 facings), oil jar, carried flame. Integer rects only. */
export function registerGoshenTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("gs_lamp")) return;
  const sheet = (key: string, w: number, h: number, paints: ((c: CanvasRenderingContext2D, ox: number) => void)[]) => {
    const { canvas, ctx } = makeCanvas(w * paints.length, h);
    paints.forEach((p, i) => p(ctx, i * w));
    t.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: w, frameHeight: h });
  };

  // Lamp post (16x28): stone base, wooden pole, clay oil bowl. frame 0 dark, 1 burning, 2 low flame
  const lamp = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox + 2, 27, 12, 1, PAL.z);
    rect(c, ox + 3, 23, 10, 4, PAL.A); rect(c, ox + 3, 23, 10, 1, PAL.a);
    rect(c, ox + 7, 11, 3, 12, PAL.o); rect(c, ox + 9, 11, 1, 12, PAL.O);
    rect(c, ox + 3, 8, 10, 3, PAL.t); rect(c, ox + 2, 7, 12, 2, PAL.T); rect(c, ox + 4, 10, 8, 1, PAL.T);
    if (f === 0) { rect(c, ox + 7, 6, 2, 1, PAL.I); return; }
    const h = f === 1 ? 6 : 3;
    rect(c, ox + 6, 7 - h, 4, h, PAL.f); rect(c, ox + 7, 8 - h, 2, h - 1, PAL.y); rect(c, ox + 7, 9 - h, 2, Math.max(1, h - 3), PAL.l);
  };
  sheet("gs_lamp", 16, 28, [0, 1, 2].map((f) => (c: CanvasRenderingContext2D, ox: number) => lamp(c, ox, f)));

  // Bronze mirror (16x22): post + plate, glint marks the way it faces. frames: 0 UL, 1 UR, 2 DR, 3 DL
  const mirror = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox + 3, 21, 10, 1, PAL.z);
    rect(c, ox + 4, 17, 8, 4, PAL.A); rect(c, ox + 4, 17, 8, 1, PAL.a);
    rect(c, ox + 7, 11, 2, 6, PAL.o);
    rect(c, ox + 3, 2, 10, 10, PAL.Y); rect(c, ox + 4, 3, 8, 8, PAL.y); rect(c, ox + 5, 4, 6, 6, PAL.l);
    rect(c, ox + 3, 2, 2, 1, PAL.z); rect(c, ox + 11, 2, 2, 1, PAL.z); // clipped corners
    const gx = f === 0 || f === 3 ? 5 : 9, gy = f === 0 || f === 1 ? 4 : 8;
    rect(c, ox + gx, gy, 2, 2, PAL.w);
    const ax = f === 0 || f === 3 ? 1 : 13, ay = f === 0 || f === 1 ? 0 : 12; // gold notch on the facing corner
    rect(c, ox + ax, ay, 2, 2, PAL.r);
  };
  sheet("gs_mirror", 16, 22, [0, 1, 2, 3].map((f) => (c: CanvasRenderingContext2D, ox: number) => mirror(c, ox, f)));

  // Oil jar (20x24): big clay jar with a gold drop
  const { canvas, ctx: c } = makeCanvas(20, 24);
  rect(c, 2, 23, 16, 1, PAL.z);
  rect(c, 6, 1, 8, 3, PAL.T); rect(c, 5, 3, 10, 2, PAL.t);
  rect(c, 3, 5, 14, 17, PAL.t); rect(c, 14, 5, 3, 17, PAL.T); rect(c, 5, 7, 1, 8, PAL.Q);
  rect(c, 3, 10, 14, 2, PAL.Y); rect(c, 4, 20, 12, 2, PAL.T);
  rect(c, 8, 13, 4, 5, PAL.y); rect(c, 9, 14, 2, 2, PAL.l);
  t.addCanvas("gs_oil", canvas);

  // Carried flame (8x10)
  const fl = makeCanvas(8, 10);
  rect(fl.ctx, 2, 4, 4, 6, PAL.f); rect(fl.ctx, 3, 2, 2, 3, PAL.f); rect(fl.ctx, 3, 5, 2, 5, PAL.y); rect(fl.ctx, 3, 7, 2, 2, PAL.l);
  t.addCanvas("gs_flame", fl.canvas);
}
