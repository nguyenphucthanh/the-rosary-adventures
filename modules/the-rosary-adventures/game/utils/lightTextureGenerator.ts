import * as Phaser from "phaser";
import { PAL, type PixelMap, makeCanvas, rect } from "@/modules/shared/game/utils/pixelArt";
import { fromMap } from "@/modules/the-rosary-adventures/game/utils/visitationTextureGenerator";

/** Pixel-art textures for the Mysteries of Light (stage 6 Jordan + the season warp). Integer rects + PixelMaps only. */

/** John the Baptist: dark curls + beard, bare shoulder, camel-hair wrap, rope belt, reed cross staff. No halo. */
const JOHN: PixelMap = [
  "................................",
  ".........................o......",
  ".......................ooooo....",
  ".........................o......",
  "...........hhhhhhhhhh....o......",
  "..........hhhhhhhhhhhh...o......",
  ".........hhhhhhhhhhhhhh..o......",
  ".........hhhhhhhhhhhhhh..o......",
  ".........hhhhsssssshhhh..o......",
  ".........hhhsssssssshhh..o......",
  ".........hhhsssssssshhh..o......",
  ".........hhhsssssssshhh..o......",
  ".........hhhseesseeshhh..o......",
  ".........hhhsssssssshhh..o......",
  ".........hhhhhhmmhhhhhh..o......",
  ".........hhhhhhhhhhhhhh..o......",
  "..........hhhhhhhhhhhh...o......",
  "........sssssssssuuuuuss.o......",
  "........ssssssSssuuuuuss.o......",
  "........sssssssSsuuuusss.o......",
  "........ssssssuuuuuuuuss.o......",
  "........ssPPPPPPPPPPPPss.o......",
  ".......sPPPPOOOOOOOOPPPPso......",
  ".......uuuuuuPuuuPuuuuuuuo......",
  ".......PuPuuuuPuuuuPuuPuPo......",
  "............ssS..Sss.....o......",
  "...........ssss..ssss....o......",
  "........zzzzzzzzzzzzzzzz........",
  "..........zzzzzzzzzzzz..........",
  "................................",
  "................................",
  "................................",
];
/** Jesus as an adult: chestnut hair + beard, white robe, red sash, halo ring. */
export const JESUS: PixelMap = [
  "................................",
  "................................",
  "............yyyyyyyy............",
  "..........yy........yy..........",
  ".........y..dddddddd..y.........",
  ".........yddddddddddddy.........",
  ".........hddddddddddddh.........",
  ".........hddhhhhhhhhddh.........",
  ".........hddhsssssshddh.........",
  ".........hddssssssssddh.........",
  ".........hddssssssssddh.........",
  ".........hddssssssssddh.........",
  ".........hddseesseesddh.........",
  ".........hddssssssssddh.........",
  ".........hddchsmmshcddh.........",
  ".........hdddhhhhhhdddh.........",
  ".........hdddwhhhhwdddh.........",
  "........hdddrrwwwwwwdddh........",
  "........hdddRrrwwwwWdddh........",
  "........WwwwwRrrwwwwwwwW........",
  "........WwwwwwRrrwwwwwwW........",
  "........sWwwwwwRrrwwwwWs........",
  ".......sswwwwwwwRrrwwwwss.......",
  ".......WwwwWwwwwwRRrwwwwW.......",
  ".......WWwwWwwwwwwRRwwWWW.......",
  ".......WWWWWWWWWWWWWWWWWW.......",
  ".......WWWuuWWWWWWWWuuWWW.......",
  "........zzzzzzzzzzzzzzzz........",
  "..........zzzzzzzzzzzz..........",
  "................................",
  "................................",
  "................................",
];

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

/** Big dove that carries the player between the Mysteries: front view, wings spread, symmetric (2 flap frames, 48x28 each). */
function doveBigSheet() {
  const FW = 48;
  const { canvas, ctx } = makeCanvas(FW * 2, 28);
  for (let f = 0; f < 2; f++) {
    const ox = f * FW;
    // every rect is drawn twice, mirrored around the frame centre
    const rr = (x: number, y: number, w: number, h: number, c: string) => {
      rect(ctx, ox + x, y, w, h, c);
      rect(ctx, ox + FW - x - w, y, w, h, c);
    };
    for (let i = 0; i < 9; i++) {
      // wing: stepped diagonal of feathers, raised (f=0) or swept down (f=1)
      const x = 18 - 2 * i;
      const top = f === 0 ? 9 - i : 9 + i;
      const h = 4 + Math.min(i, 3);
      rr(x, top, 3, h, PAL.w);
      rr(x, top + h - 1, 3, 1, PAL.W);
    }
    rr(21, 19, 3, 3, PAL.w); // tail fan
    rr(19, 22, 5, 2, PAL.w);
    rr(17, 24, 7, 2, PAL.W);
    rr(21, 24, 1, 2, PAL.w);
    rr(19, 9, 5, 10, PAL.w); // body
    rr(19, 17, 5, 2, PAL.W);
    rr(20, 3, 4, 6, PAL.w); // head
    rr(21, 2, 3, 1, PAL.w);
    rr(21, 5, 1, 1, PAL.e); // eyes
    rr(23, 7, 1, 2, PAL.y); // beak
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
    tex.addSpriteSheet("dove_big", doveBigSheet() as unknown as HTMLImageElement, { frameWidth: 48, frameHeight: 28 });
}
