import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Stage 8: tambourine, rhythm notes, bitter/sweet pools, mud channel, dam stone (2 frames), healing log, palm. Integer rects only. */
export function registerMaraTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("mr_tambourine")) return;
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

  // Tambourine (14x14): wooden ring, skin head, gold jingles
  still("mr_tambourine", 14, 14, (c) => {
    rect(c, 3, 0, 8, 14, PAL.o); rect(c, 0, 3, 14, 8, PAL.o); rect(c, 1, 1, 12, 12, PAL.o);
    rect(c, 3, 3, 8, 8, PAL.p); rect(c, 4, 4, 6, 6, PAL.P); rect(c, 4, 4, 2, 1, PAL.w);
    rect(c, 0, 6, 2, 2, PAL.y); rect(c, 12, 6, 2, 2, PAL.y); rect(c, 6, 0, 2, 2, PAL.y); rect(c, 6, 12, 2, 2, PAL.y);
  });

  // Rhythm notes (10x10), 2 frames: gold note / pale hit-flash
  const note = (flash: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 2, 0, 6, 10, flash ? PAL.w : PAL.y); rect(c, ox, 2, 10, 6, flash ? PAL.w : PAL.y);
    rect(c, ox + 3, 1, 4, 8, flash ? PAL.l : PAL.l); rect(c, ox + 4, 2, 2, 2, PAL.w);
  };
  sheet("mr_note", 10, 10, [note(false), note(true)]);

  // Hit ring (16x16): hollow square target
  still("mr_ring", 16, 16, (c) => {
    rect(c, 2, 0, 12, 2, PAL.w); rect(c, 2, 14, 12, 2, PAL.w); rect(c, 0, 2, 2, 12, PAL.w); rect(c, 14, 2, 2, 12, PAL.w);
    rect(c, 2, 2, 2, 2, PAL.w); rect(c, 12, 2, 2, 2, PAL.w); rect(c, 2, 12, 2, 2, PAL.w); rect(c, 12, 12, 2, 2, PAL.w);
  });

  // Pools (48x24): bitter violet, sweet blue; stone rim
  const pool = (body: string, shade: string, hi: string) => (c: CanvasRenderingContext2D) => {
    rect(c, 2, 2, 44, 20, PAL.a); rect(c, 0, 5, 48, 14, PAL.a); rect(c, 4, 22, 40, 2, PAL.z);
    rect(c, 4, 4, 40, 16, body); rect(c, 2, 7, 44, 10, body);
    rect(c, 4, 15, 40, 5, shade); rect(c, 6, 18, 36, 2, shade);
    rect(c, 8, 7, 10, 1, hi); rect(c, 26, 10, 8, 1, hi); rect(c, 14, 13, 6, 1, hi);
    rect(c, 2, 2, 8, 2, PAL.A); rect(c, 38, 20, 8, 2, PAL.A);
  };
  still("mr_pool_bitter", 48, 24, pool(PAL.V, PAL.Z, PAL.v));
  still("mr_pool_sweet", 48, 24, pool(PAL.x, PAL.X, PAL.k));

  // Mud channel (12x16) tile: brown muddy water, tiles vertically
  still("mr_mud", 12, 16, (c) => {
    rect(c, 0, 0, 12, 16, PAL.u); rect(c, 0, 0, 1, 16, PAL.O); rect(c, 11, 0, 1, 16, PAL.O);
    rect(c, 3, 2, 4, 1, PAL.M); rect(c, 6, 9, 4, 1, PAL.M); rect(c, 2, 13, 3, 1, PAL.o);
  });

  // Dam stone (16x16), 2 frames: 0 open (flat, mud flows), 1 turned (tall blocking slab)
  const stone = (closed: boolean) => (c: CanvasRenderingContext2D, ox: number) => {
    rect(c, ox + 2, 15, 12, 1, PAL.z);
    if (!closed) {
      rect(c, ox + 1, 10, 14, 5, PAL.a); rect(c, ox + 1, 14, 14, 1, PAL.A); rect(c, ox + 3, 10, 4, 1, PAL.w);
    } else {
      rect(c, ox + 4, 2, 8, 13, PAL.a); rect(c, ox + 10, 2, 2, 13, PAL.A); rect(c, ox + 5, 3, 2, 1, PAL.w);
      rect(c, ox + 6, 6, 4, 1, PAL.y); rect(c, ox + 7, 5, 2, 3, PAL.y); // gold mark: guarded
    }
  };
  sheet("mr_stone", 16, 16, [stone(false), stone(true)]);

  // Healing log (16x8): pale wood with gold shine
  still("mr_log", 16, 8, (c) => {
    rect(c, 1, 7, 14, 1, PAL.z);
    rect(c, 2, 1, 12, 6, PAL.o); rect(c, 0, 2, 16, 4, PAL.o); rect(c, 2, 5, 12, 2, PAL.O);
    rect(c, 0, 3, 3, 2, PAL.j); rect(c, 13, 3, 3, 2, PAL.j); rect(c, 4, 2, 3, 1, PAL.Y); rect(c, 9, 3, 3, 1, PAL.Y);
  });

  // Date palm (24x40)
  still("mr_palm", 24, 40, (c) => {
    rect(c, 6, 39, 12, 1, PAL.z);
    rect(c, 10, 14, 4, 25, PAL.o); rect(c, 12, 14, 2, 25, PAL.O);
    for (const y of [18, 24, 30, 35]) rect(c, 10, y, 4, 1, PAL.u);
    rect(c, 8, 4, 8, 8, PAL.G);
    rect(c, 0, 6, 10, 3, PAL.g); rect(c, 14, 6, 10, 3, PAL.g); rect(c, 2, 9, 6, 3, PAL.G); rect(c, 16, 9, 6, 3, PAL.G);
    rect(c, 4, 2, 8, 3, PAL.g); rect(c, 12, 2, 8, 3, PAL.g); rect(c, 9, 0, 6, 4, PAL.g);
    rect(c, 9, 12, 2, 3, PAL.Y); rect(c, 13, 12, 2, 3, PAL.Y);
  });

  // Elim arch (24x32): two palms framing an opening, flowers
  still("mr_gate", 24, 32, (c) => {
    rect(c, 2, 31, 20, 1, PAL.z);
    rect(c, 0, 8, 6, 24, PAL.o); rect(c, 18, 8, 6, 24, PAL.o); rect(c, 4, 8, 2, 24, PAL.O); rect(c, 22, 8, 2, 24, PAL.O);
    rect(c, 0, 2, 24, 8, PAL.G); rect(c, 2, 0, 20, 4, PAL.g); rect(c, 4, 6, 16, 3, PAL.g);
    rect(c, 5, 3, 2, 2, PAL.q); rect(c, 17, 4, 2, 2, PAL.q); rect(c, 11, 1, 2, 2, PAL.y);
    rect(c, 7, 12, 10, 20, PAL.K);
    rect(c, 8, 14, 8, 18, PAL.x); rect(c, 9, 15, 2, 1, PAL.k); rect(c, 13, 20, 2, 1, PAL.k);
  });
}
