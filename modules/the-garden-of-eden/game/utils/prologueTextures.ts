import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
import { registerBedroomTextures } from "@/modules/the-rosary-adventures/game/utils/bedroomTextureGenerator";

/** Prologue = the same little room as the Rosary adventure, in morning light. Reuses its furniture textures. */
export function registerPrologueTextures(scene: Phaser.Scene) {
  registerBedroomTextures(scene); // floor_wood, wall_paper, bookshelf, desk, home_altar, book_open, book_closed
  const t = scene.textures;
  const add = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    if (t.exists(key)) return;
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };

  // Sunny window (origin top-centre): wood frame, sky, cross bars, sill
  add("morning_window", 48, 40, (c) => {
    rect(c, 0, 0, 48, 36, PAL.o); rect(c, 3, 3, 42, 30, PAL.k);
    rect(c, 8, 8, 8, 1, PAL.w); rect(c, 10, 7, 6, 1, PAL.w); rect(c, 30, 16, 10, 1, PAL.w); rect(c, 33, 15, 6, 1, PAL.w); // clouds
    rect(c, 34, 5, 6, 6, PAL.y); rect(c, 35, 6, 4, 4, PAL.l); // sun
    rect(c, 22, 3, 4, 30, PAL.o); rect(c, 3, 17, 42, 3, PAL.o);
    rect(c, 0, 33, 48, 4, PAL.O); rect(c, 0, 36, 48, 4, PAL.z);
  });

  const pot = (c: CanvasRenderingContext2D) => {
    rect(c, 3, 16, 10, 7, PAL.t); rect(c, 2, 14, 12, 3, PAL.T); rect(c, 4, 22, 8, 2, PAL.T);
    rect(c, 3, 14, 10, 1, PAL.O); // soil
  };
  add("plant_sprout", 16, 24, (c) => {
    pot(c);
    rect(c, 8, 9, 1, 5, PAL.G); rect(c, 6, 9, 2, 2, PAL.g); rect(c, 9, 8, 2, 2, PAL.g);
  });
  add("plant_bloom", 16, 24, (c) => {
    pot(c);
    rect(c, 8, 4, 1, 10, PAL.G); rect(c, 4, 9, 4, 2, PAL.g); rect(c, 9, 7, 4, 2, PAL.g); rect(c, 5, 11, 3, 2, PAL.G);
    rect(c, 6, 1, 5, 1, PAL.w); rect(c, 5, 2, 7, 3, PAL.w); rect(c, 6, 5, 5, 1, PAL.w); rect(c, 7, 3, 3, 1, PAL.y);
  });

  add("watering_can", 14, 12, (c) => {
    rect(c, 2, 4, 8, 7, PAL.b); rect(c, 2, 9, 8, 2, PAL.B); rect(c, 3, 2, 6, 2, PAL.B);
    rect(c, 10, 3, 3, 1, PAL.b); rect(c, 11, 2, 2, 1, PAL.b); rect(c, 12, 1, 2, 1, PAL.B); // spout
    rect(c, 0, 5, 2, 4, PAL.B); // handle
  });

  // Three bookmark pieces: red / pink / gold ribbons with a notch
  ([PAL.r, PAL.q, PAL.y] as const).forEach((col, i) =>
    add(`bookmark_${i}`, 8, 14, (c) => {
      rect(c, 1, 0, 6, 14, col); rect(c, 1, 12, 2, 2, PAL.o); rect(c, 5, 12, 2, 2, PAL.o); // notched tail
      rect(c, 3, 3, 2, 2, PAL.w); rect(c, 2, 6, 4, 1, PAL.w);
    })
  );
}
