import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "./pixelArt";
import { MARY } from "./npcTextureGenerator";
import { fromMap, recolor } from "./visitationTextureGenerator";

/** Pixel-art textures for the Mysteries of Light (stage 6 Jordan + the season warp). Integer rects + PixelMaps only. */

/** John the Baptist: camel-hair tunic, wild beard, no halo. */
const JOHN = recolor(MARY, { b: "u", B: "O", n: "O", w: "P", W: "u", y: "Y", h: "o" }).map((row, i) =>
  i === 15 ? row.replace("ssssss", "oooooo") : row
);
/** Jesus as an adult: white robe, red mantle, halo ring. */
const JESUS = recolor(MARY, { b: "w", B: "W", n: "r", w: "p", W: "P", y: "y" }, true);

/** Flat stone slab with foam: a boulder that sank into a ford cell. */
function fordStone() {
  const { canvas, ctx } = makeCanvas(32, 32);
  rect(ctx, 3, 3, 26, 26, "#e0f2fe"); // foam
  rect(ctx, 5, 5, 22, 22, "#a8adb7");
  rect(ctx, 5, 5, 22, 2, "#c9ced6");
  rect(ctx, 5, 25, 22, 2, PAL.A);
  rect(ctx, 15, 8, 1, 7, PAL.A);
  rect(ctx, 9, 17, 8, 1, PAL.A);
  rect(ctx, 21, 13, 3, 1, "#c9ced6");
  return canvas;
}

function reed() {
  const { canvas, ctx } = makeCanvas(8, 16);
  rect(ctx, 3, 4, 1, 12, PAL.G);
  rect(ctx, 2, 0, 3, 5, PAL.o);
  rect(ctx, 6, 7, 1, 9, PAL.g);
  rect(ctx, 5, 4, 3, 4, PAL.u);
  return canvas;
}

/** Big dove that carries the player between the Mysteries (2 flap frames, 40x24 each). */
function doveBigSheet() {
  const { canvas, ctx } = makeCanvas(80, 24);
  for (let f = 0; f < 2; f++) {
    const x = f * 40;
    rect(ctx, x + 8, 13, 6, 3, PAL.W); // tail
    rect(ctx, x + 6, 15, 5, 2, PAL.W);
    rect(ctx, x + 14, 10, 14, 8, PAL.w); // body
    rect(ctx, x + 12, 12, 18, 5, PAL.w);
    rect(ctx, x + 14, 16, 14, 2, PAL.W);
    rect(ctx, x + 28, 7, 6, 6, PAL.w); // head
    rect(ctx, x + 34, 9, 3, 2, PAL.y);
    rect(ctx, x + 31, 8, 1, 1, PAL.e);
    rect(ctx, x + 18, 18, 2, 3, PAL.y); // claws
    rect(ctx, x + 24, 18, 2, 3, PAL.y);
    if (f === 0) {
      rect(ctx, x + 14, 3, 10, 8, PAL.w); // wings up
      rect(ctx, x + 18, 0, 8, 4, PAL.w);
      rect(ctx, x + 14, 9, 10, 1, PAL.W);
    } else {
      rect(ctx, x + 12, 16, 12, 4, PAL.w); // wings down
      rect(ctx, x + 16, 19, 10, 3, PAL.W);
    }
  }
  return canvas;
}

/** Register every texture stage 6 and the season warp need (idempotent). */
export function registerLightTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  add("john", () => fromMap(JOHN));
  add("jesus_adult", () => fromMap(JESUS));
  add("ford_stone", fordStone);
  add("reed", reed);
  if (!tex.exists("dove_big"))
    tex.addSpriteSheet("dove_big", doveBigSheet() as unknown as HTMLImageElement, { frameWidth: 40, frameHeight: 24 });
}
