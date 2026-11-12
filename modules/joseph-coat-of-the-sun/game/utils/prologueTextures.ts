import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
// ponytail: the night room (window, desk lamp, bedroom props) is shared with King David's prologue; only the map pieces are Joseph's.
import { registerPrologueTextures as registerNightRoom } from "@/modules/king-david/game/utils/prologueTextures";

/** Prologue map pieces: Hebron (wheat) -> Egypt (Nile + pyramid) -> Goshen (green pasture + tents). */
export function registerPrologueTextures(scene: Phaser.Scene) {
  registerNightRoom(scene);
  const t = scene.textures;
  if (t.exists("joseph_map_base")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };
  const scrap = (c: CanvasRenderingContext2D) => {
    rect(c, 1, 14, 14, 2, PAL.z);
    rect(c, 1, 2, 14, 11, PAL.p); rect(c, 2, 1, 12, 1, PAL.p); rect(c, 1, 12, 14, 1, PAL.P);
    rect(c, 0, 5, 1, 2, PAL.p); rect(c, 15, 8, 1, 2, PAL.p);
  };
  still("joseph_map_piece_0", 16, 16, (c) => { // Hebron: wheat field
    scrap(c);
    rect(c, 2, 8, 12, 4, PAL.y); rect(c, 4, 6, 2, 3, PAL.l); rect(c, 8, 5, 2, 4, PAL.l); rect(c, 11, 6, 2, 3, PAL.l);
  });
  still("joseph_map_piece_1", 16, 16, (c) => { // Egypt: Nile + pyramid
    scrap(c);
    rect(c, 2, 9, 12, 3, PAL.x); rect(c, 6, 3, 2, 1, PAL.Y); rect(c, 5, 4, 4, 1, PAL.Y); rect(c, 4, 5, 6, 1, PAL.Y); rect(c, 3, 6, 8, 3, PAL.y);
  });
  still("joseph_map_piece_2", 16, 16, (c) => { // Goshen: green pasture + tent
    scrap(c);
    rect(c, 2, 8, 12, 4, PAL.g); rect(c, 6, 4, 2, 1, PAL.t); rect(c, 5, 5, 4, 1, PAL.t); rect(c, 4, 6, 6, 3, PAL.M); rect(c, 11, 7, 2, 2, PAL.w);
  });
  const map = (c: CanvasRenderingContext2D, done: boolean) => {
    rect(c, 2, 16, 20, 2, PAL.z);
    rect(c, 1, 2, 22, 14, PAL.p); rect(c, 1, 15, 22, 1, PAL.P);
    if (!done) {
      [[3, 4], [10, 7], [16, 4]].forEach(([x, y]) => { rect(c, x, y, 5, 5, PAL.P); rect(c, x + 1, y + 1, 3, 3, PAL.O); });
      return;
    }
    rect(c, 3, 9, 5, 4, PAL.y); rect(c, 4, 8, 3, 2, PAL.l); // Hebron
    rect(c, 9, 8, 6, 4, PAL.x); rect(c, 11, 5, 2, 3, PAL.Y); // Egypt
    rect(c, 17, 8, 4, 4, PAL.g); rect(c, 18, 6, 2, 2, PAL.t); // Goshen
    [[8, 10], [15, 9], [16, 9]].forEach(([x, y]) => rect(c, x, y, 1, 1, PAL.r));
  };
  still("joseph_map_base", 24, 18, (c) => map(c, false));
  still("joseph_map_done", 24, 18, (c) => map(c, true));
}
