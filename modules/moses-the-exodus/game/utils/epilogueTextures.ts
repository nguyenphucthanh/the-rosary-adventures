import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";

/** Epilogue: dawn window (2 frames), Genesis scroll, Noah's chart, Passover door sign. Integer rects only. */
export function registerEpilogueTextures(scene: Phaser.Scene) {
  const t = scene.textures;
  if (t.exists("ep_scroll")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };

  // Dawn window 48x40, origin top-centre, 2 frames: the sun rises a step, a bird crosses
  const win = (c: CanvasRenderingContext2D, ox: number, f: number) => {
    rect(c, ox, 0, 48, 36, PAL.o);
    rect(c, ox + 3, 3, 42, 10, PAL.k); rect(c, ox + 3, 13, 42, 8, PAL.l); rect(c, ox + 3, 21, 42, 12, PAL.j);
    rect(c, ox + 18, 17 - f, 12, 4 + f, PAL.y); rect(c, ox + 20, 15 - f, 8, 2, PAL.y); rect(c, ox + 21, 17 - f, 6, 2, PAL.f);
    rect(c, ox + 8 + f * 3, 8, 3, 1, PAL.D); rect(c, ox + 11 + f * 3, 7, 2, 1, PAL.D); rect(c, ox + 6 + f * 3, 7, 2, 1, PAL.D);
    rect(c, ox + 22, 3, 4, 30, PAL.o); rect(c, ox + 3, 17, 42, 3, PAL.o);
    rect(c, ox, 33, 48, 4, PAL.O); rect(c, ox, 36, 48, 4, PAL.z);
  };
  const w = makeCanvas(96, 40);
  [0, 1].forEach((f) => win(w.ctx, f * 48, f));
  t.addSpriteSheet("ep_dawn_window", w.canvas as unknown as HTMLImageElement, { frameWidth: 48, frameHeight: 40 });

  // Genesis scroll (18x14)
  still("ep_scroll", 18, 14, (c) => {
    rect(c, 2, 13, 14, 1, PAL.z);
    rect(c, 1, 2, 16, 10, PAL.p); rect(c, 1, 11, 16, 1, PAL.P); rect(c, 0, 1, 2, 12, PAL.Y); rect(c, 16, 1, 2, 12, PAL.Y);
    for (const y of [4, 6, 8]) rect(c, 4, y, 10, 1, PAL.o);
  });

  // Noah's sea chart (20x14): ark on blue waves with a rainbow stripe
  still("ep_chart", 20, 14, (c) => {
    rect(c, 2, 13, 16, 1, PAL.z);
    rect(c, 1, 1, 18, 12, PAL.p); rect(c, 1, 12, 18, 1, PAL.P);
    rect(c, 3, 8, 14, 3, PAL.x); rect(c, 5, 9, 3, 1, PAL.w); rect(c, 11, 9, 3, 1, PAL.w);
    rect(c, 6, 6, 8, 3, PAL.o); rect(c, 8, 4, 4, 2, PAL.O);
    rect(c, 3, 2, 14, 1, PAL.r); rect(c, 4, 3, 12, 1, PAL.y); rect(c, 5, 4, 10, 1, PAL.g);
  });

  // Passover door sign (16x22): a doorpost with blood on the lintel, for the Red Sea map corner
  still("ep_door", 16, 22, (c) => {
    rect(c, 2, 21, 12, 1, PAL.z);
    rect(c, 1, 0, 14, 21, PAL.o); rect(c, 3, 4, 10, 17, PAL.O);
    rect(c, 1, 0, 14, 3, PAL.r); rect(c, 1, 3, 2, 18, PAL.r); rect(c, 13, 3, 2, 18, PAL.r);
    rect(c, 9, 12, 2, 2, PAL.y);
  });
}
