import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
import { registerBedroomTextures } from "@/modules/the-rosary-adventures/game/utils/bedroomTextureGenerator";

/** Prologue room = the same little room as the other games, at night. Adds the night window, desk lamp and map pieces (Bethlehem -> Judean Caves -> Zion). */
export function registerPrologueTextures(scene: Phaser.Scene) {
  registerBedroomTextures(scene); // floor_wood, wall_paper, bookshelf, desk, home_altar, schoolbag, book_open
  const t = scene.textures;
  if (t.exists("david_map_base")) return;
  const still = (key: string, w: number, h: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const { canvas, ctx } = makeCanvas(w, h);
    paint(ctx);
    t.addCanvas(key, canvas);
  };

  if (!t.exists("prologue_night_window")) {
    const win = (c: CanvasRenderingContext2D, ox: number, f: number) => {
      rect(c, ox, 0, 48, 36, PAL.o);
      rect(c, ox + 3, 3, 42, 15, PAL.K); rect(c, ox + 3, 18, 42, 15, PAL.L);
      rect(c, ox + 30, 6, 6, 6, PAL.l); rect(c, ox + 32, 5, 3, 1, PAL.l); rect(c, ox + 32, 12, 3, 1, PAL.l);
      rect(c, ox + 33, 7, 3, 4, PAL.K);
      [[8, 7], [16, 12], [10, 24], [37, 22], [26, 26]].forEach(([x, y], i) => {
        if ((i + f) % 2 === 0) rect(c, ox + x, y, 1, 1, PAL.w);
        else rect(c, ox + x, y, 2, 1, PAL.W);
      });
      rect(c, ox + 22, 3, 4, 30, PAL.o); rect(c, ox + 3, 17, 42, 3, PAL.o);
      rect(c, ox, 33, 48, 4, PAL.O); rect(c, ox, 36, 48, 4, PAL.z);
    };
    const w = makeCanvas(96, 40);
    [0, 1].forEach((f) => win(w.ctx, f * 48, f));
    t.addSpriteSheet("prologue_night_window", w.canvas as unknown as HTMLImageElement, { frameWidth: 48, frameHeight: 40 });
  }

  if (!t.exists("desk_lamp_off")) {
    const lamp = (c: CanvasRenderingContext2D, on: boolean) => {
      rect(c, 2, 14, 8, 2, PAL.O); rect(c, 3, 13, 6, 1, PAL.o);
      rect(c, 5, 5, 2, 8, PAL.o);
      rect(c, 2, 1, 8, 4, on ? PAL.y : PAL.Y); rect(c, 3, 0, 6, 1, on ? PAL.y : PAL.Y);
      if (on) { rect(c, 4, 5, 4, 2, PAL.l); rect(c, 3, 2, 2, 1, PAL.l); } else rect(c, 3, 2, 2, 1, PAL.u);
    };
    still("desk_lamp_off", 12, 16, (c) => lamp(c, false));
    still("desk_lamp_on", 12, 16, (c) => lamp(c, true));
  }

  // Map pieces 16x16: torn parchment with one landmark each
  const scrap = (c: CanvasRenderingContext2D) => {
    rect(c, 1, 14, 14, 2, PAL.z);
    rect(c, 1, 2, 14, 11, PAL.p); rect(c, 2, 1, 12, 1, PAL.p); rect(c, 1, 12, 14, 1, PAL.P);
    rect(c, 0, 5, 1, 2, PAL.p); rect(c, 15, 8, 1, 2, PAL.p);
  };
  still("david_map_piece_0", 16, 16, (c) => { // Bethlehem: green pasture + sheep
    scrap(c);
    rect(c, 2, 8, 12, 4, PAL.g); rect(c, 4, 7, 8, 2, PAL.G);
    rect(c, 6, 5, 4, 3, PAL.w); rect(c, 9, 5, 2, 2, PAL.i);
  });
  still("david_map_piece_1", 16, 16, (c) => { // Judean Caves: rocky cliff + cave arch
    scrap(c);
    rect(c, 3, 4, 10, 8, PAL.M); rect(c, 5, 3, 6, 2, PAL.o);
    rect(c, 6, 7, 4, 5, PAL.D); rect(c, 7, 10, 2, 2, PAL.f);
  });
  still("david_map_piece_2", 16, 16, (c) => { // Mount Zion: walled citadel + golden crown
    scrap(c);
    rect(c, 3, 6, 10, 6, PAL.a); rect(c, 3, 5, 2, 2, PAL.w); rect(c, 7, 5, 2, 2, PAL.w); rect(c, 11, 5, 2, 2, PAL.w);
    rect(c, 6, 3, 4, 2, PAL.y);
  });

  // Old map on the desk (24x18): torn with three gaps, then whole with the route from Bethlehem to Zion
  const map = (c: CanvasRenderingContext2D, done: boolean) => {
    rect(c, 2, 16, 20, 2, PAL.z);
    rect(c, 1, 2, 22, 14, PAL.p); rect(c, 1, 15, 22, 1, PAL.P);
    if (!done) {
      [[3, 4], [10, 7], [16, 4]].forEach(([x, y]) => { rect(c, x, y, 5, 5, PAL.P); rect(c, x + 1, y + 1, 3, 3, PAL.O); });
      return;
    }
    rect(c, 3, 9, 5, 4, PAL.g); rect(c, 4, 8, 3, 2, PAL.w); // Bethlehem
    rect(c, 9, 6, 6, 6, PAL.M); rect(c, 11, 8, 2, 3, PAL.D); // Judean Caves
    rect(c, 17, 6, 4, 6, PAL.a); rect(c, 18, 4, 2, 2, PAL.y); // Mount Zion
    [[8, 10], [15, 9], [16, 6]].forEach(([x, y]) => rect(c, x, y, 1, 1, PAL.r));
  };
  still("david_map_base", 24, 18, (c) => map(c, false));
  still("david_map_done", 24, 18, (c) => map(c, true));
}
