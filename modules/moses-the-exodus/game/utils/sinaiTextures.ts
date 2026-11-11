import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/**
 * Stage 11: Mount Sinai. Storm-cloud strip (calm / lightning), boundary marker (site / planted post),
 * stone step tile, glowing commandment slab, big covenant stone. Integer rects only.
 */
export function registerSinaiTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("sn_cloud")) return;
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

  // Storm cloud tile (20x14), tiles sideways. Frame 0 = dark cloud, frame 1 = cloud with lightning + holy fire
  const cloud = (bolt: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox, 3, 20, 9, PAL.i); rect(c, ox + 2, 1, 7, 3, PAL.i); rect(c, ox + 11, 0, 7, 4, PAL.i);
    rect(c, ox, 9, 20, 3, PAL.I); rect(c, ox + 4, 12, 12, 2, PAL.I);
    rect(c, ox + 3, 2, 4, 1, PAL.W); rect(c, ox + 12, 1, 4, 1, PAL.W);
    if (bolt) {
      rect(c, ox + 8, 0, 4, 3, PAL.l); rect(c, ox + 6, 3, 4, 3, PAL.y); rect(c, ox + 9, 6, 3, 3, PAL.l); rect(c, ox + 7, 9, 3, 4, PAL.f);
      rect(c, ox + 0, 11, 3, 3, PAL.f); rect(c, ox + 17, 11, 3, 3, PAL.f);
    }
  };
  sheet("sn_cloud", 20, 14, [cloud(false), cloud(true)]);

  // Boundary marker (12x26): frame 0 = glowing ring where it goes, frame 1 = planted post with a white cord flag
  sheet("sn_marker", 12, 26, [
    (c, ox) => {
      rect(c, ox + 1, 22, 10, 3, PAL.l); rect(c, ox + 2, 21, 8, 1, PAL.y); rect(c, ox + 2, 25, 8, 1, PAL.Y);
      rect(c, ox + 5, 17, 2, 4, PAL.l); rect(c, ox + 3, 18, 6, 1, PAL.y);
    },
    (c, ox) => {
      rect(c, ox + 2, 24, 8, 1, PAL.z);
      rect(c, ox + 5, 4, 2, 21, PAL.o); rect(c, ox + 6, 4, 1, 21, PAL.O);
      rect(c, ox + 3, 22, 6, 3, PAL.A); rect(c, ox + 3, 22, 6, 1, PAL.a);
      rect(c, ox + 7, 5, 5, 5, PAL.w); rect(c, ox + 7, 8, 5, 2, PAL.W); rect(c, ox + 9, 6, 1, 3, PAL.y);
      rect(c, ox + 4, 2, 4, 2, PAL.y);
    },
  ]);

  // Stone step (16x16) for the climbing path
  still("sn_step", 16, 16, (c) => {
    rect(c, 0, 0, 16, 16, PAL.a);
    rect(c, 0, 7, 16, 1, PAL.A); rect(c, 0, 15, 16, 1, PAL.A);
    rect(c, 0, 0, 16, 1, PAL.W); rect(c, 0, 8, 16, 1, PAL.W);
    rect(c, 4, 3, 2, 1, PAL.A); rect(c, 11, 11, 2, 1, PAL.A);
  });

  // Glowing commandment slab (14x18), arched top
  still("sn_slab", 14, 18, (c) => {
    rect(c, 2, 17, 10, 1, PAL.z);
    rect(c, 4, 0, 6, 1, PAL.w); rect(c, 2, 1, 10, 1, PAL.w); rect(c, 1, 2, 12, 14, PAL.w); rect(c, 2, 16, 10, 1, PAL.W);
    rect(c, 1, 11, 12, 5, PAL.p); rect(c, 2, 16, 10, 1, PAL.P);
    rect(c, 4, 4, 6, 1, PAL.y); rect(c, 4, 7, 6, 1, PAL.y); rect(c, 4, 10, 4, 1, PAL.y);
    rect(c, 3, 2, 2, 1, PAL.l);
  });

  // Big covenant stone (44x64), arched top, no carving (carving rows are drawn by the scene)
  still("sn_bia", 44, 64, (c) => {
    rect(c, 3, 63, 38, 1, PAL.z);
    rect(c, 14, 0, 16, 2, PAL.W); rect(c, 8, 2, 28, 2, PAL.W); rect(c, 4, 4, 36, 3, PAL.W); rect(c, 2, 7, 40, 55, PAL.W);
    rect(c, 15, 2, 14, 2, PAL.a); rect(c, 10, 4, 24, 3, PAL.a); rect(c, 6, 7, 32, 54, PAL.a);
    rect(c, 6, 7, 32, 1, PAL.W); rect(c, 34, 8, 4, 53, PAL.A); rect(c, 6, 59, 32, 2, PAL.A);
    rect(c, 18, 2, 6, 1, PAL.w); rect(c, 8, 9, 3, 1, PAL.w);
  });
}
