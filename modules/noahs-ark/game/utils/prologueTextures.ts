import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
import { registerBedroomTextures } from "@/modules/the-rosary-adventures/game/utils/bedroomTextureGenerator";
import { paintRainbow } from "@/modules/noahs-ark/game/utils/noahTextures";

/** Prologue room = the same little room as the other games, in afternoon rain. Reuses its furniture textures. */
export function registerPrologueTextures(scene: Phaser.Scene) {
  registerBedroomTextures(scene); // floor_wood, wall_paper, bookshelf, desk, home_altar, schoolbag, book_open
  const t = scene.textures;
  if (t.exists("rain_window")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };

  // Window (origin top-centre): wood frame, sky, bars, sill. Frame 0/1 of the rainy one differ in drop positions.
  const window_ = (c: CanvasRenderingContext2D, ox: number, sky: string[], drops: number, clear: boolean) => {
    rect(c, ox, 0, 48, 36, PAL.o);
    rect(c, ox + 3, 3, 42, 15, sky[0]); rect(c, ox + 3, 18, 42, 15, sky[1]);
    if (clear) { c.save(); c.beginPath(); c.rect(ox + 3, 3, 42, 30); c.clip(); c.translate(ox, 0); paintRainbow(c, 24, 36, 24, 2); c.restore(); }
    else for (let i = 0; i < 9; i++) rect(c, ox + 5 + ((i * 11 + drops * 3) % 38), 4 + ((i * 7 + drops * 9) % 24), 1, 3, PAL.k);
    rect(c, ox + 22, 3, 4, 30, PAL.o); rect(c, ox + 3, 17, 42, 3, PAL.o);
    rect(c, ox, 33, 48, 4, PAL.O); rect(c, ox, 36, 48, 4, PAL.z);
    if (!clear) { rect(c, ox + 6, 34, 4, 2, PAL.x); rect(c, ox + 32, 34, 6, 2, PAL.x); } // puddles on the wet sill
  };
  const rainy = makeCanvas(96, 40);
  [0, 1].forEach((f) => window_(rainy.ctx, f * 48, [PAL.i, PAL.I], f, false));
  t.addSpriteSheet("rain_window", rainy.canvas as unknown as HTMLImageElement, { frameWidth: 48, frameHeight: 40 });
  still("rainbow_window", 48, 40, (c) => window_(c, 0, [PAL.k, "#e0f2fe"], 0, true));

  // Model ark pieces (16x16): hull, roof, door
  still("ark_piece_0", 16, 16, (c) => {
    rect(c, 1, 14, 14, 2, PAL.z);
    for (let r = 0; r < 7; r++) rect(c, 1 + (r >> 1), 6 + r, 14 - r, 1, r < 2 ? PAL.u : r % 2 ? PAL.O : PAL.o);
    rect(c, 1, 5, 14, 1, PAL.y);
  });
  still("ark_piece_1", 16, 16, (c) => {
    rect(c, 1, 14, 14, 2, PAL.z);
    rect(c, 6, 4, 4, 2, PAL.u); rect(c, 4, 6, 8, 2, PAL.u); rect(c, 2, 8, 12, 2, PAL.u); rect(c, 1, 10, 14, 2, PAL.O); rect(c, 6, 4, 4, 1, PAL.y);
  });
  still("ark_piece_2", 16, 16, (c) => {
    rect(c, 3, 14, 10, 2, PAL.z);
    rect(c, 4, 3, 8, 11, PAL.O); rect(c, 5, 2, 6, 1, PAL.O); rect(c, 5, 4, 6, 10, PAL.o); rect(c, 8, 4, 1, 10, PAL.O); rect(c, 10, 9, 1, 2, PAL.y);
  });

  // Ark model on the desk (24x18): empty cradle, then complete
  const model = (c: CanvasRenderingContext2D, done: boolean) => {
    rect(c, 3, 16, 18, 2, PAL.z);
    rect(c, 5, 15, 3, 2, PAL.O); rect(c, 16, 15, 3, 2, PAL.O); // cradle feet
    if (!done) { rect(c, 2, 13, 20, 2, PAL.O); rect(c, 4, 14, 16, 1, PAL.o); return; }
    for (let r = 0; r < 6; r++) rect(c, 1 + (r >> 1), 9 + r, 22 - r, 1, r < 2 ? PAL.u : r % 2 ? PAL.O : PAL.o);
    rect(c, 1, 8, 22, 1, PAL.y);
    rect(c, 5, 3, 14, 5, PAL.o); rect(c, 4, 2, 16, 2, PAL.u); rect(c, 7, 0, 10, 2, PAL.u);
    rect(c, 7, 5, 2, 2, PAL.l); rect(c, 15, 5, 2, 2, PAL.l); rect(c, 11, 4, 3, 4, PAL.O);
  };
  still("ark_model_base", 24, 18, (c) => model(c, false));
  still("ark_model_done", 24, 18, (c) => model(c, true));
}
