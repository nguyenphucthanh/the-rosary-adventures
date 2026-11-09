import * as Phaser from "phaser";
import { PAL, makeCanvas, rect } from "./pixelArt";
import { MARY } from "./npcTextureGenerator";
import { fromMap, recolor } from "./visitationTextureGenerator";

/** Pixel-art textures for stage 7 (Wedding at Cana). Integer rects + PixelMaps only. */

const beard = (rows: string[]) => rows.map((row, i) => (i === 15 ? row.replace("ssssss", "wwwwww") : row));

const GROOM = recolor(MARY, { b: "r", B: "R", n: "R", w: "w", W: "W", y: "Y" });
const BRIDE = recolor(MARY, { b: "w", B: "W", n: "W", w: "p", W: "P", y: "Y", h: "d" });
const STEWARD = beard(recolor(MARY, { b: "v", B: "V", n: "V", w: "y", W: "Y", y: "Y", h: "W" }));
const SERVANT = recolor(MARY, { b: "t", B: "T", n: "T", w: "P", W: "u", y: "Y" });

/** Big stone jar (chum đá). `top` is what shows in the mouth: empty dark, water, or wine. */
function stoneJar(top: string) {
  const { canvas, ctx } = makeCanvas(20, 28);
  rect(ctx, 2, 26, 16, 2, PAL.z);
  rect(ctx, 5, 1, 10, 2, "#d6d0c0"); // rim
  rect(ctx, 6, 3, 8, 3, "#b8b2a2"); // neck
  rect(ctx, 6, 2, 8, 2, top); // mouth
  rect(ctx, 4, 6, 12, 2, "#b8b2a2");
  rect(ctx, 2, 8, 16, 14, "#b8b2a2"); // belly
  rect(ctx, 4, 22, 12, 3, "#b8b2a2");
  rect(ctx, 14, 8, 4, 14, "#8f8978"); // shade
  rect(ctx, 12, 22, 4, 3, "#8f8978");
  rect(ctx, 2, 14, 16, 1, "#8f8978"); // band
  rect(ctx, 4, 10, 1, 6, "#e3ddcd"); // highlight
  rect(ctx, 6, 24, 8, 1, "#8f8978");
  return canvas;
}

/** Village well: stone ring, two posts, beam, rope and bucket. */
function well() {
  const { canvas, ctx } = makeCanvas(44, 46);
  rect(ctx, 2, 44, 40, 2, PAL.z);
  rect(ctx, 6, 0, 3, 24, PAL.O);
  rect(ctx, 35, 0, 3, 24, PAL.O);
  rect(ctx, 4, 0, 36, 4, PAL.o);
  rect(ctx, 4, 3, 36, 1, PAL.O);
  rect(ctx, 21, 4, 1, 14, PAL.u); // rope
  rect(ctx, 19, 16, 5, 4, PAL.o); // bucket
  rect(ctx, 19, 16, 5, 1, "#7dd3fc");
  rect(ctx, 2, 22, 40, 22, "#a8a29e"); // ring
  rect(ctx, 2, 22, 40, 3, "#d6d0c0");
  rect(ctx, 6, 25, 32, 5, "#3b82c4"); // water inside
  rect(ctx, 10, 26, 6, 1, "#8fd0f5");
  rect(ctx, 2, 38, 40, 6, "#8f8978");
  for (const y of [31, 37]) rect(ctx, 2, y, 40, 1, "#8f8978");
  for (const [x, y] of [[8, 31], [20, 31], [32, 31], [14, 37], [26, 37]]) rect(ctx, x, y, 1, 6, "#8f8978");
  return canvas;
}

