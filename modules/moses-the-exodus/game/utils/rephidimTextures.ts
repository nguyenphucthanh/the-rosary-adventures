import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Stage 10: Horeb rock (cracked variant), prayer flame (2 frames), hill mound, raised hand. Integer rects only. */
export function registerRephidimTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("rp_rock")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };

  // Horeb rock (48x40): whole (frame 0) / cracked with a dark seam (frame 1)
  const rock = (cracked: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 3, 39, 42, 1, PAL.z);
    rect(c, ox + 14, 2, 20, 3, PAL.a); rect(c, ox + 8, 5, 32, 5, PAL.a); rect(c, ox + 4, 10, 40, 8, PAL.a); rect(c, ox + 1, 18, 46, 20, PAL.a);
    rect(c, ox + 28, 8, 12, 4, PAL.A); rect(c, ox + 30, 12, 16, 8, PAL.A); rect(c, ox + 26, 20, 21, 18, PAL.A); rect(c, ox + 1, 36, 46, 2, PAL.A);
    rect(c, ox + 12, 3, 8, 1, PAL.W); rect(c, ox + 6, 7, 6, 1, PAL.W); rect(c, ox + 5, 12, 4, 1, PAL.W);
    if (cracked) {
      rect(c, ox + 22, 6, 2, 6, PAL.D); rect(c, ox + 20, 12, 2, 6, PAL.D); rect(c, ox + 22, 18, 2, 6, PAL.D); rect(c, ox + 24, 24, 2, 8, PAL.D);
      rect(c, ox + 18, 16, 2, 2, PAL.D); rect(c, ox + 26, 14, 2, 2, PAL.D);
      rect(c, ox + 23, 12, 1, 18, PAL.x);
    }
  };
  {
    const { canvas, ctx } = makeCanvas(96, 40);
    rock(false)(ctx, 0); rock(true)(ctx, 48);
    t.addSpriteSheet("rp_rock", canvas as unknown as HTMLImageElement, { frameWidth: 48, frameHeight: 40 });
  }

  // Prayer flame (10x14), 2 frames flicker
  const flame = (alt: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 2, 13, 6, 1, PAL.z);
    rect(c, ox + 3, 9, 4, 4, PAL.o); rect(c, ox + 2, 11, 6, 2, PAL.O);
    rect(c, ox + 3, alt ? 3 : 4, 4, 6, PAL.f); rect(c, ox + 2, alt ? 5 : 6, 6, 4, PAL.f);
    rect(c, ox + 4, alt ? 0 : 2, 2, 4, PAL.f); rect(c, ox + 4, alt ? 5 : 6, 2, 4, PAL.y); rect(c, ox + 4, 8, 2, 1, PAL.l);
  };
  {
    const { canvas, ctx } = makeCanvas(20, 14);
    flame(false)(ctx, 0); flame(true)(ctx, 10);
    t.addSpriteSheet("rp_flame", canvas as unknown as HTMLImageElement, { frameWidth: 10, frameHeight: 14 });
  }

  // Hill mound (96x28): stepped sand tiers
  still("rp_mound", 96, 28, (c) => {
    rect(c, 4, 27, 88, 1, PAL.z);
    rect(c, 28, 0, 40, 4, PAL.j); rect(c, 16, 4, 64, 6, PAL.j); rect(c, 6, 10, 84, 8, PAL.j); rect(c, 0, 18, 96, 9, PAL.j);
    rect(c, 56, 4, 24, 6, PAL.M); rect(c, 60, 10, 30, 8, PAL.M); rect(c, 50, 18, 46, 9, PAL.M);
    rect(c, 30, 1, 10, 1, PAL.w); rect(c, 18, 5, 8, 1, PAL.w);
  });

  // Raised hand (6x6)
  still("rp_hand", 6, 6, (c) => {
    rect(c, 1, 0, 4, 5, PAL.s); rect(c, 0, 2, 6, 3, PAL.s); rect(c, 1, 4, 4, 1, PAL.S); rect(c, 1, 1, 1, 1, PAL.w);
  });
}
