import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/**
 * Stage 12: the golden calf camp. Gold furnace (burning / toppled), the calf on its base (whole / shattered),
 * stonecutter's bench, the rock cleft on Sinai and a dust gust. Integer rects only.
 */
export function registerCalfTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("gc_calf")) return;
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

  // Gold furnace (24x32): frame 0 burning with a smoke plume, frame 1 toppled with dead embers
  sheet("gc_forge", 24, 32, [
    (c, ox) => {
      rect(c, ox + 2, 31, 20, 1, PAL.z);
      rect(c, ox + 8, 0, 6, 3, PAL.a); rect(c, ox + 10, 3, 6, 3, PAL.W); rect(c, ox + 7, 6, 6, 3, PAL.a); // smoke plume
      rect(c, ox + 9, 10, 6, 4, PAL.t); rect(c, ox + 9, 10, 2, 4, PAL.T); // chimney
      rect(c, ox + 6, 14, 12, 3, PAL.t); rect(c, ox + 3, 17, 18, 13, PAL.t); rect(c, ox + 3, 28, 18, 3, PAL.T); rect(c, ox + 17, 17, 4, 11, PAL.T);
      rect(c, ox + 7, 20, 10, 7, PAL.e); rect(c, ox + 8, 22, 8, 5, PAL.f); rect(c, ox + 10, 23, 4, 4, PAL.y); rect(c, ox + 11, 25, 2, 2, PAL.l); // mouth of fire
      rect(c, ox + 4, 18, 12, 1, PAL.Y);
      rect(c, ox + 1, 24, 3, 3, PAL.y); rect(c, ox + 1, 24, 3, 1, PAL.l); // gold nugget
    },
    (c, ox) => {
      rect(c, ox + 2, 31, 20, 1, PAL.z);
      rect(c, ox + 2, 24, 8, 6, PAL.T); rect(c, ox + 10, 22, 11, 8, PAL.t); rect(c, ox + 14, 22, 7, 8, PAL.T); rect(c, ox + 12, 24, 5, 4, PAL.e);
      rect(c, ox + 1, 29, 5, 2, PAL.D); rect(c, ox + 17, 29, 4, 2, PAL.D); rect(c, ox + 6, 30, 3, 1, PAL.Y);
      rect(c, ox + 11, 28, 2, 1, PAL.f); rect(c, ox + 17, 27, 1, 1, PAL.f); rect(c, ox + 4, 21, 2, 1, PAL.W);
    },
  ]);

  // Golden calf on its base (34x38): frame 0 whole, frame 1 rubble and gold shards
  sheet("gc_calf", 34, 38, [
    (c, ox) => {
      rect(c, ox + 2, 37, 30, 1, PAL.z);
      rect(c, ox + 4, 25, 26, 12, PAL.a); rect(c, ox + 4, 25, 26, 2, PAL.W); rect(c, ox + 22, 27, 8, 10, PAL.A); rect(c, ox + 4, 35, 26, 2, PAL.A);
      rect(c, ox + 9, 29, 16, 3, PAL.y); rect(c, ox + 9, 29, 16, 1, PAL.l); // gold inscription band
      rect(c, ox + 8, 13, 20, 9, PAL.y); rect(c, ox + 8, 20, 20, 3, PAL.Y); rect(c, ox + 10, 13, 12, 1, PAL.l); // body
      rect(c, ox + 4, 11, 8, 8, PAL.y); rect(c, ox + 3, 17, 4, 3, PAL.Y); rect(c, ox + 5, 13, 1, 1, PAL.e); // head + eye
      rect(c, ox + 3, 8, 2, 4, PAL.l); rect(c, ox + 10, 8, 2, 4, PAL.l); rect(c, ox + 4, 7, 1, 1, PAL.l); // horns
      for (const x of [9, 13, 22, 26]) { rect(c, ox + x, 22, 3, 4, PAL.Y); rect(c, ox + x, 25, 3, 1, PAL.O); } // legs
      rect(c, ox + 28, 14, 3, 2, PAL.y); rect(c, ox + 30, 16, 2, 5, PAL.Y); // tail
    },
    (c, ox) => {
      rect(c, ox + 2, 37, 30, 1, PAL.z);
      rect(c, ox + 3, 30, 12, 7, PAL.a); rect(c, ox + 17, 32, 14, 5, PAL.a); rect(c, ox + 10, 26, 6, 5, PAL.A); rect(c, ox + 20, 28, 6, 4, PAL.A);
      rect(c, ox + 3, 30, 12, 1, PAL.W); rect(c, ox + 17, 32, 14, 1, PAL.W); rect(c, ox + 3, 35, 28, 2, PAL.A);
      rect(c, ox + 6, 27, 5, 3, PAL.y); rect(c, ox + 14, 31, 4, 3, PAL.Y); rect(c, ox + 22, 29, 5, 3, PAL.y); rect(c, ox + 25, 33, 3, 2, PAL.l); rect(c, ox + 8, 33, 2, 2, PAL.l); // gold shards
    },
  ]);

  // Stonecutter's bench (58x22): block, chisel and mallet on a wooden table
  still("gc_bench", 58, 22, (c) => {
    rect(c, 3, 21, 52, 1, PAL.z);
    rect(c, 2, 7, 54, 5, PAL.o); rect(c, 2, 7, 54, 1, PAL.Y); rect(c, 2, 11, 54, 1, PAL.O);
    rect(c, 4, 12, 4, 9, PAL.O); rect(c, 50, 12, 4, 9, PAL.O); rect(c, 8, 17, 42, 2, PAL.O);
    rect(c, 8, 2, 14, 5, PAL.a); rect(c, 8, 2, 14, 1, PAL.W); rect(c, 17, 3, 5, 4, PAL.A); // rough block
    rect(c, 30, 5, 10, 2, PAL.a); rect(c, 38, 4, 5, 1, PAL.W); rect(c, 38, 6, 5, 1, PAL.D); // chisel
    rect(c, 44, 3, 8, 4, PAL.o); rect(c, 44, 3, 8, 1, PAL.Y); rect(c, 47, 6, 2, 1, PAL.O); // mallet head
  });

  // Rock cleft on the mountain (48x48): dark opening lit from within by dawn light
  still("gc_niche", 48, 48, (c) => {
    rect(c, 3, 47, 42, 1, PAL.z);
    rect(c, 16, 0, 16, 3, PAL.a); rect(c, 8, 3, 32, 5, PAL.a); rect(c, 3, 8, 42, 8, PAL.a); rect(c, 1, 16, 46, 31, PAL.a);
    rect(c, 30, 4, 10, 4, PAL.A); rect(c, 33, 8, 14, 8, PAL.A); rect(c, 31, 16, 16, 31, PAL.A); rect(c, 1, 45, 46, 2, PAL.A);
    rect(c, 14, 3, 6, 1, PAL.W); rect(c, 6, 10, 5, 1, PAL.W);
    rect(c, 16, 22, 16, 25, PAL.e); rect(c, 14, 26, 20, 21, PAL.e); rect(c, 18, 20, 12, 2, PAL.e);
    rect(c, 19, 26, 10, 21, PAL.o); rect(c, 21, 24, 6, 2, PAL.o); rect(c, 21, 30, 6, 17, PAL.y); rect(c, 22, 33, 4, 14, PAL.l); rect(c, 23, 37, 2, 10, PAL.w); // light inside
  });

  // Whirlwind dust (20x16), 2 frames, stepped swirl of sand
  const gust = (f: number) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 4 + f * 2, 1, 12, 2, PAL.J); rect(c, ox + 2, 4, 14, 2, PAL.Q); rect(c, ox + 6 - f * 2, 7, 12, 2, PAL.J);
    rect(c, ox + 3 + f * 2, 10, 14, 2, PAL.Q); rect(c, ox + 6, 13, 10, 2, PAL.J);
    rect(c, ox + 15, 3 + f * 3, 2, 2, PAL.M); rect(c, ox + 1, 8 - f * 3, 2, 2, PAL.M);
  };
  sheet("gc_gust", 20, 16, [gust(0), gust(1)]);
}