/** Long banquet table: white cloth, cups, bread, grapes, one empty wine jug. */
function banquetTable() {
  const { canvas, ctx } = makeCanvas(72, 40);
  rect(ctx, 2, 38, 68, 2, PAL.z);
  rect(ctx, 4, 24, 4, 14, PAL.O);
  rect(ctx, 64, 24, 4, 14, PAL.O);
  rect(ctx, 0, 14, 72, 12, PAL.o);
  rect(ctx, 0, 14, 72, 2, PAL.u);
  rect(ctx, 0, 16, 72, 10, PAL.w); // cloth
  rect(ctx, 0, 24, 72, 4, PAL.W);
  for (let x = 2; x < 72; x += 6) rect(ctx, x, 26, 3, 3, PAL.W); // cloth scallops
  for (const x of [8, 22, 44, 58]) {
    rect(ctx, x, 10, 4, 5, PAL.y); // cup
    rect(ctx, x, 14, 4, 1, PAL.Y);
  }
  rect(ctx, 28, 11, 10, 4, PAL.P); // bread
  rect(ctx, 29, 11, 8, 1, PAL.p);
  for (const [x, y] of [[50, 11], [53, 11], [51, 13], [54, 13], [52, 9]]) rect(ctx, x, y, 3, 3, PAL.v);
  rect(ctx, 52, 7, 2, 2, PAL.g);
  rect(ctx, 64, 6, 5, 9, PAL.t); // empty jug
  rect(ctx, 65, 4, 3, 2, PAL.T);
  rect(ctx, 66, 7, 1, 5, "#e08a55");
  return canvas;
}

/** Hanging oil lamp (2 frames: flame high / low). */
function lampSheet() {
  const { canvas, ctx } = makeCanvas(20, 16);
  for (let f = 0; f < 2; f++) {
    const x = f * 10;
    rect(ctx, x + 4, 0, 1, 5, PAL.O);
    rect(ctx, x + 2, 5, 5, 1, PAL.Y);
    rect(ctx, x + 1, 6, 7, 4, PAL.y);
    rect(ctx, x + 6, 6, 2, 4, PAL.Y);
    rect(ctx, x + 3, 10, 3, 1, PAL.Y);
    rect(ctx, x + 4, f ? 12 : 11, 1, f ? 2 : 3, PAL.f);
    rect(ctx, x + 4, f ? 12 : 11, 1, 1, PAL.l);
  }
  return canvas;
}

function grapeVine() {
  const { canvas, ctx } = makeCanvas(32, 36);
  rect(ctx, 0, 0, 32, 2, PAL.o);
  for (const [x, y, w, h] of [[2, 2, 10, 6], [14, 2, 14, 8], [6, 8, 8, 5], [20, 10, 8, 4], [0, 2, 4, 10]]) rect(ctx, x, y, w, h, PAL.G);
  for (const [x, y, w, h] of [[4, 3, 5, 3], [16, 3, 7, 3], [8, 9, 4, 2], [22, 11, 4, 2]]) rect(ctx, x, y, w, h, PAL.g);
  for (const x of [8, 20]) {
    for (const [dx, dy] of [[0, 14], [3, 14], [-1, 17], [2, 17], [5, 17], [1, 20], [4, 20], [3, 23]]) rect(ctx, x + dx, dy, 3, 3, PAL.v);
    rect(ctx, x + 2, 13, 1, 1, PAL.V);
    rect(ctx, x + 1, 14, 1, 1, "#a78bfa");
  }
  return canvas;
}

/** Register every texture the Cana scene needs (idempotent). */
export function registerCanaTextures(scene: Phaser.Scene) {
  const tex = scene.textures;
  const add = (key: string, make: () => HTMLCanvasElement) => {
    if (!tex.exists(key)) tex.addCanvas(key, make());
  };
  for (const [k, m] of Object.entries({ groom: GROOM, bride: BRIDE, steward: STEWARD, servant: SERVANT }))
    add(k, () => fromMap(m));
  add("chum_empty", () => stoneJar("#3f3d38"));
  add("chum_water", () => stoneJar("#7dd3fc"));
  add("chum_wine", () => stoneJar("#9f1239"));
  add("cana_well", well);
  add("banquet_table", banquetTable);
  add("grape_vine", grapeVine);
  if (!tex.exists("cana_lamp"))
    tex.addSpriteSheet("cana_lamp", lampSheet() as unknown as HTMLImageElement, { frameWidth: 10, frameHeight: 16 });
}
