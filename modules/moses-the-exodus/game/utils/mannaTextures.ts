import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Stage 9: manna clumps of 1/2/3 omers (3 frames), carried omer basket, Aaron's golden jar. Integer rects only. */
export function registerMannaTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("mn_clump")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };

  const clump = (n: number) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 2, 14, 12, 2, PAL.z);
    if (n === 1) { rect(c, ox + 5, 10, 6, 3, PAL.w); rect(c, ox + 4, 12, 8, 2, PAL.W); rect(c, ox + 7, 10, 1, 1, PAL.l); }
    else if (n === 2) { rect(c, ox + 3, 8, 10, 4, PAL.w); rect(c, ox + 2, 11, 12, 3, PAL.W); rect(c, ox + 5, 8, 1, 1, PAL.l); rect(c, ox + 10, 10, 1, 1, PAL.l); }
    else { rect(c, ox + 6, 4, 4, 2, PAL.w); rect(c, ox + 4, 6, 8, 3, PAL.w); rect(c, ox + 2, 9, 12, 3, PAL.w); rect(c, ox + 1, 12, 14, 2, PAL.W); rect(c, ox + 7, 4, 1, 1, PAL.l); rect(c, ox + 5, 8, 1, 1, PAL.l); rect(c, ox + 11, 10, 1, 1, PAL.l); }
  };
  const { canvas, ctx } = makeCanvas(48, 16);
  [1, 2, 3].forEach((n, i) => clump(n)(ctx, i * 16));
  t.addSpriteSheet("mn_clump", canvas as unknown as HTMLImageElement, { frameWidth: 16, frameHeight: 16 });

  // Omer basket (10x12)
  still("mn_omer", 10, 12, (c) => {
    rect(c, 1, 11, 8, 1, PAL.z);
    rect(c, 1, 0, 8, 2, PAL.o); rect(c, 0, 2, 10, 9, PAL.y); rect(c, 0, 8, 10, 3, PAL.Y); rect(c, 2, 3, 2, 3, PAL.l);
  });

  // Golden jar (14x20)
  still("mn_goldjar", 14, 20, (c) => {
    rect(c, 2, 19, 10, 1, PAL.z);
    rect(c, 4, 0, 6, 3, PAL.Y); rect(c, 3, 3, 8, 2, PAL.y); rect(c, 1, 5, 12, 13, PAL.y); rect(c, 1, 13, 12, 5, PAL.Y); rect(c, 3, 6, 2, 8, PAL.l); rect(c, 3, 18, 8, 1, PAL.Y);
  });
}
